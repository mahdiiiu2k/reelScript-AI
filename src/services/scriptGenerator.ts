
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
            content: 'You are an expert Instagram reel script writer. Create engaging, viral-worthy scripts that capture attention quickly and drive engagement. Always provide structured, actionable scripts that are optimized for the specified duration and audience.'
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
  let prompt = `Create an Instagram reel script with the following specifications:

**Description/Topic:** ${formData.description}

**Basic Info:**`;

  if (formData.title) {
    prompt += `\n- Title: ${formData.title}`;
  }

  // Length
  if (formData.length && formData.length !== 'ai-choose') {
    if (formData.length === 'custom' && formData.customLength) {
      prompt += `\n- Duration: ${formData.customLength}`;
    } else {
      prompt += `\n- Duration: ${formData.length}`;
    }
  }

  // Language
  const language = formData.language === 'custom' ? formData.customLanguage : formData.language;
  if (language && language !== 'English') {
    prompt += `\n- Language: ${language}`;
  }

  // Tone
  if (formData.tones.length > 0 || formData.customTone) {
    prompt += `\n- Tone: `;
    const tones = [...formData.tones];
    if (formData.customTone) {
      tones.push(formData.customTone);
    }
    prompt += tones.join(', ');
  }

  // Structure
  if (formData.structure && formData.structure !== 'ai-choose') {
    const structure = formData.structure === 'custom' ? formData.customStructure : formData.structure;
    prompt += `\n- Structure: ${structure}`;
  }

  // Goal
  if (formData.goal && formData.goal !== 'ai-choose') {
    const goal = formData.goal === 'custom' ? formData.customGoal : formData.goal;
    prompt += `\n- Goal: ${goal}`;
  }

  // Target Audience
  if (formData.targetAudience && formData.targetAudience !== 'ai-choose') {
    const audience = formData.targetAudience === 'custom' ? formData.customAudience : formData.targetAudience;
    prompt += `\n- Target Audience: ${audience}`;
  }

  // Audience Age
  if (formData.audienceAge) {
    prompt += `\n- Audience Age: ${formData.audienceAge}`;
  }

  prompt += `\n\n**Instructions:**
1. Create a compelling hook within the first 3 seconds
2. Provide clear, actionable content that matches the goal
3. Include a strong call-to-action
4. Format the script with clear sections and timing cues
5. Make it engaging and shareable
6. Optimize for the target audience and specified tone

Please structure the script with clear sections like "Hook," "Main Content," "Call-to-Action," etc., and include timing suggestions where relevant.`;

  return prompt;
};
