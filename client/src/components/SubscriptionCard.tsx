
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Crown, Check, Sparkles } from 'lucide-react';

export const SubscriptionCard: React.FC = () => {
  const { user, subscription, checkSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
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

  const handleManageSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/customer-portal', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create customer portal session');
      }

      const data = await response.json();
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Failed to open customer portal');
      console.error('Customer portal error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Unlimited script generation',
    'Access to all premium hooks and CTAs',
    'Advanced tone customization',
    'Priority customer support',
    'No daily limits'
  ];

  if (subscription.subscribed) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Badge className="bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              <Crown className="h-3 w-3 mr-1" />
              Premium Active
            </Badge>
          </div>
          <CardTitle className="text-xl text-purple-800 dark:text-purple-200">
            You're all set! 🎉
          </CardTitle>
          <CardDescription className="text-purple-600 dark:text-purple-300">
            Enjoy unlimited access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button 
              onClick={handleManageSubscription}
              disabled={isLoading}
              variant="outline"
              className="border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              {isLoading ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </div>
          <Button 
            onClick={checkSubscription}
            variant="ghost"
            size="sm"
            className="w-full text-purple-600 dark:text-purple-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-300">
            Premium
          </Badge>
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Unlock Premium Features
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">$5</span>
          <span className="text-sm">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={handleSubscribe}
          disabled={isLoading || !user}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          size="lg"
        >
          {isLoading ? 'Processing...' : user ? 'Subscribe Now' : 'Sign In to Subscribe'}
        </Button>
        
        {!user && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Sign in with Google to get started
          </p>
        )}
      </CardContent>
    </Card>
  );
};
