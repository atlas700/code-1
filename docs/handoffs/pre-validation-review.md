# Maintenance handoff — pre-validation code review

Date: 25 October 2026.

## Status and scope

Documentation acceptance checks are complete; GitHub review is required before
merge. The workflow now requires security and correctness review after
implementation and fixes before the final quality-command pass. Earlier tests
remain encouraged. Pilot scope, accepted ADRs, and open evidence gates are
unchanged.

## Acceptance checks and verification

- [x] `AGENTS.md` links to the review procedure before final validation.
- [x] The procedure covers task scope, connected callers/tests, security
  boundaries, transaction safety, error handling, and regressions.
- [x] Must-fix findings are resolved before final checks; validation fixes receive
  another review of the changed paths.
- [x] The reusable coding prompt and GitHub delivery checklist require review
  evidence in the handoff.
- [x] Tests during development, the dependency audit, and GitHub PR review remain
  part of the workflow.
- [x] All 151 local Markdown links and anchors across 41 documents, plus
  `git diff --check`, pass.

Review scope: the complete documentation diff and existing quality/PR delivery
rules. No must-fix findings remain. No application code, quality commands,
dependencies, or CI configuration changed, so lint, typecheck, tests, build, and
dependency audit were not run for this documentation-only change.

## Changed files

`AGENTS.md`, `docs/testing.md`, `docs/agent-sized-build-plan.md`,
`docs/github-rules.md`, `docs/README.md`, and this handoff.

## Impact and limitations

No migration, environment variable, or runtime impact. Review is an agent
workflow requirement, not a new automated CI job or a guarantee that every
vulnerability will be detected.

## Exact next task

Review the pending [Task 07 database foundation PR](https://github.com/atlas700/code-1/pull/14).
After it merges, proceed to **08 — organization membership and tenant context**
under its accepted structural ownership policy. Recheck the build plan's gate
status first; this workflow change closes no product or architecture gate.
