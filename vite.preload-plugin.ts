/**
 * Vite plugin: injects <link rel="modulepreload"> for critical hero chunks
 * into the generated index.html so the browser starts fetching them immediately.
 *
 * Without this, the browser only discovers lazy chunks after parsing the
 * entry JS — by which time it's already blocked on parse + exec.
 */
import type { Plugin } from "vite";

const CRITICAL_CHUNKS = [
  // Hero components — the LCP element
  "CinematicHero",
  "HeroSceneBundle",
  "useDeviceCapability",
  // GSAP scroll animations (needed by hero)
  "ScrollTrigger",
  "heroKeyframes",
  "interpolate",
];

export default function preloadPlugin(): Plugin {
  return {
    name: "vite-plugin-preload-critical",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;

      // Find chunk files matching our critical names
      const preloadLinks: string[] = [];

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;

        const isCritical = CRITICAL_CHUNKS.some(
          (name) => chunk.name?.includes(name) || fileName.includes(name)
        );

        if (isCritical && !chunk.isEntry) {
          // Vite bundle keys already include the assets/ prefix
          preloadLinks.push(
            `<link rel="modulepreload" href="/${fileName}" crossorigin>`
          );
        }
      }

      if (preloadLinks.length === 0) return html;

      const preloadHtml =
        "\n    <!-- Critical chunk preloads (auto-injected by vite-plugin-preload-critical) -->\n    " +
        preloadLinks.join("\n    ") +
        "\n  ";

      return html.replace(
        /<\/head>/,
        preloadHtml + "\n  </head>"
      );
    },
  };
}
