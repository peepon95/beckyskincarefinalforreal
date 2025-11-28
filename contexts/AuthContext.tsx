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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
