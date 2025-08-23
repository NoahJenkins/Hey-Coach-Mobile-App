import { ExerciseDefinition } from '@/types';

export const exerciseDatabase: ExerciseDefinition[] = [
  // STRENGTH TRAINING - Compound Movements
  {
    id: 'squat-back-barbell',
    name: 'Back Squat',
    aliases: ['squat', 'back squat', 'barbell squat', 'squats'],
    muscleGroups: ['quadriceps', 'glutes', 'core'],
    category: 'strength',
    equipment: ['barbell', 'squat rack'],
    movementPattern: 'squat',
    difficultyLevel: 'intermediate',
  },
  {
    id: 'deadlift-conventional',
    name: 'Conventional Deadlift',
    aliases: ['deadlift', 'deadlifts', 'conventional deadlift', 'dead lift'],
    muscleGroups: ['hamstrings', 'glutes', 'back', 'core'],
    category: 'strength',
    equipment: ['barbell'],
    movementPattern: 'hinge',
    difficultyLevel: 'intermediate',
  },
  {
    id: 'bench-press-barbell',
    name: 'Barbell Bench Press',
    aliases: ['bench press', 'bench', 'barbell bench', 'chest press'],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    category: 'strength',
    equipment: ['barbell', 'bench'],
    movementPattern: 'push',
    difficultyLevel: 'intermediate',
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    aliases: ['overhead press', 'shoulder press', 'military press', 'ohp'],
    muscleGroups: ['shoulders', 'triceps', 'core'],
    category: 'strength',
    equipment: ['barbell'],
    movementPattern: 'push',
    difficultyLevel: 'intermediate',
  },
  {
    id: 'pull-up',
    name: 'Pull-up',
    aliases: ['pull up', 'pullup', 'pull ups', 'pullups'],
    muscleGroups: ['lats', 'biceps', 'back'],
    category: 'strength',
    equipment: ['pull up bar'],
    movementPattern: 'pull',
    difficultyLevel: 'advanced',
  },

  // STRENGTH TRAINING - Isolation Exercises
  {
    id: 'bicep-curl-dumbbell',
    name: 'Dumbbell Bicep Curl',
    aliases: ['bicep curl', 'bicep curls', 'dumbbell curl', 'arm curl'],
    muscleGroups: ['biceps'],
    category: 'strength',
    equipment: ['dumbbells'],
    movementPattern: 'pull',
    difficultyLevel: 'beginner',
  },
  {
    id: 'tricep-extension-dumbbell',
    name: 'Dumbbell Tricep Extension',
    aliases: ['tricep extension', 'tricep extensions', 'skull crusher', 'overhead tricep'],
    muscleGroups: ['triceps'],
    category: 'strength',
    equipment: ['dumbbells'],
    movementPattern: 'push',
    difficultyLevel: 'beginner',
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    aliases: ['lateral raise', 'lateral raises', 'side raise', 'side raises'],
    muscleGroups: ['shoulders'],
    category: 'strength',
    equipment: ['dumbbells'],
    movementPattern: 'push',
    difficultyLevel: 'beginner',
  },

  // CARDIO EXERCISES
  {
    id: 'treadmill-running',
    name: 'Treadmill Running',
    aliases: ['treadmill', 'running', 'treadmill run', 'run'],
    muscleGroups: ['legs', 'glutes', 'cardiovascular'],
    category: 'cardio',
    equipment: ['treadmill'],
    movementPattern: 'cardio',
    difficultyLevel: 'beginner',
  },
  {
    id: 'stationary-bike',
    name: 'Stationary Bike',
    aliases: ['bike', 'cycling', 'stationary bike', 'exercise bike'],
    muscleGroups: ['legs', 'glutes', 'cardiovascular'],
    category: 'cardio',
    equipment: ['stationary bike'],
    movementPattern: 'cardio',
    difficultyLevel: 'beginner',
  },
  {
    id: 'elliptical',
    name: 'Elliptical Machine',
    aliases: ['elliptical', 'elliptical machine', 'cross trainer'],
    muscleGroups: ['legs', 'arms', 'cardiovascular'],
    category: 'cardio',
    equipment: ['elliptical'],
    movementPattern: 'cardio',
    difficultyLevel: 'beginner',
  },
  {
    id: 'burpees',
    name: 'Burpees',
    aliases: ['burpee', 'burpees'],
    muscleGroups: ['full body', 'cardiovascular'],
    category: 'cardio',
    equipment: [],
    movementPattern: 'cardio',
    difficultyLevel: 'intermediate',
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    aliases: ['jumping jack', 'jumping jacks', 'star jumps'],
    muscleGroups: ['legs', 'arms', 'cardiovascular'],
    category: 'cardio',
    equipment: [],
    movementPattern: 'cardio',
    difficultyLevel: 'beginner',
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    aliases: ['mountain climber', 'mountain climbers'],
    muscleGroups: ['core', 'legs', 'cardiovascular'],
    category: 'cardio',
    equipment: [],
    movementPattern: 'cardio',
    difficultyLevel: 'intermediate',
  },

  // YOGA & FLEXIBILITY
  {
    id: 'downward-dog',
    name: 'Downward Facing Dog',
    aliases: ['downward dog', 'down dog', 'downward facing dog', 'adho mukha svanasana'],
    muscleGroups: ['shoulders', 'hamstrings', 'calves'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    aliases: ['child pose', 'childs pose', 'balasana', 'resting pose'],
    muscleGroups: ['back', 'hips'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'warrior-one',
    name: 'Warrior I',
    aliases: ['warrior 1', 'warrior one', 'virabhadrasana 1'],
    muscleGroups: ['legs', 'hips', 'core'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'warrior-two',
    name: 'Warrior II',
    aliases: ['warrior 2', 'warrior two', 'virabhadrasana 2'],
    muscleGroups: ['legs', 'hips', 'core'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'plank',
    name: 'Plank',
    aliases: ['plank', 'planks', 'plank hold'],
    muscleGroups: ['core', 'shoulders', 'back'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    aliases: ['cat cow', 'cat-cow', 'cat cow stretch', 'marjaryasana bitilasana'],
    muscleGroups: ['back', 'spine'],
    category: 'yoga',
    equipment: ['yoga mat'],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },

  // STRETCHING
  {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    aliases: ['hamstring stretch', 'hamstring stretches', 'ham stretch'],
    muscleGroups: ['hamstrings'],
    category: 'flexibility',
    equipment: [],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'quad-stretch',
    name: 'Quadriceps Stretch',
    aliases: ['quad stretch', 'quadriceps stretch', 'thigh stretch'],
    muscleGroups: ['quadriceps'],
    category: 'flexibility',
    equipment: [],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },
  {
    id: 'calf-stretch',
    name: 'Calf Stretch',
    aliases: ['calf stretch', 'calf stretches'],
    muscleGroups: ['calves'],
    category: 'flexibility',
    equipment: [],
    movementPattern: 'flexibility',
    difficultyLevel: 'beginner',
  },

  // BODYWEIGHT EXERCISES
  {
    id: 'push-up',
    name: 'Push-up',
    aliases: ['push up', 'pushup', 'push ups', 'pushups'],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    category: 'strength',
    equipment: [],
    movementPattern: 'push',
    difficultyLevel: 'beginner',
  },
  {
    id: 'sit-up',
    name: 'Sit-up',
    aliases: ['sit up', 'situp', 'sit ups', 'situps'],
    muscleGroups: ['core', 'abs'],
    category: 'strength',
    equipment: [],
    movementPattern: 'pull',
    difficultyLevel: 'beginner',
  },
  {
    id: 'lunge',
    name: 'Lunge',
    aliases: ['lunge', 'lunges', 'forward lunge'],
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    category: 'strength',
    equipment: [],
    movementPattern: 'squat',
    difficultyLevel: 'beginner',
  },

  // Additional popular exercises...
  {
    id: 'leg-press',
    name: 'Leg Press',
    aliases: ['leg press', 'leg press machine'],
    muscleGroups: ['quadriceps', 'glutes'],
    category: 'strength',
    equipment: ['leg press machine'],
    movementPattern: 'squat',
    difficultyLevel: 'beginner',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    aliases: ['lat pulldown', 'lat pull down', 'pulldown'],
    muscleGroups: ['lats', 'biceps', 'back'],
    category: 'strength',
    equipment: ['cable machine'],
    movementPattern: 'pull',
    difficultyLevel: 'beginner',
  },
  {
    id: 'chest-fly',
    name: 'Chest Fly',
    aliases: ['chest fly', 'chest flies', 'pec fly', 'flyes'],
    muscleGroups: ['chest'],
    category: 'strength',
    equipment: ['dumbbells'],
    movementPattern: 'push',
    difficultyLevel: 'beginner',
  },
];

// Helper function to get exercise by category
export function getExercisesByCategory(category: ExerciseDefinition['category']): ExerciseDefinition[] {
  return exerciseDatabase.filter(exercise => exercise.category === category);
}

// Helper function to get exercises by muscle group
export function getExercisesByMuscleGroup(muscleGroup: string): ExerciseDefinition[] {
  return exerciseDatabase.filter(exercise => 
    exercise.muscleGroups.some(group => 
      group.toLowerCase().includes(muscleGroup.toLowerCase())
    )
  );
}

// Helper function to get exercises by equipment
export function getExercisesByEquipment(equipment: string): ExerciseDefinition[] {
  return exerciseDatabase.filter(exercise =>
    exercise.equipment?.some(eq => 
      eq.toLowerCase().includes(equipment.toLowerCase())
    )
  );
}