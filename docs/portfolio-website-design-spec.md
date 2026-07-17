# Portfolio Website Design Specification

## 1. Product Vision

This portfolio should present Juan Varela as a capable, modern, multidimensional professional. The site needs to work for employers and collaborators first: it should make professional background, technical ability, projects, resume access, and contact paths immediately clear. It should also make space for personality through photography, travel, hiking, music, and creative work.

The first release should feel polished, fast, and complete using generated mock content and placeholder media. It should be easy to replace that content later by editing structured content files rather than rewriting components.

## 2. Primary Goals

- Present a clear professional profile for recruiters, hiring managers, and collaborators.
- Showcase engineering and software projects with enough context to understand impact, stack, and ownership.
- Include a separate, more expressive area for hobbies and creative work.
- Be mobile-first, responsive, performant, accessible, and deployable to GitHub Pages.
- Keep content maintainable through local data files and reusable components.

## 3. Target Audience

### Employers and Recruiters

Need to quickly answer:

- Who is Juan?
- What roles or domains does he fit?
- What has he built?
- What technologies does he know?
- Where is the resume?
- How can they contact him?

### Technical Reviewers

Need to inspect:

- Project details.
- GitHub repositories.
- Architecture diagrams or screenshots.
- Technology choices.
- Problem, process, and outcome.

### Collaborators and Visitors

May care about:

- Creative projects.
- Photography and travel.
- Hiking stories.
- Music or media links.
- Personal taste and point of view.

## 4. Recommended Tech Stack

### Core

- React with functional components and hooks.
- Vite for development and build tooling.
- React Router for route-based pages.
- HashRouter for simplest GitHub Pages compatibility, or BrowserRouter with `basename` if using a custom 404 fallback.
- TypeScript strongly recommended for maintainable content schemas.

### Styling

- Tailwind CSS for fast, consistent styling.
- A dark-first theme implemented with CSS custom properties for color, spacing, borders, glow, and shadows.
- Optional: class-variance-authority for reusable component variants.

### Motion

- Framer Motion for page transitions, section reveals, and subtle interactive polish.
- Keep motion purposeful and restrained.
- Respect `prefers-reduced-motion`.

### Content

- Local TypeScript content files in `src/content/`.
- Images stored in `public/images/` for simple GitHub Pages paths.
- Resume PDF stored in `public/resume/juan-varela-resume.pdf`.
- Begin with clearly fictional but realistic mock experience, education, certifications, projects, photography, hikes, and music entries.
- Use local placeholder images with stable dimensions so real media can be swapped in without layout changes.
- Keep all replaceable copy, links, dates, statistics, and media paths out of presentation components.
- Mark placeholder downloads and external links in the content model so the UI does not lead visitors to broken destinations.

### Useful Libraries

- `lucide-react` for icons.
- `framer-motion` for animation.
- `react-router-dom` for routing.
- `clsx` or `tailwind-merge` for conditional class names.
- Optional: `yet-another-react-lightbox` for photo gallery lightbox.
- Optional: `react-markdown` if project case studies are stored as Markdown later.
- Optional: `@emailjs/browser` for a client-only contact form, or use a mailto/form provider for initial release.

## 5. GitHub Pages Hosting Strategy

The production target is Juan's GitHub user site:

- GitHub account: `JuanLord`.
- Repository: `JuanLord.github.io`.
- Production URL: `https://JuanLord.github.io/`.
- Vite base path: `/`.
- Deployment method: GitHub Actions, publishing the Vite `dist` artifact to GitHub Pages.

The implementation should:

- Use Vite.
- Use `HashRouter`.
- Set Vite `base` to `/` because this is a root user site.
- Keep asset URLs root-relative or import assets through Vite.
- Use a GitHub Actions workflow to build and deploy on pushes to `main`.

Required configuration:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: "/",
});
```

Recommended routing for first release:

```tsx
import { HashRouter } from "react-router-dom";

export function AppRouter() {
  return <HashRouter>{/* routes */}</HashRouter>;
}
```

## 6. Information Architecture

### Navigation

Primary navigation:

- Home
- About
- Projects
- Creative
- Contact

Suggested routes:

- `/` - Home
- `/about` - Bio, experience, education, certifications, resume
- `/projects` - Filterable project index
- `/projects/:slug` - Project detail or case study
- `/creative` - Hobbies and creative work landing page
- `/creative/photography` - Photo gallery
- `/creative/hiking` - Hiking highlights
- `/creative/music` - Music and media projects
- `/contact` - Contact form and profile links

For a simpler first release, the Creative route can use tabs instead of subroutes:

- `/creative?tab=photography`
- `/creative?tab=hiking`
- `/creative?tab=music`

## 7. Page Specifications

### 7.1 Home / Hero

Purpose: immediate identity, positioning, and direction.

Content:

- Name: Juan Varela.
- Role/title: customizable, for example "Engineering and Software Portfolio".
- Tagline: one concise sentence that connects professional skills with creative curiosity.
- CTAs:
  - View Projects.
  - Download Resume.
  - Contact.
- Featured project preview cards.
- Small creative teaser strip linking to photography, hiking, or music.

UX:

- First viewport should communicate identity immediately.
- Avoid a generic landing-page feel.
- Make projects reachable above the fold.
- Use a strong but calm visual composition: professional layout with hints of personality.

### 7.2 About / Experience

Purpose: establish credibility and context.

Content blocks:

- Brief bio.
- Experience timeline.
- Education.
- Certifications.
- Skills grouped by domain.
- Resume download.

Experience item fields:

- Company or organization.
- Role.
- Location.
- Start and end dates.
- Short description.
- Highlights.
- Technologies or tools.

UX:

- Timeline on desktop.
- Stacked list on mobile.
- Resume download should be visible near the top and repeated near the bottom.

### 7.3 Projects

Purpose: showcase technical work in a scannable, credible way.

Categories:

- Engineering projects.
- Software projects.

Filters:

- Category.
- Tech stack.
- Featured.
- Year.

Project card fields:

- Title.
- Category.
- Short description.
- Tech stack chips.
- Thumbnail or diagram.
- Links:
  - GitHub.
  - Live demo.
  - Case study.

Project detail fields:

- Problem.
- Role and ownership.
- Constraints.
- Architecture or approach.
- Screenshots or diagrams.
- Results or lessons.
- Links.

UX:

- Project cards should be compact and information-rich.
- Details pages should read like mini case studies.
- No project should rely only on a title and GitHub link.

### 7.4 Hobbies & Creative Work

Purpose: show personality, taste, and creative range without distracting from professional goals.

Top-level creative page:

- Tabs or sections:
  - Photography & Travel.
  - Hiking.
  - Creative / Music Projects.

Photography & Travel:

- Responsive masonry or adaptive grid.
- Image captions:
  - Location.
  - Date.
  - Short story.
- Optional lightbox.
- Optional tags such as city, landscape, architecture, nature.

Hiking:

- Trail cards with distance, region, date, difficulty, and short reflection.
- Optional static map links rather than full map integration for first release.
- Featured hike section for the most meaningful trip.

Creative / Music Projects:

- Embedded audio or video links.
- Track/project description.
- Role, instruments, software, or production notes.

### 7.5 Contact

Purpose: make contacting Juan obvious and frictionless.

Content:

- Email link.
- GitHub.
- LinkedIn.
- Optional resume link.
- Optional contact form.

Initial recommendation:

- Start with direct contact links and a simple form that opens `mailto:`.
- Add EmailJS, Formspree, Netlify Forms, or a backend later if needed.

UX:

- Contact page should be short.
- Links should have clear accessible labels.
- Use icons with text labels.

## 8. Visual Design Direction

### Personality

Dark, modern, technical, precise, and quietly expressive. The site should feel influenced by a well-designed code editor, developer console, and engineering workstation without becoming a terminal imitation. Professional sections should remain sharp and easy to scan. The creative section can be more image-led and atmospheric while retaining the same underlying system.

### Layout

- Mobile-first.
- Max content width around `1120px`.
- Dense, readable sections rather than oversized marketing blocks.
- Use full-width sections with constrained inner layouts.
- Avoid nested cards.
- Use subtle one-pixel grid lines, section indices, monospace metadata, and compact status labels to create a developer-oriented rhythm.
- Keep the hero unframed, with a restrained technical grid in the background and a small system-status or current-focus panel alongside the introduction.
- Use glow only for focused or interactive states; large neon effects should not compete with content.

### Color System

Use a dark neutral foundation with crisp technical accents:

- Canvas: near-black `#080B10`.
- Elevated background: carbon `#0C1118`.
- Surface: deep graphite `#111821`.
- Hover surface: `#16202B`.
- Main text: cool white `#E6EDF3`.
- Muted text: steel `#8B98A7`.
- Subtle text: `#667382`.
- Border: `#263241`.
- Primary accent: electric cyan `#22D3EE`.
- Success and engineering accent: signal green `#34D399`.
- Software/link accent: clear blue `#60A5FA`.
- Warm accent: amber `#FBBF24`.
- Creative accent: coral `#FB7185`.

Cyan identifies primary actions and active navigation. Green is used for availability, engineering systems, and successful states. Blue marks software projects and external links. Amber and coral are reserved for photography, hiking, music, and selected emphasis. Accent colors should occupy a small portion of the screen so the site remains professional rather than neon-heavy.

Background treatments may use very low-contrast CSS grid lines or a subtle noise bitmap. Do not use large gradients, glowing orbs, or decorative effects that reduce legibility.

### Typography

Recommended:

- Display and headings: Space Grotesk or Manrope.
- Body: Inter or Source Sans 3.
- Code/technical labels: JetBrains Mono or IBM Plex Mono.

Use monospace for section numbers, dates, technologies, project categories, and status information. Keep paragraphs and long-form case studies in the body face for comfortable reading.

Type scale:

- Hero title: `clamp(2.5rem, 7vw, 5.5rem)`.
- Page title: `clamp(2rem, 5vw, 4rem)`.
- Section heading: `1.5rem` to `2rem`.
- Body: `1rem` to `1.0625rem`.
- Meta text: `0.875rem`.

Do not scale all text with viewport width. Use clamps only for true display headings.

### Motion

Use motion for:

- Page transitions.
- Project card hover elevation.
- Image reveal on scroll.
- Active filter indicator.
- Mobile nav open/close.

Avoid:

- Constant motion.
- Decorative animations that distract from content.
- Motion that breaks `prefers-reduced-motion`.

## 9. Component Architecture

Recommended structure:

```txt
portfolio-site/
  public/
    images/
      projects/
      photography/
      hiking/
    resume/
      juan-varela-resume.pdf
  src/
    assets/
    components/
      common/
        Button.tsx
        Container.tsx
        SectionHeading.tsx
        Tag.tsx
        Card.tsx
        IconLink.tsx
      layout/
        SiteHeader.tsx
        SiteFooter.tsx
        MobileNav.tsx
        PageShell.tsx
      home/
        Hero.tsx
        FeaturedProjects.tsx
        CreativePreview.tsx
      about/
        Bio.tsx
        ExperienceTimeline.tsx
        EducationList.tsx
        SkillsGrid.tsx
        ResumePanel.tsx
      projects/
        ProjectFilters.tsx
        ProjectCard.tsx
        ProjectsGrid.tsx
        ProjectDetailHeader.tsx
        ProjectCaseStudy.tsx
      creative/
        CreativeTabs.tsx
        PhotoGallery.tsx
        PhotoCard.tsx
        HikingHighlights.tsx
        MusicProjectList.tsx
      contact/
        ContactLinks.tsx
        ContactForm.tsx
    content/
      profile.ts
      experience.ts
      education.ts
      projects.ts
      photos.ts
      hikes.ts
      music.ts
      links.ts
    pages/
      HomePage.tsx
      AboutPage.tsx
      ProjectsPage.tsx
      ProjectDetailPage.tsx
      CreativePage.tsx
      ContactPage.tsx
      NotFoundPage.tsx
    routes/
      AppRouter.tsx
    styles/
      globals.css
    types/
      content.ts
    utils/
      formatDate.ts
      getAssetPath.ts
    App.tsx
    main.tsx
```

## 10. Content Models

### Profile

```ts
export type Profile = {
  name: string;
  role: string;
  tagline: string;
  location?: string;
  email: string;
  resumeUrl: string;
};
```

### Project

```ts
export type ProjectCategory = "engineering" | "software";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  summary: string;
  description: string;
  techStack: string[];
  featured?: boolean;
  thumbnail?: string;
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  details?: {
    problem: string;
    role: string;
    approach: string[];
    outcome?: string;
    lessons?: string[];
  };
};
```

### Photo

```ts
export type Photo = {
  id: string;
  src: string;
  alt: string;
  location: string;
  date?: string;
  caption: string;
  tags?: string[];
  aspectRatio?: "portrait" | "landscape" | "square";
};
```

### Hike

```ts
export type Hike = {
  id: string;
  trail: string;
  region: string;
  date?: string;
  distanceMiles?: number;
  difficulty?: "easy" | "moderate" | "hard";
  summary: string;
  image?: string;
  mapUrl?: string;
};
```

### Music Project

```ts
export type MusicProject = {
  id: string;
  title: string;
  year?: number;
  description: string;
  role?: string;
  embedUrl?: string;
  audioUrl?: string;
  links?: {
    youtube?: string;
    soundcloud?: string;
    spotify?: string;
  };
};
```

## 11. Initial Implementation Examples

These examples show the intended patterns. They are not the complete app, but they establish the component style.

### 11.1 Router

```tsx
// src/routes/AppRouter.tsx
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { CreativePage } from "../pages/CreativePage";
import { ContactPage } from "../pages/ContactPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="creative" element={<CreativePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
```

### 11.2 Hero

```tsx
// src/components/home/Hero.tsx
import { ArrowRight, Download, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profile } from "../../content/profile";

export function Hero() {
  return (
    <section className="border-b border-slate-800 bg-[#080B10] text-slate-100">
      <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 font-mono text-sm uppercase tracking-wide text-cyan-400">
            {profile.role}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-slate-100 md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/projects">
              View Projects <ArrowRight size={18} aria-hidden />
            </Link>
            <a className="btn-secondary" href={profile.resumeUrl} download>
              Download Resume <Download size={18} aria-hidden />
            </a>
            <Link className="btn-ghost" to="/contact">
              Contact <Mail size={18} aria-hidden />
            </Link>
          </div>
        </motion.div>

        <div className="rounded border border-slate-800 bg-[#111821] p-5 shadow-2xl shadow-black/20">
          <p className="font-mono text-xs uppercase tracking-wide text-emerald-400">
            Status: building
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Engineering systems with practical constraints.</li>
            <li>Software projects with clear user value.</li>
            <li>Creative work shaped by travel, music, and exploration.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
```

### 11.3 Projects List

```tsx
// src/components/projects/ProjectsGrid.tsx
import { useMemo, useState } from "react";
import { projects } from "../../content/projects";
import { ProjectCard } from "./ProjectCard";

const filters = ["all", "engineering", "software"] as const;
type Filter = (typeof filters)[number];

export function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Projects</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Selected engineering and software work, organized by discipline.
          </p>
        </div>

        <div className="flex rounded border border-slate-800 bg-[#111821] p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              className={filter === activeFilter ? "filter-active" : "filter"}
              type="button"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
```

### 11.4 Project Detail

```tsx
// src/pages/ProjectDetailPage.tsx
import { Link, useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { projects } from "../content/projects";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-3xl font-semibold">Project not found</h1>
        <Link className="mt-6 inline-flex text-teal-700" to="/projects">
          Back to projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-14">
      <p className="font-mono text-sm uppercase tracking-wide text-teal-700">
        {project.category} / {project.year}
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
        {project.title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span className="tag" key={tech}>
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {project.links.github && (
          <a className="btn-secondary" href={project.links.github}>
            GitHub <ExternalLink size={16} aria-hidden />
          </a>
        )}
        {project.links.demo && (
          <a className="btn-primary" href={project.links.demo}>
            Live Demo <ExternalLink size={16} aria-hidden />
          </a>
        )}
      </div>

      {project.details && (
        <section className="mt-12 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <aside>
            <h2 className="text-xl font-semibold">Role</h2>
            <p className="mt-3 text-neutral-700">{project.details.role}</p>
          </aside>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold">Problem</h2>
              <p className="mt-3 text-neutral-700">{project.details.problem}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Approach</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
                {project.details.approach.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
```

### 11.5 Photo Gallery

```tsx
// src/components/creative/PhotoGallery.tsx
import { photos } from "../../content/photos";

export function PhotoGallery() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {photos.map((photo) => (
          <figure
            className="mb-5 break-inside-avoid overflow-hidden rounded border border-slate-800 bg-[#111821]"
            key={photo.id}
          >
            <img
              alt={photo.alt}
              className="h-auto w-full object-cover"
              loading="lazy"
              src={photo.src}
            />
            <figcaption className="p-4">
              <p className="font-medium text-slate-100">{photo.location}</p>
              <p className="mt-1 text-sm text-neutral-500">{photo.date}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                {photo.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

## 12. Data File Examples

### Profile

```ts
// src/content/profile.ts
export const profile = {
  name: "Juan Varela",
  role: "Developer and Engineer",
  tagline:
    "I design and build practical systems where software, engineering, and creative problem-solving meet.",
  email: "hello@example.com",
  github: "https://github.com/JuanLord",
  resumeUrl: "/resume/juan-varela-resume.pdf",
  isPlaceholder: true,
};
```

### Projects

```ts
// src/content/projects.ts
import type { Project } from "../types/content";

export const projects: Project[] = [
  {
    slug: "autonomous-sorting-system",
    title: "Autonomous Sorting System",
    category: "engineering",
    year: 2026,
    summary: "A controls-focused system for classifying and routing objects.",
    description:
      "Designed a prototype that combines sensing, actuation, and software logic to sort objects reliably under practical constraints.",
    techStack: ["Python", "Arduino", "CAD", "Control Systems"],
    featured: true,
    thumbnail: "/images/projects/autonomous-sorting-system.jpg",
    links: {
      github: "https://github.com/JuanLord/placeholder-project",
    },
    details: {
      problem:
        "Manual sorting is slow, inconsistent, and difficult to scale in constrained environments.",
      role: "System design, software logic, hardware integration, and testing.",
      approach: [
        "Mapped sensor inputs to routing decisions.",
        "Built iterative prototypes to evaluate reliability.",
        "Documented tradeoffs between speed, accuracy, and mechanical complexity.",
      ],
      outcome:
        "Produced a working proof of concept and a clear roadmap for improving throughput.",
    },
  },
];
```

## 13. Accessibility Requirements

- All images must have meaningful `alt` text.
- Decorative icons must use `aria-hidden`.
- Buttons and links must have clear labels.
- Keyboard users must be able to navigate menus, filters, galleries, and forms.
- Maintain color contrast of at least WCAG AA.
- Use semantic HTML:
  - `main`
  - `section`
  - `article`
  - `nav`
  - `header`
  - `footer`
- Keep focus styles visible.
- Respect `prefers-reduced-motion`.

## 14. Performance Requirements

- Use Vite production build.
- Keep initial JavaScript minimal.
- Lazy-load route components once the site grows.
- Use optimized images:
  - Prefer WebP or AVIF for gallery images.
  - Keep large images under reasonable dimensions.
  - Use `loading="lazy"` for non-critical images.
- Avoid heavy map libraries in the first release.
- Use static content files for fast rendering.
- Run Lighthouse checks before deployment.

Target Lighthouse goals:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## 15. SEO and Metadata

Implement:

- Unique page titles.
- Meta descriptions.
- Open Graph image and title.
- Canonical URL if using a custom domain.
- JSON-LD Person schema.
- Sitemap optional for first release, useful later.

Recommended:

```tsx
// src/components/common/SEO.tsx
type SEOProps = {
  title: string;
  description: string;
};

export function SEO({ title, description }: SEOProps) {
  document.title = `${title} | Juan Varela`;

  const meta = document.querySelector("meta[name='description']");
  meta?.setAttribute("content", description);

  return null;
}
```

For a more robust version later, use React Helmet Async.

## 16. Responsive Behavior

### Mobile

- Single-column layout.
- Bottom spacing between sections should be generous but not oversized.
- Header collapses into icon menu.
- Project filters become horizontally scrollable segmented controls.
- Gallery uses one column.

### Tablet

- Two-column project grid.
- Timeline can remain stacked or become compact two-column.
- Creative tabs remain visible.

### Desktop

- Hero uses two columns.
- Project grid uses three columns.
- About timeline can use left rail dates and right content.
- Creative gallery uses masonry-like columns.

## 17. Maintainability Patterns

- Keep content in `src/content`.
- Keep route pages thin. Pages compose components and pass data.
- Keep shared UI primitives in `components/common`.
- Use typed content models.
- Use project slugs as stable IDs.
- Avoid hard-coding personal links in multiple components.
- Add one project by creating one content object and adding images.
- Add one photo by adding one photo object.

## 18. Setup Instructions

Create project:

```bash
npm create vite@latest portfolio-site -- --template react-ts
cd portfolio-site
npm install
```

Install libraries:

```bash
npm install react-router-dom framer-motion lucide-react clsx
npm install -D tailwindcss postcss autoprefixer gh-pages
npx tailwindcss init -p
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Deploy with `gh-pages`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Then:

```bash
npm run deploy
```

## 19. GitHub Pages Deployment Options

### Option A: `gh-pages` Package

Supported as a manual fallback, but not recommended for this project.

Steps:

1. Build the app.
2. Publish `dist` to the `gh-pages` branch.
3. Configure GitHub Pages to serve from the `gh-pages` branch.

### Option B: GitHub Actions

Recommended for `JuanLord.github.io`. Every push to `main` should build, validate, and deploy the current production version.

Workflow outline:

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 20. Initial Build Milestones

### Milestone 1: Foundation

- Create Vite React TypeScript app.
- Add Tailwind CSS.
- Add React Router.
- Add global layout, header, footer.
- Add core content files.

### Milestone 2: Professional Profile

- Build Home page.
- Build About page.
- Add resume PDF path.
- Add contact links.

### Milestone 3: Projects

- Build projects index.
- Add filters.
- Build project card.
- Build project detail page.
- Add first 2 to 4 placeholder projects.

### Milestone 4: Creative Work

- Build Creative page.
- Add photography gallery.
- Add hiking highlights.
- Add music project list.

### Milestone 5: Polish and Deploy

- Add motion.
- Optimize responsive details.
- Add SEO metadata.
- Audit accessibility.
- Build and deploy to GitHub Pages.

## 21. Content Replacement Checklist for Juan

None of the following is required to start building. The first implementation will generate and use mock records, placeholder links, a placeholder resume file, and locally stored placeholder media. Before the public portfolio is treated as final, replace the following:

- Resume PDF.
- Professional headshot or alternative personal image.
- Final title/role.
- Short bio.
- Work experience entries.
- Education entries.
- Certifications.
- 3 to 6 featured projects.
- GitHub and live demo links.
- Project screenshots or diagrams.
- 8 to 15 photography images.
- 3 to 6 hiking entries.
- Music embeds or links.
- LinkedIn URL.
- GitHub URL.
- Preferred contact email.

The implementation should make placeholder status obvious during development. Before production sign-off, add an automated content check that fails when known placeholder domains, placeholder flags, or temporary resume assets remain.

## 22. Future Enhancements

- Markdown-based case studies.
- Searchable project index.
- Lightbox with keyboard navigation.
- Interactive map for hikes and travel.
- Optional light theme.
- Blog or notes section.
- CMS integration using GitHub-backed content.
- Analytics with a privacy-friendly provider.
- Custom domain.

## 23. Definition of Done for First Release

The first release is complete when:

- All primary routes work on GitHub Pages.
- The site is responsive across mobile, tablet, and desktop.
- Resume download works.
- Projects can be filtered and opened as detail pages.
- Creative section has generated placeholder content with the final structure.
- Placeholder content is visually complete and does not create broken links or empty states.
- Production deployment is configured for `https://JuanLord.github.io/` with Vite `base: "/"`.
- Contact links work.
- Build succeeds without TypeScript errors.
- Lighthouse scores are within target range.
- Keyboard navigation and focus states are verified.
- The deployed GitHub Pages URL is available and shareable.
