import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "default" | "lg" | "xl";
  className?: string;
  showArrow?: boolean;
  href?: string;
  external?: boolean;
}

export function CTAButton({
  variant = "primary",
  size = "lg",
  className,
  showArrow = true,
  href = CALENDLY_URL,
  external = true,
}: CTAButtonProps) {
  const { t } = useTranslation();
  
  const variantMap = {
    primary: "cta",
    secondary: "cta-outline",
    outline: "cta-outline",
    white: "cta-white",
  } as const;

  const buttonContent = (
    <>
      {t("nav.bookSprint")}
      {showArrow && <ArrowRight className="ml-1 h-4 w-4" />}
    </>
  );

  if (external) {
    return (
      <Button variant={variantMap[variant]} size={size} className={className} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">{buttonContent}</a>
      </Button>
    );
  }

  return (
    <Button variant={variantMap[variant]} size={size} className={className} asChild>
      <Link to={href}>{buttonContent}</Link>
    </Button>
  );
}

interface SecondaryCTAProps {
  text: string;
  href: string;
  className?: string;
}

export function SecondaryCTA({ text, href, className }: SecondaryCTAProps) {
  return (
    <Button variant="ghost" size="lg" className={className} asChild>
      <Link to={href}>
        {text}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  );
}
