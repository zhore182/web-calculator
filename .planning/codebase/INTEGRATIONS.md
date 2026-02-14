# External Integrations

**Analysis Date:** 2026-02-14

## APIs & External Services

**Not Applicable:**
- No external APIs are integrated
- Application operates entirely client-side
- No backend service calls required

## Data Storage

**Databases:**
- Not used - No database integration

**File Storage:**
- Local filesystem only - Static assets bundled with application

**Client-Side Storage:**
- Browser localStorage API - Used for calculator history persistence
  - Storage key: `calculator-history`
  - Format: JSON serialized array of `HistoryEntry` objects
  - Implementation: `src/logic/historyHandlers.ts` (`loadHistory()`, `saveHistory()`)
  - Graceful degradation: Returns empty array if localStorage unavailable (privacy mode, quota exceeded, etc.)

**Caching:**
- Browser HTTP caching only (Vite build output)
- No application-level caching layer

## Authentication & Identity

**Auth Provider:**
- Not used - No authentication required
- No user accounts or sessions
- Completely public application

## Monitoring & Observability

**Error Tracking:**
- Not integrated - Errors are handled locally
- Display "Error" message for calculation exceptions (division by zero, overflow, etc.)

**Logs:**
- Browser console only (development)
- No external logging service integrated

## CI/CD & Deployment

**Hosting:**
- Vercel (detected from recent commit: "fix: resolve TypeScript build errors for Vercel deployment")
- Supports any static hosting (Netlify, GitHub Pages, AWS S3+CloudFront, etc.)

**CI Pipeline:**
- Likely Vercel CI (inferred from deployment history)
- Build command: `npm run build` (produces `dist/` directory)
- Production build includes Vite optimization and minification

## Environment Configuration

**Required env vars:**
- None - Application requires no environment configuration

**Optional env vars:**
- None - All configuration is build-time and committed to repository

**Secrets location:**
- Not applicable - No secrets used

## Webhooks & Callbacks

**Incoming:**
- Not used - No API endpoints

**Outgoing:**
- Not used - No external service callbacks

## Browser APIs Used

**Window/DOM APIs:**
- `document.getElementById('root')` - Root element selection in `src/main.tsx`
- `localStorage` - History data persistence in `src/logic/historyHandlers.ts`
- Standard React/ReactDOM APIs via `react` and `react-dom`

## No External Dependencies for:
- API communication (no axios, fetch wrappers, graphql clients)
- State management (no Redux, Zustand, Context Provider wrappers)
- Form handling (no form libraries)
- UI components (no material-ui, chakra, etc.)
- CSS-in-JS (no styled-components, emotion)
- Database ORM (no Prisma, Sequelize, TypeORM)

---

*Integration audit: 2026-02-14*
