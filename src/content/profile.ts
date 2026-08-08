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
  location: "Miami, USA",
  availability: "Open to opportunities",
  email: {
    label: "Email",
    href: "mailto:juanmartinvarela2006@gmail.com",
    placeholder: false,
  },
  github: {
    label: "GitHub",
    href: "https://github.com/JuanLord",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/juanvar",
    placeholder: false,
  },
  resume: {
    label: "Resume",
    href: "/resume/juan-varela-resume.pdf",
    placeholder: false,
  },
  status: "published",
};

export const experience: Experience[] = [];

export const education: Education[] = [];

export const certifications: Certification[] = [];

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
