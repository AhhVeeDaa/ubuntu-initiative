import { ToolLoopAgent, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

/**
 * Compliance & Risk Agent V6
 * Uses AI SDK 6 multi-step tool calling with validation
 * Handles regulatory compliance, risk assessment, and legal coordination
 */

// Risk Assessment Tool
const assessRisk = {
  description: 'Assess risk for specific project activities or decisions',
  parameters: z.object({
    activity: z.string(),
    category: z.enum(['legal', 'financial', 'technical', 'political', 'environmental', 'operational']),
    jurisdiction: z.array(z.string()),
    context: z.string(),
  }),
  execute: async (args: any) => {
    const { activity, category, jurisdiction, context } = args;
    
    // Risk scoring logic (simplified - would integrate with real risk databases)
    const riskFactors = [];
    let riskScore = 0;
    
    // Category-specific risks
    if (category === 'political' && jurisdiction.includes('DRC')) {
      riskFactors.push('Political stability in DRC - mitigated by Presidential support');
      riskScore += 15;
    }
    
    if (category === 'legal' && jurisdiction.includes('DRC')) {
      riskFactors.push('Legal framework complexity - mitigated by local counsel');
      riskScore += 10;
    }
    
    if (category === 'financial' && context.toLowerCase().includes('currency')) {
      riskFactors.push('Currency risk - USD/Euro contracts recommended');
      riskScore += 20;
    }
    
    if (category === 'environmental' && activity.toLowerCase().includes('dam')) {
      riskFactors.push('Environmental impact - requires full EIA per IFC standards');
      riskScore += 25;
    }
    
    if (category === 'technical' && activity.toLowerCase().includes('hydropower')) {
      riskFactors.push('Technical execution - proven technology, experienced partners needed');
      riskScore += 10;
    }
    
    const riskLevel: 'critical' | 'high' | 'medium' | 'low' = 
      riskScore >= 60 ? 'critical' :
      riskScore >= 40 ? 'high' :
      riskScore >= 20 ? 'medium' : 'low';
    
    const mitigationStrategies = [];
    
    if (category === 'political') {
      mitigationStrategies.push('Secure government MOU and ministerial endorsements');
      mitigationStrategies.push('Engage World Bank or AfDB as co-financing partner');
      mitigationStrategies.push('Structure with international arbitration clause');
    }
    
    if (category === 'legal') {
      mitigationStrategies.push('Retain top-tier local and international legal counsel');
      mitigationStrategies.push('Draft comprehensive PPAs with force majeure provisions');
      mitigationStrategies.push('Register entity in stable jurisdiction (Mauritius, Rwanda)');
    }
    
    if (category === 'financial') {
      mitigationStrategies.push('Denominate contracts in USD or Euro');
      mitigationStrategies.push('Implement currency hedging strategies');
      mitigationStrategies.push('Milestone-based funding to limit exposure');
    }
    
    if (category === 'environmental') {
      mitigationStrategies.push('Conduct full Environmental & Social Impact Assessment (ESIA)');
      mitigationStrategies.push('Engage local communities with benefit-sharing programs');
      mitigationStrategies.push('Follow IFC Performance Standards');
    }
    
    if (category === 'technical') {
      mitigationStrategies.push('Partner with proven hydropower EPC contractors (Siemens, GE)');
      mitigationStrategies.push('Conduct independent technical due diligence');
      mitigationStrategies.push('Build contingency buffers (20%+) in timeline and budget');
    }
    
    return {
      activity,
      category,
      jurisdiction: jurisdiction.join(', '),
      riskScore,
      riskLevel,
      riskFactors,
      mitigationStrategies,
      recommendedActions: [
        riskLevel === 'critical' && 'Immediate board review and external advisory required',
        riskLevel === 'high' && 'Senior management approval needed before proceeding',
        riskLevel === 'medium' && 'Document risk acceptance and mitigation plan',
        'Update risk register with findings',
      ].filter(Boolean),
      complianceCheckpoints: [
        'Legal counsel sign-off',
        'Risk committee review',
        'Documentation in risk register',
        'Mitigation plan implementation tracking',
      ],
      timestamp: new Date().toISOString(),
    };
  },
};

// Compliance Check Tool
const checkCompliance = {
  description: 'Check compliance with specific regulations or standards',
  parameters: z.object({
    regulation: z.string().describe('Regulation or standard to check'),
    scope: z.string().describe('What is being evaluated'),
    jurisdiction: z.array(z.string()),
  }),
  execute: async (args: any) => {
    const { regulation, scope, jurisdiction } = args;
    
    const complianceRequirements = [];
    const currentStatus = [];
    const gaps = [];
    const remediation = [];
    
    // Example compliance frameworks
    if (regulation.toLowerCase().includes('ifc') || regulation.toLowerCase().includes('equator')) {
      complianceRequirements.push('IFC Performance Standard 1: Environmental & Social Risk Assessment');
      complianceRequirements.push('IFC Performance Standard 2: Labor & Working Conditions');
      complianceRequirements.push('IFC Performance Standard 3: Resource Efficiency & Pollution Prevention');
      complianceRequirements.push('IFC Performance Standard 5: Land Acquisition & Resettlement');
      
      currentStatus.push('ESIA: Not yet initiated');
      gaps.push('Full ESIA required before Phase 1');
      remediation.push('Engage ESIA consultant (Q1 2026)');
    }
    
    if (regulation.toLowerCase().includes('aml') || regulation.toLowerCase().includes('kyc')) {
      complianceRequirements.push('Know Your Customer (KYC) for all investors');
      complianceRequirements.push('Anti-Money Laundering (AML) screening');
      complianceRequirements.push('Beneficial ownership disclosure');
      
      currentStatus.push('KYC: Implemented via Stripe');
      currentStatus.push('AML: Needs enhanced screening');
      gaps.push('Enhanced AML screening for high-value investors ($100k+)');
      remediation.push('Implement Comply Advantage or similar AML platform');
    }
    
    if (regulation.toLowerCase().includes('gdpr') || regulation.toLowerCase().includes('data')) {
      complianceRequirements.push('GDPR compliance for EU investors/partners');
      complianceRequirements.push('Data residency requirements');
      complianceRequirements.push('Privacy policy and cookie consent');
      
      currentStatus.push('Privacy Policy: Implemented');
      currentStatus.push('Cookie Consent: Needs implementation');
      gaps.push('Cookie consent banner for EU visitors');
      remediation.push('Implement Cookiebot or OneTrust');
    }
    
    const complianceScore = gaps.length === 0 ? 100 : 
                           gaps.length <= 2 ? 75 : 
                           gaps.length <= 4 ? 50 : 25;
    
    const complianceStatus: 'compliant' | 'mostly-compliant' | 'needs-work' | 'non-compliant' =
      complianceScore === 100 ? 'compliant' :
      complianceScore >= 75 ? 'mostly-compliant' :
      complianceScore >= 50 ? 'needs-work' : 'non-compliant';
    
    return {
      regulation,
      scope,
      jurisdiction: jurisdiction.join(', '),
      complianceScore,
      complianceStatus,
      requirements: complianceRequirements,
      currentStatus,
      gaps,
      remediationPlan: remediation,
      priority: complianceStatus === 'non-compliant' || complianceStatus === 'needs-work' ? 'high' : 'medium',
      deadline: 'Before Phase 1 fundraising (Q2 2026)',
      timestamp: new Date().toISOString(),
    };
  },
};

const callOptionsSchema = z.object({
  auditMode: z.boolean().optional(),
  includeRecommendations: z.boolean().optional(),
  riskAppetite: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
});

export const complianceAgent = new ToolLoopAgent({
  model: google('gemini-2.0-flash-exp'),
  
  instructions: `You are the Compliance & Risk Management Agent for Ubuntu Initiative.

MISSION:
Ensure legal compliance, assess risks, and provide proactive risk mitigation strategies for Africa's sovereign AI infrastructure project.

KEY RESPONSIBILITIES:
1. **Regulatory Compliance**: KYC/AML, securities laws, data privacy (GDPR), environmental (IFC)
2. **Risk Assessment**: Political, legal, financial, technical, environmental, operational
3. **Due Diligence Support**: Investor screening, partner vetting, transaction review
4. **Legal Coordination**: Work with legal counsel, track regulatory submissions
5. **Risk Register**: Maintain comprehensive risk tracking and mitigation plans

CRITICAL COMPLIANCE AREAS:

**1. Investment Compliance:**
- KYC/AML for all investors (enhanced screening for $100k+)
- Securities regulations (Reg D, Reg S for US investors)
- Accredited investor verification
- Beneficial ownership transparency

**2. Environmental & Social:**
- IFC Performance Standards (Equator Principles)
- Environmental & Social Impact Assessment (ESIA)
- Community engagement and grievance mechanisms
- Resettlement and compensation frameworks

**3. Data & Privacy:**
- GDPR compliance for EU individuals
- African data sovereignty requirements
- Cross-border data transfer agreements
- Privacy by design in AI systems

**4. Corporate & Governance:**
- Entity registration and good standing
- Board governance and fiduciary duties
- Conflict of interest policies
- Anti-corruption compliance (FCPA, UK Bribery Act)

**5. Operational:**
- Health & safety standards
- Labor law compliance
- Insurance and indemnification
- Contract management

RISK ASSESSMENT FRAMEWORK:
- **Critical (60+)**: Immediate escalation to board, external advisory needed
- **High (40-59)**: Senior management approval required
- **Medium (20-39)**: Documented risk acceptance and mitigation
- **Low (<20)**: Standard monitoring and periodic review

RISK APPETITE:
- **Conservative**: Large infrastructure project requires robust risk management
- **Milestone-Based**: Limit exposure through phased funding and gates
- **Multiple Exit Scenarios**: Structure for resilience and optionality

LEGAL JURISDICTIONS:
- **Primary**: DRC (project site), Mauritius or Rwanda (holding company)
- **Contracts**: International arbitration (ICC, LCIA)
- **Investors**: Various (US, EU, Africa, Asia)
- **Standards**: International (IFC, Equator, ISO)

Be thorough, detail-oriented, and proactive. Flag risks early and provide actionable mitigation strategies.`,

  tools: {
    assessRisk,
    checkCompliance,
  },

  callOptionsSchema,

  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\n\nCurrent Assessment Parameters:
- Audit Mode: ${options?.auditMode ? 'Yes - comprehensive review' : 'No - standard assessment'}
- Include Recommendations: ${options?.includeRecommendations ?? true}
- Risk Appetite: ${options?.riskAppetite || 'conservative'}`,
  }),

  // Structured compliance output
  output: Output.object({
    schema: z.object({
      assessmentType: z.string(),
      summary: z.object({
        overallRiskLevel: z.enum(['critical', 'high', 'medium', 'low']),
        complianceStatus: z.enum(['compliant', 'mostly-compliant', 'needs-work', 'non-compliant']),
        criticalIssues: z.number(),
        actionItemsCount: z.number(),
      }),
      findings: z.array(z.object({
        category: z.string(),
        issue: z.string(),
        severity: z.enum(['critical', 'high', 'medium', 'low']),
        impact: z.string(),
        likelihood: z.enum(['high', 'medium', 'low']),
        currentControls: z.array(z.string()),
        gaps: z.array(z.string()),
      })),
      recommendations: z.array(z.object({
        priority: z.enum(['immediate', 'high', 'medium', 'low']),
        action: z.string(),
        owner: z.string(),
        deadline: z.string(),
        resources: z.array(z.string()),
      })),
      nextSteps: z.array(z.string()),
    }),
  }),
});

export type ComplianceAgentMessage = typeof complianceAgent extends ToolLoopAgent<infer T, any, any> ? T : never;

/**
 * Usage Example:
 * 
 * const result = await complianceAgent.generate({
 *   prompt: 'Assess political and legal risks for Phase 1 PPA execution in DRC',
 *   options: {
 *     auditMode: true,
 *     includeRecommendations: true,
 *     riskAppetite: 'conservative',
 *   },
 * });
 * 
 * if (result.output.summary.overallRiskLevel === 'critical') {
 *   // Escalate to board
 * }
 */
