import { ArrowDown, ArrowUpRight, FolderOpen, Music2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmbedPanel } from "../components/creative/EmbedPanel";
import { PhotoArchiveMap } from "../components/photos/PhotoArchiveMap";
import { PhotoArchiveWall } from "../components/photos/PhotoArchiveWall";
import { photoTrips } from "../content";
import { formatDateRange } from "../lib/content";
import { hasTrustedEmbed } from "../lib/embeds";
import {
  getArchivePhotoItems,
  getPhotoArchiveTripPath,
  getPublishedArchiveTrips,
} from "../lib/photoArchive";

const publishedTrips = getPublishedArchiveTrips(photoTrips);
const archivePhotos = getArchivePhotoItems(publishedTrips);
const soundtrackTrips = publishedTrips.filter(({ soundtrack }) =>
  hasTrustedEmbed(soundtrack),
);
const locationCount = publishedTrips.reduce(
  (count, trip) => count + (trip.locations?.length || 1),
  0,
);
const INITIAL_PHOTO_COUNT = 48;
const PHOTO_LOAD_INCREMENT = 48;

export function PhotoArchivePage() {
  const [visiblePhotoCount, setVisiblePhotoCount] =
    useState(INITIAL_PHOTO_COUNT);
  const visiblePhotos = archivePhotos.slice(0, visiblePhotoCount);
  const remainingPhotoCount = archivePhotos.length - visiblePhotos.length;

  return (
    <div className="photo-archive-page">
      <section className="photo-archive-intro">
        <div className="photo-archive-intro-meta">
          <span>PHOTOGRAPHY / 2023—2026</span>
          <span>
            {archivePhotos.length} PHOTOGRAPHS · {locationCount} LOCATIONS
          </span>
        </div>
        <h1>
          An archive of places,
          <br />
          work, and <em>attention.</em>
        </h1>
        <p>
          A visual field notebook shaped by distance, weather, and the practice
          of looking closely.
        </p>
      </section>

      <section aria-labelledby="photo-wall-title" id="photo-wall">
        <h2 className="sr-only" id="photo-wall-title">
          Complete photography archive
        </h2>
        <PhotoArchiveWall
          ariaLabel={`All ${archivePhotos.length} published photographs`}
          items={visiblePhotos}
        />
        {remainingPhotoCount > 0 ? (
          <div className="photo-archive-load-more">
            <span aria-live="polite">
              {visiblePhotos.length} / {archivePhotos.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setVisiblePhotoCount((current) =>
                  Math.min(
                    current + PHOTO_LOAD_INCREMENT,
                    archivePhotos.length,
                  ),
                )
              }
            >
              Load more
              <ArrowDown aria-hidden size={15} />
            </button>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="photo-folders-title"
        className="photo-archive-section photo-archive-folders-section"
        id="photo-folders"
      >
        <header className="photo-archive-section-heading">
          <div>
            <span>FOLDERS</span>
            <h2 id="photo-folders-title">Journeys, kept together.</h2>
          </div>
          <p>{publishedTrips.length} complete collections</p>
        </header>

        <div className="photo-archive-folder-grid">
          {publishedTrips.map((trip, index) => {
            const previewPhotos = trip.photos
              .filter(({ src, status }) => status === "published" && src)
              .slice(0, 4);

            return (
              <Link
                aria-label={`Open ${trip.title} photography folder`}
                className="photo-archive-folder"
                key={trip.slug}
                to={getPhotoArchiveTripPath(trip.slug)}
              >
                <span className="photo-archive-folder-media" aria-hidden="true">
                  {previewPhotos.map((photo) => (
                    <img
                      alt=""
                      decoding="async"
                      key={photo.id}
                      loading="lazy"
                      src={photo.thumbnailSrc ?? photo.src}
                    />
                  ))}
                </span>
                <span
                  className="photo-archive-folder-shade"
                  aria-hidden="true"
                />
                <span className="photo-archive-folder-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="photo-archive-folder-copy">
                  <FolderOpen aria-hidden size={18} strokeWidth={1.5} />
                  <strong>{trip.title}</strong>
                  <small>
                    {trip.photos.length} photographs · {trip.location}
                  </small>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="photo-archive-folder-arrow"
                  size={18}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="photo-map-title"
        className="photo-archive-section photo-archive-map-section"
        id="photo-map"
      >
        <header className="photo-archive-section-heading">
          <div>
            <span>ATLAS / ALL LOCATIONS</span>
            <h2 id="photo-map-title">Every folder begins somewhere.</h2>
          </div>
          <p>{locationCount} places across the photographic record</p>
        </header>
        <PhotoArchiveMap trips={publishedTrips} />
      </section>

      <section
        aria-labelledby="photo-soundtracks-title"
        className="photo-archive-section photo-archive-soundtracks"
        id="photo-soundtracks"
      >
        <header className="photo-archive-section-heading">
          <div>
            <span>LISTENING COMPANIONS</span>
            <h2 id="photo-soundtracks-title">
              Music carried through the journey.
            </h2>
          </div>
          <p>
            <Music2 aria-hidden size={15} /> {soundtrackTrips.length} Spotify
            selections
          </p>
        </header>

        <div className="photo-archive-soundtrack-list">
          {soundtrackTrips.map((trip, index) => (
            <article className="photo-archive-soundtrack" key={trip.slug}>
              <div className="photo-archive-soundtrack-copy">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{trip.title}</h3>
                  <p>
                    {trip.location} ·{" "}
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </p>
                </div>
                <Link to={getPhotoArchiveTripPath(trip.slug)}>
                  Open folder
                  <ArrowUpRight aria-hidden size={15} />
                </Link>
              </div>
              <EmbedPanel compact embed={trip.soundtrack} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
