# GitHub Copilot Agent Mode: Hands‑On Workshop (Beginner Edition)

> Audience: Developers new to GitHub Copilot, Agent Mode, and (possibly) Visual Studio Code  
> Duration: 3.5–4 hours (flexible; trim optional modules as needed)  
> Delivery: Local VS Code OR GitHub Codespaces (fully supported)  
> Format: Onsite instructor-led, highly interactive, "learn by doing"

---

## 1. Workshop Outcomes

By the end participants will be able to:

1. Set up VS Code or a GitHub Codespace with Copilot (extension, sign-in, enabling Chat & Agent modes).
2. Understand the difference between: Inline Completions, Chat Ask Mode, Plan Mode, Agent Mode, Custom Prompt Files.
3. Use Agent Mode to implement a multi-file feature (Cart).
4. Generate and refine tests; interpret and iterate on failures ("self‑healing").
5. Use a custom prompt for repeatable workflows.
6. (Optional) Explore MCP server usage & GitHub integration (some parts require local environment).
7. (Optional) Trigger CI/CD workflow creation and basic IaC scaffolding.
8. (Optional) Perform a lightweight security analysis + remediation prompt.
9. (Meta) Write clearer prompts using a refinement mode.

---

## 2. High-Level Agenda
| Time | Module | Title | Mode |
|------|--------|-------|------|
| 00:00–00:15 | 0 | Environment Setup & Orientation | Plenary |
| 00:15–00:35 | 1 | Copilot Core Concepts (Mini Tour) | Plenary |
| 00:35–01:10 | 2 | Your First Guided Agent Task | Hands-on |
| 01:10–01:25 | 3 | Break / Q&A | — |
| 01:25–02:05 | 4 | Implement the Cart (Feature Build) | Hands-on |
| 02:05–02:40 | 5 | Test Generation & Coverage Improvement | Hands-on |
| 02:40–03:05 | 6 | Custom Prompts & Handoffs | Hands-on |
| 03:05–03:25 | 7 (Optional Track A) | Security & Observability | Optional |
| 03:05–03:25 | 7 (Optional Track B) | MCP Servers & Browser Testing | Optional |
| 03:25–03:45 | 8 | Prompt Refinement & Wrap-Up | Plenary |
| 03:45–04:00 | Buffer | Troubleshooting / Stretch Goals | Flexible |

> If you only have 2 hours: Run Modules 0–4 + abbreviated Module 5 + brief Module 8.

---

## 3. Prerequisites

### 3.1 Participant Hardware / Accounts
- GitHub account with Copilot enabled (organization license or trial).
- Either:
  - Local laptop with Node.js 18+, Git.
  - OR a GitHub Codespace (recommended for faster onboarding).
- (Optional) Azure CLI & GitHub CLI for advanced deployment module.
- (Optional) Local Chromium/Chrome if you want to run Playwright MCP locally (not available in browser-only Codespaces).

### 3.2 Repository Clone (Local Path)
```bash
git clone <your-fork-or-demo-repo-url> demo-copilot-workshop
cd demo-copilot-workshop
npm install
```

### 3.3 VS Code Extensions (Local)
- GitHub Copilot
- GitHub Copilot Chat
- (Optional) Playwright Test
- YAML (for workflows)

### 3.4 Quick Verification
```bash
npm run build --workspace=api
npm run build --workspace=frontend
```

### 3.5 Running in GitHub Codespaces
If using Codespaces (recommended for onsite workshops to standardize environments):

1. Click Code → Codespaces → Create codespace on main (choose a 4‑core machine or better if many tests).
2. Wait for dependency installation (dev container post-create steps, if any).
3. Ensure ports:
   - API (3000) → set to Public (so frontend can access it without CORS issues).
   - Frontend (e.g., 5137 from Vite) → Public (for participants to open in browser).
4. Open the Copilot Chat panel (left sidebar or View → GitHub Copilot Chat).
5. (Optional) Switch to Insiders web version (gear icon bottom-left → “Switch to Insiders”) if you need preview features (custom chat modes, etc.).
6. Playwright browser-driven MCP demos generally require a local desktop environment. In Codespaces you can still:
   - Generate feature files (BDD mode).
   - Generate Playwright test code.
   - Explain that interactive browser automation is skipped in cloud unless using a headless fallback you preconfigure.
7. Performance tip: close unused editors and panels; Agent Mode tool execution logs can be verbose.

> Provide both paths: “If you’re in a Codespace do X; if local do Y” during facilitator narration.

---

## 4. Orientation (Module 0)
- API project (`api/`) - TypeScript REST endpoints.
- Frontend project (`frontend/`) - React + Vite.
- No existing Cart UI logic (this becomes core hands-on feature).
- Tests exist but limited coverage (opportunity for improvement).

### 4.2 Open VS Code
1. File → Open Folder → Select the cloned repo directory.
2. Open the Command Palette: `Cmd + Shift + P` (macOS) or `Ctrl + Shift + P`.
3. Type "Copilot" to discover:
   - "Copilot: Open Chat"
   - "Prompts: Run Prompt"

### 4.3 Copilot Interface Map
- Inline suggestions (ghost text).
- Side Chat panel (Ask / Plan / Agent).
- Custom prompts (appear as runnable entities).
- Tool execution panel (when Agent Mode runs tasks).

---

## 5. Concepts (Module 1)

| Concept | Simple Definition | Analogy |
|---------|-------------------|---------|
| Inline Suggestion | Predictive code completion | Autocomplete on steroids |
| Ask Mode | Answer questions, single-turn help | Smart Q&A |
| Plan Mode | Structured multi-step reasoning draft | Whiteboard brainstorming |
| Agent Mode | Executes multi-step plan across files & commands | Pair programmer doing tasks |
| Custom Prompt File | Reusable YAML + instructions binding context + tools | Recipe card |
| MCP Server | External capability provider (e.g., GitHub, Playwright) | Plug-in / adaptor |
| Self-Healing | Agent reruns tests & adjusts code automatically | Auto mechanic re-checking engine |

---

## 6. Your First Agent Task (Module 2)

Objective: Build confidence by performing a safe, low-impact change with Agent Mode.

### 6.1 Task
Add a simple logging line to one API route using Agent Mode (instead of manual edit).

### 6.2 Steps
1. Open Chat → Switch to Agent Mode.
2. Prompt:

```text
Add a console log at the start of the suppliers GET route indicating the number of suppliers returned.
```

3. Review proposed changes (Agent will open a diff).
4. Accept change → Run API build:

```bash
npm run build --workspace=api
```

5. (Optional) Run the API:

```bash
npm run dev --workspace=api
```

6. Hit the endpoint in browser or curl; confirm the log output.

### 6.3 Debrief
- Show how multi-file context was not required yet.
- Emphasize review controls (accept/reject).
- Encourage participants: “If nervous, start with read-only improvements.”

---

## 7. Feature Implementation: Cart (Module 4)

> Codespaces note: Ensure API port 3000 and frontend dev server port are Public before testing cart interactions.

Objective: Use Agent Mode + (optionally) Vision to implement a new front-end feature.

### 7.1 Path A (Beginner Friendly – Guided Prompt File)
1. Open `.github/prompts/demo-cart-page.prompt.md`.
2. Read the frontmatter:
   - `mode: agent`
   - Tools declared (file edits, run tests, etc.).
3. Run the prompt (button or Command Palette → "Prompts: Run Prompt").
4. Observe: Agent enumerates tasks → edits multiple files.
5. Accept after verifying:
   - New Cart component/page.
   - NavBar icon badge.
   - State management for cart items.

### 7.2 Path B (Manual + Vision) – If Time
1. Open Chat → Plan Mode.
2. Attach `docs/design/cart.png`.
3. Prompt:

```text
Plan the minimal steps to add a Cart page matching the attached design. Include routing, state management, NavBar icon with item count, add/remove logic.
```

4. Switch to Agent Mode:

```text
Implement the plan.
```

5. Accept changes.
6. Run frontend:

```bash
npm run dev --workspace=frontend
```

7. Test:
   - Add products → confirm badge increments.
   - Navigate to Cart page → confirm total & item list.

### 7.3 Troubleshooting Tips
| Symptom | Cause | Fix |
|---------|-------|-----|
| CORS errors | API port not public / mismatch | Ensure API runs on expected port (see `docker-compose.yml` or dev script) |
| Missing styles | Hot reload not triggered | Stop & restart `npm run dev` |
| Badge not updating | State not wired | Re-run prompt or inspect component state hook |

---

## 8. Tests & Coverage (Module 5)

Objective: Generate and refine tests; observe self-healing.

### 8.1 Fast Start (Recommended)
Run the custom prompt: `.github/prompts/demo-unit-test-coverage.prompt.md`.

### 8.2 Manual Flow (If Teaching Mechanics)
Prompt (Agent Mode):

```text
Analyze current test coverage for API suppliers and products routes. Add missing tests for error cases and validation failures, then run tests.
```

### 8.3 Observe
- New test files in `api/src/repositories` or `api/src/routes` test directories.
- If a test fails, Agent proposes fix → accept.

### 8.4 Run Tests Manually (Confidence)

```bash
cd api
npm test
```

### 8.5 Key Teaching Point
Agent Mode > automates: detect gap → propose code + test → validate → iterate.

---

## 9. Custom Prompts & Handoffs (Module 6)

### 9.1 Show `handoff.prompt.md`
Explain: “Keeps only essential context, discards chat noise.”

### 9.2 Exercise
1. Plan a new feature (e.g., Profile Page) in Plan Mode.
2. Run `/handoff` prompt.
3. Open generated `handoff.md`.
4. Switch to Agent Mode: 

```text
Implement according to handoff.md (start with skeleton only).
```

Cancel early after skeleton to save time.

### 9.3 Discussion
- Context window hygiene.
- Team collaboration pattern.

---

## 10. Optional Tracks (Module 7)

### 10.1 Track A: Security & Observability (Beginner Optional)
Prompt (Ask Mode):

```text
Analyze @workspace for obvious security weaknesses and list prioritized recommendations.
```

Then:

```text
Generate a safe patch for the highest priority issue.
```

### 10.2 Track B: MCP & Playwright (Advanced)
> If in Codespaces (browser): Limit to generating feature files and test code. Full interactive browser automation requires a local environment with the Playwright MCP server.

- Start Playwright MCP server (Command Palette: "MCP: List servers").
- BDD Mode prompt:

```text
Add a feature file to validate adding items to the cart and viewing the cart summary.
```

- Agent / MCP prompt:

```text
Browse to http://localhost:5137 and execute the feature steps.
```

(Explain if environment constraints prevent execution.)

---

## 11. Prompt Refinement & Clarity (Module 8)
Exercise:
1. Use "RefinePrompt" Chat Mode.
2. Enter vague prompt: `Add a cart page`.
3. Examine clarifying questions & clarity score.
4. Provide enriched prompt referencing design + edge cases.
5. Compare improved score.

Teaching: Iterative prompt craftsmanship = better, faster Agent outcomes.

---

## 12. Stretch / Buffer Activities

| Activity | Value |
|----------|-------|
| Generate GitHub Actions workflow for CI | Reinforces automation |
| Create IaC scaffold (Bicep/Terraform) via prompt | Shows broader ecosystem |
| Parallel experimentation (Coding Agent issues) | Illustrates scaling |

---

## 13. Troubleshooting Matrix

| Issue | Likely Root Cause | Quick Fix |
|-------|-------------------|-----------|
| CORS errors in Codespaces | API port not public | Set port 3000 visibility to Public |
| Frontend can’t reach API | Wrong API URL / mismatch | Confirm Vite env config / runtime-config points to correct host |
| Agent stalls on plan | Missing tool permissions / wrong mode | Switch to Agent Mode; re-run |
| Vision not interpreting image | Image not attached | Re-attach via paperclip |
| Playwright demo unavailable | Running in browser Codespace | Explain limitation; show generated test code only |
| Repeated failing test | Logic or flaky assumption | Ask: “Explain why this test fails and propose stable rewrite.” |

---

## 14. Glossary

| Term | Plain Meaning |
|------|---------------|
| Agent Mode | Copilot executes a multi-step plan with tools |
| Plan Mode | Draft mode to structure tasks before execution |
| MCP | Extensibility protocol adding external capabilities |
| Coverage | % of code executed by tests |
| Self-healing | Automated iteration after validation failure |
| Handoff | Condensed context summary for next session or person |

---

## 15. Facilitator Playbook

| Before | During | After |
|--------|--------|-------|
| Test all prompts locally | Time-box each module | Collect feedback |
| Pre-pull dependencies | Celebrate “first success” moments | Provide follow-up resources |
| Preconfigure MCP (if used) | Circulate to unblock quietly | Share advanced track guide |

(Add: Pre-create a shared Codespace template if bandwidth is limited.)

---

## 16. Evaluation (Fast Exit Survey Ideas)
- Confidence (1–5) using Agent Mode?
- Can you describe difference between Ask / Plan / Agent?
- Will you adopt custom prompts in daily flow?
- Biggest remaining concern?

---

## 17. Follow-Up Resources
- Official Copilot docs  
- Internal engineering standards (add your links)  
- Recommended prompt patterns cheat sheet (create internally)  
- Security best-practices reference

---

## 18. Quick Reference Cards (Print or Slide)

### Feature Build (Cart) Micro-Prompt
```
Plan steps to add Cart page + NavBar badge + item add/remove state. Use existing design patterns. Then wait for confirmation before code.
```

### Test Improvement Micro-Prompt
```
Analyze current API route test coverage. Add tests for missing error paths and validation failures. Run tests and report summary.
```

### Security Micro-Prompt
```
List top 5 likely security risks in this codebase and propose minimal, safe patches. Prioritize by impact.
```

---

## 19. Wrap-Up Script (Facilitator)
"Today you moved from zero to shipping a multi-file feature with an AI pair programmer. You practiced shaping prompts, letting the Agent do mechanical work, validating outputs, and iterating safely. Your next step is to identify one repetitive workflow in your day and turn it into a reusable custom prompt."

---

## 20. License / Adaptation
You’re encouraged to fork & adapt this workshop for internal enablement. Keep a CHANGELOG of adjustments to preserve iteration learning.

---

Happy building—whether local or in a Codespace! 🚀