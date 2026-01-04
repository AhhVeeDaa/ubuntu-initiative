-- Ubuntu Initiative Agent Network (UIAN) Database Schema
-- Migration 001: Core Public Tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =====================================================
-- PUBLIC SCHEMAS (Read-only for public via PostgREST)
-- =====================================================

-- Milestone Events (Public Progress Tracking)
CREATE TABLE public.milestone_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('technical', 'community', 'policy', 'funding')),
    completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
    evidence_url TEXT NOT NULL,
    confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'verified', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_milestone_completion_date ON public.milestone_events(completion_date DESC);
CREATE INDEX idx_milestone_category ON public.milestone_events(category);
CREATE INDEX idx_milestone_status ON public.milestone_events(status);

-- Policy Events (Tracked Policy Changes)
CREATE TABLE public.policy_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    publication_date DATE NOT NULL,
    summary TEXT,
    impact_category TEXT CHECK (impact_category IN ('energy', 'infrastructure', 'ai_sovereignty', 'governance', 'environment')),
    relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_policy_publication_date ON public.policy_events(publication_date DESC);
CREATE INDEX idx_policy_category ON public.policy_events(impact_category);
CREATE INDEX idx_policy_relevance ON public.policy_events(relevance_score DESC);

-- Donation Aggregates (Anonymized Public Stats)
CREATE TABLE public.donation_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    daily_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    donor_count INTEGER NOT NULL DEFAULT 0,
    milestone_progress NUMERIC(5,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_donation_date ON public.donation_aggregates(date DESC);

-- Knowledge Base (For Inga GPT)
CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    last_verified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_verified ON public.knowledge_base(last_verified DESC);

-- Research Papers (Curated Publications)
CREATE TABLE public.research_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[],
    abstract TEXT,
    publication_date DATE,
    source_url TEXT NOT NULL,
    relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    themes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_research_publication_date ON public.research_papers(publication_date DESC);
CREATE INDEX idx_research_relevance ON public.research_papers(relevance_score DESC);

-- Grant Opportunities (Publicly Visible Grants)
CREATE TABLE public.grant_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    funder TEXT NOT NULL,
    deadline DATE,
    amount_min NUMERIC(12,2),
    amount_max NUMERIC(12,2),
    eligibility_description TEXT,
    eligibility_match_score NUMERIC(3,2) CHECK (eligibility_match_score >= 0 AND eligibility_match_score <= 1),
    url TEXT NOT NULL,
    public_visible BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_grant_deadline ON public.grant_opportunities(deadline);
CREATE INDEX idx_grant_match_score ON public.grant_opportunities(eligibility_match_score DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES (Public Tables)
-- =====================================================

ALTER TABLE public.milestone_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grant_opportunities ENABLE ROW LEVEL SECURITY;

-- Public read access to all public tables
CREATE POLICY "Public can view milestone events" ON public.milestone_events FOR SELECT USING (true);
CREATE POLICY "Public can view policy events" ON public.policy_events FOR SELECT USING (approval_status = 'approved');
CREATE POLICY "Public can view donation aggregates" ON public.donation_aggregates FOR SELECT USING (true);
CREATE POLICY "Public can view knowledge base" ON public.knowledge_base FOR SELECT USING (true);
CREATE POLICY "Public can view research papers" ON public.research_papers FOR SELECT USING (true);
CREATE POLICY "Public can view public grants" ON public.grant_opportunities FOR SELECT USING (public_visible = true);

-- Authenticated users can insert milestone proposals (they go to approval queue)
CREATE POLICY "Authenticated can propose milestones" ON public.milestone_events FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_milestone_updated_at BEFORE UPDATE ON public.milestone_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_aggregates_updated_at BEFORE UPDATE ON public.donation_aggregates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
