-- Migration: Add public.community_signals and public.insight_summaries tables
-- Required by the weekly-insights automation (packages/agents/src/automations/weekly-insights.js)
-- and the CommunityAgent (packages/agents/src/agents/community-agent.js)

-- ============================================================================
-- COMMUNITY SIGNALS TABLE
-- Stores aggregated, anonymized community sentiment signals
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.community_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    content_hash TEXT UNIQUE,
    sentiment NUMERIC(3,2) CHECK (sentiment BETWEEN -1 AND 1),
    category TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_signals_timestamp ON public.community_signals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_community_signals_sentiment ON public.community_signals(sentiment);
CREATE INDEX IF NOT EXISTS idx_community_signals_category ON public.community_signals(category);

ALTER TABLE public.community_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.community_signals FOR ALL TO service_role USING (true);

-- ============================================================================
-- INSIGHT SUMMARIES TABLE
-- Stores weekly AI-generated community insights reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.insight_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trend TEXT,
    evidence JSONB,
    confidence NUMERIC(3,2),
    recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insight_summaries_created_at ON public.insight_summaries(created_at DESC);

ALTER TABLE public.insight_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.insight_summaries FOR ALL TO service_role USING (true);
