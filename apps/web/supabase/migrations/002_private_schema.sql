-- Ubuntu Initiative Agent Network (UIAN) Database Schema
-- Migration 002: Private Schemas and Agent Infrastructure

-- =====================================================
-- PRIVATE SCHEMAS (Restricted Access)
-- =====================================================

-- Donations (Full Records with PII)
CREATE TABLE private.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_payment_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    donor_email TEXT,
    donor_name TEXT,
    message TEXT,
    fraud_check_status TEXT DEFAULT 'pending' CHECK (fraud_check_status IN ('pending', 'approved', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_donations_stripe_id ON private.donations(stripe_payment_id);
CREATE INDEX idx_donations_date ON private.donations(created_at DESC);

-- Stakeholder Profiles (Due Diligence)
CREATE TABLE private.stakeholder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name TEXT NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('individual', 'corporation', 'ngo', 'government')),
    risk_score NUMERIC(3,2) CHECK (risk_score >= 0 AND risk_score <= 1),
    opportunity_score NUMERIC(3,2) CHECK (opportunity_score >= 0 AND opportunity_score <= 1),
    risk_flags JSONB DEFAULT '[]'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stakeholder_risk ON private.stakeholder_profiles(risk_score DESC);

-- Agent Audit Log (Complete Trail of All Agent Actions)
CREATE TABLE private.agent_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    confidence_score NUMERIC(3,2),
    human_review_status TEXT DEFAULT 'not_required' CHECK (human_review_status IN ('not_required', 'pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES auth.users(id),
    reasoning TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_agent_id ON private.agent_audit_log(agent_id);
CREATE INDEX idx_audit_timestamp ON private.agent_audit_log(timestamp DESC);
CREATE INDEX idx_audit_review_status ON private.agent_audit_log(human_review_status);

-- Approval Queue (Items Awaiting Human Review)
CREATE TABLE private.approval_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type TEXT NOT NULL CHECK (item_type IN ('policy', 'milestone', 'narrative', 'grant', 'insight')),
    item_id UUID NOT NULL,
    agent_recommendation JSONB,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_approval_status ON private.approval_queue(status);
CREATE INDEX idx_approval_priority ON private.approval_queue(priority);
CREATE INDEX idx_approval_assigned ON private.approval_queue(assigned_to);

-- Chat Logs (Full Conversation History from Inga GPT)
CREATE TABLE private.chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    user_query TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    confidence_score NUMERIC(3,2),
    sources_cited JSONB DEFAULT '[]'::jsonb,
    feedback TEXT CHECK (feedback IN ('positive', 'negative', 'none')),
    escalated BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON private.chat_logs(session_id);
CREATE INDEX idx_chat_timestamp ON private.chat_logs(timestamp DESC);
CREATE INDEX idx_chat_escalated ON private.chat_logs(escalated);

-- Community Signals (Aggregated Sentiment Data)
CREATE TABLE private.community_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    content TEXT NOT NULL,
    sentiment NUMERIC(3,2) CHECK (sentiment >= -1 AND sentiment <= 1),
    category TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_signal_timestamp ON private.community_signals(timestamp DESC);
CREATE INDEX idx_signal_sentiment ON private.community_signals(sentiment);

-- Engagement Metrics
CREATE TABLE private.engagement_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    metric_type TEXT NOT NULL,
    value NUMERIC,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metrics_date ON private.engagement_metrics(date DESC);
CREATE INDEX idx_metrics_platform ON private.engagement_metrics(platform);

-- =====================================================
-- ROW LEVEL SECURITY (Private Tables)
-- =====================================================

ALTER TABLE private.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.stakeholder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.agent_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.community_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.engagement_metrics ENABLE ROW LEVEL SECURITY;

-- No public access to private tables (policies set by role)
-- These will be managed through service role keys and specific user roles
