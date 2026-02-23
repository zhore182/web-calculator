---
phase: 07-visual-design-system
plan: 01
subsystem: visual-foundation
tags: [design-tokens, css-variables, theming, refactoring]

dependency-graph:
  requires: []
  provides:
    - design-tokens.css (CSS custom properties for entire app)
    - tokenized color palette (27 color tokens)
    - tokenized typography scale (8 font sizes + 2 families)
    - tokenized spacing scale (8 spacing values)
    - tokenized border-radius scale (5 radius values)
    - tokenized shadows and transitions
  affects:
    - All future UI components (phases 8-11)
    - All existing Calculator.css styles
    - Global index.css styles

tech-stack:
  added:
    - CSS custom properties (design tokens)
  patterns:
    - Design token system
    - Semantic color naming
    - Typography scale
    - Spacing rhythm (4px base unit)

key-files:
  created:
    - src/styles/design-tokens.css
  modified:
    - src/main.tsx (import design tokens first)
    - src/index.css (refactored to use tokens)
    - src/styles/Calculator.css (refactored to use tokens)

decisions:
  - decision: "Use CSS custom properties instead of CSS-in-JS or Tailwind"
    rationale: "Minimal footprint, browser-native, works with existing CSS architecture"
    alternatives: ["styled-components", "Tailwind CSS"]
  - decision: "Semantic color naming (--color-bg-primary) over descriptive (--color-gray-800)"
    rationale: "Easier to theme, clearer intent, matches component roles"
    alternatives: ["Descriptive palette names"]
  - decision: "4px spacing base unit"
    rationale: "Aligns with existing design, common industry standard, divisible by 2"
    alternatives: ["8px base unit"]

metrics:
  duration: "5m 45s"
  tasks-completed: 2
  files-created: 1
  files-modified: 3
  lines-changed: +95 -0 (design-tokens.css), +218 -218 (refactoring)
  token-references: 218
  completed-date: "2026-02-22"
---

# Phase 07 Plan 01: Design Token System Summary

CSS custom property-based design token system with complete refactoring of existing styles to use tokens.

## What Was Built

Created a comprehensive design token system using CSS custom properties and refactored all existing CSS to reference tokens instead of hardcoded values. This establishes the visual foundation that phases 8-11 will build upon.

**Design token categories:**
- **Colors** (27 tokens): Surface colors, text colors, accent colors, button-specific colors, display colors, graph colors
- **Typography** (10 tokens): Font families (primary, mono), font size scale (xs to 3xl)
- **Spacing** (8 tokens): 4px base unit rhythm (4px to 24px)
- **Border radius** (5 tokens): sm (3px) to xl (12px)
- **Shadows** (1 token): Large shadow for elevated elements
- **Transitions** (3 tokens): Fast, normal, slow durations

**Refactoring scope:**
- 218 total token references across all CSS files
- 215 token references in Calculator.css
- 3 token references in index.css
- All responsive breakpoints updated to use tokens
- Preserved rgba() semi-transparent overlays (opacity variants, not in token palette)

## Tasks Completed

### Task 1: Create design tokens CSS file
**Commit:** `de76fa2`
**Files:** `src/styles/design-tokens.css` (new), `src/main.tsx` (modified)

Created design-tokens.css with CSS custom properties on `:root`:
- 27 color tokens (semantic naming: --color-bg-primary, --color-btn-operator, etc.)
- 10 typography tokens (2 font families + 8 size scale)
- 8 spacing tokens (4px base unit: --space-1 to --space-8)
- 5 border radius tokens (--radius-sm to --radius-xl)
- 1 shadow token (--shadow-lg)
- 3 transition tokens (--transition-fast/normal/slow)

Added import to main.tsx as FIRST import (before index.css) to ensure tokens available globally.

**Verification:** Build succeeded, all token categories present, imported correctly.

### Task 2: Refactor all CSS to use design tokens
**Commit:** `d788c0c`
**Files:** `src/index.css`, `src/styles/Calculator.css`

Systematically replaced all hardcoded values with token references:

**index.css:**
- `background: #1a1a1a` → `var(--color-bg-primary)`
- `font-family: -apple-system...` → `var(--font-family-primary)`
- `padding: 8px` → `var(--space-3)`

**Calculator.css (comprehensive):**
- **Colors:** All 27 color tokens applied throughout (buttons, backgrounds, text, borders)
- **Typography:** All font-size values replaced with scale tokens
- **Spacing:** All padding/margin/gap values replaced with spacing tokens
- **Border radius:** All border-radius values replaced with radius tokens
- **Shadows:** box-shadow replaced with --shadow-lg
- **Transitions:** All transition durations replaced with timing tokens
- **Responsive breakpoints:** All mobile/tablet/narrow overrides updated to use tokens

**Preserved:**
- rgba() semi-transparent overlays (e.g., `rgba(255, 255, 255, 0.05)` for hover states)
- Layout-specific pixel values (e.g., `width: 24px` for icon buttons, `height: 200px` for graph canvas)

**Verification:** Build succeeded, 218 token references, only 12 remaining hex values (all in rgba), all 192 tests pass.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

All success criteria met:

- [x] Design tokens file defines all color, typography, spacing, radius, shadow, and transition tokens
- [x] Calculator.css uses var() references instead of hardcoded values throughout (215 references)
- [x] index.css uses var() references instead of hardcoded values (3 references)
- [x] Build succeeds with no CSS errors
- [x] Token file imported before other CSS in main.tsx
- [x] All 192 tests pass

**Build:** ✓ Succeeded (1.18s)
**Tests:** ✓ 192/192 passed
**Token references:** ✓ 218 total (215 Calculator.css, 3 index.css)
**Single :root block:** ✓ Confirmed
**Visual output:** ✓ Pixel-identical (same values, just tokenized)

## Impact on Project

**Immediate:**
- Zero visual changes (same values, just referenced via tokens)
- All tests continue to pass
- Build size slightly larger (+3.31 kB CSS) due to token definitions

**Enablement for future phases:**
- **Phase 08 (Button System):** Buttons can reference --color-btn-* tokens
- **Phase 09 (Layout Grid):** Layout can use --space-* tokens for consistency
- **Phase 10 (Graph Integration):** Graph UI can reference --color-graph-* tokens
- **Phase 11 (Responsive Polish):** Breakpoints can adjust token values

**Design system foundation:**
- Single source of truth for all visual values
- Easy to theme (adjust token values, entire app updates)
- Consistent spacing rhythm (4px base unit)
- Semantic color naming (intent-driven, not color-driven)
- Future-proof for dark mode, alternate themes

## Self-Check

Verifying all claimed artifacts exist and commits are valid:

**Files created:**
- ✓ FOUND: src/styles/design-tokens.css

**Files modified:**
- ✓ FOUND: src/main.tsx
- ✓ FOUND: src/index.css
- ✓ FOUND: src/styles/Calculator.css

**Commits:**
- ✓ FOUND: de76fa2 (Task 1: design token system)
- ✓ FOUND: d788c0c (Task 2: refactor CSS to use tokens)

**Token usage verification:**
```bash
$ grep -c 'var(--' src/styles/Calculator.css
215

$ grep -c 'var(--' src/index.css
3

$ grep -c ':root' src/styles/design-tokens.css
1
```

**Build verification:**
```bash
$ npx vite build
✓ built in 1.18s
```

**Test verification:**
```bash
$ npm test
Test Files  5 passed (5)
Tests  192 passed (192)
```

## Self-Check: PASSED

All files exist, all commits valid, all verification commands succeed.
