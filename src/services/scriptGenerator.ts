
interface FormData {
  title: string;
  description: string;
  length: string;
  customLength: string;
  language: string;
  customLanguage: string;
  tones: string[];
  customTone: string;
  structure: string;
  customStructure: string;
  goal: string;
  customGoal: string;
  targetAudience: string;
  customAudience: string;
  audienceAge: string;
}

export const generateScript = async (formData: FormData): Promise<string> => {
  const API_KEY = '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';
  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  // Build the prompt based on form data
  const prompt = buildPrompt(formData);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Reel Script AI'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Instagram reel script writer. Generate natural, engaging spoken scripts that creators would say aloud. Do not include scene directions, visual cues, or formatting instructions. Focus only on the spoken content that follows the specified tone, structure, and goals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
};

const buildPrompt = (formData: FormData): string => {
  let prompt = `Based on the following inputs, generate a natural, engaging spoken script for an Instagram reel. Only include what the creator would say aloud — no scene directions, no visuals, no formatting. The script should follow the chosen tone, structure, and goal, and be suitable for the selected reel length.

Inputs:`;

  if (formData.title) {
    prompt += `\nTitle: ${formData.title}`;
  }

  prompt += `\nDescription: ${formData.description}`;

  // Length
  if (formData.length && formData.length !== 'ai-choose') {
    if (formData.length === 'custom' && formData.customLength) {
      prompt += `\nLength: ${formData.customLength}`;
    } else {
      prompt += `\nLength: ${formData.length}`;
    }
  }

  // Tone
  if (formData.tones.length > 0 || formData.customTone) {
    prompt += `\nTone: `;
    const tones = [...formData.tones];
    if (formData.customTone) {
      tones.push(formData.customTone);
    }
    prompt += tones.join(', ');
  }

  // Structure
  if (formData.structure && formData.structure !== 'ai-choose') {
    const structure = formData.structure === 'custom' ? formData.customStructure : formData.structure;
    prompt += `\nStructure: ${structure}`;
  }

  // Goal
  if (formData.goal && formData.goal !== 'ai-choose') {
    const goal = formData.goal === 'custom' ? formData.customGoal : formData.goal;
    prompt += `\nGoal: ${goal}`;
  }

  // Target Audience
  if (formData.targetAudience && formData.targetAudience !== 'ai-choose') {
    const audience = formData.targetAudience === 'custom' ? formData.customAudience : formData.targetAudience;
    prompt += `\nTarget Audience: ${audience}`;
  }

  // Language
  const language = formData.language === 'custom' ? formData.customLanguage : formData.language;
  if (language && language !== 'English') {
    prompt += `\nLanguage: ${language}`;
  }

  // Audience Age
  if (formData.audienceAge) {
    prompt += `\nAudience Age: ${formData.audienceAge}`;
  }

  prompt += `\n\nOutput:\nA fluent, engaging monologue or voiceover script for the reel.`;

  return prompt;
};
