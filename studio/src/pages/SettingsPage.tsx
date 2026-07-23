import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FolderLock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { refreshStorageUsage } from "../lib/studio";
import type { StorageStatus } from "../types";

interface SettingsPageProps {
  storage: StorageStatus;
  onStorageChange: (storage: StorageStatus) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function SettingsPage({ storage, onStorageChange }: SettingsPageProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const usage = storage.usage;

  const refreshUsage = async () => {
    setRefreshing(true);
    setMessage("");
    try {
      const nextUsage = await refreshStorageUsage();
      onStorageChange({ ...storage, usage: nextUsage });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Usage refresh failed.",
      );
    } finally {
      setRefreshing(false);
    }
  };

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

      <section className="settings-section">
        <div className="section-heading">
          <div>
            <p>Local guardrails</p>
            <h2>Free-tier headroom</h2>
          </div>
          <button
            className="button button-secondary"
            type="button"
            disabled={!storage.configured || refreshing}
            onClick={() => void refreshUsage()}
          >
            <RefreshCw
              className={refreshing ? "spin" : undefined}
              size={15}
              aria-hidden="true"
            />
            Refresh usage
          </button>
        </div>

        {usage ? (
          <div className="usage-grid">
            <div className="usage-meter">
              <div>
                <strong>Stored media</strong>
                <span>
                  {formatBytes(usage.storageBytes)} /{" "}
                  {formatBytes(usage.maxStorageBytes)}
                </span>
              </div>
              <progress
                value={usage.storageBytes}
                max={usage.maxStorageBytes}
                aria-label="R2 storage usage"
              />
            </div>
            <div className="usage-meter">
              <div>
                <strong>Class A operations</strong>
                <span>
                  {usage.classAOperations.toLocaleString()} /{" "}
                  {usage.maxClassAOperations.toLocaleString()}
                </span>
              </div>
              <progress
                value={usage.classAOperations}
                max={usage.maxClassAOperations}
                aria-label="R2 Class A operations"
              />
            </div>
          </div>
        ) : null}

        <div className="guardrail-note">
          <ShieldCheck size={20} aria-hidden="true" />
          <div>
            <strong>Uploads stop before the configured limits</strong>
            <p>
              The Studio checks bucket size before every photo upload and
              locally counts its R2 writes and listings for{" "}
              {usage?.month || "the current month"}. Public reads cannot be
              hard-capped by this local tool.
            </p>
          </div>
        </div>
        {usage?.measuredAt ? (
          <p className="usage-timestamp">
            Storage measured {new Date(usage.measuredAt).toLocaleString()}.
          </p>
        ) : null}
        {message ? (
          <p className="inline-message" role="status">
            {message}
          </p>
        ) : null}
        <p className="settings-caveat">
          Cloudflare budget alerts notify you after usage is recorded; they do
          not stop service or charges. Keep a billing alert enabled in the
          Cloudflare dashboard as a second line of notice.
        </p>
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
