import type {
  CreativeProfile,
  Hike,
  MusicProject,
  Photo,
} from "../types/content";

export const creativeProfile = {
  eyebrow: "Beyond the desk",
  title: "Creative Field Notes",
  introduction:
    "Photography, long trails, and sound are ways of practicing attention: staying with a place long enough for its smaller patterns to come forward.",
  reflection:
    "This journal is less about collecting destinations than learning to notice weather, distance, texture, and the character of ordinary light.",
  heroMedia: {
    alt: "Generated placeholder photograph of a woodland pond in early spring",
    aspectRatio: "3/2",
    placeholder: true,
    src: "/images/creative/woodland-pond-spring.webp",
  },
  status: "mock",
} satisfies CreativeProfile;

export const photos = [
  {
    id: "coastal-morning",
    location: "Point Reyes, California",
    date: "2025-07",
    caption:
      "A quiet morning study of shifting fog, cliffs, and open coastline.",
    media: {
      alt: "Generated placeholder photograph of fog and spring grass along the Point Reyes coastline",
      aspectRatio: "4/5",
      placeholder: true,
      src: "/images/creative/point-reyes-spring.webp",
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
      alt: "Generated placeholder photograph of a green spring landscape in Joshua Tree",
      aspectRatio: "3/2",
      placeholder: true,
      src: "/images/creative/joshua-tree-spring.webp",
    },
    status: "mock",
  },
  {
    id: "woodland-after-rain",
    location: "Spring Lake, California",
    date: "2024-04",
    caption:
      "Rain held in the canopy while the pond gathered every opening of light.",
    media: {
      alt: "Generated placeholder photograph of wet ferns beside a woodland pond",
      aspectRatio: "3/2",
      placeholder: true,
      src: "/images/creative/spring-lake-ferns.webp",
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
    difficulty: "Strenuous",
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
    difficulty: "Strenuous",
    summary:
      "Granite steps, heavy water, and a close look at the valley's changing scale.",
    media: {
      alt: "Placeholder photograph from Yosemite's Mist Trail",
      aspectRatio: "4/5",
      placeholder: true,
    },
    status: "mock",
  },
  {
    id: "coast-trail",
    trail: "Coast Trail",
    location: "Point Reyes, California",
    date: "2024-03",
    distanceMiles: 8.6,
    elevationFeet: 1380,
    difficulty: "Moderate",
    summary:
      "A green-weather walk between eucalyptus shade, open bluffs, and the changing edge of the Pacific.",
    media: {
      alt: "Placeholder photograph from the Point Reyes Coast Trail",
      aspectRatio: "4/5",
      placeholder: true,
      src: "/images/creative/point-reyes-spring.webp",
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
    role: "Composition, field recording, and production",
    tools: ["Field recorder", "Ableton Live", "Modular synthesis"],
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
  {
    id: "light-between-trees",
    title: "Light Between Trees",
    year: 2024,
    format: "video",
    description:
      "A compact visual study pairing handheld woodland footage with an improvised ambient score.",
    role: "Camera, edit, sound design, and mix",
    tools: ["DaVinci Resolve", "Guitar", "Field recordings"],
    mediaLink: {
      label: "Watch",
      href: "https://youtube.com/placeholder/light-between-trees",
      placeholder: true,
    },
    cover: {
      alt: "Placeholder cover artwork for Light Between Trees",
      aspectRatio: "1/1",
      placeholder: true,
    },
    status: "mock",
  },
] satisfies MusicProject[];
