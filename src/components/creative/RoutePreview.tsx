import { geoMercator, geoPath } from "d3-geo";
import type { LineString } from "geojson";
import type { HikeRoute } from "../../types/content";

interface RoutePreviewProps {
  label: string;
  route: HikeRoute;
}

export function RoutePreview({ label, route }: RoutePreviewProps) {
  const line: LineString = {
    type: "LineString",
    coordinates: route.points,
  };
  const projection = geoMercator().fitExtent(
    [
      [24, 20],
      [296, 140],
    ],
    line,
  );
  const routePath = geoPath(projection)(line) ?? undefined;
  const start = projection(route.points[0]);
  const end = projection(route.points[route.points.length - 1]);

  return (
    <svg
      aria-label={`${label} route preview`}
      className="hike-route-preview"
      role="img"
      viewBox="0 0 320 160"
    >
      <path
        className="hike-route-grid"
        d="M0 40H320M0 80H320M0 120H320M80 0V160M160 0V160M240 0V160"
      />
      <path className="hike-route-line" d={routePath} />
      {start ? (
        <circle
          className="hike-route-point hike-route-point-start"
          cx={start[0]}
          cy={start[1]}
          r="5"
        />
      ) : null}
      {end ? (
        <circle
          className="hike-route-point hike-route-point-end"
          cx={end[0]}
          cy={end[1]}
          r="5"
        />
      ) : null}
    </svg>
  );
}
