# Troubleshooting Guide

## Issue 1: Login/Sign-up "Invalid Credentials" Error

### Root Causes:
1. **Supabase Configuration Not Set Up**
   - The app requires valid Supabase credentials to authenticate users
   - Check if `.env` file has proper `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

2. **User Account Doesn't Exist**
   - If trying to login, the email might not be registered yet
   - Try signing up first, then logging in

3. **Email Verification Required**
   - Some Supabase configurations require email verification before login
   - Check your email inbox for verification link after signing up

### Solutions Applied:

✅ **Enhanced Error Messages** - The app now provides clearer feedback:
- "Invalid email or password. Please check your credentials and try again."
- "No account found with this email. Please sign up first."
- "Please verify your email address before signing in."
- "An account with this email already exists. Please sign in instead."

### How to Fix:

1. **Check Supabase Setup:**
   ```bash
   # Verify your .env file has these variables:
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Create a New Account:**
   - Use the "Sign Up" option instead of "Sign In"
   - Use a valid email and password (minimum 6 characters)
   - Check your email for verification if required

3. **Verify Supabase Auth Settings:**
   - Go to your Supabase dashboard → Authentication → Settings
   - Check if "Enable email confirmations" is turned on
   - If yes, you must verify your email before logging in

---

## Issue 2: Skin Analysis Taking Too Long (1+ minute)

### Root Causes:
1. **Large Image Size** - High-resolution images take longer to process
2. **Slow Network Connection** - API calls to Google Gemini require good internet
3. **API Timeout** - Previous timeout was set to 30 seconds
4. **Google AI API Issues** - Service might be temporarily slow or unavailable

### Solutions Applied:

✅ **Increased Timeout** - Extended from 30s to 60s for better reliability
✅ **Better Error Handling** - More specific timeout and network error messages
✅ **Progress Logging** - Added console logs to track analysis progress:
- Image size logging
- API request timing
- Step-by-step progress updates

✅ **Improved Error Messages:**
- "Analysis is taking too long. Try using a smaller image or check your internet connection."
- "The AI service is temporarily unavailable. Please try again in a moment."
- "Network connection failed. Please check your internet connection and try again."

### How to Fix:

1. **Use Smaller Images:**
   - Take photos at lower resolution
   - Avoid uploading very large images (>2MB)
   - The app automatically compresses to quality 0.8

2. **Check Internet Connection:**
   - Ensure you have stable WiFi or mobile data
   - Test your connection speed
   - Try again when you have better connectivity

3. **Verify Google AI API Key:**
   ```bash
   # Check your .env file has:
   EXPO_PUBLIC_GOOGLE_AI_KEY=AIza...your-key-here
   ```

4. **Monitor Console Logs:**
   - Open browser console (F12)
   - Look for these progress indicators:
     - 🚀 Starting skin analysis...
     - 📸 Image size: X KB
     - 🔄 Calling AI analysis API...
     - ⏱️ API request took Xs
     - ✅ Analysis complete!

5. **If Analysis Fails:**
   - Click "Try Again" with a smaller image
   - Check if your Google AI API key is valid
   - Verify you haven't exceeded API quota limits

---

## General Debugging Tips

### Check Environment Variables:
```bash
# View your current .env file (don't commit this!)
cat .env

# Should contain:
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GOOGLE_AI_KEY=...
```

### View Console Logs:
- Open browser DevTools (F12 or Cmd+Option+I)
- Go to Console tab
- Look for emoji indicators:
  - 🔑 = API key status
  - 🚀 = Process starting
  - ✅ = Success
  - ❌ = Error
  - 📸 = Image processing
  - 💾 = Data saving

### Test Supabase Connection:
```javascript
// In browser console:
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Has Anon Key:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
```

### Test Google AI Connection:
```javascript
// In browser console:
console.log('Has Google AI Key:', !!process.env.EXPO_PUBLIC_GOOGLE_AI_KEY);
console.log('Key starts with AIza:', process.env.EXPO_PUBLIC_GOOGLE_AI_KEY?.startsWith('AIza'));
```

---

## Common Error Messages & Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Invalid email or password" | Wrong credentials | Double-check email/password or sign up |
| "No account found" | User doesn't exist | Create account first using Sign Up |
| "Please verify your email" | Email not confirmed | Check inbox for verification link |
| "Analysis is taking too long" | Large image or slow network | Use smaller image, check connection |
| "Service configuration error" | Missing/invalid API key | Check .env file has valid keys |
| "Rate limit exceeded" | Too many API calls | Wait a few minutes and try again |
| "Network connection failed" | No internet | Check WiFi/mobile data connection |

---

## Need More Help?

1. **Check the logs** - Most issues show detailed error messages in console
2. **Verify environment setup** - Ensure all API keys are configured
3. **Test with smaller images** - Start with low-resolution photos
4. **Check Supabase dashboard** - Verify auth settings and user creation
5. **Review API quotas** - Ensure you haven't exceeded Google AI limits

## Files Modified:
- `/src/services/api.js` - Increased timeout, better error handling
- `/contexts/AuthContext.tsx` - Enhanced auth error messages
- `/app/onboarding/photo.tsx` - Added progress logging and timeout handling
