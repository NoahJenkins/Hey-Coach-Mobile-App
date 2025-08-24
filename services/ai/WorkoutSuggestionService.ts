import { OpenRouterService, ChatMessage } from './OpenRouterService';

/**
 * Service for generating AI-powered workout suggestions
 */
export class WorkoutSuggestionService {
  private aiService: OpenRouterService;

  constructor(openRouterService: OpenRouterService) {
    this.aiService = openRouterService;
  }

  /**
   * Generate personalized workout suggestions based on user preferences
   */
  async generateWorkoutSuggestions(
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
    goals: string[],
    availableEquipment: string[],
    timeAvailable: number, // in minutes
    daysPerWeek: number
  ): Promise<string> {
    const prompt = this.buildWorkoutPrompt(
      fitnessLevel,
      goals,
      availableEquipment,
      timeAvailable,
      daysPerWeek
    );

    try {
      const response = await this.aiService.generateText(prompt, 'openai/gpt-4o', {
        temperature: 0.7,
        maxTokens: 1000,
      });

      return response;
    } catch (error) {
      console.error('Failed to generate workout suggestions:', error);
      return this.getFallbackSuggestions(fitnessLevel, goals);
    }
  }

  /**
   * Generate a personalized workout plan for a specific day
   */
  async generateDailyWorkout(
    dayNumber: number,
    totalDays: number,
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
    focus: string, // e.g., "upper body", "lower body", "full body"
    availableEquipment: string[],
    timeAvailable: number
  ): Promise<string> {
    const prompt = this.buildDailyWorkoutPrompt(
      dayNumber,
      totalDays,
      fitnessLevel,
      focus,
      availableEquipment,
      timeAvailable
    );

    try {
      const response = await this.aiService.generateText(prompt, 'openai/gpt-4o', {
        temperature: 0.7,
        maxTokens: 800,
      });

      return response;
    } catch (error) {
      console.error('Failed to generate daily workout:', error);
      return this.getFallbackDailyWorkout(focus, fitnessLevel);
    }
  }

  /**
   * Get exercise recommendations based on muscle groups
   */
  async getExerciseRecommendations(
    targetMuscleGroups: string[],
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
    availableEquipment: string[]
  ): Promise<string> {
    const prompt = this.buildExerciseRecommendationPrompt(
      targetMuscleGroups,
      fitnessLevel,
      availableEquipment
    );

    try {
      const response = await this.aiService.generateText(prompt, 'openai/gpt-4o', {
        temperature: 0.6,
        maxTokens: 600,
      });

      return response;
    } catch (error) {
      console.error('Failed to get exercise recommendations:', error);
      return this.getFallbackExerciseRecommendations(targetMuscleGroups);
    }
  }

  /**
   * Build a structured workout prompt
   */
  private buildWorkoutPrompt(
    fitnessLevel: string,
    goals: string[],
    availableEquipment: string[],
    timeAvailable: number,
    daysPerWeek: number
  ): string {
    return `As a professional fitness trainer, create a personalized workout plan for a ${fitnessLevel} level client.

CLIENT INFORMATION:
- Fitness Level: ${fitnessLevel}
- Goals: ${goals.join(', ')}
- Available Equipment: ${availableEquipment.join(', ')}
- Time Available per Session: ${timeAvailable} minutes
- Days per Week: ${daysPerWeek}

Please provide a comprehensive workout plan that includes:
1. Weekly schedule overview
2. Exercise recommendations for each day
3. Sets and reps appropriate for their level
4. Rest periods between exercises
5. Warm-up and cool-down recommendations
6. Progress tracking suggestions

Ensure the plan is realistic, safe, and progressive. Consider any limitations based on available equipment.`;
  }

  /**
   * Build a daily workout prompt
   */
  private buildDailyWorkoutPrompt(
    dayNumber: number,
    totalDays: number,
    fitnessLevel: string,
    focus: string,
    availableEquipment: string[],
    timeAvailable: number
  ): string {
    return `Create a detailed workout for Day ${dayNumber} of ${totalDays} in a ${fitnessLevel} level program.

WORKOUT DETAILS:
- Focus: ${focus}
- Available Equipment: ${availableEquipment.join(', ')}
- Time Available: ${timeAvailable} minutes
- Fitness Level: ${fitnessLevel}

Please provide:
1. Warm-up routine (5-10 minutes)
2. Main workout with specific exercises, sets, and reps
3. Cool-down and stretching
4. Form tips and safety considerations
5. Estimated time for each section

Make sure the workout is appropriate for their fitness level and can be completed within the time limit.`;
  }

  /**
   * Build exercise recommendation prompt
   */
  private buildExerciseRecommendationPrompt(
    targetMuscleGroups: string[],
    fitnessLevel: string,
    availableEquipment: string[]
  ): string {
    return `As a fitness expert, recommend exercises for targeting these muscle groups: ${targetMuscleGroups.join(', ')}

REQUIREMENTS:
- Fitness Level: ${fitnessLevel}
- Available Equipment: ${availableEquipment.join(', ')}
- Focus on compound movements when possible
- Include 3-5 exercises per muscle group
- Provide sets, reps, and rest periods
- Consider safety and proper form

Please format the response with exercise names, sets/reps, and brief instructions.`;
  }

  /**
   * Fallback suggestions when AI is unavailable
   */
  private getFallbackSuggestions(fitnessLevel: string, goals: string[]): string {
    return `Here are some general ${fitnessLevel} level workout suggestions for ${goals.join(' and ')}:

**Weekly Schedule:**
- Day 1: Full body strength training
- Day 2: Rest or light cardio
- Day 3: Upper body focus
- Day 4: Rest or active recovery
- Day 5: Lower body focus
- Day 6: Cardio or flexibility
- Day 7: Rest

**General Tips:**
- Start with proper warm-ups
- Focus on form over weight
- Stay hydrated
- Get adequate rest between workouts
- Track your progress

Please try again later when the AI service is available.`;
  }

  /**
   * Fallback daily workout when AI is unavailable
   */
  private getFallbackDailyWorkout(focus: string, fitnessLevel: string): string {
    return `Here's a basic ${fitnessLevel} level ${focus} workout:

**Warm-up (5-10 minutes):**
- Light cardio
- Dynamic stretching

**Main Workout:**
- 3-4 exercises focusing on ${focus}
- 3 sets of 8-15 reps each
- 60-90 seconds rest between sets

**Cool-down:**
- Static stretching
- Deep breathing

Please try again later when the AI service is available for more specific recommendations.`;
  }

  /**
   * Fallback exercise recommendations when AI is unavailable
   */
  private getFallbackExerciseRecommendations(targetMuscleGroups: string[]): string {
    return `Here are some basic exercise recommendations for ${targetMuscleGroups.join(' and ')}:

**Bodyweight Exercises:**
- Push-ups (chest, shoulders, triceps)
- Squats (legs)
- Lunges (legs)
- Planks (core)
- Pull-ups if equipment available

**With Equipment:**
- Dumbbell exercises if available
- Resistance band exercises
- Machine exercises at gym

Focus on proper form and controlled movements. Please try again later for more specific recommendations.`;
  }
}

// Export singleton factory function
export const createWorkoutSuggestionService = (openRouterService: OpenRouterService): WorkoutSuggestionService => {
  return new WorkoutSuggestionService(openRouterService);
};