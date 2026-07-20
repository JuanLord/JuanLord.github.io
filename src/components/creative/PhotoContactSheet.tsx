import { Image } from "lucide-react";
import type { PhotoTrip } from "../../types/content";

interface PhotoContactSheetProps {
  trip: PhotoTrip;
  compact?: boolean;
}

export function PhotoContactSheet({
  compact = false,
  trip,
}: PhotoContactSheetProps) {
  const placeholderCount = compact
    ? Math.min(trip.previewSlots, 4)
    : Math.min(trip.previewSlots, 12);

  if (trip.photos.length > 0) {
    return (
      <div
        aria-label={`${trip.title} photo collection`}
        className={`photo-contact-sheet${compact ? " photo-contact-sheet-compact" : ""}`}
      >
        {trip.photos.slice(0, placeholderCount).map((photo, index) => (
          <figure className="photo-contact-item" key={photo.id}>
            <img
              alt={photo.alt}
              decoding="async"
              height={photo.height}
              loading="lazy"
              src={photo.thumbnailSrc ?? photo.src}
              width={photo.width}
            />
            {!compact ? (
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-label={`${trip.title} photo collection pending real images`}
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
