# 🔐 UbuntuHub WhatsApp Integration Specification

**Version:** 1.0.0  
**Phase:** 0 (Foundation)  
**Status:** Design Complete  
**Author:** UbuntuHub Architecture Team  
**Date:** 2026-01-08  

---

## Design Philosophy

> WhatsApp is a **pager, not a brain**.  
> A **governance tool, not a chatbot**.  
> An **extension of institutional control, not convenience UX**.

---

## 1. Phase 0 WhatsApp Use Cases

### 1.1 Permitted Uses

| Use Case | Type | Recipients | Frequency |
|----------|------|------------|-----------|
| New policy detected | Notification | Reviewers | Per detection |
| High-relevance alert (score ≥ 0.8) | Urgent notification | Reviewers | Per detection |
| Approval required | Actionable | Reviewers | Per queue item |
| Approval confirmed | Confirmation | Reviewers | Per approval |
| Rejection issued | Confirmation | Reviewers | Per rejection |
| Agent error/failure | System alert | Admins | Per failure |
| Daily digest | Summary | Observers | 1x daily |

### 1.2 Recipient Roles

| Role | Can Receive | Can Act |
|------|-------------|---------|
| **Reviewer** | All notifications | Approve, Reject, Request Details |
| **Observer** | Digests, confirmations only | None |
| **Admin** | System alerts | None via WhatsApp |

### 1.3 Explicitly Disallowed

- ❌ Free-form questions to agents
- ❌ Policy reasoning or analysis requests
- ❌ Sensitive data transmission (financials, PII)
- ❌ Agent-to-agent messaging
- ❌ Public or unauthenticated access
- ❌ Multi-step conversational flows
- ❌ Forwarding of messages to non-allowlisted numbers
- ❌ Any action that bypasses dashboard approval queue

---

## 2. Message Templates

### 2.1 Policy Agent Alert

```
🔔 UBUNTUHUB POLICY ALERT

Agent: Policy Monitoring Agent
Timestamp: 2026-01-08 14:32 UTC
Run ID: pol_run_7f8a9b

━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEW POLICY DETECTED

Headline: [HEADLINE - max 100 chars]
Jurisdiction: [JURISDICTION]
Category: [CATEGORY]

Relevance: ██████████ 0.92
Confidence: ████████░░ 0.78

━━━━━━━━━━━━━━━━━━━━━━━━

🔗 View in Dashboard
[DASHBOARD_URL]

No action required.
```

### 2.2 Approval Required

```
⚠️ UBUNTUHUB — APPROVAL REQUIRED

Agent: Policy Monitoring Agent
Timestamp: 2026-01-08 14:35 UTC
Queue ID: apq_3c4d5e

━━━━━━━━━━━━━━━━━━━━━━━━

📋 PENDING REVIEW

Item: [HEADLINE - max 100 chars]
Priority: HIGH
Expires: 2026-01-09 14:35 UTC

Relevance: ██████████ 0.95
Confidence: █████████░ 0.88

━━━━━━━━━━━━━━━━━━━━━━━━

Reply with:
• APPROVE [Queue ID]
• REJECT [Queue ID]
• DETAILS [Queue ID]

Or review in Dashboard:
[DASHBOARD_URL]
```

### 2.3 Approval Confirmed

```
✅ UBUNTUHUB — APPROVED

Agent: Policy Monitoring Agent
Timestamp: 2026-01-08 14:42 UTC
Queue ID: apq_3c4d5e

━━━━━━━━━━━━━━━━━━━━━━━━

Item: [HEADLINE - max 100 chars]
Approved by: [REVIEWER_NAME]
Source: WhatsApp

Logged to audit trail.
```

### 2.4 Rejection / Revision Request

```
🔴 UBUNTUHUB — REJECTED

Agent: Policy Monitoring Agent
Timestamp: 2026-01-08 14:45 UTC
Queue ID: apq_3c4d5e

━━━━━━━━━━━━━━━━━━━━━━━━

Item: [HEADLINE - max 100 chars]
Rejected by: [REVIEWER_NAME]
Source: WhatsApp

Reason: [Optional - captured in dashboard]

Logged to audit trail.
```

### 2.5 System Error / Agent Failure

```
🚨 UBUNTUHUB — SYSTEM ALERT

Agent: Policy Monitoring Agent
Timestamp: 2026-01-08 14:50 UTC
Run ID: pol_run_7f8a9b

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AGENT FAILURE

Error: [ERROR_TYPE]
Items affected: [COUNT]

━━━━━━━━━━━━━━━━━━━━━━━━

Check system status:
[DASHBOARD_URL]/admin/agents

No WhatsApp action available.
Contact technical support if persistent.
```

### 2.6 Daily Digest (Observers)

```
📊 UBUNTUHUB DAILY DIGEST

Date: 2026-01-08
Period: 00:00 - 23:59 UTC

━━━━━━━━━━━━━━━━━━━━━━━━

Policy Agent Summary:
• New policies detected: 12
• Approved: 8
• Rejected: 2
• Pending: 2

System Status: ✅ Operational

━━━━━━━━━━━━━━━━━━━━━━━━

Full details:
[DASHBOARD_URL]/transparency
```

---

## 3. Interaction Model

### 3.1 Permitted Interactions

| Command | Format | Response | Action |
|---------|--------|----------|--------|
| `APPROVE [ID]` | Text reply | Confirmation message | Updates approval_queue, logs to audit |
| `REJECT [ID]` | Text reply | Confirmation message | Updates approval_queue, logs to audit |
| `DETAILS [ID]` | Text reply | Extended item info | No state change, logs query |
| `STATUS` | Text reply | Current queue summary | No state change |

### 3.2 Button Interactions (When Supported)

```
┌─────────────────────────────────────┐
│  [✅ Approve]  [❌ Reject]  [📄 View]  │
└─────────────────────────────────────┘
```

Button payloads:
- Approve: `action:approve:apq_3c4d5e`
- Reject: `action:reject:apq_3c4d5e`
- View: Opens dashboard URL

### 3.3 Explicitly Forbidden

| Forbidden Action | Reason |
|-----------------|--------|
| Open-ended questions | No AI reasoning via WhatsApp |
| `EXPLAIN [ID]` | Policy analysis requires dashboard |
| `SEARCH [term]` | No query capability via WhatsApp |
| Multi-turn conversations | Stateless interaction only |
| Forwarded messages | Security boundary violation |
| Voice messages | Not processable |
| Images/documents | Not processable |

### 3.4 Invalid Input Handling

```
❓ UNRECOGNIZED COMMAND

Your message could not be processed.

Valid commands:
• APPROVE [Queue ID]
• REJECT [Queue ID]
• DETAILS [Queue ID]
• STATUS

For all other actions, use the Dashboard:
[DASHBOARD_URL]
```

---

## 4. System Architecture

### 4.1 Provider Choice

**Primary: Meta Cloud API (WhatsApp Business Platform)**

Rationale:
- Official API, long-term stability
- Template message support
- Interactive message types (buttons, lists)
- Webhook-based architecture
- Enterprise-grade security
- No intermediary service dependencies

Alternative: Twilio (if Meta API unavailable in deployment region)

### 4.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        UBUNTUHUB PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   POLICY     │────▶│   SUPABASE   │────▶│  WHATSAPP    │     │
│  │   AGENT      │     │   (SoR)      │     │  NOTIFIER    │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│         │                    │                    │              │
│         │                    │                    ▼              │
│         │                    │           ┌──────────────┐        │
│         │                    │           │  META CLOUD  │        │
│         │                    │           │     API      │        │
│         │                    │           └──────────────┘        │
│         │                    │                    │              │
│         │                    │                    ▼              │
│         │                    │           ┌──────────────┐        │
│         │                    │           │  RECIPIENT   │        │
│         │                    │           │  (Reviewer)  │        │
│         │                    │           └──────────────┘        │
│         │                    │                    │              │
│         │                    │                    │ Reply        │
│         │                    │                    ▼              │
│         │                    │           ┌──────────────┐        │
│         │                    │           │  WEBHOOK     │        │
│         │                    ◀───────────│  HANDLER     │        │
│         │                    │           └──────────────┘        │
│         │                    │                                   │
│         ▼                    ▼                                   │
│  ┌──────────────┐     ┌──────────────┐                          │
│  │  DASHBOARD   │◀───▶│  AUDIT LOG   │                          │
│  └──────────────┘     └──────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/webhooks/whatsapp` | POST | Receive incoming messages & status updates |
| `/api/webhooks/whatsapp` | GET | Webhook verification (Meta handshake) |
| `/api/notifications/whatsapp/send` | POST | Internal: Trigger outbound message |

### 4.4 Event Flow: Agent → Notification

```
1. Policy Agent completes run
2. Agent writes to policy_updates table
3. Supabase trigger fires on INSERT
4. Trigger calls Edge Function: notify_whatsapp()
5. Edge Function:
   a. Checks relevance_score >= threshold
   b. Queries whatsapp_recipients for role
   c. Constructs template message
   d. Calls Meta Cloud API
   e. Logs to whatsapp_notifications table
6. Meta delivers message to recipient
```

### 4.5 Event Flow: Reply → Action

```
1. User replies with "APPROVE apq_3c4d5e"
2. Meta sends webhook to /api/webhooks/whatsapp
3. Webhook handler:
   a. Validates sender phone hash against allowlist
   b. Parses command and queue ID
   c. Verifies queue item exists and is pending
   d. Verifies sender has reviewer role
   e. Updates approval_queue.status = 'approved'
   f. Updates approval_queue.reviewed_by (hashed)
   g. Updates approval_queue.source = 'whatsapp'
   h. Inserts into whatsapp_audit_log
   i. Sends confirmation message
4. Dashboard reflects updated state immediately
```

### 4.6 Error Handling

| Error Type | Response | Log Level |
|------------|----------|-----------|
| Unknown sender | Silent drop | WARN |
| Invalid command | Help message | INFO |
| Queue item not found | Error message | WARN |
| Unauthorized action | Error message | WARN |
| Meta API failure | Retry 3x, then log | ERROR |
| Database failure | Admin alert | CRITICAL |

---

## 5. Access Control & Security

### 5.1 Phone Number Allowlisting

```typescript
// whatsapp_recipients table
{
  id: uuid,
  phone_hash: string,        // SHA-256 of E.164 phone
  role: 'reviewer' | 'observer' | 'admin',
  user_id: uuid,             // FK to auth.users
  active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

**No plaintext phone numbers stored.**

Phone hash computed as:
```typescript
const phoneHash = crypto
  .createHash('sha256')
  .update(phoneE164 + process.env.PHONE_HASH_SALT)
  .digest('hex');
```

### 5.2 Role Permissions

```typescript
const WHATSAPP_PERMISSIONS = {
  reviewer: {
    canReceive: ['alert', 'approval_required', 'confirmation', 'digest'],
    canAct: ['approve', 'reject', 'details', 'status']
  },
  observer: {
    canReceive: ['digest', 'confirmation'],
    canAct: ['status']
  },
  admin: {
    canReceive: ['system_alert'],
    canAct: [] // No WhatsApp actions, dashboard only
  }
};
```

### 5.3 Rate Limiting

| Limit Type | Value | Window |
|------------|-------|--------|
| Outbound per recipient | 20 messages | 24 hours |
| Inbound per recipient | 50 commands | 24 hours |
| Total outbound | 1000 messages | 24 hours |
| API calls to Meta | 80/second | Rolling |

Rate limit exceeded:
- Outbound: Queue message, deliver on next window
- Inbound: Return rate limit error, log

### 5.4 Replay Protection

Each actionable message includes a single-use nonce:

```typescript
// On message send
const nonce = crypto.randomUUID();
await supabase.from('whatsapp_nonces').insert({
  nonce,
  queue_id: queueId,
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
});

// On reply processing
const { data: nonceRecord } = await supabase
  .from('whatsapp_nonces')
  .select()
  .eq('nonce', extractedNonce)
  .single();

if (!nonceRecord || new Date() > new Date(nonceRecord.expires_at)) {
  throw new Error('Invalid or expired action');
}

// Mark nonce as used
await supabase
  .from('whatsapp_nonces')
  .update({ used_at: new Date() })
  .eq('nonce', extractedNonce);
```

### 5.5 Webhook Security

```typescript
// Verify Meta webhook signature
function verifyWebhookSignature(req: Request): boolean {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.META_APP_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}
```

---

## 6. Audit & Logging Design

### 6.1 Tables

#### `whatsapp_notifications`

```sql
CREATE TABLE whatsapp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Correlation
  agent_run_id UUID REFERENCES agent_runs(id),
  queue_item_id UUID REFERENCES approval_queue(id),
  policy_update_id UUID REFERENCES policy_updates(id),
  
  -- Message details
  template_name TEXT NOT NULL,
  recipient_hash TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  message_id TEXT, -- Meta's message ID
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, read, failed
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);
```

#### `whatsapp_interactions`

```sql
CREATE TABLE whatsapp_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Correlation
  notification_id UUID REFERENCES whatsapp_notifications(id),
  queue_item_id UUID REFERENCES approval_queue(id),
  
  -- Interaction
  sender_hash TEXT NOT NULL,
  command TEXT NOT NULL,
  raw_message TEXT, -- Sanitized, no PII
  
  -- Outcome
  action_taken TEXT, -- approve, reject, details, invalid
  outcome TEXT, -- success, error, unauthorized
  error_message TEXT,
  
  -- State change
  previous_state JSONB,
  new_state JSONB,
  
  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

#### `whatsapp_nonces`

```sql
CREATE TABLE whatsapp_nonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nonce TEXT UNIQUE NOT NULL,
  queue_id UUID REFERENCES approval_queue(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 Required Fields per Log Entry

| Field | Required | Purpose |
|-------|----------|---------|
| `id` | Yes | Unique identifier |
| `timestamp` | Yes | When event occurred |
| `agent_id` | Yes | Which agent triggered event |
| `action_type` | Yes | What happened |
| `correlation_id` | Yes | Links to agent_run, queue_item |
| `sender_hash` | Conditional | Who acted (interactions only) |
| `outcome` | Yes | Result of action |
| `source` | Yes | Always 'whatsapp' |

### 6.3 Audit Trail Linkage

```
agent_runs.id
    │
    ├── policy_updates.agent_run_id
    │       │
    │       └── approval_queue.item_id
    │               │
    │               ├── whatsapp_notifications.queue_item_id
    │               │
    │               └── whatsapp_interactions.queue_item_id
    │
    └── agent_audit_log.agent_run_id
```

All WhatsApp activity can be traced back to the originating agent run.

---

## 7. Dashboard Integration

### 7.1 Notification Status Panel

Location: `/dashboard/notifications`

```
┌─────────────────────────────────────────────────────────────┐
│ WHATSAPP NOTIFICATIONS                           [Refresh]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   142    │  │   138    │  │    4     │  │    0     │    │
│  │  Sent    │  │Delivered │  │ Pending  │  │ Failed   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  Last 24 hours                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Approval History Enhancement

Existing approval history now shows source attribution:

```
┌─────────────────────────────────────────────────────────────┐
│ APPROVAL HISTORY                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ AU Energy Policy Update                                  │
│     Approved by: J. Mutombo                                  │
│     Source: 📱 WhatsApp                                      │
│     Time: 2026-01-08 14:42 UTC                              │
│     Queue ID: apq_3c4d5e                                     │
│                                                              │
│  ✅ Kenya AI Framework Amendment                             │
│     Approved by: A. Okonkwo                                  │
│     Source: 🖥️ Dashboard                                     │
│     Time: 2026-01-08 13:15 UTC                              │
│     Queue ID: apq_2b3c4d                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Error Visibility

Location: `/dashboard/admin/whatsapp`

```
┌─────────────────────────────────────────────────────────────┐
│ WHATSAPP DELIVERY ERRORS                        [Last 7d]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️ 2026-01-07 09:12 UTC                                    │
│     Template: approval_required                              │
│     Error: Rate limit exceeded                               │
│     Recipient: ****3847                                      │
│     Resolution: Auto-retry scheduled                         │
│                                                              │
│  ⚠️ 2026-01-06 22:45 UTC                                    │
│     Template: policy_alert                                   │
│     Error: Invalid phone number format                       │
│     Recipient: ****9021                                      │
│     Resolution: Manual review required                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 State Synchronization

**Critical Rule:** WhatsApp actions are processed through the same approval queue logic as dashboard actions.

```typescript
// Both paths use the same function
async function processApproval(
  queueId: string,
  reviewerId: string,
  source: 'dashboard' | 'whatsapp'
): Promise<void> {
  await supabase
    .from('approval_queue')
    .update({
      status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date(),
      source: source
    })
    .eq('id', queueId);
  
  // Same audit logging
  await logApprovalAction(queueId, reviewerId, 'approved', source);
}
```

Dashboard always reflects true state. WhatsApp actions are never siloed.

---

## 8. Phase 0 Boundaries & Future Expansion

### 8.1 Phase 0 Scope (Current)

| Feature | Status |
|---------|--------|
| Policy Agent notifications | ✅ Included |
| Approval/Reject via WhatsApp | ✅ Included |
| Details query | ✅ Included |
| Status query | ✅ Included |
| Daily digest | ✅ Included |
| Interactive buttons | ✅ Included |
| Full audit trail | ✅ Included |
| Role-based access | ✅ Included |

### 8.2 Deferred to Phase 1+

| Feature | Phase | Governance Requirement |
|---------|-------|----------------------|
| Funding Agent notifications | Phase 1 | Board approval |
| Multi-agent summaries | Phase 1 | Architecture review |
| Escalation chains | Phase 1 | Policy review |
| Voice note transcription | Phase 2 | Security review |
| Document attachment handling | Phase 2 | Data governance review |
| WhatsApp Groups | Phase 2+ | Institutional policy |
| AI-assisted summaries via WhatsApp | Deferred | Governance review |

### 8.3 Explicitly Blocked (Requires Governance Review)

| Feature | Reason |
|---------|--------|
| Open-ended AI chat | Uncontrollable output risk |
| Policy recommendation via WhatsApp | Requires dashboard context |
| Financial data transmission | Sensitivity classification |
| Agent-to-agent via WhatsApp | Audit complexity |
| Public access or onboarding | Security boundary |
| Automated decision-making | Human oversight mandate |

### 8.4 Expansion Checklist

Before enabling any Phase 1+ feature:

- [ ] Governance committee approval
- [ ] Security review complete
- [ ] Audit trail design reviewed
- [ ] Data classification confirmed
- [ ] Rate limit analysis complete
- [ ] Dashboard integration designed
- [ ] Rollback plan documented
- [ ] User consent mechanism (if applicable)

---

## Implementation Checklist

### Database Schema

- [ ] Create `whatsapp_recipients` table
- [ ] Create `whatsapp_notifications` table
- [ ] Create `whatsapp_interactions` table
- [ ] Create `whatsapp_nonces` table
- [ ] Add `source` column to `approval_queue`
- [ ] Create database triggers for notifications

### API Routes

- [ ] `/api/webhooks/whatsapp` (GET/POST)
- [ ] `/api/notifications/whatsapp/send` (POST, internal)

### Edge Functions

- [ ] `notify_whatsapp` - Outbound message handler
- [ ] `process_whatsapp_reply` - Inbound command processor

### Configuration

- [ ] Meta Cloud API credentials
- [ ] Webhook verification token
- [ ] Phone hash salt
- [ ] Rate limit parameters
- [ ] Template IDs

### Dashboard Updates

- [ ] Notification status panel
- [ ] Source attribution in approval history
- [ ] WhatsApp error visibility
- [ ] Recipient management UI

### Security

- [ ] Webhook signature verification
- [ ] Phone number hashing
- [ ] Nonce generation and validation
- [ ] Rate limiting implementation
- [ ] Allowlist enforcement

---

## Appendix: Environment Variables

```bash
# Meta Cloud API
META_WHATSAPP_PHONE_ID=
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_VERIFY_TOKEN=
META_APP_SECRET=

# Security
PHONE_HASH_SALT=

# Rate Limits
WHATSAPP_OUTBOUND_DAILY_LIMIT=1000
WHATSAPP_PER_RECIPIENT_DAILY_LIMIT=20
WHATSAPP_INBOUND_DAILY_LIMIT=50

# Templates
WHATSAPP_TEMPLATE_ALERT=policy_alert_v1
WHATSAPP_TEMPLATE_APPROVAL=approval_required_v1
WHATSAPP_TEMPLATE_CONFIRMED=approval_confirmed_v1
WHATSAPP_TEMPLATE_REJECTED=approval_rejected_v1
WHATSAPP_TEMPLATE_ERROR=system_alert_v1
WHATSAPP_TEMPLATE_DIGEST=daily_digest_v1
```

---

**End of Specification**

*This document is the authoritative reference for WhatsApp integration in UbuntuHub Phase 0.*
