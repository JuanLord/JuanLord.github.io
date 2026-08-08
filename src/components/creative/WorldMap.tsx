import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { CreativeMapPoint } from "../../types/content";

interface WorldMapProps {
  points: CreativeMapPoint[];
}

type MapState = "loading" | "ready" | "unavailable";

function tooltipContent(point: CreativeMapPoint): HTMLDivElement {
  const card = document.createElement("div");
  card.className = "creative-map-card";

  const kind = document.createElement("span");
  kind.textContent =
    point.kind === "photography" ? "Photography location" : "Hiking route";

  const label = document.createElement("strong");
  label.textContent = point.label;

  const action = document.createElement("small");
  action.textContent = "Open story";

  card.append(kind, label, action);
  return card;
}

export function WorldMap({ points }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let map: LeafletMap | undefined;
    const initialize = async () => {
      const { default: L } = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [24, 0],
        doubleClickZoom: true,
        maxBounds: [
          [-85, -180],
          [85, 180],
        ],
        maxBoundsViscosity: 0.8,
        maxZoom: 9,
        minZoom: 1,
        scrollWheelZoom: true,
        touchZoom: true,
        worldCopyJump: true,
        zoom: 2,
        zoomControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      for (const point of points) {
        const [longitude, latitude] = point.coordinates;
        const position = L.latLng(latitude, longitude);
        bounds.extend(position);

        const marker = L.circleMarker(position, {
          className: `creative-map-marker creative-map-marker-${point.kind}`,
          color: "#f3f6ef",
          fillColor: point.kind === "photography" ? "#db6d35" : "#4d9663",
          fillOpacity: 1,
          radius: 8,
          weight: 2,
        })
          .bindTooltip(tooltipContent(point), {
            className: "creative-map-tooltip",
            direction: "top",
            offset: [0, -10],
            opacity: 1,
          })
          .addTo(map);

        marker.on("click", () => {
          window.location.hash = point.to;
        });
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { maxZoom: 4, padding: [48, 48] });
      }
      window.requestAnimationFrame(() => map?.invalidateSize());
      setMapState("ready");
    };

    setMapState("loading");
    void initialize().catch(() => {
      if (!cancelled) setMapState("unavailable");
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points]);

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

      <div className="creative-world-map-frame">
        <div
          aria-label="Interactive world map of photography folders and hikes"
          className="creative-world-map-canvas"
          ref={containerRef}
          role="region"
        />
        {mapState !== "ready" ? (
          <div className="creative-map-loading" role="status">
            {mapState === "loading" ? "Loading map" : "Map unavailable"}
          </div>
        ) : null}
      </div>

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
