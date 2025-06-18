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
import { Play, Sparkles, Check, X, Plus, ChevronDown } from 'lucide-react';
import { PreviousScriptCard } from "./PreviousScriptCard";

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
    isAIChosenTone: false,
    structure: '',
    customStructure: '',
    hook: '',
    customHook: '',
    cta: '',
    customCta: '',
    goal: '',
    customGoal: '',
    targetAudience: '',
    customAudience: '',
    audienceAge: '',
    previousScripts: [] as string[],
  });
  const [previousScriptInput, setPreviousScriptInput] = useState("");
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

  const hookOptions = [
    // Curiosity-Driven Hooks
    '"No one\'s talking about this but it changes everything…"',
    '"Here\'s what I wish I knew before I started…"',
    '"You won\'t believe what happened when I tried this…"',
    '"Everyone gets this wrong… except the top 1%."',
    '"This one small shift changed everything for me."',
    
    // Problem/Pain-Based Hooks
    '"Still struggling with [problem]? Here\'s the real reason why."',
    '"If you\'re doing this, you\'re wasting your time."',
    '"Why you can\'t [achieve goal] — and how to fix it."',
    '"Here\'s why your [business/content/fitness/etc.] isn\'t growing."',
    
    // Bold/Controversial Hooks
    '"This is going to trigger some people…"',
    '"I said what I said: [unpopular opinion]."',
    '"Stop doing this immediately if you want to grow."',
    '"You\'ve been lied to about [common belief]."',
    
    // Value-Packed List Hooks
    '"3 things I wish I knew earlier…"',
    '"Here are 5 quick hacks to improve your [topic] today."',
    '"Top 3 mistakes you\'re making with [topic]."',
    '"Want to grow fast? Start doing these 3 things."',
    
    // Question Hooks
    '"What\'s the #1 reason you\'re not growing on Instagram?"',
    '"Do you know what\'s really holding you back?"',
    '"Ever wondered why your reels flop?"',
    '"What if I told you [unexpected truth]?"',
    
    // Viral/Trend-Based Hooks
    '"POV: You\'re finally taking [topic] seriously."',
    '"I tried [popular thing] for 30 days — here\'s what happened."',
    '"Here\'s how I got [X result] with 0 experience."',
    '"This trend actually works, but no one tells you how to use it."',
    
    // "Did You Know?" / Fact Hooks
    '"Did you know this trick is used by all top creators?"',
    '"Most people don\'t realize this… but it matters."',
    '"Here\'s a stat that might blow your mind…"',
    '"This ancient trick is now used by billionaires."',
    
    // Fast Impact Hooks
    '"Stop scrolling. This will change your [life/business]."',
    '"In just 15 seconds, you\'ll know exactly what to do."',
    '"This might be the most important thing you hear today."'
  ];

  const ctaOptions = [
    // Engagement
    '"Double tap if this hit you!"',
    '"Tag someone who needs this today."',
    '"Comment 🔥 if you agree!"',
    '"Save this for later—trust me, you\'ll need it."',
    '"Share this with a friend who needs to hear it."',
    '"Which one are you? Comment below 👇"',
    
    // Followers & Community Building
    '"Follow for more real-talk like this."',
    '"Want more content like this? Hit follow!"',
    '"I post daily tips just like this—follow to stay ahead."',
    '"Join the tribe—follow now."',
    
    // Educational / Informative
    '"Screenshot this so you don\'t forget."',
    '"Try this out and let me know how it goes."',
    '"Bookmark this—this one\'s gold."',
    '"Want a full breakdown? DM me \'INFO\'."',
    
    // Sales / Product or Service
    '"Click the link in my bio to get started."',
    '"Grab your free trial today—link in bio."',
    '"Spots are limited—DM me the word \'JOIN\'."',
    '"Want this result? My program is open now."',
    
    // Inspire / Motivate
    '"Take the first step today. You got this."',
    '"Believe in yourself—start now."',
    '"Your future self is waiting. Let\'s go."',
    '"It\'s never too late to become who you were meant to be."',
    
    // Entertain / Humor
    '"Tag your lazy friend 😂"',
    '"If this is you… no shame. We\'ve all been there."',
    '"Send this to someone who needs this energy."',
    '"Like if you laughed, comment if it\'s too real."',
    
    // Drive Traffic / Website / Link Click
    '"Check the full thing in my bio."',
    '"Full version on my YouTube—link in bio."',
    '"I go deeper into this in my free guide—link in bio."',
    '"Want to go next level? You know where to click."'
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
        : [...prev.tones, tone],
      isAIChosenTone: false
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
    setFormData(prev => ({ 
      ...prev, 
      tones: [],
      isAIChosenTone: true
    }));
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
            customTone: '',
            isAIChosenTone: false
          };
        }
        return { ...prev, customTone: '' };
      });
    }
  }, [formData.customTone]);

  const handleAddPreviousScript = useCallback(() => {
    const script = previousScriptInput.trim();
    if (script) {
      setFormData(prev => ({
        ...prev,
        previousScripts: [...prev.previousScripts, script]
      }));
      setPreviousScriptInput("");
    }
  }, [previousScriptInput]);

  const handlePreviousScriptKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleAddPreviousScript();
    }
  }, [handleAddPreviousScript]);

  const handleRemoveScript = useCallback((idx: number) => {
    setFormData(prev => ({
      ...prev,
      previousScripts: prev.previousScripts.filter((_, i) => i !== idx)
    }));
  }, []);

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
    <Card className="w-full bg-transparent dark:bg-transparent backdrop-blur-lg border-gray-200/40 dark:border-slate-600/40 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold">
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
                className="border-2 focus:border-purple-300 dark:focus:border-purple-500 transition-colors bg-background dark:bg-slate-900/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Reel Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your reel"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-2 focus:border-purple-300 dark:focus:border-purple-500 transition-colors bg-background dark:bg-slate-900/50"
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 h-px" />

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
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
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
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Language / Dialect</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
                        </div>
                        <span>Let AI choose the perfect language</span>
                      </div>
                    </SelectItem>
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
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 h-px" />

          {/* Content Style */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              Content Style
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tone Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Tone (Multiple Selection)</Label>
                <div className="relative">
                  <div 
                    className="border-2 focus:border-purple-300 dark:focus:border-purple-500 rounded-md p-3 cursor-pointer bg-background dark:bg-slate-900/50 hover:bg-accent/50 transition-colors min-h-[40px] flex items-center justify-between"
                    onClick={handleToneDropdownToggle}
                  >
                    <div className="flex flex-wrap gap-1">
                      {formData.isAIChosenTone ? (
                        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI will choose
                          </div>
                        </Badge>
                      ) : formData.tones.length === 0 ? (
                        <span className="text-muted-foreground">Select tones...</span>
                      ) : (
                        formData.tones.map((tone) => (
                          <Badge 
                            key={tone} 
                            variant="secondary" 
                            className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800/50 flex items-center gap-1"
                          >
                            {tone}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={(e) => handleToneRemove(tone, e)}
                            />
                          </Badge>
                        ))
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isToneDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isToneDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div 
                          className="bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200 font-bold rounded-lg p-3 mb-2 cursor-pointer"
                          onClick={handleLetAIChooseTone}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-purple-700 dark:text-purple-300" />
                            </div>
                            <span>Let AI choose the perfect tone</span>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Add custom tone..."
                              value={formData.customTone}
                              onChange={(e) => setFormData(prev => ({ ...prev, customTone: e.target.value }))}
                              onKeyPress={handleCustomToneKeyPress}
                              className="text-sm flex-1 bg-background dark:bg-slate-900/50"
                            />
                            <Button
                              type="button"
                              onClick={handleAddCustomTone}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                              size="sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>

                        {toneOptions.map((tone) => (
                          <div 
                            key={tone}
                            className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                            onClick={() => handleToneToggle(tone)}
                          >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${formData.tones.includes(tone) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-slate-500'}`}>
                              {formData.tones.includes(tone) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm">{tone}</span>
                          </div>
                        ))}
                        
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Script Structure */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Script Structure</Label>
                <Select value={formData.structure} onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Choose structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
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
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>
            </div>

            {/* Hook Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Hook</Label>
                <Select value={formData.hook} onValueChange={(value) => setFormData(prev => ({ ...prev, hook: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Choose hook" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
                        </div>
                        <span>Let AI choose the perfect hook</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom hook
                    </SelectItem>
                    {hookOptions.map((hook) => (
                      <SelectItem key={hook} value={hook}>{hook}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.hook === 'custom' && (
                  <Input
                    placeholder="Enter your custom hook"
                    value={formData.customHook}
                    onChange={(e) => setFormData(prev => ({ ...prev, customHook: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>
            </div>

            {/* Previous Reels Scripts Input */}
            <div className="space-y-2">
              <Label htmlFor="previousScriptInput" className="text-base font-medium">
                Paste your previous reel scripts (optional)
              </Label>
              <Textarea
                id="previousScriptInput"
                placeholder="Add scripts from past reels—help the AI match your unique speaking style!"
                value={previousScriptInput}
                onChange={(e) => setPreviousScriptInput(e.target.value)}
                onKeyDown={handlePreviousScriptKeyDown}
                rows={3}
                className="border-2 focus:border-purple-300 dark:focus:border-purple-500 transition-colors bg-background dark:bg-slate-900/50"
              />
              <div className="flex justify-end mt-1">
                <Button
                  type="button"
                  onClick={handleAddPreviousScript}
                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 text-sm rounded"
                  size="sm"
                  disabled={!previousScriptInput.trim()}
                >
                  + Add a previous script
                </Button>
              </div>
              {formData.previousScripts.length > 0 && (
                <div className="mt-4 space-y-4">
                  {formData.previousScripts.map((script, idx) => (
                    <PreviousScriptCard
                      key={idx}
                      script={script}
                      index={idx}
                      onRemove={() => handleRemoveScript(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 h-px" />

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
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
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
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
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
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
                  />
                )}
              </div>
            </div>

            {/* CTA Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Call to Action (CTA)</Label>
                <Select value={formData.cta} onValueChange={(value) => setFormData(prev => ({ ...prev, cta: value }))}>
                  <SelectTrigger className="border-2 focus:border-purple-300 dark:focus:border-purple-500 bg-background dark:bg-slate-900/50">
                    <SelectValue placeholder="Choose CTA" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="ai-choose" className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 font-bold rounded-lg my-1 mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-700" />
                        </div>
                        <span>Let AI choose the perfect CTA</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 font-medium rounded-md my-1 mx-1">
                      Custom CTA
                    </SelectItem>
                    <SelectItem value="no-cta" className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md my-1 mx-1">
                      Generate without CTA
                    </SelectItem>
                    {ctaOptions.map((cta) => (
                      <SelectItem key={cta} value={cta}>{cta}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.cta === 'custom' && (
                  <Input
                    placeholder="Enter your custom CTA"
                    value={formData.customCta}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCta: e.target.value }))}
                    className="mt-2 border-amber-200 focus:border-amber-400 dark:border-amber-600 dark:focus:border-amber-500 bg-background dark:bg-slate-900/50"
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
                className="border-2 focus:border-purple-300 dark:focus:border-purple-500 transition-colors bg-background dark:bg-slate-900/50"
              />
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 h-px" />

          {/* Submit Button */}
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
