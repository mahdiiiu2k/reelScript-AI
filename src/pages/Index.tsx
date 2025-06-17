
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ScriptForm } from '@/components/ScriptForm';
import { ScriptResult } from '@/components/ScriptResult';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing if not authenticated
    if (!loading && !user) {
      navigate('/');
      return;
    }

    // Redirect to checkout if authenticated but not subscribed
    if (!loading && user && !subscription.subscribed) {
      navigate('/checkout');
      return;
    }

    // Check for success/cancel URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast.success('Subscription activated! Welcome to Premium!');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      toast.info('Subscription canceled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Redirect back to checkout
      navigate('/checkout');
    }
  }, [user, subscription.subscribed, loading, navigate]);

  const handleScriptGenerated = (script: string) => {
    setGeneratedScript(script);
  };

  const handleNewScript = () => {
    setGeneratedScript(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user || !subscription.subscribed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 md:p-8">
              {!generatedScript ? (
                <ScriptForm 
                  onScriptGenerated={handleScriptGenerated}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              ) : (
                <ScriptResult 
                  script={generatedScript}
                  onNewScript={handleNewScript}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SubscriptionCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
