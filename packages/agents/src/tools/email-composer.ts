import { tool } from 'ai';
import { z } from 'zod';

/**
 * Email Composer Tool
 * Creates professional emails for partnerships, investor relations, and outreach
 */
export const emailComposerTool = tool({
  description: 'Compose professional emails for partnerships, investor outreach, progress updates, and stakeholder communication',
  inputSchema: z.object({
    emailType: z.enum(['cold_outreach', 'follow_up', 'progress_update', 'meeting_request', 'thank_you']),
    recipient: z.object({
      name: z.string(),
      organization: z.string(),
      role: z.string().optional(),
    }),
    context: z.string().describe('Background information and purpose of the email'),
    callToAction: z.string().optional(),
  }),
  strict: true,
  needsApproval: true, // Require approval before sending
  execute: async ({ emailType, recipient, context, callToAction }) => {
    const templates = {
      cold_outreach: {
        subject: `Partnership Opportunity: ${recipient.organization} × Ubuntu Initiative`,
        greeting: `Dear ${recipient.name},`,
        body: `I hope this message finds you well. I'm reaching out on behalf of the Ubuntu Initiative, Africa's sovereign AI infrastructure catalyst.\n\n${context}\n\nWe believe ${recipient.organization} would be an ideal partner for this transformative project. ${callToAction || 'Would you be available for a brief call next week to explore potential collaboration?'}`,
        closing: 'Looking forward to connecting,',
      },
      follow_up: {
        subject: `Following Up: Ubuntu Initiative Discussion`,
        greeting: `Hi ${recipient.name},`,
        body: `Thank you for taking the time to connect previously. I wanted to follow up on our conversation about the Ubuntu Initiative.\n\n${context}\n\n${callToAction || 'I\'d love to continue our discussion. Would you have 15 minutes available this week?'}`,
        closing: 'Best regards,',
      },
      progress_update: {
        subject: `Ubuntu Initiative: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Progress Update`,
        greeting: `Dear ${recipient.name},`,
        body: `I'm excited to share our latest progress on the Ubuntu Initiative.\n\n${context}\n\n${callToAction || 'We\'d love to hear your thoughts on these developments.'}`,
        closing: 'Warm regards,',
      },
      meeting_request: {
        subject: `Meeting Request: Ubuntu Initiative Partnership Discussion`,
        greeting: `Dear ${recipient.name},`,
        body: `I hope this email finds you well. ${context}\n\nWould you be available for a meeting to discuss how ${recipient.organization} and the Ubuntu Initiative could collaborate?\n\n${callToAction || 'I\'m happy to work around your schedule. Would next week work for you?'}`,
        closing: 'Looking forward to hearing from you,',
      },
      thank_you: {
        subject: `Thank You - Ubuntu Initiative Meeting`,
        greeting: `Dear ${recipient.name},`,
        body: `Thank you for taking the time to meet with us regarding the Ubuntu Initiative.\n\n${context}\n\n${callToAction || 'We look forward to continuing our conversation.'}`,
        closing: 'With appreciation,',
      },
    };

    const template = templates[emailType];

    return {
      emailType,
      recipient,
      draft: {
        subject: template.subject,
        body: `${template.greeting}\n\n${template.body}\n\n${template.closing}\nThe Ubuntu Initiative Team`,
      },
      requiresApproval: true,
      timestamp: new Date().toISOString(),
    };
  },
});
