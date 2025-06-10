
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
import { play } from 'lucide-react';

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
    tones: [] as string[],
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

  const handleToneChange = (tone: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, tones: [...prev.tones, tone] }));
    } else {
      setFormData(prev => ({ ...prev, tones: prev.tones.filter(t => t !== tone) }));
    }
  };

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
    <Card className="w-full bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create Your Viral Reel Script
        </CardTitle>
        <CardDescription className="text-lg">
          Fill in the details below to generate a compelling Instagram reel script
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Reel Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your reel"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Reel Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your reel should be about, the main message, or key points you want to cover..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Technical Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reel Length</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">60 seconds</SelectItem>
                    <SelectItem value="90s">90 seconds</SelectItem>
                    <SelectItem value="custom">Custom length</SelectItem>
                    <SelectItem value="ai-choose">Let AI choose</SelectItem>
                  </SelectContent>
                </Select>
                {formData.length === 'custom' && (
                  <Input
                    placeholder="Enter specific length (e.g., 45 seconds)"
                    value={formData.customLength}
                    onChange={(e) => setFormData(prev => ({ ...prev, customLength: e.target.value }))}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Language / Dialect</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom language/dialect</SelectItem>
                  </SelectContent>
                </Select>
                {formData.language === 'custom' && (
                  <Input
                    placeholder="Enter custom language or dialect"
                    value={formData.customLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                  />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Content Style */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Content Style</h3>
            
            <div className="space-y-2">
              <Label>Tone (Select multiple)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {toneOptions.map((tone) => (
                  <div key={tone} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tone-${tone}`}
                      checked={formData.tones.includes(tone)}
                      onCheckedChange={(checked) => handleToneChange(tone, checked as boolean)}
                    />
                    <Label htmlFor={`tone-${tone}`} className="text-sm">{tone}</Label>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tones.map((tone) => (
                  <Badge key={tone} variant="secondary">{tone}</Badge>
                ))}
              </div>
              <Input
                placeholder="Custom tone (optional)"
                value={formData.customTone}
                onChange={(e) => setFormData(prev => ({ ...prev, customTone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Script Structure</Label>
              <Select value={formData.structure} onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose structure" />
                </SelectTrigger>
                <SelectContent>
                  {structureOptions.map((structure) => (
                    <SelectItem key={structure} value={structure}>{structure}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom structure</SelectItem>
                  <SelectItem value="ai-choose">Let AI choose</SelectItem>
                </SelectContent>
              </Select>
              {formData.structure === 'custom' && (
                <Input
                  placeholder="Describe your custom structure"
                  value={formData.customStructure}
                  onChange={(e) => setFormData(prev => ({ ...prev, customStructure: e.target.value }))}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Audience & Goals */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Audience & Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reel Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalOptions.map((goal) => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom goal</SelectItem>
                    <SelectItem value="ai-choose">Let AI choose</SelectItem>
                  </SelectContent>
                </Select>
                {formData.goal === 'custom' && (
                  <Input
                    placeholder="Describe your custom goal"
                    value={formData.customGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map((audience) => (
                      <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom audience</SelectItem>
                    <SelectItem value="ai-choose">Let AI choose</SelectItem>
                  </SelectContent>
                </Select>
                {formData.targetAudience === 'custom' && (
                  <Input
                    placeholder="Describe your target audience"
                    value={formData.customAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, customAudience: e.target.value }))}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceAge">Audience Age (Optional)</Label>
              <Input
                id="audienceAge"
                placeholder="e.g., 18-25, 25-34, or specific age"
                value={formData.audienceAge}
                onChange={(e) => setFormData(prev => ({ ...prev, audienceAge: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Script...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <play className="h-5 w-5" />
                <span>Generate Script</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
