# Agent Audit Log - Implementation Guide

## Problem
The dashboard code queries `agent_audit_log`, `approval_queue`, and `milestone_events` tables, but these don't exist in the database yet. This causes "No recent activity" to show even though agents are working.

## Solution

### Step 1: Apply the Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# Location: /packages/database/migrations/002_agent_tracking.sql
```

This creates:
- ✅ `agent_audit_log` - Complete trail of all agent actions
- ✅ `approval_queue` - Items waiting for human review  
- ✅ `milestone_events` - Detailed milestone change tracking
- ✅ Sample data (8 recent agent activities)

### Step 2: Verify Tables Exist

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('agent_audit_log', 'approval_queue', 'milestone_events');

-- View sample audit log entries
SELECT * FROM agent_audit_log ORDER BY timestamp DESC LIMIT 10;
```

### Step 3: Test the Dashboard

1. Navigate to: `https://ubuntu-initiative-web.vercel.app/dashboard`
2. You should now see:
   - **Recent Agent Activity** section with 8 sample entries
   - Agent IDs (agent_001_policy, agent_002_community, etc.)
   - Action types and reasoning
   - Confidence scores
   - Timestamps

### Step 4: Set Up Real-Time Agent Logging

When agents perform actions, log them like this:

```typescript
// Example: Log agent activity from your agent code
const { data, error } = await supabase
  .from('agent_audit_log')
  .insert({
    agent_id: 'agent_004_funding',
    action_type: 'grant_discovered',
    reasoning: 'Found $5M grant from World Bank for renewable energy',
    confidence_score: 0.92,
    entity_type: 'research',
    input_data: { search_query: 'Africa renewable energy grants 2026' },
    output_data: { 
      grant_name: 'World Bank Clean Energy Initiative',
      amount: 5000000,
      deadline: '2026-06-30'
    }
  });
```

## What Users Will See

### Dashboard View
```
┌─────────────────────────────────────────┐
│ Recent Agent Activity                   │
├─────────────────────────────────────────┤
│ agent_008_due_diligence                 │
│ stakeholder_vetted                      │
│ Completed background check on           │
│ potential investor                      │
│ 88% confidence | Just now               │
├─────────────────────────────────────────┤
│ agent_007_research                      │
│ technical_paper_analyzed                │
│ Synthesized 3 research papers on        │
│ hydropower optimization                 │
│ 91% confidence | 2 min ago              │
└─────────────────────────────────────────┘
```

## Agent Activity Schema

```typescript
agent_audit_log {
  id: UUID
  agent_id: string              // 'agent_001_policy'
  action_type: string           // 'research_completed'
  reasoning: string             // Human-readable explanation
  confidence_score: number      // 0.0 - 1.0
  entity_type: string           // 'milestone', 'partner', etc.
  entity_id: UUID               // Reference to affected item
  input_data: JSONB             // What the agent processed
  output_data: JSONB            // What the agent produced
  timestamp: DateTime
}
```

## Next Steps

1. ✅ Apply migration (creates tables + sample data)
2. ✅ Verify dashboard shows activity
3. 🔄 Connect actual agents to log their actions
4. 🔄 Set up real-time subscriptions for live updates
5. 🔄 Add filtering and search to audit log

## Real-Time Updates (Optional)

Enable live updates using Supabase Realtime:

```typescript
// In your dashboard component
useEffect(() => {
  const subscription = supabase
    .channel('agent-activity')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'agent_audit_log' 
      },
      (payload) => {
        console.log('New agent activity:', payload.new);
        // Update UI with new activity
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Troubleshooting

**Problem**: Still seeing "No recent activity"
- Check if migration ran: `SELECT COUNT(*) FROM agent_audit_log;`
- Should return at least 8 rows

**Problem**: Permission errors
- Ensure RLS policies allow reading from `agent_audit_log`
- Temporarily disable RLS for testing: `ALTER TABLE agent_audit_log DISABLE ROW LEVEL SECURITY;`

**Problem**: Dashboard not fetching data
- Check Supabase URL and keys in `.env.local`
- Verify `@supabase/ssr` is installed
- Check browser console for errors
