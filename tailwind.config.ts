import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        scroll: "scroll 50s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }, // adjust depending on length
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        useGrey: {
          100: "#fefeff",
          200: "#d7d9db",
          300: "#afb3b0",
          900: "#211f27",
        },
        usePurple: {
          100: "#dfe4fa",
          200: "#a4a6f5",
        },
        useBlue: {
          300: "#4f63df",
        },
        useYellow: {
          100: "#fcf1c6",
        },
        useOrange: {
          400: "#e07a2d",
          500: "#b7502f",
        },
        useBrown: {
          600: "#3e1c14",
        },
        useNeutral: {
          light: "#F9FAFB",
          dark: "#111827",
        },
      },
      boxShadow: {
        gray: {
          top: {
            sm: "0 -1px 3px rgba(0, 0, 0, 0.1)",
            md: "0 -4px 6px rgba(0, 0, 0, 0.15)",
            lg: "0 -6px 15px rgba(0, 0, 0, 0.2)",
          },
          bottom: {
            sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
            md: "0 4px 6px rgba(0, 0, 0, 0.15)",
            lg: "0 6px 15px rgba(0, 0, 0, 0.2)",
          },
          left: {
            sm: "-1px 0 3px rgba(0, 0, 0, 0.1)",
            md: "-4px 0 6px rgba(0, 0, 0, 0.15)",
            lg: "-6px 0 15px rgba(0, 0, 0, 0.2)",
          },
          right: {
            sm: "1px 0 3px rgba(0, 0, 0, 0.1)",
            md: "4px 0 6px rgba(0, 0, 0, 0.15)",
            lg: "6px 0 15px rgba(0, 0, 0, 0.2)",
          },
        },

        blue: {
          bottom: {
            sm: "0 1px 3px rgba(79, 99, 223, 0.15)",
            md: "0 4px 6px rgba(79, 99, 223, 0.2)",
            lg: "0 6px 15px rgba(79, 99, 223, 0.25)",
          },
        },

        purple: {
          bottom: {
            sm: "0 1px 3px rgba(164, 166, 245, 0.15)",
            md: "0 4px 6px rgba(164, 166, 245, 0.2)",
            lg: "0 6px 15px rgba(164, 166, 245, 0.25)",
          },
        },

        orange: {
          bottom: {
            sm: "0 1px 3px rgba(224, 122, 45, 0.15)",
            md: "0 4px 6px rgba(224, 122, 45, 0.2)",
            lg: "0 6px 15px rgba(224, 122, 45, 0.25)",
          },
        },

        yellow: {
          bottom: {
            sm: "0 1px 3px rgba(252, 241, 198, 0.2)",
            md: "0 4px 6px rgba(252, 241, 198, 0.3)",
            lg: "0 6px 15px rgba(252, 241, 198, 0.35)",
          },
        },
      },
      fontSize: {
        title: {
          xs: [
            "clamp(1rem, calc(1rem + ((1.5 - 1) * ((100vw - 22rem) / (120 - 22)))), 1.5rem)",
            {
              lineHeight:
                "clamp(1.25rem, calc(1.25rem + ((1.75 - 1.25) * ((100vw - 22rem) / (120 - 22)))), 1.75rem)",
            },
          ],
          s: [
            "clamp(1.375rem, calc(1.375rem + ((2.25 - 1.375) * ((100vw - 22rem) / (120 - 22)))), 2.25rem)",
            {
              lineHeight:
                "clamp(1.75rem, calc(1.75rem + ((2.5 - 1.75) * ((100vw - 22rem) / (120 - 22)))), 2.5rem)",
            },
          ],
          m: [
            "clamp(1.875rem, calc(1.875rem + ((3 - 1.875) * ((100vw - 22rem) / (120 - 22)))), 3rem)",
            {
              lineHeight:
                "clamp(2.25rem, calc(2.25rem + ((3.5 - 2.25) * ((100vw - 22rem) / (120 - 22)))), 3.5rem)",
            },
          ],
        },

        body: {
          xs: [
            "clamp(0.75rem, calc(0.75rem + ((0.875 - 0.75) * ((100vw - 22rem) / (120 - 22)))), 0.875rem)",
            {
              lineHeight:
                "clamp(1rem, calc(1rem + ((1.25 - 1) * ((100vw - 22rem) / (120 - 22)))), 1.25rem)",
            },
          ],
          s: [
            "clamp(0.875rem, calc(0.875rem + ((1 - 0.875) * ((100vw - 22rem) / (120 - 22)))), 1rem)",
            {
              lineHeight:
                "clamp(1.25rem, calc(1.25rem + ((1.5 - 1.25) * ((100vw - 22rem) / (120 - 22)))), 1.5rem)",
            },
          ],
        },

        caption: {
          xs: [
            "clamp(0.75rem, calc(0.75rem + ((0.875 - 0.75) * ((100vw - 22rem) / (120 - 22)))), 0.875rem)",
            {
              lineHeight:
                "clamp(1rem, calc(1rem + ((1.25 - 1) * ((100vw - 22rem) / (120 - 22)))), 1.25rem)",
            },
          ],
          s: [
            "clamp(0.875rem, calc(0.875rem + ((1 - 0.875) * ((100vw - 22rem) / (120 - 22)))), 1rem)",
            {
              lineHeight:
                "clamp(1.25rem, calc(1.25rem + ((1.5 - 1.25) * ((100vw - 22rem) / (120 - 22)))), 1.5rem)",
            },
          ],
        },
      },
      fontWeight: {
        "use-light": "300",
        "use-regular": "400",
        "use-medium": "500",
        "use-semibold": "600",
        "use-bold": "700",
        "use-extrabold": "800",
      },
    },
  },
  plugins: [],
};

export default config;
