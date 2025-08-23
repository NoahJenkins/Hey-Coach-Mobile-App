import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

export default function HistoryScreen() {
  console.log('History screen rendered');
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.subtitle}>Your workout journey with Coach</Text>
        
        {/* Placeholder for workout history list */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>No workouts yet!</Text>
          <Text style={styles.placeholderSubtext}>Start your first workout to see it here.</Text>
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
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  placeholderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});