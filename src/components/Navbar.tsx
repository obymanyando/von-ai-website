import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { HOME_SECTIONS } from "@/lib/site";
import { cn } from "@/lib/utils";

const linkBase = "text-[15px] text-ink-2 hover:text-brand-text";
const linkActive = "font-medium text-ink";

export function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const onInsights = pathname.startsWith("/resources");

  // On Home the border only appears once the page has scrolled; elsewhere it is always on.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);
  const showBorder = !isHome || scrolled;

  // Mobile sheet items are real links: the router navigates on tap, and we just
  // close the sheet. Navigation must not wait for the close animation (Radix
  // only finishes closing on animationend, which never fires in a background
  // tab); programmatic scrolling still works under its scroll lock.
  const [open, setOpen] = useState(false);
  const navigated = useRef(false);
  const closeAfterLink = (e: MouseEvent<HTMLAnchorElement>) => {
    // Opening in a new tab/window leaves this page as it is.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    navigated.current = true;
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b bg-[hsl(var(--background)/0.88)] backdrop-blur-md transition-colors duration-200",
        showBorder ? "border-line" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="site-container flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="VonAI home" className="inline-flex min-h-[44px] shrink-0 items-center">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {HOME_SECTIONS.map((s) => (
            <Link key={s.id} to={`/#${s.id}`} className={linkBase}>
              {t(s.labelKey)}
            </Link>
          ))}
          <Link
            to="/resources"
            aria-current={onInsights ? "page" : undefined}
            className={cn(linkBase, onInsights && linkActive)}
          >
            {t("nav.insights")}
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="pill pill-soft hidden lg:inline-flex"
          >
            {t("nav.contact")}
          </Link>
          <Link to="/contact" className="pill pill-dark hidden px-[18px] sm:inline-flex">
            {t("nav.bookCall")}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-ink hover:bg-soft-hover lg:hidden"
              aria-label={t("nav.menu")}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full max-w-sm flex-col gap-8 bg-background px-6 pt-6"
              // After a link, don't pull focus back to the trigger (it would fight
              // the anchor scroll). Escape/close still returns focus as usual.
              onCloseAutoFocus={(e) => {
                if (!navigated.current) return;
                navigated.current = false;
                e.preventDefault();
              }}
            >
              <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
              <Logo />
              <ul className="flex flex-col border-t border-line">
                {HOME_SECTIONS.map((s) => (
                  <li key={s.id} className="border-b border-line">
                    <Link
                      to={`/#${s.id}`}
                      onClick={closeAfterLink}
                      className="flex min-h-[52px] w-full items-center text-lg text-ink"
                    >
                      {t(s.labelKey)}
                    </Link>
                  </li>
                ))}
                <li className="border-b border-line">
                  <Link
                    to="/resources"
                    onClick={closeAfterLink}
                    aria-current={onInsights ? "page" : undefined}
                    className={cn("flex min-h-[52px] w-full items-center text-lg text-ink", onInsights && "font-medium")}
                  >
                    {t("nav.insights")}
                  </Link>
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <Link to="/contact" onClick={closeAfterLink} className="pill pill-dark pill-lg w-full">
                  {t("nav.bookCall")}
                </Link>
                <Link to="/contact" onClick={closeAfterLink} className="pill pill-soft pill-lg w-full">
                  {t("nav.contact")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
