import type { CreativeEmbed, CreativeEmbedProvider } from "../types/content";

const providerHosts: Record<CreativeEmbedProvider, string[]> = {
  spotify: ["open.spotify.com"],
  strava: ["strava-embeds.com"],
  youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
  vimeo: ["player.vimeo.com"],
  soundcloud: ["w.soundcloud.com"],
};

export function hasTrustedEmbed(embed: CreativeEmbed): boolean {
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
