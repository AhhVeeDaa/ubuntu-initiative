/**
 * WhatsApp Integration Service
 * Handles outbound notifications and inbound command processing
 * 
 * @module lib/whatsapp
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Types
export interface WhatsAppRecipient {
    id: string;
    phone_hash: string;
    role: 'reviewer' | 'observer' | 'admin';
    user_id: string;
    display_name: string | null;
    active: boolean;
}

export interface WhatsAppNotification {
    id: string;
    agent_run_id: string | null;
    queue_item_id: string | null;
    policy_update_id: string | null;
    template_name: string;
    template_params: Record<string, unknown>;
    recipient_hash: string;
    recipient_role: string;
    meta_message_id: string | null;
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
    error_code: string | null;
    error_message: string | null;
    created_at: string;
    sent_at: string | null;
    delivered_at: string | null;
    read_at: string | null;
    failed_at: string | null;
}

export interface ParsedCommand {
    action: 'approve' | 'reject' | 'details' | 'status' | 'invalid';
    queueId: string | null;
    nonce: string | null;
    raw: string;
}

// Configuration
const META_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_HASH_SALT = process.env.PHONE_HASH_SALT || '';
const META_PHONE_ID = process.env.META_WHATSAPP_PHONE_ID || '';
const META_ACCESS_TOKEN = process.env.META_WHATSAPP_ACCESS_TOKEN || '';

// Rate limits
const OUTBOUND_DAILY_LIMIT = parseInt(process.env.WHATSAPP_PER_RECIPIENT_DAILY_LIMIT || '20');
const INBOUND_DAILY_LIMIT = parseInt(process.env.WHATSAPP_INBOUND_DAILY_LIMIT || '50');

/**
 * Hash a phone number for storage/lookup
 */
export function hashPhoneNumber(phoneE164: string): string {
    return crypto
        .createHash('sha256')
        .update(phoneE164 + PHONE_HASH_SALT)
        .digest('hex');
}

/**
 * Verify Meta webhook signature
 */
export function verifyWebhookSignature(
    signature: string | null,
    payload: string
): boolean {
    if (!signature) return false;

    const appSecret = process.env.META_APP_SECRET || '';
    const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

    const providedSignature = signature.replace('sha256=', '');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(providedSignature),
            Buffer.from(expectedSignature)
        );
    } catch {
        return false;
    }
}

/**
 * Parse incoming WhatsApp message into a command
 */
export function parseCommand(message: string): ParsedCommand {
    const normalized = message.trim().toUpperCase();
    const parts = normalized.split(/\s+/);

    const result: ParsedCommand = {
        action: 'invalid',
        queueId: null,
        nonce: null,
        raw: message
    };

    if (parts.length === 0) return result;

    const command = parts[0];

    switch (command) {
        case 'APPROVE':
            if (parts.length >= 2) {
                result.action = 'approve';
                result.queueId = parts[1];
                result.nonce = parts[2] || null;
            }
            break;

        case 'REJECT':
            if (parts.length >= 2) {
                result.action = 'reject';
                result.queueId = parts[1];
                result.nonce = parts[2] || null;
            }
            break;

        case 'DETAILS':
            if (parts.length >= 2) {
                result.action = 'details';
                result.queueId = parts[1];
            }
            break;

        case 'STATUS':
            result.action = 'status';
            break;

        default:
            result.action = 'invalid';
    }

    return result;
}

/**
 * Send a WhatsApp message via Meta Cloud API
 */
export async function sendWhatsAppMessage(
    recipientHash: string,
    templateName: string,
    templateParams: Record<string, string>,
    supabase: ReturnType<typeof createClient>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Check rate limit
    const { data: withinLimit } = await supabase.rpc('check_whatsapp_rate_limit', {
        p_recipient_hash: recipientHash,
        p_direction: 'outbound',
        p_limit: OUTBOUND_DAILY_LIMIT
    });

    if (!withinLimit) {
        return { success: false, error: 'Rate limit exceeded' };
    }

    // Get recipient phone (we'd need a secure lookup here - in production, 
    // this would involve a separate secure service or HSM)
    // For now, we log and return - actual implementation requires phone retrieval

    try {
        // Template parameters formatted for Meta API
        const components = [
            {
                type: 'body',
                parameters: Object.entries(templateParams).map(([, value]) => ({
                    type: 'text',
                    text: value
                }))
            }
        ];

        const response = await fetch(`${META_API_URL}/${META_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: '{{PHONE_PLACEHOLDER}}', // Actual phone retrieved securely
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en' },
                    components
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.error?.message || 'API error' };
        }

        const result = await response.json();

        // Increment rate limit counter
        await supabase.rpc('increment_whatsapp_rate_limit', {
            p_recipient_hash: recipientHash,
            p_direction: 'outbound'
        });

        return { success: true, messageId: result.messages?.[0]?.id };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Process an approval command from WhatsApp
 */
export async function processApprovalCommand(
    senderHash: string,
    command: ParsedCommand,
    supabase: ReturnType<typeof createClient>
): Promise<{ success: boolean; message: string }> {
    // Verify sender is a reviewer
    const { data: recipient } = await supabase
        .from('whatsapp_recipients')
        .select('*')
        .eq('phone_hash', senderHash)
        .eq('active', true)
        .single();

    if (!recipient) {
        return { success: false, message: 'Unauthorized sender' };
    }

    if (recipient.role !== 'reviewer') {
        return { success: false, message: 'Insufficient permissions' };
    }

    // Validate nonce if provided
    if (command.nonce) {
        const { data: nonceResult } = await supabase.rpc('validate_whatsapp_nonce', {
            p_nonce: command.nonce
        });

        if (!nonceResult?.[0]?.valid) {
            return { success: false, message: nonceResult?.[0]?.error_message || 'Invalid nonce' };
        }
    }

    // Get queue item
    const { data: queueItem, error: queueError } = await supabase
        .from('approval_queue')
        .select('*')
        .eq('id', command.queueId)
        .single();

    if (queueError || !queueItem) {
        return { success: false, message: 'Queue item not found' };
    }

    if (queueItem.status !== 'pending') {
        return { success: false, message: `Item already ${queueItem.status}` };
    }

    // Capture previous state for audit
    const previousState = { ...queueItem };

    // Determine new status
    const newStatus = command.action === 'approve' ? 'approved' : 'rejected';

    // Update queue item
    const { error: updateError } = await supabase
        .from('approval_queue')
        .update({
            status: newStatus,
            reviewed_at: new Date().toISOString(),
            source: 'whatsapp'
        })
        .eq('id', command.queueId);

    if (updateError) {
        return { success: false, message: 'Failed to update queue item' };
    }

    // Log interaction
    await supabase.from('whatsapp_interactions').insert({
        queue_item_id: command.queueId,
        sender_hash: senderHash,
        command: command.action,
        raw_message_sanitized: command.raw.substring(0, 100),
        action_taken: command.action,
        outcome: 'success',
        previous_state: previousState,
        new_state: { ...previousState, status: newStatus, source: 'whatsapp' },
        processed_at: new Date().toISOString()
    });

    // Mark nonce as used if provided
    if (command.nonce) {
        await supabase
            .from('whatsapp_nonces')
            .update({ used_at: new Date().toISOString() })
            .eq('nonce', command.nonce);
    }

    return {
        success: true,
        message: `Item ${newStatus} successfully`
    };
}

/**
 * Template names mapping
 */
export const TEMPLATES = {
    POLICY_ALERT: process.env.WHATSAPP_TEMPLATE_ALERT || 'policy_alert_v1',
    APPROVAL_REQUIRED: process.env.WHATSAPP_TEMPLATE_APPROVAL || 'approval_required_v1',
    APPROVAL_CONFIRMED: process.env.WHATSAPP_TEMPLATE_CONFIRMED || 'approval_confirmed_v1',
    APPROVAL_REJECTED: process.env.WHATSAPP_TEMPLATE_REJECTED || 'approval_rejected_v1',
    SYSTEM_ALERT: process.env.WHATSAPP_TEMPLATE_ERROR || 'system_alert_v1',
    DAILY_DIGEST: process.env.WHATSAPP_TEMPLATE_DIGEST || 'daily_digest_v1'
} as const;

/**
 * Role permissions
 */
export const PERMISSIONS = {
    reviewer: {
        canReceive: ['alert', 'approval_required', 'confirmation', 'digest'],
        canAct: ['approve', 'reject', 'details', 'status']
    },
    observer: {
        canReceive: ['digest', 'confirmation'],
        canAct: ['status']
    },
    admin: {
        canReceive: ['system_alert'],
        canAct: []
    }
} as const;

/**
 * Check if a role can perform an action
 */
export function canPerformAction(
    role: keyof typeof PERMISSIONS,
    action: string
): boolean {
    return PERMISSIONS[role].canAct.includes(action as never);
}

/**
 * Check if a role can receive a notification type
 */
export function canReceiveNotification(
    role: keyof typeof PERMISSIONS,
    notificationType: string
): boolean {
    return PERMISSIONS[role].canReceive.includes(notificationType as never);
}
