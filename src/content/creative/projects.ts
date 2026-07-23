import type { CreativeProject } from "../../types/content";

export const creativeProjects: CreativeProject[] = [
  {
    slug: "light-between-trees",
    title: "Light Between Trees",
    year: 2025,
    kind: "short-film",
    description:
      "A compact visual study pairing handheld woodland footage with an improvised ambient score.",
    role: "Camera, edit, sound design, and mix",
    tools: ["DaVinci Resolve", "Field recorder", "Guitar"],
    embed: {
      provider: "youtube",
      title: "Light Between Trees short film",
      placeholder: true,
    },
    status: "placeholder",
  },
  {
    slug: "signal-path",
    title: "Signal Path",
    year: 2025,
    kind: "music",
    description:
      "A short electronic study built from processed field recordings and modular textures.",
    role: "Composition, field recording, and production",
    tools: ["Ableton Live", "Field recorder", "Modular synthesis"],
    embed: {
      provider: "spotify",
      title: "Signal Path music project",
      placeholder: true,
    },
    status: "placeholder",
  },
  {
    slug: "edges-of-water",
    title: "Edges of Water",
    year: 2024,
    kind: "short-film",
    description:
      "A placeholder short-film record focused on shoreline movement, weather, and patient observation.",
    role: "Direction, camera, edit, and sound",
    tools: ["DaVinci Resolve", "Mirrorless camera", "Field recorder"],
    embed: {
      provider: "vimeo",
      title: "Edges of Water short film",
      placeholder: true,
    },
    status: "placeholder",
  },
];
