import { ArrowUpRight, Grid3X3, Map, Music2 } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getPhotoTripBySlug } from "../../lib/content";
import {
  getPhotoArchiveRoot,
  isDedicatedPhotoArchive,
} from "../../lib/photoArchive";
import { ScrollToTop } from "../layout/ScrollToTop";

function setMetaContent(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

function PhotoArchiveMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = getPhotoArchiveRoot();
    const slug =
      pathname === root
        ? undefined
        : pathname.split("/").filter(Boolean).at(-1);
    const trip = slug ? getPhotoTripBySlug(slug) : undefined;
    const title = trip
      ? `${trip.title} | Juan Varela Photography`
      : "Juan Varela Photography";
    const description = trip
      ? trip.summary
      : "Juan Varela's photography archive: complete trip folders, location atlas, and listening companions.";

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="theme-color"]', "#161b18");
  }, [pathname]);

  return null;
}

export function PhotoArchiveLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const root = getPhotoArchiveRoot();

  const goToSection = (sectionId: string) => {
    const scroll = () =>
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (pathname !== root) {
      navigate(root);
      window.setTimeout(scroll, 80);
      return;
    }

    scroll();
  };

  const focusMainContent = () => {
    document.getElementById("photo-archive-main")?.focus();
  };

  return (
    <div className="photo-archive-frame">
      <PhotoArchiveMetadata />
      <ScrollToTop />
      <button
        className="photo-archive-skip-link"
        type="button"
        onClick={focusMainContent}
      >
        Skip to photographs
      </button>

      <header className="photo-archive-header">
        <Link
          aria-label="Juan Varela Photography, archive home"
          className="photo-archive-brand"
          to={root}
        >
          <span aria-hidden="true">JV</span>
          <strong>JUAN VARELA / PHOTOGRAPHY</strong>
        </Link>

        <nav aria-label="Photography archive navigation">
          <button type="button" onClick={() => goToSection("photo-wall")}>
            <Grid3X3 aria-hidden size={14} />
            Photographs
          </button>
          <button type="button" onClick={() => goToSection("photo-folders")}>
            Folders
          </button>
          <button type="button" onClick={() => goToSection("photo-map")}>
            <Map aria-hidden size={14} />
            Map
          </button>
          <button
            type="button"
            onClick={() => goToSection("photo-soundtracks")}
          >
            <Music2 aria-hidden size={14} />
            Listening
          </button>
        </nav>

        <a
          className="photo-archive-portfolio-link"
          href="https://juanvarela.dev"
        >
          Portfolio
          <ArrowUpRight aria-hidden size={14} />
        </a>
      </header>

      <main id="photo-archive-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="photo-archive-footer">
        <span>DESIGN · PHOTOGRAPHY · PLACE</span>
        <span>“LIVE DELIBERATELY.”</span>
        <span>
          {isDedicatedPhotoArchive()
            ? "PHOTOS.JUANVARELA.DEV"
            : "LOCAL PREVIEW"}
        </span>
      </footer>
    </div>
  );
}
