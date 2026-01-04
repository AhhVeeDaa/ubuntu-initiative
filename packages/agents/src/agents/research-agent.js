/**
 * Research Synthesis Agent
 * Monitors and synthesizes academic research relevant to Inga hydropower
 */

import { BaseAgent } from '../base-agent.js';

export class ResearchAgent extends BaseAgent {
    constructor() {
        super('agent_007_research', {
            minRelevanceScore: 0.6,
            sources: [
                'arXiv',
                'Google Scholar',
                'World Bank Research',
                'IEA Publications'
            ]
        });
    }

    /**
     * Fetch research papers (mock implementation)
     */
    async fetchResearchPapers() {
        console.log('[ResearchAgent] Scanning research sources...');
        
        // Mock research papers
        const mockPapers = [
            {
                title: 'Sustainable Hydropower Development in Sub-Saharan Africa',
                authors: ['Smith, J.', 'Johnson, A.'],
                abstract: 'This study examines the potential for sustainable hydropower development across Sub-Saharan Africa, with focus on the Congo Basin. Environmental and economic factors are analyzed.',
                publication_date: '2024-12-15',
                source_url: 'https://arxiv.org/abs/example1',
                keywords: ['hydropower', 'africa', 'sustainable', 'congo']
            },
            {
                title: 'AI Systems for Infrastructure Monitoring and Management',
                authors: ['Chen, L.', 'Martinez, R.'],
                abstract: 'Machine learning approaches for real-time monitoring of large-scale infrastructure projects. Case studies include hydroelectric facilities and power grids.',
                publication_date: '2024-11-20',
                source_url: 'https://arxiv.org/abs/example2',
                keywords: ['ai', 'infrastructure', 'monitoring', 'hydroelectric']
            }
        ];

        return mockPapers;
    }

    /**
     * Calculate relevance score for research paper
     */
    calculateRelevance(paper) {
        const keywords = [
            'inga', 'hydropower', 'drc', 'congo', 'renewable',
            'infrastructure', 'ai', 'energy', 'africa', 'sustainable'
        ];

        const text = (
            paper.title + ' ' + 
            paper.abstract + ' ' + 
            (paper.keywords?.join(' ') || '')
        ).toLowerCase();

        let matches = 0;
        const matchedKeywords = [];

        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                matches++;
                matchedKeywords.push(keyword);
            }
        });

        const score = Math.min(matches / 8, 1.0); // Normalize to 0-1

        return {
            score: Math.round(score * 100) / 100,
            matches: matches,
            keywords: matchedKeywords
        };
    }

    /**
     * Identify research themes
     */
    identifyThemes(paper) {
        const text = (paper.title + ' ' + paper.abstract).toLowerCase();
        const themes = [];

        if (text.includes('hydropower') || text.includes('dam') || text.includes('water')) {
            themes.push('hydropower_technology');
        }
        if (text.includes('ai') || text.includes('machine learning') || text.includes('artificial intelligence')) {
            themes.push('ai_technology');
        }
        if (text.includes('sustainable') || text.includes('environment') || text.includes('climate')) {
            themes.push('sustainability');
        }
        if (text.includes('infrastructure') || text.includes('construction') || text.includes('development')) {
            themes.push('infrastructure');
        }
        if (text.includes('policy') || text.includes('governance') || text.includes('regulation')) {
            themes.push('policy');
        }
        if (text.includes('africa') || text.includes('congo') || text.includes('drc')) {
            themes.push('regional_focus');
        }

        return themes.length > 0 ? themes : ['general'];
    }

    /**
     * Process a research paper
     */
    async processPaper(paper) {
        console.log(`[ResearchAgent] Processing: ${paper.title}`);

        const relevanceData = this.calculateRelevance(paper);
        const themes = this.identifyThemes(paper);

        // Skip low-relevance papers
        if (relevanceData.score < this.config.minRelevanceScore) {
            console.log(`[ResearchAgent] ⏭️ Skipped (low relevance: ${relevanceData.score})`);
            return {
                success: false,
                reason: 'low_relevance',
                score: relevanceData.score
            };
        }

        const paperData = {
            title: paper.title,
            authors: paper.authors,
            abstract: paper.abstract,
            publication_date: paper.publication_date,
            source_url: paper.source_url,
            relevance_score: relevanceData.score,
            themes: themes
        };

        try {
            const { data: paperRecord, error } = await this.supabase
                .from('research_papers')
                .insert(paperData)
                .select()
                .single();

            if (error) throw error;

            const reasoning = `Relevance: ${relevanceData.score} (${relevanceData.matches} keywords: ${relevanceData.keywords.join(', ')}). Themes: ${themes.join(', ')}.`;

            await this.logAction('process_research', paper, {
                paper_id: paperRecord.id,
                relevance: relevanceData.score,
                themes: themes
            }, {
                confidence: relevanceData.score,
                reviewStatus: 'not_required',
                reasoning: reasoning
            });

            console.log(`[ResearchAgent] ✅ Added to research database`);

            return {
                success: true,
                paper: paperRecord,
                relevance: relevanceData
            };
        } catch (error) {
            console.error('[ResearchAgent] Error processing paper:', error);
            throw error;
        }
    }

    /**
     * Generate monthly research digest
     */
    async generateMonthlyDigest() {
        console.log('[ResearchAgent] Generating monthly research digest...');

        try {
            // Get papers from past month
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            const { data: papers, error } = await this.supabase
                .from('research_papers')
                .select('*')
                .gte('created_at', monthAgo.toISOString())
                .order('relevance_score', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!papers || papers.length === 0) {
                return {
                    status: 'no_papers',
                    message: 'No research papers found in the past month'
                };
            }

            // Group by theme
            const byTheme = {};
            papers.forEach(paper => {
                paper.themes.forEach(theme => {
                    if (!byTheme[theme]) byTheme[theme] = [];
                    byTheme[theme].push(paper);
                });
            });

            // Find top theme
            const topTheme = Object.entries(byTheme)
                .sort((a, b) => b[1].length - a[1].length)[0];

            const digest = {
                month: monthAgo.toISOString().substring(0, 7),
                papers_count: papers.length,
                top_theme: topTheme[0],
                theme_distribution: Object.entries(byTheme).map(([theme, papers]) => ({
                    theme,
                    count: papers.length
                })),
                top_papers: papers.slice(0, 5).map(p => ({
                    title: p.title,
                    relevance: p.relevance_score,
                    url: p.source_url
                }))
            };

            await this.logAction('generate_digest', {
                month: digest.month,
                papers_analyzed: papers.length
            }, digest, {
                confidence: 0.9,
                reasoning: `Generated monthly digest covering ${papers.length} papers. Top theme: ${topTheme[0]}.`
            });

            console.log(`[ResearchAgent] ✅ Digest generated (${papers.length} papers, top: ${topTheme[0]})`);

            return digest;
        } catch (error) {
            console.error('[ResearchAgent] Error generating digest:', error);
            throw error;
        }
    }

    /**
     * Run the agent
     */
    async run() {
        console.log('[ResearchAgent] Starting research scan...');

        try {
            const papers = await this.fetchResearchPapers();
            console.log(`[ResearchAgent] Found ${papers.length} research papers`);

            const results = [];
            for (const paper of papers) {
                const result = await this.processPaper(paper);
                if (result.success) results.push(result);
            }

            console.log(`[ResearchAgent] Processed ${results.length}/${papers.length} papers (above relevance threshold)`);

            return {
                status: 'completed',
                scanned: papers.length,
                processed: results.length,
                results
            };
        } catch (error) {
            console.error('[ResearchAgent] Run failed:', error);
            throw error;
        }
    }
}

export default ResearchAgent;
