# Documentation index

This directory is the durable context for contributors to the Afghanistan
Agricultural Supply Chain OS. Facts confirmed by the repository or build plan are
labelled **Confirmed**. Product and infrastructure choices that need founder or
pilot evidence are labelled **Open**.

## Product and engineering documents

- [Product requirements](product-requirements.md)
- [Architecture](architecture.md)
- [Database](database.md)
- [API conventions](api-conventions.md)
- [Security](security.md)
- [Testing](testing.md)
- [Deployment](deployment.md)
- [Architecture decision records](adr/README.md)
- [Task 01 handoff](handoffs/01-documentation-shell.md)
- [Task 02 handoff](handoffs/02-quality-ci.md)
- [Task 03 handoff](handoffs/03-runtime-environment-validation.md)
- [Task 04 handoff](handoffs/04-application-shell.md)
- [Task 05 handoff](handoffs/05-localization-and-rtl.md)
- [Task 05 CI fix handoff](handoffs/05-localization-and-rtl-ci-fix.md)
- [Task 06 handoff](handoffs/06-authentication.md)
- [Task 07 handoff](handoffs/07-database-foundation.md)
- [Pilot-plan and quality maintenance handoff](handoffs/pilot-plan-and-quality.md)

## Existing project guidance

- [Agent-sized build plan](agent-sized-build-plan.md)
- [Next.js rules](nextjs.md)
- [React rules](react.md)
- [TypeScript rules](typescript.md)
- [Tailwind CSS rules](tailwindcss.md)
- [PostgreSQL and Drizzle ORM rules](postgresql-drizzle-orm.md)

## Documentation rules

- Update a decision record before implementing a choice that changes product
  policy, data modelling, authentication, authorization, or deployment.
- Check the [build plan's gate status and pilot delivery order](agent-sized-build-plan.md#current-gate-status)
  before selecting a task. Accepted ADRs govern policy; update affected plan tasks
  when an approved policy changes.
- Do not present a proposal or assumption as a confirmed fact.
- Keep task handoffs concise: completed checks, changed files, migration and
  environment impact, known limitations, and the exact next task.
