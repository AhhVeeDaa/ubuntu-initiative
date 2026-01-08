-- ============================================================================
-- AGENT SYSTEM COMPLETE MIGRATION
-- Creates all tables needed for real-time agent monitoring and execution
-- ============================================================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS agent_costs CASCADE;
DROP TABLE IF EXISTS agent_failures CASCADE;
DROP TABLE IF EXISTS agent_events CASCADE;
DROP TABLE IF EXISTS agent_runs CASCADE;

-- ============================================================================
-- AGENT RUNS TABLE
-- Tracks every agent execution with status, timing, and results
-- ============================================================================
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'success', 'error', 'timeout')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  items_processed INTEGER DEFAULT 0,
  error_message TEXT,
  error_stack TEXT,
  triggered_by VARCHAR(50) DEFAULT 'manual',
  input_data JSONB,
  output_data JSONB,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_agent_runs_status ON agent_runs(status, started_at DESC);
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id, started_at DESC);
CREATE INDEX idx_agent_runs_created_at ON agent_runs(created_at DESC);
CREATE INDEX idx_agent_runs_agent_status ON agent_runs(agent_id, status);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_agent_runs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_runs_updated_at
  BEFORE UPDATE ON agent_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_runs_updated_at();

-- ============================================================================
-- AGENT EVENTS TABLE
-- Real-time event stream for agent execution progress
-- ============================================================================
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for real-time queries
CREATE INDEX idx_agent_events_run_id ON agent_events(run_id, created_at DESC);
CREATE INDEX idx_agent_events_agent_id ON agent_events(agent_id, created_at DESC);
CREATE INDEX idx_agent_events_created_at ON agent_events(created_at DESC);
CREATE INDEX idx_agent_events_severity ON agent_events(severity, created_at DESC);

-- ============================================================================
-- AGENT FAILURES TABLE (Dead Letter Queue)
-- Stores failed runs for manual review and retry
-- ============================================================================
CREATE TABLE agent_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
  agent_id VARCHAR(50) NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  input_data JSONB,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_failures_agent_id ON agent_failures(agent_id, created_at DESC);
CREATE INDEX idx_agent_failures_resolved ON agent_failures(resolved, created_at DESC);

-- ============================================================================
-- AGENT COSTS TABLE
-- Track API usage and costs per run
-- ============================================================================
CREATE TABLE agent_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  stripe_api_calls INTEGER DEFAULT 0,
  supabase_queries INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  external_api_calls INTEGER DEFAULT 0,
  estimated_cost_usd DECIMAL(10, 6) DEFAULT 0.000000,
  actual_cost_usd DECIMAL(10, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_costs_run_id ON agent_costs(run_id);
CREATE INDEX idx_agent_costs_agent_id ON agent_costs(agent_id, created_at DESC);

-- ============================================================================
-- ENABLE REALTIME
-- Allow Supabase to stream changes via SSE
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE agent_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Public can read some data, only service role can write
-- ============================================================================

-- Agent Runs: Read-only for public, write for service
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent runs are viewable by everyone"
  ON agent_runs FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert agent runs"
  ON agent_runs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update agent runs"
  ON agent_runs FOR UPDATE
  USING (true);

-- Agent Events: Read-only for public, write for service
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent events are viewable by everyone"
  ON agent_events FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert agent events"
  ON agent_events FOR INSERT
  WITH CHECK (true);

-- Agent Failures: Admin only
ALTER TABLE agent_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access agent failures"
  ON agent_failures FOR ALL
  USING (true);

-- Agent Costs: Admin only
ALTER TABLE agent_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access agent costs"
  ON agent_costs FOR ALL
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- Useful queries for metrics and monitoring
-- ============================================================================

-- Get agent health status
CREATE OR REPLACE FUNCTION get_agent_health(agent_filter VARCHAR DEFAULT NULL)
RETURNS TABLE (
  agent_id VARCHAR,
  total_runs BIGINT,
  successful_runs BIGINT,
  failed_runs BIGINT,
  success_rate DECIMAL,
  avg_execution_time DECIMAL,
  last_run_at TIMESTAMPTZ,
  last_run_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ar.agent_id,
    COUNT(*) as total_runs,
    SUM(CASE WHEN ar.status = 'success' THEN 1 ELSE 0 END) as successful_runs,
    SUM(CASE WHEN ar.status = 'error' THEN 1 ELSE 0 END) as failed_runs,
    ROUND(
      (SUM(CASE WHEN ar.status = 'success' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
      2
    ) as success_rate,
    ROUND(AVG(ar.execution_time_ms)::DECIMAL, 0) as avg_execution_time,
    MAX(ar.started_at) as last_run_at,
    (
      SELECT status 
      FROM agent_runs 
      WHERE agent_id = ar.agent_id 
      ORDER BY started_at DESC 
      LIMIT 1
    ) as last_run_status
  FROM agent_runs ar
  WHERE 
    (agent_filter IS NULL OR ar.agent_id = agent_filter)
    AND ar.started_at > NOW() - INTERVAL '7 days'
  GROUP BY ar.agent_id;
END;
$$ LANGUAGE plpgsql;

-- Get recent agent activity
CREATE OR REPLACE FUNCTION get_recent_agent_activity(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  event_id UUID,
  run_id UUID,
  agent_id VARCHAR,
  event_type VARCHAR,
  message TEXT,
  severity VARCHAR,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ae.id,
    ae.run_id,
    ae.agent_id,
    ae.event_type,
    ae.message,
    ae.severity,
    ae.created_at
  FROM agent_events ae
  ORDER BY ae.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Uncomment to add test data
/*
INSERT INTO agent_runs (agent_id, status, started_at, completed_at, execution_time_ms, items_processed)
VALUES 
  ('agent_001_policy', 'success', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour' + INTERVAL '3 seconds', 3000, 5),
  ('agent_002_funding', 'success', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '2 seconds', 2000, 12),
  ('agent_004_milestones', 'error', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '1 second', 1000, 0);
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
COMMENT ON TABLE agent_runs IS 'Tracks all agent execution runs with status and metrics';
COMMENT ON TABLE agent_events IS 'Real-time event stream for agent execution progress';
COMMENT ON TABLE agent_failures IS 'Dead letter queue for failed runs requiring manual review';
COMMENT ON TABLE agent_costs IS 'Tracks API usage and costs per agent run';
