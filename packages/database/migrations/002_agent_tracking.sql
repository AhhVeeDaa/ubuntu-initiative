-- Migration: Add Agent Tracking and Audit Tables
-- This enables real-time monitoring of agent activities

-- Agent Audit Log: Complete trail of all agent actions
CREATE TABLE IF NOT EXISTS agent_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_id UUID,
  entity_type TEXT,
  reasoning TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  input_data JSONB,
  output_data JSONB,
  metadata JSONB,
  human_reviewed BOOLEAN DEFAULT FALSE,
  human_reviewer TEXT,
  reviewed_at TIMESTAMP,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Approval Queue: Items waiting for human review
CREATE TABLE IF NOT EXISTS approval_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  agent_id TEXT NOT NULL,
  agent_recommendation JSONB NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  human_decision TEXT,
  decided_by TEXT,
  decided_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Milestone Events: Detailed tracking of milestone changes
CREATE TABLE IF NOT EXISTS milestone_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID,
  event_type TEXT NOT NULL,
  category TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_progress INTEGER,
  new_progress INTEGER,
  changed_by TEXT,
  change_reason TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'pending',
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_audit_log_agent_id ON agent_audit_log(agent_id);
CREATE INDEX idx_agent_audit_log_timestamp ON agent_audit_log(timestamp DESC);
CREATE INDEX idx_approval_queue_status ON approval_queue(status);
CREATE INDEX idx_milestone_events_created_at ON milestone_events(created_at DESC);

-- Seed sample data (each INSERT on its own line to avoid string issues)
INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_001_policy', 'monitoring_initialized', 'Started monitoring DRC energy policy changes', 0.95, 'research');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_002_community', 'sentiment_analysis_complete', 'Analyzed 247 social media posts about Inga Dam project', 0.87, 'research');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_003_narrative', 'content_draft_created', 'Generated blog post about clean energy impact', 0.92, 'document');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_004_funding', 'grant_opportunity_found', 'Identified renewable energy grant from AfDB worth $2M', 0.89, 'research');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_005_chatbot', 'user_interaction_logged', 'Answered 15 questions about project timeline', 0.94, NULL);

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_006_milestone', 'progress_updated', 'Updated feasibility study milestone to 35 percent complete', 0.98, 'milestone');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_007_research', 'technical_paper_analyzed', 'Synthesized 3 research papers on hydropower optimization', 0.91, 'research');

INSERT INTO agent_audit_log (agent_id, action_type, reasoning, confidence_score, entity_type) 
VALUES ('agent_008_due_diligence', 'stakeholder_vetted', 'Completed background check on potential investor', 0.88, 'partner');
