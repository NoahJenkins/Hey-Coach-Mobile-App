# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hey Coach is a voice-first workout logging mobile app built with Expo/React Native. Users speak their exercises to an AI "Coach" that parses workout data and provides personalized recommendations. The app supports strength training, cardio, yoga, and flexibility exercises with comprehensive voice recognition and exercise matching.

## Common Development Commands

### Building and Running
- Start development server: `npx expo start`
- Run on iOS simulator: `npm run ios` 
- Run on Android emulator: `npm run android`
- Run on web: `npm run web`
- Lint code: `npm run lint`
- TypeScript check: `npx tsc --noEmit`
- Reset project: `npm run reset-project`

### Testing
- No test scripts currently configured in package.json

## Architecture Overview

### Core Services Architecture
The app follows a service-oriented architecture with these key services:

- **VoiceRecordingService** (`services/voice/VoiceRecordingService.ts`): Handles audio recording, speech-to-text processing, and Coach voice responses using expo-av and expo-speech
- **ExerciseMatchingService** (`services/exercise/ExerciseMatchingService.ts`): Uses Fuse.js for fuzzy matching exercise names against a comprehensive database with aliases and synonyms
- **WorkoutSessionService** (`services/workout/WorkoutSessionService.ts`): Manages active workout sessions, tracks time, calculates stats, and generates Coach recommendations
- **DatabaseService** (`services/storage/DatabaseService.ts`): SQLite-based local storage for workouts and user data
- **SettingsService** (`services/storage/SettingsService.ts`): AsyncStorage-based user preferences management

### Navigation Structure
Uses Expo Router with file-based routing:
- Tab navigation: `app/(tabs)/` - Dashboard, History, Settings
- Modal screens: `app/workout.tsx` (active workout), `app/workout-summary.tsx`
- Root layout: `app/_layout.tsx` configures theme and navigation stack

### Data Models
Comprehensive TypeScript interfaces in `types/index.ts`:
- **Workout**: Contains exercises, coach recommendations, insights, and session metadata
- **Exercise**: Supports strength, cardio, yoga, and flexibility with sets/duration/distance tracking
- **ExerciseSet**: Flexible structure for reps, weight, duration, rest time, pace, distance
- **CoachRecommendation**: AI-generated recovery/nutrition/training advice with priority and timeframe
- **UserSettings**: Preferences for auto-save, confirmation levels, units, default rest times

### Exercise Database System
Local exercise database (`data/exerciseDatabase.ts`) with 20+ exercises across categories:
- Each exercise has name, aliases array, muscle groups, category, equipment, movement pattern, difficulty
- Fuzzy matching handles variations like "bench" → "Barbell Bench Press"
- Helper functions for filtering by category, muscle group, equipment

### Voice Processing Pipeline
1. **Audio Recording**: expo-av for high-quality audio capture
2. **Speech-to-Text**: Currently uses mock transcripts (expo-speech doesn't include STT)
3. **Exercise Recognition**: Fuse.js fuzzy matching against exercise database
4. **Data Parsing**: Extract sets, reps, weights, rest times from natural language
5. **Coach Response**: expo-speech for AI personality voice feedback

### State Management
- React hooks and Context API for state management
- Service singletons exported for cross-component access
- Real-time listeners for workout session updates
- Auto-save functionality based on user settings

### UI Component System
- Uses styled-components for consistent theming
- Custom components: VoiceRecordingButton with animated states
- Theme-aware components supporting light/dark mode
- Platform-specific UI elements (IconSymbol.ios.tsx)

### Key Dependencies
- **Expo SDK**: Core framework with router, audio, speech, SQLite, haptics
- **React Native**: Base mobile framework with navigation, elements, vector icons
- **Fuse.js**: Fuzzy search for exercise matching
- **OpenAI**: AI integration for Coach personality and recommendations
- **styled-components**: Component styling system
- **victory-native**: Data visualization for workout charts

### Development Patterns
- Service classes as singletons with exported instances
- Async/await pattern throughout for database and API operations
- Error handling with try/catch and user-friendly alerts
- TypeScript strict mode enabled with path aliases (`@/*`)
- Component props interfaces for type safety
- Separation of business logic (services) from UI (components)

### Coach AI Integration
- Personality-driven responses with encouraging, knowledgeable tone
- Context-aware recommendations based on workout history and patterns
- Real-time voice feedback during workout sessions
- Post-workout insights and recovery recommendations
- Progress tracking and milestone celebrations

### File Organization
- `app/`: Expo Router screens and layouts
- `components/`: Reusable UI components with styled variants
- `services/`: Business logic services with clear responsibilities
- `types/`: Comprehensive TypeScript type definitions
- `data/`: Static data like exercise database
- `hooks/`: Custom React hooks for theme and color scheme
- `constants/`: App-wide constants like color schemes
- `assets/`: Images, fonts, and other static assets