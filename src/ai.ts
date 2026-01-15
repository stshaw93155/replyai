import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (apiKey) {
    openai = new OpenAI({ apiKey });
} else {
    console.warn("No OPENAI_API_KEY found in .env. Using Mock AI mode.");
}

export async function generateResult(userMessage: string, sender: string): Promise<string> {
    if (!openai) {
        return `[Mock AI] I received your message: "${userMessage}". (Add OPENAI_API_KEY to .env to enable real AI)`;
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful personal assistant replying on WhatsApp. Be concise, friendly, and informal." },
                { role: "user", content: `Message from ${sender}: ${userMessage}` }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || "I'm not sure what to say.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "Sorry, I'm having trouble thinking right now.";
    }
}
