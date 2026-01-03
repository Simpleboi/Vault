# Firebase Setup Guide

This guide will help you set up Firebase Firestore for your Vault password manager.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or **Create a project**
3. Enter a project name (e.g., "vault-password-manager")
4. (Optional) Enable Google Analytics
5. Click **Create project**

## Step 2: Enable Firebase Authentication

1. In your Firebase project, click **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**

## Step 3: Create Firestore Database

1. In your Firebase project, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll set up security rules next)
4. Select a location closest to you
5. Click **Enable**

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own password entries
    match /passwords/{passwordId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Your Firebase Configuration

1. In your Firebase project, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **Your apps** section
4. Click the **Web** icon `</>`
5. Register your app (give it a nickname like "Vault Web App")
6. You'll see your Firebase configuration object

## Step 6: Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase credentials from Step 5:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Important**: Never commit your `.env` file to version control!

## Step 7: Create Your First User

You have two options:

### Option A: Firebase Console (Recommended for first user)
1. Go to **Authentication** in Firebase Console
2. Click the **Users** tab
3. Click **Add user**
4. Enter an email and password
5. Click **Add user**

### Option B: Using the App
- Once your app is running, you can use the Firebase SDK to create users programmatically
- Note: You'll need to implement a sign-up UI (not included in current version)

## Step 8: Run Your App

```bash
npm run dev
```

Then open `http://localhost:5173` and sign in with the credentials you created!

## Firestore Data Structure

Your passwords are stored in Firestore with this structure:

**Collection**: `passwords`

**Document fields**:
- `userId` (string) - The authenticated user's UID
- `title` (string) - Password entry title
- `username` (string) - Username/email for the service
- `password` (string) - The password (stored as plain text - consider encryption)
- `url` (string, optional) - Website URL
- `notes` (string, optional) - Additional notes
- `category` (string, optional) - Category (Work, Coding, School, etc.)
- `strength` (string, optional) - Password strength (weak, medium, strong)
- `isCompromised` (boolean, optional) - Whether the password is compromised
- `lastModified` (timestamp) - When the entry was last updated

## Security Considerations

⚠️ **Important**: This setup stores passwords in **plain text** in Firestore. For a production password manager, you should:

1. **Encrypt passwords** before storing them in Firestore
2. Use your master password as the encryption key
3. Implement proper key derivation (PBKDF2, Argon2, etc.)
4. Never store the master password itself
5. Consider using Firebase Security Rules to add additional layers of protection

## Troubleshooting

### "Firebase: Error (auth/invalid-email)"
- Check that you're entering a valid email format

### "Firebase: Error (auth/user-not-found)"
- The user doesn't exist. Create the user in Firebase Console first.

### "Firebase: Error (auth/wrong-password)"
- The password is incorrect

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're signed in
- Verify the rules allow the authenticated user to access their data

### Environment variables not loading
- Make sure your `.env` file is in the root directory
- Restart your dev server after changing `.env`
- Check that variable names start with `VITE_`

## Next Steps

- Implement password encryption
- Add a sign-up page
- Add password reset functionality
- Implement two-factor authentication
- Add import/export functionality
