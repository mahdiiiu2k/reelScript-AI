
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ScriptForm } from '@/components/ScriptForm';
import { ScriptResult } from '@/components/ScriptResult';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, subscription, loading, checkSubscription } = useAuth();

  useEffect(() => {
    // Check for success/cancel URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      const sessionId = urlParams.get('session_id');
      toast.success('Payment successful! Activating your premium access...');
      
      // Call backend to verify and activate subscription
      if (sessionId && user) {
        fetch('/api/subscription/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ session_id: sessionId })
        }).then(response => {
          if (response.ok) {
            checkSubscription();
            toast.success('Premium access activated!');
          } else {
            toast.error('Failed to activate subscription. Please contact support.');
          }
        }).catch(() => {
          toast.error('Error activating subscription.');
        });
      } else if (checkSubscription) {
        // Fallback: just refresh subscription status
        setTimeout(() => checkSubscription(), 2000);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      toast.info('Subscription canceled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('auth') === 'success') {
      toast.success('Successfully signed in!');
      // Refresh subscription status after auth
      if (checkSubscription) {
        setTimeout(() => checkSubscription(), 1000);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('error')) {
      const error = urlParams.get('error');
      if (error === 'oauth_not_configured') {
        toast.error('Google sign-in is not configured. Please contact support.');
      } else if (error === 'auth_failed') {
        toast.error('Sign-in failed. Please try again.');
      } else if (error?.startsWith('oauth_')) {
        toast.error('Sign-in was canceled or failed. Please try again.');
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [checkSubscription]);

  const handleScriptGenerated = (script: string) => {
    setGeneratedScript(script);
  };

  const handleNewScript = () => {
    setGeneratedScript(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className={`grid gap-8 ${subscription.subscribed ? 'grid-cols-1 max-w-4xl mx-auto' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Subscription Card - Only show for non-subscribers */}
          {!subscription.subscribed && (
            <div className="lg:col-span-1">
              <SubscriptionCard />
            </div>
          )}

          {/* Main content */}
          <div className={subscription.subscribed ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 md:p-8">
              {!generatedScript ? (
                <ScriptForm 
                  onScriptGenerated={handleScriptGenerated}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                  hasActiveSubscription={subscription.subscribed}
                />
              ) : (
                <ScriptResult 
                  script={generatedScript}
                  onNewScript={handleNewScript}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
