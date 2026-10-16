import SitePage from "../site-page";
import { pageMetadata } from "../seo";
// Placeholder page linked from the header: kept out of search results.
export const metadata = pageMetadata(
  "Test | Visionpact Flamingo Media",
  "Test page for Visionpact Flamingo Media.",
  "/test",
  [],
  { index: false },
);
export default function Page() {
  return <SitePage view="test" />;
}
