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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Header />
      <main className="relative container mx-auto px-4 py-12 max-w-5xl">
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