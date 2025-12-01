# 🚀 Deploy Becky Skincare App to Vercel

## ✅ Prerequisites Completed
- [x] Vercel CLI installed locally
- [x] vercel.json configuration created
- [x] .vercelignore file created
- [x] Base64 cleaning fix applied to api.js

---

## 📝 Step-by-Step Deployment Guide

### Step 1: Build the Expo Web App

First, we need to build the web version of your app:

```bash
npx expo export --platform web
```

**What this does:**
- Compiles your React Native app for the web
- Creates optimized static files in the `dist/` folder
- Bundles all your assets and code

**Expected output:** You should see a `dist/` folder created with your web app files.

---

### Step 2: Test the Build Locally (Optional but Recommended)

Before deploying, test that the build works:

```bash
npx serve dist
```

Then open http://localhost:3000 in your browser to verify everything works.

**Press Ctrl+C to stop the server when done.**

---

### Step 3: Login to Vercel

```bash
npx vercel login
```

**What happens:**
- You'll be asked to choose a login method (Email, GitHub, GitLab, or Bitbucket)
- Choose your preferred method
- Follow the authentication steps in your browser
- Once logged in, return to the terminal

---

### Step 4: Deploy to Vercel

```bash
npx vercel
```

**You'll be asked several questions:**

1. **"Set up and deploy?"** → Press **Y** (Yes)

2. **"Which scope?"** → Choose your account (usually your username)

3. **"Link to existing project?"** → Press **N** (No, this is a new project)

4. **"What's your project's name?"** → Type: `becky-skincare-app` (or any name you like)

5. **"In which directory is your code located?"** → Press **Enter** (current directory)

6. **"Want to override the settings?"** → Press **N** (No, use vercel.json settings)

**Vercel will now:**
- Upload your code
- Build the project using `expo export --platform web`
- Deploy to a URL like: `https://becky-skincare-app-xxx.vercel.app`

---

### Step 5: Add Environment Variable (CRITICAL!)

After deployment, your app will be live but **skin analysis won't work yet** because the API key is missing.

**Option A: Using Vercel Dashboard (Easier)**

1. Go to https://vercel.com/dashboard
2. Click on your project (`becky-skincare-app`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name:** `EXPO_PUBLIC_GOOGLE_AI_KEY`
   - **Value:** Your Google AI API key (starts with `AIza...`)
   - **Environment:** Check all three: Production, Preview, Development
6. Click **Save**

**Option B: Using Vercel CLI**

```bash
npx vercel env add EXPO_PUBLIC_GOOGLE_AI_KEY
```

- Choose: **Production**
- Paste your Google AI API key
- Press Enter

---

### Step 6: Redeploy with Environment Variable

After adding the environment variable, redeploy:

```bash
npx vercel --prod
```

This will deploy to production with your API key available.

---

## 🎉 You're Done!

Your app is now live! Vercel will give you a URL like:
```
https://becky-skincare-app-xxx.vercel.app
```

---

## 🔧 Troubleshooting

### Issue: "Skin analysis not working"
**Solution:** Make sure you added the `EXPO_PUBLIC_GOOGLE_AI_KEY` environment variable and redeployed.

### Issue: "Build failed"
**Solution:** Check the Vercel build logs. Common issues:
- Missing dependencies → Run `npm install` locally first
- TypeScript errors → Run `npm run typecheck` to find issues

### Issue: "Page not found on refresh"
**Solution:** The `vercel.json` rewrites should handle this. If not, check that the file was created correctly.

---

## 📱 Future Updates

To update your deployed app:

1. Make your code changes
2. Commit to git (optional but recommended)
3. Run: `npx vercel --prod`

That's it! Vercel will rebuild and redeploy.

---

## 🎓 What You Learned

- ✅ How to build an Expo app for web
- ✅ How to configure Vercel for Expo projects
- ✅ How to set environment variables in production
- ✅ How to deploy and update web apps

---

## 📞 Need Help?

If something goes wrong:
1. Check the Vercel deployment logs in the dashboard
2. Check your browser console for errors
3. Verify the environment variable is set correctly

Good luck with your hackathon presentation! 🚀
