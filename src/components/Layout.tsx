import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer, type FooterVariant } from "./Footer";
import type { ClosingCtaCopy } from "./site/ClosingCta";

interface LayoutProps {
  children: ReactNode;
  closingCta?: ClosingCtaCopy;
  footerVariant?: FooterVariant;
}

export function Layout({ children, closingCta, footerVariant }: LayoutProps) {
  return (
    // overflow-x:clip (not hidden) so decorative rings can't cause sideways
    // scroll while position:sticky on the nav keeps working.
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer closingCta={closingCta} variant={footerVariant} />
    </div>
  );
}
