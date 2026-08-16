import type { PhotoTrip, TripPhoto } from "../types/content";

export const PHOTO_ARCHIVE_ORIGIN = "https://photos.juanvarela.dev";
export const PHOTO_ARCHIVE_PATH = "/photos/";

export interface ArchivePhotoItem {
  photo: TripPhoto;
  trip: PhotoTrip;
  tripIndex: number;
}

export function isDedicatedPhotoArchive(): boolean {
  return (
    import.meta.env.VITE_PHOTOS_SITE === "1" ||
    window.location.hostname === "photos.juanvarela.dev" ||
    window.location.pathname === "/photos" ||
    window.location.pathname.startsWith(PHOTO_ARCHIVE_PATH)
  );
}

export function getPhotoArchiveRoot(): string {
  return isDedicatedPhotoArchive() ? "/" : "/photos";
}

export function getPhotoArchiveTripPath(slug: string): string {
  return isDedicatedPhotoArchive() ? `/${slug}` : `/photos/${slug}`;
}

export function getPublishedArchiveTrips(trips: PhotoTrip[]): PhotoTrip[] {
  return trips.filter(
    ({ photos, status }) =>
      status === "published" &&
      photos.some((photo) => photo.status === "published" && photo.src),
  );
}

export function getArchivePhotoItems(trips: PhotoTrip[]): ArchivePhotoItem[] {
  return getPublishedArchiveTrips(trips).flatMap((trip) =>
    trip.photos
      .filter(({ src, status }) => status === "published" && src)
      .map((photo, tripIndex) => ({ photo, trip, tripIndex })),
  );
}

function getCaptureTime(item: ArchivePhotoItem): number | undefined {
  const captureTime = Date.parse(item.photo.date);
  return Number.isNaN(captureTime) ? undefined : captureTime;
}

export function sortArchivePhotosChronologically(
  items: ArchivePhotoItem[],
): ArchivePhotoItem[] {
  return [...items].sort((left, right) => {
    const leftTime = getCaptureTime(left);
    const rightTime = getCaptureTime(right);

    if (leftTime !== undefined && rightTime !== undefined) {
      return leftTime - rightTime || left.tripIndex - right.tripIndex;
    }
    if (leftTime !== undefined) return -1;
    if (rightTime !== undefined) return 1;
    return left.tripIndex - right.tripIndex;
  });
}

export function getPhotoDisplayAlt(
  photo: TripPhoto,
  trip: PhotoTrip,
  index: number,
): string {
  const alt = photo.alt.trim();
  const looksLikeFilename =
    /\.(?:heic|heif|jpe?g|png|webp)$/i.test(alt) ||
    /\b(?:dscn?|img|image|photo|pxl)[-_ ]?\d+\b/i.test(alt) ||
    /\b\d{6,}\b/.test(alt);

  if (alt && !looksLikeFilename) return alt;
  if (photo.caption.trim()) return photo.caption.trim();
  return `Photograph ${index + 1} from ${trip.title}`;
}
