# Hero Portrait Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a portrait image to the Hero section, splitting it into a text+image layout, using a lightweight SVG placeholder until the real AI-generated (and later real) photo is dropped in.

**Architecture:** `Hero.jsx` renders a new `.hero__media` block next to the existing `.hero__content`, inside a CSS grid that is single-column (stacked) below 960px and two-column above it. The image itself is a static asset imported like every other image in this codebase (see `Header.jsx` importing `logo-mark.png`).

**Tech Stack:** React + Vite (asset imports resolve to URLs automatically, both in dev/build and in Vitest), Framer Motion (existing `motion.div` pattern), Vitest + Testing Library for the component test.

## Global Constraints

- Follow the approved spec at `docs/superpowers/specs/2026-09-25-hero-portrait-image-design.md`.
- Accent color for any placeholder/glow styling: `var(--accent)` (`#2dd4bf`), matching `docs/superpowers/specs/2026-09-25-hero-portrait-image-design.md`.
- Card radius/border pattern: reuse existing tokens `var(--border)` (`rgba(45, 212, 191, 0.2)`) as seen in `src/components/Projects/ProjectImageCard.css`.
- **Deviation from spec, documented here:** the spec assumed Lucca would supply `hero-portrait.png` (the AI-generated photo) before implementation. Since that file doesn't exist yet, this plan wires the component to a small hand-authored SVG placeholder (`hero-portrait-placeholder.svg`) so the build/tests stay green today. Swapping in the real photo later is a one-line import change (Task 2, Step 1 shows exactly where).
- `npm run test`, `npm run build`, `npm run lint` must all pass at the end (Task 3).

---

### Task 1: Placeholder image asset

**Files:**
- Create: `src/assets/hero/hero-portrait-placeholder.svg`

**Interfaces:**
- Produces: a static SVG asset at `src/assets/hero/hero-portrait-placeholder.svg`, portrait orientation (viewBox `0 0 480 600`, i.e. 4:5), dark-to-teal gradient background with an abstract head-and-shoulders silhouette — reads clearly as "placeholder", not as a real photo. Task 2 imports this file directly.

- [ ] **Step 1: Create the SVG placeholder**

```bash
mkdir -p "src/assets/hero"
```

Create `src/assets/hero/hero-portrait-placeholder.svg` with this exact content:

```xml
<svg width="480" height="600" viewBox="0 0 480 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a" />
      <stop offset="100%" stop-color="#0f2f2a" />
    </linearGradient>
  </defs>
  <rect width="480" height="600" fill="url(#bg)" />
  <circle cx="240" cy="215" r="72" fill="#2dd4bf" fill-opacity="0.35" />
  <path d="M108 560 C108 430 372 430 372 560 Z" fill="#2dd4bf" fill-opacity="0.22" />
</svg>
```

- [ ] **Step 2: Verify the file is valid SVG**

Run: `node -e "require('fs').readFileSync('src/assets/hero/hero-portrait-placeholder.svg', 'utf8').includes('</svg>') || process.exit(1)"`
Expected: no output, exit code 0 (no error thrown).

- [ ] **Step 3: Commit**

```bash
git add src/assets/hero/hero-portrait-placeholder.svg
git commit -m "feat: add hero portrait placeholder asset"
```

---

### Task 2: Hero split layout with image

**Files:**
- Modify: `src/components/Hero/Hero.jsx`
- Modify: `src/components/Hero/Hero.css`
- Modify: `src/components/Hero/Hero.test.jsx`

**Interfaces:**
- Consumes: `src/assets/hero/hero-portrait-placeholder.svg` from Task 1 (default import gives a URL string, same pattern as `logoMark` in `src/components/Header/Header.jsx:2`).
- Produces: `.hero` becomes a CSS grid with `.hero__content` and `.hero__media` as its two children; `.hero__media` wraps an `<img className="hero__portrait">`. Nothing outside `Hero.jsx`/`Hero.css` depends on these class names today.

- [ ] **Step 1: Write the failing test**

Replace the full contents of `src/components/Hero/Hero.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

const about = {
  name: 'Luccas Madia',
  tagline: 'Dev',
  bio: 'Bio de teste.',
};

describe('Hero', () => {
  it('renders the name, tagline, bio and CTAs', () => {
    render(<Hero about={about} />);

    expect(screen.getByRole('heading', { name: 'Luccas Madia' })).toBeInTheDocument();
    expect(
      screen.getByText((_content, element) => element.className === 'fold-text' && element.textContent === 'Dev')
    ).toBeInTheDocument();
    expect(screen.getByText('Bio de teste.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '#projetos');
    expect(screen.getByRole('link', { name: 'Fale comigo' })).toHaveAttribute('href', '#contato');
  });

  it('renders the placeholder portrait image', () => {
    render(<Hero about={about} />);

    expect(screen.getByRole('img', { name: /placeholder/i })).toBeInTheDocument();
  });
});
```

(Only the second `it` block is new — the first is unchanged from today's file.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: FAIL — `TestingLibraryElementError: Unable to find role="img"` (the image doesn't exist yet).

- [ ] **Step 3: Add the image import and `.hero__media` block to Hero.jsx**

In `src/components/Hero/Hero.jsx`, add the import after the existing `./Hero.css` import (line 5):

```jsx
import './Hero.css';
import heroPortraitPlaceholder from '../../assets/hero/hero-portrait-placeholder.svg';
```

Then replace the closing of the `<section>` (currently just the single `motion.div.hero__content` at lines 17-82, closed at line 83) so the section contains a second `motion.div` as a sibling after `.hero__content`:

```jsx
  return (
    <section id="sobre" className="hero">
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ...existing hero__content children unchanged... */}
      </motion.div>
      <motion.div
        className="hero__media"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img
          src={heroPortraitPlaceholder}
          alt="Placeholder de retrato — foto real em breve"
          className="hero__portrait"
        />
      </motion.div>
    </section>
  );
```

(`{/* ...existing hero__content children unchanged... */}` is not literal code — keep every existing child of `.hero__content` from the current file exactly as-is; only the new `.hero__media` sibling block and its closing of `</section>` are additions.)

To swap in the real AI-generated (or real) photo later: replace the `heroPortraitPlaceholder` import path with the new file (e.g. `../../assets/hero/hero-portrait.png`) — no other code changes needed.

- [ ] **Step 4: Add grid layout and image styles to Hero.css**

Replace the contents of `src/components/Hero/Hero.css` with:

```css
.hero {
  position: relative;
  min-height: clamp(560px, 100vh, 820px);
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 3rem;
  padding: 8rem 1.5rem 2rem;
  overflow: hidden;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: 1.1fr 0.9fr;
    padding: 8rem 3rem 2rem;
  }
}

.hero__content {
  max-width: 640px;
  position: relative;
  z-index: 1;
}

.hero__eyebrow {
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.hero__name {
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 0.75rem;
}

.hero__tagline {
  color: var(--accent);
  font-size: 1.1rem;
  min-height: 1.6em;
  margin-bottom: 1.5rem;
}

.hero__bio {
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero__media {
  position: relative;
  z-index: 1;
  justify-self: center;
  width: 100%;
  max-width: 380px;
}

.hero__portrait {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 0 40px rgba(45, 212, 191, 0.15);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: PASS (both tests green).

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.css src/components/Hero/Hero.test.jsx
git commit -m "feat: split hero layout with portrait image"
```

---

### Task 3: Full verification and manual QA

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass, including both `Hero.test.jsx` cases.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds with no errors (confirms the SVG import resolves correctly in the production bundler too).

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual QA in the browser**

Run: `npm run dev`, open the site, and check:
- Desktop width (≥960px): text on the left, portrait placeholder card on the right, side by side.
- Mobile width (<960px): text first, placeholder card below it, full width up to its `max-width`.
- The placeholder card shows the dark-to-teal gradient with the silhouette shape, rounded corners, subtle teal border/glow.
- No layout shift or overlap with the existing scroll/parallax behavior of the Hero.

- [ ] **Step 5: Report back**

Confirm to Lucca that the layout is in place and ready — the only remaining step is generating the real portrait with the prompt already provided and swapping the import per Task 2 Step 3's note.
