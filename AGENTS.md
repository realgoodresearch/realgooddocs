# Repository workflow

This file is the working agreement for people and agents contributing to the Real Good Docs Quarto website. Keep it current when the team adopts or changes a material process or documentation rule. Agents should make focused, reviewable changes that preserve the site's existing structure and voice.

## Issue-driven work

1. Start substantive work with a GitHub issue that states the problem, desired outcome, scope, and important constraints or non-goals. Create one when no existing issue adequately does so.
2. Create an issue-scoped branch from `main` named `issue-<number>-<short-description>`. Associate it with the issue through the pull request, and add an issue comment identifying the branch when that helps collaborators.
3. Keep the issue current with concise progress comments, design decisions, blockers, and invitations for relevant contributions. Record material decisions in the issue or a versioned document rather than only in chat or review comments.
4. Keep the issue, branch, commits, and pull request focused on one coherent outcome. Do not mix content changes with unrelated cleanup or formatting.
5. Commit at logical milestones. Use a concise imperative subject, reference the issue, and explain non-obvious rationale in the body.
6. Before every commit, request the user's review and explicit confirmation unless the user explicitly asked for the commit. Do not commit untested or unreviewed work.
7. Before requesting review, run relevant validation and report what ran, its result, and anything that remains outstanding.
8. When ready, open a pull request into `main`. Link the issue so it closes on merge, summarize the user-visible change and validation, and request review.
9. Merge only after approval. Then delete the issue branch and confirm the issue is closed. Do not push, merge, force-push, rewrite shared history, close issues, or delete branches without explicit user authorization.

Write issues, comments, commits, and pull requests in clear, concise language. State the decision, rationale, scope, and validation; link related work where useful. Never disclose credentials, tokens, personal data, sensitive humanitarian data, or other secrets in project collaboration records.

## Before you edit

1. Read this file, `README.md`, `_quarto.yml`, and the files nearest to the requested change.
2. Check `git status --short --branch` before edits, commits, branch switches, and other Git operations that could affect existing work.
3. Preserve unrelated user changes. Never add, alter, delete, or commit them without explicit authorization, and never discard them to simplify a task.
4. If a secret or sensitive record is found, leave it unexposed, recommend rotation or appropriate handling when necessary, and use environment variables or the project-approved secret mechanism.

## Repository structure

- `index.qmd`: site landing page
- `research/`: research books and project pages
- `teaching/`: teaching materials
- `assets/`: shared images and browser assets
- `_quarto.yml`: global navigation, sidebars, formatting, and execution settings
- `references.bib`: shared bibliography
- `docs/`: rendered site published by GitHub Pages
- `.github/workflows/publish.yml`: publishes the committed `docs/` directory from `main`

A book-like collection normally has its own directory under `research/` or `teaching/`, an introductory `overview.qmd`, a `toc.qmd`, and one file per chapter. Add its overview to the relevant listing and add a path-scoped sidebar to `_quarto.yml`.

## Writing and sources

- Write for an informed reader who may be new to the specific method.
- Lead with the practical problem, then introduce terminology and technical detail.
- Define acronyms on first use and use names consistently.
- Prefer short sections, descriptive headings, and meaningful link text.
- Do not invent facts, citations, performance claims, implementation details, or data provenance. Mark unresolved content with an explicit `TODO` and state what evidence is needed.
- Cite primary sources where possible. Add reusable references to `references.bib`; use direct links sparingly for project pages or resources that do not belong in the bibliography.
- Put book-specific images and downloads in that book's `resources/` directory. Use `assets/` only for resources shared across the site.
- Include alt text or an informative caption for meaningful images.

## Quarto conventions

- Use `.qmd` for authored pages and valid YAML front matter.
- Use root-relative source paths in `_quarto.yml`, following the existing navigation style.
- Keep global defaults in `_quarto.yml`; add page-level options only when a page genuinely differs.
- Keep computational output reproducible. When code changes, render locally so Quarto's freeze data and generated output stay in sync.
- Do not hand-edit generated files in `docs/`, `_site/`, or `.quarto/`. Generate them with Quarto.

## Validation

Run the narrowest useful checks while editing, then validate the site before handoff:

```bash
quarto render
git status --short
```

Review warnings, changed files, navigation, internal links, citations, and representative pages in the rendered site. If Quarto or another required dependency is unavailable, report that clearly; do not claim the render passed.

Because deployment publishes the committed `docs/` directory, include appropriate rendered `docs/` changes when a source-page change is ready for review. Do not commit transient `_site/` or `.quarto/` files.

## Git and review workflow

- Use imperative, specific commit subjects.
- Reference the issue in the pull request description and explain the user-visible result.
- In the pull request, list the validation performed and any remaining `TODO`s or source gaps.
- Do not push, merge, rewrite history, or close issues unless the user explicitly asks.
- Before handoff, summarize changed source files, validation results, and anything the next contributor must supply.
