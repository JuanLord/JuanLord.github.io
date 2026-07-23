import { ArrowLeft, CalendarDays, Images, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { EmbedPanel } from "../components/creative/EmbedPanel";
import { PhotoContactSheet } from "../components/creative/PhotoContactSheet";
import { Container } from "../components/ui/Container";
import { formatDateRange, getPhotoTripBySlug } from "../lib/content";

export function PhotoTripPage() {
  const { tripSlug = "" } = useParams();
  const trip = getPhotoTripBySlug(tripSlug);

  if (!trip) {
    return (
      <div className="creative-page">
        <CreativeSectionHeader
          backLabel="Photography folders"
          backTo="/creative/photography"
          eyebrow="Photography / Missing folder"
          introduction="The requested trip folder is not part of the current placeholder archive."
          title="Photo folder unavailable."
        />
        <CreativeSectionNav />
      </div>
    );
  }

  const collectionCount = trip.photos.length || trip.photoCount;

  return (
    <div className="creative-page">
      <CreativeSectionHeader
        backLabel="Photography folders"
        backTo="/creative/photography"
        eyebrow="Photography / Trip folder"
        introduction={trip.summary}
        title={trip.title}
      />
      <CreativeSectionNav />

      <section className="creative-trip-overview">
        <Container className="creative-trip-overview-inner">
          <dl className="creative-trip-facts">
            <div>
              <dt>
                <MapPin aria-hidden size={15} />
                Place
              </dt>
              <dd>{trip.location}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays aria-hidden size={15} />
                Date
              </dt>
              <dd>{formatDateRange(trip.startDate, trip.endDate)}</dd>
            </div>
            <div>
              <dt>
                <Images aria-hidden size={15} />
                Collection
              </dt>
              <dd>{collectionCount} photographs</dd>
            </div>
          </dl>
          <p>{trip.story}</p>
        </Container>
      </section>

      <section
        aria-labelledby="trip-contact-sheet-title"
        className="creative-contact-sheet-section"
      >
        <Container>
          <div className="creative-editorial-heading">
            <div>
              <p>Contact sheet</p>
              <h2 id="trip-contact-sheet-title">{trip.title}</h2>
            </div>
            <p>
              {trip.photos.length
                ? `${trip.photos.length} photographs`
                : `${trip.photoCount} planned photographs`}
            </p>
          </div>
          <PhotoContactSheet trip={trip} />
        </Container>
      </section>

      <section
        aria-labelledby="trip-soundtrack-title"
        className="creative-soundtrack-section"
      >
        <Container className="creative-soundtrack-inner">
          <div>
            <p>Listening companion</p>
            <h2 id="trip-soundtrack-title">Soundtrack for the folder.</h2>
          </div>
          <EmbedPanel embed={trip.soundtrack} />
        </Container>
      </section>

      <Container className="creative-page-return">
        <Link to="/creative/photography">
          <ArrowLeft aria-hidden size={16} />
          All photography folders
        </Link>
      </Container>
    </div>
  );
}
