import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPhotoDisplayAlt,
  type ArchivePhotoItem,
} from "../../lib/photoArchive";

interface PhotoArchiveWallProps {
  ariaLabel: string;
  flow?: "masonry" | "chronological";
  items: ArchivePhotoItem[];
}

export function PhotoArchiveWall({
  ariaLabel,
  flow = "masonry",
  items,
}: PhotoArchiveWallProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const selectedItem =
    selectedIndex === null ? undefined : items[selectedIndex];

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + items.length) % items.length,
    );
  }, [items.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % items.length,
    );
  }, [items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, selectedIndex, showNext, showPrevious]);

  return (
    <>
      <div
        aria-label={ariaLabel}
        className={`photo-archive-wall photo-archive-wall--${flow}`}
      >
        {items.map(({ photo, trip, tripIndex }, index) => {
          const alt = getPhotoDisplayAlt(photo, trip, tripIndex);

          return (
            <button
              aria-label={`Preview photograph ${index + 1} from ${trip.title}`}
              className="photo-archive-wall-item"
              key={`${trip.slug}-${photo.id}`}
              type="button"
              onClick={(event) => {
                returnFocusRef.current = event.currentTarget;
                setSelectedIndex(index);
              }}
            >
              <img
                alt={alt}
                decoding="async"
                height={photo.height}
                loading={index < 10 ? "eager" : "lazy"}
                src={photo.thumbnailSrc ?? photo.src}
                width={photo.width}
                onLoad={(event) =>
                  event.currentTarget.classList.add("is-loaded")
                }
              />
            </button>
          );
        })}
      </div>

      {selectedItem ? (
        <div
          aria-label={`${selectedItem.trip.title} photograph preview`}
          aria-modal="true"
          className="photo-archive-lightbox"
          role="dialog"
        >
          <button
            aria-label="Close photograph preview"
            className="photo-archive-lightbox-close"
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
          >
            <X aria-hidden size={21} />
          </button>
          <button
            aria-label="Previous photograph"
            className="photo-archive-lightbox-control photo-archive-lightbox-previous"
            disabled={items.length < 2}
            type="button"
            onClick={showPrevious}
          >
            <ChevronLeft aria-hidden size={29} />
          </button>
          <figure>
            <img
              alt={getPhotoDisplayAlt(
                selectedItem.photo,
                selectedItem.trip,
                selectedItem.tripIndex,
              )}
              height={selectedItem.photo.height}
              src={selectedItem.photo.src ?? selectedItem.photo.thumbnailSrc}
              width={selectedItem.photo.width}
            />
            <figcaption>
              {String((selectedIndex ?? 0) + 1).padStart(3, "0")} /{" "}
              {String(items.length).padStart(3, "0")}
            </figcaption>
          </figure>
          <button
            aria-label="Next photograph"
            className="photo-archive-lightbox-control photo-archive-lightbox-next"
            disabled={items.length < 2}
            type="button"
            onClick={showNext}
          >
            <ChevronRight aria-hidden size={29} />
          </button>
        </div>
      ) : null}
    </>
  );
}
