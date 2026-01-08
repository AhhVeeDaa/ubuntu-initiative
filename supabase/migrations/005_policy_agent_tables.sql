-- ============================================================================
-- POLICY AGENT TABLES
-- Stores policy updates, analyses, and monitoring data
-- ============================================================================

-- Policy Updates Table
CREATE TABLE IF NOT EXISTS policy_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source VARCHAR(200) NOT NULL,
  published_date TIMESTAMPTZ NOT NULL,
  summary TEXT NOT NULL,
  relevance_score DECIMAL(3, 2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  impact_level VARCHAR(20) CHECK (impact_level IN ('low', 'medium', 'high')),
  url TEXT NOT NULL,
  full_text TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Policy Analyses Table
CREATE TABLE IF NOT EXISTS policy_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_url TEXT NOT NULL,
  analysis TEXT NOT NULL,
  relevance_score DECIMAL(3, 2),
  impact_level VARCHAR(20) CHECK (impact_level IN ('low', 'medium', 'high')),
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_policy_updates_published ON policy_updates(published_date DESC);
CREATE INDEX idx_policy_updates_impact ON policy_updates(impact_level, reviewed);
CREATE INDEX idx_policy_updates_source ON policy_updates(source);
CREATE INDEX idx_policy_analyses_analyzed ON policy_analyses(analyzed_at DESC);

-- RLS Policies
ALTER TABLE policy_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Policy updates viewable by everyone"
  ON policy_updates FOR SELECT
  USING (reviewed = true);

CREATE POLICY "Service role can manage policy updates"
  ON policy_updates FOR ALL
  USING (true);

CREATE POLICY "Policy analyses viewable by everyone"
  ON policy_analyses FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage policy analyses"
  ON policy_analyses FOR ALL
  USING (true);

-- Comments
COMMENT ON TABLE policy_updates IS 'Policy updates discovered by the Policy Monitor Agent';
COMMENT ON TABLE policy_analyses IS 'AI-powered analyses of policy documents';
