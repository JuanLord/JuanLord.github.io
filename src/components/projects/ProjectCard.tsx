import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types/content";
import { PlaceholderBadge } from "../ui/PlaceholderBadge";
import { ProjectVisual } from "./ProjectVisual";

interface ProjectCardProps {
  index: number;
  project: Project;
}

export function ProjectCard({ index, project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <Link
        aria-label={`View ${project.title} case study`}
        className="project-card-visual-link"
        to={`/projects/${project.slug}`}
      >
        <ProjectVisual project={project} />
      </Link>

      <div className="project-card-body">
        <div className="project-card-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className={`project-type project-type-${project.category}`}>
            {project.category}
          </span>
          <span>{project.year}</span>
        </div>

        <div className="project-card-heading">
          <h2>
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h2>
          <PlaceholderBadge />
        </div>

        <p className="project-card-summary">{project.summary}</p>

        <ul className="project-tech-list" aria-label="Technology stack">
          {project.techStack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>

        <Link
          className="project-card-detail-link"
          to={`/projects/${project.slug}`}
        >
          View case study
          <ArrowUpRight aria-hidden size={17} />
        </Link>
      </div>
    </article>
  );
}
