import { CreativeProjectCard } from "../components/creative/CreativeProjectCard";
import { CreativeSectionHeader } from "../components/creative/CreativeSectionHeader";
import { CreativeSectionNav } from "../components/creative/CreativeSectionNav";
import { Container } from "../components/ui/Container";
import { creativeProjects } from "../content";

export function CreativeProjectsPage() {
  const films = creativeProjects.filter(
    (project) => project.kind === "short-film",
  );
  const music = creativeProjects.filter((project) => project.kind === "music");

  return (
    <div className="creative-page">
      <CreativeSectionHeader
        backTo="/creative"
        eyebrow="03 / Film & music"
        introduction="Original short films, music projects, field recordings, and production notes live here with their native media players."
        title="Creative projects"
      />
      <CreativeSectionNav />

      <section
        aria-labelledby="short-films-title"
        className="creative-content-section creative-projects-section"
      >
        <Container>
          <div className="creative-editorial-heading">
            <div>
              <p>Moving image</p>
              <h2 id="short-films-title">Short films.</h2>
            </div>
            <p>
              Video embeds remain empty until original work is published on an
              approved platform.
            </p>
          </div>
          <div className="creative-project-grid">
            {films.map((project) => (
              <CreativeProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="music-projects-title"
        className="creative-content-section creative-music-projects-section"
      >
        <Container>
          <div className="creative-editorial-heading creative-editorial-heading-light">
            <div>
              <p>Sound work</p>
              <h2 id="music-projects-title">Music projects.</h2>
            </div>
            <p>
              Finished tracks can use Spotify or SoundCloud while project notes
              remain part of the portfolio itself.
            </p>
          </div>
          <div className="creative-project-grid">
            {music.map((project) => (
              <CreativeProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
