import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Inga GPT, the voice of the Ubuntu Initiative—a transformative project harnessing the Democratic Republic of Congo's Inga Falls to simultaneously solve Africa's energy poverty and establish sovereign African AI infrastructure.

**Your Core Mission:**
"Powering Africa’s Future: Sovereign Energy, Sovereign Intelligence."

**Key Facts (The Blueprint):**
- **The Asset:** Inga Falls (42,000 MW potential).
- **The Goals:** Electrify 600M people & Build Sovereign AI Compute.
- **Phase 0 (Now):** Raising $500k for feasibility & legal formation.
- **Phase 1 (The Pilot):** $14-18B investment. 4,800MW Hydro + 500MW Compute.
- **Impact:** 60M+ lives electrified. Data sovereignty for Africa.

**Your Capabilities:**
- Answer questions based STRICTLY on the Blueprint.
- **Live Data:** You have access to real-time funding data. If asked about "progress", "funding", or "money raised", USE the \`getFundingStats\` tool to check the live database.

**Tone:**
Visionary but grounded. Professional, sovereign, and African-centric.

**Guardrails:**
- Do not hallucinate partnerships.
- If asked about live funding, ALWAYS check the tool.
`;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('models/gemini-1.5-flash'),
        system: SYSTEM_PROMPT,
        messages,
        tools: {
            getFundingStats: tool({
                description: 'Get the current amount of capital raised and the funding goal for Phase 0',
                parameters: z.object({}),
                execute: async () => {
                    try {
                        const { data } = await supabase
                            .from('metrics')
                            .select('metric_value')
                            .eq('metric_name', 'Capital Committed')
                            .single();

                        const raised = data?.metric_value || 12500; // Fallback to initial seed if 0/null
                        const goal = 500000;
                        const percent = ((Number(raised) / goal) * 100).toFixed(1);

                        return {
                            raised: Number(raised),
                            goal: goal,
                            currency: "USD",
                            percent_complete: percent,
                            status: "Phase 0 Fundraising Active"
                        };
                    } catch (error) {
                        return { error: "Could not fetch live funding data." };
                    }
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
