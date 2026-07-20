import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries from "world-atlas/countries-110m.json";
import type { CreativeMapPoint } from "../../types/content";

interface WorldMapProps {
  points: CreativeMapPoint[];
}

const atlas = countries as unknown as Topology<{
  countries: GeometryCollection;
}>;
const countryCollection = feature(atlas, atlas.objects.countries);
const projection = geoNaturalEarth1().translate([480, 250]).scale(160);
const path = geoPath(projection);

export function WorldMap({ points }: WorldMapProps) {
  return (
    <figure className="creative-world-map">
      <div className="creative-world-map-heading">
        <div>
          <p>World notebook</p>
          <h2>Places connected to a story.</h2>
        </div>
        <div className="creative-map-legend" aria-label="Map legend">
          <span>
            <i className="creative-map-dot creative-map-dot-photo" />
            Photography
          </span>
          <span>
            <i className="creative-map-dot creative-map-dot-hike" />
            Hike
          </span>
        </div>
      </div>

      <svg
        aria-labelledby="creative-world-map-title"
        className="creative-world-map-svg"
        role="img"
        viewBox="0 0 960 500"
      >
        <title id="creative-world-map-title">
          World map of photography folders and hikes
        </title>
        <path
          className="creative-map-sphere"
          d={path({ type: "Sphere" }) ?? undefined}
        />
        {countryCollection.features.map((country, index) => (
          <path
            className="creative-map-country"
            d={path(country) ?? undefined}
            key={`${country.id ?? "country"}-${index}`}
          />
        ))}
        {points.map((point) => {
          const position = projection(point.coordinates);
          if (!position) return null;

          return (
            <a
              aria-label={`Open ${point.label}`}
              href={`#${point.to}`}
              key={point.id}
            >
              <circle
                className={`creative-map-marker creative-map-marker-${point.kind}`}
                cx={position[0]}
                cy={position[1]}
                r="8"
              />
              <title>{point.label}</title>
            </a>
          );
        })}
      </svg>

      <figcaption>
        {points.map((point) => (
          <a href={`#${point.to}`} key={`${point.id}-caption`}>
            <span
              className={`creative-map-dot creative-map-dot-${point.kind === "photography" ? "photo" : "hike"}`}
            />
            {point.label}
          </a>
        ))}
      </figcaption>
    </figure>
  );
}
