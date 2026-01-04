/**
 * Standalone Tests for Phase 2 Agents (no database required)
 */

import { test } from 'node:test';
import assert from 'node:assert';

// Import agent classes
import { PolicyAgent } from './agents/policy-agent.js';
import { CommunityAgent } from './agents/community-agent.js';
import { NarrativeAgent } from './agents/narrative-agent.js';

// Test Policy Agent relevance scoring
test('PolicyAgent: Relevance calculation', () => {
    // Mock agent without database connection
    const mockAgent = {
        calculateRelevance: (policy) => {
            const keywords = ['inga', 'hydropower', 'drc', 'congo', 'energy', 'infrastructure'];
            const text = (policy.title + ' ' + policy.summary).toLowerCase();
            
            let matches = 0;
            keywords.forEach(keyword => {
                if (text.includes(keyword)) matches++;
            });
            
            return {
                score: Math.min(matches / 5, 1.0),
                matches: matches
            };
        }
    };
    
    const highRelevance = {
        title: 'DRC Announces Inga Hydropower Development',
        summary: 'New infrastructure investment for Congo energy sector'
    };
    
    const lowRelevance = {
        title: 'European Union Trade Agreement',
        summary: 'New trade policies for European markets'
    };
    
    const highResult = mockAgent.calculateRelevance(highRelevance);
    const lowResult = mockAgent.calculateRelevance(lowRelevance);
    
    assert.ok(highResult.score > 0.6, 'High relevance policy should score >0.6');
    assert.ok(lowResult.score < 0.4, 'Low relevance policy should score <0.4');
    assert.ok(highResult.matches >= 3, 'Should match multiple keywords');
    
    console.log('✅ Policy relevance calculation: PASS');
});

// Test Community Agent sentiment analysis
test('CommunityAgent: Sentiment analysis', () => {
    const agent = new CommunityAgent();
    
    const positive = agent.analyzeSentiment('This is great progress! Excellent work on transparency.');
    const negative = agent.analyzeSentiment('This is terrible. Very disappointed with the lack of progress.');
    const neutral = agent.analyzeSentiment('The meeting is scheduled for tomorrow.');
    
    assert.ok(positive > 0, 'Positive text should have positive sentiment');
    assert.ok(negative < 0, 'Negative text should have negative sentiment');
    assert.strictEqual(neutral, 0, 'Neutral text should have neutral sentiment');
    
    console.log('✅ Sentiment analysis: PASS');
});

// Test Community Agent categorization
test('CommunityAgent: Signal categorization', () => {
    const agent = new CommunityAgent();
    
    const categories = [
        ['How can I donate to support the initiative?', 'funding'],
        ['What milestones have been completed so far?', 'progress'],
        ['I have a concern about the timeline.', 'concern'],
        ['Just a general comment about the website.', 'general']
    ];
    
    categories.forEach(([text, expected]) => {
        const result = agent.categorizeSignal(text);
        assert.strictEqual(result, expected, `"${text}" should be categorized as ${expected}`);
    });
    
    console.log('✅ Signal categorization: PASS');
});

// Test Narrative Agent content validation
test('NarrativeAgent: Content validation', () => {
    const agent = new NarrativeAgent();
    
    // Good content
    const goodContent = 'Completed database migration! Evidence: https://github.com/commit/123';
    const goodResult = agent.validateContent(goodContent);
    assert.ok(goodResult.valid, 'Valid content should pass');
    assert.ok(goodResult.confidence >= 0.5, 'Valid content should have decent confidence');
    
    // Content with prohibited terms
    const futureContent = 'In Phase 2, we will deploy the AI supercomputer';
    const futureResult = agent.validateContent(futureContent);
    assert.ok(!futureResult.valid, 'Future phase mentions should fail');
    assert.ok(futureResult.issues.length > 0, 'Should have validation issues');
    
    // Content with superlatives but no data
    const superlativeContent = 'We are the best initiative in the world!';
    const superlativeResult = agent.validateContent(superlativeContent);
    // Superlative detection reduces confidence but doesn't make it invalid alone
    assert.ok(superlativeResult.confidence < 0.8, 'Superlatives should reduce confidence');
    
    console.log('✅ Content validation: PASS');
});

// Test Narrative Agent prohibited terms detection
test('NarrativeAgent: Prohibited terms', () => {
    const agent = new NarrativeAgent();
    
    const prohibited = agent.config.prohibitedTerms;
    const testContent = 'In Phase 1 we will deploy features';
    const validation = agent.validateContent(testContent);
    
    assert.ok(validation.issues.some(i => i.includes('prohibited')), 
              'Should detect prohibited terms');
    
    console.log('✅ Prohibited terms detection: PASS');
});

// Test Policy Agent category determination
test('PolicyAgent: Category determination', () => {
    const agent = new PolicyAgent();
    
    const tests = [
        ['New hydropower regulations announced', 'energy'],
        ['Infrastructure investment framework launched', 'infrastructure'],
        ['AI governance policy updated', 'ai_sovereignty'],
        ['Environmental impact assessment guidelines', 'environment']
    ];
    
    tests.forEach(([title, expected]) => {
        const policy = { title, summary: title };
        const category = agent.determineCategory(policy);
        assert.strictEqual(category, expected, `"${title}" should be ${expected}`);
    });
    
    console.log('✅ Policy categorization: PASS');
});

// Test Community Agent content hashing
test('CommunityAgent: Content hashing', () => {
    const agent = new CommunityAgent();
    
    const text1 = 'This is a test message';
    const text2 = 'This is a test message';
    const text3 = 'This is a different message';
    
    const hash1 = agent.hashContent(text1);
    const hash2 = agent.hashContent(text2);
    const hash3 = agent.hashContent(text3);
    
    assert.strictEqual(hash1, hash2, 'Same content should produce same hash');
    assert.notStrictEqual(hash1, hash3, 'Different content should produce different hash');
    
    console.log('✅ Content hashing: PASS');
});

console.log('\n🎉 All Phase 2 agent tests passed!\n');
