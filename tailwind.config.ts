import type { Config } from "tailwindcss";

import plugin from "tailwindcss/plugin";

import { blackA, mauve, violet } from "@radix-ui/colors";

const config = {
  // darkMode: ["class"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      typography: {
        DEFAULT: {
          css: {
            a: {
              "background-image": "linear-gradient(#fc591e, #fc591e)",
              "background-size": "100% 1px",
              "background-position": "left bottom",
              "background-repeat": "no-repeat",
            },
          },
        },
      },
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
        "brand-primary": "rgba(var(--brand-primary))",
        "background-primary": "rgba(var(--background-primary))",
        "background-secondary": "rgba(var(--background-secondary))",
        "ui-normal": "var(--ui-normal)",
        "ui-hover": "var(--ui-hover)",
        "ui-active": "var(--ui-active)",
        "border-non-interactive": "var(--border-non-interactive)",
        "border-interactive": "var(--border-interactive)",
        "border-focus-ring": "var(--border-focus-ring)",
        "border-primary": "var(--border-primary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        danger: "rgba(var(--danger))",
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideLeftAndFade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUpAndFade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideRightAndFade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "scroll-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scroll-fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "collapsible-slide-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        "collapsible-slide-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "caret-blink": "caret-blink 1.2s ease-out infinite",
        "collapsible-slide-up": "collapsible-slide-up 100ms ease-out",
        "collapsible-slide-down": "collapsible-slide-down 100ms ease-out",
        "scroll-fade-in": "scroll-fade-in 200ms forwards ease-out",
        "scroll-fade-out": "scroll-fade-out 200ms forwards ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant(
        "prose-inline-code",
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
      );
    }),
  ],
} satisfies Config;

export default config;
