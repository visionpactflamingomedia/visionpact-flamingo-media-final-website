import type { Plugin } from "vite";

// Local stand-in for the hosting platform's Sites plugin, which was not
// included in the exported source. The site does not use platform sign-in,
// so local development only needs a no-op plugin here.
export function sites(_options: { mockAuth?: boolean } = {}): Plugin {
  return { name: "visionpact-sites-local" };
}
