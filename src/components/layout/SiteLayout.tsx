import { Outlet } from "react-router-dom";
import { DocumentMetadata } from "./DocumentMetadata";
import { ScrollToTop } from "./ScrollToTop";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteLayout() {
  const focusMainContent = () => {
    document.getElementById("main-content")?.focus();
  };

  return (
    <div className="site-frame">
      <DocumentMetadata />
      <ScrollToTop />
      <button className="skip-link" type="button" onClick={focusMainContent}>
        Skip to content
      </button>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
