# CardLink - Complete Implementation Guide

This guide documents all the features added to the visiting card builder application, including draggable preview elements, Firebase authentication, Firestore storage, and QR code generation.

## Features Implemented

### 1. Drag & Font Size Controls
- **Location**: `CardPreviewDraggable.tsx`
- **Features**:
  - Toggle between edit and view modes in the preview
  - Drag card elements (name, title, company, etc.) to customize layout
  - Adjust font size for each element with slider controls
  - Real-time position and font size updates stored in `elementStyles`

**How to Use**:
1. Click "Edit Layout" button in the preview card
2. Drag elements to reposition them
3. Use font size sliders to adjust text size
4. Click "Done Editing" to lock the layout

### 2. Firebase Authentication
- **Location**: `contexts/AuthContext.tsx`, `pages/LoginPage.tsx`, `pages/SignUpPage.tsx`
- **Features**:
  - Email/password authentication
  - User registration with validation
  - Secure session management
  - Automatic user context throughout the app

**Setup**:
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Copy your Firebase config values
4. Set environment variables (see below)

### 3. Firestore Storage
- **Location**: `utils/firebaseStorage.ts`
- **Features**:
  - Cloud storage for all user cards
  - Automatic userId linking for data isolation
  - Full CRUD operations (Create, Read, Update, Delete)
  - Persistent storage across sessions

**Database Structure**:
```
/cards/{cardId}
  - userId: string
  - name: string
  - title: string
  - company: string
  - email: string
  - phone: string
  - website: string
  - address: string
  - linkedin?: string
  - twitter?: string
  - templateId: string
  - customColors?: object
  - elementStyles?: object
  - createdAt: timestamp
  - updatedAt: timestamp
  - views: number
  - shares: number
  - downloads: number
```

### 4. QR Code Generation & Sharing
- **Location**: `components/QRCodeModal.tsx`
- **Features**:
  - Generate QR codes that link to your card
  - Download QR code as image
  - Copy card link to clipboard
  - Share button in card editor

**URL Format**:
- Public card viewer: `https://yourapp.com/card/{cardId}`
- QR codes point to this public URL

### 5. Public Card Viewer
- **Location**: `components/PublicCardViewer.tsx`
- **Features**:
  - View cards without authentication
  - Increments view counter automatically
  - Responsive design works on all devices
  - Respects custom layouts and font sizes

**Route**: `/card/{cardId}`

## Environment Variables

Create a `.env.local` file in your project root with these Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## File Structure

```
src/app/
├── AppRouted.tsx                    # Main routing component
├── App.tsx                          # Simple wrapper
├── components/
│   ├── CardCreator.tsx              # Card creation/editing
│   ├── CardPreviewDraggable.tsx      # Preview with drag/resize
│   ├── QRCodeModal.tsx              # QR code sharing
│   ├── PublicCardViewer.tsx          # Public card display
│   ├── Dashboard.tsx                # Card management
│   ├── CardForm.tsx                 # Card details form
│   └── ... (other existing components)
├── pages/
│   ├── LoginPage.tsx                # Login form
│   └── SignUpPage.tsx               # Registration form
├── contexts/
│   └── AuthContext.tsx              # Firebase auth provider
├── config/
│   └── firebase.ts                  # Firebase initialization
├── utils/
│   ├── firebaseStorage.ts           # Firestore operations
│   └── storage.ts                   # Legacy localStorage (deprecated)
└── types/
    └── card.ts                      # Updated with new interfaces
```

## Component APIs

### CardPreviewDraggable
```tsx
interface Props {
  card: VisitingCard;
  isEditing: boolean;
  onUpdateStyles: (elementName: string, fontSize: number, position: ElementPosition) => void;
  template: CardTemplate;
}
```

### QRCodeModal
```tsx
interface Props {
  cardId: string;
  cardName: string;
  isOpen: boolean;
  onClose: () => void;
}
```

### PublicCardViewer
Automatically loads card from URL parameter `cardId` and displays it publicly.

## Authentication Flow

1. User lands on app → redirected to `/login`
2. Can sign up with email/password
3. After login → redirected to `/dashboard`
4. Dashboard shows user's cards
5. Can create, edit, delete, view, and share cards
6. Each card gets unique shareable URL with QR code

## Data Persistence

- **Before**: localStorage (single device, lost on clear)
- **After**: Firestore (cloud storage, accessible anywhere)
- Cards are linked to user account automatically
- All changes sync instantly to cloud

## Key Dependencies Added

```json
{
  "firebase": "^10.7.0",           // Firebase SDK
  "react-draggable": "^4.4.6",     // Drag functionality
  "qrcode.react": "^1.0.1"         // QR code generation
}
```

## Security Considerations

1. **Authentication**: Firebase handles password hashing and session security
2. **Database Access**: Firestore rules should be configured to restrict access to user's own cards
3. **Public Cards**: Public viewer doesn't expose user email or sensitive data
4. **Environment Variables**: Keep Firebase credentials secure, never commit to git

## Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      // Allow users to read their own cards and public cards
      allow read: if request.auth.uid == resource.data.userId || 
                     resource.data.public == true;
      // Allow users to write only their own cards
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Troubleshooting

### Cards not saving
- Check Firebase credentials in `.env.local`
- Verify Firestore is enabled in Firebase console
- Check browser console for error messages

### Authentication errors
- Confirm Firebase Email/Password authentication is enabled
- Check that user email is valid
- Verify Firebase project ID matches config

### QR codes not working
- Ensure `qrcode.react` dependency is installed
- Check that card ID is valid
- Verify public card route is accessible

## Future Enhancements

- User profile customization
- Analytics dashboard (views, shares, downloads)
- Card templates library
- Email integration for sharing
- PDF export functionality
- Custom domain support for public cards
