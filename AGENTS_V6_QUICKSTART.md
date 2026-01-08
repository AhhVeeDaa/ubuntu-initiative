# Quick Start Guide - Ubuntu AI Agents

## ⚡ 5-Minute Setup

### Step 1: Copy Files to Your Project
```bash
# Navigate to your ubuntu-initiative project
cd /path/to/ubuntu-initiative

# Create directories
mkdir -p apps/dashboard/agents apps/dashboard/tools apps/dashboard/app/api

# Copy agent system from Desktop
cp -r /Users/ahhveedaa/Desktop/ubuntu-agents/agents/* apps/dashboard/agents/
cp -r /Users/ahhveedaa/Desktop/ubuntu-agents/tools/* apps/dashboard/tools/
cp -r /Users/ahhveedaa/Desktop/ubuntu-agents/api/* apps/dashboard/app/api/
cp -r /Users/ahhveedaa/Desktop/ubuntu-agents/components/* apps/dashboard/components/
```

### Step 2: Install Dependencies
```bash
npm install ai @ai-sdk/react @ai-sdk/anthropic zod
```

### Step 3: Add Environment Variables
Create `apps/dashboard/.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Step 4: Create Agent Page
Create `apps/dashboard/app/agents/page.tsx`:

```typescript
import { AgentChat } from '@/components/AgentChat';

export default function AgentsPage() {
  return (
    <div className="min-h-screen">
      <AgentChat />
    </div>
  );
}
```

### Step 5: Run & Test
```bash
npm run dev
# Visit http://localhost:3000/agents
```

---

## 🎯 First Interactions

### Test Partnership Agent
```
Draft a professional email to the African Development Bank introducing the Ubuntu Initiative and our anchor tenant model. Mention that we provide 500MW baseload demand that makes the Inga Dam expansion bankable.
```

### Test Financial Agent
```
Calculate the NPV for Phase 2 with these parameters:
- Initial investment: $200 million
- Annual revenue: $175 million (500MW @ $0.04/kWh)
- Annual costs: $50 million
- Discount rate: 10%
- Project years: 25
```

### Test Research Agent
```
Research the latest developments in sovereign AI initiatives globally. Focus on countries that are building national AI infrastructure and their approaches to data sovereignty.
```

### Test Technical Agent
```
Generate a technical specification for our 500MW substation integration with Inga Dam. Include voltage levels, transformer requirements, and redundancy architecture.
```

### Test Content Agent
```
Write a compelling blog post titled "Why Africa Needs Sovereign AI" that explains our infrastructure catalyst model and the importance of data sovereignty for the continent.
```

---

## 🔧 Common Tasks

### Adding Agents to Dashboard Navigation
Edit `apps/dashboard/components/layout/Navbar.tsx`:

```typescript
const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/agents', label: 'AI Agents' }, // Add this
  { href: '/dashboard/analytics', label: 'Analytics' },
];
```

### Connecting to Supabase
Update `tools/database-query.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Replace mock data with real queries
const { data } = await supabase
  .from(table)
  .select('*')
  .match(filters)
  .limit(limit);
```

### Customizing Agent Instructions
Edit any agent file in `agents/`:

```typescript
export const partnershipAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4-20250514',
  instructions: `
    [Your custom instructions here]
    - Add project-specific context
    - Define response formats
    - Set communication style
  `,
  tools: { /* ... */ },
});
```

---

## 📱 Mobile Optimization

The AgentChat component is responsive by default, but you can enhance it:

```typescript
// components/AgentChat.tsx
<div className="flex flex-col md:flex-row h-screen">
  <div className="w-full md:w-64 ...">
    {/* Sidebar - full width on mobile */}
  </div>
  <div className="flex-1 ...">
    {/* Chat area */}
  </div>
</div>
```

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve '@/agents/...'"
**Fix:** Check your `tsconfig.json` has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./apps/dashboard/*"]
    }
  }
}
```

### "ANTHROPIC_API_KEY is not defined"
**Fix:** 
1. Create `.env.local` in project root
2. Add: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart dev server

### Agents not responding
**Fix:**
1. Check API routes are in correct location: `app/api/[agent]/route.ts`
2. Verify API key is valid
3. Check browser console for errors
4. Test API directly: `curl http://localhost:3000/api/partnership -d '{"messages":[]}'`

### Tool approval not working
**Fix:** Ensure `addToolApprovalResponse` is passed to ToolInvocationView:
```typescript
<ToolInvocationView
  invocation={part}
  addToolApprovalResponse={addToolApprovalResponse}
/>
```

---

## 🚀 Next Steps

1. **Connect Real Data:** Integrate Supabase for partnership tracking
2. **Add Web Search:** Use Tavily or Brave Search API
3. **Email Integration:** Connect Resend or SendGrid
4. **Monitoring:** Set up AI SDK DevTools
5. **Analytics:** Track agent usage and popular queries

---

## 📊 Performance Tips

### 1. Use Streaming
All agents use streaming by default for better UX:
```typescript
return createAgentUIStreamResponse({ agent, uiMessages });
```

### 2. Edge Runtime
API routes use Edge Runtime for faster cold starts:
```typescript
export const runtime = 'edge';
```

### 3. Tool Result Optimization
Use `toModelOutput` to send compact summaries to model:
```typescript
toModelOutput: async ({ output }) => ({
  type: 'text',
  value: `Summary: ${output.key_points}`, // Not full JSON
}),
```

---

## 📝 Sample .env.local

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email (if using)
RESEND_API_KEY=re_...

# Search (if using)
TAVILY_API_KEY=tvly-...
```

---

**Need help?** Check the main README.md for detailed documentation.
