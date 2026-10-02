import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const INSTANT = "instant" as ScrollBehavior;

/**
 * On navigation: scroll to the hash target if there is one (so "/#faq" from
 * another page lands on the FAQ, clear of the sticky nav via scroll-margin),
 * otherwise jump to the top.
 *
 * Explicit behaviours because html has scroll-behavior:smooth: page changes
 * and the first load jump instantly (a cold "/#faq" should not animate down
 * the whole page); only in-app anchor navigation animates.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const firstRun = useRef(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const samePage = !firstRun.current && prevPath.current === pathname;
    firstRun.current = false;
    prevPath.current = pathname;

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: samePage && !reduce ? "smooth" : INSTANT, block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: INSTANT });
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
