---
title: Task Management
description: Create tasks, understand the task lifecycle, use Assign & Run, and learn how automated QA review works.
---

# Task Management

Tasks are the fundamental unit of work in Mission Clawtrol. This guide covers creating tasks, the task lifecycle, assignment, and the automated QA review process.

## Creating a Task

Click **New Task** (or press `N`) from anywhere in the dashboard.

### Task Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Short, descriptive name (e.g., "Add JWT auth middleware") |
| **Description** | Yes | Full description of the work — include context, constraints, and done criteria |
| **Project** | Yes | Which project this task belongs to |
| **Assign to** | No | The agent to run this task (leave blank to place in Backlog unassigned) |
| **Priority** | No | Low / Normal / High — affects ordering in the board |
| **Labels** | No | Free-form tags for filtering (e.g., `bug`, `feature`, `research`) |

### Writing Effective Task Descriptions

The quality of agent output correlates directly with task description quality. Include:

**1. What to do**
Be specific. "Implement user authentication" is vague. "Add a JWT-based auth middleware that validates Bearer tokens on all `/api/*` routes except `/api/health`" is actionable.

**2. Context**
- Relevant files: `src/middleware/auth.ts`, `src/models/user.ts`
- Prior decisions: "We're using HS256 with the secret in `JWT_SECRET` env var"
- Related tasks: "This unblocks task #14 (user profile endpoint)"

**3. Done criteria**
Clear, checkable conditions. Agents use these to self-assess and the QA agent uses them for automated review.

```
Done when:
- Middleware rejects unauthenticated requests with 401
- Middleware attaches decoded user to req.user
- /api/health is exempt from auth
- Unit tests pass: valid token, expired token, malformed token, missing token
```

**4. Constraints**
Things the agent should NOT do:
```
Don't modify the User model schema — it's used by other services.
Don't add any new npm packages without asking.
```

---

## Task Lifecycle

Tasks flow through 5 statuses:

```
Backlog → Todo → In Progress → Review → Done
```

### Backlog

Tasks that aren't ready to start. They may be missing information, blocked by other tasks, or just queued up for later.

Move a task from Backlog to Todo when it's ready to be worked on.

### Todo

Ready to run. The task has everything an agent needs: clear description, context, done criteria, and an assigned agent (or it's in the queue for assignment).

Click **Assign & Run** to start a todo task.

### In Progress

An agent is actively working on this task. You'll see:
- The assigned agent name and emoji
- Live activity log (updated as the agent works)
- Elapsed time and estimated cost
- Git commits made (if applicable)

You can view the agent's working log in real time by clicking the task.

**Can I cancel a task in progress?**
Yes. Click the task → **Cancel**. The agent stops immediately. Any partial work (committed files, documents) remains but the task returns to Todo.

### Review

The agent has finished and submitted the work. The task is now in automated QA review.

The QA agent automatically:
1. Reads the original task description and done criteria
2. Reviews the agent's output (code diffs, documents, etc.)
3. Verifies each done criterion is met
4. Either approves (→ Done) or flags issues with feedback

This typically takes 30–90 seconds.

**If QA approves:** Task moves to Done automatically.

**If QA flags issues:** Task moves back to In Progress with QA's feedback attached. The assigned agent sees the feedback and resumes work.

You can override QA by clicking **Force Close** (useful if the done criteria were too strict or the feedback is not relevant).

### Done

The task is complete. Done tasks are archived but remain searchable. Cost data is finalized and rolled up to the project total.

---

## Assign & Run

**Assign & Run** is the primary way to start a task:

1. Task must be in **Todo** status
2. An agent must be assigned (or select one now)
3. Click **Assign & Run**

The agent:
1. Reads the task description
2. Reads `PROJECT.md` for project context
3. Reads any referenced files
4. Plans its approach
5. Executes (writes code, creates documents, does research — depending on agent type)
6. Self-reviews against done criteria
7. Submits for QA review

---

## Automated QA Review

Every task that completes goes through automated QA before closing. This ensures work actually meets the stated requirements.

### How It Works

When a task moves to Review, the QA agent receives:
- The original task title and description
- The stated done criteria
- The agent's output (code diff, file contents, written documents)
- The activity log of what the agent did

The QA agent evaluates:
- Are all done criteria met?
- Is the code/output complete and not obviously broken?
- Were any constraints violated?

### QA Response

**Approved:**
```
✅ QA Review passed
All done criteria verified:
✓ Middleware rejects unauthenticated requests with 401
✓ Middleware attaches decoded user to req.user
✓ /api/health exempt from auth
✓ All unit tests pass (12 passing)
```

**Flagged:**
```
❌ QA Review flagged issues
The following done criteria were not met:
✗ Unit tests pass — found 2 failing tests:
  - auth.test.ts:44 — expired token returns 403 instead of 401
  - auth.test.ts:67 — malformed token causes 500 instead of 401

Please fix and resubmit.
```

When flagged, the task goes back to In Progress with the QA feedback attached. The original agent continues with the feedback visible.

---

## Bulk Operations

From the task board, you can:

- **Select multiple tasks** — click the checkbox on each card
- **Bulk assign** — assign all selected tasks to an agent
- **Bulk run** — run all selected todo tasks
- **Bulk move** — move all to a different status
- **Bulk delete** — delete selected tasks (irreversible)

---

## Filtering and Search

Use the filter bar above the board to narrow the view:

- **By agent** — show only tasks assigned to a specific agent
- **By status** — focus on In Progress or Review tasks
- **By label** — e.g., show all `bug` tasks
- **By project** — if you have multiple projects open

The search box (press `/`) searches task titles and descriptions.

---

## Task History

Every task keeps a full history:
- Status changes with timestamps
- Agent activity log
- QA review results
- Cost breakdown (tokens used, model, duration)

Access it via the task detail view → **History** tab.
