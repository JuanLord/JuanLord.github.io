import {
  AlertTriangle,
  CheckCircle2,
  Film,
  Footprints,
  Images,
  MapPin,
  Server,
} from "lucide-react";
import type {
  StorageStatus,
  StudioDocument,
  StudioSection,
  ValidationIssue,
} from "../types";

interface OverviewPageProps {
  document: StudioDocument;
  issues: ValidationIssue[];
  storage: StorageStatus;
  onNavigate: (section: StudioSection) => void;
}

export function OverviewPage({
  document,
  issues,
  storage,
  onNavigate,
}: OverviewPageProps) {
  const photos = document.photoTrips.reduce(
    (total, trip) => total + trip.photos.length,
    0,
  );
  const stats = [
    {
      section: "photography" as const,
      label: "Photo trips",
      value: document.photoTrips.length,
      meta: `${photos} uploaded photos`,
      icon: Images,
    },
    {
      section: "places" as const,
      label: "Places",
      value: document.places.length,
      meta: "World map records",
      icon: MapPin,
    },
    {
      section: "hikes" as const,
      label: "Hikes",
      value: document.hikes.length,
      meta: `${document.hikes.filter((hike) => hike.route.points.length > 1).length} routes ready`,
      icon: Footprints,
    },
    {
      section: "projects" as const,
      label: "Film and music",
      value: document.creativeProjects.length,
      meta: "Creative records",
      icon: Film,
    },
  ];
  const errors = issues.filter((issue) => issue.level === "error");

  return (
    <section className="overview-page">
      <header className="page-heading overview-heading">
        <div>
          <p>Local workspace</p>
          <h1>Portfolio Studio</h1>
        </div>
        <div className={storage.configured ? "r2-pill ready" : "r2-pill"}>
          <Server size={15} aria-hidden="true" />
          R2 {storage.configured ? "connected" : "not configured"}
        </div>
      </header>

      <div className="stats-grid">
        {stats.map(({ section, label, value, meta, icon: Icon }) => (
          <button
            className="stat-panel"
            type="button"
            onClick={() => onNavigate(section)}
            key={section}
          >
            <Icon size={19} aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{meta}</small>
          </button>
        ))}
      </div>

      <div className="overview-columns">
        <section className="overview-section">
          <div className="section-heading">
            <div>
              <p>Content health</p>
              <h2>Validation</h2>
            </div>
            <span
              className={errors.length ? "health-count error" : "health-count"}
            >
              {errors.length ? `${errors.length} errors` : "Ready"}
            </span>
          </div>
          <div className="issue-list">
            {issues.length ? (
              issues.slice(0, 10).map((issue, index) => (
                <button
                  type="button"
                  className={`issue-row issue-${issue.level}`}
                  key={`${issue.section}-${issue.recordSlug}-${index}`}
                  onClick={() => onNavigate(issue.section)}
                >
                  {issue.level === "error" ? (
                    <AlertTriangle size={16} aria-hidden="true" />
                  ) : (
                    <span className="warning-dot" aria-hidden="true" />
                  )}
                  <span>{issue.message}</span>
                </button>
              ))
            ) : (
              <div className="healthy-state">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>No content issues</span>
              </div>
            )}
          </div>
        </section>

        <section className="overview-section archive-status">
          <div className="section-heading">
            <div>
              <p>Publication</p>
              <h2>Archive status</h2>
            </div>
          </div>
          <dl>
            <div>
              <dt>Mock</dt>
              <dd>{countStatus(document, "mock")}</dd>
            </div>
            <div>
              <dt>Draft</dt>
              <dd>{countStatus(document, "draft")}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{countStatus(document, "published")}</dd>
            </div>
            <div>
              <dt>Last local change</dt>
              <dd>{new Date(document.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}

function countStatus(
  document: StudioDocument,
  status: "mock" | "draft" | "published",
): number {
  return [
    ...document.photoTrips,
    ...document.places,
    ...document.hikes,
    ...document.creativeProjects,
  ].filter((record) => record.status === status).length;
}
