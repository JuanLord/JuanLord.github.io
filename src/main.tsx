const isPhotographyPath =
  window.location.pathname === "/photos" ||
  window.location.pathname.startsWith("/photos/");

if (import.meta.env.VITE_PHOTOS_SITE === "1" || isPhotographyPath) {
  void import("./photos-main");
} else {
  void import("./portfolio-main");
}
