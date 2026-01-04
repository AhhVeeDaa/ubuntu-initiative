/**
 * Complete Test Suite Runner
 * Runs all phases of testing in sequence
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testPhases = [
    { name: 'Phase 2: Core Agent Logic', file: 'test-phase2.js' },
    { name: 'Phase 3: Enhanced Agent Methods', file: 'test-phase3.js' },
    { name: 'Phase 4: System Integration', file: 'test-phase4.js' }
];

console.log('🚀 Ubuntu Initiative Agent System - Complete Test Suite\n');
console.log('='.repeat(60));

async function runTest(testFile) {
    return new Promise((resolve, reject) => {
        const testPath = join(__dirname, testFile);
        const child = spawn('node', [testPath], {
            stdio: 'inherit',
            cwd: __dirname
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error(`Test failed with code ${code}`));
            }
        });

        child.on('error', reject);
    });
}

async function runAllTests() {
    let passed = 0;
    let failed = 0;

    for (const phase of testPhases) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Running: ${phase.name}`);
        console.log('='.repeat(60));

        try {
            await runTest(phase.file);
            passed++;
            console.log(`\n✅ ${phase.name} PASSED`);
        } catch (error) {
            failed++;
            console.log(`\n❌ ${phase.name} FAILED`);
            console.error(error.message);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('FINAL RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passed}/${testPhases.length}`);
    console.log(`❌ Failed: ${failed}/${testPhases.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! Agent system is ready.\n');
        return 0;
    } else {
        console.log('\n⚠️  Some tests failed. Review errors above.\n');
        return 1;
    }
}

runAllTests()
    .then(code => process.exit(code))
    .catch(error => {
        console.error('Test runner error:', error);
        process.exit(1);
    });
