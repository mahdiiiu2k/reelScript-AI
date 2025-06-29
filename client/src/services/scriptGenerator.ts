
interface FormData {
  title: string;
  description: string;
  length: string;
  customLength: string;
  language: string;
  customLanguage: string;
  tones: string[];
  customTone: string;
  isAIChosenTone: boolean;
  structure: string;
  customStructure: string;
  hook: string;
  customHook: string;
  cta: string;
  customCta: string;
  goal: string;
  customGoal: string;
  targetAudience: string;
  customAudience: string;
  audienceAge: string;
  previousScripts?: string[];
}

export const generateScript = async (formData: FormData): Promise<string> => {
  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate script');
    }

    const data = await response.json();
    return data.script;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
};

const buildPrompt = (formData: FormData): string => {
  let prompt = `You are a professional Instagram Reel scriptwriter. Generate a high-quality, time-stamped script based on the user's selected options. The script should contain the exact words the creator will say in the reel.

Use the following structure:

---

🎬 Reel Title (optional): ${formData.title || 'N/A'}
📝 Reel Description / Topic: ${formData.description}`;

  // Length
  if (formData.length && formData.length !== 'ai-choose') {
    if (formData.length === 'custom' && formData.customLength) {
      prompt += `\n⏱️ Length: ${formData.customLength}`;
    } else {
      prompt += `\n⏱️ Length: ${formData.length}`;
    }
  } else {
    prompt += `\n⏱️ Length: AI will choose optimal length`;
  }

  // Language
  const language = formData.language === 'custom' ? formData.customLanguage : formData.language;
  if (language && language !== 'English') {
    prompt += `\n🌐 Language / Dialect: ${language}`;
  } else {
    prompt += `\n🌐 Language / Dialect: English`;
  }

  // Tone
  if (formData.isAIChosenTone) {
    prompt += `\n🎭 Tone(s): AI will choose optimal tone`;
  } else if (formData.tones.length > 0 || formData.customTone) {
    prompt += `\n🎭 Tone(s): `;
    const tones = [...formData.tones];
    if (formData.customTone) {
      tones.push(formData.customTone);
    }
    prompt += tones.join(', ');
  } else {
    prompt += `\n🎭 Tone(s): AI will choose optimal tone`;
  }

  // Structure
  if (formData.structure && formData.structure !== 'ai-choose') {
    const structure = formData.structure === 'custom' ? formData.customStructure : formData.structure;
    prompt += `\n🧱 Script Structure: ${structure}`;
  } else {
    prompt += `\n🧱 Script Structure: AI will choose optimal structure`;
  }

  // Hook
  if (formData.hook && formData.hook !== 'ai-choose') {
    const hook = formData.hook === 'custom' ? formData.customHook : formData.hook;
    prompt += `\n🧲 Hook: ${hook}`;
  } else {
    prompt += `\n🧲 Hook: AI will choose optimal hook`;
  }

  // CTA
  if (formData.cta && formData.cta !== 'ai-choose') {
    if (formData.cta === 'no-cta') {
      prompt += `\n📢 CTA: No CTA - generate without call to action`;
    } else {
      const cta = formData.cta === 'custom' ? formData.customCta : formData.cta;
      prompt += `\n📢 CTA: ${cta}`;
    }
  } else {
    prompt += `\n📢 CTA: AI will choose optimal CTA`;
  }

  // Goal
  if (formData.goal && formData.goal !== 'ai-choose') {
    const goal = formData.goal === 'custom' ? formData.customGoal : formData.goal;
    prompt += `\n🎯 Reel Goal: ${goal}`;
  } else {
    prompt += `\n🎯 Reel Goal: AI will choose optimal goal`;
  }

  // Target Audience
  if (formData.targetAudience && formData.targetAudience !== 'ai-choose') {
    const audience = formData.targetAudience === 'custom' ? formData.customAudience : formData.targetAudience;
    prompt += `\n👥 Target Audience: ${audience}`;
  } else {
    prompt += `\n👥 Target Audience: AI will choose optimal audience`;
  }

  // Audience Age
  if (formData.audienceAge) {
    prompt += `\n👶 Audience Age (optional): ${formData.audienceAge}`;
  }

  prompt += `\n\n---\n\n📜 Output Format (Final Script Structure):\n\n🧲 Hook: (0s to Xs)\n\n"Write the hook here,"\n\n🧠 Script Content:\n\n"don't forget the timed segments"\n\n📢 CTA (optional): (Final 3–5s)\n\n"Write a goal-based call to action"`;

  // Insert previous reel scripts/patterns, if provided
  if (formData.previousScripts && formData.previousScripts.length > 0) {
    prompt += `\n\nHere are examples of my previous reel scripts. Please mimic the speaking style and tone in the new script:\n`;
    formData.previousScripts.forEach((ex, i) => {
      prompt += `Script ${i + 1}: ${ex.trim()}\n`;
    });
  }

  prompt += `\n\nGenerate a professional, engaging script that follows the exact format above. Make sure to include time stamps and follow the specified structure, hook, and CTA requirements. The script should contain the exact words the creator will say in the reel.`;

  return prompt;
};
