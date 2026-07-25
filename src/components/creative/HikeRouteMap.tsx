import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { HikeRoute } from "../../types/content";

interface HikeRouteMapProps {
  label: string;
  route: HikeRoute;
}

type MapState = "loading" | "ready" | "unavailable";

export function HikeRouteMap({ label, route }: HikeRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>("loading");

  useEffect(() => {
    if (!containerRef.current || route.points.length < 2) {
      setMapState("unavailable");
      return;
    }

    let cancelled = false;
    let map: LeafletMap | undefined;
    const initialize = async () => {
      const { default: L } = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const positions = route.points.map(
        ([longitude, latitude]) => [latitude, longitude] as [number, number],
      );
      map = L.map(containerRef.current, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const routeLine = L.polyline(positions, {
        color: "#db6d35",
        opacity: 0.96,
        weight: 5,
      }).addTo(map);
      L.circleMarker(positions[0], {
        color: "#f4f7ef",
        fillColor: "#4d9663",
        fillOpacity: 1,
        radius: 7,
        weight: 2,
      })
        .bindTooltip("Start")
        .addTo(map);
      L.circleMarker(positions[positions.length - 1], {
        color: "#f4f7ef",
        fillColor: "#db6d35",
        fillOpacity: 1,
        radius: 7,
        weight: 2,
      })
        .bindTooltip("Finish")
        .addTo(map);
      map.fitBounds(routeLine.getBounds(), {
        maxZoom: 15,
        padding: [32, 32],
      });
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
  }, [route.points]);

  return (
    <div className="hike-route-map-frame">
      <div
        ref={containerRef}
        aria-label={`${label} interactive route map`}
        className="hike-route-map"
        role="region"
      />
      {mapState !== "ready" ? (
        <div className="hike-route-map-status" role="status">
          {mapState === "loading"
            ? "Loading trail map"
            : "Route map unavailable"}
        </div>
      ) : null}
    </div>
  );
}
