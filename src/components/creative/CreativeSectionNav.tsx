import { Camera, Film, Map } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Container } from "../ui/Container";

const creativeNavigation = [
  {
    label: "Photography",
    to: "/photos/",
    external: true,
    icon: Camera,
  },
  {
    label: "Travel & hiking",
    to: "/creative/travel",
    external: false,
    icon: Map,
  },
  {
    label: "Film & music",
    to: "/creative/projects",
    external: false,
    icon: Film,
  },
] as const;

export function CreativeSectionNav() {
  return (
    <nav aria-label="Creative sections" className="creative-section-nav">
      <Container className="creative-section-nav-inner">
        {creativeNavigation.map(
          ({ external, icon: Icon, label, to }, index) => {
            const content = (
              <>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden size={17} strokeWidth={1.6} />
                {label}
              </>
            );

            return external ? (
              <a className="creative-section-nav-link" href={to} key={to}>
                {content}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  `creative-section-nav-link${isActive ? " creative-section-nav-link-active" : ""}`
                }
                key={to}
                to={to}
              >
                {content}
              </NavLink>
            );
          },
        )}
      </Container>
    </nav>
  );
}
