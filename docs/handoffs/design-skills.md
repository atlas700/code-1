# Required design and styling skills

Date: 31 October 2026.

## Scope and acceptance

The founder requested installation of `Leonxlnx/taste-skill` and mandatory use
alongside the existing project-local `ui-ux-pro-max` whenever app design or
styling is created or updated.

- Installed `design-taste-frontend`, the upstream skill's declared name, with
  all 39 source files, including references, scripts, assets, and data.
- Pinned upstream revision `12af471f627f866411b4bd785b19646d3672784c` in
  `skills-lock.json`, with the upstream path and full folder content hash.
- Added an AGENTS.md rule requiring both skills before design/styling creation,
  updates, refactors, or reviews, including focused CSS/Tailwind changes.
- Routed workspace UI work to Taste Skill's app-screen workflow. Focused changes
  match the surrounding design; accepted ADR 0020, shared components/tokens,
  accessibility, and Pashto/RTL support take precedence over generic guidance.
- Reused `ui-ux-pro-max` without changing its files. Preserved the pre-existing
  uncommitted ECC installation and rules; those changes are excluded from this PR.

## Changed files

- `AGENTS.md`: mandatory skill triggers and how to combine the guidance.
- `.agents/skills/design-taste-frontend/`: unchanged upstream skill distribution.
- `.agents/skills/TASTE-NOTICE.md`: source, revision, and upstream MIT license.
- `skills-lock.json`: the new skill's provenance entry only.
- `.gitattributes`: LF preservation scoped to this skill, keeping source hashes
  reproducible across checkouts.
- `docs/handoffs/design-skills.md`: acceptance and verification record.

## Pre-validation review

Applied full Ponytail review and the project-local verification-loop guidance to
the installation, AGENTS.md trigger, linked instructions, provenance, line-ending
rule, and task-only diff. Expected use is local agent tooling, outside the app's
runtime. Reviewed bundled script entry points and their file/network/browser
boundaries; this is not an exhaustive third-party code audit.

Review dispositions:

- Resolved generic design conflicts by preserving ADR 0020 and routing business
  screens to the app-specific workflow.
- Preserved upstream file bytes with a targeted line-ending rule.
- Isolated this delivery from pre-existing AGENTS.md/lockfile/ECC changes.
- No remaining must-fix findings in the installation or ruleset.

## Verification

- All 39 installed files match the pinned upstream Git blob hashes exactly.
- Node syntax checks pass for all 13 bundled JavaScript/module files.
- All 10 bundled JSON files parse successfully.
- Taste Skill's page direction and app-screen kind catalogs load successfully.
- Its app-mode source linter rejects a deliberate decorative gradient, then
  passes the corrected fixture with no findings.
- The existing `ui-ux-pro-max` focused UX search returns keyboard-focus guidance.
- Final delivery checks cover the folder hash, skill names, AGENTS.md links,
  staged file scope, and preservation of pre-existing working changes.

## Limitations and next task

This installs agent tooling and documentation; it changes no app code,
application dependency, CI configuration, or deployment. App lint, typecheck,
test, build, and dependency-audit commands are skipped under the documentation
and tooling scope; skill-specific checks above cover this installation.
No live browser inspector, image search/download, provider, or deployment check
was run. Remote CI and GitHub review remain separate evidence after publication.
The installed skill is available for discovery on the next turn.

Next: apply both skills to the next authorized design/styling task. No redesign
is authorized by this installation. G1 remains open and Task 15 remains blocked;
the build plan's delivery order and accepted policies are unchanged.
