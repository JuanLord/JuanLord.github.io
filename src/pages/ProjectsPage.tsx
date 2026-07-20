import { useSearchParams } from "react-router-dom";
import { ProjectCard } from "../components/projects/ProjectCard";
import { Container } from "../components/ui/Container";
import { PageIntro } from "../components/ui/PageIntro";
import { getProjectsByCategory } from "../lib/content";
import type { ProjectCategory } from "../types/content";

type ProjectFilter = ProjectCategory | "all";

const filters: { label: string; value: ProjectFilter }[] = [
  { label: "All work", value: "all" },
  { label: "Engineering", value: "engineering" },
  { label: "Software", value: "software" },
];

function isProjectFilter(value: string | null): value is ProjectFilter {
  return filters.some((filter) => filter.value === value);
}

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get("category");
  const activeFilter = isProjectFilter(requestedFilter)
    ? requestedFilter
    : "all";
  const visibleProjects = getProjectsByCategory(activeFilter);

  function selectFilter(filter: ProjectFilter) {
    if (filter === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: filter });
  }

  return (
    <>
      <PageIntro eyebrow="Selected work" index="02" title="Projects">
        <p>
          Mock case studies across engineering and software, organized around
          the decisions, constraints, and implementation work behind each
          system.
        </p>
        <div className="project-index-meta">
          <span>{String(visibleProjects.length).padStart(2, "0")} visible</span>
          <span>All records are placeholders</span>
        </div>
      </PageIntro>

      <section className="projects-section" aria-labelledby="projects-title">
        <Container>
          <div className="projects-toolbar">
            <div>
              <p className="section-index">02.1 / Index</p>
              <h2 id="projects-title">Project archive</h2>
            </div>

            <div
              aria-label="Filter projects by category"
              className="filters"
              role="group"
            >
              {filters.map((filter) => (
                <button
                  aria-pressed={activeFilter === filter.value}
                  className="filter-button"
                  key={filter.value}
                  onClick={() => selectFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                  <span aria-hidden>
                    {getProjectsByCategory(filter.value)
                      .length.toString()
                      .padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid" aria-live="polite">
            {visibleProjects.map((project, index) => (
              <ProjectCard index={index} key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
