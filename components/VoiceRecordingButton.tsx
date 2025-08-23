import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VoiceButton, VoiceButtonInner } from '@/components/styled';
import { voiceService } from '@/services/voice/VoiceRecordingService';
import { VoiceRecognitionResult } from '@/types';
import * as Haptics from 'expo-haptics';

interface VoiceRecordingButtonProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onTranscriptReceived?: (result: VoiceRecognitionResult) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'processing';

export function VoiceRecordingButton({
  onRecordingStart,
  onRecordingStop,
  onTranscriptReceived,
  isProcessing = false,
  disabled = false,
}: VoiceRecordingButtonProps) {
  const [state, setState] = React.useState<RecordingState>('idle');
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const ringAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'recording') {
      // Start pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Start ring animation
      const ring = Animated.loop(
        Animated.timing(ringAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      pulse.start();
      ring.start();

      return () => {
        pulse.stop();
        ring.stop();
      };
    } else if (state === 'processing') {
      // Gentle pulsing for processing
      const processingPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      processingPulse.start();
      return () => processingPulse.stop();
    } else {
      // Reset animations for idle state
      pulseAnimation.setValue(1);
      ringAnimation.setValue(0);
      scaleAnimation.setValue(1);
    }
  }, [state]);

  const handlePress = async () => {
    if (disabled) return;

    try {
      if (state === 'idle') {
        // Start recording
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setState('recording');
        onRecordingStart?.();
        await voiceService.startRecording();
      } else if (state === 'recording') {
        // Stop recording and process
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setState('processing');
        onRecordingStop?.();
        
        const transcript = await voiceService.stopRecording();
        
        if (transcript) {
          const result = await voiceService.processTranscript(transcript);
          onTranscriptReceived?.(result);
          
          // Provide haptic feedback for successful processing
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        setState('idle');
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      Alert.alert(
        'Recording Error', 
        'There was an issue with voice recording. Please try again.',
        [{ text: 'OK' }]
      );
      setState('idle');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getButtonColor = () => {
    switch (state) {
      case 'recording': return '#EF4444';
      case 'processing': return '#F59E0B';
      default: return '#2563EB';
    }
  };

  const getIconName = () => {
    switch (state) {
      case 'recording': return 'stop.fill';
      case 'processing': return 'ellipsis';
      default: return 'mic.fill';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'recording': return 'Listening...';
      case 'processing': return 'Coach is thinking...';
      default: return 'Talk to Coach';
    }
  };

  const getHintText = () => {
    switch (state) {
      case 'recording': return 'Tap to stop recording';
      case 'processing': return 'Processing your workout...';
      default: return 'Tap and speak your exercises';
    }
  };

  // Ring scale based on animation
  const ringScale = ringAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const ringOpacity = ringAnimation.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.3, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {/* Animated Ring for Recording State */}
        {state === 'recording' && (
          <Animated.View
            style={[
              styles.recordingRing,
              {
                backgroundColor: getButtonColor(),
                transform: [{ scale: ringScale }],
                opacity: ringOpacity,
              },
            ]}
          />
        )}
        
        {/* Main Button */}
        <Animated.View
          style={{
            transform: [
              { scale: pulseAnimation },
            ],
          }}
        >
          <VoiceButton
            isRecording={state === 'recording'}
            onPress={handlePress}
            style={[
              styles.button,
              { backgroundColor: getButtonColor() },
              disabled && styles.disabledButton,
            ]}
          >
            <VoiceButtonInner>
              <IconSymbol 
                size={48} 
                name={getIconName()} 
                color="#FFFFFF"
              />
            </VoiceButtonInner>
          </VoiceButton>
        </Animated.View>
      </View>

      <Text style={styles.statusText}>
        {getStatusText()}
      </Text>
      <Text style={styles.hintText}>
        {getHintText()}
      </Text>

      {/* Visual feedback for confidence */}
      {state === 'processing' && (
        <View style={styles.processingIndicator}>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: '85%' }]} />
          </View>
          <Text style={styles.confidenceText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 32,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 0,
  },
  button: {
    zIndex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  processingIndicator: {
    marginTop: 16,
    alignItems: 'center',
  },
  confidenceBar: {
    width: 200,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
});