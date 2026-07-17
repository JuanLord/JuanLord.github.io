import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container } from "../ui/Container";

const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Creative", to: "/creative" },
  { label: "Contact", to: "/contact" },
];

function navClassName({ isActive }: { isActive: boolean }) {
  return `nav-link${isActive ? " nav-link-active" : ""}`;
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="site-header">
      <Container className="header-inner">
        <NavLink
          aria-label="Juan Varela, home"
          className="brand-mark"
          onClick={() => setIsOpen(false)}
          to="/"
        >
          <span aria-hidden="true" className="brand-bracket">
            [
          </span>
          JV
          <span aria-hidden="true" className="brand-cursor">
            _
          </span>
          <span aria-hidden="true" className="brand-bracket">
            ]
          </span>
        </NavLink>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.map((item) => (
            <NavLink className={navClassName} key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-status" aria-label="Current availability">
          <span aria-hidden="true" className="status-dot" />
          Available
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className="icon-button menu-button"
          onClick={() => setIsOpen((current) => !current)}
          title={isOpen ? "Close navigation" : "Open navigation"}
          type="button"
        >
          {isOpen ? (
            <X aria-hidden size={20} />
          ) : (
            <Menu aria-hidden size={20} />
          )}
        </button>
      </Container>

      {isOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="mobile-nav"
          id="mobile-navigation"
        >
          <Container className="mobile-nav-inner">
            {navigation.map((item, index) => (
              <NavLink
                className={navClassName}
                key={item.to}
                onClick={() => setIsOpen(false)}
                to={item.to}
              >
                <span className="mobile-nav-index">
                  {String(index).padStart(2, "0")}
                </span>
                {item.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
