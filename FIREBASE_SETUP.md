# Firebase Setup Guide for CardLink

This guide will walk you through setting up Firebase for the CardLink application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "cardlink-app")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase Console, select your project
2. Click on "Authentication" in the left sidebar
3. Click "Get started"
4. Under "Sign-in method" tab, click on "Email/Password"
5. Enable "Email/Password" provider
6. Click "Save"

## Step 3: Create Firestore Database

1. In the Firebase Console, click on "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
   - **Important:** You'll update security rules later
4. Choose a Cloud Firestore location (select closest to your users)
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, click on the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cards collection
    match /cards/{cardId} {
      // Allow authenticated users to create cards
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Allow authenticated users to update their own cards
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow users to read their own cards
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow anyone to read individual cards (for public sharing)
      allow get: if true;
      
      // Allow users to delete their own cards
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "CardLink Web")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. In your project root, create a `.env.local` file:

```bash
cp .env.example .env.local
```

2. Fill in the values from your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxx
```

## Step 7: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:5173`
3. Click "Sign Up" and create a test account
4. Try creating a card

## Step 8: Verify Data in Firestore

1. Go back to Firebase Console → Firestore Database
2. You should see two collections:
   - `users` - Contains user profiles
   - `cards` - Contains visiting card data

## Firestore Data Structure

### Users Collection
```
/users/{userId}
  ├── email: string
  ├── name: string (optional)
  └── updatedAt: timestamp
```

### Cards Collection
```
/cards/{cardId}
  ├── userId: string
  ├── name: string
  ├── title: string
  ├── company: string
  ├── email: string
  ├── phone: string
  ├── website: string
  ├── address: string
  ├── linkedin: string (optional)
  ├── twitter: string (optional)
  ├── templateId: string
  ├── customColors: object (optional)
  ├── elementStyles: object (optional)
  ├── views: number
  ├── shares: number
  ├── downloads: number
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

## Production Deployment

### Update Security Rules for Production

Before deploying to production, update your Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Cards collection
    match /cards/{cardId} {
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      allow update: if isOwner(resource.data.userId) &&
                       request.resource.data.userId == resource.data.userId;
      
      allow delete: if isOwner(resource.data.userId);
      
      // Users can list their own cards
      allow list: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Anyone can view a single card (for public sharing)
      allow get: if true;
    }
  }
}
```

### Environment Variables for Production

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. **Never** commit `.env.local` to version control
3. Keep your Firebase API keys secure

## Monitoring and Limits

### Firebase Free Tier Limits (Spark Plan)

- **Authentication**: Unlimited users
- **Firestore**:
  - 1 GiB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day

### Monitor Usage

1. Go to Firebase Console → Usage and billing
2. Track your usage to avoid hitting limits
3. Consider upgrading to Blaze plan if needed

## Troubleshooting

### Issue: "Firebase: Error (auth/email-already-in-use)"
**Solution**: The email is already registered. Use a different email or sign in.

### Issue: "Missing or insufficient permissions"
**Solution**: 
1. Check Firestore security rules are published
2. Verify user is authenticated
3. Check userId in card data matches authenticated user

### Issue: Cards not loading
**Solution**:
1. Check browser console for errors
2. Verify Firebase configuration in `.env.local`
3. Check network tab for failed requests
4. Verify Firestore rules allow read access

### Issue: Environment variables not working
**Solution**:
1. Restart development server after changing `.env.local`
2. Verify variable names start with `VITE_`
3. Check for typos in variable names

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Review browser console logs
3. Verify all setup steps were completed
4. Check Firebase status page for outages
