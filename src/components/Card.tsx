import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-card",
    elevated: "bg-card shadow-lg hover:shadow-xl transition-shadow",
    bordered: "bg-card border border-border",
  };

  return (
    <div className={cn("rounded-lg p-6 md:p-8", variants[variant], className)}>
      {children}
    </div>
  );
}

interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <Card variant="bordered" className={cn("h-full", className)}>
      {Icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

interface NumberedCardProps {
  number: number | string;
  title: string;
  description: string;
  className?: string;
}

export function NumberedCard({ number, title, description, className }: NumberedCardProps) {
  return (
    <Card variant="bordered" className={cn("h-full", className)}>
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

interface IconListItemProps {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function IconListItem({ icon: Icon, children, className }: IconListItemProps) {
  return (
    <li className={cn("flex items-start gap-3", className)}>
      {Icon && (
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
      )}
      <span className="text-foreground">{children}</span>
    </li>
  );
}
