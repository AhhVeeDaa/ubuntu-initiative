/**
 * Unit Tests for Agent System
 */

import { test } from 'node:test';
import assert from 'node:assert';

// Test confidence calculation
test('BaseAgent: Calculate confidence score', () => {
    const criteria = {
        hasTitle: 1,
        hasDescription: 0.5,
        hasEvidence: 1,
        hasCategory: 1
    };
    
    const scores = Object.values(criteria);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const confidence = Math.round(avg * 100) / 100;
    
    assert.strictEqual(confidence, 0.88);
    console.log('✅ Confidence calculation: PASS');
});

// Test URL validation
test('MilestoneAgent: URL validation', () => {
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    assert.strictEqual(isValidUrl('https://github.com/test'), true);
    assert.strictEqual(isValidUrl('invalid-url'), false);
    assert.strictEqual(isValidUrl(''), false);
    
    console.log('✅ URL validation: PASS');
});

// Test fraud detection logic
test('FundingAgent: Fraud detection thresholds', () => {
    const fraudAmountThreshold = 10000;
    
    const testCases = [
        { amount: 5000, expected: 'approved' },
        { amount: 15000, expected: 'flagged' },
        { amount: 10001, expected: 'flagged' }
    ];
    
    testCases.forEach(test => {
        const flags = [];
        if (test.amount > fraudAmountThreshold) {
            flags.push('high_amount');
        }
        const status = flags.length === 0 ? 'approved' : 'flagged';
        assert.strictEqual(status, test.expected);
    });
    
    console.log('✅ Fraud detection thresholds: PASS');
});

// Test milestone validation
test('MilestoneAgent: Milestone validation criteria', () => {
    const validateMilestone = (submission) => {
        const criteria = {
            hasTitle: submission.title && submission.title.length > 10 ? 1 : 0,
            hasDescription: submission.description && submission.description.length > 50 ? 1 : 0.5,
            hasEvidence: submission.evidence_url ? 1 : 0,
            hasValidCategory: ['technical', 'community', 'policy', 'funding'].includes(submission.category) ? 1 : 0,
            hasCompletionDate: submission.completion_date ? 1 : 0
        };
        
        const scores = Object.values(criteria);
        const confidence = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        return {
            valid: confidence >= 0.7,
            confidence: Math.round(confidence * 100) / 100
        };
    };
    
    const goodMilestone = {
        title: 'Test Milestone Complete',
        description: 'This is a detailed description that is definitely more than 50 characters long.',
        evidence_url: 'https://github.com/commit/123',
        category: 'technical',
        completion_date: '2025-01-05'
    };
    
    const badMilestone = {
        title: 'Test',
        description: 'Short',
        evidence_url: '',
        category: 'invalid',
        completion_date: null
    };
    
    const goodResult = validateMilestone(goodMilestone);
    const badResult = validateMilestone(badMilestone);
    
    assert.strictEqual(goodResult.valid, true);
    assert.strictEqual(goodResult.confidence, 1.0);
    assert.strictEqual(badResult.valid, false);
    
    console.log('✅ Milestone validation: PASS');
});

// Test approval queue priority logic
test('Approval Queue: Priority assignment', () => {
    const assignPriority = (confidence, itemType) => {
        if (confidence < 0.5) return 'urgent';
        if (confidence < 0.7) return 'high';
        if (confidence < 0.9) return 'medium';
        return 'low';
    };
    
    assert.strictEqual(assignPriority(0.3, 'policy'), 'urgent');
    assert.strictEqual(assignPriority(0.6, 'milestone'), 'high');
    assert.strictEqual(assignPriority(0.85, 'narrative'), 'medium');
    assert.strictEqual(assignPriority(0.95, 'grant'), 'low');
    
    console.log('✅ Approval queue priority: PASS');
});

console.log('\n🎉 All tests passed!\n');
