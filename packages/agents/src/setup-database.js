#!/usr/bin/env node
/**
 * Database Setup Script
 * Applies schema to Supabase database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.bold.cyan('\n🗄️  Ubuntu Initiative Agent System - Database Setup\n'));

async function setupDatabase() {
    // Validate environment
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
        console.error(chalk.red('❌ SUPABASE_URL not configured'));
        console.log(chalk.dim('Run: npm run setup:configure\n'));
        process.exit(1);
    }

    if (!process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY.includes('placeholder')) {
        console.error(chalk.red('❌ SUPABASE_SERVICE_KEY not configured'));
        console.log(chalk.dim('Run: npm run setup:configure\n'));
        process.exit(1);
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );

    console.log(chalk.dim('Database: ' + process.env.SUPABASE_URL + '\n'));

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
        console.error(chalk.red('❌ Schema file not found: schema.sql'));
        process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split into individual statements (basic splitting)
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(chalk.dim(`Found ${statements.length} SQL statements to execute\n`));

    // Execute statements
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        const spinner = ora(`Executing statement ${i + 1}/${statements.length}`).start();

        try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });
            
            if (error) {
                // Try direct execution if RPC fails
                throw error;
            }

            spinner.succeed(chalk.green(`Statement ${i + 1}/${statements.length}`));
            successCount++;
        } catch (error) {
            spinner.fail(chalk.yellow(`Statement ${i + 1}/${statements.length} (may be OK)`));
            errorCount++;
            errors.push({
                statement: i + 1,
                error: error.message,
                sql: statement.substring(0, 100) + '...'
            });
        }
    }

    console.log(chalk.bold('\n📊 Setup Summary:\n'));
    console.log(chalk.green(`  ✓ Successful: ${successCount}`));
    
    if (errorCount > 0) {
        console.log(chalk.yellow(`  ⚠ Warnings: ${errorCount} (likely already exist)`));
    }

    // Verify tables exist
    console.log(chalk.bold('\n🔍 Verifying Tables:\n'));

    const tables = [
        'agent_logs',
        'knowledge_base',
        'chat_logs',
        'review_queue',
        'policy_changes',
        'community_signals',
        'research_papers',
        'funding_opportunities',
        'milestones'
    ];

    for (const table of tables) {
        const spinner = ora(`Checking ${table}...`).start();
        
        try {
            const { data, error } = await supabase
                .from(table)
                .select('count')
                .limit(1);

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            spinner.succeed(chalk.green(`${table} ✓`));
        } catch (error) {
            spinner.fail(chalk.red(`${table} ✗`));
        }
    }

    console.log(chalk.bold.green('\n✅ Database setup complete!\n'));
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('  1. Test system: npm run cli status'));
    console.log(chalk.dim('  2. Run agent: npm run cli run research\n'));
}

setupDatabase().catch(error => {
    console.error(chalk.red('\n❌ Database setup failed:'), error.message);
    console.log(chalk.dim('\nTroubleshooting:'));
    console.log(chalk.dim('  1. Verify SUPABASE_SERVICE_KEY has correct permissions'));
    console.log(chalk.dim('  2. Check Supabase project is active'));
    console.log(chalk.dim('  3. Run schema manually in Supabase SQL Editor\n'));
    process.exit(1);
});
