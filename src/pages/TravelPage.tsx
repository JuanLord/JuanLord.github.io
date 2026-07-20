import { ArrowUpRight, Camera, Footprints, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { HikeCard } from "../components/creative/HikeCard";
import { Container } from "../components/ui/Container";
import { creativeMapPoints, hikes, places } from "../content";
import { formatYearMonth } from "../lib/content";

const WorldMap = lazy(() =>
  import("../components/creative/WorldMap").then((module) => ({
    default: module.WorldMap,
  })),
);

export function TravelPage() {
  return (
    <div className="creative-page">
      <CreativeSectionHeader
        backTo="/creative"
        eyebrow="02 / Travel & hiking"
        introduction="Places, routes, and trip folders share one atlas so a location can lead naturally to photographs or trail detail."
        title="Field atlas"
      />
      <CreativeSectionNav />

      <section className="creative-map-section">
        <Container>
          <Suspense
            fallback={
              <div className="creative-map-loading" role="status">
                Preparing map
              </div>
            }
          >
            <WorldMap points={creativeMapPoints} />
          </Suspense>
        </Container>
      </section>

      <section
        aria-labelledby="places-title"
        className="creative-content-section creative-places-section"
      >
        <Container>
          <div className="creative-editorial-heading">
            <div>
              <p>Places visited</p>
              <h2 id="places-title">A record of place.</h2>
            </div>
            <p>
              Each card can connect to a related photography folder, hike
              record, or both.
            </p>
          </div>

          <div className="creative-place-grid">
            {places.map((place, index) => (
              <article className="creative-place-card" key={place.slug}>
                <div className="creative-place-card-index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <MapPin aria-hidden size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p>
                    {place.kind} / {place.country}
                  </p>
                  <h3>{place.title}</h3>
                  <time dateTime={place.visited}>
                    {formatYearMonth(place.visited)}
                  </time>
                  <p>{place.summary}</p>
                </div>
                <div className="creative-place-links">
                  {place.relatedPhotoTripSlug ? (
                    <Link
                      to={`/creative/photography/${place.relatedPhotoTripSlug}`}
                    >
                      <Camera aria-hidden size={16} />
                      Photo folder
                      <ArrowUpRight aria-hidden size={15} />
                    </Link>
                  ) : null}
                  {place.relatedHikeSlug ? (
                    <Link
                      to={`/creative/travel/hikes/${place.relatedHikeSlug}`}
                    >
                      <Footprints aria-hidden size={16} />
                      Hike details
                      <ArrowUpRight aria-hidden size={15} />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="hikes-title" className="creative-hikes-section">
        <Container>
          <div className="creative-editorial-heading creative-editorial-heading-light">
            <div>
              <p>Trail records</p>
              <h2 id="hikes-title">Routes underfoot.</h2>
            </div>
            <p>
              Distance, gain, moving time, route geometry, and an optional
              public Strava activity live together.
            </p>
          </div>
          <div className="hike-card-list">
            {hikes.map((hike, index) => (
              <HikeCard hike={hike} index={index} key={hike.slug} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
