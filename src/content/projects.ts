import type { Project } from "../types/content";

export const projects = [
  {
    slug: "autonomous-sorting-system",
    title: "Autonomous Sorting System",
    category: "engineering",
    year: 2026,
    summary:
      "A sensor-driven prototype that classifies and routes objects under practical timing constraints.",
    techStack: ["Python", "Arduino", "CAD", "Control Systems"],
    featured: true,
    media: {
      alt: "Placeholder diagram of an autonomous sorting system",
      aspectRatio: "16/10",
      placeholder: true,
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/JuanLord/placeholder-sorting-system",
        placeholder: true,
      },
    ],
    details: {
      problem:
        "Manual sorting is inconsistent and difficult to scale in constrained environments.",
      approach: [
        "Mapped sensor input to deterministic routing decisions.",
        "Prototyped mechanical layouts and actuator timing.",
        "Measured reliability across repeated test cycles.",
      ],
      outcome:
        "Produced a validated proof of concept and an improvement roadmap.",
    },
    status: "mock",
  },
  {
    slug: "telemetry-workbench",
    title: "Telemetry Workbench",
    category: "software",
    year: 2025,
    summary:
      "A browser-based workspace for reviewing test runs, annotations, and engineering metrics.",
    techStack: ["React", "TypeScript", "Vite", "Vitest"],
    featured: true,
    media: {
      alt: "Placeholder interface for an engineering telemetry dashboard",
      aspectRatio: "16/10",
      placeholder: true,
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/JuanLord/placeholder-telemetry-workbench",
        placeholder: true,
      },
      {
        label: "Live demo",
        href: "https://example.com/telemetry-workbench",
        placeholder: true,
      },
    ],
    details: {
      problem:
        "Test results were spread across files and difficult to compare between iterations.",
      approach: [
        "Designed a normalized run and measurement model.",
        "Built filterable views around the review workflow.",
        "Added automated checks for critical content states.",
      ],
      outcome:
        "Created a focused prototype for faster test review and reporting.",
    },
    status: "mock",
  },
  {
    slug: "adaptive-energy-monitor",
    title: "Adaptive Energy Monitor",
    category: "engineering",
    year: 2025,
    summary:
      "An embedded monitoring concept for identifying unusual power-consumption patterns.",
    techStack: ["C++", "ESP32", "Sensors", "Signal Processing"],
    featured: true,
    media: {
      alt: "Placeholder schematic of an embedded energy monitoring device",
      aspectRatio: "16/10",
      placeholder: true,
    },
    links: [
      {
        label: "Case study",
        href: "/projects/adaptive-energy-monitor",
        placeholder: true,
      },
    ],
    details: {
      problem:
        "Small workshops often lack useful visibility into changing equipment loads.",
      approach: [
        "Sampled current and voltage at repeatable intervals.",
        "Evaluated baseline and threshold detection strategies.",
        "Designed a compact enclosure and service workflow.",
      ],
      outcome:
        "Defined a testable embedded architecture and enclosure prototype.",
    },
    status: "mock",
  },
  {
    slug: "field-notes-platform",
    title: "Field Notes Platform",
    category: "software",
    year: 2024,
    summary:
      "An offline-friendly field journal for structured observations, media, and trip summaries.",
    techStack: ["React", "IndexedDB", "PWA", "MapLibre"],
    featured: false,
    media: {
      alt: "Placeholder mobile interface for a field notes application",
      aspectRatio: "16/10",
      placeholder: true,
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/JuanLord/placeholder-field-notes",
        placeholder: true,
      },
    ],
    details: {
      problem:
        "Field observations are easy to lose when connectivity is unreliable.",
      approach: [
        "Designed an offline-first entry workflow.",
        "Modeled locations, media, and observations separately.",
        "Added export-friendly summaries for later analysis.",
      ],
      outcome:
        "Created a mobile prototype that keeps the core workflow available offline.",
    },
    status: "mock",
  },
] satisfies Project[];
