import { HashRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ModulePreviewPage } from "./pages/ModulePreviewPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const modulePages = [
  {
    path: "projects",
    index: "02",
    eyebrow: "Selected work",
    title: "Engineering & Software",
    description:
      "Case studies across physical systems and software, organized around decisions, implementation, and outcomes.",
  },
  {
    path: "creative",
    index: "03",
    eyebrow: "Beyond the desk",
    title: "Creative Fieldwork",
    description:
      "Photography, travel, hiking, and music collected as a separate but connected part of the portfolio.",
  },
] as const;

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          {modulePages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<ModulePreviewPage {...page} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
