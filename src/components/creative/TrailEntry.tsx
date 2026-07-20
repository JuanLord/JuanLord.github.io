import { MapPin, MountainSnow } from "lucide-react";
import { formatYearMonth } from "../../lib/content";
import type { Hike } from "../../types/content";

interface TrailEntryProps {
  hike: Hike;
  index: number;
}

export function TrailEntry({ hike, index }: TrailEntryProps) {
  return (
    <article className="trail-entry">
      <div className="trail-entry-index" aria-hidden>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <MountainSnow size={22} strokeWidth={1.3} />
      </div>

      <div className="trail-entry-copy">
        <div className="trail-entry-location">
          <MapPin aria-hidden size={15} />
          {hike.location}
        </div>
        <h3>{hike.trail}</h3>
        <p>{hike.summary}</p>
      </div>

      <dl className="trail-entry-facts">
        <div>
          <dt>Distance</dt>
          <dd>{hike.distanceMiles} mi</dd>
        </div>
        <div>
          <dt>Gain</dt>
          <dd>{hike.elevationFeet.toLocaleString()} ft</dd>
        </div>
        <div>
          <dt>Effort</dt>
          <dd>{hike.difficulty}</dd>
        </div>
        <div>
          <dt>Season</dt>
          <dd>{formatYearMonth(hike.date)}</dd>
        </div>
      </dl>
    </article>
  );
}
