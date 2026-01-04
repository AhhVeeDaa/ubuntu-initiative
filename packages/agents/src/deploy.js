#!/usr/bin/env node
/**
 * Quick Deploy Script
 * Complete production setup in one command
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';

console.log(chalk.bold.cyan('\n🚀 Ubuntu Initiative - Quick Deploy\n'));

async function quickDeploy() {
    console.log(chalk.dim('This will configure and deploy your agent system.\n'));

    // Check if service key is needed
    const envContent = fs.readFileSync('.env', 'utf8');
    
    if (envContent.includes('NEED_SERVICE_ROLE_KEY')) {
        console.log(chalk.yellow('⚠️  Service Role Key Required\n'));
        console.log(chalk.dim('To get your Supabase service role key:'));
        console.log(chalk.dim('  1. Go to: https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api'));
        console.log(chalk.dim('  2. Copy the "service_role" key (under "Project API keys")'));
        console.log(chalk.dim('  3. Paste it below\n'));

        const { serviceKey } = await inquirer.prompt([
            {
                type: 'password',
                name: 'serviceKey',
                message: 'Supabase Service Role Key:',
                validate: (input) => {
                    if (!input || input.length < 100) {
                        return 'Service key should be a long JWT token (starts with eyJ...)';
                    }
                    return true;
                }
            }
        ]);

        // Update .env file
        const updatedEnv = envContent.replace('NEED_SERVICE_ROLE_KEY', serviceKey);
        fs.writeFileSync('.env', updatedEnv);
        
        console.log(chalk.green('\n✓ Service key configured\n'));
    }

    // Confirm deployment
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Ready to set up database and deploy agents?',
            default: true
        }
    ]);

    if (!confirm) {
        console.log(chalk.dim('\nDeployment cancelled\n'));
        process.exit(0);
    }

    console.log(chalk.bold('\n📦 Setting up database...\n'));

    // Run database setup
    try {
        execSync('npm run setup:database', { stdio: 'inherit' });
    } catch (error) {
        console.log(chalk.yellow('\n⚠️  Database setup had some warnings (this is often OK)'));
        console.log(chalk.dim('Tables may already exist from previous setup\n'));
    }

    // Test the system
    console.log(chalk.bold('\n🔍 Testing system...\n'));
    
    try {
        execSync('npm run cli status', { stdio: 'inherit' });
    } catch (error) {
        console.log(chalk.red('\n❌ System test failed'));
        process.exit(1);
    }

    // Success!
    console.log(chalk.bold.green('\n✅ Deployment Complete!\n'));
    
    console.log(chalk.cyan('🎉 Your agent system is ready!\n'));
    
    console.log(chalk.bold('Quick start commands:\n'));
    console.log(chalk.dim('  npm run cli list              # List all agents'));
    console.log(chalk.dim('  npm run cli run research      # Run research agent'));
    console.log(chalk.dim('  npm run cli run chatbot       # Run Inga GPT'));
    console.log(chalk.dim('  npm run cli interactive       # Interactive mode\n'));

    console.log(chalk.bold('Next steps:\n'));
    console.log(chalk.dim('  1. Test an agent: npm run cli run research'));
    console.log(chalk.dim('  2. Check Supabase dashboard for data'));
    console.log(chalk.dim('  3. Set up automated scheduling (cron jobs)'));
    console.log(chalk.dim('  4. Configure monitoring and alerts\n'));
}

quickDeploy().catch(error => {
    console.error(chalk.red('\n❌ Deployment failed:'), error.message);
    process.exit(1);
});
