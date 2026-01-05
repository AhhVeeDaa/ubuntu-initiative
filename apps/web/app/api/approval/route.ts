// Ubuntu Initiative - Approval API
// POST /api/approval - Approve or reject policy updates

import { NextResponse } from 'next/server';
import { approvePolicyUpdate, rejectPolicyUpdate } from '@/lib/approval';

interface ApprovalRequest {
  action: 'approve' | 'reject';
  approvalQueueId: string;
  policyUpdateId: string;
  userId?: string;
  notes?: string;
  reason?: string;
}

interface ApprovalResponse {
  success: boolean;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<ApprovalResponse>> {
  try {
    const body = await request.json() as ApprovalRequest;
    const {
      action,
      approvalQueueId,
      policyUpdateId,
      userId,
      notes,
      reason
    } = body;

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

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Approval API error:', errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
