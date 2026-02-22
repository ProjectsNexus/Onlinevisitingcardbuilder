# Firebase Setup Guide for CardLink

This guide will help you configure Firebase for the CardLink application with authentication and Firestore database.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "CardLink")
4. Follow the setup wizard and create the project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Save your changes

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your preferred location
5. Click **Enable**

## Step 4: Setup Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read a card for public viewing
    match /visitingCards/{cardId} {
      allow read: if true;
      allow create, update: if request.auth.uid != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, find your web app (or create one if you haven't)
3. Copy the Firebase configuration object
4. Create a `.env.local` file in your project root with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## Step 6: Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

## Step 7: Run the Application

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## Features Overview

### Authentication
- Sign up with email and password
- Sign in to your account
- Secure session management with Firebase Auth

### Card Management
- Create and edit digital visiting cards
- Drag and reposition card elements in edit mode
- Adjust font sizes for each card element
- Save all changes to Firestore

### Sharing & QR Codes
- Generate QR codes that link to your card
- Share cards via QR code or direct link
- Public card viewer (no authentication required to view)
- Track views, shares, and downloads

### Dashboard
- View all your cards in one place
- Monitor card statistics (views, shares, downloads)
- Edit or delete cards
- Create new cards with templates

## Troubleshooting

### Firebase credentials not loading
- Make sure `.env.local` is in your project root
- Restart your dev server after updating `.env.local`
- Check that all environment variables are correctly formatted

### Cards not saving
- Verify Firestore is enabled in your Firebase project
- Check Firestore security rules are correctly set up
- Make sure you're logged in before creating/editing cards

### QR code not working
- Ensure the card has been saved with a valid ID
- Check that the public card viewer route is accessible
- Verify Firestore security rules allow public read access

## File Structure

```
src/app/
├── config/
│   └── firebase.ts           # Firebase initialization
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── utils/
│   ├── storage.ts            # Local storage utilities
│   └── firebaseStorage.ts    # Firestore utilities
├── pages/
│   ├── LoginPage.tsx         # Login page
│   └── SignUpPage.tsx        # Sign up page
├── components/
│   ├── CardPreviewDraggable.tsx   # Draggable preview with font size controls
│   ├── QRCodeModal.tsx            # QR code generation and sharing
│   ├── PublicCardViewer.tsx       # Public card viewing
│   └── ...other components
└── App.tsx                   # Main app with routing
```

## Next Steps

1. Deploy to production using Vercel, Netlify, or your preferred platform
2. Update your Firestore security rules for production
3. Configure custom domain (optional)
4. Set up analytics and monitoring

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)
