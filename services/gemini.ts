import { GoogleGenAI } from "@google/genai";
import { PROJECT_CONTEXT } from "../constants";

let ai: GoogleGenAI | null = null;

export const initializeGenAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const sendMessageToAssistant = async (
    message: string,
    history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
    try {
        const client = initializeGenAI();
        
        // We use a chat model to maintain conversation context
        const chat = client.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: PROJECT_CONTEXT,
                temperature: 0.7,
            },
            history: history,
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I apologize, I couldn't generate a response regarding the proposal at this time.";
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        return "I'm sorry, I'm having trouble connecting to the proposal database right now. Please check your API key.";
    }
};