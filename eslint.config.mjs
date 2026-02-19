import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      // Standard mount-detection patterns (setMounted, setIsClient, etc.) are
      // intentional and necessary for SSR hydration safety; this new rule is
      // too aggressive for those use cases.
      "react-hooks/set-state-in-effect": "off",
    },
  },

  {
    ignores: ["node_modules/", ".next/", "out/", "build/", "dist/"],
  },
];

export default eslintConfig;
