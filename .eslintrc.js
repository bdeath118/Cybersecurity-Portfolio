module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-const": "warn",
    "react/no-unescaped-entities": "off",
  },
  ignorePatterns: ["node_modules/", ".next/", "out/", "build/", "dist/", "scripts/"],
}
