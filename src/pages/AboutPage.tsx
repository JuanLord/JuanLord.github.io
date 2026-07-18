import { ArrowDownToLine, ArrowRight, MapPin } from "lucide-react";
import {
  certifications,
  education,
  experience,
  profile,
  skills,
} from "../content";
import { ActionLink } from "../components/ui/ActionLink";
import { Container } from "../components/ui/Container";
import { MockBadge } from "../components/ui/MockBadge";
import { PageIntro } from "../components/ui/PageIntro";
import { PlaceholderAction } from "../components/ui/PlaceholderAction";
import { formatDateRange } from "../lib/content";

export function AboutPage() {
  return (
    <>
      <PageIntro
        actions={
          <>
            <PlaceholderAction icon={ArrowDownToLine}>
              Download resume
            </PlaceholderAction>
            <ActionLink icon={ArrowRight} to="/contact">
              Contact
            </ActionLink>
          </>
        }
        eyebrow="Profile"
        index="01"
        title="About & Experience"
      >
        <div className="about-summary">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="profile-location">
          <MapPin aria-hidden size={15} />
          {profile.location}
          <span aria-hidden>·</span>
          {profile.availability}
        </div>
        <p className="placeholder-action-note" id="placeholder-action-note">
          Resume and professional details are currently represented by mock
          content.
        </p>
      </PageIntro>

      <section className="profile-section" aria-labelledby="experience-title">
        <Container className="profile-section-layout">
          <div className="profile-section-heading">
            <p className="section-index">01.1 / Timeline</p>
            <h2 id="experience-title">Experience</h2>
            <MockBadge />
          </div>

          <ol className="experience-list">
            {experience.map((item, index) => (
              <li className="experience-item" key={item.id}>
                <div className="experience-rail" aria-hidden>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <article>
                  <div className="experience-meta">
                    <span>{formatDateRange(item.startDate, item.endDate)}</span>
                    <span>{item.location}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p className="experience-organization">{item.organization}</p>
                  <p className="experience-summary">{item.summary}</p>
                  <ul className="experience-highlights">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="profile-section profile-section-carbon">
        <Container className="credentials-layout">
          <div className="credential-group" aria-labelledby="education-title">
            <div className="credential-heading">
              <p className="section-index">01.2 / Foundation</p>
              <h2 id="education-title">Education</h2>
            </div>
            <div className="credential-list">
              {education.map((item) => (
                <article className="credential-row" key={item.id}>
                  <div>
                    <h3>
                      {item.credential}, {item.field}
                    </h3>
                    <p>{item.institution}</p>
                  </div>
                  <span>
                    {item.startYear} - {item.endYear}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div
            className="credential-group"
            aria-labelledby="certifications-title"
          >
            <div className="credential-heading">
              <p className="section-index">01.3 / Credentials</p>
              <h2 id="certifications-title">Certifications</h2>
            </div>
            <div className="credential-list">
              {certifications.map((item) => (
                <article className="credential-row" key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.issuer}</p>
                  </div>
                  <span>{item.year}</span>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="profile-section" aria-labelledby="skills-title">
        <Container className="profile-section-layout">
          <div className="profile-section-heading">
            <p className="section-index">01.4 / Toolkit</p>
            <h2 id="skills-title">Capabilities</h2>
          </div>

          <div className="skills-matrix">
            {skills.map((group, index) => (
              <div className="skill-group" key={group.id}>
                <div className="skill-group-label">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.label}</h3>
                </div>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="profile-cta">
        <Container className="profile-cta-inner">
          <div>
            <p className="section-index">Next / Connect</p>
            <h2>Let&apos;s build something considered.</h2>
          </div>
          <div className="profile-cta-actions">
            <PlaceholderAction icon={ArrowDownToLine}>
              Download resume
            </PlaceholderAction>
            <ActionLink icon={ArrowRight} to="/contact" variant="primary">
              Start a conversation
            </ActionLink>
          </div>
        </Container>
      </section>
    </>
  );
}
