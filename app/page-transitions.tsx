"use client";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
const Navigation = createContext<(href: string) => void>(() => {});
export function usePageNavigation() {
  return useContext(Navigation);
}
export function PageTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // The page that is fading out. Derived rather than reset in an effect: once
  // the route changes, `leaving` is false on the very next render.
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  const leaving = leavingFrom === pathname;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recovery = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initial = useRef(true);
  const navigate = useCallback(
    (href: string) => {
      if (timer.current) clearTimeout(timer.current);
      if (recovery.current) clearTimeout(recovery.current);
      const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.body.classList.contains("paused");
      setLeavingFrom(reduced ? null : window.location.pathname);
      timer.current = setTimeout(
        () => {
          router.push(href);
          recovery.current = setTimeout(() => setLeavingFrom(null), 2500);
        },
        reduced ? 0 : 160,
      );
    },
    [router],
  );
  const redirectLegacyHash = useEffectEvent((target: string) =>
    router.replace("/" + target),
  );
  useEffect(() => {
    if (recovery.current) clearTimeout(recovery.current);
    if (initial.current) {
      initial.current = false;
      const legacy: Record<string, string> = {
        about: "studio",
        expertise: "services",
        work: "work",
        process: "process",
        pricing: "pricing",
        insights: "insights",
        technology: "technology",
        contact: "contact",
      };
      const target = legacy[window.location.hash.slice(1)];
      if (pathname === "/" && target) redirectLegacyHash(target);
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>("main")
        ?.focus({ preventScroll: true }),
    );
  }, [pathname]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (recovery.current) clearTimeout(recovery.current);
    },
    [],
  );
  return (
    <Navigation.Provider value={navigate}>
      <div
        className={`page-transition ${leaving ? "page-leaving" : ""}`}
        onClickCapture={(e) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
            "a[href]",
          );
          if (
            !a ||
            e.defaultPrevented ||
            e.button !== 0 ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey ||
            a.hasAttribute("download") ||
            a.target === "_blank"
          )
            return;
          const raw = a.getAttribute("href")!;
          if (raw.startsWith("#")) return;
          const url = new URL(a.href);
          if (url.origin !== location.origin) return;
          if (
            url.pathname === location.pathname &&
            url.search === location.search
          )
            return;
          e.preventDefault();
          navigate(url.pathname + url.search + url.hash);
        }}
      >
        <div className="page-enter" key={pathname}>
          {children}
        </div>
      </div>
    </Navigation.Provider>
  );
}
