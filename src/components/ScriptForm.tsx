import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { generateScript } from '@/services/scriptGenerator';
import { languages } from '@/data/languages';
import { Play, Sparkles, Check, X, Plus, Wand2, Target, Users, Clock, Globe, Palette } from 'lucide-react';

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

  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);

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

  const handleToneToggle = useCallback((tone: string) => {
    setFormData(prev => ({
      ...prev,
      tones: prev.tones.includes(tone)
        ? prev.tones.filter(t => t !== tone)
        : [...prev.tones, tone]
    }));
  }, []);

  const handleToneDropdownToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToneDropdownOpen(prev => !prev);
  }, []);

  const handleToneRemove = useCallback((tone: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      tones: prev.tones.filter(t => t !== tone)
    }));
  }, []);

  const handleLetAIChooseTone = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => ({ ...prev, tones: [] }));
    setIsToneDropdownOpen(false);
  }, []);

  const handleCustomToneKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTone();
    }
  }, []);

  const handleAddCustomTone = useCallback(() => {
    const customToneValue = formData.customTone.trim();
    
    if (customToneValue) {
      setFormData(prev => {
        if (!prev.tones.includes(customToneValue)) {
          return { 
            ...prev, 
            tones: [...prev.tones, customToneValue],
            customTone: ''
          };
        }
        return { ...prev, customTone: '' };
      });
    }
  }, [formData.customTone]);

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
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative w-full bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-purple-500/10 rounded-3xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl p-[1px]">
          <div className="bg-white rounded-3xl h-full w-full"></div>
        </div>
        
        <div className="relative">
          <CardHeader className="text-center pb-8 pt-12 px-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-5xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold mb-4">
              Create Your Viral Reel Script
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into compelling Instagram reel scripts with our AI-powered generator. 
              Just fill in the details below and watch the magic happen.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-10 px-8 pb-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <span className="text-white text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                    <p className="text-gray-600">Tell us about your reel concept</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <span>Reel Description</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your reel should be about, the main message, or key points you want to cover..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                      className="border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 rounded-xl resize-none text-base"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-700">Reel Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="Enter a catchy title for your reel"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 rounded-xl text-base h-12"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 h-px" />

              {/* Technical Specifications */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Technical Specifications</h3>
                    <p className="text-gray-600">Set the duration and language preferences</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Reel Length</Label>
                    <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold rounded-lg my-1 mx-1 focus:bg-purple-100">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Let AI choose the perfect length</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom" className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 font-medium rounded-lg my-1 mx-1">
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
                        className="mt-3 border-2 border-amber-200 focus:border-amber-400 rounded-xl h-12"
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Language / Dialect</span>
                    </Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl border-2">
                        <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold rounded-lg my-1 mx-1 focus:bg-purple-100">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Let AI choose the perfect language</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom" className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 font-medium rounded-lg my-1 mx-1">
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
                        className="mt-3 border-2 border-amber-200 focus:border-amber-400 rounded-xl h-12"
                      />
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 h-px" />

              {/* Content Style */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Content Style</h3>
                    <p className="text-gray-600">Define the tone and structure of your script</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Tone (Multiple Selection)</Label>
                    <div className="relative">
                      <div 
                        className="border-2 border-gray-200 focus:border-purple-400 rounded-xl p-4 cursor-pointer bg-white hover:bg-gray-50 transition-all duration-300 min-h-[48px] flex items-center justify-between"
                        onClick={handleToneDropdownToggle}
                      >
                        <div className="flex flex-wrap gap-2">
                          {formData.tones.length === 0 ? (
                            <span className="text-gray-500">Select tones...</span>
                          ) : (
                            formData.tones.map((tone) => (
                              <Badge 
                                key={tone} 
                                variant="secondary" 
                                className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 hover:from-purple-200 hover:to-blue-200 flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200"
                              >
                                {tone}
                                <X 
                                  className="w-3 h-3 cursor-pointer hover:text-red-600 transition-colors" 
                                  onClick={(e) => handleToneRemove(tone, e)}
                                />
                              </Badge>
                            ))
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">▼</div>
                      </div>
                      
                      {isToneDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          <div className="p-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl p-4 mb-3 cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                              onClick={handleLetAIChooseTone}
                            >
                              <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5" />
                                <span>Let AI choose the perfect tone</span>
                              </div>
                            </div>
                            
                            {toneOptions.map((tone) => (
                              <div 
                                key={tone}
                                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                onClick={() => handleToneToggle(tone)}
                              >
                                <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${formData.tones.includes(tone) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 hover:border-purple-400'}`}>
                                  {formData.tones.includes(tone) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium">{tone}</span>
                              </div>
                            ))}
                            
                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Add custom tone..."
                                  value={formData.customTone}
                                  onChange={(e) => setFormData(prev => ({ ...prev, customTone: e.target.value }))}
                                  onKeyPress={handleCustomToneKeyPress}
                                  className="text-sm flex-1 border-gray-200 rounded-lg"
                                />
                                <Button
                                  type="button"
                                  onClick={handleAddCustomTone}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg"
                                  size="sm"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Script Structure</Label>
                    <Select value={formData.structure} onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue placeholder="Choose structure" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold rounded-lg my-1 mx-1 focus:bg-purple-100">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Let AI choose the perfect structure</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom" className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 font-medium rounded-lg my-1 mx-1">
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
                        className="mt-3 border-2 border-amber-200 focus:border-amber-400 rounded-xl h-12"
                      />
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 h-px" />

              {/* Audience & Goals */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Audience & Goals</h3>
                    <p className="text-gray-600">Define your target audience and objectives</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Reel Goal</Label>
                    <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold rounded-lg my-1 mx-1 focus:bg-purple-100">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Let AI choose the perfect goal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom" className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 font-medium rounded-lg my-1 mx-1">
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
                        className="mt-3 border-2 border-amber-200 focus:border-amber-400 rounded-xl h-12"
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Target Audience</span>
                    </Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold rounded-lg my-1 mx-1 focus:bg-purple-100">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Let AI choose the perfect audience</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom" className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 font-medium rounded-lg my-1 mx-1">
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
                        className="mt-3 border-2 border-amber-200 focus:border-amber-400 rounded-xl h-12"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="audienceAge" className="text-base font-semibold text-gray-700">Audience Age (Optional)</Label>
                  <Input
                    id="audienceAge"
                    placeholder="e.g., 18-25, 25-34, or specific age"
                    value={formData.audienceAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, audienceAge: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 rounded-xl h-12"
                  />
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 h-px" />

              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-4 px-12 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl border-0 min-w-[280px]"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Generating Script...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Play className="h-6 w-6" />
                      <span>Generate Script</span>
                      <Sparkles className="h-5 w-5 ml-2" />
                    </div>
                  )}
                  
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};