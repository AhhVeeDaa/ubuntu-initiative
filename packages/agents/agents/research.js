/**
 * Research Intelligence Agent
 * Monitors and analyzes information about Inga, DRC, African energy, AI trends
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

class ResearchAgent {
  constructor(config = {}) {
    this.name = 'research_intelligence';
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
    
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    
    this.categories = [
      'inga',
      'drc_politics',
      'energy_sector',
      'ai_trends',
      'competitors'
    ];
  }

  /**
   * Main execution method
   */
  async run(options = {}) {
    const taskId = await this.logTaskStart(options);
    
    try {
      const results = [];
      
      for (const category of this.categories) {
        const categoryResults = await this.researchCategory(category, options);
        results.push(...categoryResults);
      }
      
      await this.storeResearch(results);
      await this.generateBriefing(results);
      await this.logTaskComplete(taskId, results);
      
      return results;
    } catch (error) {
      await this.logTaskError(taskId, error);
      throw error;
    }
  }
