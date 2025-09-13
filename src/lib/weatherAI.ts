import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getWeatherAdvice(weatherData: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an agriculture assistant. Summarize this weather data for a small farmer in India.
  - Keep it short (max 2 sentences).
  - Use simple words.
  - If rain is expected, warn to avoid irrigation.
  - If temperature is high, suggest watering or shade.
  Weather Data: ${JSON.stringify(weatherData)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
