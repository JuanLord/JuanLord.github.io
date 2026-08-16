import { LocateFixed, Minus, Plus } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getPhotoArchiveTripPath,
  getPhotoDisplayAlt,
} from "../../lib/photoArchive";
import type { Coordinates, PhotoTrip } from "../../types/content";

interface PhotoArchiveMapProps {
  trips: PhotoTrip[];
}

interface ArchiveMapPoint {
  coordinates: Coordinates;
  id: string;
  label: string;
  photoAlt: string;
  photoSrc?: string;
  tripSlug: string;
  tripTitle: string;
}

type MapState = "loading" | "ready" | "unavailable";

function getMapPoints(trips: PhotoTrip[]): ArchiveMapPoint[] {
  return trips.flatMap((trip) => {
    const locations = trip.locations?.length
      ? trip.locations
      : [
          {
            id: "primary",
            name: trip.location,
            coordinates: trip.coordinates,
          },
        ];

    return locations.map((location) => {
      const photo =
        trip.photos.find(
          ({ locationId, src, status }) =>
            locationId === location.id && status === "published" && src,
        ) ??
        trip.photos.find(({ src, status }) => status === "published" && src);

      return {
        coordinates: location.coordinates,
        id: `${trip.slug}-${location.id}`,
        label: location.name,
        photoAlt: photo
          ? getPhotoDisplayAlt(photo, trip, trip.photos.indexOf(photo))
          : `${trip.title} preview`,
        photoSrc: photo?.thumbnailSrc ?? photo?.src,
        tripSlug: trip.slug,
        tripTitle: trip.title,
      };
    });
  });
}

function createTooltip(point: ArchiveMapPoint): HTMLDivElement {
  const preview = document.createElement("div");
  preview.className = "photo-archive-map-preview";

  if (point.photoSrc) {
    const image = document.createElement("img");
    image.alt = point.photoAlt;
    image.decoding = "async";
    image.src = point.photoSrc;
    preview.append(image);
  }

  const copy = document.createElement("div");
  const trip = document.createElement("span");
  trip.textContent = point.tripTitle;
  const location = document.createElement("strong");
  location.textContent = point.label;
  const action = document.createElement("small");
  action.textContent = "Open folder";
  copy.append(trip, location, action);
  preview.append(copy);

  return preview;
}

export function PhotoArchiveMap({ trips }: PhotoArchiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | undefined>(undefined);
  const points = useMemo(() => getMapPoints(trips), [trips]);
  const [mapState, setMapState] = useState<MapState>("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let map: LeafletMap | undefined;

    const initialize = async () => {
      const { default: L } = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [30, 0],
        doubleClickZoom: true,
        maxBounds: [
          [-85, -180],
          [85, 180],
        ],
        maxBoundsViscosity: 0.8,
        maxZoom: 10,
        minZoom: 1,
        scrollWheelZoom: false,
        touchZoom: true,
        worldCopyJump: true,
        zoom: 2,
        zoomControl: false,
      });
      mapRef.current = map;

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
          className: "photo-archive-map-marker",
          color: "#e9eee9",
          fillColor: "#748a64",
          fillOpacity: 1,
          radius: 7,
          weight: 2,
        })
          .bindTooltip(createTooltip(point), {
            className: "photo-archive-map-tooltip",
            direction: "auto",
            offset: [0, 12],
            opacity: 1,
          })
          .addTo(map);

        marker.on("mouseover", () => marker.setRadius(10));
        marker.on("mouseout", () => marker.setRadius(7));
        marker.on("click", () => {
          window.location.hash = `#${getPhotoArchiveTripPath(point.tripSlug)}`;
        });
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { maxZoom: 3, padding: [52, 52] });
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
      mapRef.current = undefined;
      map?.stop();
      map?.remove();
    };
  }, [points]);

  return (
    <div className="photo-archive-map-frame">
      <div
        aria-label="Interactive map of all photography locations"
        className="photo-archive-map-canvas"
        ref={containerRef}
        role="region"
      />
      <div aria-label="Map controls" className="photo-archive-map-toolbar">
        <span>
          <LocateFixed aria-hidden size={14} />
          {points.length} {points.length === 1 ? "place" : "places"}
        </span>
        <div>
          <button
            aria-label="Zoom in"
            disabled={mapState !== "ready"}
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
          >
            <Plus aria-hidden size={15} />
          </button>
          <button
            aria-label="Zoom out"
            disabled={mapState !== "ready"}
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
          >
            <Minus aria-hidden size={15} />
          </button>
        </div>
      </div>
      {mapState !== "ready" ? (
        <div className="photo-archive-map-status" role="status">
          {mapState === "loading"
            ? "Loading location atlas"
            : "Map unavailable"}
        </div>
      ) : null}
    </div>
  );
}
