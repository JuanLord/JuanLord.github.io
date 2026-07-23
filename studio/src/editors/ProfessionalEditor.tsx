import { FileText, LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { StatusField, TextAreaField, TextField } from "../components/Fields";
import { uploadResume } from "../lib/studio";
import type { StudioDocument } from "../types";

interface ProfessionalEditorProps {
  document: StudioDocument;
  onChange: (document: StudioDocument) => void;
}

export function ProfessionalEditor({
  document,
  onChange,
}: ProfessionalEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const { profile } = document;

  const updateProfile = (patch: Partial<typeof profile>) => {
    onChange({ ...document, profile: { ...profile, ...patch } });
  };

  const updateLink = (
    key: "email" | "github" | "linkedin" | "resume",
    patch: Partial<(typeof profile)[typeof key]>,
  ) => {
    updateProfile({ [key]: { ...profile[key], ...patch } });
  };

  const handleResume = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    try {
      const response = await uploadResume(file);
      updateLink("resume", {
        href: response.href,
        label: "Resume",
        placeholder: false,
      });
      setUploadMessage(
        `${file.name} uploaded (${(response.size / 1024).toFixed(0)} KB).`,
      );
    } catch (error) {
      setUploadMessage(
        error instanceof Error ? error.message : "Resume upload failed.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="single-editor-page">
      <header className="page-heading">
        <div>
          <p>Professional identity</p>
          <h1>Profile & Resume</h1>
        </div>
      </header>

      <div className="single-editor-grid">
        <section className="form-section">
          <div className="section-heading">
            <div>
              <p>Public introduction</p>
              <h2>{profile.name}</h2>
            </div>
            <span className={`status-chip status-${profile.status}`}>
              {profile.status}
            </span>
          </div>
          <div className="form-grid">
            <TextField
              label="Name"
              value={profile.name}
              onChange={(name) => updateProfile({ name })}
            />
            <TextField
              label="Role"
              value={profile.role}
              onChange={(role) => updateProfile({ role })}
            />
            <TextField
              label="Tagline"
              value={profile.tagline}
              onChange={(tagline) => updateProfile({ tagline })}
              span="full"
            />
            <TextField
              label="Location"
              value={profile.location}
              onChange={(location) => updateProfile({ location })}
            />
            <TextField
              label="Availability"
              value={profile.availability}
              onChange={(availability) => updateProfile({ availability })}
            />
            <TextAreaField
              label="Biography"
              value={profile.bio.join("\n\n")}
              onChange={(bio) =>
                updateProfile({
                  bio: bio
                    .split(/\n\s*\n/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean),
                })
              }
              rows={8}
            />
            <StatusField
              value={profile.status}
              onChange={(status) => updateProfile({ status })}
            />
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <div>
              <p>Contact and documents</p>
              <h2>Links</h2>
            </div>
          </div>
          <div className="form-grid">
            <TextField
              label="Email label"
              value={profile.email.label}
              onChange={(label) => updateLink("email", { label })}
            />
            <TextField
              label="Email address"
              value={profile.email.href.replace(/^mailto:/, "")}
              onChange={(email) =>
                updateLink("email", {
                  href: email ? `mailto:${email.replace(/^mailto:/, "")}` : "",
                  placeholder: !email,
                })
              }
            />
            <TextField
              label="GitHub URL"
              type="url"
              value={profile.github.href}
              onChange={(href) =>
                updateLink("github", { href, placeholder: !href })
              }
              span="full"
            />
            <TextField
              label="LinkedIn URL"
              type="url"
              value={profile.linkedin.href}
              onChange={(href) =>
                updateLink("linkedin", { href, placeholder: !href })
              }
              span="full"
            />
          </div>

          <div className="resume-upload">
            <div className="resume-file">
              <FileText size={22} aria-hidden="true" />
              <div>
                <strong>juan-varela-resume.pdf</strong>
                <span>
                  {profile.resume.placeholder
                    ? "No public resume uploaded"
                    : "Ready at /resume/juan-varela-resume.pdf"}
                </span>
              </div>
            </div>
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => void handleResume(event.target.files?.[0])}
            />
            <button
              className="button button-secondary"
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <LoaderCircle className="spin" size={16} aria-hidden="true" />
              ) : (
                <Upload size={16} aria-hidden="true" />
              )}
              {uploading ? "Uploading" : "Upload PDF"}
            </button>
          </div>
          {uploadMessage ? (
            <p className="inline-message" role="status">
              {uploadMessage}
            </p>
          ) : null}
        </section>
      </div>
    </section>
  );
}
