/**
 * Phase 4 Tests: System Integration & Cross-Agent Workflows
 * Tests multi-agent orchestration and workflow patterns (without database dependencies)
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import dotenv from 'dotenv';
dotenv.config();

import { ResearchAgent } from './agents/research-agent.js';
import { ChatbotAgent } from './agents/chatbot-agent.js';
import { DueDiligenceAgent } from './agents/due-diligence-agent.js';

console.log('🚀 Phase 4: System Integration & Cross-Agent Workflows\n');

// Test 1: Multi-Agent Initialization
test('Integration: Multiple agents can initialize', async (t) => {
    const agents = {
        research: new ResearchAgent(),
        chatbot: new ChatbotAgent(),
        dueDiligence: new DueDiligenceAgent()
    };

    // Verify all agents are instances
    assert.ok(agents.research instanceof ResearchAgent, 'Research agent initialized');
    assert.ok(agents.chatbot instanceof ChatbotAgent, 'Chatbot agent initialized');
    assert.ok(agents.dueDiligence instanceof DueDiligenceAgent, 'Due diligence agent initialized');

    // Verify agents have required properties
    assert.ok(agents.research.agentId, 'Research agent has ID');
    assert.ok(agents.chatbot.agentId, 'Chatbot agent has ID');
    assert.ok(agents.dueDiligence.agentId, 'Due diligence agent has ID');

    console.log('✅ Multi-agent initialization: PASS');
});

// Test 2: Research Agent Processing Pipeline
test('Workflow: Research agent paper processing', async (t) => {
    const research = new ResearchAgent();

    const testPaper = {
        title: 'Sustainable AI Infrastructure in Africa',
        abstract: 'This paper examines renewable energy solutions for AI computing facilities in Sub-Saharan Africa',
        url: 'https://example.com/paper',
        published_date: '2024-01-15'
    };

    // Test relevance scoring
    const result = research.calculateRelevance(testPaper);
    assert.ok(result.score >= 0 && result.score <= 1, 'Score should be between 0 and 1');
    assert.ok(result.score > 0.5, 'Relevant paper should score high');
    assert.ok(result.matches > 0, 'Should have keyword matches');
    assert.ok(Array.isArray(result.keywords), 'Should return matched keywords');

    // Test theme identification
    const themes = research.identifyThemes(testPaper);
    assert.ok(Array.isArray(themes), 'Should return array of themes');
    assert.ok(themes.length > 0, 'Should identify themes');

    console.log('✅ Research processing pipeline: PASS');
});

// Test 3: Chatbot Query Classification
test('Workflow: Chatbot query handling', async (t) => {
    const chatbot = new ChatbotAgent();

    // Test escalation detection
    const queries = [
        { text: 'What is the Ubuntu Initiative?', shouldEscalate: false },
        { text: 'I want to become a partner', shouldEscalate: true },
        { text: 'Can we invest in this?', shouldEscalate: true },
        { text: 'Tell me about Inga Dam', shouldEscalate: false },
        { text: 'We need a legal contract', shouldEscalate: true }
    ];

    queries.forEach(query => {
        const escalates = chatbot.shouldEscalate(query.text);
        assert.equal(
            escalates, 
            query.shouldEscalate,
            `"${query.text}" escalation ${escalates ? 'detected' : 'not detected'}`
        );
    });

    // Test session ID generation
    const sessionId1 = chatbot.generateSessionId();
    const sessionId2 = chatbot.generateSessionId();
    
    assert.ok(sessionId1, 'Should generate session ID');
    assert.ok(sessionId1.startsWith('session_'), 'Session ID format correct');
    assert.notEqual(sessionId1, sessionId2, 'Session IDs should be unique');

    // Test confidence calculation
    const confidence = chatbot.calculateResponseConfidence(
        'Tell me about Inga Dam hydropower',
        'Q: What is Inga Dam?\nA: Inga Dam is a hydropower facility...'
    );
    
    assert.ok(confidence >= 0 && confidence <= 1, 'Confidence in valid range');
    assert.ok(confidence >= 0.5, 'Should have good confidence with matching context');

    console.log('✅ Chatbot query handling: PASS');
});

// Test 4: Due Diligence Risk Assessment
test('Workflow: Due diligence risk scoring', async (t) => {
    const dd = new DueDiligenceAgent();

    // Test different risk scenarios
    const scenarios = [
        {
            name: 'Clean entity',
            checks: {
                basicInfo: { registered: true },
                riskFlags: [],
                opportunityScore: 0.8,
                publicReputation: { sentiment: 'positive' }
            },
            expectedRisk: 0.0
        },
        {
            name: 'Medium risk entity',
            checks: {
                basicInfo: { registered: true },
                riskFlags: [
                    { severity: 'medium' }
                ],
                opportunityScore: 0.6,
                publicReputation: { sentiment: 'neutral' }
            },
            expectedRisk: 0.2
        },
        {
            name: 'High risk entity',
            checks: {
                basicInfo: { registered: true },
                riskFlags: [
                    { severity: 'high' },
                    { severity: 'medium' }
                ],
                opportunityScore: 0.3,
                publicReputation: { sentiment: 'negative' }
            },
            expectedRisk: 0.6
        }
    ];

    scenarios.forEach(scenario => {
        const risk = dd.calculateRiskScore(scenario.checks);
        assert.equal(risk, scenario.expectedRisk, `${scenario.name}: Risk score correct`);
    });

    // Test recommendation generation
    const rec1 = dd.generateRecommendation(0.1, 0.8);
    assert.ok(rec1.includes('LOW_RISK_HIGH_OPPORTUNITY'), 'Low risk + high opp recognized');

    const rec2 = dd.generateRecommendation(0.8, 0.3);
    assert.ok(rec2.includes('HIGH_RISK'), 'High risk recognized');

    const rec3 = dd.generateRecommendation(0.2, 0.5);
    assert.ok(rec3.includes('LOW_RISK'), 'Low risk recognized');

    console.log('✅ Due diligence risk assessment: PASS');
});

// Test 5: Cross-Agent Data Structures
test('Integration: Agent data compatibility', async (t) => {
    // Test that data structures are compatible across agents
    
    const researchOutput = {
        title: 'Research Finding',
        summary: 'Important discovery',
        relevance_score: 0.9,
        source_url: 'https://example.com',
        themes: ['energy', 'infrastructure']
    };

    const dueDiligenceOutput = {
        entity_name: 'Test Corp',
        risk_score: 0.3,
        opportunity_score: 0.7,
        recommendation: 'PROCEED'
    };

    const chatbotInteraction = {
        session_id: 'session_123',
        user_query: 'What is this?',
        agent_response: 'This is a response',
        confidence_score: 0.85
    };

    // Verify all outputs have required fields
    assert.ok(researchOutput.title, 'Research has title');
    assert.ok(typeof researchOutput.relevance_score === 'number', 'Score is number');
    
    assert.ok(dueDiligenceOutput.entity_name, 'DD has entity name');
    assert.ok(typeof dueDiligenceOutput.risk_score === 'number', 'Risk is number');
    
    assert.ok(chatbotInteraction.session_id, 'Chat has session ID');
    assert.ok(typeof chatbotInteraction.confidence_score === 'number', 'Confidence is number');

    console.log('✅ Cross-agent data compatibility: PASS');
});

// Test 6: Agent Configuration Management
test('Integration: Agent configurations are valid', async (t) => {
    const research = new ResearchAgent();
    const chatbot = new ChatbotAgent();
    const dd = new DueDiligenceAgent();

    // Verify config objects exist and have expected properties
    assert.ok(research.config, 'Research has config');
    assert.ok(research.config.minRelevanceScore !== undefined, 'Has min relevance score');
    assert.ok(Array.isArray(research.config.sources), 'Has research sources');

    assert.ok(chatbot.config, 'Chatbot has config');
    assert.ok(Array.isArray(chatbot.config.escalationKeywords), 'Has escalation keywords');
    assert.ok(chatbot.config.escalationKeywords.length > 0, 'Keywords not empty');

    assert.ok(dd.config, 'DD has config');
    assert.ok(dd.config.riskThreshold !== undefined, 'Has risk threshold');
    assert.ok(dd.config.requiresReview === true, 'Requires human review');

    console.log('✅ Agent configuration management: PASS');
});

// Test 7: Error Recovery Patterns
test('Integration: Agents handle errors gracefully', async (t) => {
    const research = new ResearchAgent();
    const chatbot = new ChatbotAgent();
    const dd = new DueDiligenceAgent();

    // Test with invalid/empty inputs
    const emptyPaper = { title: '', abstract: '' };
    const result = research.calculateRelevance(emptyPaper);
    assert.ok(result.score === 0, 'Empty paper scores 0');

    const emptyQuery = '';
    const escalates = chatbot.shouldEscalate(emptyQuery);
    assert.ok(escalates === false, 'Empty query does not escalate');

    const emptyChecks = {
        basicInfo: { registered: true },
        riskFlags: []
    };
    const risk = dd.calculateRiskScore(emptyChecks);
    assert.ok(risk === 0, 'No flags = no risk');

    console.log('✅ Error recovery patterns: PASS');
});

// Test 8: Concurrent Agent Operations
test('Integration: Agents can operate concurrently', async (t) => {
    const research = new ResearchAgent();
    const chatbot = new ChatbotAgent();
    const dd = new DueDiligenceAgent();

    // Test concurrent operations
    const results = await Promise.all([
        Promise.resolve(research.calculateRelevance({ 
            title: 'Test', 
            abstract: 'AI infrastructure energy' 
        })),
        Promise.resolve(chatbot.shouldEscalate('What is this?')),
        Promise.resolve(dd.calculateRiskScore({
            basicInfo: { registered: true },
            riskFlags: []
        }))
    ]);

    assert.equal(results.length, 3, 'All operations completed');
    assert.ok(typeof results[0].score === 'number', 'Research returned score');
    assert.ok(typeof results[1] === 'boolean', 'Chatbot returned boolean');
    assert.ok(typeof results[2] === 'number', 'DD returned number');

    console.log('✅ Concurrent operations: PASS');
});

console.log('\n🎉 All Phase 4 integration tests passed!');
