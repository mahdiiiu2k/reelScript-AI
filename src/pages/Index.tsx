
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
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 md:p-8">
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
        </div>
      </main>
    </div>
  );
};

export default Index;
