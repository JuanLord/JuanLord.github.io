import { useState } from "react";
import type {
  CreativeEmbedProvider,
  CreativeProject,
} from "../../../src/types/content";
import { EditorLayout } from "../components/EditorLayout";
import {
  EmbedField,
  SelectField,
  StatusField,
  TextAreaField,
  TextField,
} from "../components/Fields";
import { normalizeEmbed, slugify } from "../lib/studio";
import type { StudioDocument } from "../types";

interface ProjectsEditorProps {
  document: StudioDocument;
  onChange: (document: StudioDocument) => void;
}

function newProject(index: number): CreativeProject {
  return {
    slug: `new-creative-project-${index}`,
    title: "New Creative Project",
    year: new Date().getFullYear(),
    kind: "short-film",
    description: "",
    role: "",
    tools: [],
    embed: {
      provider: "youtube",
      title: "Creative project",
      placeholder: true,
    },
    status: "draft",
  };
}

export function ProjectsEditor({ document, onChange }: ProjectsEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    document.creativeProjects[0]?.slug,
  );
  const activeSlug = document.creativeProjects.some(
    (project) => project.slug === selectedSlug,
  )
    ? selectedSlug
    : document.creativeProjects[0]?.slug;
  const selected = document.creativeProjects.find(
    (project) => project.slug === activeSlug,
  );

  const replaceProject = (project: CreativeProject) => {
    onChange({
      ...document,
      creativeProjects: document.creativeProjects.map((item) =>
        item.slug === activeSlug ? project : item,
      ),
    });
    if (project.slug !== activeSlug) setSelectedSlug(project.slug);
  };

  const updateProject = (patch: Partial<CreativeProject>) => {
    if (selected) replaceProject({ ...selected, ...patch });
  };

  const addProject = () => {
    const project = newProject(document.creativeProjects.length + 1);
    onChange({
      ...document,
      creativeProjects: [...document.creativeProjects, project],
    });
    setSelectedSlug(project.slug);
  };

  const removeProject = () => {
    if (!selected || !window.confirm(`Delete ${selected.title}?`)) return;
    onChange({
      ...document,
      creativeProjects: document.creativeProjects.filter(
        (project) => project.slug !== selected.slug,
      ),
    });
  };

  const changeKind = (kind: CreativeProject["kind"]) => {
    if (!selected) return;
    const provider: CreativeEmbedProvider =
      kind === "short-film" ? "youtube" : "spotify";
    replaceProject({
      ...selected,
      kind,
      embed: normalizeEmbed(provider, "", `${selected.title} project`),
    });
  };

  const changeProvider = (provider: CreativeEmbedProvider) => {
    if (!selected) return;
    updateProject({
      embed: normalizeEmbed(
        provider,
        selected.embed.sourceUrl || "",
        `${selected.title} project`,
      ),
    });
  };

  return (
    <EditorLayout
      eyebrow="Film and sound"
      title="Creative Projects"
      items={document.creativeProjects}
      selectedKey={activeSlug}
      getKey={(project) => project.slug}
      getTitle={(project) => project.title}
      getMeta={(project) =>
        `${project.year} · ${project.kind.replace("-", " ")}`
      }
      onSelect={setSelectedSlug}
      onAdd={addProject}
      onDelete={removeProject}
    >
      {selected ? (
        <div className="form-section">
          <div className="section-heading">
            <div>
              <p>Project record</p>
              <h2>{selected.title}</h2>
            </div>
            <span className={`status-chip status-${selected.status}`}>
              {selected.status}
            </span>
          </div>
          <div className="form-grid">
            <TextField
              label="Title"
              value={selected.title}
              onChange={(title) =>
                updateProject({ title, slug: slugify(title) || selected.slug })
              }
            />
            <TextField
              label="Slug"
              value={selected.slug}
              onChange={(slug) => updateProject({ slug: slugify(slug) })}
            />
            <TextField
              label="Year"
              type="number"
              min={1900}
              value={selected.year}
              onChange={(year) => updateProject({ year: Number(year) })}
            />
            <SelectField
              label="Project type"
              value={selected.kind}
              onChange={changeKind}
              options={[
                { value: "short-film", label: "Short film" },
                { value: "music", label: "Music" },
              ]}
            />
            <TextField
              label="Role"
              value={selected.role}
              onChange={(role) => updateProject({ role })}
              span="full"
            />
            <TextField
              label="Tools"
              value={selected.tools.join(", ")}
              onChange={(tools) =>
                updateProject({
                  tools: tools
                    .split(",")
                    .map((tool) => tool.trim())
                    .filter(Boolean),
                })
              }
              span="full"
            />
            <TextAreaField
              label="Description"
              value={selected.description}
              onChange={(description) => updateProject({ description })}
              rows={6}
            />
            <SelectField
              label="Media provider"
              value={selected.embed.provider}
              onChange={changeProvider}
              options={
                selected.kind === "short-film"
                  ? [
                      { value: "youtube", label: "YouTube" },
                      { value: "vimeo", label: "Vimeo" },
                    ]
                  : [
                      { value: "spotify", label: "Spotify" },
                      { value: "soundcloud", label: "SoundCloud" },
                    ]
              }
            />
            <StatusField
              value={selected.status}
              onChange={(status) => updateProject({ status })}
            />
            <EmbedField
              provider={selected.embed.provider}
              title={`${selected.title} project`}
              embed={selected.embed}
              onChange={(embed) => updateProject({ embed })}
            />
          </div>
        </div>
      ) : (
        <div className="empty-editor">Create a project to begin.</div>
      )}
    </EditorLayout>
  );
}
