import {
  Check,
  CircleAlert,
  CloudUpload,
  Film,
  Footprints,
  Images,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Save,
  Settings,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HikesEditor } from "./editors/HikesEditor";
import { PhotographyEditor } from "./editors/PhotographyEditor";
import { PlacesEditor } from "./editors/PlacesEditor";
import { ProjectsEditor } from "./editors/ProjectsEditor";
import {
  loadStudio,
  publishStudioDocument,
  saveStudioDocument,
  validateStudioDocument,
} from "./lib/studio";
import { OverviewPage } from "./pages/OverviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import { createSeedDocument } from "./seed";
import type { StorageStatus, StudioDocument, StudioSection } from "./types";

const navigation = [
  { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { id: "photography" as const, label: "Photography", icon: Images },
  { id: "places" as const, label: "Places", icon: MapPin },
  { id: "hikes" as const, label: "Hikes", icon: Footprints },
  { id: "projects" as const, label: "Film & Music", icon: Film },
  { id: "settings" as const, label: "Storage", icon: Settings },
];

type SaveState = "idle" | "saving" | "saved" | "error";

export function App() {
  const [section, setSection] = useState<StudioSection>("overview");
  const [document, setDocument] = useState<StudioDocument | null>(null);
  const [storage, setStorage] = useState<StorageStatus>({
    configured: false,
    missing: [],
  });
  const [revision, setRevision] = useState(0);
  const [savedRevision, setSavedRevision] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    loadStudio()
      .then((bootstrap) => {
        if (!active) return;
        setDocument(bootstrap.document || createSeedDocument());
        setStorage(bootstrap.storage);
        setSaveState(bootstrap.document ? "saved" : "idle");
      })
      .catch((error) => {
        if (!active) return;
        setMessage(
          error instanceof Error ? error.message : "Studio failed to load.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const issues = useMemo(
    () => (document ? validateStudioDocument(document) : []),
    [document],
  );
  const errorCount = issues.filter((issue) => issue.level === "error").length;
  const isDirty = revision !== savedRevision;

  useEffect(() => {
    if (!document || !isDirty) return;
    const currentRevision = revision;
    const timeout = window.setTimeout(() => {
      setSaveState("saving");
      saveStudioDocument(document)
        .then(() => {
          setSavedRevision(currentRevision);
          setSaveState("saved");
        })
        .catch((error) => {
          setSaveState("error");
          setMessage(
            error instanceof Error ? error.message : "Autosave failed.",
          );
        });
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [document, isDirty, revision]);

  const changeDocument = (next: StudioDocument) => {
    setDocument({ ...next, updatedAt: new Date().toISOString() });
    setRevision((value) => value + 1);
    setMessage("");
  };

  const saveNow = async () => {
    if (!document) return;
    const currentRevision = revision;
    setSaveState("saving");
    try {
      const response = await saveStudioDocument(document);
      setSavedRevision(currentRevision);
      setSaveState("saved");
      setMessage(response.message);
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
  };

  const publish = async () => {
    if (!document || errorCount) return;
    setSaveState("saving");
    try {
      await saveStudioDocument(document);
      const response = await publishStudioDocument(document);
      setSavedRevision(revision);
      setSaveState("saved");
      setMessage(response.message);
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Publish failed.");
    }
  };

  if (!document) {
    return (
      <main className="studio-loading">
        <LoaderCircle className="spin" size={25} aria-hidden="true" />
        <span>{message || "Loading Studio"}</span>
      </main>
    );
  }

  return (
    <div className="studio-shell">
      <aside className="studio-sidebar">
        <div className="studio-brand">
          <span>JV</span>
          <div>
            <strong>Portfolio</strong>
            <small>Studio</small>
          </div>
        </div>
        <nav aria-label="Studio navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={section === id ? "studio-nav active" : "studio-nav"}
              onClick={() => setSection(id)}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
              {id === "overview" && errorCount ? <b>{errorCount}</b> : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span
            className={
              storage.configured ? "connection-dot ready" : "connection-dot"
            }
          />
          <span>{storage.configured ? storage.bucketName : "R2 offline"}</span>
        </div>
      </aside>

      <div className="studio-main">
        <header className="studio-toolbar">
          <div className={`save-indicator save-${saveState}`}>
            {saveState === "saving" ? (
              <LoaderCircle className="spin" size={14} aria-hidden="true" />
            ) : saveState === "error" ? (
              <CircleAlert size={14} aria-hidden="true" />
            ) : (
              <Check size={14} aria-hidden="true" />
            )}
            <span>
              {saveState === "saving"
                ? "Saving"
                : saveState === "error"
                  ? "Save failed"
                  : isDirty
                    ? "Unsaved"
                    : "Saved locally"}
            </span>
          </div>
          <div className="toolbar-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void saveNow()}
            >
              <Save size={16} aria-hidden="true" />
              Save
            </button>
            <button
              className="button button-primary"
              type="button"
              disabled={Boolean(errorCount)}
              title={
                errorCount
                  ? "Resolve validation errors before publishing"
                  : undefined
              }
              onClick={() => void publish()}
            >
              <CloudUpload size={16} aria-hidden="true" />
              Publish source
            </button>
          </div>
        </header>

        {message ? (
          <div
            className={saveState === "error" ? "toast toast-error" : "toast"}
            role="status"
          >
            <span>{message}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setMessage("")}
            >
              ×
            </button>
          </div>
        ) : null}

        <main className="studio-content">
          {section === "overview" ? (
            <OverviewPage
              document={document}
              issues={issues}
              storage={storage}
              onNavigate={setSection}
            />
          ) : null}
          {section === "photography" ? (
            <PhotographyEditor
              document={document}
              storage={storage}
              onChange={changeDocument}
            />
          ) : null}
          {section === "places" ? (
            <PlacesEditor document={document} onChange={changeDocument} />
          ) : null}
          {section === "hikes" ? (
            <HikesEditor document={document} onChange={changeDocument} />
          ) : null}
          {section === "projects" ? (
            <ProjectsEditor document={document} onChange={changeDocument} />
          ) : null}
          {section === "settings" ? <SettingsPage storage={storage} /> : null}
        </main>
      </div>
    </div>
  );
}
