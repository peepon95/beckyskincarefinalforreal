// Bolt.new Environment Configuration
// This file helps expose environment variables in Bolt deployments

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    // Initialize _env_ object if it doesn't exist
    window._env_ = window._env_ || {};

    // Try to get environment variables from various sources
    // Priority: 1. Already set window._env_, 2. import.meta.env (Vite), 3. process.env
    const getEnvVar = (key) => {
        return window._env_[key] ||
            (typeof import.meta !== 'undefined' && import.meta.env?.[key]) ||
            (typeof process !== 'undefined' && process.env?.[key]) ||
            '';
    };

    // Set environment variables
    window._env_.EXPO_PUBLIC_GOOGLE_AI_KEY = getEnvVar('EXPO_PUBLIC_GOOGLE_AI_KEY');
    window._env_.EXPO_PUBLIC_SUPABASE_URL = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
    window._env_.EXPO_PUBLIC_SUPABASE_ANON_KEY = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY');

    // Debug logging
    console.log('🔧 Bolt Environment Configuration Loaded');
    console.log('  - GOOGLE_AI_KEY:', window._env_.EXPO_PUBLIC_GOOGLE_AI_KEY ? 'SET' : 'NOT SET');
    console.log('  - SUPABASE_URL:', window._env_.EXPO_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('  - SUPABASE_ANON_KEY:', window._env_.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
}
