import { Workout, Exercise, ExerciseSet, VoiceRecognitionResult, CoachRecommendation } from '@/types';
import { databaseService } from '@/services/storage/DatabaseService';
import { settingsService } from '@/services/storage/SettingsService';
import { exerciseDatabase } from '@/data/exerciseDatabase';

export interface WorkoutSession {
  workout: Workout;
  currentExercise?: Exercise;
  isActive: boolean;
  startTime: Date;
  elapsedTime: number; // in seconds
}

export class WorkoutSessionService {
  private currentSession: WorkoutSession | null = null;
  private intervalId: any = null;
  private listeners: Array<(session: WorkoutSession | null) => void> = [];

  // Create a new workout session
  async startNewWorkout(): Promise<WorkoutSession> {
    const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = new Date();

    const workout: Workout = {
      id: workoutId,
      date: now,
      startTime: now,
      exercises: [],
      muscleGroups: [],
      coachRecommendations: [],
      coachInsights: [],
      isCompleted: false,
      isSynced: false,
    };

    this.currentSession = {
      workout,
      isActive: true,
      startTime: now,
      elapsedTime: 0,
    };

    // Start timer
    this.startTimer();

    // Notify listeners
    this.notifyListeners();

    console.log('New workout session started:', workoutId);
    return this.currentSession;
  }

  // Get current active session
  getCurrentSession(): WorkoutSession | null {
    return this.currentSession;
  }

  // Add exercise from voice recognition result
  async addExerciseFromVoiceResult(result: VoiceRecognitionResult): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    for (const parsedExercise of result.exercises) {
      // Find exercise definition
      const exerciseDefinition = exerciseDatabase.find(ex => ex.id === parsedExercise.exerciseId);
      if (!exerciseDefinition) {
        console.warn('Exercise definition not found:', parsedExercise.exerciseId);
        continue;
      }

      // Create exercise
      const exerciseId = `exercise_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const exercise: Exercise = {
        id: exerciseId,
        name: parsedExercise.name,
        sets: parsedExercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          restTime: set.restTime,
        })),
        muscleGroups: exerciseDefinition.muscleGroups,
        category: exerciseDefinition.category,
        equipment: exerciseDefinition.equipment,
        totalDuration: parsedExercise.totalDuration,
        distance: parsedExercise.distance,
      };

      // Add to current workout
      this.currentSession.workout.exercises.push(exercise);
      this.currentSession.currentExercise = exercise;

      // Update muscle groups
      const allMuscleGroups = new Set([
        ...this.currentSession.workout.muscleGroups,
        ...exercise.muscleGroups,
      ]);
      this.currentSession.workout.muscleGroups = Array.from(allMuscleGroups);

      console.log('Added exercise to workout:', exercise.name);
    }

    // Auto-save if enabled
    const settings = await settingsService.getSettings();
    if (settings.autoSaveMode) {
      await this.saveCurrentWorkout();
    }

    this.notifyListeners();
  }

  // Manually add an exercise
  async addExercise(exercise: Exercise): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    this.currentSession.workout.exercises.push(exercise);
    this.currentSession.currentExercise = exercise;

    // Update muscle groups
    const allMuscleGroups = new Set([
      ...this.currentSession.workout.muscleGroups,
      ...exercise.muscleGroups,
    ]);
    this.currentSession.workout.muscleGroups = Array.from(allMuscleGroups);

    // Auto-save if enabled
    const settings = await settingsService.getSettings();
    if (settings.autoSaveMode) {
      await this.saveCurrentWorkout();
    }

    this.notifyListeners();
  }

  // Update an existing exercise
  async updateExercise(exerciseId: string, updates: Partial<Exercise>): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    const exerciseIndex = this.currentSession.workout.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found in current workout');
    }

    // Update exercise
    this.currentSession.workout.exercises[exerciseIndex] = {
      ...this.currentSession.workout.exercises[exerciseIndex],
      ...updates,
    };

    // Recalculate muscle groups
    const allMuscleGroups = new Set(
      this.currentSession.workout.exercises.flatMap(ex => ex.muscleGroups)
    );
    this.currentSession.workout.muscleGroups = Array.from(allMuscleGroups);

    // Auto-save if enabled
    const settings = await settingsService.getSettings();
    if (settings.autoSaveMode) {
      await this.saveCurrentWorkout();
    }

    this.notifyListeners();
  }

  // Remove an exercise
  async removeExercise(exerciseId: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    this.currentSession.workout.exercises = this.currentSession.workout.exercises.filter(
      ex => ex.id !== exerciseId
    );

    // Recalculate muscle groups
    const allMuscleGroups = new Set(
      this.currentSession.workout.exercises.flatMap(ex => ex.muscleGroups)
    );
    this.currentSession.workout.muscleGroups = Array.from(allMuscleGroups);

    // Auto-save if enabled
    const settings = await settingsService.getSettings();
    if (settings.autoSaveMode) {
      await this.saveCurrentWorkout();
    }

    this.notifyListeners();
  }

  // Add a set to an exercise
  async addSetToExercise(exerciseId: string, set: ExerciseSet): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    const exercise = this.currentSession.workout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) {
      throw new Error('Exercise not found in current workout');
    }

    exercise.sets.push(set);

    // Auto-save if enabled
    const settings = await settingsService.getSettings();
    if (settings.autoSaveMode) {
      await this.saveCurrentWorkout();
    }

    this.notifyListeners();
  }

  // Complete the current workout
  async completeWorkout(): Promise<Workout> {
    if (!this.currentSession) {
      throw new Error('No active workout session');
    }

    // Set end time and mark as completed
    this.currentSession.workout.endTime = new Date();
    this.currentSession.workout.isCompleted = true;

    // Generate coach recommendations
    await this.generateCoachRecommendations();

    // Save the completed workout
    await this.saveCurrentWorkout();

    // Stop timer
    this.stopTimer();

    const completedWorkout = this.currentSession.workout;
    this.currentSession = null;

    this.notifyListeners();

    console.log('Workout completed:', completedWorkout.id);
    return completedWorkout;
  }

  // Cancel the current workout
  async cancelWorkout(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    // Optionally delete the workout from database if it was auto-saved
    try {
      await databaseService.deleteWorkout(this.currentSession.workout.id);
    } catch (error) {
      // Ignore errors - workout might not have been saved yet
    }

    this.stopTimer();
    this.currentSession = null;
    this.notifyListeners();

    console.log('Workout cancelled');
  }

  // Save current workout to database
  private async saveCurrentWorkout(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      await databaseService.saveWorkout(this.currentSession.workout);
      console.log('Workout saved to database');
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  }

  // Generate coach recommendations based on the workout
  private async generateCoachRecommendations(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    const recommendations: CoachRecommendation[] = [];
    const workout = this.currentSession.workout;

    // Hydration recommendation
    recommendations.push({
      id: `rec_hydration_${Date.now()}`,
      type: 'recovery',
      category: 'immediate',
      message: 'Drink 16-20 oz of water within the next 30 minutes to support recovery.',
      priority: 'high',
      timeframe: 'within 30 minutes',
    });

    // Movement recommendation
    recommendations.push({
      id: `rec_movement_${Date.now() + 1}`,
      type: 'recovery',
      category: 'immediate', 
      message: 'Take a 5-10 minute walk to help your body cool down properly.',
      priority: 'medium',
      timeframe: 'within 15 minutes',
    });

    // Sleep recommendation
    recommendations.push({
      id: `rec_sleep_${Date.now() + 2}`,
      type: 'rest',
      category: 'long-term',
      message: 'Aim for 7-9 hours of sleep tonight to maximize your recovery.',
      priority: 'medium',
      timeframe: 'tonight',
    });

    // Protein recommendation if strength training
    const hasStrengthTraining = workout.exercises.some(ex => ex.category === 'strength');
    if (hasStrengthTraining) {
      recommendations.push({
        id: `rec_protein_${Date.now() + 3}`,
        type: 'nutrition',
        category: 'immediate',
        message: 'Consider 25-30g of protein within 30 minutes to support muscle recovery.',
        priority: 'medium',
        timeframe: 'within 30 minutes',
      });
    }

    // Add coach insights
    const insights: string[] = [];
    
    if (workout.exercises.length === 0) {
      insights.push("Great job showing up today! Even without logging exercises, your commitment matters.");
    } else {
      insights.push(`Excellent work! You completed ${workout.exercises.length} exercise${workout.exercises.length > 1 ? 's' : ''} today.`);
      
      if (workout.muscleGroups.length > 1) {
        insights.push(`You worked multiple muscle groups: ${workout.muscleGroups.join(', ')}. Great full-body approach!`);
      }
    }

    const workoutDuration = workout.endTime && workout.startTime 
      ? Math.round((workout.endTime.getTime() - workout.startTime.getTime()) / 1000 / 60)
      : null;

    if (workoutDuration) {
      if (workoutDuration >= 60) {
        insights.push(`Your ${workoutDuration}-minute session shows impressive dedication!`);
      } else if (workoutDuration >= 30) {
        insights.push(`A solid ${workoutDuration}-minute workout - perfect for building consistency!`);
      } else {
        insights.push(`Even a ${workoutDuration}-minute workout makes a difference. Consistency is key!`);
      }
    }

    // Assign recommendations and insights
    this.currentSession.workout.coachRecommendations = recommendations;
    this.currentSession.workout.coachInsights = insights;
  }

  // Timer management
  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    
    this.intervalId = setInterval(() => {
      if (this.currentSession) {
        this.currentSession.elapsedTime = Math.floor(
          (Date.now() - this.currentSession.startTime.getTime()) / 1000
        );
        this.notifyListeners();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Listener management
  addListener(listener: (session: WorkoutSession | null) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentSession));
  }

  // Get workout statistics
  getWorkoutStats(): {
    totalExercises: number;
    totalSets: number;
    totalVolume: number; // weight * reps
    duration: number; // in minutes
  } {
    if (!this.currentSession) {
      return { totalExercises: 0, totalSets: 0, totalVolume: 0, duration: 0 };
    }

    const { exercises } = this.currentSession.workout;
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalVolume = exercises.reduce((volume, ex) => {
      return volume + ex.sets.reduce((setVolume, set) => {
        return setVolume + ((set.weight || 0) * (set.reps || 0));
      }, 0);
    }, 0);

    const duration = Math.floor(this.currentSession.elapsedTime / 60);

    return {
      totalExercises: exercises.length,
      totalSets,
      totalVolume,
      duration,
    };
  }
}

export const workoutSessionService = new WorkoutSessionService();