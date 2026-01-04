#!/usr/bin/env node
/**
 * One-Step Deployment
 * Quick deployment with your specific Supabase project
 */

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import inquirer from 'inquirer';

console.log(chalk.bold.cyan('\n🚀 Ubuntu Initiative - One-Step Deploy\n'));
console.log(chalk.dim('Project: fohifgmbuewmjybdtidk\n'));

async function deploy() {
    // Step 1: Get service key
    console.log(chalk.bold('Step 1: Get Your Service Role Key\n'));
    console.log(chalk.dim('Open this link in your browser:'));
    console.log(chalk.cyan('https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api\n'));
    console.log(chalk.dim('Copy the "service_role" key (under Project API keys)'));
    console.log(chalk.dim('It starts with "eyJ..." and is very long\n'));

    const { serviceKey } = await inquirer.prompt([
        {
            type: 'password',
            name: 'serviceKey',
            message: 'Paste Service Role Key:',
            validate: (input) => {
                if (!input || input.length < 100) {
                    return 'Service key should be a long JWT token';
                }
                if (!input.startsWith('eyJ')) {
                    return 'Service key should start with "eyJ"';
                }
                return true;
            }
        }
    ]);

    // Step 2: Update .env
    console.log(chalk.bold('\n✅ Updating configuration...\n'));
    
    const envContent = `# Ubuntu Initiative Agent System - Production Configuration

# Supabase Configuration
SUPABASE_URL=https://fohifgmbuewmjybdtidk.supabase.co
SUPABASE_SERVICE_KEY=${serviceKey}

# AI Configuration  
GEMINI_API_KEY=AIzaSyA_bAP956JwrF1pvDmRVNednigilCTuT44

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_51HDarFBkp2utrOiWzFCwpFIwEkjFdrl0JRyuIpg5J0lguNfv8rSj6I4AAH1eaYoIULq9ZWs6KjRrneCFXd6yjrNQ0071g2aBWJ

# Agent Configuration
AUTO_APPROVE_THRESHOLD=0.9
FRAUD_AMOUNT_THRESHOLD=10000

# Environment
NODE_ENV=production
`;

    fs.writeFileSync('.env', envContent);
    console.log(chalk.green('✓ Configuration saved\n'));

    // Step 3: Test connection
    console.log(chalk.bold('Step 2: Testing connection...\n'));

    try {
        const supabase = createClient(
            'https://fohifgmbuewmjybdtidk.supabase.co',
            serviceKey
        );

        const { data, error } = await supabase
            .from('agent_logs')
            .select('count')
            .limit(1);

        if (error && error.code === 'PGRST116') {
            console.log(chalk.yellow('⚠️  Tables not found (this is expected)\n'));
            console.log(chalk.bold('Step 3: Setting up database...\n'));
            console.log(chalk.dim('You need to run the schema manually:\n'));
            console.log(chalk.cyan('1. Open: https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/sql/new'));
            console.log(chalk.cyan('2. Copy the contents of schema.sql'));
            console.log(chalk.cyan('3. Paste and click "Run"\n'));
            
            const { proceed } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'Have you run the schema in Supabase SQL Editor?',
                    default: false
                }
            ]);

            if (!proceed) {
                console.log(chalk.dim('\nRun schema first, then come back and run:\n'));
                console.log(chalk.cyan('  npm run cli status\n'));
                process.exit(0);
            }
        } else if (error) {
            throw error;
        }

        console.log(chalk.green('✓ Database connection successful\n'));

    } catch (error) {
        console.error(chalk.red('✗ Connection failed:'), error.message);
        console.log(chalk.dim('\nMake sure:'));
        console.log(chalk.dim('  1. Service key is correct'));
        console.log(chalk.dim('  2. Project is active'));
        console.log(chalk.dim('  3. Schema is applied\n'));
        process.exit(1);
    }

    // Step 4: Success!
    console.log(chalk.bold.green('✅ Deployment Complete!\n'));
    console.log(chalk.cyan('🎉 Your agent system is ready!\n'));
    
    console.log(chalk.bold('Try these commands:\n'));
    console.log(chalk.dim('  npm run cli status        # Check system health'));
    console.log(chalk.dim('  npm run cli list          # List all agents'));
    console.log(chalk.dim('  npm run cli run research  # Run research agent\n'));
}

deploy().catch(error => {
    console.error(chalk.red('\n❌ Deployment failed:'), error.message);
    process.exit(1);
});
