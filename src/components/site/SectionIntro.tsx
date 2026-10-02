import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  /** Eyebrow colour override, e.g. on the dark Fit section. */
  eyebrowClassName?: string;
}

/** Mono eyebrow, then H2, then an optional lead: the intro every section uses. */
export function SectionIntro({ eyebrow, title, lead, className, eyebrowClassName }: SectionIntroProps) {
  return (
    <div className={cn("flex max-w-[640px] flex-col gap-[18px]", className)}>
      <p className={cn("eyebrow", eyebrowClassName)}>{eyebrow}</p>
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead text-lg leading-[1.55]">{lead}</p>}
    </div>
  );
}
