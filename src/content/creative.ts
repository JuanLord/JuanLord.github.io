import type { Hike, MusicProject, Photo } from "../types/content";

export const photos = [
  {
    id: "coastal-morning",
    location: "Point Reyes, California",
    date: "2025-07",
    caption:
      "A quiet morning study of shifting fog, cliffs, and open coastline.",
    media: {
      alt: "Placeholder photograph of fog along the Point Reyes coastline",
      aspectRatio: "4/5",
      placeholder: true,
    },
    status: "mock",
  },
  {
    id: "desert-lines",
    location: "Joshua Tree, California",
    date: "2025-03",
    caption:
      "Late light turning granite, trails, and desert plants into simple geometry.",
    media: {
      alt: "Placeholder photograph of evening light in Joshua Tree",
      aspectRatio: "3/2",
      placeholder: true,
    },
    status: "mock",
  },
] satisfies Photo[];

export const hikes = [
  {
    id: "mount-tallac",
    trail: "Mount Tallac",
    location: "Lake Tahoe, California",
    date: "2025-08",
    distanceMiles: 10.2,
    elevationFeet: 3260,
    summary:
      "A sustained alpine climb with changing terrain and broad views over the Tahoe basin.",
    media: {
      alt: "Placeholder photograph from the Mount Tallac trail",
      aspectRatio: "3/2",
      placeholder: true,
    },
    status: "mock",
  },
  {
    id: "mist-trail",
    trail: "Mist Trail",
    location: "Yosemite, California",
    date: "2024-06",
    distanceMiles: 7.0,
    elevationFeet: 2100,
    summary:
      "Granite steps, heavy water, and a close look at the valley's changing scale.",
    media: {
      alt: "Placeholder photograph from Yosemite's Mist Trail",
      aspectRatio: "4/5",
      placeholder: true,
    },
    status: "mock",
  },
] satisfies Hike[];

export const musicProjects = [
  {
    id: "signal-path",
    title: "Signal Path",
    year: 2025,
    format: "audio",
    description:
      "A short electronic study built from processed field recordings and modular textures.",
    mediaLink: {
      label: "Listen",
      href: "https://soundcloud.com/placeholder/signal-path",
      placeholder: true,
    },
    cover: {
      alt: "Placeholder cover artwork for Signal Path",
      aspectRatio: "1/1",
      placeholder: true,
    },
    status: "mock",
  },
] satisfies MusicProject[];
