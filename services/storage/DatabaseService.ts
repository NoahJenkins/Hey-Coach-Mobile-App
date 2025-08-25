import * as SQLite from 'expo-sqlite';
import { Workout, Exercise, UserSettings } from '@/types';

export class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('heycoach.db');
      await this.migrateDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async migrateDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if this is a fresh database or needs migration
      const tableCheck = await this.db.getFirstAsync(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='workouts'
      `) as any;

      if (!tableCheck) {
        // Fresh database - create all tables
        await this.createTables();
      } else {
        // Try migration, but if it fails, reset the database
        try {
          await this.performMigrations();
        } catch (migrationError) {
          console.warn('Migration failed, resetting database:', migrationError);
          await this.resetDatabase();
          await this.createTables();
        }
      }
    } catch (error) {
      console.warn('Database migration failed, resetting:', error);
      await this.resetDatabase();
      await this.createTables();
    }
  }

  private async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Drop all tables
      await this.db.execAsync(`DROP TABLE IF EXISTS coach_insights`);
      await this.db.execAsync(`DROP TABLE IF EXISTS coach_recommendations`);
      await this.db.execAsync(`DROP TABLE IF EXISTS exercise_muscle_groups`);
      await this.db.execAsync(`DROP TABLE IF EXISTS sets`);
      await this.db.execAsync(`DROP TABLE IF EXISTS exercises`);
      await this.db.execAsync(`DROP TABLE IF EXISTS workouts`);
      console.log('Database tables dropped successfully');
    } catch (error) {
      console.warn('Error dropping tables:', error);
    }
  }

  private async performMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if workouts table has the expected columns
    const workoutColumns = await this.db.getAllAsync(`PRAGMA table_info(workouts)`) as any[];
    const columnNames = workoutColumns.map(col => col.name);

    // Add missing columns if they don't exist
    if (!columnNames.includes('start_time')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN start_time TEXT`);
        // Populate start_time from existing date column if possible
        await this.db.execAsync(`UPDATE workouts SET start_time = date WHERE start_time IS NULL`);
      } catch (error) {
        console.warn('Could not add start_time column:', error);
      }
    }

    if (!columnNames.includes('end_time')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN end_time TEXT`);
      } catch (error) {
        console.warn('Could not add end_time column:', error);
      }
    }

    if (!columnNames.includes('is_completed')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN is_completed INTEGER DEFAULT 0`);
      } catch (error) {
        console.warn('Could not add is_completed column:', error);
      }
    }

    if (!columnNames.includes('is_synced')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN is_synced INTEGER DEFAULT 0`);
      } catch (error) {
        console.warn('Could not add is_synced column:', error);
      }
    }

    if (!columnNames.includes('coach_rating')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN coach_rating INTEGER`);
      } catch (error) {
        console.warn('Could not add coach_rating column:', error);
      }
    }

    if (!columnNames.includes('user_motivation')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN user_motivation TEXT`);
      } catch (error) {
        console.warn('Could not add user_motivation column:', error);
      }
    }

    if (!columnNames.includes('created_at')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP`);
      } catch (error) {
        console.warn('Could not add created_at column:', error);
      }
    }

    if (!columnNames.includes('updated_at')) {
      try {
        await this.db.execAsync(`ALTER TABLE workouts ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP`);
      } catch (error) {
        console.warn('Could not add updated_at column:', error);
      }
    }

    // Check exercises table
    const exerciseTableCheck = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='exercises'
    `) as any;

    if (!exerciseTableCheck) {
      await this.createExercisesTable();
    } else {
      // Check exercises table columns
      const exerciseColumns = await this.db.getAllAsync(`PRAGMA table_info(exercises)`) as any[];
      const exerciseColumnNames = exerciseColumns.map(col => col.name);

      if (!exerciseColumnNames.includes('workout_id')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN workout_id TEXT`);
        } catch (error) {
          console.warn('Could not add workout_id column to exercises:', error);
        }
      }

      if (!exerciseColumnNames.includes('category')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN category TEXT`);
        } catch (error) {
          console.warn('Could not add category column to exercises:', error);
        }
      }

      if (!exerciseColumnNames.includes('total_duration')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN total_duration INTEGER`);
        } catch (error) {
          console.warn('Could not add total_duration column to exercises:', error);
        }
      }

      if (!exerciseColumnNames.includes('distance')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN distance REAL`);
        } catch (error) {
          console.warn('Could not add distance column to exercises:', error);
        }
      }

      if (!exerciseColumnNames.includes('calories')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN calories INTEGER`);
        } catch (error) {
          console.warn('Could not add calories column to exercises:', error);
        }
      }

      if (!exerciseColumnNames.includes('created_at')) {
        try {
          await this.db.execAsync(`ALTER TABLE exercises ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP`);
        } catch (error) {
          console.warn('Could not add created_at column to exercises:', error);
        }
      }
    }

    // Check and create other missing tables
    await this.createMissingTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create workouts table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        is_completed INTEGER DEFAULT 0,
        is_synced INTEGER DEFAULT 0,
        coach_rating INTEGER,
        user_motivation TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create exercises table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        total_duration INTEGER,
        distance REAL,
        calories INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);

    // Create sets table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id TEXT NOT NULL,
        reps INTEGER,
        weight REAL,
        duration INTEGER,
        rest_time INTEGER,
        distance REAL,
        pace REAL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
      );
    `);

    // Create muscle_groups table (many-to-many relationship)
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
        exercise_id TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        PRIMARY KEY (exercise_id, muscle_group),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
      );
    `);

    // Create coach_recommendations table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS coach_recommendations (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        priority TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);

    // Create coach_insights table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS coach_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id TEXT NOT NULL,
        insight TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
      CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
      CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
    `);
  }

  private async createExercisesTable(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE exercises (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        total_duration INTEGER,
        distance REAL,
        calories INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);
  }

  private async createMissingTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create sets table if missing
    const setsTableCheck = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='sets'
    `) as any;

    if (!setsTableCheck) {
      await this.db.execAsync(`
        CREATE TABLE sets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_id TEXT NOT NULL,
          reps INTEGER,
          weight REAL,
          duration INTEGER,
          rest_time INTEGER,
          distance REAL,
          pace REAL,
          notes TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
        );
      `);
    }

    // Create muscle groups table if missing
    const muscleGroupsTableCheck = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='exercise_muscle_groups'
    `) as any;

    if (!muscleGroupsTableCheck) {
      await this.db.execAsync(`
        CREATE TABLE exercise_muscle_groups (
          exercise_id TEXT NOT NULL,
          muscle_group TEXT NOT NULL,
          PRIMARY KEY (exercise_id, muscle_group),
          FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
        );
      `);
    }

    // Create recommendations table if missing
    const recommendationsTableCheck = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='coach_recommendations'
    `) as any;

    if (!recommendationsTableCheck) {
      await this.db.execAsync(`
        CREATE TABLE coach_recommendations (
          id TEXT PRIMARY KEY,
          workout_id TEXT NOT NULL,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          message TEXT NOT NULL,
          priority TEXT NOT NULL,
          timeframe TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
        );
      `);
    }

    // Create insights table if missing
    const insightsTableCheck = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='coach_insights'
    `) as any;

    if (!insightsTableCheck) {
      await this.db.execAsync(`
        CREATE TABLE coach_insights (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_id TEXT NOT NULL,
          insight TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
        );
      `);
    }

    // Create indexes
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
      CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
      CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
    `);
  }

  // Workout operations
  async saveWorkout(workout: Workout): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('BEGIN TRANSACTION');

      // Insert or update workout
      await this.db.runAsync(`
        INSERT OR REPLACE INTO workouts (
          id, date, start_time, end_time, is_completed, is_synced, coach_rating, user_motivation, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        workout.id,
        workout.date.toISOString(),
        workout.startTime.toISOString(),
        workout.endTime?.toISOString() || null,
        workout.isCompleted ? 1 : 0,
        workout.isSynced ? 1 : 0,
        workout.coachRating || null,
        workout.userMotivation || null,
      ]);

      // Delete existing exercises for this workout
      await this.db.runAsync('DELETE FROM exercises WHERE workout_id = ?', [workout.id]);

      // Insert exercises
      for (const exercise of workout.exercises) {
        await this.saveExercise(exercise, workout.id);
      }

      // Delete existing recommendations for this workout
      await this.db.runAsync('DELETE FROM coach_recommendations WHERE workout_id = ?', [workout.id]);

      // Insert coach recommendations
      for (const recommendation of workout.coachRecommendations) {
        await this.db.runAsync(`
          INSERT INTO coach_recommendations (
            id, workout_id, type, category, message, priority, timeframe, completed
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          recommendation.id,
          workout.id,
          recommendation.type,
          recommendation.category,
          recommendation.message,
          recommendation.priority,
          recommendation.timeframe,
          recommendation.completed ? 1 : 0,
        ]);
      }

      // Delete existing insights for this workout
      await this.db.runAsync('DELETE FROM coach_insights WHERE workout_id = ?', [workout.id]);

      // Insert coach insights
      for (const insight of workout.coachInsights) {
        await this.db.runAsync(`
          INSERT INTO coach_insights (workout_id, insight) VALUES (?, ?)
        `, [workout.id, insight]);
      }

      await this.db.runAsync('COMMIT');
    } catch (error) {
      await this.db.runAsync('ROLLBACK');
      throw error;
    }
  }

  private async saveExercise(exercise: Exercise, workoutId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Insert exercise
    await this.db.runAsync(`
      INSERT INTO exercises (
        id, workout_id, name, category, total_duration, distance, calories
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      exercise.id,
      workoutId,
      exercise.name,
      exercise.category,
      exercise.totalDuration || null,
      exercise.distance || null,
      exercise.calories || null,
    ]);

    // Insert muscle groups
    for (const muscleGroup of exercise.muscleGroups) {
      await this.db.runAsync(`
        INSERT INTO exercise_muscle_groups (exercise_id, muscle_group) VALUES (?, ?)
      `, [exercise.id, muscleGroup]);
    }

    // Insert sets
    for (const set of exercise.sets) {
      await this.db.runAsync(`
        INSERT INTO sets (
          exercise_id, reps, weight, duration, rest_time, distance, pace, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        exercise.id,
        set.reps || null,
        set.weight || null,
        set.duration || null,
        set.restTime || null,
        set.distance || null,
        set.pace || null,
        set.notes || null,
      ]);
    }
  }

  async getWorkout(id: string): Promise<Workout | null> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutRow = await this.db.getFirstAsync(`
      SELECT * FROM workouts WHERE id = ?
    `, [id]) as any;

    if (!workoutRow) return null;

    return await this.buildWorkoutFromRow(workoutRow);
  }

  async getAllWorkouts(): Promise<Workout[]> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutRows = await this.db.getAllAsync(`
      SELECT * FROM workouts ORDER BY date DESC, start_time DESC
    `) as any[];

    const workouts: Workout[] = [];
    for (const row of workoutRows) {
      const workout = await this.buildWorkoutFromRow(row);
      workouts.push(workout);
    }

    return workouts;
  }

  async getRecentWorkouts(limit: number = 10): Promise<Workout[]> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutRows = await this.db.getAllAsync(`
      SELECT * FROM workouts 
      WHERE is_completed = 1 
      ORDER BY date DESC, start_time DESC 
      LIMIT ?
    `, [limit]) as any[];

    const workouts: Workout[] = [];
    for (const row of workoutRows) {
      const workout = await this.buildWorkoutFromRow(row);
      workouts.push(workout);
    }

    return workouts;
  }

  private async buildWorkoutFromRow(workoutRow: any): Promise<Workout> {
    if (!this.db) throw new Error('Database not initialized');

    // Get exercises
    const exerciseRows = await this.db.getAllAsync(`
      SELECT * FROM exercises WHERE workout_id = ?
    `, [workoutRow.id]) as any[];

    const exercises: Exercise[] = [];
    for (const exerciseRow of exerciseRows) {
      const exercise = await this.buildExerciseFromRow(exerciseRow);
      exercises.push(exercise);
    }

    // Get coach recommendations
    const recommendationRows = await this.db.getAllAsync(`
      SELECT * FROM coach_recommendations WHERE workout_id = ?
    `, [workoutRow.id]) as any[];

    const coachRecommendations = recommendationRows.map((row: any) => ({
      id: row.id,
      type: row.type,
      category: row.category,
      message: row.message,
      priority: row.priority,
      timeframe: row.timeframe,
      completed: row.completed === 1,
    }));

    // Get coach insights
    const insightRows = await this.db.getAllAsync(`
      SELECT insight FROM coach_insights WHERE workout_id = ?
    `, [workoutRow.id]) as any[];

    const coachInsights = insightRows.map((row: any) => row.insight);

    // Extract unique muscle groups
    const muscleGroups = [...new Set(exercises.flatMap(ex => ex.muscleGroups))];

    return {
      id: workoutRow.id,
      date: new Date(workoutRow.date),
      startTime: new Date(workoutRow.start_time),
      endTime: workoutRow.end_time ? new Date(workoutRow.end_time) : undefined,
      exercises,
      muscleGroups,
      coachRecommendations,
      coachInsights,
      isCompleted: workoutRow.is_completed === 1,
      isSynced: workoutRow.is_synced === 1,
      coachRating: workoutRow.coach_rating,
      userMotivation: workoutRow.user_motivation,
    };
  }

  private async buildExerciseFromRow(exerciseRow: any): Promise<Exercise> {
    if (!this.db) throw new Error('Database not initialized');

    // Get muscle groups
    const muscleGroupRows = await this.db.getAllAsync(`
      SELECT muscle_group FROM exercise_muscle_groups WHERE exercise_id = ?
    `, [exerciseRow.id]) as any[];

    const muscleGroups = muscleGroupRows.map((row: any) => row.muscle_group);

    // Get sets
    const setRows = await this.db.getAllAsync(`
      SELECT * FROM sets WHERE exercise_id = ? ORDER BY id
    `, [exerciseRow.id]) as any[];

    const sets = setRows.map((row: any) => ({
      reps: row.reps,
      weight: row.weight,
      duration: row.duration,
      restTime: row.rest_time,
      distance: row.distance,
      pace: row.pace,
      notes: row.notes,
    }));

    return {
      id: exerciseRow.id,
      name: exerciseRow.name,
      sets,
      muscleGroups,
      category: exerciseRow.category,
      totalDuration: exerciseRow.total_duration,
      distance: exerciseRow.distance,
      calories: exerciseRow.calories,
    };
  }

  async deleteWorkout(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
  }

  async getWorkoutStats(days: number = 30): Promise<{
    totalWorkouts: number;
    totalTime: number;
    totalVolume: number;
    averageWorkoutTime: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const statsRow = await this.db.getFirstAsync(`
      SELECT 
        COUNT(*) as total_workouts,
        AVG(CASE WHEN end_time IS NOT NULL 
            THEN (strftime('%s', end_time) - strftime('%s', start_time)) 
            ELSE 0 END) as avg_time
      FROM workouts 
      WHERE is_completed = 1 AND date >= ?
    `, [cutoffDate.toISOString()]) as any;

    // Calculate total volume (weight * reps for all sets)
    const volumeRow = await this.db.getFirstAsync(`
      SELECT SUM(s.weight * s.reps) as total_volume
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.is_completed = 1 AND w.date >= ? AND s.weight IS NOT NULL AND s.reps IS NOT NULL
    `, [cutoffDate.toISOString()]) as any;

    return {
      totalWorkouts: statsRow?.total_workouts || 0,
      totalTime: (statsRow?.avg_time || 0) * (statsRow?.total_workouts || 0),
      totalVolume: volumeRow?.total_volume || 0,
      averageWorkoutTime: statsRow?.avg_time || 0,
    };
  }
}

export const databaseService = new DatabaseService();