# 🔒 Becky Security - Quick Reference Card

## ⚠️ CRITICAL: Action Required

**Leaked Password Protection is NOT enabled by default.**

You MUST enable this in Supabase Dashboard before production.

---

## 📋 5-Minute Security Setup

### Step 1: Open Supabase Dashboard
```
https://0ec90b57d6e95fcbda19832f.supabase.co
```

### Step 2: Navigate to Auth Settings
```
Dashboard → Authentication → Policies
```
*OR*
```
Dashboard → Authentication → Settings → Security and Protection
```

### Step 3: Enable HIBP Protection
- [x] Toggle ON: "Check passwords against HaveIBeenPwned"
- [x] Save changes

### Step 4: Test It Works
Try signing up with password: `password123`
- ✅ Should FAIL with error message
- ❌ If it succeeds, feature is not enabled

---

## 🎯 What This Does

- Checks passwords against 600M+ leaked passwords
- Blocks compromised passwords automatically
- Zero performance impact
- No code changes needed

---

## 🚨 Security Status

Current Status: 🔴 **NOT CONFIGURED**

After Enabling: 🟢 **PROTECTED**

---

## 📞 Need Help?

See full guide: [SECURITY_SETUP.md](./SECURITY_SETUP.md)

Supabase Docs: https://supabase.com/docs/guides/auth/auth-security

---

**Priority:** HIGH
**Time Required:** 5 minutes
**Impact:** Critical Security Enhancement
