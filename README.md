# Juan Varela Portfolio

Dark, developer-focused portfolio infrastructure for
[`JuanLord.github.io`](https://JuanLord.github.io/).

The current milestone includes:

- A Vite, React, and TypeScript foundation.
- A responsive application shell and dark design system.
- Hash-based navigation suitable for GitHub Pages.
- Typed mock content for profile, experience, projects, photography, hiking,
  and music.
- Complete data-driven Home, About, Experience, Education, Skills, and Contact
  views.
- A filterable Engineering and Software project catalog with URL-backed filter
  state.
- Slug-driven project case studies with mock diagrams, project facts, and
  invalid-route recovery.
- A nature-forward Creative Field Notes module for real photography, hiking
  records, and placeholder music projects.
- Separate Creative routes for trip folders, a world travel atlas, hike
  details, short films, and music projects.
- Route-aware document titles, social sharing metadata, and search discovery
  files.
- A quality-gated GitHub Pages deployment workflow.
- Content integrity, navigation, and component tests.

All professional and creative records are placeholders unless explicitly marked
otherwise. Replace records in `src/content/` without changing page components.
The project does not use AI-generated images. Empty media states remain visible
until real, user-owned photography or artwork is added.

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run check
```

This runs formatting verification, linting, TypeScript checks, component tests,
content integrity tests, and the production build.

## Project Structure

```text
src/
  components/
    layout/       Shared shell, navigation, and document metadata
    creative/     Photography, trail, and music presentation components
    projects/     Reusable project cards and mock technical visuals
    ui/           Reusable interface primitives
  content/        Replaceable portfolio records, split by creative collection
  lib/            Content queries and validation
  pages/          Route-level components
  styles/         Core and creative-theme responsive styles
  test/           Shared test setup
  types/          Content contracts
public/
  media/          Real, optimized portfolio media added by the owner
docs/
  creative-content-guide.md
                  Storage, editing, embeds, maps, and privacy workflow
```

See [`docs/creative-content-guide.md`](docs/creative-content-guide.md) before
adding photography, Spotify or Strava embeds, route files, film, or music.

## GitHub Pages Target

The project is configured for the root user site:

- Repository: `JuanLord/JuanLord.github.io`
- URL: `https://JuanLord.github.io/`
- Vite base: `/`
- Router: `HashRouter`

Pushes to `main` trigger `.github/workflows/deploy-pages.yml`. The workflow
installs the locked dependencies, runs `npm run check`, uploads `dist/`, and
deploys the verified artifact.

For the first deployment, open the repository's **Settings > Pages** screen and
set **Build and deployment > Source** to **GitHub Actions**. Later pushes deploy
automatically when the quality checks pass.
