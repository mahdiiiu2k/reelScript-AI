import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Edit, Play, Copy, CheckCircle, Lightbulb, TrendingUp, Users, Clock, Hash, Music } from 'lucide-react';

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
          <h3 key={index} className="text-xl font-bold text-purple-700 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>{section.replace(/\*\*/g, '')}</span>
          </h3>
        );
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-base">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Success Animation Card */}
      <Card className="relative w-full bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-green-500/10 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl p-[1px]">
          <div className="bg-white rounded-3xl h-full w-full"></div>
        </div>
        
        <div className="relative">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 px-4 py-2 rounded-full text-sm font-semibold">
                <Play className="h-4 w-4 mr-2" />
                Script Generated Successfully
              </Badge>
            </div>
            
            <CardTitle className="text-4xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-bold mb-4">
              Your Viral Reel Script is Ready!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your AI-generated script is optimized for engagement and ready to help you create viral content. 
              Copy it below and start filming your next hit reel!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 px-8 pb-12">
            {/* Script Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-100 shadow-inner">
                <div className="prose prose-gray max-w-none">
                  {formatScript(script)}
                </div>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 h-px" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1 sm:flex-none border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy Script
              </Button>
              <Button 
                onClick={onNewScript}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Edit className="h-5 w-5 mr-2" />
                Generate New Script
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Pro Tips Card */}
      <Card className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-0 shadow-xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10"></div>
        
        <CardContent className="relative pt-8 pb-8 px-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800">Pro Tips for Maximum Impact</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Practice Makes Perfect</h5>
                  <p className="text-gray-600 text-sm">Rehearse your script multiple times to sound natural and confident on camera.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Engage Your Audience</h5>
                  <p className="text-gray-600 text-sm">Use engaging visuals and maintain eye contact to keep viewers hooked.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Music className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Add Trending Audio</h5>
                  <p className="text-gray-600 text-sm">Include popular music or sounds to increase your reel's discoverability.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Hash className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Strategic Hashtags</h5>
                  <p className="text-gray-600 text-sm">Research and use relevant hashtags to reach your target audience effectively.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Optimal Timing</h5>
                  <p className="text-gray-600 text-sm">Post during your audience's most active hours for maximum engagement.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Strong Hook</h5>
                  <p className="text-gray-600 text-sm">Start with an attention-grabbing first 3 seconds to stop the scroll.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};