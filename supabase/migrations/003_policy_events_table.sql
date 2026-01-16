-- Create policy_events table for tracking DRC policy changes
CREATE TABLE IF NOT EXISTS public.policy_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT,
    summary TEXT,
    category TEXT NOT NULL,
    impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_policy_events_status ON public.policy_events(status);
CREATE INDEX IF NOT EXISTS idx_policy_events_category ON public.policy_events(category);
CREATE INDEX IF NOT EXISTS idx_policy_events_detected_at ON public.policy_events(detected_at DESC);

-- Enable RLS
ALTER TABLE public.policy_events ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read verified policies
CREATE POLICY "Public can view verified policy events"
    ON public.policy_events
    FOR SELECT
    USING (status = 'verified');

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access to policy events"
    ON public.policy_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policy_events_updated_at
    BEFORE UPDATE ON public.policy_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.policy_events TO anon;
GRANT ALL ON public.policy_events TO authenticated;
GRANT ALL ON public.policy_events TO service_role;
