
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ScriptForm } from '@/components/ScriptForm';
import { ScriptResult } from '@/components/ScriptResult';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleScriptGenerated = (script: string) => {
    setGeneratedScript(script);
  };

  const handleNewScript = () => {
    setGeneratedScript(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!generatedScript ? (
          <ScriptForm 
            onScriptGenerated={handleScriptGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        ) : (
          <ScriptResult 
            script={generatedScript}
            onNewScript={handleNewScript}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
