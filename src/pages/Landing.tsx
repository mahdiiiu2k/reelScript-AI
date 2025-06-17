
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Bot } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    'Unlimited script generation',
    'Access to all premium hooks and CTAs',
    'Advanced tone customization',
    'No daily limits'
  ];

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
              <h1 className="text-3xl font-bold text-white">
                Reel Script AI
              </h1>
            </div>
            <p className="text-slate-300 text-lg">
              Generate viral Instagram scripts instantly
            </p>
          </div>

          {/* Subscription Card */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-6 w-6 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Premium
                </Badge>
              </div>
              <CardTitle className="text-2xl text-purple-600">
                Get Full Access Now
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                <span className="text-3xl font-bold text-purple-600">$5</span>
                <span className="text-sm text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                Sign In to Subscribe
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Sign in with Google to get started
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Landing;
