# YaadFeed Authentication & Social Features Setup Guide

This guide will help you set up the complete authentication system with social login, commenting, and user management features.

## 🚀 Features Implemented

✅ **Authentication System**
- Google OAuth login
- Facebook OAuth login  
- Twitter OAuth login
- User session management
- Secure JWT tokens

✅ **User Interface**
- Beautiful authentication modal
- Loading states and preloaders
- Toast notifications
- User profile dropdown
- Mobile-responsive design

✅ **Commenting System**
- Real-time comments and replies
- Like/unlike functionality
- User avatars and profiles
- Comment moderation
- Authentication-gated interactions

✅ **Database Integration**
- MongoDB user storage
- Comments storage with relationships
- Secure API endpoints
- Data validation

## 📋 Prerequisites

1. **MongoDB** - Local or cloud instance
2. **Google OAuth App** - For Google login
3. **Facebook App** - For Facebook login  
4. **Twitter App** - For Twitter login
5. **Node.js 18+** - Runtime environment

## 🔧 Environment Setup

Create a `.env.local` file in your project root with these variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yaadfeed

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Twitter OAuth
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3002

# OpenAI (Optional - for AI image generation)
OPENAI_API_KEY=your-openai-api-key
```

## 🔑 OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized origins:
   - `http://localhost:3002`
   - `https://yourdomain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3002/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy Client ID and Client Secret

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   - `http://localhost:3002/api/auth/callback/facebook`
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)
5. Copy App ID and App Secret

### Twitter OAuth Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Enable "OAuth 2.0" in app settings
4. Set Callback URLs:
   - `http://localhost:3002/api/auth/callback/twitter`
   - `https://yourdomain.com/api/auth/callback/twitter` (for production)
5. Copy Client ID and Client Secret

## 🗄️ Database Setup

### MongoDB Local Setup

1. Install MongoDB:
   ```bash
   # macOS with Homebrew
   brew install mongodb/brew/mongodb-community
   
   # Ubuntu/Debian
   sudo apt install mongodb
   
   # Windows - Download from mongodb.com
   ```

2. Start MongoDB:
   ```bash
   # macOS/Linux
   mongosh
   
   # Windows
   mongod
   ```

3. Create database and collections:
   ```javascript
   use yaadfeed
   
   // Collections will be created automatically by the app:
   // - articles
   // - comments  
   // - users
   // - accounts
   // - sessions
   ```

### MongoDB Cloud Setup (Alternative)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get connection string and replace in `MONGODB_URI`
4. Example: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaadfeed`

## 🚀 Installation & Startup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test the features:**
   - Visit `http://localhost:3002`
   - Click "Sign In" button
   - Test Google/Facebook/Twitter login
   - Navigate to any article and test comments

## 🧪 Testing Authentication

### Test Social Login
1. Click "Sign In" in header
2. Choose a provider (Google/Facebook/Twitter)
3. Complete OAuth flow
4. Verify user appears in header dropdown
5. Check MongoDB for user record

### Test Comments
1. Navigate to any article
2. Try commenting without login (should prompt for auth)
3. Sign in and post a comment
4. Test reply functionality
5. Test like/unlike features

### Test User Management
1. Sign in with different providers
2. Check user profile dropdown
3. Test sign out functionality
4. Verify session persistence

## 🛠️ API Endpoints

The following API endpoints are available:

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/auth/register` - User registration (if needed)

### Comments
- `GET /api/comments/[articleId]` - Fetch comments for article
- `POST /api/comments` - Create new comment/reply
- `POST /api/comments/[commentId]/like` - Like/unlike comment

### Articles
- `GET /api/news` - Fetch all articles
- `GET /api/news/[slug]` - Fetch single article with related articles

## 🎨 UI Components Used

### Authentication
- `AuthModal` - Main authentication modal
- `SessionProvider` - NextAuth session wrapper
- `Loading` components - Various loading states

### Comments
- `Comments` - Main comments component
- User avatars and interaction buttons
- Reply threads and like counters

### General
- `Header` - With user dropdown and auth integration
- `Button` - Consistent button styling
- `Card` - Content containers
- Toast notifications for feedback

## 🔒 Security Features

- **CSRF Protection** - Built into NextAuth
- **JWT Tokens** - Secure session management
- **Database Validation** - Server-side validation
- **Rate Limiting** - Prevent spam (can be added)
- **Content Sanitization** - Clean user input

## 🚨 Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure redirect URIs match exactly in provider settings
   - Check for trailing slashes

2. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure database permissions

3. **Session Not Persisting**
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain

4. **Comments Not Loading**
   - Check article ID is being passed correctly
   - Verify MongoDB comments collection exists
   - Check API endpoint responses

### Debug Mode

Enable debug mode by adding to `.env.local`:
```bash
NEXTAUTH_DEBUG=true
```

## 📱 Mobile Compatibility

All features are fully responsive:
- Touch-friendly authentication modal
- Mobile comment interface
- Responsive user dropdown
- Optimized loading states

## 🔄 Next Steps

### Optional Enhancements
1. **Email Authentication** - Add email/password login
2. **Profile Pages** - User profile management
3. **Admin Panel** - Comment moderation
4. **Push Notifications** - Real-time updates
5. **Social Sharing** - Share articles with comments

### Production Deployment
1. Update OAuth redirect URIs for production domain
2. Set secure MongoDB connection
3. Configure production `NEXTAUTH_URL`
4. Enable SSL/HTTPS
5. Set up monitoring and logging

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify all environment variables
3. Test each provider individually
4. Check browser console for errors
5. Review API responses in network tab

The authentication system is now fully functional with social login, comments, and user management! 🎉 