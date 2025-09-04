# 🚀 GitHub Copilot Agent Mode Hands‑On Workshop

> **Format:** Onsite, instructor-led, highly interactive, “learn by doing”  
> **Environment:** Local VS Code *or* GitHub Codespaces  
> **Audience:** Developers new to Copilot, Agent Mode, and possibly VS Code  
> **Duration:** 3.5–4 hours (with optional trims)  
> **Core Goal:** Leave with practical confidence using Agent Mode to build, test, refactor, and automate.

## 📚 Quick Navigation

| Section | Focus | Time |
|---------|-------|------|
| [Why This Workshop](#-why-this-workshop-exists) | Context & motivation | 5 min |
| [Learning Outcomes](#-learning-outcomes--success-criteria) | Goals & success metrics | 10 min |
| [Agenda](#️-agenda-at-a-glance) | Schedule overview | 5 min |
| [Prerequisites](#-prerequisites--accessibility) | Setup & accessibility | 15 min |
| [Modules 0-8](#️-project-flyover-module-0) | Core workshop content | 3+ hours |
| [Troubleshooting](#-extended-troubleshooting-guide) | Problem solving | As needed |
| [Reflection](#-enhanced-reflection--self-assessment) | Assessment & planning | 15 min |

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

## 🎯 Learning Outcomes & Success Criteria

By the end of this workshop, you will demonstrate measurable competency in:

### Core Competencies (Required)
- [ ] **Environment Mastery**: Successfully set up and validate development environment (local VS Code or Codespaces) with all services running
- [ ] **Mode Selection**: Correctly identify and choose between Ask/Plan/Agent modes for 3 different scenarios (80% accuracy)
- [ ] **Feature Implementation**: Use Agent Mode to implement the Cart feature meeting all acceptance criteria (see Module 4)
- [ ] **Test-Driven Development**: Generate, execute, and iterate on tests with >70% code coverage improvement
- [ ] **Workflow Automation**: Create and execute at least 1 reusable custom prompt file
- [ ] **Prompt Engineering**: Transform 3 vague prompts into precise, actionable instructions using the refinement framework

### Advanced Competencies (Optional)
- [ ] **Security Awareness**: Identify and mitigate 2+ security risks using Agent Mode assistance
- [ ] **External Integration**: Successfully configure and use 1 MCP server extension
- [ ] **CI/CD Automation**: Generate functional GitHub Actions workflow or deployment script

### Success Metrics
- **Completion Rate**: 80% of required competencies demonstrated
- **Quality Standard**: All generated code passes linting and builds successfully  
- **Practical Application**: Able to use learned workflows in real projects within 1 week
- **Confidence Level**: Self-report 7/10 or higher confidence in using Agent Mode independently

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

## 🧑‍💻 Prerequisites & Accessibility

### Technical Requirements

- GitHub account with Copilot enabled
- One of:
  - **Local machine**: Node.js 18+, Git, VS Code with Copilot extension
  - **OR GitHub Codespace** (recommended for consistency across participants)
- (Optional Advanced): Azure CLI, GitHub CLI, local Chrome/Chromium (for MCP Playwright)

### Accessibility & Learning Accommodations

- **Visual**: Screen reader compatible; high contrast mode available in VS Code
- **Motor**: All exercises work with keyboard navigation; mouse interactions are optional
- **Cognitive**: Self-paced modules with clear checkpoints; repeat exercises encouraged
- **Technical Background**: No prior AI/ML knowledge required; basic web development helpful but not essential
- **Time Zones**: Async-friendly exercises; recordings available for review

### Experience Levels Supported
- **Beginner**: Guided prompt files and step-by-step instructions provided
- **Intermediate**: Choose-your-own-path options with creative freedom
- **Advanced**: Optional deep-dive tracks (security, MCP, CI/CD)

### Pre-Workshop Setup (15 minutes)

**Repository Setup**
```bash
# Clone the workshop repository
git clone https://github.com/cheeragpatel/demo_copilot_agent demo-copilot-workshop
cd demo-copilot-workshop

# Install dependencies
npm install

# Verify Node.js version (should be 18+)
node --version
```

**Environment Validation**
```bash
# Test API build
npm run build --workspace=api

# Test Frontend build  
npm run build --workspace=frontend

# Initialize database (if needed)
npm run db:init --workspace=api

# Quick smoke test
npm run test:api
```

**VS Code Extensions (Local Setup)**
- GitHub Copilot (required)
- GitHub Copilot Chat (required)  
- Prettier (recommended)
- GitLens (optional)

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


### 📋 Cart Feature Acceptance Criteria

**Must Have (Core MVP)**
- [ ] **Cart Page**: Dedicated route `/cart` displaying added items
- [ ] **Navigation Integration**: NavBar shows cart badge with item count (0-99+)
- [ ] **Add to Cart**: Click product tile → item appears in cart with quantity
- [ ] **Remove from Cart**: Remove individual items or adjust quantities
- [ ] **Subtotal Calculation**: Real-time price calculation including tax/shipping if applicable
- [ ] **Empty State**: User-friendly message when cart is empty
- [ ] **Persistence**: Cart contents survive page refresh (localStorage minimum)

**Should Have (Enhanced UX)**
- [ ] **Quantity Controls**: +/- buttons for quantity adjustment
- [ ] **Duplicate Handling**: Adding same product increases quantity vs creates duplicate
- [ ] **Visual Feedback**: Loading states, success messages, error handling
- [ ] **Responsive Design**: Works on mobile and desktop
- [ ] **Accessibility**: Screen reader friendly, keyboard navigation

**Error Scenarios**
- [ ] **Network Issues**: Graceful handling if API calls fail
- [ ] **Invalid Data**: Handle missing product info or corrupted cart data
- [ ] **Edge Cases**: Zero quantity, negative prices, out-of-stock items

### Implementation Paths
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

## 🚑 Extended Troubleshooting Guide

### Environment Issues
| Symptom | Likely Cause | Fast Fix | Prevention |
|---------|--------------|----------|------------|
| API 404 | Server not running | `npm run dev:api` / check port 3000 | Always run build sanity check first |
| CORS in browser | API port private (Codespaces) | Make port Public in Ports tab | Set ports to Public by default |
| `npm install` fails | Node version mismatch | Use Node 18+ or nvm | Check `.nvmrc` file for version |
| Docker containers won't start | Port conflicts or insufficient memory | Stop other services; increase Docker memory | Use `docker-compose down` before starting |
| VS Code Copilot not responding | Extension needs reload | Cmd/Ctrl+Shift+P → "Reload Window" | Check Copilot status in status bar |

### Agent Mode Issues  
| Symptom | Likely Cause | Fast Fix | Better Prompting |
|---------|--------------|----------|------------------|
| Agent stalls mid-plan | Overly vague / no actionable steps | Re-run in Plan Mode first | Add specific constraints and examples |
| Badge not updating | State not wired to context/provider | Inspect component diff; re-prompt with constraint | Specify exact state management approach |
| Repeated test failure | Flaky assumption in test logic | Ask Agent to stabilize with deterministic input | Request specific test data and mocking |
| Agent makes too many changes | Scope creep in prompt | Use `git checkout` to revert; add constraints | Start with "Make minimal changes to..." |
| Generated code doesn't match design | Missing visual context | Attach design files; describe layout | Include specific UI requirements |

### Advanced Features
| Symptom | Likely Cause | Fast Fix | Alternative |
|---------|--------------|----------|-------------|
| Playwright MCP unavailable | Running in web Codespace | Explain limitation; generate only | Use local VS Code or plain test generation |
| GitHub CLI commands fail | Authentication not set up | `gh auth login` | Use web interface for GitHub operations |
| Security prompts too generic | Lacking codebase context | Point to specific files/functions | Use targeted security linting tools |

### Getting Help
- **During Workshop**: Raise hand or use chat function
- **Stuck on Exercise**: Skip and return later; all modules can be done independently  
- **Technical Issues**: Pair with neighbor or ask instructor for 1:1 debugging
- **Accessibility Needs**: Contact facilitator for alternative approaches

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
n---

## ❌ Prompt Anti-Patterns & Risk Mitigation

### What NOT to Do with Agent Mode

| Anti-Pattern | Why It Fails | Better Approach | Risk Level |
|--------------|--------------|-----------------|------------|
| "Build me an app" | Too vague; no constraints | Start with specific feature/component | 🔴 High |
| "Fix all bugs" | Undefined scope; may break working code | Target specific failing tests | 🔴 High |
| "Make it production-ready" | Subjective; lacks criteria | Define specific production requirements | 🟠 Medium |
| "Add security" | Generic; may over-engineer | "Review authentication in login.js" | 🟠 Medium |
| "Refactor everything" | Too broad; high change risk | "Refactor UserService for readability" | 🟠 Medium |
| "Make it faster" | No baseline; unclear metrics | "Optimize API response time <200ms" | 🟡 Low |

### Governance Guidelines

**When to Use Agent Mode**
- ✅ Well-defined, isolated tasks
- ✅ Boilerplate code generation
- ✅ Test creation for existing code
- ✅ Documentation updates
- ✅ Refactoring with clear constraints

**When NOT to Use Agent Mode**
- ❌ Mission-critical production code without review
- ❌ Security-sensitive authentication/authorization logic
- ❌ Database schema changes
- ❌ Major architectural decisions
- ❌ Code you don't understand enough to review

**Risk Mitigation Strategies**
1. **Start Small**: Begin with low-risk changes to build trust
2. **Review Everything**: Never accept changes without understanding them
3. **Test Immediately**: Run tests and builds after each Agent session
4. **Version Control**: Commit working state before major Agent tasks
5. **Pair Review**: Have teammate review Agent-generated code
6. **Rollback Plan**: Know how to revert changes quickly

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

## 🧩 Advanced Stretch Goals

### For Fast Finishers
If you complete the core modules early, try these progressively challenging exercises:

**Level 1: Automation** (15-20 minutes)
- [ ] Generate a GitHub Actions CI workflow that runs tests and builds on PR
- [ ] Create deployment scripts for the frontend to GitHub Pages or Netlify
- [ ] Build a development environment setup script for new team members

**Level 2: Architecture** (20-30 minutes)  
- [ ] Ask Agent to "Produce Terraform or Bicep skeleton for this architecture"
- [ ] Design and implement a simple caching layer for API responses
- [ ] Create API documentation using OpenAPI/Swagger with Agent assistance

**Level 3: Quality & Governance** (25-35 minutes)
- [ ] Implement comprehensive error boundary components for the React app
- [ ] Refactor a repository function for clarity with comprehensive test coverage
- [ ] Create security scanning and vulnerability assessment prompts
- [ ] Build a code review checklist generator based on repository patterns

**Level 4: Team Enablement** (30+ minutes)
- [ ] Create an internal cheat sheet prompt file for your team's coding standards
- [ ] Design onboarding prompts for new developers joining the project
- [ ] Build Agent-powered code migration scripts for framework updates
- [ ] Create custom MCP server integration for team-specific tools

### Challenge Modes
For those seeking extra complexity:

**Speed Challenge**: Complete Cart feature in under 30 minutes with full test coverage
**Constraint Challenge**: Build Cart feature with zero external dependencies added
**Accessibility Challenge**: Implement Cart with AAA compliance and screen reader testing

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

## 🧪 Enhanced Reflection & Self-Assessment

### Immediate Reflection (End of Session)
Rate your confidence (1-10) and provide specific examples:

**Technical Competency**
- [ ] Environment setup and troubleshooting: ___/10
  - Example challenge overcome: _______________
- [ ] Choosing appropriate Copilot mode: ___/10  
  - Best mode selection decision: _______________
- [ ] Writing effective prompts: ___/10
  - Most improved prompt iteration: _______________
- [ ] Reviewing and refining Agent output: ___/10
  - Example of good catch/improvement: _______________

**Strategic Understanding**  
- [ ] When to use vs avoid Agent Mode: ___/10
- [ ] Risk assessment of AI-generated code: ___/10
- [ ] Breaking down complex tasks into Agent-friendly chunks: ___/10

### Practical Application Planning
- **What prompt gave you the *best* result today? Why?**
  _______________________________________________

- **What's one workflow you'll automate first next week?**
  _______________________________________________

- **Where did Agent Mode feel "too confident," and how will you constrain it next time?**
  _______________________________________________

- **What's your biggest concern about using Agent Mode in real projects?**
  _______________________________________________

- **Which acceptance criteria approach will you adopt for your team?**
  _______________________________________________

### 30-Day Follow-Up Commitment
- [ ] I will try Agent Mode on a real work task within 1 week
- [ ] I will create my first custom prompt file within 2 weeks  
- [ ] I will share learnings with my team within 30 days
- [ ] I will participate in follow-up survey to improve this workshop

### Success Metrics Achievement
- [ ] Core competencies completed: ___/6
- [ ] Advanced competencies completed: ___/3  
- [ ] Overall confidence using Agent Mode independently: ___/10
- [ ] Likelihood to recommend this workshop: ___/10

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

