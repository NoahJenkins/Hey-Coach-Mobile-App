import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { VoiceRecognitionResult, ParsedExercise } from '@/types';
import { exerciseMatchingService } from '@/services/exercise/ExerciseMatchingService';

export class VoiceRecordingService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  async startRecording(): Promise<void> {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Permission to access microphone is required!');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await this.recording.startAsync();
      this.isRecording = true;

      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording || !this.isRecording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;

      console.log('Recording stopped. URI:', uri);

      // For now, return a mock transcript since expo-speech doesn't have speech-to-text
      // In a real implementation, you would send the audio to a speech recognition service
      const mockTranscript = "I did 3 sets of bench press with 185 pounds, 12 reps, 10 reps, and 8 reps";
      return mockTranscript;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async processTranscript(transcript: string): Promise<VoiceRecognitionResult> {
    console.log('Processing transcript:', transcript);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use exercise matching service to find exercises
    const exerciseMatches = exerciseMatchingService.parseExercisesFromText(transcript);
    
    // Parse numbers from transcript for sets, reps, weights
    const numbers = this.extractNumbers(transcript);
    const parsedExercises: ParsedExercise[] = [];

    for (const match of exerciseMatches) {
      if (match.score > 0.6) { // Only include confident matches
        // Parse sets/reps/weights based on context
        const sets = this.parseSetsFromTranscript(transcript, numbers);
        
        parsedExercises.push({
          name: match.exercise.name,
          matchConfidence: match.score,
          exerciseId: match.exercise.id,
          sets: sets,
        });
      }
    }

    // If no exercises found, try with a mock example for demo
    if (parsedExercises.length === 0) {
      const benchMatch = exerciseMatchingService.findBestMatch('bench press');
      if (benchMatch) {
        parsedExercises.push({
          name: benchMatch.exercise.name,
          matchConfidence: 0.8,
          exerciseId: benchMatch.exercise.id,
          sets: [
            { reps: 12, weight: 185, confidence: 0.9 },
            { reps: 10, weight: 185, confidence: 0.9 },
            { reps: 8, weight: 185, confidence: 0.9 },
          ],
        });
      }
    }

    const result: VoiceRecognitionResult = {
      transcript,
      confidence: parsedExercises.length > 0 ? 0.85 : 0.3,
      exercises: parsedExercises,
    };

    return result;
  }

  private extractNumbers(text: string): number[] {
    const numberPattern = /\b\d+(?:\.\d+)?\b/g;
    const matches = text.match(numberPattern);
    return matches ? matches.map(Number) : [];
  }

  private parseSetsFromTranscript(transcript: string, numbers: number[]): any[] {
    // Simple parsing logic - in a real app this would be much more sophisticated
    const lowerTranscript = transcript.toLowerCase();
    
    // Look for patterns like "3 sets", "12 reps", "185 pounds"
    const setsMatch = lowerTranscript.match(/(\d+)\s*sets?/);
    const repsMatches = lowerTranscript.match(/(\d+),?\s*(\d+),?\s*(\d+)\s*reps?/);
    const weightMatch = lowerTranscript.match(/(\d+)\s*(?:pounds?|lbs?|kg)/);

    let sets = [];
    const numSets = setsMatch ? parseInt(setsMatch[1]) : 3;
    const weight = weightMatch ? parseFloat(weightMatch[1]) : undefined;

    if (repsMatches) {
      // Parse individual rep counts
      for (let i = 1; i <= numSets && i < repsMatches.length; i++) {
        const reps = parseInt(repsMatches[i]);
        sets.push({
          reps,
          weight,
          confidence: 0.9,
        });
      }
    } else {
      // Default sets if can't parse individual reps
      const defaultReps = numbers.find(n => n >= 5 && n <= 30) || 10;
      for (let i = 0; i < numSets; i++) {
        sets.push({
          reps: defaultReps,
          weight,
          confidence: 0.7,
        });
      }
    }

    return sets.length > 0 ? sets : [{ reps: 10, confidence: 0.5 }];
  }

  speakCoachResponse(message: string): void {
    Speech.speak(message, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      voice: 'com.apple.ttsbundle.Moira-compact', // Female voice on iOS
    });
  }

  stopSpeaking(): void {
    Speech.stop();
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }
}

export const voiceService = new VoiceRecordingService();