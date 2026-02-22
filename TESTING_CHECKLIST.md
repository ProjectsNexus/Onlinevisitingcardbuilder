# Testing Checklist for CardLink

Use this checklist to verify all features are working correctly.

## ✅ Authentication Tests

### Sign Up
- [ ] Navigate to `/signup`
- [ ] Enter name, email, and password
- [ ] Password validation (min 6 characters)
- [ ] Password confirmation matches
- [ ] Successfully creates account
- [ ] Redirects to dashboard after signup
- [ ] User data saved in Firestore `/users` collection

### Login
- [ ] Navigate to `/login`
- [ ] Enter email and password
- [ ] Successfully logs in
- [ ] Redirects to dashboard
- [ ] Error shown for wrong credentials

### Logout
- [ ] Click logout button in dashboard
- [ ] Redirects to login page
- [ ] Cannot access protected routes after logout

### Protected Routes
- [ ] Cannot access `/dashboard` without login
- [ ] Automatically redirected to `/login`

## ✅ Card Creation Tests

### Template Selection
- [ ] Click "Create New Card"
- [ ] See 12+ templates displayed
- [ ] Templates grouped by category (Professional, Creative, Luxury, Eco)
- [ ] Select a template
- [ ] Advances to details step

### Form Validation
- [ ] Name field is required
- [ ] Title field is required
- [ ] Company field is required
- [ ] Email field is required and validates email format
- [ ] Phone, website, address are optional
- [ ] Social media fields are optional

### Custom Colors
- [ ] Switch to "Custom Colors" tab
- [ ] Color pickers work for all 4 colors (primary, secondary, text, background)
- [ ] Can enter hex codes manually
- [ ] Preview updates in real-time

### Save Card
- [ ] Fill in all required fields
- [ ] Click "Save Card"
- [ ] Shows "Saving..." state
- [ ] Success toast appears
- [ ] Returns to dashboard
- [ ] New card appears in dashboard
- [ ] Card saved in Firestore `/cards` collection

## ✅ Drag & Font Size Control Tests

### Edit Mode Toggle
- [ ] In card creator, see "Edit Layout" toggle
- [ ] Toggle ON activates edit mode
- [ ] Blue info banner appears explaining edit mode
- [ ] Toggle OFF deactivates edit mode

### Dragging Elements
- [ ] With edit mode ON, hover over card elements
- [ ] Elements show hover effect (ring border)
- [ ] Click and drag name element
- [ ] Element follows cursor
- [ ] Drop element in new position
- [ ] Position persists when toggling edit mode

### Font Size Control
- [ ] With edit mode ON, click an element
- [ ] Element highlights with blue ring
- [ ] Font size slider appears below card
- [ ] Move slider left/right
- [ ] Font size changes in real-time
- [ ] Font size between 8px and 48px
- [ ] New font size saved with card

### Multiple Elements
- [ ] Drag and resize multiple elements:
  - [ ] Name
  - [ ] Title
  - [ ] Company
  - [ ] Email
  - [ ] Phone
  - [ ] Website
  - [ ] Address
  - [ ] Social icons

## ✅ Card Management Tests

### Dashboard View
- [ ] Dashboard shows total statistics:
  - [ ] Total Cards count
  - [ ] Total Views count
  - [ ] Total Shares count
  - [ ] Total Downloads count
- [ ] Cards displayed in grid layout
- [ ] Each card shows preview
- [ ] Each card shows individual stats (views, shares, downloads)

### Edit Card
- [ ] Click edit button on a card
- [ ] Card data pre-fills form
- [ ] Can change any field
- [ ] Can change template
- [ ] Can adjust element positions (edit mode)
- [ ] Save updates card
- [ ] Returns to dashboard

### View Card
- [ ] Click "View" button on a card
- [ ] Navigates to public card view (`/card/{cardId}`)
- [ ] View count increments by 1
- [ ] Dashboard stats update

### Delete Card
- [ ] Click delete button on a card
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - nothing happens
- [ ] Click delete again
- [ ] Click "Delete" - card is removed
- [ ] Card removed from dashboard
- [ ] Card deleted from Firestore
- [ ] Success toast appears

## ✅ QR Code Generation Tests

### Generate QR Code
- [ ] Open card in creator/editor
- [ ] Click "Generate QR" button
- [ ] Modal opens with QR code
- [ ] QR code displays correctly
- [ ] Shareable link shown below QR code
- [ ] Link format: `https://domain.com/card/{cardId}`

### Copy Link
- [ ] Click "Copy Link" button
- [ ] Success toast appears
- [ ] Link copied to clipboard
- [ ] Can paste link in another tab

### Download QR Code
- [ ] Click "Download QR" button
- [ ] QR code image downloads
- [ ] File named: `{cardName}-qrcode.png`
- [ ] Image is clear and scannable

### Scan QR Code
- [ ] Use phone camera to scan QR code
- [ ] Link opens in browser
- [ ] Displays card correctly

## ✅ Public Card View Tests

### Access Without Login
- [ ] Open card URL in incognito window
- [ ] Card displays without login prompt
- [ ] All information visible
- [ ] Contact details shown correctly

### View Counter
- [ ] Open card in new tab
- [ ] View count increments
- [ ] Check dashboard - view count updated

### Share from Public View
- [ ] Click "Share" button
- [ ] Native share dialog opens (mobile) OR
- [ ] Link copies to clipboard (desktop)
- [ ] Share count increments

### Download from Public View
- [ ] Click "Download" button
- [ ] Download count increments
- [ ] Success toast appears

### Contact Links
- [ ] Email link opens mail client
- [ ] Phone link opens phone dialer (mobile)
- [ ] Website link opens in new tab
- [ ] Social media links work correctly

### CTA (Call to Action)
- [ ] "Get Started Free" button present
- [ ] Clicking button redirects to signup

## ✅ Analytics Tests

### View Tracking
- [ ] Create a card
- [ ] View it from dashboard
- [ ] Views: 1
- [ ] View again
- [ ] Views: 2

### Share Tracking
- [ ] Open card public view
- [ ] Click "Share" button
- [ ] Shares: 1
- [ ] Share again
- [ ] Shares: 2

### Download Tracking
- [ ] Click "Download" button
- [ ] Downloads: 1
- [ ] Download again
- [ ] Downloads: 2

### Dashboard Aggregation
- [ ] Create multiple cards
- [ ] View/share/download from different cards
- [ ] Dashboard shows correct totals

## ✅ Responsive Design Tests

### Desktop (1920x1080)
- [ ] Landing page displays correctly
- [ ] Dashboard grid shows 3 columns
- [ ] Card creator shows side-by-side layout
- [ ] All buttons visible

### Tablet (768x1024)
- [ ] Dashboard grid shows 2 columns
- [ ] Forms remain readable
- [ ] Navigation accessible

### Mobile (375x667)
- [ ] Landing page stacks vertically
- [ ] Dashboard shows 1 column
- [ ] Card creator stacks vertically
- [ ] Touch targets are large enough
- [ ] QR modal fits screen

## ✅ Browser Compatibility Tests

### Chrome
- [ ] All features work
- [ ] Drag and drop works
- [ ] QR codes display

### Firefox
- [ ] All features work
- [ ] Drag and drop works
- [ ] QR codes display

### Safari
- [ ] All features work
- [ ] Drag and drop works
- [ ] QR codes display

### Edge
- [ ] All features work
- [ ] Drag and drop works
- [ ] QR codes display

## ✅ Error Handling Tests

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save card
- [ ] Error toast appears
- [ ] Graceful error message

### Invalid Card ID
- [ ] Navigate to `/card/invalid-id`
- [ ] "Card Not Found" message appears
- [ ] "Go to Home" button works

### Session Expiration
- [ ] Login
- [ ] Wait for session to expire (or manually expire in Firebase Console)
- [ ] Try to perform action
- [ ] Redirects to login

## ✅ Performance Tests

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] Card creator loads instantly
- [ ] Public card view loads in < 1 second

### Dragging Performance
- [ ] Smooth dragging on desktop
- [ ] Smooth dragging on mobile
- [ ] No lag when repositioning

### Large Dataset
- [ ] Create 20+ cards
- [ ] Dashboard still performs well
- [ ] Scrolling is smooth

## 📝 Notes

Record any issues found:

1. Issue: _________________________
   - Steps to reproduce: _________________________
   - Expected: _________________________
   - Actual: _________________________

2. Issue: _________________________
   - Steps to reproduce: _________________________
   - Expected: _________________________
   - Actual: _________________________

## ✅ Final Checklist

- [ ] All authentication flows work
- [ ] Cards can be created, edited, deleted
- [ ] Drag and drop repositioning works
- [ ] Font size adjustments work
- [ ] QR codes generate correctly
- [ ] Public sharing works
- [ ] Analytics track correctly
- [ ] Responsive on all devices
- [ ] Works in all major browsers
- [ ] Error handling is graceful
- [ ] Performance is acceptable

---

**Testing completed by:** _________________________

**Date:** _________________________

**Version:** _________________________
