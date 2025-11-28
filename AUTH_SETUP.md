# Becky Authentication Setup

## Overview

Becky now includes authentication powered by Supabase Auth with support for:
- Email/Password authentication
- Google OAuth
- Apple OAuth

## Current Status

✅ Email/Password authentication is **ready to use** immediately
⚠️ Google and Apple OAuth require additional configuration in Supabase Dashboard

## Email/Password Authentication

Works out of the box! Users can:
- Sign up with email and password
- Sign in with existing credentials
- Session persists across app refreshes
- Authenticated users skip onboarding and go directly to Home

## Security Configuration (REQUIRED)

### Enable Leaked Password Protection

**CRITICAL:** Supabase Auth can prevent users from using compromised passwords by checking against HaveIBeenPwned.org. This feature MUST be enabled for production.

**Steps to Enable:**

1. Go to your Supabase Dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to: **Authentication → Policies**
3. Find the section: **Password Protection**
4. Enable: **"Check passwords against HaveIBeenPwned"**
5. Save changes

**What This Does:**
- Checks user passwords against a database of leaked/compromised passwords
- Prevents users from signing up with known compromised passwords
- Enhances security without any code changes
- No performance impact on users

**Alternative Path:**
- Dashboard → Authentication → Settings
- Scroll to "Security and Protection"
- Enable "Hibp (Have I Been Pwned) Integration"

---

## OAuth Configuration (Google & Apple)

To enable Google and Apple sign-in, you need to configure OAuth providers in your Supabase Dashboard:

### 1. Access Supabase Dashboard
Go to: https://0ec90b57d6e95fcbda19832f.supabase.co

### 2. Navigate to Authentication Settings
Dashboard → Authentication → Providers

### 3. Configure Google OAuth
1. Enable "Google" provider
2. Add your Google OAuth Client ID and Secret
3. Set redirect URL: `exp://localhost:8081/--/home`

### 4. Configure Apple OAuth
1. Enable "Apple" provider
2. Add your Apple Services ID and Key
3. Set redirect URL: `exp://localhost:8081/--/home`

For production, update redirect URLs to match your app's custom scheme.

## How It Works

### User Flow - Not Logged In
1. App opens → Welcome screen
2. User taps "Get Started" → Auth screen
3. User can:
   - Sign up with email/password
   - Sign in with email/password
   - Sign in with Google (if configured)
   - Sign in with Apple (if configured)
   - Continue as guest → Onboarding flow

### User Flow - Logged In
1. App opens → Checks session
2. If authenticated → Redirect to Home (skips all onboarding)
3. User data persists using AsyncStorage

### Guest Flow
- Guests can explore full onboarding
- Guests can use all features (scans, history, profile)
- Data stored locally
- Can sign up/login anytime from Profile screen

## Security Features

✅ Passwords hashed by Supabase
✅ Sessions auto-refresh
✅ Secure token storage with AsyncStorage
✅ Email confirmation disabled (for easier testing)
✅ RLS policies ready for user-specific data
⚠️ **IMPORTANT:** Leaked password protection needs to be enabled (see Security Configuration below)

## Testing Authentication

### Test Email/Password
1. Launch app
2. Tap "Get Started"
3. Create account or sign in
4. Should land on Home screen immediately

### Test Session Persistence
1. Log in
2. Close app completely
3. Reopen app
4. Should auto-login to Home (no auth screen)

### Test Logout
1. Go to Profile tab
2. Scroll to Settings
3. Tap "Log Out"
4. Confirm
5. Should return to Welcome screen

## Files Modified

### New Files
- `/contexts/AuthContext.tsx` - Authentication state management
- `/app/auth.tsx` - Login/signup screen
- `AUTH_SETUP.md` - This documentation

### Modified Files
- `/app/_layout.tsx` - Added AuthProvider wrapper
- `/app/index.tsx` - Added auth check and redirect logic
- `/app/profile.tsx` - Added logout functionality and user email display
- `/.env` - Updated Supabase credentials with EXPO_PUBLIC prefix

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://vltkwcicqxmslvfeqtrf.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps (Optional)

### Enable Email Confirmation
In Supabase Dashboard → Authentication → Settings:
- Enable "Confirm email" for production
- Configure email templates

### Add Password Reset
Implement password reset flow using:
```typescript
supabase.auth.resetPasswordForEmail(email)
```

### User Profiles Table
Create a `profiles` table to store additional user data:
- Name
- Avatar
- Skin preferences
- Onboarding completion status

### Link User Data
Update storage to save scans/analysis per user ID when authenticated.

## Support

For issues or questions about authentication setup, check:
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Expo OAuth Guide: https://docs.expo.dev/guides/authentication/
