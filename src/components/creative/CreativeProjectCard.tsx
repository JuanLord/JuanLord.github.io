import { Film, Music2 } from "lucide-react";
import type { CreativeProject } from "../../types/content";
import { EmbedPanel } from "./EmbedPanel";

interface CreativeProjectCardProps {
  project: CreativeProject;
}

export function CreativeProjectCard({ project }: CreativeProjectCardProps) {
  const Icon = project.kind === "short-film" ? Film : Music2;

  return (
    <article className="creative-project-card">
      <EmbedPanel embed={project.embed} />
      <div className="creative-project-card-copy">
        <div className="creative-project-meta">
          <span>
            <Icon aria-hidden size={16} strokeWidth={1.5} />
            {project.kind === "short-film" ? "Short film" : "Music"}
          </span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <strong>{project.role}</strong>
        <ul aria-label={`${project.title} tools`}>
          {project.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
