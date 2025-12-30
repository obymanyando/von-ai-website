import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";

const navLinkKeys = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/ai-roi-sprint", key: "aiRoiSprint" },
  { href: "/roi-calculator", key: "roiCalculator" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-padding mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo - shows dark logo on light backgrounds, light logo on dark backgrounds */}
        <Link to="/" className="flex items-center">
          <img src={logoDark} alt="VonAI" className="h-8 w-auto dark:hidden" />
          <img src={logoLight} alt="VonAI" className="hidden h-8 w-auto dark:block" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          {navLinkKeys.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </div>

        {/* CTA Button & Theme Toggle & Language Switcher - Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="cta" size="default" asChild>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">{t("nav.bookSprint")}</a>
          </Button>
        </div>

        {/* Mobile Menu Button & Theme Toggle & Language Switcher */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background md:hidden">
          <div className="container-padding space-y-1 pb-4">
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            <div className="pt-4">
              <Button variant="cta" size="default" className="w-full" asChild>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">{t("nav.bookSprint")}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
