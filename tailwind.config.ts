import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Redesign palette: see the "Redesign palette" block in src/index.css.
        ink: {
          DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
          2: "hsl(var(--ink-2) / <alpha-value>)",
          body: "hsl(var(--ink-body) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          meta: "hsl(var(--ink-meta) / <alpha-value>)",
          faint: "hsl(var(--ink-faint) / <alpha-value>)",
          dim: "hsl(var(--ink-dim) / <alpha-value>)",
          hover: "hsl(var(--ink-hover) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          sub: "hsl(var(--surface-sub) / <alpha-value>)",
          hover: "hsl(var(--surface-hover) / <alpha-value>)",
        },
        "soft-hover": "hsl(var(--soft-hover) / <alpha-value>)",
        line: {
          DEFAULT: "hsl(var(--border) / <alpha-value>)",
          inner: "hsl(var(--line-inner) / <alpha-value>)",
          input: "hsl(var(--input) / <alpha-value>)",
          strong: "hsl(var(--line-strong) / <alpha-value>)",
          dashed: "hsl(var(--line-dashed) / <alpha-value>)",
          hover: "hsl(var(--line-hover) / <alpha-value>)",
        },
        night: {
          DEFAULT: "hsl(var(--night) / <alpha-value>)",
          card: "hsl(var(--night-card) / <alpha-value>)",
          line: "hsl(var(--night-line) / <alpha-value>)",
          fg: "hsl(var(--night-fg) / <alpha-value>)",
          text: "hsl(var(--night-text) / <alpha-value>)",
          dim: "hsl(var(--night-dim) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "oklch(var(--brand) / <alpha-value>)",
          text: "oklch(var(--brand-text) / <alpha-value>)",
          ring: "oklch(var(--brand-ring) / <alpha-value>)",
          "on-dark": "oklch(var(--brand-on-dark) / <alpha-value>)",
          tint: "oklch(var(--brand-tint) / <alpha-value>)",
          "on-tint": "oklch(var(--brand-on-tint) / <alpha-value>)",
          soft: "oklch(var(--brand-soft) / <alpha-value>)",
          deep: "oklch(var(--brand-deep) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        window: "0 30px 80px -30px rgba(10,20,50,.35)",
        lift: "0 18px 36px -20px rgba(10,20,50,.3)",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "Menlo", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
