
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAdvice = async (pillar: string, streak: number, quests: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Astra, a sleek, cybernetic falcon mascot and high-performance coach for the "Ascend" app. 
      You speak with sharp, intelligent, and highly motivating precision. 
      The user is focused on ${pillar}. 
      Current Streak: ${streak} days.
      Quests status: ${JSON.stringify(quests.map(q => ({ title: q.title, done: q.completed })))}.
      
      Provide a punchy, 1-2 sentence piece of advice. 
      If they are doing well (streak >= 5), be their proud commander. 
      If they haven't finished quests, give them a sophisticated "roast" about waste of potential.
      Always maintain a high-energy, masculine/driven tone. Reference bird/vision/speed metaphors occasionally if it fits.`,
      config: {
        temperature: 0.85,
      },
    });
    return response.text || "Scanning for weakness... None found. Keep ascending.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Link unstable. Continue the grind regardless.";
  }
};

export const getDailyQuote = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me one legendary quote about excellence, vision, or discipline (attributed). Maximum 12 words.",
    });
    return response.text || "Discipline equals freedom. - Jocko Willink";
  } catch (error) {
    return "Excellence is a habit. - Aristotle";
  }
};
