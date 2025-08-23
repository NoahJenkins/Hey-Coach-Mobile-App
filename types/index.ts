// Core data types for Hey Coach application

export interface Set {
  reps?: number; // optional for time-based exercises
  weight?: number; // in lbs or kg
  duration?: number; // for time-based exercises (seconds)
  restTime?: number; // rest after this set (seconds)
  notes?: string;
  distance?: number; // for cardio intervals
  pace?: number; // seconds per mile/km
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscleGroups: string[];
  category: string; // strength, cardio, flexibility, yoga
  totalDuration?: number; // total time spent on exercise (seconds)
  equipment?: string[];
  distance?: number; // for cardio exercises (miles/km)
  calories?: number; // estimated calories burned
}

export interface CoachRecommendation {
  id: string;
  type: 'recovery' | 'nutrition' | 'training' | 'rest';
  category: 'immediate' | 'short-term' | 'long-term';
  message: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string; // "within 30 minutes", "tonight", "tomorrow"
  completed?: boolean;
}

export interface Workout {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  exercises: Exercise[];
  muscleGroups: string[];
  coachRecommendations: CoachRecommendation[];
  coachInsights: string[];
  isCompleted: boolean;
  isSynced: boolean;
  coachRating?: number; // 1-5 stars from Coach
  userMotivation?: string; // Coach's motivational message
}

export interface UserSettings {
  id: string;
  weightUnit: 'lbs' | 'kg';
  distanceUnit: 'miles' | 'km';
  autoSaveMode: boolean;
  confirmationLevel: 'always' | 'complex' | 'never';
  defaultRestTime: number;
  soundEffects: boolean;
  voiceConfirmation: boolean;
}

// Exercise database types
export interface ExerciseDefinition {
  id: string;
  name: string;
  aliases: string[];
  muscleGroups: string[];
  category: 'strength' | 'cardio' | 'flexibility' | 'yoga';
  equipment?: string[];
  movementPattern?: 'push' | 'pull' | 'squat' | 'hinge' | 'cardio' | 'flexibility';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Voice processing types
export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  exercises: ParsedExercise[];
}

export interface ParsedExercise {
  name: string;
  matchConfidence: number;
  exerciseId?: string;
  sets: ParsedSet[];
  totalDuration?: number;
  distance?: number;
}

export interface ParsedSet {
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  confidence: number;
}

// UI/Navigation types
export type RootStackParamList = {
  Dashboard: undefined;
  Workout: undefined;
  WorkoutSummary: { workoutId: string };
  Settings: undefined;
  History: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  History: undefined;
  Settings: undefined;
};

// State management types
export interface AppState {
  user: {
    settings: UserSettings;
    isAuthenticated: boolean;
  };
  workout: {
    currentWorkout?: Workout;
    isRecording: boolean;
    isProcessing: boolean;
    lastRecognitionResult?: VoiceRecognitionResult;
  };
  exercises: {
    database: ExerciseDefinition[];
    recentExercises: string[];
  };
  data: {
    workouts: Workout[];
    isSyncing: boolean;
    lastSyncDate?: Date;
  };
}

// Coach personality types
export interface CoachResponse {
  message: string;
  tone: 'encouraging' | 'informative' | 'celebratory' | 'advisory';
  includeMotivation: boolean;
  recommendations?: CoachRecommendation[];
}

export interface CoachContext {
  workoutHistory: Workout[];
  currentWorkout?: Workout;
  userPreferences: UserSettings;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  recentPerformance: {
    consistency: number; // 0-1 scale
    progressTrend: 'improving' | 'maintaining' | 'declining';
    lastWorkoutDate?: Date;
  };
}