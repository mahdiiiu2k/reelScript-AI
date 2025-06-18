
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({ subscribed: false });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSubscription(data.subscription);
      } else {
        setUser(null);
        setSubscription({ subscribed: false });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      setSubscription({ subscribed: false });
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/subscription/check', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setSubscription({ subscribed: false });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    subscription,
    loading,
    signInWithGoogle,
    signOut,
    checkSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
