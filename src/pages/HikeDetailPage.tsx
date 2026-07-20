import { ArrowLeft, Clock3, Gauge, MapPin, Mountain } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { EmbedPanel } from "../components/creative/EmbedPanel";
import { RoutePreview } from "../components/creative/RoutePreview";
import { Container } from "../components/ui/Container";
import { formatYearMonth, getHikeBySlug } from "../lib/content";

export function HikeDetailPage() {
  const { hikeSlug = "" } = useParams();
  const hike = getHikeBySlug(hikeSlug);

  if (!hike) {
    return (
      <div className="creative-page">
        <CreativeSectionHeader
          backLabel="Travel & hiking"
          backTo="/creative/travel"
          eyebrow="Trail record / Missing route"
          introduction="The requested trail record is not part of the current mock atlas."
          title="Hike unavailable."
        />
        <CreativeSectionNav />
      </div>
    );
  }

  return (
    <div className="creative-page">
      <CreativeSectionHeader
        backLabel="Travel & hiking"
        backTo="/creative/travel"
        eyebrow={`Trail record / ${formatYearMonth(hike.date)}`}
        introduction={hike.summary}
        title={hike.trail}
      />
      <CreativeSectionNav />

      <section className="hike-detail-section">
        <Container className="hike-detail-grid">
          <div className="hike-detail-route">
            <RoutePreview label={hike.trail} route={hike.route} />
            <span>Mock route geometry</span>
          </div>
          <dl className="hike-detail-facts">
            <div>
              <dt>
                <MapPin aria-hidden size={16} />
                Location
              </dt>
              <dd>{hike.location}</dd>
            </div>
            <div>
              <dt>
                <Gauge aria-hidden size={16} />
                Distance
              </dt>
              <dd>{hike.distanceMiles} miles</dd>
            </div>
            <div>
              <dt>
                <Mountain aria-hidden size={16} />
                Elevation gain
              </dt>
              <dd>{hike.elevationFeet.toLocaleString()} feet</dd>
            </div>
            <div>
              <dt>
                <Clock3 aria-hidden size={16} />
                Moving time
              </dt>
              <dd>{hike.movingHours} hours</dd>
            </div>
          </dl>
        </Container>
      </section>

      <section
        aria-labelledby="strava-route-title"
        className="creative-strava-section"
      >
        <Container className="creative-strava-inner">
          <div>
            <p>Activity record</p>
            <h2 id="strava-route-title">Route and elevation.</h2>
            <p>
              A public Strava activity or route can occupy this space when its
              official embed is available.
            </p>
          </div>
          <EmbedPanel embed={hike.route.strava} />
        </Container>
      </section>

      {hike.relatedPhotoTripSlug ? (
        <section className="hike-related-folder">
          <Container>
            <p>Related photography</p>
            <Link
              className="creative-text-link"
              to={`/creative/photography/${hike.relatedPhotoTripSlug}`}
            >
              Open the connected trip folder
            </Link>
          </Container>
        </section>
      ) : null}

      <Container className="creative-page-return">
        <Link to="/creative/travel">
          <ArrowLeft aria-hidden size={16} />
          Travel and hiking index
        </Link>
      </Container>
    </div>
  );
}
