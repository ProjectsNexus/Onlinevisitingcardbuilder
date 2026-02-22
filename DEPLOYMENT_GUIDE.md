# Deployment Guide for CardLink

This guide covers deploying your CardLink application to various hosting platforms.

## Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Environment variables set up
- [ ] Firestore security rules published
- [ ] Firebase Authentication enabled
- [ ] Application tested locally
- [ ] All features working correctly
- [ ] Build process completes successfully

## Building for Production

```bash
# Install dependencies
npm install
# or
pnpm install

# Build the application
npm run build
# or
pnpm build
```

This creates a `dist/` folder with optimized production files.

---

## Deploying to Vercel

### Method 1: CLI Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

5. **Deploy to Production**
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables in Vercel dashboard
6. Click "Deploy"

### Vercel Configuration (vercel.json)

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "VITE_FIREBASE_APP_ID": "@firebase-app-id"
  }
}
```

---

## Deploying to Netlify

### Method 1: CLI Deployment

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the app**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy
```

4. **Deploy to Production**
```bash
netlify deploy --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect to GitHub and select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify dashboard
7. Click "Deploy site"

### Netlify Configuration (netlify.toml)

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Setting Environment Variables in Netlify

1. Go to Site settings
2. Click "Environment variables"
3. Add each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

## Deploying to Firebase Hosting

### Setup

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase Hosting**
```bash
firebase init hosting
```

Configuration:
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`
- Overwrite index.html: `No`

### Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Firebase Configuration (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## Environment Variables Setup

### For All Platforms

You need to set these environment variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Security Note

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to version control
- Add `.env.local` to `.gitignore`
- Firebase API keys are safe to expose in client-side code
- Firestore security rules protect your data

---

## Post-Deployment Steps

### 1. Update Firebase Configuration

Add your production domain to Firebase:

1. Go to Firebase Console
2. Select your project
3. Go to Authentication > Settings > Authorized domains
4. Add your deployment URL (e.g., `cardlink.vercel.app`)

### 2. Test Production Build

- [ ] Visit your deployed URL
- [ ] Test signup/login flow
- [ ] Create a test card
- [ ] Generate QR code
- [ ] Test public card view
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Check all links work

### 3. Update Firestore Security Rules

If you haven't already, update to production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /cards/{cardId} {
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
      allow list: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow get: if true;
    }
  }
}
```

### 4. Set Up Custom Domain (Optional)

#### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records

#### Firebase Hosting
1. Run `firebase hosting:channel:deploy production`
2. Go to Hosting in Firebase Console
3. Click "Add custom domain"
4. Follow DNS configuration steps

---

## Monitoring and Analytics

### Firebase Analytics

Enable Firebase Analytics:

1. Go to Firebase Console
2. Enable Google Analytics
3. View user metrics in Analytics dashboard

### Error Monitoring

Consider adding error tracking:

- **Sentry**: `npm install @sentry/react`
- **LogRocket**: `npm install logrocket`
- **Bugsnag**: `npm install @bugsnag/js @bugsnag/plugin-react`

### Performance Monitoring

Enable Firebase Performance Monitoring:

```bash
npm install firebase/performance
```

---

## Continuous Deployment

### GitHub Actions (for any platform)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    
    - name: Deploy to Firebase
      uses: w9jds/firebase-action@master
      with:
        args: deploy --only hosting
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**:
- Check all dependencies are installed
- Verify environment variables are set
- Check for TypeScript errors
- Try building locally first

### Environment Variables Not Working

**Issue**: Firebase connection fails in production
**Solution**:
- Verify all variables are set in hosting platform
- Check variable names are exactly correct (case-sensitive)
- Restart deployment after setting variables
- Check browser console for errors

### Routes Not Working

**Issue**: Direct URL navigation returns 404
**Solution**:
- Ensure rewrites/redirects are configured
- Check `vercel.json` or `netlify.toml` settings
- Verify single-page app configuration

### CORS Errors

**Issue**: Firebase requests blocked by CORS
**Solution**:
- Add production domain to Firebase authorized domains
- Check Firebase Console > Authentication > Settings
- Verify domain is exactly as deployed

### QR Codes Not Generating

**Issue**: QR code modal shows error
**Solution**:
- Check card is saved before generating QR
- Verify cardId is valid
- Check browser console for errors
- Test in different browser

---

## Performance Optimization

### After Deployment

1. **Enable Compression**
   - Vercel/Netlify enable this automatically
   - Firebase Hosting needs configuration

2. **Enable Caching**
   - Set cache headers for static assets
   - Configure in hosting platform

3. **Image Optimization**
   - Use WebP format where supported
   - Lazy load images

4. **Code Splitting**
   - Already configured with Vite
   - Verify in network tab

5. **CDN**
   - All recommended platforms use CDN
   - Verify assets served from CDN

---

## Backup Strategy

### Regular Backups

1. **Firestore Data**
```bash
firebase firestore:export gs://[BUCKET_NAME]/backups
```

2. **Authentication Users**
   - Export from Firebase Console
   - Authentication > Users > Export

3. **Code Repository**
   - Regular commits to GitHub
   - Tag releases
   - Maintain changelog

---

## Support and Maintenance

### Regular Tasks

- [ ] Monitor Firebase usage and costs
- [ ] Check error logs weekly
- [ ] Review security rules quarterly
- [ ] Update dependencies monthly
- [ ] Backup data regularly
- [ ] Test on new browsers/devices
- [ ] Monitor performance metrics

### Scaling Considerations

When to upgrade Firebase plan:
- More than 50,000 reads/day
- More than 20,000 writes/day
- Storage exceeding 1 GB
- Need custom authentication

---

## Cost Estimation

### Firebase Free Tier (Spark Plan)

- Authentication: Unlimited
- Firestore: 
  - 1 GiB storage
  - 50,000 reads/day
  - 20,000 writes/day
- Hosting: 10 GB storage, 360 MB/day transfer

### Typical Costs (Blaze Plan)

For 1,000 active users:
- Firestore: ~$1-5/month
- Authentication: Free
- Hosting: Free (within limits)
- Total: ~$1-10/month

---

## Success Checklist

After deployment, verify:

- [x] Application is accessible at production URL
- [x] User signup/login works
- [x] Cards can be created and saved
- [x] Drag and drop functions correctly
- [x] QR codes generate and download
- [x] Public card links work
- [x] Analytics track correctly
- [x] Mobile experience is smooth
- [x] Performance is acceptable
- [x] All links work correctly
- [x] HTTPS is enabled
- [x] Custom domain configured (if applicable)

---

## Rollback Plan

If deployment fails:

### Vercel
```bash
vercel rollback [deployment-url]
```

### Netlify
1. Go to Deploys
2. Click on previous successful deploy
3. Click "Publish deploy"

### Firebase
```bash
firebase hosting:rollback
```

---

Congratulations on deploying CardLink! 🎉

Your digital business card platform is now live and ready for users.
