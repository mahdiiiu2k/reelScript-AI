import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Star, Zap } from 'lucide-react';

export const SignInPrompt: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Premium Access
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Get Full Access - $5/month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Unlimited script generation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>Access to all premium hooks and CTAs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Crown className="h-4 w-4 text-purple-500" />
            <span>Advanced tone customization</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Star className="h-4 w-4 text-green-500" />
            <span>No daily limits</span>
          </div>
        </div>
        
        <Button 
          onClick={signInWithGoogle}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google to get started
        </Button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Start your free trial today. Cancel anytime.
        </p>
      </CardContent>
    </Card>
  );
};