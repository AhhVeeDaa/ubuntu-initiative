/**
 * Approval Queue API
 * GET /api/agents/approvals - List pending approvals
 * POST /api/agents/approvals - Approve or reject items
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET - List approvals with filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const priority = searchParams.get('priority');
    const agentId = searchParams.get('agentId');

    let query = supabase
      .from('approval_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (agentId) query = query.eq('agent_id', agentId);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Approvals] Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch approvals' },
        { status: 500 }
      );
    }

    // Get counts for each status
    const { data: counts } = await supabase
      .from('approval_queue')
      .select('status', { count: 'exact', head: false });

    const statusCounts = {
      pending: counts?.filter(c => c.status === 'pending').length || 0,
      approved: counts?.filter(c => c.status === 'approved').length || 0,
      rejected: counts?.filter(c => c.status === 'rejected').length || 0
    };

    return NextResponse.json({
      success: true,
      approvals: data || [],
      count: data?.length || 0,
      statusCounts,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Approvals] GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Approve or reject an item
 */
export async function POST(req: NextRequest) {
  try {
    const { approvalId, action, notes } = await req.json();

    if (!approvalId || !action) {
      return NextResponse.json(
        { error: 'approvalId and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the approval item
    const { data: approval, error: fetchError } = await supabase
      .from('approval_queue')
      .select('*')
      .eq('id', approvalId)
      .single();

    if (fetchError || !approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      );
    }

    // Update approval status
    const { error: updateError } = await supabase
      .from('approval_queue')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // TODO: Get from auth session
        reviewer_notes: notes || null
      })
      .eq('id', approvalId);

    if (updateError) {
      console.error('[Approvals] Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update approval' },
        { status: 500 }
      );
    }

    // Log the decision
    await supabase.from('agent_events').insert({
      agent_id: approval.agent_id,
      event_type: action === 'approve' ? 'approval_granted' : 'approval_rejected',
      message: `${approval.item_type} ${action === 'approve' ? 'approved' : 'rejected'} by admin`,
      severity: 'info',
      data: {
        approval_id: approvalId,
        item_type: approval.item_type,
        item_id: approval.item_id,
        notes: notes
      }
    });

    // Execute approved action
    if (action === 'approve') {
      await executeApprovedAction(approval);
    }

    return NextResponse.json({
      success: true,
      action,
      approvalId,
      message: `Item ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });

  } catch (error: any) {
    console.error('[Approvals] POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Execute the approved action based on item type
 */
async function executeApprovedAction(approval: any) {
  try {
    switch (approval.item_type) {
      case 'policy_update': {
        // Publish policy update
        await supabase
          .from('policy_updates')
          .update({ reviewed: true, reviewed_at: new Date().toISOString() })
          .eq('id', approval.item_id);
        break;
      }

      case 'grant': {
        // Process grant/funding item
        await supabase
          .from('donations')
          .update({ fraud_check_status: 'approved' })
          .eq('id', approval.item_id);
        break;
      }

      case 'milestone': {
        // Publish milestone
        await supabase
          .from('milestone_events')
          .update({ status: 'verified' })
          .eq('id', approval.item_id);
        break;
      }

      default:
        console.warn(`[Approvals] Unknown item_type: ${approval.item_type}`);
    }

    console.log(`[Approvals] Executed action for ${approval.item_type}: ${approval.item_id}`);

  } catch (error) {
    console.error('[Approvals] Execute action error:', error);
    // Don't throw - approval is already marked as approved
  }
}
