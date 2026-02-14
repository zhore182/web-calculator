# Technology Stack

**Analysis Date:** 2026-02-14

## Languages

**Primary:**
- TypeScript 5.9.3 - Application logic and React components
- JSX (React) - Component definitions in `.tsx` files

**Secondary:**
- JavaScript - Configuration files (vite, eslint, tsconfig)
- CSS - Styling (referenced in `src/index.css`)

## Runtime

**Environment:**
- Node.js v24.13.1 (tested with)
- Browser (client-side rendering)

**Package Manager:**
- npm 11.8.0
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.2.0 - UI library and component framework
- React DOM 19.2.0 - DOM rendering for React

**Build/Dev:**
- Vite 7.3.1 - Build tool and dev server
- @vitejs/plugin-react 5.1.1 - React integration for Vite (uses Babel for Fast Refresh)

**Testing:**
- Vitest 4.0.18 - Unit test runner
- @testing-library/react 16.3.2 - React component testing utilities
- jsdom 28.0.0 - DOM implementation for Node.js testing

## Key Dependencies

**Critical:**
- react@19.2.0 - UI component framework
- react-dom@19.2.0 - React rendering engine
- vite@7.3.1 - Build orchestration and dev server

**Development (Type Support):**
- typescript@5.9.3 - TypeScript compiler and type checking
- @types/react@19.2.7 - React type definitions
- @types/react-dom@19.2.3 - React DOM type definitions
- @types/node@24.10.1 - Node.js type definitions

**Development (Linting):**
- eslint@9.39.1 - Code linting
- @eslint/js@9.39.1 - ESLint JavaScript rules
- typescript-eslint@8.48.0 - TypeScript linting support
- eslint-plugin-react-hooks@7.0.1 - React hooks linting
- eslint-plugin-react-refresh@0.4.24 - Vite React refresh linting
- globals@16.5.0 - Global variable definitions for eslint

## Configuration

**Environment:**
- No `.env` files required
- No external API keys or secrets needed
- Configuration is build-time only (Vite config)

**Build:**
- `vite.config.ts` - Vite configuration (defines jsdom test environment)
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - Application TypeScript configuration (target ES2022, strict mode enabled)
- `tsconfig.node.json` - Build tool TypeScript configuration
- `eslint.config.js` - ESLint configuration (flat format, supports React hooks and refresh)

**TypeScript Settings:**
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled
- No unused locals or parameters allowed
- Module resolution: bundler
- Verbatim module syntax enabled

## Platform Requirements

**Development:**
- Node.js 18+ (tested with v24.13.1)
- npm 8+ (tested with v11.8.0)

**Production:**
- Modern browser with ES2022 support
- No backend required
- Client-side only application (single-page application)

**Deployment:**
- Static file hosting (suitable for Vercel, Netlify, GitHub Pages, etc.)
- Build output: `dist/` directory
- Entry point: `index.html` with embedded React application

## Scripts

**Available npm scripts:**
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - TypeScript build check (`tsc -b`) then Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally
- `npm run test` - Run Vitest test suite

---

*Stack analysis: 2026-02-14*
