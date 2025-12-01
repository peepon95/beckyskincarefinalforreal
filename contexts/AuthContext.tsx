import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../src/lib/supabase';
import { getOrCreateProfile } from '../src/services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasCompletedOnboarding: boolean | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  hasCompletedOnboarding: null,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInWithApple: async () => ({ error: null }),
  signOut: async () => { },
  completeOnboarding: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch onboarding status if user is logged in
      if (session?.user) {
        try {
          const profile = await getOrCreateProfile(session.user.id);
          setHasCompletedOnboarding(profile.has_completed_onboarding ?? false);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setHasCompletedOnboarding(false);
        }
      } else {
        setHasCompletedOnboarding(null);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch onboarding status if user is logged in
      if (session?.user) {
        try {
          const profile = await getOrCreateProfile(session.user.id);
          setHasCompletedOnboarding(profile.has_completed_onboarding ?? false);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setHasCompletedOnboarding(false);
        }
      } else {
        setHasCompletedOnboarding(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error.message);

        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return {
            error: {
              message: 'Invalid email or password. Please check your credentials and try again.'
            }
          };
        }

        if (error.message.includes('Email not confirmed')) {
          return {
            error: {
              message: 'Please verify your email address before signing in. Check your inbox for the verification link.'
            }
          };
        }

        if (error.message.includes('User not found')) {
          return {
            error: {
              message: 'No account found with this email. Please sign up first.'
            }
          };
        }

        // Return the original error for other cases
        return { error };
      }

      console.log('✅ Sign in successful');
      return { error: null };
    } catch (err: any) {
      console.error('❌ Unexpected sign in error:', err);
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.'
        }
      };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign up error:', error.message);

        // Provide more specific error messages
        if (error.message.includes('User already registered')) {
          return {
            error: {
              message: 'An account with this email already exists. Please sign in instead.'
            }
          };
        }

        if (error.message.includes('Password should be at least')) {
          return {
            error: {
              message: 'Password is too weak. Please use at least 6 characters.'
            }
          };
        }

        if (error.message.includes('Invalid email')) {
          return {
            error: {
              message: 'Please enter a valid email address.'
            }
          };
        }

        // Return the original error for other cases
        return { error };
      }

      console.log('✅ Sign up successful');

      // Check if email confirmation is required
      if (data?.user && !data.user.confirmed_at) {
        console.log('📧 Email confirmation required');
      }

      return { error: null };
    } catch (err: any) {
      console.error('❌ Unexpected sign up error:', err);
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.'
        }
      };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'exp://localhost:8081/--/home',
      },
    });
    return { error };
  };

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'exp://localhost:8081/--/home',
      },
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    // Force clear state
    setSession(null);
    setUser(null);
  };

  const completeOnboarding = async () => {
    if (!user) {
      console.log('No user logged in, skipping onboarding completion');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating onboarding status:', error);
      } else {
        setHasCompletedOnboarding(true);
        console.log('Onboarding marked as complete');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    hasCompletedOnboarding,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
