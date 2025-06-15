
interface ScriptFormData {
  title: string;
  description: string;
  length: string;
  language: string;
  tone: string;
  structure: string;
  goal: string;
  targetAudience: string;
  audienceAge: string;
}

export const generateScript = async (formData: ScriptFormData): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { description, title, tone, structure, goal, targetAudience } = formData;

  // Mock script generation based on form data
  const scripts = [
    `**Hook (0-3 seconds)**
"Stop scrolling if you've ever wondered why some people seem to have it all figured out..."

**Value/Content (3-25 seconds)**
Here's the truth: Success isn't about perfection, it's about consistency. I learned this the hard way when I ${description}. 

The 3 game-changing habits that transformed everything:
1. Start before you feel ready
2. Focus on progress, not perfection  
3. Celebrate small wins daily

**Call to Action (25-30 seconds)**
Which habit will you start today? Comment below and let's build this community together! Follow for more real talk about ${goal.toLowerCase()}.

#realtalk #motivation #success #mindset #growth`,

    `**Problem/Hook (0-5 seconds)**
"POV: You're tired of feeling stuck while everyone else moves forward..."

**Solution/Value (5-25 seconds)**
I get it. I was exactly where you are when ${description}. But here's what changed everything:

✨ I stopped waiting for the "perfect moment"
✨ I started treating failures as data, not defeats
✨ I focused on becoming 1% better daily

The result? ${goal} became not just a dream, but my reality.

**Call to Action (25-30 seconds)**
Your turn! What's one small step you can take today? Drop it in the comments and let's support each other! 

#transformation #growthmindset #motivation #success #progress`,

    `**Attention Grabber (0-3 seconds)**
"This mindset shift changed my entire life..."

**Story/Value (3-27 seconds)**
When I started ${description}, I thought I needed to have everything figured out. WRONG.

The breakthrough came when I realized:
→ Clarity comes through action, not thought
→ You don't have to be great to get started
→ But you have to get started to be great

This simple shift helped me ${goal} faster than I ever imagined.

**Engagement/CTA (27-30 seconds)**
What's one thing you've been overthinking? Time to take action! Save this as your reminder and share with someone who needs to see this.

#mindsetshift #action #growth #motivation #breakthrough`
  ];

  // Return a random script
  return scripts[Math.floor(Math.random() * scripts.length)];
};
