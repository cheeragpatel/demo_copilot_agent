# 🚀 GitHub Copilot Agent Mode Hands‑On Workshop

> **Format:** Onsite, instructor-led, highly interactive, “learn by doing”  
> **Environment:** Local VS Code *or* GitHub Codespaces  
> **Audience:** Developers new to Copilot, Agent Mode, and possibly VS Code  
> **Duration:** 3.5–4 hours (with optional trims)  
> **Core Goal:** Leave with practical confidence using Agent Mode to build, test, refactor, and automate.

---

## 🧭 Why This Workshop Exists

You’ve seen AI generate snippets. Now you’ll experience an AI *teammate* that plans, edits multiple files, runs tools, and iterates. This workshop turns anxiety (“Will it break my code?”) into confidence (“I know how to steer it.”).

We focus on:

- Reducing first-time friction (setup, UI orientation)
- Building something real (Cart feature) collaboratively with Agent Mode
- Improving test coverage and reasoning through failures
- Reinforcing repeatability with custom prompts & handoffs
- Optional advanced tracks: security, MCP, CI/CD

---

## 🎯 Outcomes (You Will Be Able To...)

1. Spin up a ready-to-code environment in **local VS Code or Codespaces**.
2. Distinguish **Ask vs Plan vs Agent Mode** and choose the right one.
3. Use Agent Mode to implement a multi-file feature (Cart) from a design.
4. Generate, run, and refine tests—embracing *self-healing*.
5. Capture reusable workflows via **custom prompt files**.
6. (Optional) Explore **MCP Servers**, GitHub automation & security prompts.
7. Refine vague prompts into precise, high-impact instructions.

> 🔄 Mindset Shift: You aren’t delegating *creativity*—you’re delegating *mechanical labor*.

---

## 🗺️ Agenda At a Glance

| Time | Module | Theme | Energy Marker |
|------|--------|-------|---------------|
| 00:00–00:15 | 0 | Setup & Orientation | 👋 Icebreaker |
| 00:15–00:35 | 1 | Copilot Concepts | 💡 First “Aha” |
| 00:35–01:10 | 2 | First Agent Task | ✅ Safe Win |
| 01:10–01:25 | 3 | Break + Q&A | ☕ Reset |
| 01:25–02:05 | 4 | Cart Feature Build | 🛠️ Flow Zone |
| 02:05–02:40 | 5 | Test Coverage Boost | 🧪 Confidence |
| 02:40–03:05 | 6 | Custom Prompts & Handoff | 🗂️ Reuse |
| 03:05–03:25 | 7A | Security/Observability (Opt) | 🛡️ Insight |
| 03:05–03:25 | 7B | MCP & Browser Testing (Opt) | 🌐 Extend |
| 03:25–03:45 | 8 | Prompt Refinement | 🎯 Mastery |
| 03:45–04:00 | Buffer | Stretch / Feedback | 🔁 Close |

> ⏳ **2‑Hour Variant:** Run 0 → 4, slice 5 short, jump to 8.

---

## 🧑‍💻 Prerequisites

### Accounts & Tools

- GitHub account w/ Copilot enabled.
- One of:
  - Local machine: Node.js 18+, Git, VS Code.
  - **OR** GitHub Codespace (recommended for uniformity).
- (Optional Advanced): Azure CLI, GitHub CLI, local Chrome/Chromium (for MCP Playwright).

### Clone / Open

```bash
git clone <your-fork-or-demo-repo-url> demo-copilot-workshop
cd demo-copilot-workshop
npm install
```

### Build Sanity Check

```bash
npm run build --workspace=api
npm run build --workspace=frontend
```

### Codespaces Quick Start

1. Open repo → **Code** → **Codespaces** → Create.  
2. Wait for install; open Copilot Chat (sidebar).  
3. Mark ports **Public**: API (3000), Frontend (e.g., 5137).  
4. (Optional) Switch to Insiders for preview features.  
5. Browser-based Codespaces = no interactive playwright UI; generation-only.

> 🌀 Tip: If something feels slow, *close unused panels*—Agent logs can be chatty.

---

## 🏗️ Project Flyover (Module 0)

| Area | Folder | What To Notice |
|------|--------|----------------|
| API | `api/` | Repos, routes, models, migrations |
| Frontend | `frontend/` | React + Vite + basic product tiles |
| Infra | `infra/` | Deployment script scaffolding |
| Docs | `docs/` | Reference & (now) this workshop guide |

> 🎤 Facilitator Prompt: “Find one file you *think* we’ll modify today. Keep it in mind.”

---

## 🧠 Copilot Modes (Module 1)

| Mode | Use When | Example |
|------|----------|---------|
| Inline | You know what to write; want speed | Autocomplete helper |
| Ask | Need an explanation/Q&A | “Explain this repo layout.” |
| Plan | Want structured steps before changing code | “Plan adding a Cart page.” |
| Agent | Ready to execute multi-step changes/tests | “Implement the Cart plan.” |
| Custom Prompt | Repeatable workflow | Re-run coverage improvement |
| MCP | Extend with external capabilities | Browser test, GitHub ops |

> 🧩 Mini-Exercise (3 min): In pairs, map a real task you do weekly to the best mode.

---

## ✅ First Win: Safe Agent Task (Module 2)

**Goal:** Add a harmless log line via Agent Mode to build trust.

Prompt (Agent Mode):

```text
Add a console log at the start of the suppliers GET route indicating how many suppliers are returned.
```

**Flow:** Review diff → Accept → Build API → (Optional) run & hit endpoint.

> 🎯 Debrief: “What *reassured* you? What *still* feels risky?”

**Badge Unlocked:** 🟩 *Agent Initiated*

---

## 🛒 Feature Build: Cart (Module 4)

**Scenario:** Product listing exists, but no cart. We’ll add: Cart page, NavBar badge, add/remove, subtotal.

### Path A (Beginner Friendly – Guided Prompt File)

If a prompt file (e.g., `demo-cart-page.prompt.md`) exists:

1. Open it → skim frontmatter.
2. Run it in Agent Mode.
3. Verify:
   - New component(s)
   - State wiring
   - Navigation entry

### Path B (Creative Build – Vision Assist)

1. Open Plan Mode.
2. Attach `docs/design/cart.png` (if available).
3. Prompt:

```text
Plan minimal steps to add a Cart page matching image: routing, NavBar badge w/ item count, state mgmt, add/remove interactions. Output numbered steps.
```

1. Switch to Agent Mode:

```text
Implement the plan you just produced.
```

1. Run frontend:

```bash
npm run dev --workspace=frontend
```

1. Interact: Add items → badge updates → open cart page.

> 💬 Reflection Prompt: “Did Agent over-build anything? If yes, how would you constrain next time?”

**Badge Unlocked:** 🟦 *Multi-File Change Navigator*

---

## 🧪 Testing & Self-Healing (Module 5)

**Goal:** Improve coverage + watch Agent iterate.

### Option 1: Use Coverage Prompt

```text
Analyze current API route test coverage. Add tests for error and validation edge cases. Run tests and summarize coverage delta.
```

### Option 2: Custom Prompt File (if provided)

Run `demo-unit-test-coverage.prompt.md`.

Then manually run:

```bash
cd api
npm test
```

If failure occurs, ask:

```text
Explain why test X failed. Propose minimal fix; then apply and re-run only affected tests.
```

> 🛠️ Encourage accepting *partial* value—don’t chase 100% blindly.

**Badge Unlocked:** 🟨 *Confident Test Driver*

---

## 🗂️ Custom Prompts & Handoffs (Module 6)

**Why:** Consistency & team acceleration.

Exercise:

1. Use Plan Mode for a “Profile Page” skeleton.
2. Run a handoff prompt (e.g., `/handoff`).
3. Inspect generated summary file.
4. Agent Mode prompt:

```text
Implement only the skeleton defined in handoff.md—no styling yet. Stop after creating components and routes.
```

> 🔍 Discussion: “How does a handoff file reduce context noise?”

**Badge Unlocked:** 🟪 *Workflow Systematizer*

---

## 🛡️ Optional Track A: Security & Observability (Module 7A)

Prompts:

```text
List top 5 likely security risks in this codebase. Prioritize by impact & ease of remediation.
```

Then:

```text
Generate a safe patch for the highest priority issue. Explain risk before showing code.
```

> ⚠️ Reinforce: Human review still required.

---

## 🌐 Optional Track B: MCP & Browser (Module 7B)

Local environment recommended (Playwright MCP).

1. Start Playwright MCP server (Command Palette → MCP: List Servers → Start). 
2. Prompt:

```text
Create a BDD feature file testing adding two products to the cart and verifying subtotal.
```

3. (If local) Ask Agent to run the scenario; (If Codespaces) just inspect generated steps.

> 🧪 Teaching Moment: “MCP = capability plug-in surface.”

---

## 🎯 Prompt Refinement (Module 8)

Exercise:

1. Enter vague prompt: `Add a cart page`.
1. Ask: `Critique this prompt. What’s missing? Provide an improved version.`
1. Submit improved version.

Checklist for Upgrade:

- Context (what exists) ✅
- Outcome (what good looks like) ✅
- Constraints (don’t over-build) ✅
- Edge Cases (empty cart, duplicate adds) ✅

**Badge Unlocked:** 🟥 *Prompt Architect*

---

## 🚑 Troubleshooting Matrix

| Symptom | Likely Cause | Fast Fix |
|---------|--------------|----------|
| API 404 | Server not running | Start dev task / correct port |
| CORS in browser | API port private (Codespaces) | Make port Public |
| Badge not updating | State not wired to context/provider | Inspect component diff; re-prompt with constraint |
| Agent stalls mid-plan | Overly vague / no actionable steps | Re-run in Plan Mode first |
| Repeated test failure | Flaky assumption in test logic | Ask Agent to stabilize with deterministic input |
| Playwright MCP unavailable | Running in web Codespace | Explain limitation; generate only |

---

## 🧬 Engagement Mechanics (Use As Needed)

| Mechanic | When | Purpose |
|----------|------|---------|
| Badges | Module completion | Motivation |
| Pair & Swap | After Module 4 | Shared learning |
| “Prompt Roast” | Refinement session | Improve clarity |
| Live Poll (“Who feels in control?”) | Mid-point | Gauge confidence |
| Time Boxing (10-min sprint) | Test module | Maintain momentum |

> 💡 Tip: Celebrate *first small success*, not perfection.

---

## 📔 Glossary (Plain Language)

| Term | Meaning |
|------|---------|
| Agent Mode | Copilot executes a multi-step plan & edits code |
| Plan Mode | Copilot drafts steps—no code yet |
| MCP | Extends Copilot with external tools (GitHub, Playwright) |
| Self-Healing | Agent fixes after a failing test run |
| Handoff | Compressed summary for continuation or teammate |
| Coverage | % of code executed by tests |

---

## 🧑‍🏫 Facilitator Playbook

| Phase | Do This | Why |
|-------|---------|-----|
| Before | Pre-run all prompts; cache deps | Avoid cold-start delays |
| Kickoff | Show a *bad* prompt then a refined one | Sets tone for craft |
| Midpoint | Ask for 1 word describing experience | Surface friction |
| Struggle Moments | Encourage rephrasing over abandoning | Teaches steering |
| Wrap | Recap badges earned | Reinforces achievement |

**Energy Intervention Ideas:** quick stretch, rotate pairs, “prompt lightning round.”

---

## 🧩 Stretch Goals

- Generate a GitHub Actions CI workflow.
- Ask: “Produce Terraform or Bicep skeleton for this architecture.”
- Refactor a repository function for clarity with tests guarding behavior.
- Create an internal cheat sheet prompt file.

---

## 📝 Mini Prompt Library (Copy/Paste)

| Scenario | Prompt |
|----------|--------|
| Feature Plan | Plan steps to add a Cart page with routing, NavBar badge, subtotal, and empty-state UX. Keep it minimal; list assumptions. |
| Coverage Boost | Analyze API test coverage and add missing validation + error path tests. Show a summary table. |
| Security Pass | Identify top 5 likely security risks; propose one-line mitigations. |
| Refactor | Refactor the suppliers repository for readability without changing behavior. Add or update tests if needed. |
| Handoff | Summarize our current Cart implementation design, assumptions, and open gaps in a handoff.md file. |

---

## 🧪 Reflection Questions (End)

- What prompt gave you the *best* result today? Why?
- What’s one workflow you’ll automate first next week?
- Where did Agent Mode feel “too confident,” and how will you constrain it next time?

---

## 🎤 Closing Script (Facilitator)

“Today you moved from watching AI to *directing* it. You learned to scope work, review intelligently, and turn repeated effort into reusable prompts. Your next challenge: pick one recurring task tomorrow and let Agent Mode handle the boilerplate while you focus on intent.”

---

## 🔗 Follow-Up Resources

- Official GitHub Copilot Docs
- Internal engineering standards (add links)
- Security hardening checklist (org resource)
- Prompt crafting cheatsheet (to create next!)

---

## ✅ License & Adaptation

Fork, adapt, remix. Keep a CHANGELOG so improvements compound.

---

**You’re Ready. Build Boldly.** 🧠⚡

