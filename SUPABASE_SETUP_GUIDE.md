# 🔐 Supabase Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** (or "New Project" if you have an account)
3. Sign up with GitHub/Google (free tier is perfect)
4. Create a new project:
   - **Name**: `becky-skincare` (or whatever you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - Click **"Create new project"**
5. Wait 1-2 minutes for project to initialize

---

### Step 2: Get Your Credentials
Once your project is ready:

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see two important values:

   **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

4. **Copy both values** - you'll need them next!

---

### Step 3: Add to Your App

#### Option A: Using .env file (Recommended)

1. Create a file called `.env` in your project root (if it doesn't exist):
   ```bash
   /beckyskincarefinalforreal/.env
   ```

2. Add these lines (replace with your actual values):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-long-key-here
   ```

3. **Save the file**

4. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   npx expo start --web
   ```

#### Option B: Add to Vercel (For Deployment)

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add both variables:
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://xxxxxxxxxxxxx.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
4. Make sure to check **Production**, **Preview**, and **Development**
5. Click **"Save"**
6. Redeploy your app

---

### Step 4: Test Authentication

1. Go to your app in the browser
2. Click **"Sign Up"** or **"Sign In"**
3. Try creating an account with email/password
4. If it works, you're done! 🎉

---

## ✅ What Works Now

- ✅ **Login/Signup** - Users can create accounts
- ✅ **Session persistence** - Users stay logged in
- ✅ **Guest mode** - Still works, clears data on each use
- ✅ **Everything else** - Unchanged

---

## 🚀 Future Enhancements (Post-Hackathon)

To store scans in Supabase database (not just auth):

1. Create database tables in Supabase
2. Modify `src/utils/storage.ts` to use Supabase instead of localStorage
3. Add user-specific data queries

**This is more complex** and not needed for your hackathon demo!

---

## 🆘 Troubleshooting

### "Invalid API credentials" error
- Double-check you copied the **full** API key (it's very long!)
- Make sure URL starts with `https://`
- Restart dev server after adding .env

### Environment variables not working
- Make sure `.env` is in the project root (same folder as `package.json`)
- Variable names must start with `EXPO_PUBLIC_`
- Restart the dev server

### Still not working?
- You can always use **guest mode** - it works without Supabase!
- Guest mode now clears data on each use (clean slate)

---

## 📝 Summary

**What you did:**
- ✅ Created Supabase project
- ✅ Added credentials to .env
- ✅ Restarted server

**What changed:**
- ✅ Login/signup now works
- ✅ Guest mode clears data
- ❌ Nothing else changed (designs, logic, flow)

**Ready for hackathon!** 🎉
