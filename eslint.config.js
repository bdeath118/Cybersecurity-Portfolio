/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["next", "next/core-web-vitals"],
  rules: {
    // Add any custom ESLint rules here
    // For example, to disable a rule:
    // '@next/next/no-img-element': 'off',
  },
}

export default config
