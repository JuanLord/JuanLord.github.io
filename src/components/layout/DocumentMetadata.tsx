import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getHikeBySlug,
  getPhotoTripBySlug,
  getProjectBySlug,
} from "../../lib/content";

interface PageMetadata {
  title: string;
  description: string;
}

const defaultMetadata: PageMetadata = {
  title: "Juan Varela | Developer & Engineer",
  description:
    "Juan Varela's engineering and software portfolio, with selected projects, experience, and creative field notes.",
};

const routeMetadata: Record<string, PageMetadata> = {
  "/": defaultMetadata,
  "/about": {
    title: "About & Experience | Juan Varela",
    description:
      "Profile, work experience, education, certifications, and skills for Juan Varela.",
  },
  "/contact": {
    title: "Contact | Juan Varela",
    description:
      "Contact Juan Varela and find links to GitHub and other professional profiles.",
  },
  "/creative": {
    title: "Creative Field Notes | Juan Varela",
    description:
      "Photography, travel, hiking, film, and music collected in Juan Varela's creative field journal.",
  },
  "/creative/photography": {
    title: "Photography Trips | Juan Varela",
    description:
      "Travel photography organized into complete trip folders with notes and listening companions.",
  },
  "/creative/travel": {
    title: "Travel & Hiking | Juan Varela",
    description:
      "Places visited, hike records, route maps, and connected photography folders.",
  },
  "/creative/projects": {
    title: "Film & Music | Juan Varela",
    description:
      "Short films, music projects, field recordings, and production notes.",
  },
  "/projects": {
    title: "Projects | Juan Varela",
    description:
      "Selected engineering and software projects by Juan Varela, with technical case studies and project details.",
  },
};

function getPageMetadata(pathname: string): PageMetadata {
  const photoTripMatch = pathname.match(/^\/creative\/photography\/([^/]+)$/);

  if (photoTripMatch) {
    const trip = getPhotoTripBySlug(photoTripMatch[1]);

    if (trip) {
      return {
        title: `${trip.title} | Juan Varela Photography`,
        description: trip.summary,
      };
    }
  }

  const hikeMatch = pathname.match(/^\/creative\/travel\/hikes\/([^/]+)$/);

  if (hikeMatch) {
    const hike = getHikeBySlug(hikeMatch[1]);

    if (hike) {
      return {
        title: `${hike.trail} | Juan Varela Hiking`,
        description: hike.summary,
      };
    }
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);

  if (projectMatch) {
    const project = getProjectBySlug(projectMatch[1]);

    if (project) {
      return {
        title: `${project.title} | Juan Varela`,
        description: project.summary,
      };
    }
  }

  return (
    routeMetadata[pathname] ?? {
      title: "Page Not Found | Juan Varela",
      description: "The requested portfolio page could not be found.",
    }
  );
}

function setMetaContent(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);

  if (element) {
    element.content = content;
  }
}

export function DocumentMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = getPageMetadata(pathname);

    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
  }, [pathname]);

  return null;
}
