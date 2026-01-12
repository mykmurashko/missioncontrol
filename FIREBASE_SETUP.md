# Firebase Setup Instructions

This app uses Firebase Realtime Database to sync data across all users in real-time. When one user updates sprint data, it automatically appears for all other users.

## Setup Steps

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 3. Enable Realtime Database

1. In Firebase Console, go to **Build > Realtime Database**
2. Click **"Create Database"**
3. Choose your preferred location (e.g., `us-central1`)
4. Start in **"test mode"** for development (you can add security rules later)
5. Copy the database URL (it will look like: `https://your-project-id-default-rtdb.firebaseio.com/`)

### 4. Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the web icon (`</>`) to add a web app
4. Register your app (you can name it "Mission Control")
5. Copy the config values shown

### 5. Environment File ✅

The `.env` file has been created with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSyBGCRxDvLTwmjZP6fc2obT7SnohOvPMkL4
VITE_FIREBASE_AUTH_DOMAIN=mission-control-586fc.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mission-control-586fc-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mission-control-586fc
VITE_FIREBASE_STORAGE_BUCKET=mission-control-586fc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=143118939580
VITE_FIREBASE_APP_ID=1:143118939580:web:3a77c7e9212130123327b9
```

**✅ Configuration complete!** All Firebase values are set.

### 6. Security Rules (Optional but Recommended)

For production, update your Realtime Database security rules in Firebase Console:

1. Go to **Build > Realtime Database > Rules**
2. Replace the default rules with:

```json
{
  "rules": {
    "mission-control-state": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Note:** The above rules allow anyone to read/write. For production, you should add authentication and restrict access. For now, test mode is fine for development.

### 6. Install Firebase SDK (if not already done)

```bash
npm install firebase
```

### 7. Restart Your Dev Server

After the `.env` file is set up, restart your development server:

```bash
npm run dev
```

The app should now connect to Firebase and sync data in real-time! 🎉

## How It Works

- All app state (including sprint data) is stored in Firebase Realtime Database
- When any user makes a change, it's automatically synced to all other connected users
- Changes are debounced (500ms) to avoid excessive writes
- The app shows a connection status indicator if offline
- If Firebase is unavailable, the app falls back to default state

## Troubleshooting

- **"Firebase configuration is missing"**: Make sure your `.env` file exists and has all required variables
- **Connection issues**: Check that Realtime Database is enabled in Firebase Console
- **Permission errors**: Make sure your database rules allow read/write access
- **Data not syncing**: Check browser console for errors and verify your database URL is correct
