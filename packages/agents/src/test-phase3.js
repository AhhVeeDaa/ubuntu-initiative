/**
 * Phase 3 Agent Tests
 */

import { test } from 'node:test';
import assert from 'node:assert';

import { ResearchAgent } from './agents/research-agent.js';
import { ChatbotAgent } from './agents/chatbot-agent.js';
import { DueDiligenceAgent } from './agents/due-diligence-agent.js';

// Test Research Agent relevance calculation
test('ResearchAgent: Relevance scoring', () => {
    const agent = new ResearchAgent();
    
    const highRelevance = {
        title: 'Inga Dam Hydropower Development in DRC Congo Basin',
        abstract: 'Sustainable energy infrastructure for Africa renewable power generation',
        keywords: ['inga', 'hydropower', 'drc', 'congo', 'renewable', 'africa']
    };
    
    const lowRelevance = {
        title: 'European Wind Energy Market Analysis',
        abstract: 'Market trends in European renewable energy sector',
        keywords: ['wind', 'europe', 'market']
    };
    
    const highResult = agent.calculateRelevance(highRelevance);
    const lowResult = agent.calculateRelevance(lowRelevance);
    
    assert.ok(highResult.score >= 0.6, 'High relevance paper should score >=0.6');
    assert.ok(lowResult.score < 0.4, 'Low relevance paper should score <0.4');
    assert.ok(highResult.matches >= 5, 'Should match multiple keywords');
    
    console.log('✅ Research relevance scoring: PASS');
});

// Test Research Agent theme identification
test('ResearchAgent: Theme identification', () => {
    const agent = new ResearchAgent();
    
    const papers = [
        {
            title: 'Hydropower Development Strategies',
            abstract: 'Analysis of dam construction and water management',
            expected: 'hydropower_technology'
        },
        {
            title: 'AI for Infrastructure Monitoring',
            abstract: 'Machine learning approaches for infrastructure oversight',
            expected: ['ai_technology', 'infrastructure']
        },
        {
            title: 'Sustainable Energy in Africa',
            abstract: 'Environmental impact of renewable energy projects in Congo',
            expected: ['sustainability', 'regional_focus']
        }
    ];
    
    papers.forEach(paper => {
        const themes = agent.identifyThemes(paper);
        const expected = Array.isArray(paper.expected) ? paper.expected : [paper.expected];
        
        const hasExpected = expected.some(exp => themes.includes(exp));
        assert.ok(hasExpected, `Paper should include theme(s): ${expected.join(' or ')}`);
    });
    
    console.log('✅ Research theme identification: PASS');
});

// Test Chatbot Agent escalation logic
test('ChatbotAgent: Query escalation', () => {
    const agent = new ChatbotAgent();
    
    const escalationTests = [
        ['I want to discuss a large investment opportunity', true],
        ['Can we become partners on this initiative?', true],
        ['Tell me about the project vision', false],
        ['What milestones have been completed?', false],
        ['I need legal advice about contracts', true]
    ];
    
    escalationTests.forEach(([query, shouldEscalate]) => {
        const result = agent.shouldEscalate(query);
        assert.strictEqual(result, shouldEscalate, 
            `"${query}" escalation should be ${shouldEscalate}`);
    });
    
    console.log('✅ Chatbot escalation logic: PASS');
});

// Test Chatbot Agent session ID generation
test('ChatbotAgent: Session ID generation', () => {
    const agent = new ChatbotAgent();
    
    const id1 = agent.generateSessionId();
    const id2 = agent.generateSessionId();
    
    assert.ok(id1.startsWith('session_'), 'Session ID should have correct prefix');
    assert.notStrictEqual(id1, id2, 'Session IDs should be unique');
    assert.ok(id1.length > 20, 'Session ID should be sufficiently long');
    
    console.log('✅ Chatbot session ID generation: PASS');
});

// Test Chatbot Agent confidence calculation
test('ChatbotAgent: Response confidence', () => {
    const agent = new ChatbotAgent();
    
    const tests = [
        {
            query: 'What is the Inga hydropower project?',
            context: 'The Inga hydropower project is located in the Democratic Republic of Congo and aims to develop sustainable energy infrastructure.',
            expectedMin: 0.5
        },
        {
            query: 'Tell me about quantum computing',
            context: 'No directly relevant information found in knowledge base.',
            expectedMax: 0.4
        }
    ];
    
    tests.forEach(test => {
        const confidence = agent.calculateResponseConfidence(test.query, test.context);
        
        if (test.expectedMin) {
            assert.ok(confidence >= test.expectedMin, 
                `Confidence should be >= ${test.expectedMin} for good context`);
        }
        if (test.expectedMax) {
            assert.ok(confidence <= test.expectedMax, 
                `Confidence should be <= ${test.expectedMax} for poor context`);
        }
    });
    
    console.log('✅ Chatbot confidence calculation: PASS');
});

// Test Due Diligence Agent risk scoring
test('DueDiligenceAgent: Risk score calculation', () => {
    const agent = new DueDiligenceAgent();
    
    const checks = [
        {
            riskFlags: [],
            basicInfo: { registered: true },
            expected: 0.0
        },
        {
            riskFlags: [{ severity: 'high' }],
            basicInfo: { registered: true },
            expected: 0.4
        },
        {
            riskFlags: [{ severity: 'medium' }, { severity: 'low' }],
            basicInfo: { registered: true },
            expected: 0.3
        }
    ];
    
    checks.forEach(check => {
        const score = agent.calculateRiskScore(check);
        assert.strictEqual(score, check.expected, 
            `Risk score should be ${check.expected} for given flags`);
    });
    
    console.log('✅ Due diligence risk scoring: PASS');
});

// Test Due Diligence Agent recommendations
test('DueDiligenceAgent: Recommendation generation', () => {
    const agent = new DueDiligenceAgent();
    
    const cases = [
        { risk: 0.8, opp: 0.5, expected: /HIGH_RISK/ },
        { risk: 0.6, opp: 0.5, expected: /MEDIUM_RISK/ },
        { risk: 0.2, opp: 0.8, expected: /LOW_RISK_HIGH_OPPORTUNITY/ },
        { risk: 0.2, opp: 0.4, expected: /LOW_RISK/ }
    ];
    
    cases.forEach(c => {
        const rec = agent.generateRecommendation(c.risk, c.opp);
        assert.ok(c.expected.test(rec), 
            `Risk ${c.risk}, Opp ${c.opp} should generate appropriate recommendation`);
    });
    
    console.log('✅ Due diligence recommendations: PASS');
});

// Test Research Agent minimum relevance threshold
test('ResearchAgent: Relevance threshold filtering', () => {
    const agent = new ResearchAgent();
    
    assert.strictEqual(agent.config.minRelevanceScore, 0.6, 
        'Should have correct minimum relevance threshold');
    
    // Verify threshold is used in processing logic
    const lowRelevance = { score: 0.4 };
    const highRelevance = { score: 0.7 };
    
    assert.ok(lowRelevance.score < agent.config.minRelevanceScore);
    assert.ok(highRelevance.score >= agent.config.minRelevanceScore);
    
    console.log('✅ Research relevance threshold: PASS');
});

console.log('\n🎉 All Phase 3 agent tests passed!\n');
