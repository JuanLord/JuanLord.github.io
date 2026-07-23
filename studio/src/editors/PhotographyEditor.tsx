import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { PhotoTrip, TripPhoto } from "../../../src/types/content";
import { EditorLayout } from "../components/EditorLayout";
import {
  CoordinateFields,
  EmbedField,
  Field,
  StatusField,
  TextAreaField,
  TextField,
} from "../components/Fields";
import { deleteTripPhoto, slugify, uploadTripPhoto } from "../lib/studio";
import type { StorageStatus, StudioDocument } from "../types";

interface PhotographyEditorProps {
  document: StudioDocument;
  storage: StorageStatus;
  onChange: (document: StudioDocument) => void;
}

function newTrip(index: number): PhotoTrip {
  return {
    slug: `new-photo-trip-${index}`,
    title: "New Photo Trip",
    location: "",
    country: "",
    startDate: new Date().toISOString().slice(0, 7),
    endDate: new Date().toISOString().slice(0, 7),
    summary: "",
    story: "",
    coordinates: [0, 0],
    photoCount: 50,
    previewSlots: 8,
    photos: [],
    soundtrack: {
      provider: "spotify",
      title: "Trip soundtrack",
      placeholder: true,
    },
    status: "draft",
  };
}

export function PhotographyEditor({
  document,
  storage,
  onChange,
}: PhotographyEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    document.photoTrips[0]?.slug,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const activeSlug = document.photoTrips.some(
    (trip) => trip.slug === selectedSlug,
  )
    ? selectedSlug
    : document.photoTrips[0]?.slug;
  const selected = document.photoTrips.find((trip) => trip.slug === activeSlug);

  const replaceTrip = (trip: PhotoTrip) => {
    onChange({
      ...document,
      photoTrips: document.photoTrips.map((item) =>
        item.slug === activeSlug ? trip : item,
      ),
    });
    if (trip.slug !== activeSlug) setSelectedSlug(trip.slug);
  };

  const updateTrip = (patch: Partial<PhotoTrip>) => {
    if (selected) replaceTrip({ ...selected, ...patch });
  };

  const addTrip = () => {
    const trip = newTrip(document.photoTrips.length + 1);
    onChange({ ...document, photoTrips: [...document.photoTrips, trip] });
    setSelectedSlug(trip.slug);
  };

  const removeTrip = async () => {
    if (!selected || !window.confirm(`Delete ${selected.title}?`)) return;
    const keys = selected.photos.flatMap((photo) =>
      [photo.storageKey, photo.thumbnailStorageKey].filter(
        (key): key is string => Boolean(key),
      ),
    );
    try {
      if (keys.length) await deleteTripPhoto(keys);
      onChange({
        ...document,
        photoTrips: document.photoTrips.filter(
          (trip) => trip.slug !== selected.slug,
        ),
      });
    } catch (error) {
      setUploadMessage(
        error instanceof Error ? error.message : "Trip deletion failed.",
      );
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!selected || !files?.length) return;
    if (!storage.configured) {
      setUploadMessage("R2 setup is incomplete. Open Storage settings.");
      return;
    }

    setUploading(true);
    setUploadMessage(`Uploading 0 of ${files.length}`);
    let completed = 0;
    const uploaded: TripPhoto[] = [];

    try {
      for (const file of Array.from(files)) {
        const photo = await uploadTripPhoto(selected.slug, file);
        uploaded.push(photo);
        completed += 1;
        setUploadMessage(`Uploading ${completed} of ${files.length}`);
      }
      replaceTrip({
        ...selected,
        photos: [...selected.photos, ...uploaded],
        photoCount: selected.photos.length + uploaded.length,
      });
      setUploadMessage(`${uploaded.length} photos uploaded and optimized.`);
    } catch (error) {
      setUploadMessage(
        error instanceof Error ? error.message : "Photo upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  const updatePhoto = (id: string, patch: Partial<TripPhoto>) => {
    if (!selected) return;
    updateTrip({
      photos: selected.photos.map((photo) =>
        photo.id === id ? { ...photo, ...patch } : photo,
      ),
    });
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    if (!selected) return;
    const destination = index + direction;
    if (destination < 0 || destination >= selected.photos.length) return;
    const photos = [...selected.photos];
    [photos[index], photos[destination]] = [photos[destination], photos[index]];
    updateTrip({ photos });
  };

  const removePhoto = async (photo: TripPhoto) => {
    if (
      !selected ||
      !window.confirm("Delete this photo and its R2 derivatives?")
    ) {
      return;
    }
    const keys = [photo.storageKey, photo.thumbnailStorageKey].filter(
      (key): key is string => Boolean(key),
    );
    try {
      if (keys.length) await deleteTripPhoto(keys);
      updateTrip({
        photos: selected.photos.filter((item) => item.id !== photo.id),
      });
    } catch (error) {
      setUploadMessage(
        error instanceof Error ? error.message : "Photo deletion failed.",
      );
    }
  };

  const publishAllPhotos = () => {
    const photoTotal = document.photoTrips.reduce(
      (total, trip) => total + trip.photos.length,
      0,
    );
    if (!photoTotal) return;

    onChange({
      ...document,
      photoTrips: document.photoTrips.map((trip) =>
        trip.photos.length
          ? {
              ...trip,
              photoCount: trip.photos.length,
              status: "published",
              photos: trip.photos.map((photo) => ({
                ...photo,
                status: "published",
              })),
            }
          : trip,
      ),
    });
    setUploadMessage(
      `${photoTotal} photos marked published. Select Publish source to update the website files.`,
    );
  };

  return (
    <EditorLayout
      eyebrow="Creative archive"
      title="Photography"
      items={document.photoTrips}
      selectedKey={activeSlug}
      getKey={(trip) => trip.slug}
      getTitle={(trip) => trip.title}
      getMeta={(trip) => `${trip.photos.length}/${trip.photoCount} photos`}
      onSelect={setSelectedSlug}
      onAdd={addTrip}
      onDelete={() => void removeTrip()}
      headerActions={
        <button
          className="button button-secondary"
          type="button"
          disabled={!document.photoTrips.some((trip) => trip.photos.length)}
          onClick={publishAllPhotos}
        >
          <CheckCheck size={16} aria-hidden="true" />
          Publish all photos
        </button>
      }
    >
      {selected ? (
        <>
          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>Trip record</p>
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
                  updateTrip({ title, slug: slugify(title) || selected.slug })
                }
                required
              />
              <TextField
                label="Slug"
                value={selected.slug}
                onChange={(slug) => updateTrip({ slug: slugify(slug) })}
                required
              />
              <TextField
                label="Location"
                value={selected.location}
                onChange={(location) => updateTrip({ location })}
              />
              <TextField
                label="Country"
                value={selected.country}
                onChange={(country) => updateTrip({ country })}
              />
              <TextField
                label="Start"
                type="month"
                value={selected.startDate}
                onChange={(startDate) => updateTrip({ startDate })}
              />
              <TextField
                label="End"
                type="month"
                value={selected.endDate}
                onChange={(endDate) => updateTrip({ endDate })}
              />
              <CoordinateFields
                value={selected.coordinates}
                onChange={(coordinates) => updateTrip({ coordinates })}
              />
              <TextField
                label="Planned photos"
                type="number"
                min={50}
                value={selected.photoCount}
                onChange={(photoCount) =>
                  updateTrip({ photoCount: Number(photoCount) })
                }
              />
              <TextField
                label="Folder card previews"
                type="number"
                min={1}
                value={selected.previewSlots}
                onChange={(previewSlots) =>
                  updateTrip({ previewSlots: Number(previewSlots) })
                }
              />
              <StatusField
                value={selected.status}
                onChange={(status) => updateTrip({ status })}
              />
              <TextAreaField
                label="Summary"
                value={selected.summary}
                onChange={(summary) => updateTrip({ summary })}
                rows={3}
              />
              <TextAreaField
                label="Trip story"
                value={selected.story}
                onChange={(story) => updateTrip({ story })}
                rows={6}
              />
              <EmbedField
                provider="spotify"
                title={`${selected.title} trip soundtrack`}
                embed={selected.soundtrack}
                onChange={(soundtrack) => updateTrip({ soundtrack })}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <div>
                <p>R2 media</p>
                <h2>Photographs</h2>
              </div>
              <span className="media-total">{selected.photos.length}</span>
            </div>

            <label
              className={
                storage.configured && !uploading
                  ? "upload-zone"
                  : "upload-zone upload-zone-disabled"
              }
            >
              {uploading ? (
                <LoaderCircle className="spin" size={24} aria-hidden="true" />
              ) : (
                <ImagePlus size={24} aria-hidden="true" />
              )}
              <span>
                {storage.configured
                  ? "Choose photographs"
                  : "R2 setup required"}
              </span>
              <small>JPEG, PNG, WebP, HEIC or HEIF</small>
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                disabled={!storage.configured || uploading}
                onChange={(event) => {
                  void handleFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            {uploadMessage ? (
              <p className="inline-message">{uploadMessage}</p>
            ) : null}

            {selected.photos.length ? (
              <div className="photo-editor-grid">
                {selected.photos.map((photo, index) => (
                  <article className="photo-editor-card" key={photo.id}>
                    <div className="photo-preview">
                      {photo.thumbnailSrc || photo.src ? (
                        <img src={photo.thumbnailSrc || photo.src} alt="" />
                      ) : (
                        <span>No preview</span>
                      )}
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <Field label="Alt text">
                      <input
                        value={photo.alt}
                        onChange={(event) =>
                          updatePhoto(photo.id, { alt: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Caption">
                      <textarea
                        rows={3}
                        value={photo.caption}
                        onChange={(event) =>
                          updatePhoto(photo.id, { caption: event.target.value })
                        }
                      />
                    </Field>
                    <TextField
                      label="Date"
                      type="date"
                      value={photo.date}
                      onChange={(date) => updatePhoto(photo.id, { date })}
                    />
                    <StatusField
                      value={photo.status}
                      onChange={(status) => updatePhoto(photo.id, { status })}
                    />
                    <div className="photo-actions">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label="Move photo left"
                        title="Move photo left"
                        disabled={index === 0}
                        onClick={() => movePhoto(index, -1)}
                      >
                        <ArrowLeft size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        aria-label="Move photo right"
                        title="Move photo right"
                        disabled={index === selected.photos.length - 1}
                        onClick={() => movePhoto(index, 1)}
                      >
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button danger-icon"
                        type="button"
                        aria-label="Delete photo"
                        title="Delete photo"
                        onClick={() => void removePhoto(photo)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-media">
                <ImagePlus size={22} aria-hidden="true" />
                <span>No photographs uploaded</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-editor">Create a photo trip to begin.</div>
      )}
    </EditorLayout>
  );
}
