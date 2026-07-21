import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FolderLock,
} from "lucide-react";
import type { StorageStatus } from "../types";

export function SettingsPage({ storage }: { storage: StorageStatus }) {
  return (
    <section className="settings-page">
      <header className="page-heading">
        <div>
          <p>Local configuration</p>
          <h1>Storage</h1>
        </div>
      </header>

      <section className="settings-section">
        <div className="section-heading">
          <div>
            <p>Cloudflare</p>
            <h2>R2 connection</h2>
          </div>
          <span
            className={
              storage.configured ? "health-count" : "health-count error"
            }
          >
            {storage.configured ? "Connected" : "Setup required"}
          </span>
        </div>

        {storage.configured ? (
          <div className="connection-ready">
            <CheckCircle2 size={20} aria-hidden="true" />
            <div>
              <strong>{storage.bucketName}</strong>
              <span>{storage.publicBaseUrl}</span>
            </div>
          </div>
        ) : (
          <div className="connection-missing">
            <CircleAlert size={20} aria-hidden="true" />
            <div>
              <strong>Missing environment values</strong>
              <code>{storage.missing.join("\n")}</code>
            </div>
          </div>
        )}

        <ol className="setup-steps">
          <li>
            <span>01</span>
            <div>
              <strong>Create an R2 bucket</strong>
              <p>
                Use a name such as <code>juanlord-portfolio-media</code>.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Create a bucket-scoped API token</strong>
              <p>Grant Object Read and Write access to this bucket only.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Enable public media access</strong>
              <p>Use an R2 public development URL or a custom media domain.</p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <strong>Add local credentials</strong>
              <p>
                Copy <code>.env.studio.example</code> to{" "}
                <code>.env.studio.local</code>, fill it in, and restart the
                Studio.
              </p>
            </div>
          </li>
        </ol>

        <a
          className="button button-secondary docs-link"
          href="https://developers.cloudflare.com/r2/get-started/"
          target="_blank"
          rel="noreferrer"
        >
          Cloudflare R2 setup
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </section>

      <section className="settings-section privacy-section">
        <FolderLock size={22} aria-hidden="true" />
        <div>
          <h2>Media handling</h2>
          <p>
            Original files remain in your private archive. Uploads create a
            2200px display image and a 720px thumbnail, convert both to WebP,
            and remove embedded metadata before R2 storage.
          </p>
        </div>
      </section>
    </section>
  );
}
