-- Ubuntu Initiative Agent Network Database Schema
-- Migration: 001_initial_agent_infrastructure
-- Created: 2025-01-05

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================================
-- PUBLIC SCHEMAS - Accessible to public (read-only)
-- ============================================================================

-- Milestone Events (Public progress tracking)
CREATE TABLE public.milestone_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('technical', 'community', 'policy', 'funding')),
    completion_date TIMESTAMP NOT NULL,
    evidence_url TEXT NOT NULL,
    confidence_score NUMERIC(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'verified', 'archived')),
    created_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    approved_by UUID,
    CONSTRAINT valid_confidence CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 1)
);

CREATE INDEX idx_milestone_completion ON public.milestone_events(completion_date DESC);
CREATE INDEX idx_milestone_category ON public.milestone_events(category);
CREATE INDEX idx_milestone_status ON public.milestone_events(status);

-- Policy Events (Public policy tracking)
CREATE TABLE public.policy_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    publication_date DATE NOT NULL,
    summary TEXT,
    impact_category TEXT CHECK (impact_category IN ('energy', 'infrastructure', 'ai_sovereignty', 'governance', 'environment')),
    relevance_score NUMERIC(3,2) CHECK (relevance_score BETWEEN 0 AND 1),
    created_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    approved_by UUID
);

CREATE INDEX idx_policy_date ON public.policy_events(publication_date DESC);
CREATE INDEX idx_policy_category ON public.policy_events(impact_category);
CREATE INDEX idx_policy_relevance ON public.policy_events(relevance_score DESC);

-- Donation Aggregates (Anonymized public stats)
CREATE TABLE public.donation_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    daily_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    donor_count INTEGER NOT NULL DEFAULT 0,
    milestone_progress NUMERIC(5,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donation_date ON public.donation_aggregates(date DESC);

-- Knowledge Base (For Inga GPT chatbot)
CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
    last_verified TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kb_category ON public.knowledge_base(category);
CREATE INDEX idx_kb_verified ON public.knowledge_base(last_verified DESC);

-- Research Papers (Curated academic research)
CREATE TABLE public.research_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[],
    abstract TEXT,
    publication_date DATE,
    source_url TEXT NOT NULL,
    relevance_score NUMERIC(3,2) CHECK (relevance_score BETWEEN 0 AND 1),
    themes TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_date ON public.research_papers(publication_date DESC);
CREATE INDEX idx_research_relevance ON public.research_papers(relevance_score DESC);

-- ============================================================================
-- PRIVATE SCHEMAS - Internal use only
-- ============================================================================

-- Create private schema
CREATE SCHEMA IF NOT EXISTS private;

-- Donations (Full records with PII)
CREATE TABLE private.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_payment_id TEXT UNIQUE,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    donor_email TEXT,
    donor_name TEXT,
    message TEXT,
    fraud_check_status TEXT DEFAULT 'pending' CHECK (fraud_check_status IN ('pending', 'approved', 'flagged')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donation_stripe ON private.donations(stripe_payment_id);
CREATE INDEX idx_donation_fraud ON private.donations(fraud_check_status);
CREATE INDEX idx_donation_created ON private.donations(created_at DESC);

-- Agent Audit Log (Complete audit trail)
CREATE TABLE private.agent_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    confidence_score NUMERIC(3,2),
    human_review_status TEXT DEFAULT 'not_required' CHECK (human_review_status IN ('not_required', 'pending', 'approved', 'rejected')),
    reviewed_by UUID,
    reasoning TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_agent ON private.agent_audit_log(agent_id, timestamp DESC);
CREATE INDEX idx_audit_review ON private.agent_audit_log(human_review_status);

-- Approval Queue (Items awaiting human review)
CREATE TABLE private.approval_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type TEXT NOT NULL CHECK (item_type IN ('policy', 'milestone', 'narrative', 'grant', 'insight')),
    item_id UUID NOT NULL,
    agent_recommendation JSONB,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    review_notes TEXT
);

CREATE INDEX idx_queue_status ON private.approval_queue(status, priority);
CREATE INDEX idx_queue_assigned ON private.approval_queue(assigned_to);

-- Chat Logs (Inga GPT conversations)
CREATE TABLE private.chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    user_query TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    confidence_score NUMERIC(3,2),
    sources_cited JSONB DEFAULT '[]'::jsonb,
    feedback TEXT CHECK (feedback IN ('positive', 'negative', 'none')),
    escalated BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON private.chat_logs(session_id, timestamp);
CREATE INDEX idx_chat_escalated ON private.chat_logs(escalated);

-- Community Signals (Aggregated sentiment data)
CREATE TABLE private.community_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    content_hash TEXT,
    sentiment NUMERIC(3,2) CHECK (sentiment BETWEEN -1 AND 1),
    category TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_signal_source ON private.community_signals(source, timestamp DESC);
CREATE INDEX idx_signal_sentiment ON private.community_signals(sentiment);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.milestone_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

ALTER TABLE private.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.agent_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.community_signals ENABLE ROW LEVEL SECURITY;

-- Public tables: Anyone can read
CREATE POLICY "Public read access" ON public.milestone_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.policy_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.donation_aggregates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.knowledge_base FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.research_papers FOR SELECT USING (true);

-- Private tables: No public access (will be controlled by service roles)
CREATE POLICY "No public access" ON private.donations FOR ALL USING (false);
CREATE POLICY "No public access" ON private.agent_audit_log FOR ALL USING (false);
CREATE POLICY "No public access" ON private.approval_queue FOR ALL USING (false);
CREATE POLICY "No public access" ON private.chat_logs FOR ALL USING (false);
CREATE POLICY "No public access" ON private.community_signals FOR ALL USING (false);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update donation aggregates
CREATE OR REPLACE FUNCTION update_donation_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.donation_aggregates (date, daily_total, donor_count, updated_at)
    VALUES (
        CURRENT_DATE,
        NEW.amount,
        1,
        NOW()
    )
    ON CONFLICT (date) DO UPDATE SET
        daily_total = donation_aggregates.daily_total + EXCLUDED.daily_total,
        donor_count = donation_aggregates.donor_count + EXCLUDED.donor_count,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on donations
CREATE TRIGGER trg_update_donation_aggregates
AFTER INSERT ON private.donations
FOR EACH ROW
WHEN (NEW.fraud_check_status = 'approved')
EXECUTE FUNCTION update_donation_aggregates();
