import SitePage from "../site-page";
import { pageMetadata } from "../seo";
// A utility page for past clients: kept out of search results.
export const metadata = pageMetadata(
  "Share Your Feedback | Visionpact Flamingo Media",
  "Worked with Visionpact Flamingo Media? Rate your experience and tell us what went well and what we could do better.",
  "/feedback",
  [],
  { index: false },
);
export default function Page() {
  return <SitePage view="feedback" />;
}