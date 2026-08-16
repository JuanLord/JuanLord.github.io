import {
  ArrowDownWideNarrow,
  ArrowLeft,
  CalendarDays,
  Images,
  MapPin,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmbedPanel } from "../components/creative/EmbedPanel";
import { PhotoArchiveMap } from "../components/photos/PhotoArchiveMap";
import { PhotoArchiveWall } from "../components/photos/PhotoArchiveWall";
import { formatDateRange, getPhotoTripBySlug } from "../lib/content";
import { hasTrustedEmbed } from "../lib/embeds";
import {
  getArchivePhotoItems,
  getPhotoArchiveRoot,
  sortArchivePhotosChronologically,
} from "../lib/photoArchive";

type PhotoOrder = "source" | "chronological";

export function PhotoArchiveTripPage() {
  const { tripSlug = "" } = useParams();
  const trip = getPhotoTripBySlug(tripSlug);
  const [photoOrder, setPhotoOrder] = useState<PhotoOrder>("source");
  const photos = useMemo(
    () => (trip ? getArchivePhotoItems([trip]) : []),
    [trip],
  );
  const displayedPhotos = useMemo(
    () =>
      photoOrder === "chronological"
        ? sortArchivePhotosChronologically(photos)
        : photos,
    [photoOrder, photos],
  );

  if (!trip) {
    return (
      <section className="photo-archive-missing">
        <span>MISSING FOLDER</span>
        <h1>This path has gone quiet.</h1>
        <Link to={getPhotoArchiveRoot()}>
          <ArrowLeft aria-hidden size={16} />
          Return to photography
        </Link>
      </section>
    );
  }

  const locationCount = trip.locations?.length || 1;

  return (
    <article className="photo-archive-trip-page">
      <header className="photo-archive-trip-intro">
        <Link className="photo-archive-back" to={getPhotoArchiveRoot()}>
          <ArrowLeft aria-hidden size={15} />
          Photography
        </Link>
        <p>PHOTOGRAPHY FOLDER / {trip.country.toUpperCase()}</p>
        <h1>{trip.title}</h1>
        <p className="photo-archive-trip-summary">{trip.summary}</p>
        <dl>
          <div>
            <dt>
              <MapPin aria-hidden size={14} /> Place
            </dt>
            <dd>{trip.location}</dd>
          </div>
          <div>
            <dt>
              <CalendarDays aria-hidden size={14} /> Date
            </dt>
            <dd>{formatDateRange(trip.startDate, trip.endDate)}</dd>
          </div>
          <div>
            <dt>
              <Images aria-hidden size={14} /> Collection
            </dt>
            <dd>{photos.length} photographs</dd>
          </div>
        </dl>
      </header>

      <section
        aria-labelledby="trip-photo-wall-title"
        className="photo-archive-trip-wall-section"
        id="photo-wall"
      >
        <div className="photo-archive-trip-wall-toolbar">
          <h2 id="trip-photo-wall-title">Photographs</h2>
          <button
            aria-label={
              photoOrder === "chronological"
                ? "Use original photo order"
                : "Arrange photographs chronologically"
            }
            aria-pressed={photoOrder === "chronological"}
            type="button"
            onClick={() =>
              setPhotoOrder((current) =>
                current === "source" ? "chronological" : "source",
              )
            }
          >
            <ArrowDownWideNarrow aria-hidden size={15} />
            {photoOrder === "chronological"
              ? "Chronological · earliest first"
              : "Photo order"}
          </button>
        </div>
        <PhotoArchiveWall
          ariaLabel={`${trip.title}, ${photos.length} photographs`}
          flow={photoOrder === "chronological" ? "chronological" : "masonry"}
          items={displayedPhotos}
        />
      </section>

      <section
        aria-labelledby="trip-map-title"
        className="photo-archive-section photo-archive-map-section"
        id="photo-map"
      >
        <header className="photo-archive-section-heading">
          <div>
            <span>FOLDER ATLAS</span>
            <h2 id="trip-map-title">
              {locationCount === 1
                ? trip.location
                : `${locationCount} named places`}
            </h2>
          </div>
          <p>{trip.story}</p>
        </header>
        <PhotoArchiveMap trips={[trip]} />
      </section>

      {hasTrustedEmbed(trip.soundtrack) ? (
        <section
          aria-labelledby="trip-soundtrack-title"
          className="photo-archive-section photo-archive-trip-soundtrack"
          id="photo-soundtracks"
        >
          <header className="photo-archive-section-heading">
            <div>
              <span>LISTENING COMPANION</span>
              <h2 id="trip-soundtrack-title">Soundtrack for the folder.</h2>
            </div>
          </header>
          <EmbedPanel embed={trip.soundtrack} />
        </section>
      ) : null}
    </article>
  );
}
