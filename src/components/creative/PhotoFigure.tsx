import { Image } from "lucide-react";
import { formatYearMonth } from "../../lib/content";
import type { Photo } from "../../types/content";

interface PhotoFigureProps {
  index: number;
  photo: Photo;
}

export function PhotoFigure({ index, photo }: PhotoFigureProps) {
  return (
    <figure className={`creative-photo creative-photo-${index + 1}`}>
      <div
        className="creative-photo-frame"
        style={{ aspectRatio: photo.media.aspectRatio }}
      >
        {photo.media.src ? (
          <img
            alt={photo.media.alt}
            decoding="async"
            loading="lazy"
            src={photo.media.src}
          />
        ) : (
          <div
            aria-label={photo.media.alt}
            className="creative-image-placeholder"
            role="img"
          >
            <Image aria-hidden size={28} strokeWidth={1.4} />
          </div>
        )}
        {photo.media.placeholder && (
          <span className="creative-media-state">Generated placeholder</span>
        )}
      </div>

      <figcaption>
        <div>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{photo.location}</h3>
          <time dateTime={photo.date}>{formatYearMonth(photo.date)}</time>
        </div>
        <p>{photo.caption}</p>
      </figcaption>
    </figure>
  );
}
