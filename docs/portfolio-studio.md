# Portfolio Studio

Portfolio Studio is the private, local-only content manager for the creative
archive. It is intentionally separate from the GitHub Pages production bundle.
R2 credentials are read by a server bound to `127.0.0.1` and are never sent to
the browser or committed to Git.

## Run the Studio

```bash
npm install
npm run studio
```

Open `http://127.0.0.1:4174/`.

Local drafts are saved to `.portfolio-studio/content.json`. This directory is
ignored by Git. Selecting **Publish source** writes validated records to the
typed modules in `src/content/creative/`; it does not commit or push them.
Records and photographs marked `draft` remain in the local Studio document and
are excluded from the generated public source.

## Cloudflare R2 Setup

Signing into Cloudflare with GitHub authenticates the Cloudflare dashboard, but
it does not grant local applications access to R2. The Studio needs a separate,
bucket-scoped R2 API token.

1. In the Cloudflare dashboard, open **R2 Object Storage**.
2. Create a Standard bucket named `juanlord-portfolio-media`.
3. Under **Account Details**, select **Manage** beside API Tokens.
4. Create an account or user API token with **Object Read & Write** permission.
5. Scope the token to `juanlord-portfolio-media` only.
6. Copy the Access Key ID and Secret Access Key immediately. Cloudflare does not
   show the secret again.
7. Open the bucket's **Settings** page.
8. For initial testing, enable its `r2.dev` Public Development URL. This URL is
   rate-limited and is not intended for production.
9. Copy `.env.studio.example` to `.env.studio.local` and fill in all values:

```dotenv
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=juanlord-portfolio-media
R2_PUBLIC_BASE_URL=https://your-bucket-id.r2.dev
```

10. Restart `npm run studio`. The sidebar and Storage page should show the R2
    bucket as connected.

Cloudflare references:

- [R2 authentication and API tokens](https://developers.cloudflare.com/r2/api/tokens/)
- [Public buckets and development URLs](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)

For production, connect a domain such as `media.your-domain.com` to R2 and set
that HTTPS origin as `R2_PUBLIC_BASE_URL`. The `r2.dev` URL is suitable while the
site is still being assembled.

## Photography Workflow

1. Create or select a trip.
2. Enter the title, location, country, dates, coordinates, summary, and story.
3. Paste a public Spotify track, album, or playlist URL.
4. Select photographs in the R2 media section.
5. Add meaningful alt text, captions, and dates.
6. Reorder the contact sheet and change the content status.
7. Resolve validation errors, preview the public site, and publish the source.

The upload endpoint accepts JPEG, PNG, WebP, HEIC, and HEIF files up to 35 MB.
Sharp rotates from source orientation, removes embedded metadata, and creates:

- A display WebP with a maximum 2200px edge at quality 82.
- A thumbnail WebP with a maximum 720px edge at quality 76.

Only these derivatives are uploaded. Keep original and RAW files in a separate
personal backup. Deleting an uploaded photograph from the Studio also deletes
both R2 derivatives.

## Places, Hikes, And Routes

Place records hold map coordinates and optional links to photo trips and hikes.
The world map is regenerated from photography and hike records during source
publication.

Hike records support manual distance, elevation, time, difficulty, and location
data. A GPX file can be imported locally; long tracks are reduced to at most 500
route points for the public bundle. The Studio does not upload the original GPX
file. Review its starting point before publication to avoid revealing a home or
other sensitive location.

Paste a public Strava activity or route URL when an embed is wanted. Private
activities cannot be displayed publicly.

## Creative Projects

Short films support YouTube and Vimeo. Music projects support Spotify and
SoundCloud. The Studio converts recognized HTTPS source URLs into the existing
allowlisted embed format. Unrecognized URLs remain placeholders and generate a
warning.

## Publish And Deploy

After selecting **Publish source**, review and test the generated source:

```bash
npm run check
npm run dev
```

The normal Git commit and push workflow then triggers the existing GitHub Pages
deployment. R2 media remains outside the repository while its URLs and metadata
remain versioned with the site content.
