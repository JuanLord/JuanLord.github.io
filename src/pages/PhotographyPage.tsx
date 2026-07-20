import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { PhotoTripCard } from "../components/creative/PhotoTripCard";
import { Container } from "../components/ui/Container";
import { photoTrips } from "../content";

export function PhotographyPage() {
  return (
    <div className="creative-page">
      <CreativeSectionHeader
        backTo="/creative"
        eyebrow="01 / Photography"
        introduction="Each trip is a self-contained folder with a complete contact sheet, trip notes, location context, and one Spotify listening companion."
        title="Trip folders"
      />
      <CreativeSectionNav />

      <section
        aria-labelledby="photo-folders-title"
        className="creative-content-section creative-photo-folders"
      >
        <Container>
          <div className="creative-editorial-heading">
            <div>
              <p>Archive</p>
              <h2 id="photo-folders-title">Collections by journey.</h2>
            </div>
            <p>
              The mock counts demonstrate the intended scale. Real images will
              appear only after owner-provided files are added.
            </p>
          </div>

          <div className="photo-trip-list">
            {photoTrips.map((trip, index) => (
              <PhotoTripCard index={index} key={trip.slug} trip={trip} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
