import { tool } from 'ai';
import { z } from 'zod';

/**
 * Document Generator Tool
 * Creates technical specs, partnership agreements, pitch decks, and reports
 */
export const documentGeneratorTool = tool({
  description: 'Generate professional documents like technical specifications, partnership proposals, pitch decks, and progress reports',
  inputSchema: z.object({
    documentType: z.enum(['technical_spec', 'partnership_proposal', 'pitch_deck', 'progress_report', 'blog_post']),
    topic: z.string().describe('The main topic or title of the document'),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string(),
    })).optional(),
    metadata: z.object({
      author: z.string().optional(),
      date: z.string().optional(),
      version: z.string().optional(),
    }).optional(),
  }),
  needsApproval: false,
  execute: async ({ documentType, topic, sections = [], metadata = {} }) => {
    const doc = {
      type: documentType,
      topic,
      metadata: {
        author: metadata.author || 'Ubuntu Initiative',
        date: metadata.date || new Date().toISOString(),
        version: metadata.version || '1.0',
      },
      sections: sections.length > 0 ? sections : [
        {
          title: 'Overview',
          content: `This document provides information about ${topic}.`,
        },
        {
          title: 'Key Points',
          content: 'Main points to be discussed.',
        },
        {
          title: 'Next Steps',
          content: 'Action items and follow-up tasks.',
        },
      ],
      generatedAt: new Date().toISOString(),
    };

    return doc;
  },
  toModelOutput: async ({ output }) => ({
    type: 'text',
    value: `# ${output.topic}\n\n**Type:** ${output.type}\n**Author:** ${output.metadata.author}\n**Date:** ${output.metadata.date}\n**Version:** ${output.metadata.version}\n\n---\n\n${output.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n')}`,
  }),
});
