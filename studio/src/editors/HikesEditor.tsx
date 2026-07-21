import { FileUp, Route } from "lucide-react";
import { useState } from "react";
import type { Coordinates, Hike } from "../../../src/types/content";
import { EditorLayout } from "../components/EditorLayout";
import {
  CoordinateFields,
  EmbedField,
  Field,
  SelectField,
  StatusField,
  TextAreaField,
  TextField,
} from "../components/Fields";
import { slugify } from "../lib/studio";
import type { StudioDocument } from "../types";

interface HikesEditorProps {
  document: StudioDocument;
  onChange: (document: StudioDocument) => void;
}

function newHike(index: number): Hike {
  return {
    slug: `new-hike-${index}`,
    trail: "New Hike",
    location: "",
    country: "",
    date: new Date().toISOString().slice(0, 7),
    coordinates: [0, 0],
    distanceMiles: 1,
    elevationFeet: 1,
    movingHours: 1,
    difficulty: "Moderate",
    summary: "",
    route: {
      points: [],
      strava: {
        provider: "strava",
        title: "Hike route",
        placeholder: true,
      },
      placeholder: true,
    },
    status: "draft",
  };
}

function parseGpx(source: string): Coordinates[] {
  const xml = new DOMParser().parseFromString(source, "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("GPX file is invalid.");
  const points = [...xml.querySelectorAll("trkpt, rtept")]
    .map((point): Coordinates => [
      Number(point.getAttribute("lon")),
      Number(point.getAttribute("lat")),
    ])
    .filter(
      ([longitude, latitude]) =>
        Number.isFinite(longitude) && Number.isFinite(latitude),
    );
  if (points.length < 2)
    throw new Error("GPX route needs at least two points.");
  const stride = Math.max(1, Math.ceil(points.length / 500));
  return points.filter(
    (_, index) => index % stride === 0 || index === points.length - 1,
  );
}

function RouteSketch({ points }: { points: Coordinates[] }) {
  if (points.length < 2) {
    return (
      <div className="route-empty">
        <Route size={21} aria-hidden="true" />
        <span>No route imported</span>
      </div>
    );
  }
  const longitudes = points.map(([longitude]) => longitude);
  const latitudes = points.map(([, latitude]) => latitude);
  const minX = Math.min(...longitudes);
  const maxX = Math.max(...longitudes);
  const minY = Math.min(...latitudes);
  const maxY = Math.max(...latitudes);
  const width = Math.max(maxX - minX, 0.0001);
  const height = Math.max(maxY - minY, 0.0001);
  const path = points
    .map(([longitude, latitude], index) => {
      const x = 18 + ((longitude - minX) / width) * 264;
      const y = 18 + (1 - (latitude - minY) / height) * 124;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      className="route-sketch"
      viewBox="0 0 300 160"
      role="img"
      aria-label={`Route preview with ${points.length} sampled points`}
    >
      <path d={path} />
      <circle
        cx="18"
        cy={18 + (1 - (points[0][1] - minY) / height) * 124}
        r="4"
      />
    </svg>
  );
}

export function HikesEditor({ document, onChange }: HikesEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState(document.hikes[0]?.slug);
  const [routeMessage, setRouteMessage] = useState("");
  const activeSlug = document.hikes.some((hike) => hike.slug === selectedSlug)
    ? selectedSlug
    : document.hikes[0]?.slug;
  const selected = document.hikes.find((hike) => hike.slug === activeSlug);

  const replaceHike = (hike: Hike) => {
    onChange({
      ...document,
      hikes: document.hikes.map((item) =>
        item.slug === activeSlug ? hike : item,
      ),
    });
    if (hike.slug !== activeSlug) setSelectedSlug(hike.slug);
  };

  const updateHike = (patch: Partial<Hike>) => {
    if (selected) replaceHike({ ...selected, ...patch });
  };

  const addHike = () => {
    const hike = newHike(document.hikes.length + 1);
    onChange({ ...document, hikes: [...document.hikes, hike] });
    setSelectedSlug(hike.slug);
  };

  const removeHike = () => {
    if (!selected || !window.confirm(`Delete ${selected.trail}?`)) return;
    onChange({
      ...document,
      hikes: document.hikes.filter((hike) => hike.slug !== selected.slug),
    });
  };

  const handleGpx = async (file?: File) => {
    if (!file || !selected) return;
    try {
      const points = parseGpx(await file.text());
      replaceHike({
        ...selected,
        coordinates: points[0],
        route: { ...selected.route, points, placeholder: false },
      });
      setRouteMessage(`${points.length} route points imported.`);
    } catch (error) {
      setRouteMessage(
        error instanceof Error ? error.message : "GPX import failed.",
      );
    }
  };

  return (
    <EditorLayout
      eyebrow="Trail archive"
      title="Hikes"
      items={document.hikes}
      selectedKey={activeSlug}
      getKey={(hike) => hike.slug}
      getTitle={(hike) => hike.trail}
      getMeta={(hike) => `${hike.distanceMiles} mi · ${hike.difficulty}`}
      onSelect={setSelectedSlug}
      onAdd={addHike}
      onDelete={removeHike}
    >
      {selected ? (
        <>
          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>Hike record</p>
                <h2>{selected.trail}</h2>
              </div>
              <span className={`status-chip status-${selected.status}`}>
                {selected.status}
              </span>
            </div>
            <div className="form-grid">
              <TextField
                label="Trail name"
                value={selected.trail}
                onChange={(trail) =>
                  updateHike({ trail, slug: slugify(trail) || selected.slug })
                }
              />
              <TextField
                label="Slug"
                value={selected.slug}
                onChange={(slug) => updateHike({ slug: slugify(slug) })}
              />
              <TextField
                label="Location"
                value={selected.location}
                onChange={(location) => updateHike({ location })}
              />
              <TextField
                label="Country"
                value={selected.country}
                onChange={(country) => updateHike({ country })}
              />
              <TextField
                label="Date"
                type="month"
                value={selected.date}
                onChange={(date) => updateHike({ date })}
              />
              <SelectField
                label="Difficulty"
                value={selected.difficulty}
                onChange={(difficulty) => updateHike({ difficulty })}
                options={[
                  { value: "Easy", label: "Easy" },
                  { value: "Moderate", label: "Moderate" },
                  { value: "Strenuous", label: "Strenuous" },
                ]}
              />
              <TextField
                label="Distance (miles)"
                type="number"
                min={0.1}
                step={0.1}
                value={selected.distanceMiles}
                onChange={(distanceMiles) =>
                  updateHike({ distanceMiles: Number(distanceMiles) })
                }
              />
              <TextField
                label="Elevation gain (feet)"
                type="number"
                min={0}
                step={1}
                value={selected.elevationFeet}
                onChange={(elevationFeet) =>
                  updateHike({ elevationFeet: Number(elevationFeet) })
                }
              />
              <TextField
                label="Moving time (hours)"
                type="number"
                min={0.1}
                step={0.1}
                value={selected.movingHours}
                onChange={(movingHours) =>
                  updateHike({ movingHours: Number(movingHours) })
                }
              />
              <StatusField
                value={selected.status}
                onChange={(status) => updateHike({ status })}
              />
              <CoordinateFields
                value={selected.coordinates}
                onChange={(coordinates) => updateHike({ coordinates })}
              />
              <Field label="Related photo folder">
                <select
                  value={selected.relatedPhotoTripSlug || ""}
                  onChange={(event) =>
                    updateHike({
                      relatedPhotoTripSlug: event.target.value || undefined,
                    })
                  }
                >
                  <option value="">None</option>
                  {document.photoTrips.map((trip) => (
                    <option value={trip.slug} key={trip.slug}>
                      {trip.title}
                    </option>
                  ))}
                </select>
              </Field>
              <TextAreaField
                label="Summary"
                value={selected.summary}
                onChange={(summary) => updateHike({ summary })}
                rows={5}
              />
              <EmbedField
                provider="strava"
                title={`${selected.trail} route`}
                embed={selected.route.strava}
                onChange={(strava) =>
                  updateHike({ route: { ...selected.route, strava } })
                }
              />
            </div>
          </div>

          <div className="form-section route-import-section">
            <div className="section-heading">
              <div>
                <p>Route geometry</p>
                <h2>GPX path</h2>
              </div>
              <span className="media-total">
                {selected.route.points.length}
              </span>
            </div>
            <RouteSketch points={selected.route.points} />
            <label className="button button-secondary file-button">
              <FileUp size={16} aria-hidden="true" />
              Import GPX
              <input
                className="sr-only"
                type="file"
                accept=".gpx,application/gpx+xml"
                onChange={(event) => {
                  void handleGpx(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {routeMessage ? (
              <p className="inline-message">{routeMessage}</p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="empty-editor">Create a hike to begin.</div>
      )}
    </EditorLayout>
  );
}
