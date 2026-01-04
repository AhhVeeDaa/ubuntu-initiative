#!/usr/bin/env node
/**
 * Ubuntu Initiative Agent CLI
 * Command-line interface for managing AI agents
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import agents
import { PolicyAgent } from './agents/policy-agent.js';
import { CommunityAgent } from './agents/community-agent.js';
import { NarrativeAgent } from './agents/narrative-agent.js';
import { ChatbotAgent } from './agents/chatbot-agent.js';
import { DueDiligenceAgent } from './agents/due-diligence-agent.js';
import { ResearchAgent } from './agents/research-agent.js';
import { MilestoneAgent } from './agents/milestone-agent.js';
import { FundingAgent } from './agents/funding-agent.js';

const program = new Command();

program
    .name('ubuntu-agents')
    .description('Ubuntu Initiative AI Agent Management')
    .version('0.5.0');

// Agent registry
const AGENTS = {
    policy: { class: PolicyAgent, name: 'Policy Monitor', id: 'agent_001' },
    community: { class: CommunityAgent, name: 'Community Listener', id: 'agent_002' },
    narrative: { class: NarrativeAgent, name: 'Content Generator', id: 'agent_003' },
    funding: { class: FundingAgent, name: 'Grant Finder', id: 'agent_004' },
    chatbot: { class: ChatbotAgent, name: 'Inga GPT', id: 'agent_005' },
    milestone: { class: MilestoneAgent, name: 'Progress Tracker', id: 'agent_006' },
    research: { class: ResearchAgent, name: 'Research Synthesizer', id: 'agent_007' },
    'due-diligence': { class: DueDiligenceAgent, name: 'Stakeholder Vetter', id: 'agent_008' }
};

/**
 * List all available agents
 */
program
    .command('list')
    .description('List all available agents')
    .action(() => {
        console.log(chalk.bold('\n📋 Ubuntu Initiative AI Agents\n'));
        
        Object.entries(AGENTS).forEach(([key, agent]) => {
            console.log(chalk.cyan(`  ${agent.id}`) + ` - ${chalk.bold(agent.name)} (${key})`);
        });
        
        console.log(chalk.dim('\nUse: ubuntu-agents run <agent-name> to start an agent\n'));
    });

/**
 * Run a specific agent
 */
program
    .command('run <agent>')
    .description('Run a specific agent')
    .option('-v, --verbose', 'Enable verbose logging')
    .action(async (agentKey, options) => {
        const agentInfo = AGENTS[agentKey];
        
        if (!agentInfo) {
            console.error(chalk.red(`\n❌ Unknown agent: ${agentKey}`));
            console.log(chalk.dim('Run "ubuntu-agents list" to see available agents\n'));
            process.exit(1);
        }

        const spinner = ora(`Starting ${agentInfo.name}...`).start();

        try {
            const agent = new agentInfo.class();
            spinner.succeed(chalk.green(`${agentInfo.name} initialized`));

            console.log(chalk.dim(`\nAgent ID: ${agentInfo.id}`));
            console.log(chalk.dim(`Mode: Advisory (human review required)\n`));

            // Run the agent
            const result = await agent.run();
            
            console.log(chalk.bold('\n📊 Agent Status:'));
            console.log(JSON.stringify(result, null, 2));
            
            console.log(chalk.green('\n✅ Agent completed successfully\n'));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to run ${agentInfo.name}`));
            console.error(chalk.red('\n❌ Error:'), error.message);
            
            if (options.verbose) {
                console.error(chalk.dim('\nStack trace:'));
                console.error(chalk.dim(error.stack));
            }
            
            process.exit(1);
        }
    });

/**
 * Test all agents
 */
program
    .command('test')
    .description('Run test suite')
    .option('-p, --phase <number>', 'Run specific test phase (2, 3, or 4)')
    .action(async (options) => {
        console.log(chalk.bold('\n🧪 Running Agent Tests\n'));

        const phases = options.phase 
            ? [`test-phase${options.phase}.js`]
            : ['test-phase2.js', 'test-phase3.js', 'test-phase4.js'];

        for (const phase of phases) {
            console.log(chalk.cyan(`\nRunning ${phase}...\n`));
            
            try {
                await import(`./${phase}`);
            } catch (error) {
                console.error(chalk.red(`\n❌ Tests failed: ${error.message}\n`));
                process.exit(1);
            }
        }

        console.log(chalk.green('\n✅ All tests passed!\n'));
    });

/**
 * Check system status
 */
program
    .command('status')
    .description('Check system configuration and status')
    .action(async () => {
        console.log(chalk.bold('\n🔍 System Status\n'));

        // Check environment variables
        const envChecks = [
            { name: 'SUPABASE_URL', value: process.env.SUPABASE_URL },
            { name: 'SUPABASE_SERVICE_KEY', value: process.env.SUPABASE_SERVICE_KEY },
            { name: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY }
        ];

        console.log(chalk.bold('Environment Variables:'));
        envChecks.forEach(({ name, value }) => {
            const status = value && !value.includes('placeholder') 
                ? chalk.green('✓ Configured')
                : chalk.yellow('⚠ Not configured');
            console.log(`  ${name}: ${status}`);
        });

        // Check agent availability
        console.log(chalk.bold('\nAgent Availability:'));
        let healthyAgents = 0;
        
        for (const [key, agentInfo] of Object.entries(AGENTS)) {
            try {
                const agent = new agentInfo.class();
                console.log(chalk.green(`  ✓ ${agentInfo.name}`));
                healthyAgents++;
            } catch (error) {
                console.log(chalk.red(`  ✗ ${agentInfo.name}: ${error.message}`));
            }
        }

        console.log(chalk.bold(`\nOverall Health: ${healthyAgents}/${Object.keys(AGENTS).length} agents ready`));

        if (healthyAgents === Object.keys(AGENTS).length) {
            console.log(chalk.green('\n✅ System is healthy\n'));
        } else {
            console.log(chalk.yellow('\n⚠️  Some agents need attention\n'));
        }
    });

/**
 * Interactive mode
 */
program
    .command('interactive')
    .alias('i')
    .description('Start interactive mode')
    .action(async () => {
        console.log(chalk.bold('\n🤖 Ubuntu Initiative Agent System'));
        console.log(chalk.dim('Interactive Mode\n'));

        const { agentKey } = await inquirer.prompt([
            {
                type: 'list',
                name: 'agentKey',
                message: 'Select an agent to run:',
                choices: Object.entries(AGENTS).map(([key, agent]) => ({
                    name: `${agent.name} (${key})`,
                    value: key
                }))
            }
        ]);

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Run ${AGENTS[agentKey].name}?`,
                default: true
            }
        ]);

        if (confirm) {
            // Use the run command
            await program.parseAsync(['node', 'cli.js', 'run', agentKey]);
        } else {
            console.log(chalk.dim('\nCancelled\n'));
        }
    });

// Parse command line arguments
program.parse();
