import { HashRouter, Route, Routes } from "react-router-dom";
import { PhotoArchiveLayout } from "./components/photos/PhotoArchiveLayout";
import { PhotoArchivePage } from "./pages/PhotoArchivePage";
import { PhotoArchiveTripPage } from "./pages/PhotoArchiveTripPage";

export function PhotoArchiveApp() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PhotoArchiveLayout />}>
          <Route index element={<PhotoArchivePage />} />
          <Route path=":tripSlug" element={<PhotoArchiveTripPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
