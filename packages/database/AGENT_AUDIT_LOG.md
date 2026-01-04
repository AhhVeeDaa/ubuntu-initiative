# Agent Audit Log - Implementation Guide

## ✅ Status: COMPLETED

The agent audit log tables have been successfully created in your database!

## What Was Created

### Tables
- ✅ `agent_audit_log` - Complete trail of all agent actions (8 sample entries)
- ✅ `approval_queue` - Items waiting for human review
- ✅ `milestone_events` - Detailed milestone change tracking

### Indexes
- ✅ Optimized queries on agent_id, timestamp, status, and created_at

### Sample Data
8 agent activities were inserted to demonstrate the system:
1. **agent_001_policy** - Policy monitoring initialized
2. **agent_002_community** - Sentiment analysis completed
3. **agent_003_narrative** - Content draft created
4. **agent_004_funding** - Grant opportunity found
5. **agent_005_chatbot** - User interactions logged
6. **agent_006_milestone** - Progress updated
7. **agent_007_research** - Technical papers analyzed
8. **agent_008_due_diligence** - Stakeholder vetted

## How to View the Audit Log

### Option 1: Dashboard UI
Visit your dashboard at:
```
https://ubuntu-initiative-web.vercel.app/dashboard
```

Scroll to the **"Recent Agent Activity"** section to see:
- Agent IDs and action types
- Reasoning and confidence scores
- Timestamps for each activity

### Option 2: Direct SQL Query
Run this in Supabase SQL Editor:
```sql
SELECT 
  agent_id,
  action_type,
  reasoning,
  confidence_score,
  entity_type,
  timestamp
FROM agent_audit_log 
ORDER BY timestamp DESC;
```

### Option 3: API Access
Query via Supabase client:
```typescript
const { data: auditLogs } = await supabase
  .from('agent_audit_log')
  .select('*')
  .order('timestamp', { ascending: false })
  .limit(20);
```

## Logging New Agent Activity

When your agents perform actions, log them like this:

```typescript
// Example: Log a new agent action
const { data, error } = await supabase
  .from('agent_audit_log')
  .insert({
    agent_id: 'agent_004_funding',
    action_type: 'grant_discovered',
    reasoning: 'Found $5M grant from World Bank for renewable energy in Sub-Saharan Africa',
    confidence_score: 0.92,
    entity_type: 'research',
    input_data: { 
      search_query: 'Africa renewable energy grants 2026',
      sources_checked: 15
    },
    output_data: { 
      grant_name: 'World Bank Clean Energy Initiative',
      amount: 5000000,
      deadline: '2026-06-30',
      eligibility: 'Hydropower projects in DRC'
    }
  });
```

## Schema Reference

### agent_audit_log
```typescript
{
  id: UUID                    // Auto-generated
  agent_id: string           // e.g., 'agent_001_policy'
  action_type: string        // e.g., 'research_completed'
  entity_id?: UUID           // Reference to affected resource
  entity_type?: string       // 'milestone', 'partner', etc.
  reasoning: string          // Human-readable explanation
  confidence_score: number   // 0.0 to 1.0
  input_data?: JSONB         // What agent processed
  output_data?: JSONB        // What agent produced
  metadata?: JSONB           // Additional context
  human_reviewed: boolean    // Default: false
  human_reviewer?: string    // Who reviewed it
  reviewed_at?: timestamp    // When reviewed
  timestamp: timestamp       // When action occurred
  created_at: timestamp      // When logged
}
```

### approval_queue
```typescript
{
  id: UUID
  item_type: string          // 'partnership', 'milestone', etc.
  item_id: UUID              // ID of item needing approval
  agent_id: string           // Which agent submitted
  agent_recommendation: JSONB // Agent's suggested action
  priority: string           // 'low', 'normal', 'high', 'urgent'
  status: string             // 'pending', 'approved', 'rejected'
  human_decision?: string    // Approval/rejection notes
  decided_by?: string        // Who decided
  decided_at?: timestamp     // When decided
  created_at: timestamp
}
```

### milestone_events
```typescript
{
  id: UUID
  milestone_id?: UUID
  event_type: string         // 'created', 'progress_updated', etc.
  category: string           // Same as milestone category
  old_status?: string
  new_status?: string
  old_progress?: number
  new_progress?: number
  changed_by: string         // 'founder', 'agent_xyz', etc.
  change_reason?: string
  metadata?: JSONB
  status: string             // 'pending', 'verified'
  title?: string
  description?: string
  created_at: timestamp
}
```

## Real-Time Updates (Optional Enhancement)

Enable live updates in your dashboard using Supabase Realtime:

```typescript
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAgentActivityStream() {
  useEffect(() => {
    const subscription = supabase
      .channel('agent-activity-stream')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'agent_audit_log' 
        },
        (payload) => {
          console.log('🤖 New agent activity:', payload.new);
          // Update your UI state here
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
```

## Verification Queries

Check if everything is working:

```sql
-- Count total audit log entries
SELECT COUNT(*) as total_activities FROM agent_audit_log;
-- Should return: 8

-- View all agent activities with confidence scores
SELECT 
  agent_id,
  action_type,
  confidence_score,
  TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI:SS') as activity_time
FROM agent_audit_log 
ORDER BY timestamp DESC;

-- Check approval queue
SELECT COUNT(*) as pending_approvals 
FROM approval_queue 
WHERE status = 'pending';

-- View milestone events
SELECT * FROM milestone_events 
ORDER BY created_at DESC;
```

## Next Steps

1. ✅ **Migration Applied** - Tables created with sample data
2. ✅ **Dashboard Ready** - View at `/dashboard` endpoint
3. 🔄 **Connect Live Agents** - Integrate actual agent logging
4. 🔄 **Add Filters** - Implement filtering by agent, date, confidence
5. 🔄 **Real-time Updates** - Add Supabase Realtime subscriptions
6. 🔄 **Approval Workflow** - Build UI for human review of agent actions

## Troubleshooting

### "No recent activity" showing on dashboard
1. Check if data exists:
   ```sql
   SELECT COUNT(*) FROM agent_audit_log;
   ```
2. Verify Supabase connection in `.env.local`
3. Check browser console for errors
4. Ensure RLS policies allow reading (if enabled)

### Can't insert new activities
- Check if you have INSERT permissions
- Verify confidence_score is between 0 and 1
- Ensure agent_id and action_type are not null

### Performance issues
- Indexes are already created on key columns
- For historical data, consider partitioning by date
- Archive old entries after 90 days to separate table

## Migration File Location
```
📁 /packages/database/migrations/002_agent_tracking.sql
```

This file contains the exact SQL that was run to create these tables.
