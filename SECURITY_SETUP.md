# Becky Security Configuration Guide

## 🔒 Critical Security Settings

This guide covers the required security configurations for Becky's authentication system.

---

## ⚠️ REQUIRED: Enable Leaked Password Protection

**Status:** 🔴 **NOT ENABLED** - Must be configured in Supabase Dashboard

### What is Leaked Password Protection?

Supabase Auth integrates with **HaveIBeenPwned.org** (HIBP) to prevent users from using passwords that have been compromised in data breaches. When enabled, the system checks every password during signup and password changes against a database of over 600 million compromised passwords.

### Why This Matters

- Prevents users from using passwords exposed in data breaches
- Reduces risk of account takeover attacks
- Industry best practice for password security
- Required for compliance with security standards
- No performance impact on users (check is done server-side)

---

## 📋 How to Enable Leaked Password Protection

### Method 1: Via Authentication Policies (Recommended)

1. **Go to Supabase Dashboard**
   ```
   https://0ec90b57d6e95fcbda19832f.supabase.co
   ```

2. **Navigate to Authentication → Policies**
   - Click on "Authentication" in the left sidebar
   - Select "Policies" tab

3. **Find Password Protection Section**
   - Scroll to "Password Protection" or "Security"
   - Look for "HaveIBeenPwned Integration" or "Leaked Password Protection"

4. **Enable the Feature**
   - Toggle ON: "Check passwords against HaveIBeenPwned"
   - Or: Enable "Hibp Integration"

5. **Save Changes**
   - Click "Save" or "Update"
   - Changes take effect immediately

### Method 2: Via Authentication Settings

1. Go to: **Dashboard → Authentication → Settings**
2. Scroll to: **"Security and Protection"** section
3. Enable: **"Have I Been Pwned (HIBP) Integration"**
4. Save changes

---

## ✅ Verification

After enabling, test the feature:

### Test Case: Try Weak/Compromised Password

1. Go to auth screen in Becky app
2. Try to sign up with a known weak password:
   - Example: `password123`
   - Example: `qwerty123`
   - Example: `123456789`

3. **Expected Result:**
   - ❌ Signup should fail
   - Error message: "Password has been leaked in a data breach"
   - User is prompted to choose a different password

4. **If signup succeeds with weak password:**
   - ⚠️ Feature is NOT enabled
   - Go back and verify dashboard settings

---

## 🛡️ Additional Security Recommendations

### 1. Password Requirements

Configure strong password requirements in Supabase Dashboard:

**Recommended Settings:**
- **Minimum Length:** 8 characters (12+ for high security)
- **Complexity Requirements:**
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**How to Configure:**
1. Dashboard → Authentication → Settings
2. Find "Password Requirements" section
3. Set minimum length: 8
4. Enable complexity requirements
5. Save changes

### 2. Enable Email Confirmation (Production)

For production deployments:

1. Dashboard → Authentication → Settings
2. Enable "Confirm email" option
3. Configure email templates
4. Set confirmation redirect URL

**Benefits:**
- Verifies user email ownership
- Prevents fake account creation
- Reduces spam/abuse

### 3. Rate Limiting

Supabase automatically includes rate limiting for auth endpoints:

**Default Limits:**
- 30 requests per hour per IP for signup
- 60 requests per hour per IP for login
- Protection against brute force attacks

### 4. Multi-Factor Authentication (Future)

Consider implementing MFA for high-value accounts:

```typescript
// Future implementation
await supabase.auth.mfa.enroll({
  factorType: 'totp',
});
```

---

## 📊 Security Checklist

Use this checklist to verify all security features are enabled:

- [ ] **Leaked Password Protection** - Check passwords against HIBP
- [ ] **Password Complexity** - Minimum 8 characters with requirements
- [ ] **Rate Limiting** - Enabled by default (verify not disabled)
- [ ] **HTTPS Only** - All requests use secure connection
- [ ] **Secure Token Storage** - AsyncStorage with encryption
- [ ] **Session Auto-Refresh** - Prevents stale sessions
- [ ] **Email Confirmation** - Enabled for production (optional for dev)
- [ ] **RLS Policies** - Row Level Security for user data
- [ ] **OAuth Security** - Proper redirect URLs configured

---

## 🔍 Monitoring & Auditing

### Failed Login Attempts

Monitor failed authentication attempts in Supabase Dashboard:

1. Dashboard → Authentication → Users
2. Check "Recent Activity" or "Logs"
3. Look for patterns of failed attempts

### Password Change Logs

Track when users change passwords:

1. Dashboard → Logs
2. Filter by: `auth.password_update`
3. Review for suspicious activity

---

## 🚨 Security Incident Response

If you suspect a security breach:

1. **Immediately revoke all sessions:**
   ```typescript
   // Force all users to re-authenticate
   await supabase.auth.signOut({ scope: 'global' });
   ```

2. **Review authentication logs**
3. **Contact Supabase support**
4. **Notify affected users**
5. **Implement additional security measures**

---

## 📚 Resources

- **Supabase Auth Security:** https://supabase.com/docs/guides/auth/auth-security
- **HaveIBeenPwned API:** https://haveibeenpwned.com/API/v3
- **OWASP Password Guidelines:** https://owasp.org/www-community/password-special-characters
- **Supabase Security Best Practices:** https://supabase.com/docs/guides/platform/security

---

## ⏭️ Next Steps

1. ✅ **Enable leaked password protection** (follow guide above)
2. ✅ Configure password complexity requirements
3. ✅ Test authentication flows with weak passwords
4. ✅ Document security policies for your team
5. ✅ Set up monitoring for failed auth attempts
6. ✅ Plan for email confirmation in production
7. ✅ Review RLS policies for user data protection

---

## 💬 Support

For security questions or issues:
- Supabase Discord: https://discord.supabase.com
- Supabase Docs: https://supabase.com/docs
- Supabase Support: https://supabase.com/dashboard/support

---

**Last Updated:** 2025-11-27
**App Version:** 1.0.0
**Security Level:** Production-Ready (after enabling HIBP)
