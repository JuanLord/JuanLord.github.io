import { ArrowUpRight, Camera, Film, Leaf, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { Container } from "../components/ui/Container";
import {
  creativeProfile,
  creativeProjects,
  hikes,
  photoTrips,
  places,
} from "../content";

const publishedPhotoTrips = photoTrips.filter(
  ({ status }) => status === "published",
);
const publishedPlaces = places.filter(({ status }) => status === "published");
const publishedHikes = hikes.filter(({ status }) => status === "published");
const publishedCreativeProjects = creativeProjects.filter(
  ({ status }) => status === "published",
);

const creativeChapters = [
  {
    index: "01",
    title: "Photography",
    description:
      "Trip folders built for complete image collections, captions, stories, named locations, and listening companions.",
    to: "/creative/photography",
    icon: Camera,
    detail: `${publishedPhotoTrips.length} trip folders`,
  },
  {
    index: "02",
    title: "Travel & hiking",
    description:
      "A connected atlas of places, trail records, route geometry, and optional public Strava embeds.",
    to: "/creative/travel",
    icon: Map,
    detail: `${publishedPlaces.length} places / ${publishedHikes.length} hikes`,
  },
  {
    index: "03",
    title: "Film & music",
    description:
      "Short films, sound studies, and music projects with room for their original media players.",
    to: "/creative/projects",
    icon: Film,
    detail: `${publishedCreativeProjects.length} projects`,
  },
] as const;

export function CreativePage() {
  return (
    <div className="creative-page">
      <CreativeSectionHeader
        eyebrow={creativeProfile.eyebrow}
        introduction={creativeProfile.introduction}
        title={creativeProfile.title}
      />
      <CreativeSectionNav />

      <section className="creative-hub-main">
        <Container>
          <div className="creative-hub-heading">
            <p>Three collections</p>
            <h2>Choose a field of view.</h2>
          </div>

          <div className="creative-chapter-grid">
            {creativeChapters.map(
              ({ description, detail, icon: Icon, index, title, to }) => (
                <article className="creative-chapter-card" key={to}>
                  <div className="creative-chapter-card-top">
                    <span>{index}</span>
                    <Icon aria-hidden size={24} strokeWidth={1.4} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="creative-chapter-card-footer">
                    <small>{detail}</small>
                    <Link aria-label={`Open ${title}`} to={to}>
                      <ArrowUpRight aria-hidden size={19} />
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      <section className="creative-reflection">
        <Container className="creative-reflection-inner">
          <Leaf aria-hidden size={28} strokeWidth={1.25} />
          <p>{creativeProfile.reflection}</p>
          <span>Field journal / owner-created media</span>
        </Container>
      </section>
    </div>
  );
}
