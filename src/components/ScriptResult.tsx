
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Edit, Play } from 'lucide-react';

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
          <h3 key={index} className="text-lg font-semibold text-purple-600 mb-2">
            {section.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={index} className="text-foreground leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Play className="h-3 w-3 mr-1" />
              Script Generated
            </Badge>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Reel Script is Ready!
          </CardTitle>
          <CardDescription className="text-lg">
            Copy the script below and start creating your viral reel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50">
            <div className="prose prose-gray max-w-none">
              {formatScript(script)}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Copy Script
            </Button>
            <Button 
              onClick={onNewScript}
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Generate New Script
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50/80 backdrop-blur-md border-blue-200/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips for Your Reel:</h4>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Practice your script before recording to sound natural</li>
            <li>• Use engaging visuals that match your script content</li>
            <li>• Add trending music or sounds to increase reach</li>
            <li>• Include relevant hashtags in your caption</li>
            <li>• Post during your audience's most active hours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
