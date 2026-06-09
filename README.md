# Real Good Docs

Source for the Real Good Research documentation site, built with [Quarto](https://quarto.org/) and published on GitHub Pages.

## Repo layout

- `index.qmd` — site home page
- `teaching/` — teaching material, including the Bayesian intro chapter set
- `research/` — research notes and project pages
- `assets/` — shared images and site assets
- `_quarto.yml` — global site configuration
- `requirements.R` — R package dependencies used by the site
- `requirements.sh` — optional Linux system package helper

## Local setup

You need:

- [Quarto](https://quarto.org/docs/get-started/)
- R 4.2 or newer
- the R packages listed in `DESCRIPTION`

If you are on Linux, `requirements.sh` installs a few common system libraries for plotting and document rendering.

## Local render

Render the site locally with:

```bash
quarto render
```

Quarto writes the rendered site to `docs/`.

## Deployment

GitHub Pages serves the `gh-pages` branch from the repository root `/`.

On pushes to `main`, `.github/workflows/publish.yml`:

1. checks out the repo,
2. installs Quarto and the required R packages,
3. runs `quarto render`,
4. publishes `docs/` to `gh-pages`.

That keeps production HTML separate from source while still giving CI a safety net if you forget to render locally.

The workflow does **not** install CmdStan. Computational chapters rely on Quarto freeze mode (`execute: freeze: true` in `_quarto.yml`) so CI can reuse committed execution results.

## Freeze mode

Use Quarto freeze mode as the default for computational chapters:

- no code changes: the existing freeze cache is usually enough;
- code changes: run `quarto render` locally first so the cache stays in sync;
- new computational content: render locally before pushing.

## Adding content

For a new page or chapter:

- add a new `.qmd` file in the appropriate folder;
- add shared assets to `assets/` or chapter-specific `resources/`;
- update `_quarto.yml` if navigation needs to change;
- render locally when you want to refresh outputs;
- push to `main` and let GitHub Actions publish the site.

## References

- [Quarto documentation](https://quarto.org/docs/)
- [GitHub Pages](https://docs.github.com/en/pages)
