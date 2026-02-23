# CardLink Architecture Overview

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Entry Point                           │
│                       main.tsx                               │
│  (BrowserRouter + AuthProvider + App)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    AppRouted.tsx                             │
│             Main routing and auth checks                     │
└────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
     │          │          │          │          │
     ▼          ▼          ▼          ▼          ▼
  /login    /signup   /dashboard  /card/:id    /
    │          │          │         │
    │          │          │         │
    ▼          ▼          ▼         ▼
  Login     SignUp   Authenticated PublicCard
  Page      Page        App        Viewer
```

## State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   AuthContext.tsx                            │
│  - currentUser (Firebase Auth)                               │
│  - login() / logout()                                        │
│  - signup()                                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    LoginPage    SignUpPage  AppRouted
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  AuthenticatedApp      │
        │  (Dashboard + Creator) │
        └────────────────────────┘
```

## Data Flow

### Creating/Editing a Card

```
CardCreator
    │
    ├─ CardForm (gets input data)
    │
    ├─ CardPreviewDraggable (live preview with drag/resize)
    │   ├─ Drag elements → update elementStyles
    │   ├─ Resize fonts → update elementStyles
    │   └─ Display uses updated elementStyles
    │
    └─ handleSaveCard()
        │
        ├─ Collect all card data + elementStyles
        │
        └─ saveCardToFirestore()
            └─ Firebase Firestore (cloud storage)
```

### Viewing Cards

#### Dashboard View
```
Dashboard
    │
    ├─ Load: getUserCards(userId)
    │
    ├─ Display: CardPreview (read-only)
    │
    └─ Actions:
       ├─ Edit → CardCreator
       ├─ Delete → deleteCardFromFirestore()
       └─ View → CardViewer
```

#### Public Share View
```
QRCodeModal
    │
    ├─ Generate URL: /card/{cardId}
    │
    ├─ Generate QR Code
    │
    └─ Share options:
       ├─ Copy Link
       └─ Download QR Image
```

#### Public Viewer
```
PublicCardViewer
    │
    ├─ Load: getCardById(cardId)
    │
    ├─ Apply elementStyles from database
    │
    ├─ Increment views counter
    │
    └─ Display card with custom layout
```

## Component Tree

```
App (AppRouted.tsx)
│
├─ Routes
│  ├─ /login → LoginPage
│  ├─ /signup → SignUpPage
│  ├─ /dashboard → AuthenticatedApp
│  │  ├─ Header (with logout)
│  │  ├─ Main
│  │  │  ├─ Dashboard
│  │  │  │  ├─ Stats Cards
│  │  │  │  └─ Cards Grid
│  │  │  │     └─ CardPreview (read-only)
│  │  │  │        └─ CardTemplate rendering
│  │  │  ├─ CardCreator (edit mode)
│  │  │  │  ├─ CardForm
│  │  │  │  │  ├─ Tabs
│  │  │  │  │  │  ├─ Card Information
│  │  │  │  │  │  └─ Custom Colors
│  │  │  │  │  └─ Submit/Cancel buttons
│  │  │  │  ├─ CardPreviewDraggable
│  │  │  │  │  ├─ Edit/View Toggle
│  │  │  │  │  ├─ Draggable Elements
│  │  │  │  │  │  ├─ Name (draggable + resizable)
│  │  │  │  │  │  ├─ Title (draggable + resizable)
│  │  │  │  │  │  ├─ Company (draggable + resizable)
│  │  │  │  │  │  ├─ Email (draggable + resizable)
│  │  │  │  │  │  ├─ Phone (draggable + resizable)
│  │  │  │  │  │  ├─ Website (draggable + resizable)
│  │  │  │  │  │  └─ Address (draggable + resizable)
│  │  │  │  │  └─ Font Size Sliders
│  │  │  │  ├─ Share Button
│  │  │  │  └─ QRCodeModal
│  │  │  │     ├─ QR Code Display
│  │  │  │     ├─ Copy Link Button
│  │  │  │     └─ Download Button
│  │  │  ├─ CardViewer (read-only view)
│  │  │  └─ Toaster (notifications)
│  │  │
│  │  └─ PublicCardViewer
│  │     ├─ Load card data
│  │     └─ Display with elementStyles
│
└─ AuthProvider (context)
   └─ Firebase Auth integration
```

## Firebase Integration

### Firestore Structure

```
/database
├─ /cards/{cardId}
│  ├─ userId: string
│  ├─ name: string
│  ├─ title: string
│  ├─ company: string
│  ├─ email: string
│  ├─ phone: string
│  ├─ website: string
│  ├─ address: string
│  ├─ linkedin?: string
│  ├─ twitter?: string
│  ├─ templateId: string
│  ├─ customColors?: { primary, secondary, text, background }
│  ├─ elementStyles?: {
│  │  name: { fontSize, position: { x, y } }
│  │  title: { fontSize, position: { x, y } }
│  │  company: { fontSize, position: { x, y } }
│  │  ... (one for each element)
│  ├─ createdAt: timestamp
│  ├─ updatedAt: timestamp
│  ├─ views: number
│  ├─ shares: number
│  └─ downloads: number
```

### Authentication Flow

```
User enters email/password
        │
        ▼
   Firebase Auth
        │
    ┌───┴───┐
    │       │
    ▼       ▼
 Signup  Login
    │       │
    ├───┬───┤
    │   │   │
    ▼   ▼   ▼
  User created or updated in Firebase
        │
        ▼
  Set Auth Context
        │
        ▼
  AuthProvider updates all children
        │
        ▼
  AppRouted checks user state
        │
    ┌───┴───┐
    │       │
    ▼       ▼
  Logged in  Not logged in
    │       │
    ▼       ▼
 /dashboard /login
```

## Data Persistence Flow

```
User Action (create/edit card)
        │
        ▼
CardCreator collects data
        │
        ├─ Basic info: name, title, company, email...
        └─ Styles: elementStyles (positions, font sizes)
        │
        ▼
handleSaveCard() in AppRouted
        │
        ▼
saveCardToFirestore(userId, cardData)
        │
        ├─ Add userId for security
        ├─ Add createdAt/updatedAt timestamps
        ├─ Include elementStyles
        │
        ▼
Firebase Firestore
        │
        ├─ Store document
        └─ Encrypt at rest
        │
        ▼
Success toast notification
        │
        ▼
Reload user cards from Firestore
        │
        ▼
Dashboard updates with new/modified card
```

## Public Sharing Flow

```
User clicks "Share" button
        │
        ▼
QRCodeModal opens
        │
        ├─ Generate public URL: /card/{cardId}
        ├─ Generate QR code from URL
        └─ Show options: Copy Link or Download QR
        │
        ▼
User shares via:
├─ Copy & paste link
├─ Email with QR
├─ Social media with QR image
        │
        ▼
Friend/contact clicks link or scans QR
        │
        ▼
Browser navigates to /card/{cardId}
        │
        ▼
PublicCardViewer component
        │
        ├─ Fetch card from Firestore (no auth needed)
        ├─ Apply elementStyles
        ├─ Increment views counter
        │
        ▼
Display card with custom layout
        │
        └─ No login required!
```

## Routing & Authentication

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser URL                             │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Check Auth Context    │
         │ (user exists?)        │
         └────┬──────────┬────┬──┘
              │          │    │
         yes  │      no  │    │ public
              │          │    │
              ▼          ▼    ▼
        /dashboard    /login /card/*
           (OK)    (redirect) (OK)
           
        All routes check auth state
        - Protected: /dashboard
        - Public: /login, /signup, /card/*
```

## Performance Considerations

1. **Data Loading**: Only load user's own cards on dashboard
2. **Public Cards**: Cached in browser for faster loading
3. **QR Generation**: Client-side only, no server load
4. **Firestore Queries**: Indexed by userId for fast lookups
5. **Component Re-renders**: Minimized with proper useState/useEffect

## Security Measures

1. **Authentication**: Firebase handles password hashing
2. **Authorization**: userId check in Firestore operations
3. **Public Cards**: Doesn't expose user credentials
4. **Environment Variables**: Keep sensitive keys out of code
5. **CORS**: Handled by Firebase

## Error Handling

```
Operation
    │
    ├─ Success → update UI, show toast
    │
    └─ Error:
       ├─ Network error → offline toast
       ├─ Auth error → redirect to login
       ├─ Firestore error → show error toast
       └─ Validation error → form feedback
```

This architecture ensures:
- ✅ Secure authentication
- ✅ Persistent cloud storage
- ✅ Easy sharing with public links
- ✅ Draggable customizable layouts
- ✅ Scalable to multiple users
- ✅ Responsive mobile support
