/**
 * WhatsApp Notification Sender
 * Internal API for triggering outbound WhatsApp notifications
 * 
 * @route /api/notifications/whatsapp/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWhatsAppMessage, TEMPLATES, canReceiveNotification, PERMISSIONS } from '@/lib/whatsapp';
import crypto from 'crypto';

interface NotificationRequest {
    type: 'policy_alert' | 'approval_required' | 'approval_confirmed' | 'approval_rejected' | 'system_alert' | 'daily_digest';
    agentRunId?: string;
    queueItemId?: string;
    policyUpdateId?: string;
    data: Record<string, string>;
}

export async function POST(request: NextRequest) {
    // Verify internal API key
    const apiKey = request.headers.get('x-internal-api-key');
    if (apiKey !== process.env.INTERNAL_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: NotificationRequest = await request.json();
    const supabase = await createClient();

    // Map notification type to template and required role
    const notificationConfig: Record<string, { template: string; roles: string[] }> = {
        policy_alert: {
            template: TEMPLATES.POLICY_ALERT,
            roles: ['reviewer']
        },
        approval_required: {
            template: TEMPLATES.APPROVAL_REQUIRED,
            roles: ['reviewer']
        },
        approval_confirmed: {
            template: TEMPLATES.APPROVAL_CONFIRMED,
            roles: ['reviewer', 'observer']
        },
        approval_rejected: {
            template: TEMPLATES.APPROVAL_REJECTED,
            roles: ['reviewer', 'observer']
        },
        system_alert: {
            template: TEMPLATES.SYSTEM_ALERT,
            roles: ['admin']
        },
        daily_digest: {
            template: TEMPLATES.DAILY_DIGEST,
            roles: ['reviewer', 'observer']
        }
    };

    const config = notificationConfig[body.type];
    if (!config) {
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    // Get eligible recipients
    const { data: recipients, error: recipientError } = await supabase
        .from('whatsapp_recipients')
        .select('*')
        .eq('active', true)
        .in('role', config.roles);

    if (recipientError || !recipients?.length) {
        return NextResponse.json({
            success: true,
            sent: 0,
            message: 'No eligible recipients'
        });
    }

    // Generate nonce for actionable messages
    let nonce: string | null = null;
    if (body.type === 'approval_required' && body.queueItemId) {
        nonce = crypto.randomUUID();
        await supabase.from('whatsapp_nonces').insert({
            nonce,
            queue_id: body.queueItemId,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
    }

    // Prepare template parameters with nonce if applicable
    const templateParams = { ...body.data };
    if (nonce) {
        templateParams.nonce = nonce;
    }

    // Send to each recipient
    const results: { recipientHash: string; success: boolean; error?: string }[] = [];

    for (const recipient of recipients) {
        // Verify recipient can receive this notification type
        const notificationType = body.type.replace('_', '');
        if (!canReceiveNotification(recipient.role as keyof typeof PERMISSIONS, notificationType)) {
            continue;
        }

        // Create notification record
        const { data: notification, error: insertError } = await supabase
            .from('whatsapp_notifications')
            .insert({
                agent_run_id: body.agentRunId || null,
                queue_item_id: body.queueItemId || null,
                policy_update_id: body.policyUpdateId || null,
                template_name: config.template,
                template_params: templateParams,
                recipient_hash: recipient.phone_hash,
                recipient_role: recipient.role,
                status: 'pending'
            })
            .select()
            .single();

        if (insertError) {
            results.push({
                recipientHash: recipient.phone_hash.substring(0, 8),
                success: false,
                error: 'Failed to create notification record'
            });
            continue;
        }

        // Send message
        const sendResult = await sendWhatsAppMessage(
            recipient.phone_hash,
            config.template,
            templateParams,
            supabase
        );

        // Update notification status
        if (sendResult.success) {
            await supabase
                .from('whatsapp_notifications')
                .update({
                    status: 'sent',
                    meta_message_id: sendResult.messageId,
                    sent_at: new Date().toISOString()
                })
                .eq('id', notification.id);

            results.push({
                recipientHash: recipient.phone_hash.substring(0, 8),
                success: true
            });
        } else {
            await supabase
                .from('whatsapp_notifications')
                .update({
                    status: 'failed',
                    error_message: sendResult.error,
                    failed_at: new Date().toISOString()
                })
                .eq('id', notification.id);

            results.push({
                recipientHash: recipient.phone_hash.substring(0, 8),
                success: false,
                error: sendResult.error
            });
        }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
        success: true,
        sent: successCount,
        failed: failureCount,
        results: results.map(r => ({
            recipient: r.recipientHash + '...',
            success: r.success,
            error: r.error
        }))
    });
}
