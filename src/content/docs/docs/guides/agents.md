---
title: Agent Guide
description: The 9-agent roster explained — roles, capabilities, assignment, and how CSO delegation works.
---

# Agent Guide

Mission Clawtrol ships with 9 specialized AI agents, each designed for a specific role in the software development lifecycle. This guide explains what each agent does, how to assign tasks to them, and how delegation works.

## The 9-Agent Roster

### 🎯 CSO — Chief Strategy Officer

**Role:** Orchestration, planning, and delegation.

The CSO is your top-level agent. When you assign a task to the CSO, it:

1. Reads the task description and project context
2. Determines which specialist agent(s) should handle it
3. Breaks it into sub-tasks if needed
4. Delegates to the appropriate agents
5. Reviews the results and moves the task forward

The CSO is the right choice when you're not sure which agent to use, or when a task spans multiple roles.

**Best for:** High-level feature requests, multi-step tasks, anything that needs coordination.

---

### 💻 Senior Developer

**Role:** Architecture, complex features, code review.

The Senior Dev handles technically challenging work: designing systems, writing complex business logic, reviewing code for quality and correctness, and mentoring Junior Dev output.

**Best for:** New features, system design, architectural decisions, pull request reviews, performance optimization.

**Capabilities:**
- Reads and writes code across any language
- Commits to git with meaningful commit messages
- Runs tests and interprets results
- Reviews Junior Dev work before marking tasks complete

---

### 🔧 Junior Developer

**Role:** Implementation, bug fixes, tests.

The Junior Dev handles well-defined, straightforward implementation tasks. It's faster and cheaper than the Senior Dev for routine work.

**Best for:** Bug fixes, simple features with clear specs, writing unit tests, code refactoring with clear instructions.

**Capabilities:**
- Reads and writes code
- Commits to git
- Runs tests
- Escalates to Senior Dev if the task exceeds its scope

---

### 🔬 Senior Researcher

**Role:** Deep research, analysis, competitive intelligence.

The Senior Researcher performs thorough, structured research. It reads extensively, synthesizes information, and produces well-cited, analytical output.

**Best for:** Competitive analysis, technology evaluation, literature review, market research, architecture decision records (ADRs).

**Capabilities:**
- Web search and page reading
- Structured report writing
- Source citation
- Long-form analysis (10+ pages when needed)

---

### 📚 Junior Researcher

**Role:** Data gathering, fact-checking, quick lookups.

The Junior Researcher handles faster, narrower research tasks. It's cost-effective for gathering data, checking facts, or pulling together a summary.

**Best for:** Quick fact checks, data gathering for a specific question, summarizing a single document or article.

---

### ✍️ Editor

**Role:** Documentation, blog posts, copy, communications.

The Editor writes and refines written content. It's not a developer — don't give it code tasks. It excels at making technical content readable, polished, and well-structured.

**Best for:** README files, blog posts, API documentation (prose), changelog entries, Slack announcements, marketing copy.

**Capabilities:**
- Writes and edits Markdown
- Follows style guides (provide one in the task or PROJECT.md)
- Adapts tone (technical, casual, formal)

---

### 🧪 QA Agent

**Role:** Test plans, quality reviews, done-criteria checks.

The QA agent has two primary functions:

1. **Test planning** — given a feature description, write a comprehensive test plan
2. **Done-criteria review** — automatically runs when a task moves to the Review column, checking whether the work meets the stated acceptance criteria

**Best for:** Writing test plans, reviewing completed tasks, writing QA documentation.

> **Automated QA:** When any task moves to "Review" status, the QA agent automatically reviews it against the task's done criteria. If it passes, the task closes. If not, it's flagged with feedback.

---

### 🛡️ Security Auditor

**Role:** Security audits, vulnerability reviews.

The Security Auditor reviews code, configurations, and architectures for security issues. It checks against OWASP guidelines, identifies common vulnerabilities, and recommends mitigations.

**Best for:** Pre-deployment security reviews, reviewing auth implementations, checking for injection vulnerabilities, dependency audits.

---

### 📋 Product Manager

**Role:** Scope, roadmap, stakeholder reports.

The PM agent handles the business and planning side of your project. It writes specifications, breaks down epics into tasks, maintains roadmaps, and generates reports.

**Best for:** Breaking down feature requests into tasks, writing PRDs, generating the weekly stakeholder report, maintaining the project roadmap.

---

## Assigning Tasks

### Direct Assignment

Select a specific agent when you know who should handle the work:

1. Click **New Task**
2. Set **Assign to**: Senior Dev (or any agent)
3. Click **Assign & Run**

The agent starts immediately.

### CSO Delegation

Assign to the CSO when the task is complex or cross-cutting:

1. Click **New Task**
2. Set **Assign to**: CSO
3. Click **Assign & Run**

The CSO reads the task, decides how to handle it, and delegates to one or more specialists. You'll see sub-tasks created and assigned automatically.

### Writing Good Task Descriptions

Agents perform much better with clear, specific task descriptions. Include:

- **What to do** — the specific deliverable
- **Context** — relevant background, linked files, or previous decisions
- **Done criteria** — how to know when it's finished
- **Constraints** — anything they should NOT do

**Good example:**
```
Title: Add password reset flow

Description:
Implement the full password reset flow for the auth system.

Technical details:
- Use the existing User model (src/models/user.ts)
- Send reset emails via the existing email service (src/services/email.ts)
- Token should expire after 1 hour
- Store hashed reset tokens, never plaintext

Done when:
- /auth/forgot-password endpoint accepts email, sends reset email
- /auth/reset-password endpoint validates token, updates password
- Old reset tokens invalidated after use
- Unit tests cover happy path + expired token + invalid token
```

---

## How Delegation Works

When the CSO receives a task, it follows this process:

```
CSO receives task
     ↓
Reads PROJECT.md + task description
     ↓
Determines complexity and scope
     ↓
Single agent? → Direct assignment
Multi-agent? → Creates sub-tasks, assigns each
     ↓
Monitors progress
     ↓
Reviews output
     ↓
Marks parent task complete or escalates
```

Sub-tasks appear on the board under the parent task, each with its own assigned agent and status.

---

## Agent Configuration

Each agent's behavior can be customized from the **Agents** page:

| Setting | Description |
|---------|-------------|
| **Model** | Which AI model powers this agent (claude-haiku, claude-sonnet, claude-opus) |
| **System prompt** | Custom instructions appended to the agent's default persona |
| **Max tokens** | Limit response length (useful for cost control) |
| **Enabled** | Toggle an agent on/off |

Agent configs are stored in `agents/config.json` and can be committed to version control.
