import { ArrowUpRight, MapPin, MountainSnow } from "lucide-react";
import { Link } from "react-router-dom";
import { formatYearMonth } from "../../lib/content";
import type { Hike } from "../../types/content";
import { RoutePreview } from "./RoutePreview";

interface HikeCardProps {
  hike: Hike;
  index: number;
}

export function HikeCard({ hike, index }: HikeCardProps) {
  return (
    <article className="hike-card">
      <div className="hike-card-route">
        <div className="hike-card-index">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <MountainSnow aria-hidden size={19} strokeWidth={1.4} />
        </div>
        <RoutePreview label={hike.trail} route={hike.route} />
      </div>

      <div className="hike-card-copy">
        <p className="hike-card-location">
          <MapPin aria-hidden size={15} />
          {hike.location}
        </p>
        <h3>{hike.trail}</h3>
        <p>{hike.summary}</p>
        <dl>
          <div>
            <dt>Distance</dt>
            <dd>{hike.distanceMiles} mi</dd>
          </div>
          <div>
            <dt>Gain</dt>
            <dd>{hike.elevationFeet.toLocaleString()} ft</dd>
          </div>
          <div>
            <dt>Moving</dt>
            <dd>{hike.movingHours} hr</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatYearMonth(hike.date)}</dd>
          </div>
        </dl>
        <Link
          className="creative-text-link creative-text-link-light"
          to={`/creative/travel/hikes/${hike.slug}`}
        >
          Hike details
          <ArrowUpRight aria-hidden size={17} />
        </Link>
      </div>
    </article>
  );
}
