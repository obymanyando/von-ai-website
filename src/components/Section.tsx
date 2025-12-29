import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "primary";
}

export function Section({ children, className, id, variant = "default" }: SectionProps) {
  const variants = {
    default: "bg-background",
    muted: "bg-muted/30",
    primary: "hero-gradient text-primary-foreground",
  };

  return (
    <section
      id={id}
      className={cn("section-padding", variants[variant], className)}
    >
      <div className="container-padding mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
