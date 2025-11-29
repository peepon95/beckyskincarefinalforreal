# Bolt.new Deployment Guide

## 🚀 Deploying to Bolt.new

This app requires environment variables to function properly. Follow these steps:

### Step 1: Set Environment Variables in Bolt

In your Bolt project settings, add these environment variables:

```
EXPO_PUBLIC_GOOGLE_AI_KEY=your_google_ai_key_here
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**IMPORTANT:** The variable names MUST start with `EXPO_PUBLIC_` for them to work!

### Step 2: Get Your API Keys

#### Google AI API Key:
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza`)

#### Supabase Credentials:
1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy the "Project URL" and "anon public" key

### Step 3: Verify Deployment

After setting the environment variables:

1. **Trigger a rebuild** in Bolt (or push new changes to GitHub)
2. **Open the deployed app**
3. **Open browser console** (F12 → Console tab)
4. **Look for debug output:**
   ```
   🔑 ===== GOOGLE AI KEY DEBUG =====
     - Final GOOGLE_AI_KEY: LOADED
   ```

If you see `NOT LOADED`, the environment variables aren't set correctly.

### Common Issues

#### Issue: "Becky couldn't analyse your skin right now"
**Cause:** API key not loaded
**Solution:** 
- Check environment variable name is exactly `EXPO_PUBLIC_GOOGLE_AI_KEY`
- Verify the key starts with `AIza`
- Rebuild the app in Bolt

#### Issue: Analysis gets stuck/times out
**Cause:** Network timeout or API quota exceeded
**Solution:**
- Check your Google AI API quota
- Verify your internet connection
- Check browser console for specific error messages

### Debugging

Open the browser console and look for:
- `🔑 ===== GOOGLE AI KEY DEBUG =====` - Shows if API key is loaded
- `❌` - Error messages
- `✅` - Success messages

### Need Help?

If you see errors in the console, screenshot them and check:
1. Environment variable names are correct
2. API keys are valid and not expired
3. No typos in the keys
