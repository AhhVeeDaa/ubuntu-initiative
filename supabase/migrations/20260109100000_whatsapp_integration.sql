-- ============================================
-- WHATSAPP INTEGRATION SCHEMA
-- UbuntuHub Phase 0
-- ============================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. WHATSAPP RECIPIENTS
-- Allowlisted phone numbers with roles
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Phone stored as hash only (SHA-256 with salt)
  phone_hash TEXT UNIQUE NOT NULL,
  
  -- Role determines permissions
  role TEXT NOT NULL CHECK (role IN ('reviewer', 'observer', 'admin')),
  
  -- Link to auth user
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Display name for audit logs
  display_name TEXT,
  
  -- Active status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup during webhook processing
CREATE INDEX idx_whatsapp_recipients_phone_hash ON public.whatsapp_recipients(phone_hash);
CREATE INDEX idx_whatsapp_recipients_active ON public.whatsapp_recipients(active) WHERE active = true;

-- RLS
ALTER TABLE public.whatsapp_recipients ENABLE ROW LEVEL SECURITY;

-- Only admins can view/modify recipients
CREATE POLICY "Admins can manage whatsapp recipients" ON public.whatsapp_recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- 2. WHATSAPP NOTIFICATIONS
-- Outbound message tracking
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Correlation to source events
  agent_run_id UUID REFERENCES public.agent_runs(id),
  queue_item_id UUID,
  policy_update_id UUID REFERENCES public.policy_updates(id),
  
  -- Message details
  template_name TEXT NOT NULL,
  template_params JSONB DEFAULT '{}',
  recipient_hash TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  
  -- Meta message tracking
  meta_message_id TEXT,
  
  -- Status lifecycle: pending -> sent -> delivered -> read
  -- Or: pending -> failed
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'delivered', 'read', 'failed')
  ),
  
  -- Error details if failed
  error_code TEXT,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ
);

-- Indexes for status tracking and correlation
CREATE INDEX idx_whatsapp_notifications_status ON public.whatsapp_notifications(status);
CREATE INDEX idx_whatsapp_notifications_agent_run ON public.whatsapp_notifications(agent_run_id);
CREATE INDEX idx_whatsapp_notifications_queue ON public.whatsapp_notifications(queue_item_id);
CREATE INDEX idx_whatsapp_notifications_created ON public.whatsapp_notifications(created_at DESC);

-- RLS
ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Admins and reviewers can view notifications
CREATE POLICY "Authorized users can view notifications" ON public.whatsapp_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'reviewer')
    )
  );

-- ============================================
-- 3. WHATSAPP INTERACTIONS
-- Inbound message and action tracking
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to the notification this is responding to
  notification_id UUID REFERENCES public.whatsapp_notifications(id),
  
  -- Link to queue item if this is an approval action
  queue_item_id UUID,
  
  -- Sender identification (hashed)
  sender_hash TEXT NOT NULL,
  
  -- Command parsed from message
  command TEXT NOT NULL,
  
  -- Raw message (sanitized, no PII)
  raw_message_sanitized TEXT,
  
  -- Action outcome
  action_taken TEXT CHECK (
    action_taken IN ('approve', 'reject', 'details', 'status', 'invalid', 'unauthorized')
  ),
  outcome TEXT CHECK (
    outcome IN ('success', 'error', 'unauthorized', 'rate_limited', 'invalid_command')
  ),
  error_message TEXT,
  
  -- State change tracking for audit
  previous_state JSONB,
  new_state JSONB,
  
  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_whatsapp_interactions_sender ON public.whatsapp_interactions(sender_hash);
CREATE INDEX idx_whatsapp_interactions_queue ON public.whatsapp_interactions(queue_item_id);
CREATE INDEX idx_whatsapp_interactions_received ON public.whatsapp_interactions(received_at DESC);

-- RLS
ALTER TABLE public.whatsapp_interactions ENABLE ROW LEVEL SECURITY;

-- Admins can view all interactions
CREATE POLICY "Admins can view interactions" ON public.whatsapp_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- 4. WHATSAPP NONCES
-- Replay protection for actionable messages
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_nonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Single-use token
  nonce TEXT UNIQUE NOT NULL,
  
  -- Link to queue item this nonce authorizes action on
  queue_id UUID NOT NULL,
  
  -- Expiration (24 hours from creation)
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- When used (null if unused)
  used_at TIMESTAMPTZ,
  
  -- Link to interaction that used this nonce
  used_by_interaction_id UUID REFERENCES public.whatsapp_interactions(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast nonce lookup
CREATE INDEX idx_whatsapp_nonces_nonce ON public.whatsapp_nonces(nonce);
CREATE INDEX idx_whatsapp_nonces_expires ON public.whatsapp_nonces(expires_at);

-- RLS
ALTER TABLE public.whatsapp_nonces ENABLE ROW LEVEL SECURITY;

-- Service role only for nonces
CREATE POLICY "Service role can manage nonces" ON public.whatsapp_nonces
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 5. WHATSAPP RATE LIMITS
-- Track rate limit windows per recipient
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient identification
  recipient_hash TEXT NOT NULL,
  
  -- Direction: inbound or outbound
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  
  -- Window start (hourly windows)
  window_start TIMESTAMPTZ NOT NULL,
  
  -- Count in this window
  count INTEGER DEFAULT 0,
  
  -- Unique constraint per recipient/direction/window
  UNIQUE(recipient_hash, direction, window_start)
);

-- Index for fast lookups
CREATE INDEX idx_whatsapp_rate_limits_lookup 
  ON public.whatsapp_rate_limits(recipient_hash, direction, window_start);

-- RLS
ALTER TABLE public.whatsapp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "Service role can manage rate limits" ON public.whatsapp_rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. MODIFY APPROVAL_QUEUE
-- Add source attribution column
-- ============================================

-- Add source column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'approval_queue' AND column_name = 'source'
  ) THEN
    ALTER TABLE public.approval_queue 
    ADD COLUMN source TEXT DEFAULT 'dashboard' 
    CHECK (source IN ('dashboard', 'whatsapp', 'api'));
  END IF;
END $$;

-- ============================================
-- 7. FUNCTION: Check Rate Limit
-- ============================================

CREATE OR REPLACE FUNCTION public.check_whatsapp_rate_limit(
  p_recipient_hash TEXT,
  p_direction TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
BEGIN
  -- Calculate current hour window
  v_window_start := date_trunc('hour', NOW());
  
  -- Get or create rate limit record
  INSERT INTO public.whatsapp_rate_limits (recipient_hash, direction, window_start, count)
  VALUES (p_recipient_hash, p_direction, v_window_start, 0)
  ON CONFLICT (recipient_hash, direction, window_start) DO NOTHING;
  
  -- Get current count
  SELECT count INTO v_current_count
  FROM public.whatsapp_rate_limits
  WHERE recipient_hash = p_recipient_hash
    AND direction = p_direction
    AND window_start = v_window_start;
  
  -- Check limit
  RETURN v_current_count < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. FUNCTION: Increment Rate Limit
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_whatsapp_rate_limit(
  p_recipient_hash TEXT,
  p_direction TEXT
) RETURNS VOID AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := date_trunc('hour', NOW());
  
  UPDATE public.whatsapp_rate_limits
  SET count = count + 1
  WHERE recipient_hash = p_recipient_hash
    AND direction = p_direction
    AND window_start = v_window_start;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. FUNCTION: Validate Nonce
-- ============================================

CREATE OR REPLACE FUNCTION public.validate_whatsapp_nonce(
  p_nonce TEXT
) RETURNS TABLE (
  valid BOOLEAN,
  queue_id UUID,
  error_message TEXT
) AS $$
DECLARE
  v_record RECORD;
BEGIN
  -- Look up nonce
  SELECT * INTO v_record
  FROM public.whatsapp_nonces
  WHERE nonce = p_nonce;
  
  -- Check if exists
  IF v_record IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'Nonce not found';
    RETURN;
  END IF;
  
  -- Check if already used
  IF v_record.used_at IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'Nonce already used';
    RETURN;
  END IF;
  
  -- Check if expired
  IF NOW() > v_record.expires_at THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'Nonce expired';
    RETURN;
  END IF;
  
  -- Valid
  RETURN QUERY SELECT TRUE, v_record.queue_id, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. CLEANUP JOB
-- Remove expired nonces and old rate limit records
-- ============================================

CREATE OR REPLACE FUNCTION public.cleanup_whatsapp_data() RETURNS VOID AS $$
BEGIN
  -- Delete expired and used nonces older than 7 days
  DELETE FROM public.whatsapp_nonces
  WHERE (expires_at < NOW() - INTERVAL '7 days')
     OR (used_at IS NOT NULL AND used_at < NOW() - INTERVAL '7 days');
  
  -- Delete old rate limit windows (older than 48 hours)
  DELETE FROM public.whatsapp_rate_limits
  WHERE window_start < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage to authenticated users (RLS will handle access)
GRANT SELECT ON public.whatsapp_notifications TO authenticated;
GRANT SELECT ON public.whatsapp_interactions TO authenticated;
GRANT SELECT ON public.whatsapp_recipients TO authenticated;

-- Service role has full access
GRANT ALL ON public.whatsapp_notifications TO service_role;
GRANT ALL ON public.whatsapp_interactions TO service_role;
GRANT ALL ON public.whatsapp_recipients TO service_role;
GRANT ALL ON public.whatsapp_nonces TO service_role;
GRANT ALL ON public.whatsapp_rate_limits TO service_role;

-- Function execution
GRANT EXECUTE ON FUNCTION public.check_whatsapp_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_whatsapp_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_whatsapp_nonce TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_whatsapp_data TO service_role;

-- ============================================
-- END OF MIGRATION
-- ============================================
