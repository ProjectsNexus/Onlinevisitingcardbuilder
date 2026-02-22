# CardLink - Digital Visiting Cards

A modern web application for creating, managing, and sharing digital visiting cards with drag-and-drop editing, QR code generation, and cloud storage.

## Features

### 🎨 Drag & Font Size Control
- **Edit Mode Toggle**: Switch between view and edit modes
- **Draggable Elements**: Reposition any card element by dragging
- **Font Size Control**: Adjust text size with intuitive sliders
- **Real-time Preview**: See changes instantly as you edit

### 🔐 Firebase Integration
- **Authentication**: Secure email/password signup and login
- **Cloud Storage**: Save cards to Firestore database
- **User-specific Data**: Each user only sees their own cards
- **Real-time Sync**: Changes sync across devices

### 📱 QR Code Generation
- **Instant QR Codes**: Generate scannable QR codes for any card
- **Shareable Links**: Get unique URLs for each card
- **Download QR**: Save QR code images for printing
- **Public Card View**: Anyone can view shared cards without login

### 🎯 Other Features
- **12+ Professional Templates**: Choose from various design categories
- **Custom Colors**: Personalize with your brand colors
- **Analytics Tracking**: Track views, shares, and downloads
- **Responsive Design**: Works on desktop, tablet, and mobile

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** with Email/Password provider
4. Create a **Firestore Database** (start in test mode for development)
5. Go to Project Settings > General > Your apps
6. Copy your Firebase configuration

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

Add these rules to your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cards collection
    match /cards/{cardId} {
      // Allow authenticated users to create/update their own cards
      allow create, update: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Allow users to read their own cards
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow anyone to read cards (for public sharing)
      allow get: if true;
      
      // Allow users to delete their own cards
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Run the Application

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:5173` in your browser.

## User Flow

### New User
1. Visit the app
2. Click "Sign up" 
3. Create an account with email/password
4. Get redirected to dashboard

### Creating a Card
1. Click "Create New Card"
2. Select a template from 12+ designs
3. Fill in your information (name, title, company, contact details)
4. (Optional) Customize colors
5. Toggle "Edit Layout" to:
   - Drag elements to reposition them
   - Click elements to adjust font sizes
6. Save the card

### Sharing a Card
1. Open your card in the dashboard
2. Click "Generate QR Code"
3. Options:
   - Download the QR code image
   - Copy the shareable link
   - Share directly via native share API

### Viewing a Shared Card
1. Scan QR code or visit shared link
2. View card details without login
3. Download or share the card
4. Analytics automatically tracked

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Drag & Drop**: react-draggable
- **QR Codes**: qrcode.react
- **UI Components**: Radix UI
- **Notifications**: Sonner

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── CardCreator.tsx       # Card creation/editing interface
│   │   ├── CardForm.tsx          # Form for card details
│   │   ├── CardPreview.tsx       # Preview with drag & edit
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── QRCodeModal.tsx       # QR code generation modal
│   │   ├── ProtectedRoute.tsx    # Route protection
│   │   └── ui/                   # Reusable UI components
│   ├── config/
│   │   └── firebase.ts           # Firebase configuration
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── pages/
│   │   ├── LoginPage.tsx         # Login page
│   │   ├── SignUpPage.tsx        # Registration page
│   │   ├── DashboardPage.tsx     # Main dashboard
│   │   └── PublicCardView.tsx    # Public card viewer
│   ├── services/
│   │   └── firebaseService.ts    # Firestore operations
│   ├── types/
│   │   └── card.ts               # TypeScript interfaces
│   ├── data/
│   │   └── templates.ts          # Card templates
│   └── App.tsx                   # Main app component
```

## Features in Detail

### Edit Mode

When edit mode is enabled:
- Click and drag any element to reposition it
- Active element is highlighted with blue border
- Click an element to see font size controls
- Adjust font size with slider (8-48px range)
- All changes saved with the card

### Templates

12 professionally designed templates across categories:
- **Professional**: Modern Minimal, Corporate Blue, Ocean Teal, Slate Dark
- **Creative**: Vibrant Gradient, Sunset Orange, Rose Pink, Mint Fresh, Crimson Bold
- **Luxury**: Elegant Gold, Royal Purple
- **Eco**: Nature Green

### Analytics

Track for each card:
- **Views**: Incremented when card is viewed
- **Shares**: Tracked when shared via native API or link copied
- **Downloads**: Counted when download button is clicked

## Development

### Adding New Templates

Edit `src/app/data/templates.ts`:

```typescript
{
  id: 'template-id',
  name: 'Template Name',
  category: 'Category',
  preview: 'preview',
  colors: {
    primary: '#hexcolor',
    secondary: '#hexcolor',
    text: '#hexcolor',
    background: '#hexcolor',
  },
}
```

### Customizing Element Styles

Default element positions and sizes are defined in `CardPreview.tsx`:

```typescript
const defaultElementStyles: ElementStyles = {
  name: { x: 0, y: 0, fontSize: 24 },
  title: { x: 0, y: 40, fontSize: 14 },
  // ... add more elements
};
```

## Troubleshooting

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase console for project status
- Ensure Authentication and Firestore are enabled

### QR Code Not Generating
- Make sure card is saved first
- Check browser console for errors
- Verify card ID is valid

### Drag Not Working
- Ensure edit mode is toggled ON
- Check that react-draggable is installed
- Try refreshing the page

## License

MIT License - feel free to use this project for personal or commercial purposes.
