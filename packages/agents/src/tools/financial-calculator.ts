import { tool } from 'ai';
import { z } from 'zod';

/**
 * Financial Calculator Tool
 * Performs ROI calculations, NPV analysis, and financial projections
 */
export const financialCalculatorTool = tool({
  description: 'Calculate ROI, NPV, IRR, payback period, and generate financial projections for infrastructure investments',
  inputSchema: z.object({
    calculationType: z.enum(['roi', 'npv', 'irr', 'payback', 'projection']).describe('Type of calculation'),
    parameters: z.object({
      initialInvestment: z.number().optional(),
      annualRevenue: z.number().optional(),
      annualCosts: z.number().optional(),
      discountRate: z.number().optional(),
      projectYears: z.number().optional(),
      cashFlows: z.array(z.number()).optional(),
    }),
  }),
  strict: true,
  execute: async ({ calculationType, parameters }) => {
    const { initialInvestment = 0, annualRevenue = 0, annualCosts = 0, discountRate = 0.1, projectYears = 25 } = parameters;

    let result: any = {};

    switch (calculationType) {
      case 'roi':
        const netProfit = (annualRevenue - annualCosts) * projectYears;
        const roiPercentage = ((netProfit - initialInvestment) / initialInvestment) * 100;
        result = {
          type: 'ROI',
          netProfit,
          roiPercentage: roiPercentage.toFixed(2),
          breakEvenYears: (initialInvestment / (annualRevenue - annualCosts)).toFixed(2),
        };
        break;

      case 'npv':
        let npv = -initialInvestment;
        for (let year = 1; year <= projectYears; year++) {
          const cashFlow = annualRevenue - annualCosts;
          npv += cashFlow / Math.pow(1 + discountRate, year);
        }
        result = {
          type: 'NPV',
          npv: npv.toFixed(2),
          positiveNPV: npv > 0,
          discountRate: discountRate * 100 + '%',
        };
        break;

      case 'projection':
        const projections = [];
        let cumulativeCashFlow = -initialInvestment;
        
        for (let year = 0; year <= projectYears; year++) {
          if (year === 0) {
            projections.push({
              year: 0,
              revenue: 0,
              costs: 0,
              netCashFlow: -initialInvestment,
              cumulativeCashFlow: -initialInvestment,
            });
          } else {
            const yearRevenue = annualRevenue * Math.pow(1.03, year - 1); // 3% growth
            const yearCosts = annualCosts * Math.pow(1.02, year - 1); // 2% inflation
            const netCashFlow = yearRevenue - yearCosts;
            cumulativeCashFlow += netCashFlow;
            
            projections.push({
              year,
              revenue: yearRevenue.toFixed(2),
              costs: yearCosts.toFixed(2),
              netCashFlow: netCashFlow.toFixed(2),
              cumulativeCashFlow: cumulativeCashFlow.toFixed(2),
            });
          }
        }
        
        result = {
          type: 'Financial Projection',
          projections: projections.slice(0, 10), // First 10 years
          summary: {
            totalRevenue: projections.reduce((sum, p) => sum + parseFloat(p.revenue || '0'), 0).toFixed(2),
            totalCosts: projections.reduce((sum, p) => sum + parseFloat(p.costs || '0'), 0).toFixed(2),
            finalCumulativeCashFlow: projections[projections.length - 1].cumulativeCashFlow,
          },
        };
        break;

      default:
        result = { error: 'Unsupported calculation type' };
    }

    return {
      calculationType,
      parameters,
      result,
      timestamp: new Date().toISOString(),
    };
  },
});
