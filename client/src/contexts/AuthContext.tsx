
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

interface AuthContextType {
  user: User | null;
  subscription: SubscriptionInfo;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

let supabase: any = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({ subscribed: false });
  const [loading, setLoading] = useState(true);

  const initializeSupabase = async () => {
    try {
      const response = await fetch('/api/auth/config');
      const config = await response.json();
      
      if (config.supabaseUrl && config.supabaseKey) {
        supabase = createClient(config.supabaseUrl, config.supabaseKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        });
        
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event: string, session: any) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
            });
            checkBackendAuth();
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSubscription({ subscribed: false });
          }
        });
        
        // Check initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          });
          checkBackendAuth();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing Supabase:', error);
      setLoading(false);
    }
  };

  const checkBackendAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      } else {
        setSubscription({ subscribed: false });
      }
    } catch (error) {
      console.error('Error checking backend auth:', error);
      setSubscription({ subscribed: false });
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      } else {
        setSubscription({ subscribed: false });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ subscribed: false });
    }
  };

  const signInWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setSubscription({ subscribed: false });
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const createCheckoutSession = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  useEffect(() => {
    initializeSupabase();
  }, []);

  const value = {
    user,
    subscription,
    loading,
    signInWithGoogle,
    signOut,
    checkSubscription,
    createCheckoutSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
