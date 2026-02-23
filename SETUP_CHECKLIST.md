# CardLink Setup Checklist ✓

Use this checklist to track your setup progress.

## Prerequisites
- [ ] Node.js installed (v14+)
- [ ] npm/yarn/pnpm installed
- [ ] Firebase account (free tier OK)
- [ ] Text editor or IDE
- [ ] Git (optional)

## Part 1: Local Setup (5 minutes)

### Installation
- [ ] Clone/download the project
- [ ] Open terminal in project directory
- [ ] Run `npm install` (wait for all packages)
- [ ] Verify no errors in installation

### Environment File
- [ ] Create `.env.local` file in project root
- [ ] Keep it empty for now (you'll populate in Firebase step)

## Part 2: Firebase Setup (10 minutes)

### Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Create new project or use existing
- [ ] Wait for project to initialize
- [ ] Go to Settings → Project Settings

### Get Credentials
- [ ] Find "Your apps" section
- [ ] Copy API Key → `VITE_FIREBASE_API_KEY`
- [ ] Copy Auth Domain → `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Copy Project ID → `VITE_FIREBASE_PROJECT_ID`
- [ ] Copy Storage Bucket → `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Copy Messaging Sender ID → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Copy App ID → `VITE_FIREBASE_APP_ID`

### Add to .env.local
```
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

- [ ] Paste all 6 values into `.env.local`
- [ ] Save `.env.local` file

### Enable Authentication
- [ ] Go to Firebase Console
- [ ] Navigate to Authentication → Sign-in method
- [ ] Click Email/Password
- [ ] Toggle ON "Email/Password"
- [ ] Click Save
- [ ] See "Email/Password" now says "Enabled"

### Create Firestore Database
- [ ] Go to Firestore Database in Firebase
- [ ] Click "Create Database"
- [ ] Choose region (nearest to you)
- [ ] Select "Start in test mode" (for now)
- [ ] Click Create
- [ ] Wait for database creation (1-2 min)
- [ ] Verify you see "Firestore Database" in console

## Part 3: Run & Test (5 minutes)

### Start Development Server
- [ ] In terminal, run `npm run dev`
- [ ] Wait for compilation
- [ ] See message: "Local: http://localhost:5173"
- [ ] Open browser to http://localhost:5173

### Create Account
- [ ] Click "Sign Up"
- [ ] Enter test email: `test@example.com`
- [ ] Enter password: `TestPass123`
- [ ] Click "Create Account"
- [ ] Should redirect to dashboard

### Create First Card
- [ ] Click "Create New Card" button
- [ ] Select a template
- [ ] Fill in your information:
  - [ ] Name: "John Doe"
  - [ ] Title: "Software Engineer"
  - [ ] Company: "Acme Corp"
  - [ ] Email: "john@acme.com"
  - [ ] Phone: "+1 (555) 123-4567"
  - [ ] Website: "www.acme.com"
  - [ ] Address: "123 Business St"
- [ ] Click "Save Card"
- [ ] See success toast notification
- [ ] Redirected back to dashboard
- [ ] Card appears in grid

## Part 4: Test Features (10 minutes)

### Test Drag & Font Control
- [ ] Click "Edit" on your card
- [ ] See "Edit Layout" button in preview
- [ ] Click "Edit Layout"
- [ ] Try to drag the name field
- [ ] Name field should move with cursor
- [ ] Drag another element (title, company)
- [ ] Find font size slider
- [ ] Drag slider to change font size
- [ ] Size change is visible in preview
- [ ] Click "Done Editing"
- [ ] Refresh page
- [ ] Layout changes persist

### Test QR Code
- [ ] Go back to dashboard
- [ ] Click "Edit" on card again
- [ ] Click "Share" button
- [ ] Modal appears showing QR code
- [ ] See "Copy Link" button
- [ ] See "Download" button
- [ ] Click "Copy Link" (success toast)
- [ ] Click "Download" (QR image downloads)
- [ ] Close modal

### Test Public Viewer
- [ ] Copy the card link from QR modal
- [ ] Open new browser tab
- [ ] Paste the link (should look like: .../card/card-xxx)
- [ ] Page loads without login
- [ ] Card displays with your custom layout
- [ ] Refresh the page
- [ ] View counter in dashboard increases by 1

### Test Authentication
- [ ] Click "Logout" button
- [ ] Should redirect to login page
- [ ] Click "Sign Up"
- [ ] Create new account with different email
- [ ] New card doesn't appear (different user)
- [ ] Login with original account
- [ ] Original card still there

## Part 5: Database Verification (5 minutes)

### Check Firestore
- [ ] Go to Firebase Console
- [ ] Open Firestore Database
- [ ] Should see "cards" collection
- [ ] Click on cards
- [ ] Should see documents with card IDs
- [ ] Click on a card document
- [ ] Verify you see fields:
  - [ ] userId
  - [ ] name
  - [ ] title
  - [ ] company
  - [ ] elementStyles (if you dragged)
  - [ ] createdAt
  - [ ] updatedAt

### Check Authentication
- [ ] Go to Authentication → Users
- [ ] Should see your test users
- [ ] Verify email addresses match what you created

## Optional: Advanced Setup

### Security Rules
- [ ] Go to Firestore Rules
- [ ] Replace with secure rules (see IMPLEMENTATION_GUIDE.md)
- [ ] Publish rules
- [ ] Test in "test mode" still works

### Production Deploy
- [ ] Add environment variables to hosting platform
- [ ] Deploy to production
- [ ] Test all features work on live site
- [ ] Share QR code with real user
- [ ] Verify public viewer works

## Troubleshooting Quick Ref

### Problem: "Firebase config error"
**Solution**: 
- [ ] Check all 6 env vars are in `.env.local`
- [ ] Restart `npm run dev`
- [ ] No spaces or extra quotes

### Problem: "Can't sign up"
**Solution**:
- [ ] Check Email/Password auth is ON in Firebase
- [ ] Check password is at least 6 characters
- [ ] Check email format is valid

### Problem: "Card won't save"
**Solution**:
- [ ] Check Firestore database exists
- [ ] Check user is logged in
- [ ] Look at browser console for errors
- [ ] Verify Firebase credentials

### Problem: "Drag doesn't work"
**Solution**:
- [ ] Click "Edit Layout" button
- [ ] Make sure it says "Done Editing"
- [ ] Try dragging only in edit mode
- [ ] Refresh if still stuck

### Problem: "QR won't generate"
**Solution**:
- [ ] Make sure card is saved first
- [ ] Click "Share" button (shows after save)
- [ ] Try downloading instead of copying
- [ ] Check no blocking popup blockers

## Success Criteria

You're done when:
- [ ] Account created successfully
- [ ] Cards save to Firebase
- [ ] Can drag elements in edit mode
- [ ] Font size changes persist
- [ ] QR code generates
- [ ] Public link works without login
- [ ] View counter increments
- [ ] Can logout and login
- [ ] No errors in browser console

## Time Estimates

- Installation: 5 minutes
- Firebase setup: 10 minutes
- Running app: 5 minutes
- Testing features: 10 minutes
- Total: ~30 minutes

## Next Steps After Setup

1. **Customize**: Modify templates in `src/app/data/templates.ts`
2. **Branding**: Update colors and logo
3. **Deployment**: Follow DEPLOYMENT.md
4. **Rules**: Configure Firestore security rules
5. **Scaling**: Set up domains, emails, notifications

## Documentation Reference

- **QUICK_START.md** - Quick overview
- **FIREBASE_SETUP.md** - Detailed Firebase guide
- **IMPLEMENTATION_GUIDE.md** - Complete feature docs
- **ARCHITECTURE.md** - System design
- **CHANGES.md** - What was modified

## Support

If stuck:
1. Check the error message in browser console (F12)
2. Read the relevant guide above
3. Check QUICK_START.md troubleshooting
4. Check browser network tab (F12 → Network)

---

**Congratulations on completing setup!** 🎉

Your CardLink app with drag, Firebase auth, and QR sharing is ready to use.

Check out the guides for next steps and advanced features.
