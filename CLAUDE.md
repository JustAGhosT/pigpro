# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Livestock Club SA (pigpro)** — Comprehensive livestock marketplace and management platform for South African farmers. Features advanced filtering, authentication, and image management.

## Status: Consolidation Pending

Multiple agriculture-related repos exist (pigpro, zeeplan, farm-plan, cheesypork, and possibly poultry-club). These should be consolidated — most likely archived in favor of one primary repo. A decision is pending.

## Tech Stack

- **Frontend**: React 18, TypeScript 5.5
- **Monorepo**: npm workspaces (`apps/`, `packages/`)
- **CI/CD**: Azure Pipelines (`azure-pipelines.yml`)
- **Containerization**: Docker Compose
- **Linting**: ESLint 9
- **Security**: audit-ci

## Key Commands

```bash
npm install               # Install all dependencies
npm run dev               # Start dev server
npm run build             # Build all packages
npm run lint              # ESLint
npm test                  # Run tests
docker-compose up         # Start full stack
```

## Architecture

- `apps/` — Application packages
- `packages/` — Shared code
- `docs/` — Documentation
- `scripts/` — Build/deploy automation

## AgentKit Forge

This project has not yet been onboarded to [AgentKit Forge](https://github.com/phoenixvc/agentkit-forge). To request onboarding, [create a ticket](https://github.com/phoenixvc/agentkit-forge/issues/new?title=Onboard+pigpro&labels=onboarding).

## Baton Integration

Baton is the shared task graph for cross-repo work. When the `baton` MCP server is available, agents should check for existing work with `task_check` at the start of meaningful tasks, create or claim visible work with `task_notify`/`log_agent_message`, update the task when significant new information becomes available, and log completion or blockers before handing off.
