# 🚀 GitHub Copilot Agent Mode Hands‑On Workshop

> **Format:** Onsite, instructor-led, highly interactive, “learn by doing”  
> **Environment:** Local VS Code *or* GitHub Codespaces  
> **Audience:** Developers who have some experience with GitHub Copilot who can learn new capabilities including Agent Mode, custom instructions, coding agent, and MCP.
> **Duration:** 3.5–4 hours 
> **Core Goal:** Leave with understanding of current Copilot capabilities to enable productivity gains in daily work.
---

## 🧭 Why This Workshop Exists

You’ve seen AI generate snippets. Now you’ll experience an AI *teammate* that plans, edits multiple files, runs tools, and iterates. 

We focus on:

- Reducing first-time friction (setup, UI orientation)
- Building something real (Cart feature) collaboratively with Agent Mode
- Improving test coverage and reasoning through failures
- Understand customization options and reinforcing repeatability with custom prompts & handoffs
- Working with coding agent and code review agent
- Optional tracks: security, MCP, CI/CD

---

## 🎯 Outcomes (You Will Be Able To...)

1. Spin up a ready-to-code environment in **local VS Code or Codespaces**.
2. Distinguish **Ask vs Edit vs Agent vs Custom Modes** and choose the right one.
3. Use Agent Mode to implement a multi-file feature (Cart) from a design.
4. Generate, run, and refine tests — embracing *self-healing*.
5. Capture reusable workflows via **custom prompt files**.
6. Use Coding agent and code review agent to work asynchronously.
7. (Optional) Explore **MCP Servers**, GitHub automation & security prompts.
8. Refine vague prompts into precise, high-impact instructions.

> 🔄 Mindset Shift: You aren’t delegating *creativity*—you’re delegating *mechanical labor*.

---

## 🗺️ Agenda At a Glance

This workshop will start with 1 - 1.5 hours of instructor-led presentations and demos, followed by 2 hours of hands-on exercises (module details below). The schedule is flexible to allow for Q&A and discussion.  We will wrap up with a discussion on use cases that have been successful in your organization.

### Workshop Modules

| Module | Theme | Energy Marker |
|--------|-------|---------------|
| 0 | Introduction | 👋 Icebreaker |
| 1 | First Agent Task | ✅ Safe Win |
| 2 | Cart Feature Build | 🛠️ Flow Zone |
| 3 | Test Coverage Boost | 🧪 Confidence |
| 4 | Context and Custom Prompts | 🗂️ Optimize |
| 5 | Coding Agent & Code Review Agent | 🤖 Assist |
| 6 | Prompt Refinement | 🎯 Mastery |
| 7A | Security/Observability (Opt) | 🛡️ Insight |
| 7B | MCP & Browser Testing (Opt) | 🌐 Extend |
| Buffer | Stretch / Feedback | 🔁 Close |

---

## 🧑‍💻 Prerequisites

### Accounts & Tools

- GitHub account w/ Copilot enabled.
- One of:
  - Local machine: Node.js 18+, Git, VS Code.
  - **OR** GitHub Codespace (recommended for uniformity).
- (Optional Advanced): Azure CLI, GitHub CLI, local Chrome/Chromium (for MCP Playwright).

> ⚠️ **Important:** These next steps are only required if you are *not* in a pre‑configured Codespace.
>
> Follow them to prepare your local environment (install Node.js, Git, and VS Code; ensure ports are reachable). If you're inside a pre‑configured Codespace, you can safely skip this section.

#### Clone / Open

```bash
git clone <your-fork-or-demo-repo-url> demo_copilot_agent
cd demo_copilot_agent
npm install
```

#### Build Sanity Check

```bash
npm run build --workspace=api
npm run build --workspace=frontend
```

### Codespaces Quick Start

1. Open repo → **Code** → **Codespaces** → Create.  
2. Wait for install; open Copilot Chat (sidebar).  
3. Mark ports **Public**: API (3000), Frontend (e.g., 5137).  
4. Browser-based Codespaces = no interactive playwright UI; generation-only.

> 🌀 Tip: If something feels slow, *close unused panels*—Agent logs can be chatty.

---

## 🏗️ Introduction (Module 0)

This application is a simplified e-commerce site with a backend API and a React frontend.  It has a basic product listing, but no cart functionality.  We will be adding that in this workshop.  An overview of the repo structure is below:

| Area | Folder | What To Notice |
|------|--------|----------------|
| API | `api/` | Routes, models, migrations |
| Frontend | `frontend/` | React + Vite + basic product tiles |
| Infra | `infra/` | Deployment script scaffolding |
| Docs | `docs/` | Reference documentation & this workshop guide |

We will be using various Copilot modes throughout the workshop.  A quick reference of when to use each mode is below:

| Mode | Use When | Example |
|------|----------|---------|
| Code Completion | You know what to write; want speed | Autocomplete helper |
| Inline Chat | Quick questions while in a section of code | Quick fix or clarification |
| Ask | Need an explanation/Q&A | “Explain this repo layout.” |
| Edit | Multi-file changes without looping | “Update this variable name to be ...” |
| Custom Mode (Plan) | Want structured steps before changing code | “Plan adding a Cart page.” |
| Agent | Ready to execute multi-step changes/tests | “Implement the Cart plan.” |
| Custom Prompt | Repeatable workflow | Re-run coverage improvement |
| MCP | Extend with external capabilities | Browser test, GitHub ops |

> 🧩 Mini-Exercise: Map a real task you do weekly to the best mode.

---

## ✅ First Win: Safe Agent Task (Module 1)

**Goal:** Introduce Agent Mode.  Add a harmless log line via Agent Mode to build trust.

In chat, switch to Agent mode and enter the following prompt:

```text
Add a console log at the start of the suppliers GET route indicating how many suppliers are returned.
```

* Review the diff of proposed changes
* Run the API to verify the changes haven't broken anything.  

```bash
npm run dev --workspace=api
```

* In a new terminal, hit the endpoint.  Return to the first terminal to see the log.

```bash
curl http://localhost:3000/api/suppliers
```

You should see a log line like `[Suppliers GET] Returning 3 suppliers` in your `npm run dev` terminal.

> If this request works, but you get 0 suppliers, you likely just need to initialize the database:  `npm run db:init --workspace=api`

* If satisfied, click `Keep` to accept the changes.  


> 🎯 Debrief: “This is the basic workflow for using Agent Mode.  It generates code, you iterate, review, and accept (or discard)”

        * Agent mode gives the ability to execute in a loop, first understanding your request, looking for relevant context in your codebase, proposing code, and the ability to execute commands to execute tests and validate work.  

**Badge Unlocked:** 🟩 *Agent Initiated*

---

## 🛒 Feature Build: Cart (Module 2)

**Scenario:** This is a more advanced usage of agent mode where we will create a new feature.  The product listing exists in this application, but no shopping cart. We’ll add: Cart page, NavBar badge, add/remove capability, and subtotal.

* If your API is still running from the previous module, stop it (Ctrl + C)
  * If it is running, the next time you run `npm run dev` it will have a port conflict
* Clear your previous chat history (`+` icon in the top of the chat panel)
* Change from `Agent` mode to `Plan` mode
  Plan mode is a custom mode that we have created.  Custom modes influence the prompt that you send.  It allows for more structured planning before implementation.  If interested, take a look at the custom mode file in `.github/chatmodes/Plan.chatmode.md`
* Attach `docs/design/cart.png`.  This allows Copilot with Vision mode to see the design we want to implement.  (You can drag and drop the file into the chat panel)
* Prompt to create a plan for implementing the cart page:

```text
Plan minimal steps to add a Cart page matching image: routing, NavBar badge w/ item count, state mgmt, add/remove interactions. Output numbered steps.
```

* Switch to Agent Mode for execution.  Also switch the model being used to `Claude Sonnet 4`.  GPT-4.1 and Claude Sonnet 4 perform similarly.  However, Claude Sonnet 4 is likely to continue iterating on a problem longer without additional prompting.  Prompt as follows:

```text
Implement the plan you just produced.
```

This should iterate thought the steps of producing the cart page.  You may need to prompt a few times if it stops early.  Once complete you can run and test the application:

```bash
npm run dev
```

* Open the preview (in Codespaces) or connect to localhost if running locally.  Go to the product page, add some items, and see the cart badge update with the item count.  Open the cart page to see the contents you've added.

If you are happy with the changes, click `Keep` to accept the changes.  If not, feel free to iterate with further prompting to get the desired result.

> 💬 Reflection Prompt: “Did Agent complete everything or did it need some prompting?  Different models iterate differently, but you can always change models at any time.”

Rather than freeform prompting, you can use a prompt files in agent mode to execute tasks.  We will cover that in the next module.  If interested, you can review a prompt file created for this module which would implement the feature: `.github/prompts/demo-cart-page.prompt.md`.

> 🎯 Debrief: “The benefit of agent mode is it can run in a loop as well as execute commands and interact with your terminal.  This allows Copilot to not only write the code, but also run the app and verify it starts correctly.”

**Badge Unlocked:** 🟦 *Multi-File Change Navigator*

---

## 🧪 Testing & Self-Healing (Module 3)

**Scenario:** You have walked through freeform prompting with agent mode.  This module will use a prompt file instead.  Prompt files give the ability to execute the same prompt multiple times (reusability).  It also gives a documented prompt for implementation for a single use.  In this module we will improve test coverage of the API routes.

* Clear your previous chat history (`+` icon in the top of the chat panel)
* Ensure you are in `Agent` mode and select the `Claude Sonnet 4` model
* Review the existing prompt file: `.github/prompts/demo-unit-test-coverage.prompt.md`
* Execute the prompt doing one of the following:
  * With the prompt file open in your IDE, click the play button in the top right of the editor window
  * Open the command palette (Cmd/Ctrl + Shift + P), select `Chat: Run Prompt...`, and select the prompt file
  * In the chat panel type `/demo-unit-test-coverage`.  The name of the prompt file is a shortcut to run it.

A few notes on this run:
* You will likely get prompted to run a command to execute tests.  This is expected.  Copilot requires approval for the commands it runs.  There are ways to auto-approve for trusted prompts, but we want to be cautious.
* When executing tests, Copilot agent mode cannot continue until the terminal command completes.  You will likely need to press `q` in the terminal to exit the coverage report and return to the prompt.  We could improve our prompting to avoid this.
* If using GPT 4.1 it will likely stop and ask if you'd like it to do more.  Claude is more likely to just work to completion.  

If you want to test coverage yourself you can run:

```bash
npm run test:coverage --workspace=api
```

* If you are happy with the changes, click `Keep` to accept the changes.  If not, feel free to switch to freeform prompting to iterate to get the desired result.

> 🛠️ Prompt files help build reusability and document features as you build.  Freeform prompting is better when the outcome is less known or to iterate to finish up a task.

> 🎯 Using `Plan` mode or just having Copilot build a plan allows you to see up front what Copilot will be doing.  This allows you to iterate on that plan interactively with Copilot and improves the chances of success when you ask it to implement (via prompt file or freeform).  


**Badge Unlocked:** 🟨 *Confident Test Driver*

---

## 🗂️ Context and Custom Prompts (Module 4)

**Why:** If you don't have context of the application or an enterprises standards, you are unlikely to write code successfully the first time.  Copilot is no different.  Providing this context helps with consistency & team acceleration.  Examples of context include:

- Application architecture (e.g., microservices, monolith)
- Team conventions (e.g., folder structure, naming conventions)
- Business logic (e.g., user roles, permissions)
- Standards (e.g., security, observability)
- Internal tools (e.g., custom libraries, frameworks, APIs)

A typical way to add context is to drag and drop files or folders into the chat window.  However, that takes manual effort and isn't possible when agents are executing.  Beyond that, we will focus on two ways to provide context:
1. **Custom Instructions**: These are global to your Copilot experience meaning they get included with every chat interaction.  They are a great way to provide high level context to inform Copilot of your application, team, standards, and other information that isn't public knowledge.
2. **Handoff files**: These can be created via prompt file to provide context for your chat session.  They are task-specific and are a great way to transfer key points to a new chat window, handoff to another developer, or handoff to an agent.  

### Custom Instructions

Custom Instructions can be stored in a file in your repo so that anyone working in the repo has the same context.  The file is `.github/copilot/copilot-instructions.md`.  You can also set them globally in your Copilot settings, but that is per user and not shared.  The file is markdown so the format is flexible.  In this scenario we will add a custom instruction to inform Copilot of our observability standards using a fictitious example.

* Examine the existing custom instructions in `.github/copilot/copilot-instructions.md`
* Review `docs/tao.md` to understand our observability framework.
* Add the following section to the `copilot-instructions.md` file:
```markdown
# Additional Guidelines for REST APIs

For REST APIs, use the following guidelines:

* Use descriptive naming
* Add Swagger docs for all API methods
* Implement logging and monitoring using [TAO](../docs/tao.md)
  - assume TAO is installed and never add the package
```

* Clear your previous chat history (`+` icon in the top of the chat panel)
* Ensure you are in `Agent` mode and select the `Claude Sonnet 4`
* Prompt Copilot to add observability to the suppliers route: 
```text
Add observability to the Supplier route using our internal standards
```
* Review the proposed changes.  You should see it has added logging, metrics, and tracing to the route.
* As this is a fictitious example, you can choose `Discard` to not keep the changes.
* Clean up your custom instructions by removing the section you added.

Note that beyond the global instructions file you can also create path-specific instructions by adding several files in .github/instructions/NAME.instructions.md.  For example, only apply these instructions to typescript files (*.ts, *.tsx).  See the [documentation](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) for more details.

### Handoff Files

Sometimes your chat gets a bit long and reduces performance.  Other times you want to handoff to a teammate or start a new chat session.  Handoff files are a great way to compress the context of your chat into a markdown file that can be shared or re-ingested into a new chat session.

To facilitate this, we have created a prompt file `.github/prompts/handoff.prompt.md` that will generate a handoff file for a planned feature to implement a profile page.  

* Clear your previous chat history (`+` icon in the top of the chat panel)
* Ensure you are in `Plan` mode and prompt as follows:
```text
Create a plan for steps needed to add a profile page with user details, edit capability, and profile picture upload.
```
* Run a handoff prompt by using a slash command in the chat:
```text
/handoff
```
* Inspect generated summary file.  Note you could take this to a new chat session, hand it off to a teammate, or add it as an issue for coding agent to pick up. 
* If interested in implementing directly, just ask:
```text
Implement only the skeleton defined in handoff markdown.  No styling yet. Stop after creating components and routes.
```

> 🔍 Outcome: “Custom instructions allows teams to encode their specific practices, internal libraries, and coding standards.  Handoff files can summarize chats and enable passing context onto another.  The handoff prompt could also be instructed to write to a prompt file for execution”

**Badge Unlocked:** 🟪 *Context King*

---

## 🤖 Coding Agent & Code Review Agent (Module 5)

**Scenario:** Agent mode is great, but it's not always fun to watch the agent run.  You have better things to do!  You want to delegate coding of a new feature or bug fix to Copilot while you focus on higher-value work.  Coding agent allows you to do this by creating an issue with a prompt that Copilot can pick up and implement.  Once done, code review agent allows you to have Copilot review the code changes and suggest improvements.

Here we are going to use a prompt file from our cart page implementation to show how this could be created by coding agent asynchronously.

* Open the file `.github/prompts/demo-cart-page.prompt.md` and review the prompt.  
* Copy the contents of the prompt file to your clipboard.
* Go to your GitHub repo and create a new issue.  Title it `YOUR USERNAME: Implement Cart Page` and paste the prompt file contents into the issue body.  
* Save the issue
* Assign the issue to `Copilot`.  This will assign the issue to coding agent.
* Scroll down to the bottom and you should see a pair of eyes in the comments section.  This indicates coding agent has picked up the issue and is working on it.
* You should see a link to the draft pull request.  Click on it to see the progress.  Note you can click on `View session` to see step-by-stem progress during execution.  This can also be used after the fact to see what the agent did.  
* Once it has completed the pull request it will assign you to review changes.  
* Here we will assign Copilot to review the changes.  Typically you wouldn't have a developer review their own code, but in the case of Copilot the review is with a different perspective and it doesn't have any bias or knowledge of what it wrote.  
  * In the upper right under `Reviewers`, click on the gear and select `Copilot`.
* Once copilot reviews the code you can see its feedback and suggested changes.  You can choose to accept or reject the changes. 
* If you want the agent to do additional work, just add a comment and at-mention Copilot: `@Copilot can you implement the code review changes?`

> 🔍 Outcome: “Coding agent allows you to assign tasks to Copilot to work asynchronously instead of watching it execute in the IDE.  This frees up your time - just assign your work to Copilot and take a coffee break.  You deserve it!”

> 🔍 Outcome: “Code review agent provides reviews of any human or AI generated code.  It can be auto-assigned to review all pull requests and gives a simple and quick first pass to identify any issues”

> 🚀 Want more time with coding agent?  Check out .github/prompts/demo-cca-parallel.prompt.md for an example using Copilot to expiriment on 3 different variations of a Cart page.  Running this requires GitHub Remote MCP server to be running (.vscode/mcp.json) and takes about 20 minutes to complete.  

---

## 🎯 Prompt Refinement (Module 6)

**Goal:** Improve your ability to write clear, actionable prompts that lead to high-quality results.  The quality of AI-generated code is heavily influenced by the clarity and specificity of your prompts. Vague or ambiguous prompts can lead to suboptimal outcomes, requiring more iterations and corrections. Copilot can help by providing suggestions and improvements to your prompts. 

* Review the Refine Prompt Chat mode file: `.github/chatmodes/RefinePrompt.chatmode.md`
* Clear your previous chat history (`+` icon in the top of the chat panel)
* Switch to `RefinePrompt` chat mode
* Enter a vague prompt: `Add a cart page`
  * You should get some clarifying questions and a low clarity score
* Ask for assistance: `Critique this prompt. What’s missing? Provide an improved version.`
* Alternatively you can create a more detailed prompt yourself and ask for review:
  * Attach the cart image `docs/design/cart.png` to provide context
  * Enter a more detailed prompt.  For example:
```text
I want a cart Page that shows the items in the cart currently using the attached image for design elements. Match dark/light modes. Show a shipping fee of $25 but free for orders over $150. Add a cart icon to the NavBar that shows the number of items in the cart and updates when items are added/removed. When the icon is clicked, navigate to the Cart page.
```
* Note the higher clarity score.  

Checklist for a Prompt:

- Context (what exists and is relevant) ✅
- Outcome (what good looks like) ✅
- Constraints (don’t over-build) ✅
- Edge Cases (empty cart, duplicate adds) ✅

**Badge Unlocked:** 🟥 *Prompt Architect*

---

## 🛡️ Optional: Security & Observability (Module 7A)

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

## 🌐 Optional: MCP & Browser (Module 7B)

Local environment recommended (Playwright MCP).

1. Start Playwright MCP server (Command Palette → MCP: List Servers → Start). 
2. Prompt:

```text
Create a BDD feature file testing adding two products to the cart and verifying subtotal.
```

3. (If local) Ask Agent to run the scenario; (If Codespaces) just inspect generated steps.

> 🧪 Teaching Moment: “MCP = capability plug-in surface.”

---

## 🚑 Troubleshooting Matrix

| Symptom | Likely Cause | Fast Fix |
|---------|--------------|----------|
| API 404 | Server not running | Start dev task / correct port |
| CORS in browser | API port private (Codespaces) | Make port Public |
| `npm run dev` fails | Port conflict - already running in other terminal | Stop other task (Ctrl + C) |
| Badge not updating | State not wired to context/provider | Inspect component diff; re-prompt with constraint |
| Agent stalls mid-plan | Overly vague / no actionable steps | Re-run in Plan Mode first |
| Repeated test failure | Flaky assumption in test logic | Ask Agent to stabilize with deterministic input |
| Playwright MCP unavailable | Running in web Codespace | headless - limited to generating only |

---

## 📔 Glossary (Plain Language)

| Term | Meaning |
|------|---------|
| Agent Mode | Copilot executes a multi-step plan & edits code |
| Plan Mode | Copilot drafts steps — no code yet |
| MCP | Extends Copilot with external tools (GitHub, Playwright) |
| Self-Healing | Agent fixes after a failing test run |
| Handoff | Compressed summary for continuation or teammate |
| Coverage | % of code executed by tests |

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

## 🎤 Closing Script 

“Today you moved from watching AI to *directing* it. You learned to scope work, review intelligently, and turn repeated effort into reusable prompts. Your next challenge: pick one recurring task tomorrow and let Agent Mode handle the boilerplate while you focus on intent.”

---

## 🔗 Follow-Up Resources

- [Awesome Copilot Prompt and Instruction Library](https://github.com/github/awesome-copilot)
- [Official GitHub Copilot Docs](https://docs.github.com/en/copilot)

---

**You’re Ready. Build Boldly.** 🧠⚡

