import Fuse from 'fuse.js';
import { ExerciseDefinition } from '@/types';
import { exerciseDatabase } from '@/data/exerciseDatabase';

export interface ExerciseMatch {
  exercise: ExerciseDefinition;
  score: number; // 0-1, where 1 is perfect match
  matchedAlias?: string;
}

export class ExerciseMatchingService {
  private fuse: Fuse<ExerciseDefinition>;
  private aliasSearchFuse: Fuse<{exercise: ExerciseDefinition, alias: string}>;

  constructor() {
    // Configure Fuse.js for fuzzy matching
    const fuseOptions = {
      keys: ['name', 'aliases'],
      includeScore: true,
      threshold: 0.4, // 0 = perfect match, 1 = match anything
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
    };

    this.fuse = new Fuse(exerciseDatabase, fuseOptions);

    // Create a separate index for alias matching
    const aliasData = exerciseDatabase.flatMap(exercise =>
      [exercise.name, ...exercise.aliases].map(alias => ({
        exercise,
        alias: alias.toLowerCase(),
      }))
    );

    this.aliasSearchFuse = new Fuse(aliasData, {
      keys: ['alias'],
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
    });
  }

  /**
   * Find the best matching exercise for a given search term
   */
  findBestMatch(searchTerm: string): ExerciseMatch | null {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return null;
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = this.findExactMatch(normalizedTerm);
    if (exactMatch) {
      return {
        exercise: exactMatch.exercise,
        score: 1.0,
        matchedAlias: exactMatch.matchedAlias,
      };
    }

    // Try fuzzy matching
    const fuzzyMatches = this.fuse.search(normalizedTerm);
    if (fuzzyMatches.length > 0) {
      const bestMatch = fuzzyMatches[0];
      return {
        exercise: bestMatch.item,
        score: 1 - (bestMatch.score || 0), // Convert Fuse score to our score
      };
    }

    return null;
  }

  /**
   * Find multiple potential matches for a search term
   */
  findMultipleMatches(searchTerm: string, limit: number = 5): ExerciseMatch[] {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Get fuzzy matches
    const fuzzyMatches = this.fuse.search(normalizedTerm, { limit });
    
    return fuzzyMatches.map(match => ({
      exercise: match.item,
      score: 1 - (match.score || 0),
    }));
  }

  /**
   * Find exact match in names or aliases
   */
  private findExactMatch(searchTerm: string): { exercise: ExerciseDefinition; matchedAlias?: string } | null {
    const normalizedTerm = searchTerm.toLowerCase();

    for (const exercise of exerciseDatabase) {
      // Check exact name match
      if (exercise.name.toLowerCase() === normalizedTerm) {
        return { exercise };
      }

      // Check exact alias match
      for (const alias of exercise.aliases) {
        if (alias.toLowerCase() === normalizedTerm) {
          return { exercise, matchedAlias: alias };
        }
      }
    }

    return null;
  }

  /**
   * Parse exercise names from natural language text
   */
  parseExercisesFromText(text: string): ExerciseMatch[] {
    const words = text.toLowerCase().split(/\s+/);
    const matches: ExerciseMatch[] = [];
    
    // Try different n-gram combinations
    for (let i = 0; i < words.length; i++) {
      // Try 1-4 word combinations starting at position i
      for (let length = 1; length <= Math.min(4, words.length - i); length++) {
        const phrase = words.slice(i, i + length).join(' ');
        const match = this.findBestMatch(phrase);
        
        if (match && match.score > 0.7) {
          // Check if we already found this exercise
          const existingMatch = matches.find(m => m.exercise.id === match.exercise.id);
          if (!existingMatch || match.score > existingMatch.score) {
            if (existingMatch) {
              matches.splice(matches.indexOf(existingMatch), 1);
            }
            matches.push(match);
          }
        }
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Get popular exercises by category
   */
  getPopularExercises(category?: ExerciseDefinition['category'], limit: number = 10): ExerciseDefinition[] {
    let exercises = exerciseDatabase;
    
    if (category) {
      exercises = exercises.filter(ex => ex.category === category);
    }

    // For now, return exercises sorted by difficulty (beginners first)
    // In a real app, you might track usage statistics
    return exercises
      .sort((a, b) => {
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
        return difficultyOrder[a.difficultyLevel] - difficultyOrder[b.difficultyLevel];
      })
      .slice(0, limit);
  }

  /**
   * Get exercise suggestions based on muscle groups worked
   */
  getSuggestedExercises(muscleGroups: string[], excludeIds: string[] = []): ExerciseDefinition[] {
    return exerciseDatabase
      .filter(exercise => 
        !excludeIds.includes(exercise.id) &&
        exercise.muscleGroups.some(group => 
          muscleGroups.some(targetGroup => 
            group.toLowerCase().includes(targetGroup.toLowerCase())
          )
        )
      )
      .slice(0, 5);
  }

  /**
   * Get complementary exercises (opposite muscle groups)
   */
  getComplementaryExercises(exerciseIds: string[]): ExerciseDefinition[] {
    const muscleGroupPairs = {
      'chest': ['back'],
      'back': ['chest'],
      'biceps': ['triceps'],
      'triceps': ['biceps'],
      'quadriceps': ['hamstrings'],
      'hamstrings': ['quadriceps'],
      'shoulders': ['lats'],
    };

    const currentMuscleGroups = exerciseIds
      .map(id => exerciseDatabase.find(ex => ex.id === id))
      .filter(Boolean)
      .flatMap(ex => ex!.muscleGroups);

    const complementaryGroups = currentMuscleGroups
      .flatMap(group => muscleGroupPairs[group as keyof typeof muscleGroupPairs] || [])
      .filter((group, index, self) => self.indexOf(group) === index); // Remove duplicates

    return this.getSuggestedExercises(complementaryGroups, exerciseIds);
  }
}

// Export singleton instance
export const exerciseMatchingService = new ExerciseMatchingService();