# Ubuntu Initiative Agent Network (UIAN)

## Overview

The Ubuntu Initiative Agent Network transforms the static website into a living, real-time dashboard powered by AI agents. This system automates key tasks, provides transparency, and maintains human oversight through approval workflows.

## Architecture

### Core Components

1. **Supabase Backend**
   - PostgreSQL database with public/private schemas
   - Row Level Security (RLS) for access control
   - Real-time subscriptions for live updates
   - Edge Functions for serverless compute

2. **Agent Library** (`/lib/agents/`)
   - Base agent interface with audit logging
   - Individual agent implementations
   - Confidence scoring and validation
   - Phase 0 content compliance checks

3. **API Endpoints** (`/app/api/`)
   - Webhook handlers (Stripe, GitHub)
   - Dashboard APIs (approval queue, metrics)
   - Agent execution triggers

4. **UI Components** (`/components/agents/`)
   - Real-time data displays
   - Approval queue interface
   - Agent status indicators

## Implemented Agents

### 1. Funding & Grant Agent (`agent_002`)
**Purpose**: Track donations and grant opportunities
**Autonomy**: Semi-autonomous
**Triggers**:
- Stripe webhook on donation
- Scheduled grant scans
- Monthly report generation

**Features**:
- Real-time donation processing
- PII protection (private schema)
- Fraud detection (>$10k flagged)
- Public aggregates (anonymized)

### 2. Progress Milestone Agent (`agent_004`)
**Purpose**: Validate and publish milestone completions
**Autonomy**: Semi-autonomous
**Triggers**:
- GitHub webhooks (PR merge, issue close)
- Manual submissions
- Milestone validation requests

**Features**:
- Auto-publish high-confidence milestones (>90%)
- Evidence URL validation
- Phase 0 compliance checking
- Approval queue for uncertain items

## Database Schema

### Public Tables (Read-only for public)
- `milestone_events` - Verified project milestones
- `policy_events` - Tracked policy changes
- `donation_aggregates` - Anonymized donation stats
- `knowledge_base` - Inga GPT Q&A pairs
- `research_papers` - Curated research
- `grant_opportunities` - Public grant listings

### Private Tables (Internal only)
- `donations` - Full donation records with PII
- `stakeholder_profiles` - Due diligence data
- `agent_audit_log` - Complete agent action trail
- `approval_queue` - Items awaiting review
- `chat_logs` - Inga GPT conversation history
- `community_signals` - Sentiment data

## Getting Started

### Prerequisites
```bash
# Environment variables required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Database Setup
```bash
# Run migrations
psql your_database < supabase/migrations/001_core_schema.sql
psql your_database < supabase/migrations/002_private_schema.sql
```

### Testing Agents
```typescript
// Example: Test funding agent
import { FundingGrantAgent } from '@/lib/agents/funding-grant-agent';

const agent = new FundingGrantAgent();
const result = await agent.execute({
  trigger: 'donation_webhook',
  data: {
    stripe_payment_id: 'pi_test123',
    amount: 100,
    currency: 'USD'
  }
});

console.log(result);
```

## Safety & Transparency

### Confidence Scoring
All agent outputs include confidence scores (0-1):
- **≥0.9**: Auto-publish (low-risk items)
- **0.7-0.9**: Queue for review
- **<0.7**: High priority review required

### Audit Trail
Every agent action is logged to `agent_audit_log`:
- Input data
- Output data
- Confidence score
- Reasoning
- Human review status

### Phase 0 Guardrails
Agents validate content against Phase 0 constraints:
- No future phase references
- No speculative language
- Evidence-based claims only
- Source attribution required

## Human-in-the-Loop

### Approval Queue
Items requiring review are added to `approval_queue`:
- Priority levels: low, medium, high, urgent
- Item types: policy, milestone, narrative, grant, insight
- Status tracking: pending, in_review, approved, rejected

### Dashboard API
```typescript
// Fetch pending approvals
GET /api/dashboard/approval-queue?status=pending

// Approve/reject an item
POST /api/dashboard/approval-queue
{
  "item_id": "uuid",
  "action": "approve",
  "reviewer_notes": "Verified evidence"
}
```

## UI Integration

### Real-time Donation Tracker
```tsx
import { RealtimeDonationTracker } from '@/components/agents/RealtimeDonationTracker';

<RealtimeDonationTracker />
```

Features:
- Live donation updates via Supabase Realtime
- Progress thermometer
- Contributor count
- Agent attribution

## Next Steps

### Additional Agents to Implement
1. **Policy Tracking Agent** - Monitor policy changes
2. **Narrative & Messaging Agent** - Generate public content
3. **Community Signal Agent** - Track sentiment
4. **Research Synthesis Agent** - Curate academic papers
5. **Stakeholder Due Diligence Agent** - Vet partners

### Future Enhancements
- GitHub Actions for automated triggers
- Email digest automations
- Advanced fraud detection
- Multi-language support
- API rate limiting
- Agent performance dashboard

## Security Considerations

1. **PII Protection**: Donor data never exposed publicly
2. **Service Role Key**: Agents use service role, never exposed to client
3. **RLS Policies**: Database-level access control
4. **Input Sanitization**: All user inputs sanitized
5. **Audit Logging**: Immutable trail of all actions

## Contributing

To add a new agent:
1. Extend `BaseAgent` class
2. Implement `execute()` method
3. Add confidence scoring logic
4. Include Phase 0 validation
5. Log all actions to audit trail
6. Add approval workflow for high-risk items
7. Document in this README

## Support

For questions or issues:
- GitHub Issues: [ubuntu-initiative](https://github.com/AhhVeeDaa/ubuntu-initiative)
- Email: team@ubuntu-initiative.org

## License

MIT License - See LICENSE file for details
