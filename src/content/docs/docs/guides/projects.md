---
title: Projects
description: Organize your work with Mission Clawtrol projects. Each project has its own task board, cost tracking, and agent context.
---

# Projects

Projects organize your work in Mission Clawtrol. Each project has its own task board, cost tracking, agent context, and settings.

## Creating a Project

Click **New Project** in the sidebar (or navigate to **Projects → New**).

### Project Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Short slug-style name (e.g., `my-saas-app`) |
| **Display Name** | No | Friendly name shown in the UI |
| **Description** | Yes | What are you building? This feeds into the PROJECT.md |
| **Tech Stack** | No | Languages, frameworks, key tools |
| **Git Repository** | No | URL — agents will clone this and commit to it |
| **Working Directory** | No | Local path where agents write files |

After creation, Mission Clawtrol generates a `PROJECT.md` file. Every agent reads this file before starting work on any task in the project.

---

## PROJECT.md

`PROJECT.md` is the single most important file in any project. It gives agents the context they need to work effectively.

### Default Structure

```markdown
# Project: My SaaS App

## Overview
A subscription SaaS platform for [X].

## Tech Stack
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Frontend: React + Vite + Tailwind CSS
- Auth: JWT (HS256)
- Hosting: DigitalOcean App Platform

## Repository Structure
src/
  api/        # Express routes
  models/     # Prisma models
  services/   # Business logic
  middleware/ # Auth, logging, etc.
frontend/
  src/
    components/
    pages/

## Coding Standards
- All files in TypeScript (strict mode)
- Tests required for all business logic (Jest)
- No `any` types
- Conventional commits

## Key Decisions
- Using HS256 JWT (not RS256) — simpler for single-server deploy
- Soft deletes on all user data (GDPR)
- Rate limiting on all /api/* routes

## Do Not
- Modify the database schema without explicit instruction
- Add packages without approval
- Commit .env files
```

### Editing PROJECT.md

Edit it directly from the dashboard (Projects → select project → **Edit Context**) or by editing the file on disk.

Changes take effect immediately — the next agent task will use the updated context.

**Tip:** Keep PROJECT.md updated as your project evolves. Add key decisions, document patterns, note things agents frequently get wrong.

---

## Agent Assignments Per Project

You can configure which agents are active for a project, and which model each uses.

Navigate to **Project Settings → Agents**:

- **Enable/disable** specific agents for this project
- **Override model** — use a cheaper model for simpler projects
- **Project-specific system prompt** — append additional instructions to all agents in this project

Example: For a documentation-only project, you might disable the Developer agents and only enable Editor, Researcher, and PM.

---

## Cost Tracking Per Project

Mission Clawtrol tracks token usage and cost at the task level and rolls it up to the project.

### What's Tracked

- **Tokens in / tokens out** — per API call, per task, per agent, per project
- **Model cost** — calculated at current API pricing for your configured models
- **Duration** — wall-clock time tasks spent In Progress
- **Agent breakdown** — which agent spent what in this project

### Cost Views

From the project page, click **Cost Summary**:

| View | Description |
|------|-------------|
| **By Task** | Cost of each task, sorted by most expensive |
| **By Agent** | Total spend per agent role |
| **By Day** | Daily cost trend chart |
| **By Model** | How much each AI model is costing |

### Budgets

Set a project budget (optional):

1. **Project Settings → Budget**
2. Set a daily or total limit
3. When the limit is approached (80%), you'll receive a warning
4. When hit, new tasks are paused until you increase the budget or the period resets

---

## Multiple Projects

You can run multiple projects simultaneously. Each project has:

- Its own isolated task board
- Its own agent context (PROJECT.md)
- Its own cost tracking
- Its own git repository (if configured)

Agents are shared across projects — the same QA agent handles reviews for all your projects, just with different context.

### Switching Projects

Use the project selector in the top navigation bar. The full URL includes the project identifier (e.g., `/projects/my-saas-app`), so you can bookmark specific projects.

---

## Archiving and Deleting Projects

**Archive:** Hides the project from the active list but preserves all data. Tasks, history, and cost data remain searchable.

```
Project Settings → Archive Project
```

**Delete:** Permanently removes the project and all associated tasks and cost data. This is irreversible.

```
Project Settings → Delete Project → Type project name to confirm
```

---

## Exporting Project Data

Export your project data (tasks, history, costs) as:
- **JSON** — for programmatic use
- **CSV** — task list with cost data, importable into spreadsheets
- **Markdown** — human-readable project summary

Navigate to **Project Settings → Export**.

---

## Tips for Effective Projects

1. **Keep PROJECT.md current.** Agents use it as their primary context. Stale PROJECT.md → agents making outdated decisions.

2. **One project per product.** Don't try to cram multiple unrelated products into one project. Create separate projects with separate contexts.

3. **Use labels for sprints.** Create labels like `sprint-1`, `sprint-2`, and filter the board by sprint to focus.

4. **Review costs weekly.** The built-in cost tracker makes this easy. Check which tasks are expensive and whether the output justified the cost.

5. **Connect a git repo.** When agents can commit directly, they move faster and produce more reliable output (they can check their own code runs).
