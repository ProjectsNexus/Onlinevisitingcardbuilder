# Quick Start Guide - CardLink

Get your enhanced CardLink app running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

The new dependencies will be installed:
- `firebase` - Authentication and database
- `react-draggable` - Drag functionality
- `qrcode.react` - QR code generation

## Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Go to **Settings → Project Settings**
4. Copy your config values under "Your apps"

Example:
```
API Key: AIzaSy...
Auth Domain: myproject.firebaseapp.com
Project ID: myproject-id
Storage Bucket: myproject.appspot.com
Messaging Sender ID: 123456789
App ID: 1:123456789:web:abc123...
```

## Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myproject-id
VITE_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Save changes

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or configure security rules)
4. Select your region
5. Click **Create**

## Step 6: Run the App

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 7: Test the Features

### Create an Account
1. Click "Sign Up"
2. Enter email and password
3. Click "Create Account"

### Create a Card
1. Go to Dashboard
2. Click "Create New Card"
3. Select a template
4. Fill in your information
5. Click **Edit Layout** to:
   - Drag elements to reposition
   - Adjust font sizes with sliders
6. Click "Save Card"

### Share a Card
1. From dashboard, open a saved card
2. Click "Share" button
3. Option 1: Copy the public link
4. Option 2: Download QR code
5. Share with anyone!

## Key Features

### Drag & Drop Layout
- **Edit Layout** button enables dragging mode
- Drag any text element to customize positions
- Use font size sliders for text adjustments
- **Done Editing** saves your layout

### Firebase Authentication
- Secure login/signup
- Password hashing and session management
- Automatic user linking for all cards

### Cloud Storage
- All cards saved to Firestore
- Access from any device
- Real-time sync

### QR Code Sharing
- Generate QR code for any card
- Download as image
- Copy shareable link
- Public viewers don't need login

## Troubleshooting

### "Firebase is not configured"
- Check `.env.local` file exists
- Verify all 6 environment variables are set
- Restart dev server after adding `.env.local`

### Can't login
- Check Email/Password auth is enabled in Firebase
- Verify Firebase project ID in `.env.local`
- Check browser console for error messages

### Cards not saving
- Confirm Firestore Database is created
- Check user is authenticated
- Look for errors in browser console

### Drag doesn't work
- Click "Edit Layout" button first
- Refresh page if needed
- Check browser console

## Next Steps

1. Customize templates in `src/app/data/templates.ts`
2. Add custom branding
3. Deploy to production (see DEPLOYMENT.md)
4. Configure Firestore security rules (see IMPLEMENTATION_GUIDE.md)
5. Set up email notifications

## Need Help?

- Check `IMPLEMENTATION_GUIDE.md` for detailed documentation
- Review `FIREBASE_SETUP.md` for Firebase configuration
- Look at `CHANGES.md` for what's new
- Check browser console for error messages

## Demo Account (Testing)

For testing without creating new accounts:
```
Email: test@example.com
Password: Test123456
```

*(Create this manually in Firebase Console under Authentication)*

---

**Ready to go!** Your CardLink app with drag, Firebase auth, and QR sharing is ready to use. 🎉
