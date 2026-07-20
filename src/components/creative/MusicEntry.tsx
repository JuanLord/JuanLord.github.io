import { ExternalLink, Headphones, Play } from "lucide-react";
import type { MusicProject } from "../../types/content";
import { PlaceholderAction } from "../ui/PlaceholderAction";

interface MusicEntryProps {
  index: number;
  project: MusicProject;
}

const waveform = [32, 56, 38, 72, 88, 52, 66, 42, 78, 48, 62, 34];

export function MusicEntry({ index, project }: MusicEntryProps) {
  const noteId = `music-placeholder-${project.id}`;

  return (
    <article className="music-entry">
      <div
        aria-label={project.cover.alt}
        className={`music-artwork music-artwork-${index + 1}`}
        role="img"
      >
        <div className="music-artwork-ring" aria-hidden />
        <div className="music-waveform" aria-hidden>
          {waveform.map((height, waveIndex) => (
            <span
              key={`${project.id}-${height}-${waveIndex}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <Headphones aria-hidden size={24} strokeWidth={1.35} />
        <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="music-entry-copy">
        <div className="music-entry-meta">
          <span>{project.format}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p className="music-role">{project.role}</p>
        <ul aria-label="Creative tools">
          {project.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>

        <div className="music-entry-action">
          {project.mediaLink.placeholder ? (
            <>
              <PlaceholderAction describedBy={noteId} icon={Play}>
                {project.mediaLink.label}
              </PlaceholderAction>
              <p id={noteId}>
                Media player activates when a real link is added.
              </p>
            </>
          ) : (
            <a
              className="action-link creative-media-link"
              href={project.mediaLink.href}
              rel="noreferrer"
              target="_blank"
            >
              {project.mediaLink.label}
              <ExternalLink aria-hidden size={18} strokeWidth={1.8} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
