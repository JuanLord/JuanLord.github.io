import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PhotoArchiveApp } from "./PhotoArchiveApp";
import "./styles/index.css";
import "./styles/photo-archive.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PhotoArchiveApp />
  </StrictMode>,
);
