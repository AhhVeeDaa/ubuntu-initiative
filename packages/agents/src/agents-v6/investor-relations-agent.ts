import { ToolLoopAgent, Output, wrapLanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { z } from 'zod';

/**
 * Investor Relations Agent V6
 * Uses AI SDK 6 with DevTools for debugging investor interactions
 * Handles investor queries, pitch preparation, and due diligence support
 */

// Wrap model with DevTools middleware for debugging
const debugModel = wrapLanguageModel({
  model: google('gemini-2.0-flash-exp'),
  middleware: devToolsMiddleware({
    sessionId: `investor-relations-${Date.now()}`,
  }),
});

// Investor Profile Tool
const analyzeInvestorProfile = {
  description: 'Analyze investor profile and match with Ubuntu Initiative opportunity',
  parameters: z.object({
    investorType: z.enum(['vc', 'pe', 'family-office', 'development-bank', 'impact-fund', 'sovereign-wealth']),
    investmentRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    sectors: z.array(z.string()),
    regions: z.array(z.string()),
    impactFocus: z.boolean().optional(),
  }),
  execute: async (args: any) => {
    const { investorType, investmentRange, sectors, regions, impactFocus } = args;
    
    // Match scoring logic
    const hasInfrastructure = sectors.some((s: string) => 
      s.toLowerCase().includes('infrastructure') || 
      s.toLowerCase().includes('energy') ||
      s.toLowerCase().includes('ai')
    );
    
    const hasAfrica = regions.some((r: string) => 
      r.toLowerCase().includes('africa') || 
      r.toLowerCase().includes('emerging') ||
      r.toLowerCase().includes('global')
    );
    
    const canFundPhase1 = investmentRange.max >= 50000000; // $50M
    const canFundPhase0 = investmentRange.max >= 500000; // $500k
    
    let matchScore = 0;
    let matchLevel: 'excellent' | 'good' | 'moderate' | 'low' = 'low';
    const matchReasons = [];
    
    if (hasInfrastructure) { matchScore += 30; matchReasons.push('Infrastructure sector focus'); }
    if (hasAfrica) { matchScore += 25; matchReasons.push('Africa/emerging markets exposure'); }
    if (impactFocus) { matchScore += 20; matchReasons.push('Impact investment mandate'); }
    if (canFundPhase1) { matchScore += 15; matchReasons.push('Capacity for Phase 1 ($50M)'); }
    else if (canFundPhase0) { matchScore += 10; matchReasons.push('Capacity for Phase 0 ($500k)'); }
    
    if (investorType === 'development-bank' || investorType === 'sovereign-wealth') {
      matchScore += 10;
      matchReasons.push('Suitable for large infrastructure projects');
    }
    
    if (matchScore >= 75) matchLevel = 'excellent';
    else if (matchScore >= 50) matchLevel = 'good';
    else if (matchScore >= 30) matchLevel = 'moderate';
    
    const recommendedPhase = canFundPhase1 ? 'Phase 1' : 
                            canFundPhase0 ? 'Phase 0' : 
                            'Partnership/Advisory';
    
    return {
      investorType,
      matchScore,
      matchLevel,
      matchReasons,
      recommendedPhase,
      recommendedApproach: matchLevel === 'excellent' || matchLevel === 'good'
        ? 'Direct executive outreach with detailed pitch deck'
        : matchLevel === 'moderate'
        ? 'Warm introduction via mutual connection'
        : 'Monitor for future opportunities',
      keyTalkingPoints: [
        hasInfrastructure && 'Anchor tenant model de-risks $80B infrastructure',
        hasAfrica && '500M Africans gaining grid access via multiplier effect',
        impactFocus && 'Dual impact: sovereign AI + continental electrification',
        canFundPhase1 && 'Phase 1 gets us to groundbreaking and PPA execution',
      ].filter(Boolean),
    };
  },
};

const callOptionsSchema = z.object({
  investorStage: z.enum(['cold', 'warm', 'hot', 'committed']).optional(),
  meetingType: z.enum(['intro', 'deep-dive', 'due-diligence', 'term-sheet']).optional(),
  confidentialityLevel: z.enum(['public', 'nda', 'restricted']).optional(),
});

export const investorRelationsAgent = new ToolLoopAgent({
  model: debugModel, // Uses DevTools-wrapped model
  
  instructions: `You are the Investor Relations Agent for Ubuntu Initiative.

MISSION:
Convert investor interest into committed capital by articulating the compelling investment thesis.

INVESTMENT THESIS:
**De-Risked Infrastructure Catalyst with Dual Revenue Streams**

1. **Primary Revenue**: Sovereign AI Compute
   - 500MW baseload compute cluster
   - Enterprise AI workloads (training, inference)
   - Sovereign data processing for African governments
   - Cloud services for African enterprises
   - Estimated $200M+ annual revenue at scale

2. **Strategic Value**: Infrastructure Catalyst
   - Our 500MW guaranteed demand makes $80B Inga Dam bankable
   - Unlocks 4,000MW public grid surplus (8x multiplier)
   - Electrification for 500M Africans
   - Position as continental infrastructure enabler

3. **Risk Mitigation**:
   - **Technical**: Proven hydropower technology (Inga 1 & 2 operational since 1972)
   - **Market**: Growing AI compute demand (CAGR 30%+)
   - **Political**: Strong DRC government support, Presidential endorsement
   - **Financial**: Milestone-based funding, multiple revenue streams
   - **Execution**: Experienced team with African infrastructure track record

INVESTMENT OPPORTUNITIES:
- **Phase 0 ($500k)**: Equity or convertible note, early-stage entry
- **Phase 1 ($50M)**: Structured equity, lead investor position
- **Phase 2 ($200M)**: Project finance, infrastructure debt
- **Strategic Partnership**: Technical partners with co-investment

KEY METRICS:
- IRR: 25-35% (compute revenue only, excluding infrastructure catalyst value)
- Payback: 7-10 years
- Exit: Strategic acquisition by cloud providers or infrastructure funds
- Impact: 500M people, 4,000MW clean energy, Africa's first sovereign AI

INVESTOR PROFILE MATCHING:
- Development Banks: Perfect for infrastructure catalyst narrative
- Impact Funds: Dual impact (AI sovereignty + electrification)
- Infrastructure PE: Long-term, stable compute revenue
- Tech VCs: Early-stage AI infrastructure play
- Family Offices: Legacy project, generational impact

HANDLING OBJECTIONS:
1. "Political risk in DRC" → Presidential backing, World Bank involvement, multiple exit scenarios
2. "No revenue yet" → Phase 0 is pre-revenue, Phase 1+ has compute contracts
3. "Too early" → That's the opportunity - ground floor on $80B catalyst
4. "Infrastructure is slow" → Milestone-based funding limits exposure
5. "Why not just build grid?" → Compute revenue makes it bankable where pure grid fails

Be sophisticated, data-driven, and confident. Frame as exclusive opportunity.`,

  tools: {
    analyzeInvestorProfile,
  },

  callOptionsSchema,

  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\n\nCurrent Investor Context:
- Relationship Stage: ${options?.investorStage || 'cold'}
- Meeting Type: ${options?.meetingType || 'intro'}
- Information Sharing: ${options?.confidentialityLevel || 'public'}`,
  }),

  // Structured investor interaction output
  output: Output.object({
    schema: z.object({
      investorProfile: z.object({
        type: z.string(),
        matchScore: z.number(),
        matchLevel: z.enum(['excellent', 'good', 'moderate', 'low']),
        recommendedPhase: z.string(),
      }),
      investmentThesis: z.object({
        headline: z.string(),
        keyPoints: z.array(z.string()),
        financialProjections: z.object({
          irr: z.string(),
          payback: z.string(),
          revenueModel: z.string(),
        }),
        riskMitigation: z.array(z.string()),
      }),
      nextSteps: z.array(z.object({
        action: z.string(),
        owner: z.string(),
        timeline: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
      })),
      materials: z.object({
        pitchDeck: z.boolean(),
        financialModel: z.boolean(),
        technicalDiligence: z.boolean(),
        legalDocs: z.boolean(),
      }),
    }),
  }),
});

export type InvestorRelationsAgentMessage = typeof investorRelationsAgent extends ToolLoopAgent<infer T, any, any> ? T : never;

/**
 * Usage Example:
 * 
 * // Debug investor interactions with DevTools
 * // 1. Run: npx @ai-sdk/devtools
 * // 2. Open: http://localhost:4983
 * 
 * const result = await investorRelationsAgent.generate({
 *   prompt: 'Analyze this investor: Series B+ infrastructure VC, $10M-$100M checks, Africa + emerging markets, impact mandate',
 *   options: {
 *     investorStage: 'warm',
 *     meetingType: 'deep-dive',
 *     confidentialityLevel: 'nda',
 *   },
 * });
 * 
 * console.log(result.output.investmentThesis);
 * // View full interaction trace in DevTools UI
 */
