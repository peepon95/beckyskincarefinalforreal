// Bolt.new specific environment variable loader
// This script runs before the app loads to inject Bolt secrets into the environment

(function () {
    'use strict';

    // Bolt.new may inject secrets differently than standard Expo
    // We need to check multiple possible locations

    if (typeof window !== 'undefined') {
        // Initialize environment objects if they don't exist
        window._env_ = window._env_ || {};
        window.ENV = window.ENV || {};

        // Function to safely get environment variables from multiple sources
        const getSecret = (key) => {
            // Check all possible locations where Bolt might inject secrets
            return (
                // Standard Expo process.env
                (typeof process !== 'undefined' && process.env && process.env[key]) ||
                // Vite-style import.meta.env
                (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env[key]) ||
                    // Window-based env objects
                    window._env_[key] ||
                    window.ENV[key] ||
                    // Bolt might use a custom __ENV__ object
                    (window.__ENV__ && window.__ENV__[key]) ||
                    // Or a BOLT_ENV object
                    (window.BOLT_ENV && window.BOLT_ENV[key]) ||
                    ''
      );
    };

    // Load all required environment variables
    const GOOGLE_AI_KEY = getSecret('EXPO_PUBLIC_GOOGLE_AI_KEY');
    const SUPABASE_URL = getSecret('EXPO_PUBLIC_SUPABASE_URL');
    const SUPABASE_ANON_KEY = getSecret('EXPO_PUBLIC_SUPABASE_ANON_KEY');

    // Inject into all possible locations to ensure compatibility
    const envVars = {
        EXPO_PUBLIC_GOOGLE_AI_KEY: GOOGLE_AI_KEY,
        EXPO_PUBLIC_SUPABASE_URL: SUPABASE_URL,
        EXPO_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
    };

    // Set in window._env_ (our primary source)
    Object.assign(window._env_, envVars);

    // Set in window.ENV (backup)
    Object.assign(window.ENV, envVars);

    // Try to set in process.env if it exists
    if (typeof process !== 'undefined' && process.env) {
        Object.assign(process.env, envVars);
    }

    // Debug logging
    console.log('🔧 ===== BOLT ENVIRONMENT LOADER =====');
    console.log('  - Checking for secrets...');
    console.log('  - GOOGLE_AI_KEY found:', GOOGLE_AI_KEY ? 'YES (' + GOOGLE_AI_KEY.substring(0, 10) + '...)' : 'NO');
    console.log('  - SUPABASE_URL found:', SUPABASE_URL ? 'YES' : 'NO');
    console.log('  - SUPABASE_ANON_KEY found:', SUPABASE_ANON_KEY ? 'YES' : 'NO');
    console.log('  - Injected into window._env_');
    console.log('  - Injected into window.ENV');
    if (typeof process !== 'undefined' && process.env) {
        console.log('  - Injected into process.env');
    }
    console.log('=====================================');

    // If no Google AI key found, show helpful error
    if (!GOOGLE_AI_KEY) {
        console.error('❌ CRITICAL: EXPO_PUBLIC_GOOGLE_AI_KEY not found!');
        console.error('💡 Make sure you added it in Bolt Secrets settings');
        console.error('💡 The secret name must be exactly: EXPO_PUBLIC_GOOGLE_AI_KEY');
        console.error('💡 After adding, you may need to rebuild/redeploy');
    }
}
}) ();
