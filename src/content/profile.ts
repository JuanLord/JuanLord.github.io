import type {
  Certification,
  Education,
  Experience,
  Profile,
  SkillGroup,
} from "../types/content";

export const profile: Profile = {
  name: "Juan Varela",
  role: "Developer & Engineer",
  tagline:
    "I build practical systems where software, engineering, and creative problem-solving meet.",
  bio: [
    "I am an engineering-minded developer interested in the full path from an early idea to a system people can understand and use.",
    "My work moves between software, physical prototyping, data, and technical communication. I care about making complex systems reliable, maintainable, and clear to the people working with them.",
  ],
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
  status: "placeholder",
};

export const experience: Experience[] = [
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
    status: "placeholder",
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
    status: "placeholder",
  },
];

export const education: Education[] = [
  {
    id: "pacific-tech",
    institution: "Pacific Institute of Technology",
    credential: "Bachelor of Science",
    field: "Mechanical Engineering",
    startYear: 2022,
    endYear: 2026,
    status: "placeholder",
  },
];

export const certifications: Certification[] = [
  {
    id: "solidworks-associate",
    title: "Certified CAD Design Associate",
    issuer: "Example Engineering Institute",
    year: 2025,
    status: "placeholder",
  },
  {
    id: "cloud-foundations",
    title: "Cloud Development Foundations",
    issuer: "Example Technology Academy",
    year: 2024,
    status: "placeholder",
  },
];

export const skills: SkillGroup[] = [
  {
    id: "software",
    label: "Software",
    skills: ["TypeScript", "React", "Python", "Testing", "Git"],
  },
  {
    id: "engineering",
    label: "Engineering",
    skills: ["CAD", "Control Systems", "Sensors", "Embedded Prototyping"],
  },
  {
    id: "practice",
    label: "Practice",
    skills: [
      "System Design",
      "Technical Writing",
      "Data Analysis",
      "Iterative Testing",
    ],
  },
];
