<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

### Required coding workflow

Before implementing a feature or change, use the `find-skills` skill to search
for a task-specific skill. If a relevant skill is found, use it; otherwise,
continue with the default workflow below.

Before creating, updating, refactoring, fixing, reviewing, or designing any
project code, use the Ponytail plugin's `ponytail:ponytail` skill at its default
**full** intensity. Follow its simplicity ladder and preserve its safety,
validation, error-handling, and accessibility boundaries. This requirement
supplements, rather than replaces, the relevant project rules below.

When writing, changing, or reviewing code that uses a library, framework, SDK,
API, CLI, or cloud service, use the `context7-mcp` skill first to fetch the
current official documentation. Follow the documented, current syntax rather
than relying on remembered examples.

Read the relevant rule file before changing code in that area:

- [Next.js](docs/nextjs.md)
- [React](docs/react.md)
- [TypeScript](docs/typescript.md)
- [Tailwind CSS](docs/tailwindcss.md)
- [PostgreSQL and Drizzle ORM](docs/postgresql-drizzle-orm.md)
- [Project Build Plan](docs/agent-sized-build-plan.md)
- [Github Rules](docs/github-rules.md)

### Quality checks

Run only the checks affected by the change while working:

- Run `npm run lint` after changing application TypeScript, JavaScript, or ESLint configuration.
- Run `npm run typecheck` after changing TypeScript, type declarations, or TypeScript configuration.
- Run `npm run test` after changing behavior covered by tests or test configuration.
- Run `npm run build` after changing application, Next.js, dependency, or build configuration, and before handing off an application change.

For application, dependency, CI, or quality-configuration changes, run all four
commands before handoff. Documentation-only changes do not require these commands
unless they change the documented commands or their configuration.

### Feature completion and review

Do not call an implementation feature complete until its handoff note records the
completed acceptance checks, changed files, verification evidence, limitations, and
next task. Then follow the [GitHub review delivery workflow](docs/github-rules.md)
to commit the work on its feature branch, push it to GitHub, and request review.

## Agent skills

### Issue tracker

Issues are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the default five triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Uses the single-context layout. See `docs/agents/domain.md`.
