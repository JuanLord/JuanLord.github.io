import { ArrowUpRight, FolderOpen, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateRange } from "../../lib/content";
import type { PhotoTrip } from "../../types/content";
import { EmbedPanel } from "./EmbedPanel";
import { PhotoContactSheet } from "./PhotoContactSheet";

interface PhotoTripCardProps {
  index: number;
  trip: PhotoTrip;
}

export function PhotoTripCard({ index, trip }: PhotoTripCardProps) {
  return (
    <article className="photo-trip-card">
      <Link
        aria-label={`Open ${trip.title} photo folder`}
        className="photo-trip-preview"
        to={`/creative/photography/${trip.slug}`}
      >
        <PhotoContactSheet compact trip={trip} />
        <span className="photo-trip-folder-mark">
          <FolderOpen aria-hidden size={18} strokeWidth={1.5} />
          {trip.photoCount} photos
        </span>
      </Link>

      <div className="photo-trip-card-copy">
        <div className="photo-trip-card-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <time dateTime={trip.startDate}>
            {formatDateRange(trip.startDate, trip.endDate)}
          </time>
        </div>
        <h2>{trip.title}</h2>
        <p className="photo-trip-location">
          <MapPin aria-hidden size={15} />
          {trip.location}
        </p>
        <p>{trip.summary}</p>
        <Link
          className="creative-text-link"
          to={`/creative/photography/${trip.slug}`}
        >
          Open folder
          <ArrowUpRight aria-hidden size={17} />
        </Link>
      </div>

      <EmbedPanel compact embed={trip.soundtrack} />
    </article>
  );
}
