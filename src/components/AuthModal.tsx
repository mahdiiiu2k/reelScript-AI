
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Redirecting to Google...');
      // The redirect will be handled by the auth state change
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to Reel Script AI
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Sign in to access premium features and save your scripts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
            size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>
          
          <div className="text-center text-sm text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
