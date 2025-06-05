# 🐾 Pet Health Hub

![Pet Health Hub](https://img.shields.io/badge/Status-Development-blue)

A comprehensive React-based web application for managing your pet's health, nutrition, and wellbeing enhanced with AI-powered features.

## 🌟 Features

### Core Features
- **Dashboard**: View all your pets at a glance and track important health metrics
- **Vitals Tracking**: Monitor weight, temperature, heart rate, and other health metrics
- **Medical Records**: Store and analyze veterinary visits, vaccinations, and treatments
- **Activity Tracking**: Record exercise, play time, and behavior patterns
- **Diet Management**: Track food intake, nutrition, and dietary needs
- **Settings**: Customize your profile and application preferences

### AI-Powered Features
- **Symptom Checker**: Analyze pet symptoms and get AI-powered health suggestions
- **Behavioral Analysis**: Get insights on pet behavior patterns and recommendations
- **Dietary Recommendations**: Receive personalized nutrition advice based on your pet's profile
- **Medical History Insights**: AI analysis of medical records for preventative care suggestions

## 🖥️ Technology Stack

- **Frontend**: React with Material-UI components
- **AI Integration**: Google Gemini API via Firebase Functions
- **Authentication**: Firebase Authentication (planned)
- **Database**: Firebase Firestore (planned)
- **Hosting**: Firebase Hosting (planned)

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Firebase account (for AI features and upcoming authentication/database features)

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/tronmooo/pet-health-hub.git
   cd pet-health-hub
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Firebase configuration
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firebase Functions
   - Update `firebaseConfig.js` with your project credentials

4. Start the development server
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## 🔧 AI Integration Setup

### Current Implementation
- The app uses mock responses for development (USE_ONLY_MOCK=true in GeminiService.js)
- Firebase Functions integration is prepared but requires deployment of backend functions

### Full AI Integration
1. Obtain a Google Gemini API key
2. Create Firebase Cloud Functions to securely call the Gemini API
3. Set USE_ONLY_MOCK=false in GeminiService.js to use real API calls

## 📱 Usage

1. Add pets to your dashboard
2. Record health metrics, medical visits, and activities
3. Use AI-powered features to analyze symptoms or behavior
4. Track diet and nutrition information
5. View trends and insights about your pet's health

## 📝 Future Enhancements

- User authentication and account management
- Persistent storage with Firebase Firestore
- Appointment scheduling and reminders
- Integration with veterinary services
- Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [Google Gemini AI](https://ai.google.dev/)
