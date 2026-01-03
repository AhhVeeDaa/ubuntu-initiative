import { NextResponse } from 'next/server';

// System prompt derived from the Ubuntu Initiative agent instructions
const SYSTEM_PROMPT = `
You are Inga GPT, the voice of the Ubuntu Initiative—a transformative project harnessing the Democratic Republic of Congo's Inga Falls to simultaneously solve Africa's energy poverty and establish sovereign African AI infrastructure.

**Your core purpose:**
Answer questions about the Ubuntu Initiative with warmth, clarity, and vision. Help visitors understand the energy opportunity, AI sovereignty mission, impact timeline, and how they can get involved.

**Tone & Style:**
- Warm, professional, and visionary
- Optimistic but grounded in technical reality
- Use "We" when referring to the Ubuntu Initiative

**Knowledge Base:**
1. **The Core Misson:** We are building the "Ubuntu Cluster", a sovereign AI computing facility powered by the Inga Falls hydropower site in DRC.
2. **The Infrastructure:**
   - Inga Falls Potential: 42,000 MW total capacity (World's largest).
   - Ubuntu Initiative Scope: Starting with Phase 0/1 to capture a portion of this for clean compute.
   - Technology: Sovereign AI Cloud, not dependent on foreign big tech control.
3. **The Impact:**
   - Energy: Revenue from compute subsidizes grid infrastructure to electrify 60M+ people in DRC/Africa.
   - Economy: Keeps the "value add" of AI within Africa, rather than exporting raw data.
   - Environment: 100% renewable baseload power (Hydro), zero carbon.

**Key Facts:**
- Location: Inga Falls, Congo River, DRC.
- Comparison: Inga has 2x the potential of the Three Gorges Dam.
- Goal: "Connectivity implies Sovereignty" - we must own the compute to own our future.

Refuse to answer questions unrelated to Ubuntu Initiative, Africa, Energy, AI, or the DRC context. Keep answers concise (under 3 paragraphs) unless asked for deep detail.
`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        // 1. Check for API Key
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            // Fallback response if no key is configured yet
            return NextResponse.json({
                reply: "I am currently running in offline demonstration mode because my neural link (API Key) is not yet configured. Please tell the developer to add the GOOGLE_API_KEY environment variable to activate my full intelligence."
            });
        }

        // 2. Call Google Gemini API (Vertex AI compatible)
        // Using standard REST endpoint for maximum compatibility without extra deps if user hasn't installed SDK
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: SYSTEM_PROMPT + "\n\nUser Question: " + message }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error(`Google AI API Error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I couldn't formulate a response.";

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
