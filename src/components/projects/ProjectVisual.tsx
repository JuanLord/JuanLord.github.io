import { ChartNoAxesCombined, Cpu, Waves } from "lucide-react";
import type { Project } from "../../types/content";

interface ProjectVisualProps {
  project: Project;
}

export function ProjectVisual({ project }: ProjectVisualProps) {
  const isEngineering = project.category === "engineering";
  const Icon = isEngineering ? Cpu : ChartNoAxesCombined;

  return (
    <div
      aria-label={project.media.alt}
      className={`project-visual project-visual-${project.category}`}
      role="img"
      style={{ aspectRatio: project.media.aspectRatio }}
    >
      <div className="project-visual-header" aria-hidden>
        <span className="project-visual-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{isEngineering ? "SYS.PROTOTYPE" : "APP.WORKSPACE"}</span>
        <span>{project.year}</span>
      </div>

      <div className="project-visual-stage" aria-hidden>
        <div className="project-visual-axis project-visual-axis-x" />
        <div className="project-visual-axis project-visual-axis-y" />
        {isEngineering ? (
          <>
            <div className="engineering-node engineering-node-a">
              <span />
            </div>
            <div className="engineering-node engineering-node-b">
              <span />
            </div>
            <div className="engineering-path" />
            <Waves className="engineering-wave" size={32} strokeWidth={1.2} />
          </>
        ) : (
          <div className="software-telemetry">
            {[36, 58, 44, 76, 62, 88, 52].map((height, index) => (
              <span
                key={`${project.slug}-${height}`}
                style={{ height: `${height}%` }}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
              </span>
            ))}
          </div>
        )}
        <div className="project-visual-icon">
          <Icon size={28} strokeWidth={1.25} />
        </div>
      </div>

      <div className="project-visual-footer" aria-hidden>
        <span>{project.slug}</span>
        <span>PLACEHOLDER / {project.category.toUpperCase()}</span>
      </div>
    </div>
  );
}
