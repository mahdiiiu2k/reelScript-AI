
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Crown, Bot, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user, session, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing if not authenticated
    if (!user) {
      navigate('/');
      return;
    }

    // Redirect to main app if already subscribed
    if (subscription.subscribed) {
      navigate('/app');
      return;
    }
  }, [user, subscription.subscribed, navigate]);

  const handleSubscribe = async () => {
    if (!session) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Unlimited script generation',
    'Access to all premium hooks and CTAs',
    'Advanced tone customization',
    'No daily limits'
  ];

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Reel Script AI
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Complete your subscription
            </p>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <p className="text-slate-300">Welcome, <span className="text-purple-400">{user.email}</span></p>
          </div>

          {/* Subscription Card */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-6 w-6 text-purple-400" />
                <Badge variant="secondary" className="bg-purple-900/70 text-purple-300 border-purple-700">
                  Premium
                </Badge>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Get Full Access Now
              </CardTitle>
              <CardDescription className="text-lg text-slate-300">
                <span className="text-3xl font-bold text-purple-400">$5</span>
                <span className="text-sm">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Subscribe Now with Stripe'}
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Landing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
