import { ArrowLeft, ArrowRight, Braces, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProjectVisual } from "../components/projects/ProjectVisual";
import { Container } from "../components/ui/Container";
import { PlaceholderBadge } from "../components/ui/PlaceholderBadge";
import { PlaceholderAction } from "../components/ui/PlaceholderAction";
import { getNextProject, getProjectBySlug } from "../lib/content";

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <section className="module-page">
        <Container className="not-found">
          <p className="section-index">Error / Project not found</p>
          <h1>Case study unavailable.</h1>
          <p>
            The requested project does not exist in the placeholder content
            index.
          </p>
          <Link className="action-link action-link-primary" to="/projects">
            <ArrowLeft aria-hidden size={18} />
            Back to projects
          </Link>
        </Container>
      </section>
    );
  }

  const nextProject = getNextProject(project.slug);
  const hasPlaceholderLinks = project.links.some((link) => link.placeholder);

  return (
    <>
      <section className="project-detail-hero">
        <Container>
          <Link className="project-back-link" to="/projects">
            <ArrowLeft aria-hidden size={16} />
            Project index
          </Link>

          <div className="project-detail-heading">
            <div>
              <p className="module-eyebrow">
                <span>02</span>
                {project.category} case study
              </p>
              <h1>{project.title}</h1>
            </div>
            <div className="project-detail-summary">
              <p>{project.summary}</p>
              <div className="project-detail-status">
                <PlaceholderBadge />
                <span>{project.year}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="project-detail-visual">
        <Container>
          <ProjectVisual project={project} />
        </Container>
      </section>

      <section
        className="case-study-section"
        aria-labelledby="case-study-title"
      >
        <Container className="case-study-layout">
          <aside className="case-study-sidebar">
            <p className="section-index">02.1 / System record</p>
            <h2 id="case-study-title">Project data</h2>

            <dl className="project-facts">
              <div>
                <dt>Discipline</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Placeholder case study</dd>
              </div>
            </dl>

            <ul className="project-tech-list" aria-label="Technology stack">
              {project.techStack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>

            <div className="project-links">
              {project.links.map((link) =>
                link.placeholder ? (
                  <PlaceholderAction
                    describedBy="project-link-placeholder-note"
                    icon={ExternalLink}
                    key={link.label}
                  >
                    {link.label}
                  </PlaceholderAction>
                ) : (
                  <a
                    className="action-link action-link-secondary"
                    href={link.href}
                    key={link.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ExternalLink aria-hidden size={18} strokeWidth={1.8} />
                  </a>
                ),
              )}
              {hasPlaceholderLinks && (
                <p id="project-link-placeholder-note">
                  Source and demo links activate when real project URLs are
                  supplied.
                </p>
              )}
            </div>
          </aside>

          <div className="case-study-content">
            <article className="case-study-block">
              <div className="case-study-block-index">
                <span>01</span>
                <Braces aria-hidden size={20} />
              </div>
              <div>
                <p className="section-index">Context</p>
                <h2>Problem</h2>
                <p>{project.details.problem}</p>
              </div>
            </article>

            <article className="case-study-block">
              <div className="case-study-block-index">
                <span>02</span>
              </div>
              <div>
                <p className="section-index">Ownership</p>
                <h2>Role</h2>
                <p>{project.details.role}</p>
              </div>
            </article>

            <article className="case-study-block">
              <div className="case-study-block-index">
                <span>03</span>
              </div>
              <div>
                <p className="section-index">Boundaries</p>
                <h2>Constraints</h2>
                <ul className="case-study-list">
                  {project.details.constraints.map((constraint) => (
                    <li key={constraint}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="case-study-block">
              <div className="case-study-block-index">
                <span>04</span>
              </div>
              <div>
                <p className="section-index">Build</p>
                <h2>Approach</h2>
                <ol className="case-study-steps">
                  {project.details.approach.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            <article className="case-study-block case-study-outcome">
              <div className="case-study-block-index">
                <span>05</span>
              </div>
              <div>
                <p className="section-index">Result</p>
                <h2>Outcome</h2>
                <p>{project.details.outcome}</p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section className="next-project">
        <Container className="next-project-inner">
          <div>
            <p className="section-index">Next case study</p>
            <h2>{nextProject.title}</h2>
          </div>
          <Link
            aria-label={`View ${nextProject.title} case study`}
            className="action-link action-link-primary"
            to={`/projects/${nextProject.slug}`}
          >
            Continue
            <ArrowRight aria-hidden size={18} />
          </Link>
        </Container>
      </section>
    </>
  );
}
