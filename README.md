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
- A nature-forward Creative Field Notes module for generated photography,
  hiking records, and placeholder music projects.
- Content integrity, navigation, and component tests.

All professional and creative records are placeholders unless explicitly marked
otherwise. Replace records in `src/content/` without changing page components.
Generated creative images live in `public/images/creative/` and are visibly
labeled as placeholders in the interface.

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
    layout/       Shared header, footer, and route layout
    creative/     Photography, trail, and music presentation components
    projects/     Reusable project cards and mock technical visuals
    ui/           Reusable interface primitives
  content/        Replaceable portfolio records
  lib/            Content queries and validation
  pages/          Route-level components
  styles/         Core and creative-theme responsive styles
  test/           Shared test setup
  types/          Content contracts
```

## GitHub Pages Target

The project is configured for the root user site:

- Repository: `JuanLord/JuanLord.github.io`
- URL: `https://JuanLord.github.io/`
- Vite base: `/`
- Router: `HashRouter`

The deployment workflow will be added in the deployment milestone after the
portfolio pages and production content checks are complete.
