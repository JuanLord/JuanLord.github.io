import { ChevronLeft, ChevronRight, Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PhotoTrip, TripPhoto } from "../../types/content";

interface PhotoContactSheetProps {
  trip: PhotoTrip;
  photos?: TripPhoto[];
  collectionLabel?: string;
  compact?: boolean;
}

function displayAlt(photo: TripPhoto, trip: PhotoTrip, index: number): string {
  const alt = photo.alt.trim();
  const looksLikeFilename =
    /\.(?:heic|heif|jpe?g|png|webp)$/i.test(alt) ||
    /\b(?:dscn?|img|image|photo|pxl)[-_ ]?\d+\b/i.test(alt) ||
    /\b\d{6,}\b/.test(alt);

  if (alt && !looksLikeFilename) return alt;
  if (photo.caption.trim()) return photo.caption.trim();
  const tripIndex = trip.photos.findIndex(({ id }) => id === photo.id);
  return `Photograph ${(tripIndex >= 0 ? tripIndex : index) + 1} from ${trip.title}`;
}

export function PhotoContactSheet({
  compact = false,
  trip,
  photos = trip.photos,
  collectionLabel = `${trip.title} photo collection`,
}: PhotoContactSheetProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const placeholderCount = compact
    ? Math.min(trip.previewSlots, 4)
    : Math.min(trip.previewSlots, 12);
  const visiblePhotos = compact
    ? photos.slice(0, Math.min(trip.previewSlots, 4))
    : photos;
  const selectedPhoto =
    selectedIndex === null ? undefined : visiblePhotos[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % visiblePhotos.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, visiblePhotos.length]);

  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
    );
  };

  const showNext = () => {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % visiblePhotos.length,
    );
  };

  if (photos.length > 0) {
    return (
      <>
        <div
          aria-label={collectionLabel}
          className={`photo-contact-sheet${compact ? " photo-contact-sheet-compact" : ""}`}
        >
          {visiblePhotos.map((photo, index) => (
            <figure className="photo-contact-item" key={photo.id}>
              {compact ? (
                <img
                  alt={displayAlt(photo, trip, index)}
                  decoding="async"
                  height={photo.height}
                  loading="lazy"
                  src={photo.thumbnailSrc ?? photo.src}
                  width={photo.width}
                />
              ) : (
                <button
                  aria-label={`Preview photo ${index + 1}: ${displayAlt(photo, trip, index)}`}
                  className="photo-contact-trigger"
                  style={
                    photo.width && photo.height
                      ? { aspectRatio: `${photo.width} / ${photo.height}` }
                      : undefined
                  }
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    alt={displayAlt(photo, trip, index)}
                    decoding="async"
                    height={photo.height}
                    loading="lazy"
                    src={photo.thumbnailSrc ?? photo.src}
                    width={photo.width}
                  />
                </button>
              )}
              {!compact ? (
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {photo.caption ? <p>{photo.caption}</p> : null}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>

        {selectedPhoto ? (
          <div
            aria-label={`${trip.title} photo preview`}
            aria-modal="true"
            className="photo-lightbox"
            role="dialog"
            onClick={(event) => {
              if (event.currentTarget === event.target) setSelectedIndex(null);
            }}
          >
            <button
              ref={closeButtonRef}
              aria-label="Close photo preview"
              className="photo-lightbox-close"
              title="Close"
              type="button"
              onClick={() => setSelectedIndex(null)}
            >
              <X aria-hidden size={22} />
            </button>
            <button
              aria-label="Previous photo"
              className="photo-lightbox-control photo-lightbox-previous"
              disabled={visiblePhotos.length < 2}
              title="Previous photo"
              type="button"
              onClick={showPrevious}
            >
              <ChevronLeft aria-hidden size={30} />
            </button>
            <figure>
              <img
                alt={displayAlt(selectedPhoto, trip, selectedIndex ?? 0)}
                height={selectedPhoto.height}
                src={selectedPhoto.src ?? selectedPhoto.thumbnailSrc}
                width={selectedPhoto.width}
              />
              <figcaption>
                <span>
                  {String((selectedIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(visiblePhotos.length).padStart(2, "0")}
                </span>
                {selectedPhoto.caption ? <p>{selectedPhoto.caption}</p> : null}
              </figcaption>
            </figure>
            <button
              aria-label="Next photo"
              className="photo-lightbox-control photo-lightbox-next"
              disabled={visiblePhotos.length < 2}
              title="Next photo"
              type="button"
              onClick={showNext}
            >
              <ChevronRight aria-hidden size={30} />
            </button>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div
      aria-label={`${collectionLabel} pending real images`}
      className={`photo-contact-sheet photo-contact-sheet-empty${compact ? " photo-contact-sheet-compact" : ""}`}
      role="img"
    >
      {Array.from({ length: placeholderCount }, (_, index) => (
        <span aria-hidden key={`${trip.slug}-slot-${index}`}>
          <Image size={compact ? 16 : 20} strokeWidth={1.3} />
          <small>{String(index + 1).padStart(2, "0")}</small>
        </span>
      ))}
    </div>
  );
}
