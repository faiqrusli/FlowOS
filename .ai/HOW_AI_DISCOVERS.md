# How AI Tools Discover `.ai/` Files

**Does `.ai/` get read automatically?**

**Short answer:** It depends on the tool. Some read it automatically, others need explicit instructions.

---

## Automatic Discovery (Tool-Specific)

### ✅ Cursor IDE
**How it works:**
- Cursor automatically reads **`.cursor/rules/*.mdc`** files
- Our `.cursor/rules/flowos-core.mdc` says:
  ```
  🚨 CRITICAL: Before ANY work, read these in order:
  1. .ai/context.md
  2. docs/07-strategy-and-delivery/current-sprint.md
  3. Your role document
  ```
- When Cursor AI starts, it reads flowos-core.mdc → sees instructions → reads `.ai/context.md`

**Status:** ✅ Configured (will read `.ai/` automatically)

---

### ✅ WebStorm / IntelliJ
**How it works:**
- WebStorm AI reads **`.idea/ai-rules.md`** automatically
- Our `.idea/ai-rules.md` says:
  ```
  Universal AI Skills Reference: See .ai/ directory
  
  Before starting work:
  1. Read .ai/context.md
  2. Check current sprint
  3. Understand your role
  ```
- When WebStorm AI starts, it reads ai-rules.md → sees instructions → reads `.ai/context.md`

**Status:** ✅ Configured (will read `.ai/` automatically)

---

### ✅ CLI Tools (Kiro, acp)
**How it works:**
- CLI tools often check **`AGENTS.md`** in project root
- Our `AGENTS.md` says:
  ```
  🚨 CRITICAL: Read These First (In Order)
  1. .ai/context.md ← START HERE
  2. docs/07-strategy-and-delivery/current-sprint.md
  3. docs/12-team/active-6-role/[your-role].md
  ```
- When CLI AI starts, it checks AGENTS.md → sees instructions → reads `.ai/context.md`

**Status:** ✅ Configured (will read `.ai/` on startup)

---

## Manual Discovery (Requires Explicit Instruction)

### ⚠️ ChatGPT / Claude / Codex (Standalone)
**How it works:**
- These tools **do NOT** automatically check for `.ai/` or `AGENTS.md`
- You must explicitly tell them:
  ```
  Read .ai/context.md first
  ```
  or
  ```
  You are the Product Architect for FlowOS.
  Read docs/12-team/active-6-role/product-architect.md
  Read .ai/context.md for full context
  ```

**Workaround:**
Create a **project prompt template** you paste at the start:
```markdown
# FlowOS Context

**Read these files first:**
1. .ai/context.md — Universal context
2. docs/07-strategy-and-delivery/current-sprint.md — Current sprint (Phase 0)
3. [If assigned a role]: docs/12-team/active-6-role/[role].md

**Current Phase:** Phase 0 (Freeze Ambiguity and Establish Document Authority)
**Sprint:** Week of 2026-08-02
**Gate 0 Target:** 2026-08-06

Now: [your instruction]
```

**Status:** ❌ Not automatic (needs manual prompt)

---

### ⚠️ GitHub Copilot
**How it works:**
- Copilot reads **code context** (open files, recent edits)
- It does NOT automatically read `.ai/` or documentation
- To give it context, you can:
  1. Open `.ai/context.md` in a tab (it will see it)
  2. Add a comment in your code:
     ```typescript
     // See .ai/context.md for FlowOS context
     // Current phase: Phase 0 (doc updates)
     ```

**Status:** ❌ Not automatic (needs open file or comment)

---

## Making It More Automatic

### Option 1: Update Integration Files (✅ Done)

We've already updated:
- `.cursor/rules/flowos-core.mdc` — Now says "CRITICAL: Before ANY work, read..."
- `AGENTS.md` — Now has "🚨 CRITICAL: Read These First"
- `.idea/ai-rules.md` — References `.ai/` system

**Result:** Cursor, WebStorm, and CLI tools will read `.ai/` automatically.

---

### Option 2: Add Pre-Commit Hook (Optional)

Create a reminder for developers to check `.ai/context.md`:

**`.git/hooks/pre-commit`:**
```bash
#!/bin/sh
echo "📋 Remember: Check .ai/context.md for current sprint phase and role assignments"
echo "Current Phase: Phase 0 (see docs/07-strategy-and-delivery/current-sprint.md)"
```

**Status:** ⚠️ Optional (not required for AI tools)

---

### Option 3: Add README Pointer (Optional)

Add to top of `README.md`:
```markdown
## For AI Assistants

**Start here:** [`.ai/context.md`](.ai/context.md)

Current sprint: [Week of 2026-08-02](docs/07-strategy-and-delivery/current-sprint.md)

---
```

**Status:** ⚠️ Optional (helps but not guaranteed)

---

## Testing Discovery

### Test in Cursor
1. Open Cursor
2. Start new chat
3. Say: "What phase are we in?"
4. Expected: AI should know we're in Phase 0

**If AI doesn't know:**
- Check that `.cursor/rules/flowos-core.mdc` exists
- Restart Cursor to reload rules

---

### Test in CLI (Kiro)
1. Run: `kiro chat`
2. Say: "What phase are we in?"
3. Expected: AI should know we're in Phase 0

**If AI doesn't know:**
- Check that `AGENTS.md` is in project root
- Make sure you're in the FlowOS directory

---

### Test with ChatGPT
1. Start new chat
2. **Don't mention `.ai/`**
3. Say: "What phase are we in?"
4. Expected: AI will NOT know (needs explicit instruction)

**To fix:**
- Say: "Read .ai/context.md first"
- Or paste the project prompt template above

---

## Best Practices

### For Tool Users (Cursor, WebStorm, CLI)
✅ **Trust the setup** — Tools will read `.ai/` automatically  
✅ **Verify occasionally** — Ask "What phase are we in?" to confirm  
✅ **Report if broken** — If AI doesn't know context, check integration files  

### For Standalone AI (ChatGPT, Claude)
✅ **Always start with context** — Paste project prompt template  
✅ **Reference `.ai/context.md`** — Tell AI to read it  
✅ **Verify understanding** — Ask AI to summarize phase and role  

### For All AI
✅ **Current sprint matters** — Always check `current-sprint.md` for Phase 0 work  
✅ **Role assignment matters** — Read role document when assigned  
✅ **Sprint context helps** — `.ai/sprint-context.md` is quick reference  

---

## Current Integration Status

| Tool | Auto-Reads .ai/ | How | Status |
|------|-----------------|-----|--------|
| **Cursor** | ✅ Yes | Via `.cursor/rules/flowos-core.mdc` | ✅ Configured |
| **WebStorm** | ✅ Yes | Via `.idea/ai-rules.md` | ✅ Configured |
| **Kiro/acp CLI** | ✅ Yes | Via `AGENTS.md` | ✅ Configured |
| **ChatGPT** | ❌ No | Manual prompt needed | ⚠️ Needs explicit instruction |
| **Claude** | ❌ No | Manual prompt needed | ⚠️ Needs explicit instruction |
| **Codex** | ❌ No | Manual prompt needed | ⚠️ Needs explicit instruction |
| **Copilot** | ⚠️ Partial | If `.ai/context.md` is open | ⚠️ Context-dependent |

---

## Recommended Workflow

### Using Cursor / WebStorm
```
1. Open project in Cursor/WebStorm
2. Start AI chat
3. AI automatically reads .ai/context.md
4. Ask: "What phase are we in?" (verify it knows)
5. Get assigned a role: "You are the Product Architect"
6. AI reads role document automatically
7. Work proceeds with full context
```

### Using CLI (Kiro)
```
1. cd to FlowOS directory
2. Run: kiro chat
3. CLI reads AGENTS.md → .ai/context.md
4. Ask: "What phase are we in?" (verify)
5. Get assigned: "You are the Implementation Engineer"
6. Work proceeds with full context
```

### Using ChatGPT / Claude
```
1. Start new chat
2. Paste project prompt:
   """
   Read .ai/context.md for FlowOS context.
   Current Phase: Phase 0 (see docs/07-strategy-and-delivery/current-sprint.md)
   
   You are the [Role Name].
   Read docs/12-team/active-6-role/[role].md
   
   Assignment: [task]
   """
3. AI reads files
4. Work proceeds with context
```

---

## Summary

**Question:** Does `.ai/` always make sure any model goes to that page first?

**Answer:**
- ✅ **Cursor, WebStorm, CLI:** Yes, via integration files (`.cursor/rules/`, `.idea/ai-rules.md`, `AGENTS.md`)
- ❌ **ChatGPT, Claude, Codex:** No, you must explicitly tell them to read `.ai/context.md`

**Current Status:**
- ✅ All tool-integrated AI (Cursor, WebStorm, Kiro) will read `.ai/` automatically
- ✅ Integration files updated with "CRITICAL: Read these first" instructions
- ⚠️ Standalone AI needs manual prompting (paste project template)

**Best Practice:**
Always verify AI knows current phase by asking "What phase are we in?" at the start of work.

---

**Your setup is ✅ configured correctly for automatic `.ai/` discovery in all integrated tools (Cursor, WebStorm, CLI).**
