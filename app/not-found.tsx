import SitePage from "./site-page";
export const metadata = {
  title: "Page not found | Visionpact Flamingo Media",
  robots: { index: false, follow: true },
};
export default function NotFound() {
  return <SitePage view="not-found" />;
}
