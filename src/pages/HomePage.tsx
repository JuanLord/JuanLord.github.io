import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import { motion } from "framer-motion";
import { experience, profile, projects } from "../content";
import { ActionLink } from "../components/ui/ActionLink";
import { Container } from "../components/ui/Container";
import { MockBadge } from "../components/ui/MockBadge";
import { formatDateRange } from "../lib/content";

const systemProfile = [
  { label: "Focus", value: "Software + physical systems" },
  { label: "Location", value: profile.location },
  { label: "Status", value: profile.availability },
];

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Container className="hero-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="hero-kicker">
              <span className="hero-kicker-icon" aria-hidden>
                <Terminal size={15} />
              </span>
              {profile.role}
            </div>
            <h1>{profile.name}</h1>
            <p className="hero-tagline">{profile.tagline}</p>
            <div className="hero-actions">
              <ActionLink icon={ArrowRight} to="/projects" variant="primary">
                View projects
              </ActionLink>
              <ActionLink icon={ArrowDownRight} to="/contact">
                Contact
              </ActionLink>
            </div>
          </motion.div>

          <motion.aside
            animate={{ opacity: 1, x: 0 }}
            aria-label="Profile summary"
            className="system-profile"
            initial={{ opacity: 0, x: 16 }}
            transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
          >
            <div className="system-profile-heading">
              <span>profile.config</span>
              <MockBadge />
            </div>
            <dl>
              {systemProfile.map((item, index) => (
                <div className="system-profile-row" key={item.label}>
                  <dt>
                    <span aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </Container>
      </section>

      <section
        className="project-signal"
        aria-labelledby="project-signal-title"
      >
        <Container className="project-signal-inner">
          <div className="project-signal-heading">
            <p className="section-index">00 / Featured signals</p>
            <h2 id="project-signal-title">Work in focus</h2>
          </div>
          <div className="project-signal-list">
            {projects
              .filter((project) => project.featured)
              .slice(0, 3)
              .map((project) => (
                <div className="project-signal-row" key={project.slug}>
                  <span
                    className={`project-type project-type-${project.category}`}
                  >
                    {project.category}
                  </span>
                  <span className="project-signal-title">{project.title}</span>
                  <span className="project-signal-year">{project.year}</span>
                </div>
              ))}
          </div>
        </Container>
      </section>

      <section className="home-profile" aria-labelledby="home-profile-title">
        <Container className="home-profile-layout">
          <div className="home-profile-copy">
            <p className="section-index">00.1 / Profile</p>
            <h2 id="home-profile-title">
              Systems thinking, from prototype to interface.
            </h2>
            <p>{profile.bio[0]}</p>
            <ActionLink icon={ArrowRight} to="/about">
              About & experience
            </ActionLink>
          </div>

          <div className="home-experience">
            <div className="home-experience-heading">
              <span>Recent trajectory</span>
              <span>{String(experience.length).padStart(2, "0")} records</span>
            </div>
            {experience.map((item) => (
              <div className="home-experience-row" key={item.id}>
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.organization}</p>
                </div>
                <span>{formatDateRange(item.startDate, item.endDate)}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="creative-teaser" aria-labelledby="creative-title">
        <Container className="creative-teaser-inner">
          <div>
            <p className="section-index">00.2 / Off-hours</p>
            <h2 id="creative-title">
              Field notes beyond engineering and code.
            </h2>
          </div>
          <p>
            Photography, trails, travel, and music provide another way to study
            systems, places, and the details people overlook.
          </p>
          <ActionLink icon={ArrowUpRight} to="/creative">
            Explore creative work
          </ActionLink>
        </Container>
      </section>
    </>
  );
}
