import { Link } from "react-router-dom";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const CONTACT_EMAIL = "hello@von-ai.com";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/ai-roi-sprint", label: "AI ROI Sprint" },
    { href: "/roi-calculator", label: "ROI Calculator" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-padding mx-auto max-w-7xl py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <img src={logoDark} alt="VonAI" className="h-8 w-auto dark:hidden" />
              <img src={logoLight} alt="VonAI" className="hidden h-8 w-auto dark:block" />
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              From AI experiments to ROI. We turn AI experimentation into measurable outcomes with a 2-week Sprint and a 90-day execution plan.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} VonAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
