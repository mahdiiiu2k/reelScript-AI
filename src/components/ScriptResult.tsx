
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Copy, CheckCircle, ArrowLeft } from 'lucide-react';

interface ScriptResultProps {
  script: string;
  onNewScript: () => void;
}

export const ScriptResult: React.FC<ScriptResultProps> = ({ script, onNewScript }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    toast.success('Script copied to clipboard!');
  };

  const formatScript = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
      if (section.trim().startsWith('**') && section.trim().endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-900 mb-3">
            {section.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Script Generated
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Your script is ready!
        </h1>
        <p className="text-gray-600">
          Copy the script below and start creating your viral reel
        </p>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Generated Script
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your personalized Instagram reel script
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="prose prose-gray max-w-none">
              {formatScript(script)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Script
            </Button>
            <Button 
              onClick={onNewScript}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Generate New Script
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-3">💡 Pro Tips</h4>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Practice your script before recording to sound natural</li>
            <li>• Use engaging visuals that match your script content</li>
            <li>• Add trending music or sounds to increase reach</li>
            <li>• Include relevant hashtags in your caption</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
