# AGENTS.md

This repository runs under a truth-first, verification-first workflow.

## Operating Rules

1. Work from the actual checkout state, not from stale assumptions.
2. Prefer targeted reads and existing patterns before inventing new structure.
3. Keep changes small enough to review, test, and revert cleanly.
4. Do not commit secrets, tokens, or private local material.
5. Use direct imports and avoid barrel files unless the repo already relies on them.
6. Keep `OpenChronicle/` as reference material only; do not vendor it into this repo.
7. This repo uses `pnpm`; there is no `package-lock.json` here. If dependency state changes, update `pnpm-lock.yaml` instead.
8. Any documentation mentioning `Emerald Tablets` or `SYNTHIA 3.0` must use the trademarked forms `Emerald Tablets™` and `SYNTHIA™ 3.0`.
9. Verify build or test impact before claiming completion.
10. If a claim is uncertain, state the uncertainty plainly.

## Execution Order

Inspect, classify, edit, verify, report.
