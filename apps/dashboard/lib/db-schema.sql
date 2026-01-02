-- Idempotent Ubuntu Initiative Database Schema
-- Non-destructive: safe to re-run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES (create only if missing)
-- ============================================

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL, -- 'phase_0', 'phase_1', 'phase_2'
  category TEXT NOT NULL, -- 'legal', 'feasibility', 'partnerships', 'funding'
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'blocked'
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner TEXT, -- 'founder', 'agent', 'advisor', specific person
  deadline DATE,
  completed_at TIMESTAMP,
  blockers TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'energy', 'technology', 'financial', 'government', 'research'
  status TEXT NOT NULL DEFAULT 'identified', -- 'identified', 'contacted', 'in_discussion', 'committed', 'signed'
  country TEXT,
  website TEXT,
  description TEXT,
  key_contacts JSONB, -- [{name, role, email, phone}]
  interest_level TEXT, -- 'low', 'medium', 'high'
  next_action TEXT,
  next_action_date DATE,
  notes TEXT[],
  documents UUID[], -- references to documents table
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'legal', 'feasibility', 'financial', 'outreach', 'operational'
  category TEXT, -- more specific: 'mou', 'pitch_deck', 'study', 'model'
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published'
  content_url TEXT, -- link to file storage
  summary TEXT,
  tags TEXT[],
  created_by TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  metadata JSONB, -- flexible field for document-specific data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'milestone', 'partnership', 'document', 'communication', 'research'
  action TEXT NOT NULL, -- 'created', 'updated', 'completed', 'contacted', etc.
  entity_id UUID, -- ID of related milestone, partner, document, etc.
  entity_type TEXT, -- 'milestone', 'partner', 'document'
  title TEXT NOT NULL,
  description TEXT,
  actor TEXT, -- who did it: 'founder', 'agent_research', 'advisor_legal'
  metadata JSONB,
  public BOOLEAN DEFAULT FALSE, -- whether this shows on public site
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT, -- '$', '%', 'count', 'days'
  category TEXT, -- 'partnerships', 'funding', 'progress', 'timeline'
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id),
  type TEXT NOT NULL, -- 'email', 'call', 'meeting', 'letter'
  direction TEXT NOT NULL, -- 'outbound', 'inbound'
  subject TEXT,
  summary TEXT NOT NULL,
  full_content TEXT,
  status TEXT, -- 'draft', 'sent', 'received', 'replied'
  sent_by TEXT,
  sent_at TIMESTAMP,
  response_received BOOLEAN DEFAULT FALSE,
  response_at TIMESTAMP,
  follow_up_needed BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL, -- 'research_intelligence', 'partnership_scout', etc.
  task_type TEXT NOT NULL, -- 'research', 'draft', 'analyze', 'monitor'
  description TEXT NOT NULL,
  status TEXT DEFAULT 'queued', -- 'queued', 'running', 'completed', 'failed'
  priority INTEGER DEFAULT 5,
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'inga', 'drc_politics', 'energy_sector', 'ai_trends', 'competitors'
  summary TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT, -- 'news', 'report', 'academic', 'government', 'social'
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 10),
  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  tags TEXT[],
  full_content TEXT,
  collected_by TEXT, -- which agent collected this
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- VIEWS (safe to replace)
-- ============================================

CREATE OR REPLACE VIEW phase_0_progress AS
SELECT 
  phase,
  category,
  COUNT(*) as total_milestones,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  COUNT(*) FILTER (WHERE status = 'blocked') as blocked,
  ROUND(AVG(progress)) as avg_progress
FROM milestones
WHERE phase = 'phase_0'
GROUP BY phase, category;

CREATE OR REPLACE VIEW partnership_pipeline AS
SELECT 
  category,
  status,
  COUNT(*) as count,
  interest_level,
  COUNT(*) FILTER (WHERE next_action_date < CURRENT_DATE) as overdue_actions
FROM partners
GROUP BY category, status, interest_level;

CREATE OR REPLACE VIEW recent_activities AS
SELECT 
  id,
  type,
  action,
  title,
  description,
  actor,
  public,
  created_at
FROM activities
ORDER BY created_at DESC
LIMIT 100;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Ensure no duplicate triggers, then create
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- If you add triggers for other tables, follow same pattern

-- ============================================
-- INDEXES (create only if missing)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_phase ON milestones(phase);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_public ON activities(public) WHERE public = TRUE;
CREATE INDEX IF NOT EXISTS idx_research_category ON research(category);
CREATE INDEX IF NOT EXISTS idx_research_created_at ON research(created_at DESC);

-- ============================================
-- SEED DATA (idempotent using ON CONFLICT DO NOTHING)
-- Note: explicit IDs included for determinism; if you prefer generated ids, remove the id columns and use WHERE NOT EXISTS checks instead.
-- ============================================

-- Example deterministic UUIDs for seed rows (you can replace these with uuid_generate_v4() if you prefer non-deterministic)
-- If you want the database to generate ids, remove the id column from the insert and use an existence check.

INSERT INTO milestones (id, title, description, phase, category, status, progress, owner)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Incorporate Ubuntu Initiative', 'Legal entity formation with proper governance structure', 'phase_0', 'legal', 'not_started', 0, 'founder'),
  ('00000000-0000-0000-0000-000000000002', 'Trademark Ubuntu Initiative', 'Register trademark and protect brand', 'phase_0', 'legal', 'not_started', 0, 'founder'),
  ('00000000-0000-0000-0000-000000000003', 'Commission feasibility study', 'Independent technical and economic analysis', 'phase_0', 'feasibility', 'not_started', 0, 'founder'),
  ('00000000-0000-0000-0000-000000000004', 'Identify energy partners', 'Research and approach 5-7 hydropower developers', 'phase_0', 'partnerships', 'in_progress', 20, 'agent'),
  ('00000000-0000-0000-0000-000000000005', 'Identify tech partners', 'Research and approach AI/computing companies', 'phase_0', 'partnerships', 'in_progress', 15, 'agent'),
  ('00000000-0000-0000-0000-000000000006', 'Raise Phase 0 funding', 'Secure $500K-2M seed capital', 'phase_0', 'funding', 'not_started', 0, 'founder'),
  ('00000000-0000-0000-0000-000000000007', 'DRC preliminary engagement', 'Initial conversations with Ministry of Energy', 'phase_0', 'partnerships', 'not_started', 0, 'founder')
ON CONFLICT (id) DO NOTHING;

-- Seed research (use deterministic ids)
INSERT INTO research (id, title, category, summary, relevance_score, collected_by)
VALUES
  ('00000000-0000-0000-0000-000000000011', 'Inga Dam Historical Studies', 'inga', 'Collection of all historical Inga development studies and reports', 9, 'agent_research'),
  ('00000000-0000-0000-0000-000000000012', 'DRC Energy Policy Overview', 'drc_politics', 'Current DRC government energy policies and priorities', 8, 'agent_research'),
  ('00000000-0000-0000-0000-000000000013', 'African AI Infrastructure Landscape', 'ai_trends', 'Survey of existing and planned AI infrastructure in Africa', 10, 'agent_research')
ON CONFLICT (id) DO NOTHING;

-- Seed metrics
INSERT INTO metrics (id, metric_name, metric_value, metric_unit, category)
VALUES
  ('00000000-0000-0000-0000-000000000021', 'Phase 0 Progress', 0, '%', 'progress'),
  ('00000000-0000-0000-0000-000000000022', 'Partnerships Identified', 0, 'count', 'partnerships'),
  ('00000000-0000-0000-0000-000000000023', 'Capital Committed', 0, '$', 'funding'),
  ('00000000-0000-0000-0000-000000000024', 'Days Since Launch', 0, 'days', 'timeline')
ON CONFLICT (id) DO NOTHING;
