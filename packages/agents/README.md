# Ubuntu Initiative Agent System

Multi-agent automation system for transparent governance and milestone tracking.

## Architecture

### Agents
- **Funding Agent** (`agent_002`): Processes donations, detects fraud, tracks grants
- **Milestone Agent** (`agent_004`): Validates progress milestones with evidence
- **Policy Agent** (`agent_001`): Monitors policy changes (coming soon)
- **Chatbot Agent** (`agent_005`): Powers Inga GPT (coming soon)

### Database Schema
Located in `supabase/migrations/001_initial_schema.sql`

Tables:
- `milestone_events` - Public progress tracking
- `policy_events` - Public policy timeline
- `donation_aggregates` - Anonymized donation stats
- `knowledge_base` - Chatbot Q&A pairs
- `donations` (private) - Full donation records
- `agent_audit_log` (private) - Complete audit trail
- `approval_queue` (private) - Human review queue

## Setup

1. **Install dependencies**
```bash
cd packages/agents
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Deploy database schema**
```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in Supabase dashboard
```

## Usage

### Test Agents

```bash
# Test all agents
node src/cli.js test:all

# Test specific agent
node src/cli.js test:funding
node src/cli.js test:milestone

# Show help
node src/cli.js help
```

### Run Individual Agent

```bash
# Funding agent
npm run agent:funding

# Milestone agent
npm run agent:milestone
```

## Development

### Creating a New Agent

1. Extend `BaseAgent` class
2. Implement `run()` method
3. Use provided helper methods:
   - `logAction()` - Audit trail
   - `queueForReview()` - Human approval
   - `generateAI()` - AI generation
   - `calculateConfidence()` - Confidence scoring

Example:
```javascript
import { BaseAgent } from '../base-agent.js';

export class MyAgent extends BaseAgent {
    constructor() {
        super('agent_xxx_name', { /* config */ });
    }

    async run() {
        // Your agent logic here
    }
}
```

### Safety Guardrails

All agents include:
- Confidence thresholds (default: 0.9 for auto-publish)
- Human approval queue for uncertain outputs
- Complete audit logging
- Data boundary respect (RLS policies)

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run dev
```

## Deployment

Agents can be deployed as:
1. **Supabase Edge Functions** - For webhooks and realtime
2. **GitHub Actions** - For scheduled jobs
3. **Vercel Serverless Functions** - For API endpoints

## Monitoring

View agent activity:
- Dashboard: `/dashboard` (authenticated)
- Audit Log: `private.agent_audit_log` table
- Approval Queue: `private.approval_queue` table

## Documentation

Full architecture: See `ubuntu_agent_architecture.json`

## License

MIT
