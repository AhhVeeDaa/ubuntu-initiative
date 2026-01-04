-- Ubuntu Initiative Agent System - Database Schema
-- Version: 1.0.0
-- Description: Complete schema for AI agent operations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- AGENT LOGS TABLE
-- Comprehensive audit trail of all agent actions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    action TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    decision JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_id ON public.agent_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON public.agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_action ON public.agent_logs(action);

-- ============================================================================
-- KNOWLEDGE BASE TABLE
-- Stores Q&A pairs for Inga GPT chatbot
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    sources TEXT[] DEFAULT '{}',
    confidence DECIMAL(3,2) DEFAULT 0.90,
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_last_verified ON public.knowledge_base(last_verified DESC);

-- ============================================================================
-- CHAT LOGS TABLE
-- Tracks all chatbot interactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_query TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    confidence_score DECIMAL(3,2),
    sources_cited TEXT[] DEFAULT '{}',
    escalated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON public.chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at DESC);

-- ============================================================================
-- REVIEW QUEUE TABLE
-- Items requiring human review
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.review_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type TEXT NOT NULL,
    item_id UUID NOT NULL,
    context JSONB NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_queue_status ON public.review_queue(status);
CREATE INDEX IF NOT EXISTS idx_review_queue_priority ON public.review_queue(priority, created_at);

-- ============================================================================
-- POLICY CHANGES TABLE
-- Tracks regulatory and policy updates
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.policy_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    impact_level TEXT NOT NULL DEFAULT 'medium',
    effective_date DATE,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_changes_category ON public.policy_changes(category);
CREATE INDEX IF NOT EXISTS idx_policy_changes_impact ON public.policy_changes(impact_level);

-- ============================================================================
-- COMMUNITY SIGNALS TABLE
-- Social media posts and community feedback
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.community_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    author TEXT,
    sentiment TEXT,
    signal_type TEXT,
    content_hash TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_signals_sentiment ON public.community_signals(sentiment);
CREATE INDEX IF NOT EXISTS idx_community_signals_type ON public.community_signals(signal_type);

-- ============================================================================
-- RESEARCH PAPERS TABLE
-- Academic research findings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[] DEFAULT '{}',
    abstract TEXT,
    source_url TEXT,
    publication_date DATE,
    relevance_score DECIMAL(3,2),
    themes TEXT[] DEFAULT '{}',
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_papers_relevance ON public.research_papers(relevance_score DESC);

-- ============================================================================
-- STAKEHOLDER PROFILES TABLE (PRIVATE SCHEMA)
-- Sensitive due diligence information
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.stakeholder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    risk_score DECIMAL(3,2) NOT NULL,
    opportunity_score DECIMAL(3,2),
    risk_flags JSONB DEFAULT '[]',
    sources JSONB,
    recommendation TEXT,
    last_reviewed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stakeholder_profiles_risk ON private.stakeholder_profiles(risk_score DESC);

-- ============================================================================
-- FUNDING OPPORTUNITIES TABLE
-- Grant and funding prospects
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.funding_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    amount_min DECIMAL(12,2),
    amount_max DECIMAL(12,2),
    deadline DATE,
    eligibility_match DECIMAL(3,2),
    requirements TEXT,
    application_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funding_opportunities_deadline ON public.funding_opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_funding_opportunities_status ON public.funding_opportunities(status);

-- ============================================================================
-- MILESTONES TABLE
-- Project progress tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    completion_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    dependencies TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_milestones_phase ON public.milestones(phase);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.milestones(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.stakeholder_profiles ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access" ON public.agent_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.knowledge_base FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.chat_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.review_queue FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.policy_changes FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.community_signals FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.research_papers FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.funding_opportunities FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON public.milestones FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON private.stakeholder_profiles FOR ALL TO service_role USING (true);

-- Public read access for appropriate tables
CREATE POLICY "Public read" ON public.knowledge_base FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read" ON public.policy_changes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read" ON public.milestones FOR SELECT TO anon, authenticated USING (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_opportunities_updated_at BEFORE UPDATE ON public.funding_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

INSERT INTO public.knowledge_base (question, answer, category, sources, confidence) VALUES
('What is the Ubuntu Initiative?', 'The Ubuntu Initiative is a transparent public infrastructure project building Africa''s first sovereign AI supercomputer powered by Inga hydropower in the Democratic Republic of Congo.', 'about', ARRAY['https://ubuntu-initiative.org'], 1.0),
('What is Inga Dam?', 'Inga Dam is a hydroelectric facility on the Congo River in the DRC with potential capacity of 40,000+ MW, making it one of the world''s largest renewable energy sources.', 'technical', ARRAY['World Bank', 'IEA'], 0.95),
('What is Phase 0?', 'Phase 0 is the current foundational phase focused on community engagement, feasibility studies, and establishing transparent governance structures.', 'project', ARRAY['Project Documentation'], 1.0)
ON CONFLICT DO NOTHING;

INSERT INTO public.milestones (phase, name, description, target_date, status) VALUES
('Phase 0', 'Community Engagement Launch', 'Establish community feedback channels and initial outreach', '2025-03-01', 'completed'),
('Phase 0', 'Feasibility Study Completion', 'Complete technical and financial feasibility analysis', '2025-06-30', 'in_progress'),
('Phase 0', 'Governance Framework', 'Establish transparent decision-making structures', '2025-09-30', 'pending'),
('Phase 0', 'Initial Funding Secured', 'Secure seed funding for Phase 1 planning', '2025-12-31', 'pending')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEMA VERSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.schema_version (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

INSERT INTO public.schema_version (version, description) VALUES
('1.0.0', 'Initial schema for Ubuntu Initiative Agent System')
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- COMPLETION
-- ============================================================================

SELECT 'Ubuntu Initiative Agent System Schema v1.0.0 - Installation Complete!' as message;
