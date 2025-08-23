import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {
  Container,
  ContentContainer,
  HeroText,
  BodyText,
  CaptionText,
  PrimaryButton,
  PrimaryButtonText,
  Card,
  CardTitle,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  CoachMessage,
  CoachMessageText,
  CoachIcon,
} from '@/components/styled';

export default function DashboardScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = React.useState('');
  const pulseAnimation = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning!');
    } else if (hour < 18) {
      setGreeting('Good afternoon!');
    } else {
      setGreeting('Good evening!');
    }

    // Start pulse animation for the main button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleStartWorkout = () => {
    router.push('/workout');
  };

  const handleViewHistory = () => {
    router.push('/(tabs)/history');
  };

  return (
    <Container>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ContentContainer padding="lg">
          {/* Hero Section with Coach */}
          <View style={styles.heroSection}>
            <CoachIcon size={80} color="rgba(37, 99, 235, 0.1)">
              <IconSymbol size={40} name="person.fill" color="#2563EB" />
            </CoachIcon>
            
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.heroTitle}>Ready to crush today's workout?</Text>
            <Text style={styles.heroSubtitle}>
              I'm here to help you track every rep, set, and milestone
            </Text>
          </View>

          {/* Coach Message */}
          <CoachMessage>
            <CoachMessageText>
              🔥 You've been consistent this week! Let's keep the momentum going strong.
            </CoachMessageText>
          </CoachMessage>

          {/* Main Action Button */}
          <View style={styles.mainActionContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
              <TouchableOpacity 
                style={styles.talkToCoachButton}
                onPress={handleStartWorkout}
              >
                <View style={styles.buttonInner}>
                  <IconSymbol size={48} name="mic.fill" color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.buttonLabel}>Talk to Coach</Text>
            <Text style={styles.buttonHint}>
              Tap to start a new workout session
            </Text>
          </View>

          {/* Quick Stats */}
          <Card variant="surface">
            <CardTitle>This Week</CardTitle>
            <StatsGrid>
              <StatItem>
                <StatValue>0</StatValue>
                <StatLabel>Workouts</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>0</StatValue>
                <StatLabel>Exercises</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>0 min</StatValue>
                <StatLabel>Total Time</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>0 lbs</StatValue>
                <StatLabel>Volume</StatLabel>
              </StatItem>
            </StatsGrid>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleViewHistory}>
              <IconSymbol size={24} name="clock.fill" color="#64748B" />
              <Text style={styles.quickActionText}>View History</Text>
              <IconSymbol size={16} name="chevron.right" color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <IconSymbol size={24} name="chart.bar.fill" color="#64748B" />
              <Text style={styles.quickActionText}>Progress</Text>
              <IconSymbol size={16} name="chevron.right" color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <IconSymbol size={24} name="target" color="#64748B" />
              <Text style={styles.quickActionText}>Goals</Text>
              <IconSymbol size={16} name="chevron.right" color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Coach Tip */}
          <Card>
            <View style={styles.tipHeader}>
              <IconSymbol size={20} name="lightbulb.fill" color="#F59E0B" />
              <Text style={styles.tipTitle}>Coach's Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Consistency beats perfection! Even a 15-minute workout is better than skipping entirely.
            </Text>
          </Card>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  mainActionContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  talkToCoachButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  buttonHint: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  quickActions: {
    marginVertical: 32,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginLeft: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});
