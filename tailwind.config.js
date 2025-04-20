const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
         fontFamily: {
            sans: "Mulish_500Medium",
            em: "Mulish_600SemiBold",
            strong: "Mulish_700Bold",
            logo: "Sora_700Bold"
         },
         colors: {
            border: "#e4e4e7",
            input: "#e4e4e7",
            ring: "#145f3e",
            background: "#ffffff",
            foreground: "#fafafa",
            primary: {
               DEFAULT: "#145f3e",
               foreground: "#fafafa"
            },
            secondary: {
               DEFAULT: "#d8fdd2",
               foreground: "#145f3e"
            },
            destructive: {
               DEFAULT: "#e11d48",
               foreground: "#fafafa"
            },
            muted: {
               DEFAULT: "#f4f4f5",
               foreground: "#8d9187"
            },
            accent: {
               DEFAULT: "#f4f4f5",
               foreground: "#145f3e"
            },
            popover: {
               DEFAULT: "#ffffff",
               foreground: "#09090b"
            },
            card: {
               DEFAULT: "#ffffff",
               foreground: "#09090b"
            }
         },
         borderWidth: {
            hairline: hairlineWidth()
         },
         keyframes: {
            "accordion-down": {
               from: { height: "0" },
               to: { height: "var(--radix-accordion-content-height)" }
            },
            "accordion-up": {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: "0" }
            }
         },
         animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out"
         }
      }
   },
   plugins: [require("tailwindcss-animate")]
};
