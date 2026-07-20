import { ArrowDown, Camera, Footprints, Headphones, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { MusicEntry } from "../components/creative/MusicEntry";
import { PhotoFigure } from "../components/creative/PhotoFigure";
import { TrailEntry } from "../components/creative/TrailEntry";
import { Container } from "../components/ui/Container";
import { creativeProfile, hikes, musicProjects, photos } from "../content";

const fieldSections = [
  { id: "photography", label: "Photography", icon: Camera },
  { id: "hiking", label: "Trails", icon: Footprints },
  { id: "music", label: "Sound", icon: Headphones },
] as const;

function scrollToSection(id: string) {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function CreativePage() {
  return (
    <div className="creative-page">
      <section
        aria-labelledby="creative-page-title"
        className="creative-field-hero"
      >
        {creativeProfile.heroMedia.src && (
          <img
            alt=""
            aria-hidden="true"
            className="creative-field-hero-image"
            decoding="async"
            fetchPriority="high"
            src={creativeProfile.heroMedia.src}
          />
        )}
        <div className="creative-field-hero-shade" aria-hidden />

        <Container className="creative-field-hero-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="creative-field-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="creative-kicker">
              <span>03</span>
              {creativeProfile.eyebrow}
            </p>
            <h1 id="creative-page-title">{creativeProfile.title}</h1>
            <p>{creativeProfile.introduction}</p>
            <div className="creative-hero-status">
              <Leaf aria-hidden size={16} />
              Mock journal and generated imagery
            </div>
          </motion.div>

          <button
            aria-label="Continue to the field index"
            className="creative-scroll-cue"
            onClick={() => scrollToSection("field-index")}
            title="Continue to field index"
            type="button"
          >
            <ArrowDown aria-hidden size={20} />
          </button>
        </Container>
      </section>

      <nav
        aria-label="Creative field index"
        className="creative-field-index"
        id="field-index"
      >
        <Container className="creative-field-index-inner">
          <div>
            <p>Field index</p>
            <span>Three ways of paying attention</span>
          </div>
          <div className="creative-field-links">
            {fieldSections.map(({ icon: Icon, id, label }, index) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden size={18} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </Container>
      </nav>

      <section
        aria-labelledby="photography-title"
        className="creative-photo-section"
        id="photography"
      >
        <Container>
          <div className="creative-section-heading creative-section-heading-dark">
            <div>
              <p>03.1 / Light & place</p>
              <h2 id="photography-title">Photography & travel</h2>
            </div>
            <p>
              Small records of weather, distance, and the way a place changes
              when the light moves through it.
            </p>
          </div>

          <div className="creative-photo-grid">
            {photos.map((photo, index) => (
              <PhotoFigure index={index} key={photo.id} photo={photo} />
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="hiking-title"
        className="creative-trails-section"
        id="hiking"
      >
        <div className="creative-contour-lines" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <Container>
          <div className="creative-section-heading">
            <div>
              <p>03.2 / Underfoot</p>
              <h2 id="hiking-title">Trail notes</h2>
            </div>
            <p>
              Hikes remembered through effort, changing terrain, and the
              particular silence that arrives after a long climb.
            </p>
          </div>

          <div className="trail-list">
            {hikes.map((hike, index) => (
              <TrailEntry hike={hike} index={index} key={hike.id} />
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="music-title"
        className="creative-music-section"
        id="music"
      >
        <Container>
          <div className="creative-section-heading creative-section-heading-dark">
            <div>
              <p>03.3 / Collected sound</p>
              <h2 id="music-title">Music & moving image</h2>
            </div>
            <p>
              Field recordings and small compositions that hold onto the rhythm
              of a place after the walk is over.
            </p>
          </div>

          <div className="music-list">
            {musicProjects.map((project, index) => (
              <MusicEntry index={index} key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="creative-reflection">
        <Container className="creative-reflection-inner">
          <Leaf aria-hidden size={28} strokeWidth={1.25} />
          <p>{creativeProfile.reflection}</p>
          <span>Mock field journal / Spring edition</span>
        </Container>
      </section>
    </div>
  );
}
