// Ubuntu Initiative - Approval API
// POST /api/approval - Approve or reject policy updates

import { NextResponse } from 'next/server';
import { approvePolicyUpdate, rejectPolicyUpdate } from '@/lib/approval';

export async function POST(request: Request) {
  try {
    const { 
      action, 
      approvalQueueId, 
      policyUpdateId, 
      userId, 
      notes, 
      reason 
    } = await request.json();
    
    // TODO: Add authentication and role check
    // For Phase 0, accepting any userId
    // In production, verify user is authenticated and has 'approver' role
    
    if (action === 'approve') {
      const result = await approvePolicyUpdate(
        approvalQueueId,
        policyUpdateId,
        userId || 'founder',
        notes
      );
      return NextResponse.json(result);
      
    } else if (action === 'reject') {
      if (!reason) {
        return NextResponse.json(
          { success: false, error: 'Rejection reason required' },
          { status: 400 }
        );
      }
      
      const result = await rejectPolicyUpdate(
        approvalQueueId,
        policyUpdateId,
        userId || 'founder',
        reason
      );
      return NextResponse.json(result);
      
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('Approval API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
