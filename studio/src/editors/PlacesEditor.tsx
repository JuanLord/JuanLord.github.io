import { useState } from "react";
import type { TravelPlace } from "../../../src/types/content";
import { EditorLayout } from "../components/EditorLayout";
import {
  CoordinateFields,
  Field,
  SelectField,
  StatusField,
  TextAreaField,
  TextField,
} from "../components/Fields";
import { slugify } from "../lib/studio";
import type { StudioDocument } from "../types";

interface PlacesEditorProps {
  document: StudioDocument;
  onChange: (document: StudioDocument) => void;
}

function newPlace(index: number): TravelPlace {
  return {
    slug: `new-place-${index}`,
    title: "New Place",
    location: "",
    country: "",
    kind: "nature",
    coordinates: [0, 0],
    visited: new Date().toISOString().slice(0, 7),
    summary: "",
    status: "draft",
  };
}

export function PlacesEditor({ document, onChange }: PlacesEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState(document.places[0]?.slug);
  const activeSlug = document.places.some(
    (place) => place.slug === selectedSlug,
  )
    ? selectedSlug
    : document.places[0]?.slug;
  const selected = document.places.find((place) => place.slug === activeSlug);

  const replacePlace = (place: TravelPlace) => {
    onChange({
      ...document,
      places: document.places.map((item) =>
        item.slug === activeSlug ? place : item,
      ),
    });
    if (place.slug !== activeSlug) setSelectedSlug(place.slug);
  };

  const updatePlace = (patch: Partial<TravelPlace>) => {
    if (selected) replacePlace({ ...selected, ...patch });
  };

  const addPlace = () => {
    const place = newPlace(document.places.length + 1);
    onChange({ ...document, places: [...document.places, place] });
    setSelectedSlug(place.slug);
  };

  const removePlace = () => {
    if (!selected || !window.confirm(`Delete ${selected.title}?`)) return;
    onChange({
      ...document,
      places: document.places.filter((place) => place.slug !== selected.slug),
    });
  };

  return (
    <EditorLayout
      eyebrow="World map"
      title="Places"
      items={document.places}
      selectedKey={activeSlug}
      getKey={(place) => place.slug}
      getTitle={(place) => place.title}
      getMeta={(place) => `${place.country || "No country"} · ${place.kind}`}
      onSelect={setSelectedSlug}
      onAdd={addPlace}
      onDelete={removePlace}
    >
      {selected ? (
        <div className="form-section">
          <div className="section-heading">
            <div>
              <p>Map record</p>
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
                updatePlace({ title, slug: slugify(title) || selected.slug })
              }
            />
            <TextField
              label="Slug"
              value={selected.slug}
              onChange={(slug) => updatePlace({ slug: slugify(slug) })}
            />
            <TextField
              label="Region or locality"
              value={selected.location}
              onChange={(location) => updatePlace({ location })}
            />
            <TextField
              label="Country"
              value={selected.country}
              onChange={(country) => updatePlace({ country })}
            />
            <SelectField
              label="Place type"
              value={selected.kind}
              onChange={(kind) => updatePlace({ kind })}
              options={[
                { value: "city", label: "City" },
                { value: "nature", label: "Nature" },
                { value: "landmark", label: "Landmark" },
              ]}
            />
            <TextField
              label="Visited"
              type="month"
              value={selected.visited}
              onChange={(visited) => updatePlace({ visited })}
            />
            <CoordinateFields
              value={selected.coordinates}
              onChange={(coordinates) => updatePlace({ coordinates })}
            />
            <Field label="Photography folder">
              <select
                value={selected.relatedPhotoTripSlug || ""}
                onChange={(event) =>
                  updatePlace({
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
            <Field label="Related hike">
              <select
                value={selected.relatedHikeSlug || ""}
                onChange={(event) =>
                  updatePlace({
                    relatedHikeSlug: event.target.value || undefined,
                  })
                }
              >
                <option value="">None</option>
                {document.hikes.map((hike) => (
                  <option value={hike.slug} key={hike.slug}>
                    {hike.trail}
                  </option>
                ))}
              </select>
            </Field>
            <StatusField
              value={selected.status}
              onChange={(status) => updatePlace({ status })}
            />
            <TextAreaField
              label="Summary"
              value={selected.summary}
              onChange={(summary) => updatePlace({ summary })}
              rows={5}
            />
          </div>
        </div>
      ) : (
        <div className="empty-editor">Create a place to begin.</div>
      )}
    </EditorLayout>
  );
}
