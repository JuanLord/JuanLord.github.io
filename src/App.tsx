import { HashRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CreativePage } from "./pages/CreativePage";
import { CreativeProjectsPage } from "./pages/CreativeProjectsPage";
import { HikeDetailPage } from "./pages/HikeDetailPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PhotographyPage } from "./pages/PhotographyPage";
import { PhotoTripPage } from "./pages/PhotoTripPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TravelPage } from "./pages/TravelPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="creative" element={<CreativePage />} />
          <Route path="creative/photography" element={<PhotographyPage />} />
          <Route
            path="creative/photography/:tripSlug"
            element={<PhotoTripPage />}
          />
          <Route path="creative/travel" element={<TravelPage />} />
          <Route
            path="creative/travel/hikes/:hikeSlug"
            element={<HikeDetailPage />}
          />
          <Route path="creative/projects" element={<CreativeProjectsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
