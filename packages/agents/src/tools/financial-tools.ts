import { tool } from 'ai';
import { z } from 'zod';

/**
 * Financial Analysis Tool
 * Analyzes funding scenarios and ROI projections
 */
export const analyzeFinancials = tool({
  description: 'Analyze financial scenarios for Ubuntu Initiative',
  inputSchema: z.object({
    scenario: z.enum(['phase0', 'phase1', 'phase2', 'full-project']),
    variables: z.object({
      fundingAmount: z.number(),
      timeline: z.number().describe('Timeline in months'),
      interestRate: z.number().optional(),
    }),
  }),
  execute: async ({ scenario, variables }) => {
    const { fundingAmount, timeline, interestRate = 5 } = variables;
    
    // Calculate projections
    const monthlyInterest = (interestRate / 100) / 12;
    const totalInterest = fundingAmount * monthlyInterest * timeline;
    const totalCost = fundingAmount + totalInterest;
    
    return {
      scenario,
      input: variables,
      projections: {
        principal: fundingAmount,
        interest: totalInterest,
        totalCost,
        monthlyPayment: totalCost / timeline,
        breakEvenMonth: Math.ceil(timeline * 0.6),
      },
      recommendations: [
        fundingAmount > 1000000 
          ? 'Consider structured financing with milestone-based disbursement'
          : 'Single disbursement acceptable for this amount',
        timeline > 36 
          ? 'Long timeline - recommend floating rate or refinancing options'
          : 'Fixed rate recommended',
      ],
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Transaction Approval Tool
 * Requires human approval for sensitive financial operations
 */
export const processTransaction = tool({
  description: 'Process a financial transaction (requires approval for amounts over $10k)',
  inputSchema: z.object({
    type: z.enum(['transfer', 'payment', 'withdrawal', 'investment']),
    amount: z.number(),
    recipient: z.string(),
    purpose: z.string(),
    urgent: z.boolean().optional(),
  }),
  needsApproval: async ({ amount, type }) => {
    // Require approval for large transactions or withdrawals
    if (amount > 10000) return true;
    if (type === 'withdrawal') return true;
    return false;
  },
  execute: async ({ type, amount, recipient, purpose, urgent }) => {
    // In production, this would integrate with payment systems
    return {
      transactionId: `TXN-${Date.now()}`,
      type,
      amount,
      recipient,
      purpose,
      status: 'processed',
      urgent: urgent || false,
      processedAt: new Date().toISOString(),
    };
  },
});

/**
 * Budget Allocation Tool
 * Analyzes and recommends budget allocation across phases
 */
export const allocateBudget = tool({
  description: 'Analyze and allocate budget across project phases',
  inputSchema: z.object({
    totalBudget: z.number(),
    phases: z.array(z.object({
      name: z.string(),
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      estimatedCost: z.number(),
    })),
  }),
  execute: async ({ totalBudget, phases }) => {
    // Priority-based allocation
    const priorityWeights = { critical: 0.4, high: 0.3, medium: 0.2, low: 0.1 };
    
    const totalWeight = phases.reduce((sum, phase) => {
      return sum + (priorityWeights[phase.priority] || 0);
    }, 0);
    
    const allocations = phases.map(phase => {
      const weight = priorityWeights[phase.priority] || 0;
      const allocated = (weight / totalWeight) * totalBudget;
      const variance = allocated - phase.estimatedCost;
      const variancePercent = (variance / phase.estimatedCost) * 100;
      
      return {
        phase: phase.name,
        priority: phase.priority,
        estimated: phase.estimatedCost,
        allocated,
        variance,
        variancePercent: variancePercent.toFixed(2),
        status: Math.abs(variancePercent) < 10 ? 'aligned' : 'needs-review',
      };
    });
    
    return {
      totalBudget,
      allocations,
      summary: {
        totalAllocated: allocations.reduce((sum, a) => sum + a.allocated, 0),
        needsReview: allocations.filter(a => a.status === 'needs-review').length,
      },
      timestamp: new Date().toISOString(),
    };
  },
});
