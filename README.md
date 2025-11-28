# Becky - Your Gentle Skin Companion 💜

A calm, judgment-free AI-powered skincare app built with React Native + Expo.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔒 IMPORTANT: Security Configuration Required

**Before going to production, you MUST enable leaked password protection:**

👉 **[Read SECURITY_SETUP.md](./SECURITY_SETUP.md)** for detailed instructions

**Quick Steps:**
1. Go to Supabase Dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to: Authentication → Policies
3. Enable: "Check passwords against HaveIBeenPwned"
4. Save changes

This prevents users from using compromised passwords and is critical for security.

## 📚 Documentation

- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication setup and configuration
- **[SECURITY_SETUP.md](./SECURITY_SETUP.md)** - Security features and best practices (READ THIS FIRST!)

## ✨ Features

- AI-powered skin analysis
- Personalized skincare recommendations
- Scan history tracking
- Authentication (Email, Google, Apple)
- Beautiful, calming UI
- Guest mode available

## 🛡️ Security Checklist

- [ ] Enable leaked password protection (HIBP)
- [ ] Configure password complexity requirements
- [ ] Enable email confirmation for production
- [ ] Review Row Level Security policies
- [ ] Test authentication flows

## 📱 Tech Stack

- React Native + Expo
- Supabase (Auth + Database)
- TypeScript
- OpenRouter AI API

## 🔐 Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
```

## 📄 License

Private project - All rights reserved
