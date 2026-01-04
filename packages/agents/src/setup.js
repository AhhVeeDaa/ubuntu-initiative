#!/usr/bin/env node
/**
 * Production Setup Script
 * Configures the agent system for production use
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.bold.cyan('\n🚀 Ubuntu Initiative Agent System - Production Setup\n'));

async function main() {
    console.log(chalk.dim('This script will configure your agent system for production.\n'));

    // Step 1: Gather credentials
    console.log(chalk.bold('Step 1: API Credentials\n'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'supabaseUrl',
            message: 'Supabase Project URL:',
            default: 'https://fohifgmbuewmjybdtidk.supabase.co',
            validate: (input) => input.startsWith('https://') || 'Must be a valid URL'
        },
        {
            type: 'password',
            name: 'supabaseServiceKey',
            message: 'Supabase Service Role Key (from Project Settings > API):',
            validate: (input) => input.length > 20 || 'Service key required (starts with eyJ...)'
        },
        {
            type: 'password',
            name: 'geminiApiKey',
            message: 'Google Gemini API Key:',
            default: 'AIzaSyA_bAP956JwrF1pvDmRVNednigilCTuT44',
            validate: (input) => input.startsWith('AIza') || 'Must be a valid Gemini API key'
        },
        {
            type: 'input',
            name: 'stripeSecretKey',
            message: 'Stripe Secret Key (optional, press Enter to skip):',
            default: 'sk_test_51HDarFBkp2utrOiWzFCwpFIwEkjFdrl0JRyuIpg5J0lguNfv8rSj6I4AAH1eaYoIULq9ZWs6KjRrneCFXd6yjrNQ0071g2aBWJ'
        }
    ]);

    // Step 2: Write .env file
    console.log(chalk.bold('\n\nStep 2: Writing Configuration\n'));
    
    const spinner = ora('Creating .env file...').start();

    const envContent = `# Ubuntu Initiative Agent System - Production Configuration
# Generated: ${new Date().toISOString()}

# Supabase Configuration
SUPABASE_URL=${answers.supabaseUrl}
SUPABASE_SERVICE_KEY=${answers.supabaseServiceKey}

# AI Configuration
GEMINI_API_KEY=${answers.geminiApiKey}

# Payment Configuration (optional)
STRIPE_SECRET_KEY=${answers.stripeSecretKey || 'sk_test_placeholder'}

# Agent Configuration
AUTO_APPROVE_THRESHOLD=0.9
FRAUD_AMOUNT_THRESHOLD=10000

# Environment
NODE_ENV=production
`;

    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);
    
    spinner.succeed(chalk.green('.env file created'));

    // Step 3: Test connection
    console.log(chalk.bold('\nStep 3: Testing Connection\n'));

    const testSpinner = ora('Testing Supabase connection...').start();

    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(answers.supabaseUrl, answers.supabaseServiceKey);
        
        const { data, error } = await supabase
            .from('agent_logs')
            .select('count')
            .limit(1);

        if (error && error.code !== 'PGRST116') {
            // PGRST116 = table doesn't exist, which is OK for now
            throw error;
        }

        testSpinner.succeed(chalk.green('Supabase connection successful'));
    } catch (error) {
        testSpinner.fail(chalk.yellow('Supabase connection failed (this is OK if schema not set up yet)'));
        console.log(chalk.dim(`  Error: ${error.message}\n`));
    }

    // Step 4: Summary
    console.log(chalk.bold('\n✅ Configuration Complete!\n'));
    
    console.log(chalk.cyan('Next Steps:\n'));
    console.log('  1. Set up database schema:');
    console.log(chalk.dim('     npm run setup:database\n'));
    console.log('  2. Test the system:');
    console.log(chalk.dim('     npm run cli status\n'));
    console.log('  3. Run an agent:');
    console.log(chalk.dim('     npm run cli run research\n'));

    console.log(chalk.bold.green('\n🎉 Ready to deploy!\n'));
}

main().catch(error => {
    console.error(chalk.red('\n❌ Setup failed:'), error.message);
    process.exit(1);
});
