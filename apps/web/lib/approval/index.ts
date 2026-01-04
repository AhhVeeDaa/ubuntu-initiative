// Ubuntu Initiative - Approval Workflow Functions
// Server-side functions for approving/rejecting policy updates

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function approvePolicyUpdate(
  approvalQueueId: string,
  policyUpdateId: string,
  userId: string,
  notes?: string
) {
  const now = new Date().toISOString();
  
  try {
    // Update policy_updates
    const { error: updateError } = await supabase
      .from('policy_updates')
      .update({
        status: 'approved',
        approved_at: now,
        approved_by: userId
      })
      .eq('id', policyUpdateId);
    
    if (updateError) throw updateError;
    
    // Update approval_queue
    const { error: queueError } = await supabase
      .from('approval_queue')
      .update({
        status: 'approved',
        reviewed_at: now,
        review_notes: notes || null
      })
      .eq('id', approvalQueueId);
    
    if (queueError) throw queueError;
    
    // Log to audit trail
    await supabase
      .from('agent_audit_log')
      .insert({
        agent_id: 'agent_001_policy_monitor',
        action_type: 'human_approval',
        action_description: `Policy update approved by ${userId}`,
        output_data: { policy_update_id: policyUpdateId },
        reasoning: notes || null,
        timestamp: now
      });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Approval error:', error);
    return { success: false, error: error.message };
  }
}

export async function rejectPolicyUpdate(
  approvalQueueId: string,
  policyUpdateId: string,
  userId: string,
  reason: string
) {
  const now = new Date().toISOString();
  
  try {
    // Update policy_updates
    const { error: updateError } = await supabase
      .from('policy_updates')
      .update({
        status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', policyUpdateId);
    
    if (updateError) throw updateError;
    
    // Update approval_queue
    const { error: queueError } = await supabase
      .from('approval_queue')
      .update({
        status: 'rejected',
        reviewed_at: now,
        review_notes: reason
      })
      .eq('id', approvalQueueId);
    
    if (queueError) throw queueError;
    
    // Log to audit trail
    await supabase
      .from('agent_audit_log')
      .insert({
        agent_id: 'agent_001_policy_monitor',
        action_type: 'human_rejection',
        action_description: `Policy update rejected by ${userId}`,
        output_data: { policy_update_id: policyUpdateId },
        reasoning: reason,
        timestamp: now
      });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Rejection error:', error);
    return { success: false, error: error.message };
  }
}
