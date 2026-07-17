import { HashRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { HomeFoundationPage } from "./pages/HomeFoundationPage";
import { ModulePreviewPage } from "./pages/ModulePreviewPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const modulePages = [
  {
    path: "about",
    index: "01",
    eyebrow: "Profile",
    title: "About & Experience",
    description:
      "A structured view of experience, education, certifications, and the technical perspective behind the work.",
  },
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
  {
    path: "contact",
    index: "04",
    eyebrow: "Start a conversation",
    title: "Contact",
    description:
      "Direct ways to discuss engineering roles, software projects, and thoughtful collaborations.",
  },
] as const;

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomeFoundationPage />} />
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
