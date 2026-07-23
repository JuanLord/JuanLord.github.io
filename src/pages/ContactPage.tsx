import {
  ArrowUpRight,
  BriefcaseBusiness,
  CodeXml,
  Mail,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "../content";
import { Container } from "../components/ui/Container";
import { PlaceholderBadge } from "../components/ui/PlaceholderBadge";
import { PageIntro } from "../components/ui/PageIntro";
import type { ExternalLink } from "../types/content";

const contactMethods: {
  description: string;
  icon: LucideIcon;
  link: ExternalLink;
}[] = [
  {
    description: "Code, experiments, and public repositories.",
    icon: CodeXml,
    link: profile.github,
  },
  {
    description: "Professional background and connections.",
    icon: BriefcaseBusiness,
    link: profile.linkedin,
  },
  {
    description: "Direct project and opportunity inquiries.",
    icon: Mail,
    link: profile.email,
  },
];

export function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Start a conversation" index="04" title="Contact">
        <p>
          I&apos;m interested in thoughtful engineering work, useful software,
          and teams that value curiosity, clear communication, and steady
          iteration.
        </p>
        <div className="profile-location">
          <MapPin aria-hidden size={15} />
          {profile.location}
          <span aria-hidden>·</span>
          {profile.availability}
        </div>
      </PageIntro>

      <section className="contact-section" aria-labelledby="contact-title">
        <Container className="contact-layout">
          <div className="contact-heading">
            <p className="section-index">04.1 / Channels</p>
            <h2 id="contact-title">Find me online</h2>
            <p>
              Placeholder channels stay disabled until final contact details are
              supplied.
            </p>
            <PlaceholderBadge />
          </div>

          <div className="contact-methods">
            {contactMethods.map(({ description, icon: Icon, link }, index) =>
              link.placeholder ? (
                <div
                  aria-disabled="true"
                  className="contact-method contact-method-disabled"
                  key={link.label}
                >
                  <div className="contact-method-icon" aria-hidden>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="contact-method-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{link.label}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="contact-method-state">Placeholder</span>
                </div>
              ) : (
                <a
                  className="contact-method"
                  href={link.href}
                  key={link.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="contact-method-icon" aria-hidden>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="contact-method-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{link.label}</h3>
                    <p>{description}</p>
                  </div>
                  <ArrowUpRight aria-hidden size={19} />
                </a>
              ),
            )}
          </div>
        </Container>
      </section>

      <section className="contact-note">
        <Container className="contact-note-inner">
          <p className="section-index">04.2 / Good context</p>
          <p>
            A useful first message can include the role or project, the problem
            being worked on, and where you think my experience could contribute.
          </p>
        </Container>
      </section>
    </>
  );
}
