import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * On navigation: scroll to the hash target if there is one (so "/#faq" from
 * another page lands on the FAQ, clear of the sticky nav via scroll-margin),
 * otherwise jump to the top. The jump is instant on purpose: html has
 * scroll-behavior:smooth, which would otherwise animate every page change.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
