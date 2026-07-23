# Creative Content and Media Guide

## Permanent Media Rule

This portfolio does not use AI-generated images. Photography, film stills,
artwork, and project covers must be original owner-provided media or media with
a documented license. Empty visual states remain visible until real files are
available.

## Creative Routes

```text
#/creative
#/creative/photography
#/creative/photography/:tripSlug
#/creative/travel
#/creative/travel/hikes/:hikeSlug
#/creative/projects
```

The Creative index links to three independent collections:

- Photography trip folders.
- Travel places, hikes, and the connected world map.
- Short films and music projects.

## Where Information Lives

```text
src/content/creative/
  profile.ts       Creative introduction and reflection
  photography.ts   Trip folders, photo manifests, and Spotify embeds
  travel.ts        Places, hikes, route points, and map links
  projects.ts      Film and music project records
```

These are typed TypeScript records. A malformed field, unsupported provider, or
missing required property fails `npm run typecheck` before deployment.

The website remains static and has no production database. Portfolio Studio is
a private local editor that writes these modules before they are committed.
Direct file editing is also supported. Run `npm run check` before pushing to
`main`; the GitHub Pages workflow publishes the verified build.

## Photography Storage

Photos can be served from `public/media/` during local development, and files
committed there are deployed with GitHub Pages. A live GitHub Pages site cannot
read files directly from an owner's laptop or desktop. Serving from the device
would require it to stay online as a public web server, so R2 is the preferred
home for the full archive.

Each `PhotoTrip` plans for 50-100 photos and includes:

- A stable URL slug.
- Location and date range.
- Summary and longer story.
- Planned photo count and preview count.
- Map coordinates in `[longitude, latitude]` order.
- An optional list of real photos.
- One Spotify soundtrack embed.

Optimized web files are stored in Cloudflare R2 by Portfolio Studio. The
repository can still hold a very small manually managed archive in:

```text
public/media/photography/<trip-slug>/
  full/
    001.webp
    002.webp
  thumb/
    001.webp
    002.webp
```

Keep camera originals, RAW files, HEIC files, and editing catalogs outside the
repository. Export web copies with:

- A full-size long edge around 2,000-2,400 pixels.
- A thumbnail long edge around 600-800 pixels.
- WebP or AVIF output, with JPEG as a compatibility fallback when needed.
- Embedded EXIF and GPS metadata removed.
- Meaningful filenames and alt text.

Example photo record:

```ts
{
  id: "coast-001",
  src: "/media/photography/pacific-coast-weekend/full/001.webp",
  thumbnailSrc: "/media/photography/pacific-coast-weekend/thumb/001.webp",
  alt: "Fog moving over a coastal headland at Point Reyes",
  caption: "The fog opened briefly above the western bluff.",
  date: "2025-07",
  width: 2400,
  height: 1600,
  status: "published",
}
```

GitHub recommends keeping Pages source repositories near or below 1 GB, and
Git LFS cannot serve a GitHub Pages site. Once the optimized photo archive
begins making the repository large, store web images in an image CDN or object
storage service and place the resulting HTTPS URLs in `src` and
`thumbnailSrc`. Cloudinary, ImageKit, or an object store with a CDN are
reasonable candidates; the final choice can wait until the first real photo
batch establishes actual storage needs.

Portfolio Studio performs local ingestion: it creates display and thumbnail
WebP derivatives, strips metadata, uploads them to R2, and updates the typed
photo manifest.

## Spotify Soundtracks

Every photography folder has a `soundtrack` field. Spotify supports tracks,
albums, artists, playlists, podcast episodes, and shows through its official
embed flow.

1. Open the item in Spotify.
2. Choose **Share > Embed**.
3. Copy the iframe `src` URL.
4. Add it to `soundtrack.embedUrl`.
5. Set `placeholder` to `false`.

Only `https://open.spotify.com` embed URLs are accepted by the component.
Without a trusted URL, the page renders a quiet "Embed pending" state.

## Places, Hikes, and Map Points

Place and hike records live in `travel.ts`.

- Coordinates always use `[longitude, latitude]`.
- A place can link to a photography folder, a hike, or both.
- World-map points link directly to the most specific related page.
- Hikes store distance, elevation gain, moving time, difficulty, and route
  points.
- The inline route preview is rendered from the stored coordinates.

For a real hike, export a GPX or GeoJSON route, simplify it for the web, and
replace the placeholder `route.points`. Remove the beginning or end of a route when it
could reveal a home address or another sensitive location.

Strava supports embeds for public activities and public routes. Use Strava's
own **Share > Embed** or route **Embed** flow, copy the current iframe URL into
`route.strava.embedUrl`, and set `placeholder` to `false`. Do not construct a
Strava embed URL manually. Private activities cannot be embedded.

## Film and Music Projects

Film and music records live in `projects.ts`. Each record includes:

- Project type: `short-film` or `music`.
- Description, role, year, and production tools.
- A typed media provider and optional trusted embed URL.

Supported hosts are:

- YouTube: `www.youtube.com` or `www.youtube-nocookie.com`
- Vimeo: `player.vimeo.com`
- Spotify: `open.spotify.com`
- SoundCloud: `w.soundcloud.com`

The iframe is created only when the URL uses HTTPS, matches the selected
provider, and `placeholder` is `false`.

## Additional Work Before Real Content

1. Select the first real trip and decide whether local GitHub storage is still
   sufficient after optimization.
2. Configure the bucket-scoped R2 token and a public media origin.
3. Supply owner-written captions, alt text, stories, and trip soundtracks.
4. Export sanitized hike routes and decide which Strava activities can be
   public.
5. Supply published film and music embed URLs.
6. Replace placeholder records incrementally and review privacy before each push.
7. Create a social preview from owner-provided photography or original artwork
   if an image-based link preview is desired later.

No hosted backend is required. Portfolio Studio runs only on the local machine,
while GitHub Pages serves the static site and R2 serves optimized media.
