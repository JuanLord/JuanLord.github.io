import { hasTrustedEmbed } from "../../lib/embeds";
import type { CreativeEmbed } from "../../types/content";

interface EmbedPanelProps {
  embed: CreativeEmbed;
  compact?: boolean;
}

export function EmbedPanel({ compact = false, embed }: EmbedPanelProps) {
  if (!hasTrustedEmbed(embed)) return null;

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
