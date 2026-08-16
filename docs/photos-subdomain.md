# Photography Site

The photography site is part of the existing portfolio deployment at:

```text
https://juanvarela.dev/photos/
```

Vite builds `photos/index.html` as a second page inside `dist/`. The existing
GitHub Pages workflow uploads that directory, so a normal push to `main`
publishes both the portfolio and the photography site without another hosting
account or DNS change.

For local development, open:

```text
http://localhost:5173/photos/
```

An optional dedicated build mode remains available if
`photos.juanvarela.dev` is connected to a second host later:

```bash
npm run build:photos
```

The dedicated static artifact is written to `dist-photos/`. In this mode the
photography site owns the root hash route, so the public URL is:

```text
https://photos.juanvarela.dev/#/
```

Trip folders use `https://photos.juanvarela.dev/#/<trip-slug>`.

This build intentionally excludes the main portfolio's `public/CNAME`
file, manifest, resume, and discovery files so it cannot accidentally claim the
apex domain when uploaded to a second host.

## Optional subdomain hosting

The main portfolio currently uses GitHub Pages with `juanvarela.dev` as its
custom domain. GitHub Pages does not support using both an apex domain and a
custom subdomain on the same Pages site, except for the paired `www` redirect.
The photo build therefore needs its own static hosting project or its own
GitHub Pages repository.

Recommended deployment settings for a second static host:

```text
Build command: npm ci && npm run build:photos
Output directory: dist-photos
Custom domain: photos.juanvarela.dev
```

At the DNS provider, connect only the `photos` record to that second host. Keep
the existing apex records for `juanvarela.dev` unchanged. Verify the apex
domain in GitHub account Pages settings before adding subdomain DNS records to
reduce domain-takeover risk.

GitHub's current domain constraints are documented at:

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

## Uploading more photography

The photography site reads the existing typed records in
`src/content/creative/photography.ts`. Publishing a new photo, folder,
location, or trusted Spotify companion through Portfolio Studio updates both
the portfolio and `/photos/` automatically. The established workflow remains:

1. Run `npm run studio`.
2. Upload photographs into a trip folder; Studio optimizes them, strips
   metadata, and uploads the derivatives to R2.
3. Select **Prepare site update** to write the public content files.
4. Commit and push the generated content update. GitHub Pages rebuilds both
   pages.

The photo wall uses owner-hosted thumbnails for browsing and owner-hosted
display files in the lightbox. No media is copied into the build artifact.
