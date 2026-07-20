import {
  Activity,
  AudioLines,
  Film,
  Music2,
  Radio,
  type LucideIcon,
} from "lucide-react";
import type { CreativeEmbed, CreativeEmbedProvider } from "../../types/content";

interface EmbedPanelProps {
  embed: CreativeEmbed;
  compact?: boolean;
}

const providerLabels: Record<CreativeEmbedProvider, string> = {
  spotify: "Spotify",
  strava: "Strava",
  youtube: "YouTube",
  vimeo: "Vimeo",
  soundcloud: "SoundCloud",
};

const providerHosts: Record<CreativeEmbedProvider, string[]> = {
  spotify: ["open.spotify.com"],
  strava: ["strava-embeds.com"],
  youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
  vimeo: ["player.vimeo.com"],
  soundcloud: ["w.soundcloud.com"],
};

const providerIcons: Record<CreativeEmbedProvider, LucideIcon> = {
  spotify: Music2,
  strava: Activity,
  youtube: Film,
  vimeo: Film,
  soundcloud: Radio,
};

function isTrustedEmbed(embed: CreativeEmbed): boolean {
  if (!embed.embedUrl || embed.placeholder) return false;

  try {
    const url = new URL(embed.embedUrl);
    return (
      url.protocol === "https:" &&
      providerHosts[embed.provider].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function EmbedPanel({ compact = false, embed }: EmbedPanelProps) {
  const Icon = providerIcons[embed.provider] ?? AudioLines;
  const provider = providerLabels[embed.provider];

  if (isTrustedEmbed(embed)) {
    return (
      <div
        className={`creative-embed creative-embed-live${compact ? " creative-embed-compact" : ""}`}
      >
        <iframe
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          src={embed.embedUrl}
          title={embed.title}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`${provider} media pending`}
      className={`creative-embed creative-embed-placeholder${compact ? " creative-embed-compact" : ""}`}
      role="status"
    >
      <Icon aria-hidden size={compact ? 18 : 24} strokeWidth={1.5} />
      <div>
        <span>{provider}</span>
        <strong>{embed.title}</strong>
      </div>
      <small>Embed pending</small>
    </div>
  );
}
