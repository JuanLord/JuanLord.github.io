import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  ExternalLink,
  Project,
  ProjectCategory,
} from "../../../src/types/content";
import { EditorLayout } from "../components/EditorLayout";
import {
  Field,
  SelectField,
  StatusField,
  TextAreaField,
  TextField,
} from "../components/Fields";
import { slugify } from "../lib/studio";
import type { StudioDocument } from "../types";

interface DeveloperProjectsEditorProps {
  document: StudioDocument;
  onChange: (document: StudioDocument) => void;
}

function newProject(index: number): Project {
  return {
    slug: `new-professional-project-${index}`,
    title: "New Professional Project",
    category: "software",
    year: new Date().getFullYear(),
    summary: "",
    techStack: [],
    featured: false,
    media: {
      alt: "Project preview",
      aspectRatio: "16/10",
      placeholder: true,
    },
    links: [],
    details: {
      problem: "",
      role: "",
      constraints: [],
      approach: [],
      outcome: "",
    },
    status: "draft",
  };
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function DeveloperProjectsEditor({
  document,
  onChange,
}: DeveloperProjectsEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    document.developerProjects[0]?.slug,
  );
  const activeSlug = document.developerProjects.some(
    (project) => project.slug === selectedSlug,
  )
    ? selectedSlug
    : document.developerProjects[0]?.slug;
  const selected = document.developerProjects.find(
    (project) => project.slug === activeSlug,
  );

  const replaceProject = (project: Project) => {
    onChange({
      ...document,
      developerProjects: document.developerProjects.map((item) =>
        item.slug === activeSlug ? project : item,
      ),
    });
    if (project.slug !== activeSlug) setSelectedSlug(project.slug);
  };

  const updateProject = (patch: Partial<Project>) => {
    if (selected) replaceProject({ ...selected, ...patch });
  };

  const addProject = () => {
    const project = newProject(document.developerProjects.length + 1);
    onChange({
      ...document,
      developerProjects: [...document.developerProjects, project],
    });
    setSelectedSlug(project.slug);
  };

  const removeProject = () => {
    if (!selected || !window.confirm(`Delete ${selected.title}?`)) return;
    onChange({
      ...document,
      developerProjects: document.developerProjects.filter(
        (project) => project.slug !== selected.slug,
      ),
    });
  };

  const updateLink = (index: number, patch: Partial<ExternalLink>) => {
    if (!selected) return;
    updateProject({
      links: selected.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link,
      ),
    });
  };

  return (
    <EditorLayout
      eyebrow="Engineering and software"
      title="Professional Projects"
      items={document.developerProjects}
      selectedKey={activeSlug}
      getKey={(project) => project.slug}
      getTitle={(project) => project.title}
      getMeta={(project) => `${project.year} · ${project.category}`}
      onSelect={setSelectedSlug}
      onAdd={addProject}
      onDelete={removeProject}
    >
      {selected ? (
        <>
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
                  updateProject({
                    title,
                    slug: slugify(title) || selected.slug,
                  })
                }
              />
              <TextField
                label="Slug"
                value={selected.slug}
                onChange={(slug) => updateProject({ slug: slugify(slug) })}
              />
              <SelectField<ProjectCategory>
                label="Category"
                value={selected.category}
                onChange={(category) => updateProject({ category })}
                options={[
                  { value: "engineering", label: "Engineering" },
                  { value: "software", label: "Software" },
                ]}
              />
              <TextField
                label="Year"
                type="number"
                min={1900}
                value={selected.year}
                onChange={(year) => updateProject({ year: Number(year) })}
              />
              <TextField
                label="Technology stack"
                value={selected.techStack.join(", ")}
                onChange={(techStack) =>
                  updateProject({
                    techStack: techStack
                      .split(",")
                      .map((technology) => technology.trim())
                      .filter(Boolean),
                  })
                }
                span="full"
              />
              <TextAreaField
                label="Summary"
                value={selected.summary}
                onChange={(summary) => updateProject({ summary })}
                rows={5}
              />
              <Field label="Display" span="full">
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={selected.featured}
                    onChange={(event) =>
                      updateProject({ featured: event.target.checked })
                    }
                  />
                  <span>Feature this project on the home page</span>
                </label>
              </Field>
              <StatusField
                value={selected.status}
                onChange={(status) => updateProject({ status })}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>Case study</p>
                <h2>Project Details</h2>
              </div>
            </div>
            <div className="form-grid">
              <TextAreaField
                label="Problem"
                value={selected.details.problem}
                onChange={(problem) =>
                  updateProject({
                    details: { ...selected.details, problem },
                  })
                }
              />
              <TextAreaField
                label="Your role"
                value={selected.details.role}
                onChange={(role) =>
                  updateProject({ details: { ...selected.details, role } })
                }
              />
              <TextAreaField
                label="Constraints (one per line)"
                value={selected.details.constraints.join("\n")}
                onChange={(constraints) =>
                  updateProject({
                    details: {
                      ...selected.details,
                      constraints: splitLines(constraints),
                    },
                  })
                }
              />
              <TextAreaField
                label="Approach (one step per line)"
                value={selected.details.approach.join("\n")}
                onChange={(approach) =>
                  updateProject({
                    details: {
                      ...selected.details,
                      approach: splitLines(approach),
                    },
                  })
                }
              />
              <TextAreaField
                label="Outcome"
                value={selected.details.outcome}
                onChange={(outcome) =>
                  updateProject({
                    details: { ...selected.details, outcome },
                  })
                }
                rows={5}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>Destinations</p>
                <h2>Project Links</h2>
              </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={() =>
                  updateProject({
                    links: [
                      ...selected.links,
                      { label: "Project link", href: "", placeholder: true },
                    ],
                  })
                }
              >
                <Plus size={16} aria-hidden="true" />
                Add link
              </button>
            </div>
            <div className="link-editor-list">
              {selected.links.map((link, index) => (
                <div className="link-editor-row" key={`${link.label}-${index}`}>
                  <input
                    aria-label={`Link ${index + 1} label`}
                    value={link.label}
                    onChange={(event) =>
                      updateLink(index, { label: event.target.value })
                    }
                  />
                  <input
                    aria-label={`Link ${index + 1} URL`}
                    type="url"
                    value={link.href}
                    placeholder="https://..."
                    onChange={(event) =>
                      updateLink(index, {
                        href: event.target.value,
                        placeholder: !event.target.value,
                      })
                    }
                  />
                  <button
                    className="icon-button danger"
                    type="button"
                    title="Remove link"
                    aria-label={`Remove ${link.label || "link"}`}
                    onClick={() =>
                      updateProject({
                        links: selected.links.filter(
                          (_, linkIndex) => linkIndex !== index,
                        ),
                      })
                    }
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
              {!selected.links.length ? (
                <p className="empty-inline">No project links yet.</p>
              ) : null}
            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>Visual metadata</p>
                <h2>Project Media</h2>
              </div>
            </div>
            <div className="form-grid">
              <TextField
                label="Image URL"
                type="url"
                value={selected.media.src || ""}
                onChange={(src) =>
                  updateProject({
                    media: {
                      ...selected.media,
                      src: src || undefined,
                      placeholder: !src,
                    },
                  })
                }
                span="full"
              />
              <TextField
                label="Alternative text"
                value={selected.media.alt}
                onChange={(alt) =>
                  updateProject({
                    media: { ...selected.media, alt },
                  })
                }
              />
              <TextField
                label="Aspect ratio"
                value={selected.media.aspectRatio}
                onChange={(aspectRatio) =>
                  updateProject({
                    media: {
                      ...selected.media,
                      aspectRatio:
                        aspectRatio as Project["media"]["aspectRatio"],
                    },
                  })
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div className="empty-editor">
          Create a professional project to begin.
        </div>
      )}
    </EditorLayout>
  );
}
