import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, subscription, signOut, createCheckoutSession } = useAuth();

  if (!user) {
    return null;
  }

  const handleSubscribe = () => {
    createCheckoutSession();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Subscription Status */}
      {!subscription.subscribed && (
        <Button 
          onClick={handleSubscribe}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2 text-sm"
        >
          Subscribe - $5/month
        </Button>
      )}
      
      {subscription.subscribed && (
        <span className="text-sm text-green-600 font-medium">
          Premium Active
        </span>
      )}

      {/* User Avatar and Info */}
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url || undefined} alt={user.name || user.email} />
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.name || user.email}
          </span>
          {user.name && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};