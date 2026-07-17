import { BriefcaseBusiness, CodeXml, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "../../content";
import type { ExternalLink } from "../../types/content";
import { Container } from "../ui/Container";

const socialItems: { icon: LucideIcon; link: ExternalLink }[] = [
  { icon: CodeXml, link: profile.github },
  { icon: BriefcaseBusiness, link: profile.linkedin },
  { icon: Mail, link: profile.email },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="footer-note">
            Built with care. Content marked as mock will be replaced.
          </p>
        </div>

        <div className="footer-links" aria-label="Profile links">
          {socialItems.map(({ icon: Icon, link }) =>
            link.placeholder ? (
              <span
                aria-disabled="true"
                className="footer-link footer-link-disabled"
                key={link.label}
                title={`${link.label} placeholder`}
              >
                <Icon aria-hidden size={18} />
                <span className="sr-only">{link.label} placeholder</span>
              </span>
            ) : (
              <a
                aria-label={link.label}
                className="footer-link"
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
                title={link.label}
              >
                <Icon aria-hidden size={18} />
              </a>
            ),
          )}
        </div>

        <p className="footer-meta">
          <span className="footer-pulse" aria-hidden="true" />
          System v0.1
        </p>
      </Container>
    </footer>
  );
}
