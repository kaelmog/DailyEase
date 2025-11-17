# CHANGELOG for daily-ease-refactored v5
Date: 2025-11-17

## Summary
Upgraded project toolchain to v5 specification (JavaScript-only). Key changes:
- Switched package manager target to **pnpm** (see .npmrc)
- Upgraded **Next.js** to `15.x` (placeholder), **React** to `18.3.x`
- Migrated linting to **ESLint 9** using Flat Config (`eslint.config.js`)
- Removed **Jest** and added **Vitest** + **Vite** (`vitest.config.js`, `vitest.setup.js`)
- Removed TypeScript config files and declaration files; renamed `.ts/.tsx` files to `.js/.jsx`
- Added `pnpm.overrides` in package.json as required to purge deprecated transitive deps
- Added **Prettier 3** as a dev dependency placeholder

Note: This upgrade focused strictly on toolchain and file-type changes per instructions.
All application UI, styling, and runtime code logic were left intact except for file renames and removal of TypeScript artifacts.