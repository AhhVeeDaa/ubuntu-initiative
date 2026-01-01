-- Ubuntu Initiative Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Milestones: Track Phase 0 progress
CREATE TABLE milestones (
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

-- Partners: Track partnership pipeline
CREATE TABLE partners (
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

-- Documents: Central document library
CREATE TABLE documents (
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

-- Activities: Log of all activities and updates
CREATE TABLE activities (
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

-- Metrics: Track key performance indicators
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT, -- '$', '%', 'count', 'days'
  category TEXT, -- 'partnerships', 'funding', 'progress', 'timeline'
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Communications: Track outreach and correspondence
CREATE TABLE communications (
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

-- Agent Tasks: Track what agents are working on
CREATE TABLE agent_tasks (
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

-- Research: Intelligence gathered by agents
CREATE TABLE research (
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
-- VIEWS FOR DASHBOARD
-- ============================================

-- Phase 0 Progress Overview
CREATE VIEW phase_0_progress AS
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

-- Partnership Pipeline Summary
CREATE VIEW partnership_pipeline AS
SELECT 
  category,
  status,
  COUNT(*) as count,
  interest_level,
  COUNT(*) FILTER (WHERE next_action_date < CURRENT_DATE) as overdue_actions
FROM partners
GROUP BY category, status, interest_level;

-- Recent Activity Feed
CREATE VIEW recent_activities AS
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
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_phase ON milestones(phase);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_category ON partners(category);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_public ON activities(public) WHERE public = TRUE;
CREATE INDEX idx_research_category ON research(category);
CREATE INDEX idx_research_created_at ON research(created_at DESC);

-- ============================================
-- SEED DATA
-- ============================================

-- Initial Phase 0 Milestones
INSERT INTO milestones (title, description, phase, category, status, progress, owner) VALUES
('Incorporate Ubuntu Initiative', 'Legal entity formation with proper governance structure', 'phase_0', 'legal', 'not_started', 0, 'founder'),
('Trademark Ubuntu Initiative', 'Register trademark and protect brand', 'phase_0', 'legal', 'not_started', 0, 'founder'),
('Commission feasibility study', 'Independent technical and economic analysis', 'phase_0', 'feasibility', 'not_started', 0, 'founder'),
('Identify energy partners', 'Research and approach 5-7 hydropower developers', 'phase_0', 'partnerships', 'in_progress', 20, 'agent'),
('Identify tech partners', 'Research and approach AI/computing companies', 'phase_0', 'partnerships', 'in_progress', 15, 'agent'),
('Raise Phase 0 funding', 'Secure $500K-2M seed capital', 'phase_0', 'funding', 'not_started', 0, 'founder'),
('DRC preliminary engagement', 'Initial conversations with Ministry of Energy', 'phase_0', 'partnerships', 'not_started', 0, 'founder');

-- Add initial research categories for monitoring
INSERT INTO research (title, category, summary, relevance_score, collected_by) VALUES
('Inga Dam Historical Studies', 'inga', 'Collection of all historical Inga development studies and reports', 9, 'agent_research'),
('DRC Energy Policy Overview', 'drc_politics', 'Current DRC government energy policies and priorities', 8, 'agent_research'),
('African AI Infrastructure Landscape', 'ai_trends', 'Survey of existing and planned AI infrastructure in Africa', 10, 'agent_research');

-- Initial metrics
INSERT INTO metrics (metric_name, metric_value, metric_unit, category) VALUES
('Phase 0 Progress', 0, '%', 'progress'),
('Partnerships Identified', 0, 'count', 'partnerships'),
('Capital Committed', 0, '$', 'funding'),
('Days Since Launch', 0, 'days', 'timeline');
