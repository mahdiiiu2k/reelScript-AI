
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { generateScript } from '@/services/scriptGenerator';
import { languages } from '@/data/languages';
import { Play, Sparkles, Check } from 'lucide-react';

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
    customLength: '',
    language: 'English',
    customLanguage: '',
    tone: '',
    customTone: '',
    structure: '',
    customStructure: '',
    goal: '',
    customGoal: '',
    targetAudience: '',
    customAudience: '',
    audienceAge: ''
  });

  const toneOptions = [
    'Inspirational', 'Motivational / Hype', 'Educational / Informative',
    'Relatable / Casual', 'Funny / Sarcastic', 'Dramatic / Emotional',
    'Authoritative / Confident', 'Urgent / FOMO', 'Calm / Minimalist',
    'Controversial / Bold'
  ];

  const structureOptions = [
    'Hook – Value – CTA', 'Problem – Agitation – Solution',
    'Before – After – Bridge', 'List Format', 'Mini Story – Lesson – Takeaway',
    'Question – Answer – Action', 'Myth – Truth – Example',
    'What / Why / How'
  ];

  const goalOptions = [
    'Increase engagement', 'Build personal brand', 'Educate',
    'Drive traffic', 'Gain followers', 'Sell product/service',
    'Inspire / Motivate', 'Entertain', 'Start a trend',
    'Build trust / credibility'
  ];

  const audienceOptions = [
    'Gamers', 'Fitness Fans', 'Entrepreneurs', 'Students',
    'Parents', 'Tech Enthusiasts', 'Fashion Lovers', 'Food Lovers',
    'Travel Enthusiasts', 'Artists', 'Musicians', 'Crypto Investors',
    'Small Business Owners', 'Content Creators', 'Remote Workers'
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
    <Card className="w-full bg-white/95 backdrop-blur-lg border-white/40 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
          Create Your Viral Reel Script
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground mt-2">
          Fill in the details below to generate a compelling Instagram reel script
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              Basic Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">Reel Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your reel should be about, the main message, or key points you want to cover..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
                className="border-2 focus:border-purple-300 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Reel Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your reel"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-2 focus:border-purple-300 transition-colors"
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 h-px" />

          {/* Technical Specifications */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              Technical Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Reel Length</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-800 to-purple-900 text-white font-bold rounded-lg my-1 mx-1 focus:bg-purple-900 hover:bg-purple-900 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span>Let AI choose the perfect length</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom length
                    </SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">60 seconds</SelectItem>
                    <SelectItem value="90s">90 seconds</SelectItem>
                  </SelectContent>
                </Select>
                {formData.length === 'custom' && (
                  <Input
                    placeholder="Enter specific length (e.g., 45 seconds)"
                    value={formData.customLength}
                    onChange={(e) => setFormData(prev => ({ ...prev, customLength: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Language / Dialect</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom language/dialect
                    </SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.language === 'custom' && (
                  <Input
                    placeholder="Enter custom language or dialect"
                    value={formData.customLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 h-px" />

          {/* Content Style */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              Content Style
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Choose tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-800 to-purple-900 text-white font-bold rounded-lg my-1 mx-1 focus:bg-purple-900 hover:bg-purple-900 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span>Let AI choose the perfect tone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom tone
                    </SelectItem>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.tone === 'custom' && (
                  <Input
                    placeholder="Describe your custom tone"
                    value={formData.customTone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTone: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Script Structure</Label>
                <Select value={formData.structure} onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Choose structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-800 to-purple-900 text-white font-bold rounded-lg my-1 mx-1 focus:bg-purple-900 hover:bg-purple-900 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span>Let AI choose the perfect structure</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom structure
                    </SelectItem>
                    {structureOptions.map((structure) => (
                      <SelectItem key={structure} value={structure}>{structure}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.structure === 'custom' && (
                  <Input
                    placeholder="Describe your custom structure"
                    value={formData.customStructure}
                    onChange={(e) => setFormData(prev => ({ ...prev, customStructure: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 h-px" />

          {/* Audience & Goals */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              Audience & Goals
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Reel Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-800 to-purple-900 text-white font-bold rounded-lg my-1 mx-1 focus:bg-purple-900 hover:bg-purple-900 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span>Let AI choose the perfect goal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom goal
                    </SelectItem>
                    {goalOptions.map((goal) => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.goal === 'custom' && (
                  <Input
                    placeholder="Describe your custom goal"
                    value={formData.customGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-800 to-purple-900 text-white font-bold rounded-lg my-1 mx-1 focus:bg-purple-900 hover:bg-purple-900 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span>Let AI choose the perfect audience</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom audience
                    </SelectItem>
                    {audienceOptions.map((audience) => (
                      <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.targetAudience === 'custom' && (
                  <Input
                    placeholder="Describe your target audience"
                    value={formData.customAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, customAudience: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceAge" className="text-base font-medium">Audience Age (Optional)</Label>
              <Input
                id="audienceAge"
                placeholder="e.g., 18-25, 25-34, or specific age"
                value={formData.audienceAge}
                onChange={(e) => setFormData(prev => ({ ...prev, audienceAge: e.target.value }))}
                className="border-2 focus:border-purple-300 transition-colors"
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 h-px" />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Script...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Generate Script</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
