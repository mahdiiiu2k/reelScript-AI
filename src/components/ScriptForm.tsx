
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generateScript } from '@/services/scriptGenerator';
import { languages } from '@/data/languages';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

interface ScriptFormProps {
  onScriptGenerated: (script: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({ 
  onScriptGenerated, 
  isGenerating, 
  setIsGenerating 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    length: '',
    language: 'English',
    tone: '',
    structure: '',
    goal: '',
    targetAudience: '',
    audienceAge: ''
  });

  const toneOptions = [
    'Inspirational', 'Motivational', 'Educational', 'Casual', 'Funny', 'Dramatic'
  ];

  const structureOptions = [
    'Hook – Value – CTA', 'Problem – Solution', 'Before – After', 'List Format'
  ];

  const goalOptions = [
    'Increase engagement', 'Build personal brand', 'Educate', 'Drive traffic'
  ];

  const audienceOptions = [
    'Gamers', 'Fitness Fans', 'Entrepreneurs', 'Students', 'Parents', 'Tech Enthusiasts'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Please provide a reel description');
      return;
    }

    setIsGenerating(true);
    
    try {
      const script = await generateScript(formData);
      onScriptGenerated(script);
      toast.success('Script generated successfully!');
    } catch (error) {
      toast.error('Failed to generate script. Please try again.');
      console.error('Script generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Create viral reel scripts with AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate compelling Instagram reel scripts that capture attention and drive engagement in seconds.
        </p>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Script Generator
          </CardTitle>
          <CardDescription className="text-gray-600">
            Fill in the details below to generate your script
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                  What's your reel about? *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your reel idea, main message, or key points you want to cover..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                  Title (optional)
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title for your reel"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Duration</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">60 seconds</SelectItem>
                    <SelectItem value="90s">90 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 max-h-60">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    {languages.slice(0, 10).map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Structure</Label>
                <Select value={formData.structure} onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Choose structure" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    {structureOptions.map((structure) => (
                      <SelectItem key={structure} value={structure}>{structure}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Audience & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    {goalOptions.map((goal) => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ai-choose" className="bg-indigo-50 text-indigo-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Let AI choose</span>
                      </div>
                    </SelectItem>
                    {audienceOptions.map((audience) => (
                      <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceAge" className="text-sm font-medium text-gray-900">
                Audience Age (optional)
              </Label>
              <Input
                id="audienceAge"
                placeholder="e.g., 18-25, 25-34, or specific age"
                value={formData.audienceAge}
                onChange={(e) => setFormData(prev => ({ ...prev, audienceAge: e.target.value }))}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-medium shadow-sm transition-colors"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating script...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Generate Script</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
