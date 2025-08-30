# Hey Coach Mobile App

Hey Coach is a voice-powered workout tracking application designed to make logging your fitness progress seamless and intuitive. Built with React Native and Expo, this app acts as a personal AI coach in your pocket, allowing you to focus on your workout while it handles the tracking.

## Features

*   **Voice-Controlled Workouts:** Start, track, and complete your workouts using voice commands.
*   **AI-Powered Coaching:** Get personalized recommendations and insights after each workout session.
*   **Detailed Tracking:** Log exercises, sets, reps, weight, and duration.
*   **Workout History:** Review your past workouts and track your progress over time.
*   **Tab-Based Navigation:** Easily switch between the main dashboard, workout history, and settings.
*   **Customizable Settings:** Adjust app settings to your preferences.

## Tech Stack

*   **Framework:** React Native with Expo
*   **Language:** TypeScript
*   **Navigation:** Expo Router
*   **State Management:** React Context and custom services
*   **Styling:** Styled Components
*   **Local Storage:** Expo SQLite and AsyncStorage
*   **AI:** OpenAI for voice recognition and coaching insights

## Getting Started

### Prerequisites

*   Node.js (v18 or newer)
*   Expo CLI
*   An OpenAI API key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/hey-coach-mobile-app.git
    cd hey-coach-mobile-app
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a file named `.env` in the root of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

### Running the App

*   To start the app on iOS:
    ```bash
    npm run ios
    ```

*   To start the app on Android:
    ```bash
    npm run android
    ```

*   To start the app on the web:
    ```bash
    npm run web
    ```

## Project Structure

The project is organized into the following main directories:

*   `app/`: Contains the application screens and navigation setup using Expo Router.
    *   `(tabs)/`: Defines the tab-based navigation layout and screens.
*   `assets/`: Stores static assets like images and fonts.
*   `components/`: Includes reusable UI components used throughout the app.
*   `constants/`: Holds constant values, such as color schemes.
*   `data/`: Contains static data, like the exercise database.
*   `hooks/`: Stores custom React hooks.
*   `services/`: Contains the business logic for different parts of the application.
    *   `ai/`: Handles interactions with the OpenAI API.
    *   `database/`: Manages the local SQLite database.
    *   `storage/`: Provides services for local storage.
    *   `workout/`: Manages the workout session logic.
*   `types/`: Defines the TypeScript types used in the project.