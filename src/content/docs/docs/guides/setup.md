---
title: Setup Guide
description: Step-by-step guide to deploying Mission Clawtrol on DigitalOcean and getting your first AI agent team running.
---

# Setup Guide

This guide walks you through deploying Mission Clawtrol on DigitalOcean and getting your first AI agent team operational.

## Prerequisites

- DigitalOcean account ([sign up here](https://www.digitalocean.com/))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- SSH client (built into macOS/Linux; use PuTTY or Windows Terminal on Windows)

## Step 1: Deploy on DigitalOcean

### Option A: 1-Click Marketplace App (Recommended)

1. Go to the [Mission Clawtrol Marketplace listing](#)
2. Click **Create Mission Clawtrol Droplet**
3. Choose a plan:
   - **$12/mo** — 2GB RAM, 1 vCPU, 50GB SSD (good for personal use)
   - **$24/mo** — 4GB RAM, 2 vCPU, 80GB SSD (recommended for teams)
4. Select a datacenter region (pick one close to you)
5. Add your SSH key (or create a root password)
6. Click **Create Droplet**

Wait 60–90 seconds for the droplet to initialize.

### Option B: Self-Hosted Install

If you're running on your own server (Ubuntu 22.04 or 24.04 recommended):

```bash
# Clone and install
git clone https://github.com/missionclawtrol/mission-clawtrol.git
cd mission-clawtrol
./install.sh
```

## Step 2: Run mc-setup

SSH into your droplet:

```bash
ssh root@YOUR_DROPLET_IP
```

Run the setup wizard:

```bash
mc-setup
```

The wizard will ask you:

1. **Anthropic API key** — your Claude API key from console.anthropic.com
2. **Dashboard port** — default is `3001`, press Enter to accept
3. **Admin password** — set a password to protect the dashboard

The setup will:
- Configure the OpenClaw gateway
- Initialize the agent roster
- Start the Mission Clawtrol service
- Enable automatic restarts on reboot

When complete, you'll see:

```
✅ Mission Clawtrol is running!
Dashboard: http://YOUR_DROPLET_IP:3001
```

## Step 3: Access the Dashboard

Open `http://YOUR_DROPLET_IP:3001` in your browser.

You'll see the Mission Clawtrol dashboard with:
- Empty task board (ready for your first project)
- Agent roster (all 9 agents listed)
- Cost tracker (starting at $0.00)

> **Security tip:** For production use, set up a domain name and SSL. See [Nginx + SSL setup](#nginx-and-ssl-setup) below.

## Step 4: Configure Agents

Each agent has configurable behavior. From the dashboard:

1. Click **Agents** in the sidebar
2. Select an agent (e.g., Senior Dev)
3. Set the **AI model** — defaults to `claude-sonnet-4-5` (recommended balance of quality/cost)
4. Optionally adjust the **system prompt** to fit your project style

For most users, the defaults work great. The CSO is pre-configured to delegate appropriately.

### Model Recommendations

| Agent | Default Model | Notes |
|-------|--------------|-------|
| CSO | claude-opus-4 | Needs strong reasoning for orchestration |
| Senior Dev | claude-sonnet-4-5 | Best code quality/cost balance |
| Junior Dev | claude-haiku-4 | Fast, cheap for straightforward tasks |
| Senior Researcher | claude-sonnet-4-5 | Thorough analysis |
| Junior Researcher | claude-haiku-4 | Good for web lookups |
| Editor | claude-haiku-4 | Fast drafting |
| QA | claude-sonnet-4-5 | Needs careful review |
| Security Auditor | claude-sonnet-4-5 | Needs careful analysis |
| PM | claude-haiku-4 | Reports and planning |

## Step 5: Create Your First Project

1. Click **New Project** in the dashboard
2. Fill in:
   - **Name** — e.g., `my-saas-app`
   - **Description** — a paragraph describing what you're building
   - **Tech stack** — languages, frameworks, key dependencies
   - **Git repo URL** (optional) — agents will clone and commit here
3. Click **Create Project**

Mission Clawtrol creates a `PROJECT.md` in your project directory that all agents reference when picking up tasks.

## Step 6: Add Your First Task

1. Click **New Task** (or press `N`)
2. Fill in:
   - **Title** — short, descriptive
   - **Description** — what should be done; include context, acceptance criteria
   - **Assign to** — pick an agent or select "CSO" to let it delegate
3. Click **Assign & Run**

The agent starts immediately. You'll see live activity in the activity log.

---

## Nginx and SSL Setup

For a production deployment with HTTPS:

```bash
# Install Nginx
apt install -y nginx certbot python3-certbot-nginx

# Configure Nginx proxy
cat > /etc/nginx/sites-available/missionclawtrol << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

ln -s /etc/nginx/sites-available/missionclawtrol /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get SSL certificate
certbot --nginx -d your-domain.com
```

## Managing the Service

```bash
# Check status
systemctl status missionclawtrol

# Restart
systemctl restart missionclawtrol

# View logs
journalctl -u missionclawtrol -f

# Update to latest version
mc-update
```

## Troubleshooting

**Dashboard not loading?**
```bash
systemctl status missionclawtrol
journalctl -u missionclawtrol -n 50
```

**Agents not responding?**
Check your Anthropic API key is valid:
```bash
mc-check-config
```

**Out of disk space?**
```bash
# Resize your droplet in DigitalOcean console
# Or clean up old agent logs
mc-cleanup --logs-older-than 30d
```
