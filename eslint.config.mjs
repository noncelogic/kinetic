import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

/**
 * ESLint config for agentic development
 *
 * Philosophy: Compiler guardrails catch agent mistakes
 * before human review.
 *
 * NOTE: Using `recommended` instead of `strictTypeChecked` to avoid OOM
 * on resource-constrained environments. Will tighten incrementally.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      // === TYPE SAFETY (relaxed for initial pass) ===
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // === PREVENT COMMON AGENT MISTAKES ===
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",

      // === IMPORT ORGANIZATION ===
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
      "import/no-duplicates": "error",

      // === REACT ===
      "react/prop-types": "off", // TypeScript handles this
      "react/react-in-jsx-scope": "off", // Next.js
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // === CODE STYLE ===
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
  },
  {
    // Relaxed rules for config files
    files: ["**/*.config.{js,mjs,ts}", "**/scripts/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/no-default-export": "off",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs",
      "**/packages/feedback/dist/**",
      "**/apps/web/.next/**",
      "**/vitest.config.ts",
      "**/seed-user.ts",
      "eslint.config.mjs",
    ],
  }
);
