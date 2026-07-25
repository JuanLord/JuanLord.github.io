import type { Coordinates, Hike } from "../../../src/types/content";

interface ParsedPoint {
  coordinates: Coordinates;
  elevationMeters?: number;
  time?: Date;
}

export interface GpxImport {
  name?: string;
  description?: string;
  date?: string;
  coordinates: Coordinates;
  points: Coordinates[];
  elevationProfileFeet: number[];
  distanceMiles: number;
  elevationFeet?: number;
  movingHours?: number;
  startedAt?: string;
  endedAt?: string;
  elapsedHours?: number;
}

const EARTH_RADIUS_METERS = 6_371_000;
const METERS_TO_MILES = 0.000621371;
const METERS_TO_FEET = 3.28084;
const MAX_ROUTE_POINTS = 1_000;

function elements(parent: Document | Element, localName: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS("*", localName));
}

function childText(parent: Document | Element, localName: string): string {
  return elements(parent, localName)[0]?.textContent?.trim() ?? "";
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMeters(
  [longitudeA, latitudeA]: Coordinates,
  [longitudeB, latitudeB]: Coordinates,
): number {
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const latitudeARadians = toRadians(latitudeA);
  const latitudeBRadians = toRadians(latitudeB);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeARadians) *
      Math.cos(latitudeBRadians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

function parsePoint(element: Element): ParsedPoint | undefined {
  const longitude = Number(element.getAttribute("lon"));
  const latitude = Number(element.getAttribute("lat"));
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude))
    return undefined;

  const elevationValue = childText(element, "ele");
  const elevation = elevationValue ? Number(elevationValue) : undefined;
  const timeValue = childText(element, "time");
  const time = timeValue ? new Date(timeValue) : undefined;

  return {
    coordinates: [longitude, latitude],
    elevationMeters:
      elevation !== undefined && Number.isFinite(elevation)
        ? elevation
        : undefined,
    time: time && Number.isFinite(time.getTime()) ? time : undefined,
  };
}

function routeSegments(xml: Document): ParsedPoint[][] {
  const trackSegments = elements(xml, "trkseg")
    .map((segment) =>
      elements(segment, "trkpt")
        .map(parsePoint)
        .filter((point): point is ParsedPoint => Boolean(point)),
    )
    .filter((segment) => segment.length);
  if (trackSegments.length) return trackSegments;

  const routes = elements(xml, "rte")
    .map((route) =>
      elements(route, "rtept")
        .map(parsePoint)
        .filter((point): point is ParsedPoint => Boolean(point)),
    )
    .filter((segment) => segment.length);
  if (routes.length) return routes;

  const loosePoints = [...elements(xml, "trkpt"), ...elements(xml, "rtept")]
    .map(parsePoint)
    .filter((point): point is ParsedPoint => Boolean(point));
  return loosePoints.length ? [loosePoints] : [];
}

function sampledPoints(points: ParsedPoint[]): ParsedPoint[] {
  const stride = Math.max(1, Math.ceil(points.length / MAX_ROUTE_POINTS));
  return points.filter(
    (_, index) => index % stride === 0 || index === points.length - 1,
  );
}

function rounded(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

export function inferDifficulty(
  distanceMiles: number,
  elevationFeet: number,
): Hike["difficulty"] {
  if (distanceMiles >= 10 || elevationFeet >= 3_000) return "Strenuous";
  if (distanceMiles <= 4 && elevationFeet <= 800) return "Easy";
  return "Moderate";
}

export function parseGpx(source: string): GpxImport {
  const xml = new DOMParser().parseFromString(source, "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("GPX file is invalid.");

  const segments = routeSegments(xml);
  const allPoints = segments.flat();
  if (allPoints.length < 2) {
    throw new Error("GPX route needs at least two valid points.");
  }

  let totalDistanceMeters = 0;
  let elevationGainMeters = 0;
  let movingMilliseconds = 0;
  for (const segment of segments) {
    for (let index = 1; index < segment.length; index += 1) {
      const previous = segment[index - 1];
      const current = segment[index];
      const legDistance = distanceMeters(
        previous.coordinates,
        current.coordinates,
      );
      totalDistanceMeters += legDistance;

      if (
        previous.elevationMeters !== undefined &&
        current.elevationMeters !== undefined
      ) {
        elevationGainMeters += Math.max(
          0,
          current.elevationMeters - previous.elevationMeters,
        );
      }

      if (previous.time && current.time) {
        const duration = current.time.getTime() - previous.time.getTime();
        const seconds = duration / 1_000;
        const speedMetersPerSecond = seconds > 0 ? legDistance / seconds : 0;
        if (
          duration > 0 &&
          duration <= 30 * 60 * 1_000 &&
          legDistance >= 1 &&
          speedMetersPerSecond >= 0.14
        ) {
          movingMilliseconds += duration;
        }
      }
    }
  }

  const times = allPoints
    .map(({ time }) => time)
    .filter((time): time is Date => Boolean(time))
    .sort((a, b) => a.getTime() - b.getTime());
  const startedAt = times[0];
  const endedAt = times[times.length - 1];
  const sample = sampledPoints(allPoints);
  const hasElevation = allPoints.some(
    ({ elevationMeters }) => elevationMeters !== undefined,
  );
  const metadata = elements(xml, "metadata")[0];
  const track = elements(xml, "trk")[0] ?? elements(xml, "rte")[0];
  const metadataTime = metadata ? childText(metadata, "time") : "";
  const dateSource =
    startedAt ?? (metadataTime ? new Date(metadataTime) : undefined);
  const name = track ? childText(track, "name") : "";
  const description = track ? childText(track, "desc") : "";

  return {
    name: name || (metadata ? childText(metadata, "name") : "") || undefined,
    description:
      description || (metadata ? childText(metadata, "desc") : "") || undefined,
    date:
      dateSource && Number.isFinite(dateSource.getTime())
        ? dateSource.toISOString().slice(0, 7)
        : undefined,
    coordinates: allPoints[0].coordinates,
    points: sample.map(({ coordinates }) => coordinates),
    elevationProfileFeet: hasElevation
      ? sample.map(({ elevationMeters }) =>
          elevationMeters === undefined
            ? 0
            : Math.round(elevationMeters * METERS_TO_FEET),
        )
      : [],
    distanceMiles: rounded(totalDistanceMeters * METERS_TO_MILES),
    elevationFeet: hasElevation
      ? Math.round(elevationGainMeters * METERS_TO_FEET)
      : undefined,
    movingHours: movingMilliseconds
      ? rounded(movingMilliseconds / 3_600_000)
      : undefined,
    startedAt: startedAt?.toISOString(),
    endedAt: endedAt?.toISOString(),
    elapsedHours:
      startedAt && endedAt
        ? rounded((endedAt.getTime() - startedAt.getTime()) / 3_600_000)
        : undefined,
  };
}
