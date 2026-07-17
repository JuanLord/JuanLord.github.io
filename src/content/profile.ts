import type {
  Certification,
  Education,
  Experience,
  Profile,
} from "../types/content";

export const profile = {
  name: "Juan Varela",
  role: "Developer & Engineer",
  tagline:
    "I build practical systems where software, engineering, and creative problem-solving meet.",
  location: "California, USA",
  availability: "Open to opportunities",
  email: {
    label: "Email",
    href: "mailto:hello@example.com",
    placeholder: true,
  },
  github: {
    label: "GitHub",
    href: "https://github.com/JuanLord",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/placeholder",
    placeholder: true,
  },
  resume: {
    label: "Resume",
    href: "/resume/juan-varela-resume.pdf",
    placeholder: true,
  },
  status: "mock",
} satisfies Profile;

export const experience = [
  {
    id: "northstar-systems",
    organization: "Northstar Systems Lab",
    role: "Engineering Intern",
    startDate: "2025-05",
    endDate: "2025-08",
    location: "San Diego, CA",
    summary:
      "Built instrumentation and automation tools for a multidisciplinary prototype team.",
    highlights: [
      "Reduced repetitive test setup through a Python-based data workflow.",
      "Documented hardware and software interfaces for faster team handoffs.",
    ],
    status: "mock",
  },
  {
    id: "forge-development",
    organization: "Forge Development Collective",
    role: "Software Project Lead",
    startDate: "2024-09",
    endDate: "2025-04",
    location: "Remote",
    summary:
      "Led a small team building internal tools for project tracking and technical reporting.",
    highlights: [
      "Defined the component architecture and content model.",
      "Coordinated reviews, testing, and iterative releases.",
    ],
    status: "mock",
  },
] satisfies Experience[];

export const education = [
  {
    id: "pacific-tech",
    institution: "Pacific Institute of Technology",
    credential: "Bachelor of Science",
    field: "Mechanical Engineering",
    startYear: 2022,
    endYear: 2026,
    status: "mock",
  },
] satisfies Education[];

export const certifications = [
  {
    id: "solidworks-associate",
    title: "Certified CAD Design Associate",
    issuer: "Example Engineering Institute",
    year: 2025,
    status: "mock",
  },
  {
    id: "cloud-foundations",
    title: "Cloud Development Foundations",
    issuer: "Example Technology Academy",
    year: 2024,
    status: "mock",
  },
] satisfies Certification[];

export const skills = [
  "TypeScript",
  "React",
  "Python",
  "CAD",
  "Control Systems",
  "Technical Prototyping",
] as const;
