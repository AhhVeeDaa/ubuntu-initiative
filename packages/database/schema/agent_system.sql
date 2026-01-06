-- ============================================================================
-- AGENT SYSTEM DATABASE SCHEMA
-- Complete redesign with real-time tracking and monitoring
-- ============================================================================

-- Agent Runs Table
-- Tracks every execution of an agent
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, running, success, error, cancelled
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_message TEXT,
  error_stack TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  triggered_by VARCHAR(100), -- user_id or 'system'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent Events Table
-- Real-time event stream for monitoring
CREATE TABLE IF NOT EXISTS agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- started, progress, completed, error, info, warning
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  severity VARCHAR(20) DEFAULT 'info', -- debug, info, warning, error, critical
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent Metrics Table
-- Aggregate performance metrics
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL UNIQUE,
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  failed_runs INTEGER DEFAULT 0,
  cancelled_runs INTEGER DEFAULT 0,
  total_items_processed INTEGER DEFAULT 0,
  avg_execution_time_ms INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error_at TIMESTAMPTZ,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public Audit Log Table
-- Approved actions visible on public site
CREATE TABLE IF NOT EXISTS agent_public_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  impact VARCHAR(50), -- low, medium, high
  approved_by VARCHAR(100),
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  run_id UUID REFERENCES agent_runs(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at ON agent_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_events_run_id ON agent_events(run_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_agent_id ON agent_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_created_at ON agent_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_audit_approved_at ON agent_public_audit_log(approved_at DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_runs_updated_at
  BEFORE UPDATE ON agent_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_metrics_updated_at
  BEFORE UPDATE ON agent_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update metrics on run completion
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('success', 'error', 'cancelled') AND OLD.status = 'running' THEN
    INSERT INTO agent_metrics (agent_id, total_runs, successful_runs, failed_runs, cancelled_runs, total_items_processed, avg_execution_time_ms, last_run_at, last_success_at, last_error_at, last_error_message)
    VALUES (
      NEW.agent_id,
      1,
      CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'error' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END,
      COALESCE(NEW.items_processed, 0),
      COALESCE(NEW.execution_time_ms, 0),
      NEW.completed_at,
      CASE WHEN NEW.status = 'success' THEN NEW.completed_at ELSE NULL END,
      CASE WHEN NEW.status = 'error' THEN NEW.completed_at ELSE NULL END,
      CASE WHEN NEW.status = 'error' THEN NEW.error_message ELSE NULL END
    )
    ON CONFLICT (agent_id) DO UPDATE SET
      total_runs = agent_metrics.total_runs + 1,
      successful_runs = agent_metrics.successful_runs + CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
      failed_runs = agent_metrics.failed_runs + CASE WHEN NEW.status = 'error' THEN 1 ELSE 0 END,
      cancelled_runs = agent_metrics.cancelled_runs + CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END,
      total_items_processed = agent_metrics.total_items_processed + COALESCE(NEW.items_processed, 0),
      avg_execution_time_ms = (
        (agent_metrics.avg_execution_time_ms * agent_metrics.total_runs + COALESCE(NEW.execution_time_ms, 0)) / 
        (agent_metrics.total_runs + 1)
      )::INTEGER,
      last_run_at = NEW.completed_at,
      last_success_at = CASE WHEN NEW.status = 'success' THEN NEW.completed_at ELSE agent_metrics.last_success_at END,
      last_error_at = CASE WHEN NEW.status = 'error' THEN NEW.completed_at ELSE agent_metrics.last_error_at END,
      last_error_message = CASE WHEN NEW.status = 'error' THEN NEW.error_message ELSE agent_metrics.last_error_message END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_metrics_on_run_complete
  AFTER UPDATE ON agent_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_metrics();

-- RLS Policies (enable if using Supabase auth)
-- ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agent_public_audit_log ENABLE ROW LEVEL SECURITY;

-- Public audit log is readable by everyone
-- CREATE POLICY "Public audit log is viewable by everyone" 
--   ON agent_public_audit_log FOR SELECT 
--   USING (true);

-- Seed initial metrics for known agents
INSERT INTO agent_metrics (agent_id) VALUES 
  ('agent_001_policy'),
  ('agent_002_funding'),
  ('agent_004_milestones')
ON CONFLICT (agent_id) DO NOTHING;
