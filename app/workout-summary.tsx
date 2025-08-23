import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Workout } from '@/types';
import { databaseService } from '@/services/storage/DatabaseService';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const [workout, setWorkout] = React.useState<Workout | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) {
        console.error('No workout ID provided');
        setLoading(false);
        return;
      }

      try {
        const loadedWorkout = await databaseService.getWorkout(workoutId);
        setWorkout(loadedWorkout);
      } catch (error) {
        console.error('Failed to load workout:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  const handleSaveWorkout = () => {
    router.push('/(tabs)');
  };

  const calculateWorkoutStats = () => {
    if (!workout) return { duration: 0, totalSets: 0, totalVolume: 0 };

    const duration = workout.endTime && workout.startTime
      ? Math.round((workout.endTime.getTime() - workout.startTime.getTime()) / 1000 / 60)
      : 0;

    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalVolume = workout.exercises.reduce((volume, ex) => {
      return volume + ex.sets.reduce((setVolume, set) => {
        return setVolume + ((set.weight || 0) * (set.reps || 0));
      }, 0);
    }, 0);

    return { duration, totalSets, totalVolume };
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading workout summary...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Workout not found</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = calculateWorkoutStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} name="chevron.left" color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Coach Celebration */}
        <View style={styles.celebrationCard}>
          <View style={styles.coachIcon}>
            <IconSymbol size={32} name="star.fill" color="#F59E0B" />
          </View>
          <Text style={styles.celebrationTitle}>Excellent work! 🎉</Text>
          <Text style={styles.celebrationMessage}>
            {workout.coachInsights.length > 0 
              ? workout.coachInsights[0] 
              : "I'm proud of your dedication today. You showed up and gave it your all!"}
          </Text>
        </View>

        {/* Workout Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.floor(stats.duration)}:{(stats.duration % 1 * 60).toFixed(0).padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalVolume.toLocaleString()} lbs</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesCard}>
          <Text style={styles.cardTitle}>Exercises</Text>
          {workout.exercises.length > 0 ? (
            workout.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                <View style={styles.setsContainer}>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.setInfo}>
                      Set {setIndex + 1}: {set.reps && `${set.reps} reps`}
                      {set.weight && ` @ ${set.weight} lbs`}
                      {set.duration && ` for ${Math.round(set.duration / 60)} min`}
                    </Text>
                  ))}
                </View>
                <Text style={styles.muscleGroups}>
                  Target: {exercise.muscleGroups.join(', ')}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyExercises}>
              <IconSymbol size={48} name="dumbbell" color="#94A3B8" />
              <Text style={styles.emptyText}>No exercises recorded</Text>
              <Text style={styles.emptySubtext}>
                Next time, use voice recording to log your exercises
              </Text>
            </View>
          )}
        </View>

        {/* Coach Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>Coach's Recommendations</Text>
          {workout.coachRecommendations.map((recommendation, index) => {
            const iconName = recommendation.type === 'recovery' 
              ? 'drop.fill' 
              : recommendation.type === 'nutrition'
              ? 'fork.knife'
              : recommendation.type === 'rest'
              ? 'bed.double.fill'
              : 'figure.walk';
            
            const iconColor = recommendation.priority === 'high'
              ? '#EF4444'
              : recommendation.priority === 'medium'
              ? '#F59E0B'
              : '#10B981';

            return (
              <View key={recommendation.id} style={styles.recommendation}>
                <View style={styles.recommendationIcon}>
                  <IconSymbol size={20} name={iconName} color={iconColor} />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>
                    {recommendation.type === 'recovery' ? 'Recovery' 
                      : recommendation.type === 'nutrition' ? 'Nutrition'
                      : recommendation.type === 'rest' ? 'Rest'
                      : 'Training'}
                  </Text>
                  <Text style={styles.recommendationText}>
                    {recommendation.message}
                  </Text>
                  <Text style={styles.recommendationTimeframe}>
                    {recommendation.timeframe}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <IconSymbol size={20} name="square.and.arrow.up" color="#2563EB" />
            <Text style={styles.shareButtonText}>Share Progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
  },
  celebrationCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  coachIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  celebrationMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  exercisesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  emptyExercises: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  setsContainer: {
    marginBottom: 8,
  },
  setInfo: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 2,
  },
  muscleGroups: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  recommendationTimeframe: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
});