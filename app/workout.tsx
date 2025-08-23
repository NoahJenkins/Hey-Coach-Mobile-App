import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VoiceRecordingButton } from '@/components/VoiceRecordingButton';
import { VoiceRecognitionResult, Exercise } from '@/types';
import { workoutSessionService, WorkoutSession } from '@/services/workout/WorkoutSessionService';

export default function WorkoutScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = React.useState(false);
  const [session, setSession] = React.useState<WorkoutSession | null>(null);

  React.useEffect(() => {
    // Start a new workout session
    const initializeWorkout = async () => {
      try {
        const newSession = await workoutSessionService.startNewWorkout();
        setSession(newSession);
      } catch (error) {
        console.error('Failed to start workout:', error);
        Alert.alert('Error', 'Failed to start workout session');
      }
    };

    initializeWorkout();

    // Listen for session updates
    const unsubscribe = workoutSessionService.addListener((updatedSession) => {
      setSession(updatedSession);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscriptReceived = async (result: VoiceRecognitionResult) => {
    console.log('Received transcript result:', result);
    try {
      await workoutSessionService.addExerciseFromVoiceResult(result);
      Alert.alert(
        'Exercise Added!', 
        `Added ${result.exercises.length} exercise${result.exercises.length > 1 ? 's' : ''} to your workout.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Failed to add exercise:', error);
      Alert.alert('Error', 'Failed to add exercise to workout');
    }
  };

  const handleFinishWorkout = async () => {
    if (!session) return;
    
    try {
      const completedWorkout = await workoutSessionService.completeWorkout();
      router.push(`/workout-summary?workoutId=${completedWorkout.id}`);
    } catch (error) {
      console.error('Failed to finish workout:', error);
      Alert.alert('Error', 'Failed to complete workout');
    }
  };

  const handleCancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? All progress will be lost.',
      [
        { text: 'Keep Going', style: 'cancel' },
        { 
          text: 'Cancel Workout', 
          style: 'destructive',
          onPress: async () => {
            await workoutSessionService.cancelWorkout();
            router.back();
          }
        }
      ]
    );
  };

  const workoutStats = session ? workoutSessionService.getWorkoutStats() : {
    totalExercises: 0,
    totalSets: 0,
    totalVolume: 0,
    duration: 0
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} name="xmark" color="#64748B" />
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Workout Time</Text>
          <Text style={styles.timer}>{formatTime(session?.elapsedTime || 0)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Current Workout Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Current Workout</Text>
          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{workoutStats.totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{workoutStats.totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{workoutStats.totalVolume.toLocaleString()} lbs</Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
          </View>
        </View>

        {/* Voice Recording Button */}
        <View style={styles.recordingSection}>
          <VoiceRecordingButton
            onRecordingStart={() => setIsRecording(true)}
            onRecordingStop={() => setIsRecording(false)}
            onTranscriptReceived={handleTranscriptReceived}
            disabled={false}
          />
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseList}>
          <Text style={styles.sectionTitle}>Today's Exercises</Text>
          {session && session.workout.exercises.length > 0 ? (
            session.workout.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                <View style={styles.setsContainer}>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.setInfo}>
                      {set.reps && `${set.reps} reps`}
                      {set.weight && ` @ ${set.weight} lbs`}
                      {set.duration && ` for ${Math.round(set.duration / 60)} min`}
                    </Text>
                  ))}
                </View>
                <Text style={styles.muscleGroups}>
                  {exercise.muscleGroups.join(', ')}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No exercises yet</Text>
              <Text style={styles.emptyStateSubtext}>Use voice recording to add your first exercise</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout}>
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelWorkout}>
            <Text style={styles.cancelButtonText}>Cancel Workout</Text>
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
  closeButton: {
    padding: 8,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  exerciseList: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  actionButtons: {
    gap: 12,
  },
  finishButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
});