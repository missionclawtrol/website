---
title: API Reference
description: Full REST API documentation for Mission Clawtrol integrations, automation, and custom tooling.
---

# API Reference

Mission Clawtrol exposes a REST API for integrations, automation, and building on top of the platform. All endpoints require authentication unless noted.

## Authentication

Include your API token in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

Generate an API token: **Dashboard → Settings → API Tokens → New Token**

Base URL: `http://your-droplet-ip:3001/api`

---

## Tasks

### GET /api/tasks

List all tasks, optionally filtered.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Filter by project slug |
| `status` | string | `backlog`, `todo`, `in-progress`, `review`, `done` |
| `agent` | string | Filter by agent role slug (e.g., `senior-dev`) |
| `limit` | number | Max results (default: 50, max: 200) |
| `offset` | number | Pagination offset |

**Response:**

```json
{
  "tasks": [
    {
      "id": "tsk_abc123",
      "title": "Add JWT auth middleware",
      "status": "in-progress",
      "agent": "senior-dev",
      "project": "my-saas-app",
      "priority": "high",
      "labels": ["feature", "auth"],
      "createdAt": "2025-01-15T10:23:00Z",
      "updatedAt": "2025-01-15T11:05:00Z",
      "cost": {
        "tokensIn": 12400,
        "tokensOut": 8200,
        "estimatedUsd": 0.087
      }
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

### POST /api/tasks

Create a new task.

**Request body:**

```json
{
  "title": "Add JWT auth middleware",
  "description": "Implement JWT validation middleware for all /api/* routes.\n\nDone when:\n- Middleware rejects unauthenticated requests with 401\n- req.user is populated with decoded token payload",
  "project": "my-saas-app",
  "agent": "senior-dev",
  "priority": "high",
  "labels": ["feature", "auth"],
  "autoRun": true
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Task title |
| `description` | Yes | Full task description with done criteria |
| `project` | Yes | Project slug |
| `agent` | No | Agent role slug; omit to create unassigned |
| `priority` | No | `low`, `normal`, `high` (default: `normal`) |
| `labels` | No | Array of label strings |
| `autoRun` | No | If `true` and agent is set, starts immediately (default: `false`) |

**Response:** `201 Created` with the created task object.

---

### PATCH /api/tasks/:id

Update a task. Supports partial updates.

**Request body (any subset of):**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "todo",
  "agent": "junior-dev",
  "priority": "normal",
  "labels": ["bug"]
}
```

**Special status transitions:**
- Set `status: "in-progress"` to assign and start the task (same as clicking Assign & Run)
- Set `status: "done"` to force-close (bypasses QA)
- Set `status: "backlog"` to pause/cancel

**Response:** `200 OK` with the updated task object.

---

## Projects

### GET /api/projects

List all projects.

**Response:**

```json
{
  "projects": [
    {
      "id": "proj_xyz789",
      "slug": "my-saas-app",
      "displayName": "My SaaS App",
      "description": "A subscription SaaS platform...",
      "taskCount": {
        "total": 42,
        "inProgress": 3,
        "review": 1,
        "done": 28
      },
      "cost": {
        "totalUsd": 14.23,
        "last7DaysUsd": 3.45
      },
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/projects/:slug

Get a single project by slug, including the full PROJECT.md content.

**Response:**

```json
{
  "id": "proj_xyz789",
  "slug": "my-saas-app",
  "displayName": "My SaaS App",
  "description": "...",
  "contextMd": "# Project: My SaaS App\n\n## Overview\n...",
  "gitRepo": "https://github.com/user/my-saas-app",
  "agents": ["cso", "senior-dev", "junior-dev", "qa", "editor"],
  "taskCount": { "total": 42, "done": 28 },
  "cost": { "totalUsd": 14.23 }
}
```

---

## Agents

### GET /api/agents/roster

Get the full agent roster with current status and configuration.

**Response:**

```json
{
  "agents": [
    {
      "id": "cso",
      "name": "CSO",
      "emoji": "🎯",
      "description": "Chief Strategy Officer — orchestrates, delegates, plans",
      "status": "idle",
      "model": "claude-opus-4",
      "currentTask": null,
      "stats": {
        "tasksCompleted": 12,
        "totalCostUsd": 2.34,
        "avgTaskDurationMin": 4.2
      }
    },
    {
      "id": "senior-dev",
      "name": "Senior Developer",
      "emoji": "💻",
      "status": "active",
      "model": "claude-sonnet-4-5",
      "currentTask": {
        "id": "tsk_abc123",
        "title": "Add JWT auth middleware",
        "project": "my-saas-app"
      },
      "stats": {
        "tasksCompleted": 24,
        "totalCostUsd": 6.78,
        "avgTaskDurationMin": 8.1
      }
    }
  ]
}
```

---

## Costs

### GET /api/costs/summary

Get aggregated cost summary across all projects.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `since` | ISO date | Start date (default: 30 days ago) |
| `until` | ISO date | End date (default: now) |

**Response:**

```json
{
  "period": {
    "since": "2025-01-01T00:00:00Z",
    "until": "2025-01-31T23:59:59Z"
  },
  "totalUsd": 47.82,
  "totalTokensIn": 2840000,
  "totalTokensOut": 1920000,
  "taskCount": 86,
  "byDay": [
    { "date": "2025-01-15", "usd": 3.42 },
    { "date": "2025-01-16", "usd": 1.87 }
  ]
}
```

---

### GET /api/costs/by-agent

Break down costs by agent role.

**Response:**

```json
{
  "byAgent": [
    { "agent": "senior-dev", "usd": 18.40, "tasks": 24, "tokensTotal": 1840000 },
    { "agent": "junior-dev", "usd": 6.20, "tasks": 31, "tokensTotal": 620000 },
    { "agent": "cso",        "usd": 8.90, "tasks": 12, "tokensTotal": 890000 }
  ]
}
```

---

### GET /api/costs/by-project

Break down costs by project.

**Response:**

```json
{
  "byProject": [
    { "project": "my-saas-app", "usd": 32.10, "tasks": 58 },
    { "project": "marketing-site", "usd": 15.72, "tasks": 28 }
  ]
}
```

---

## Setup

### POST /api/setup/minimum-agents

Run the minimum agent setup (idempotent — safe to call multiple times). Creates default agent configurations if they don't exist.

**Request body:** (empty `{}`)

**Response:**

```json
{
  "success": true,
  "agentsConfigured": ["cso", "senior-dev", "junior-dev", "senior-researcher", "junior-researcher", "editor", "qa", "security-auditor", "pm"],
  "message": "All 9 agents configured with default settings"
}
```

---

### POST /api/setup/first-project

Create a starter project with example tasks. Useful for onboarding.

**Request body:**

```json
{
  "name": "my-first-project",
  "description": "My first Mission Clawtrol project"
}
```

**Response:** `201 Created` with the created project object and 3 example tasks.

---

## Reports

### GET /api/reports/weekly

Get the auto-generated weekly stakeholder report (Markdown).

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project slug (omit for all-projects report) |
| `week` | string | ISO week date (e.g., `2025-W03`), default: current week |
| `format` | string | `markdown` (default) or `json` |

**Response (format=markdown):** `text/markdown` content

```markdown
# Weekly Report — My SaaS App
Week of January 13–19, 2025

## Summary
This week the team completed 14 tasks across 3 feature areas...

## Completed This Week
- ✅ Add JWT auth middleware (Senior Dev, 45 min, $0.34)
- ✅ Write API documentation (Editor, 22 min, $0.08)
...

## In Progress
- 🔄 Build Stripe billing integration (Senior Dev)

## Costs
- Total this week: $4.21
- Running monthly total: $14.23
```

**Response (format=json):**

```json
{
  "week": "2025-W03",
  "project": "my-saas-app",
  "tasksCompleted": 14,
  "tasksInProgress": 2,
  "costUsd": 4.21,
  "highlights": [...],
  "markdownContent": "# Weekly Report..."
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task tsk_abc123 not found",
    "status": 404
  }
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Bad request — invalid parameters |
| `401` | Unauthorized — missing or invalid API token |
| `403` | Forbidden — valid token but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict — e.g., task already running |
| `429` | Rate limited |
| `500` | Internal server error |
