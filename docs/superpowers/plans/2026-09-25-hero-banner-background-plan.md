# Hero Banner Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Hero split layout (text + portrait card) with a full-width banner: `hero-banner.png` becomes the section's background image (desktop/tablet only), with a legibility overlay and left-aligned text on top.

**Architecture:** `.hero` goes back to a single relatively-positioned block. The photo is applied as a CSS `background-image` inside a `@media (min-width: 768px)` block (so it's never fetched on mobile). A new `.hero__overlay` div sits between the background and `.hero__content`, providing a horizontal dark-to-transparent gradient for text contrast at every width. `.hero__media`/`.hero__portrait` and the `hero-portrait.png` asset are removed.

**Tech Stack:** React + Vite, plain CSS (no new dependencies), Vitest + Testing Library for the component test.

## Global Constraints

- Follow the approved spec at `docs/superpowers/specs/2026-09-25-hero-banner-background-design.md`.
- Breakpoint for showing the photo: `min-width: 768px` (below that, CSS gradient fallback, no photo request).
- Overlay gradient (all widths): `linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.6) 45%, rgba(26,26,26,0.15) 75%)`.
- Mobile fallback background: `linear-gradient(160deg, var(--bg) 0%, var(--bg-alt-2) 100%)`.
- `npm run test`, `npm run build`, `npm run lint` must all pass at the end (Task 2).

---

### Task 1: Rewrite Hero for banner background

**Files:**
- Modify: `src/components/Hero/Hero.jsx`
- Modify: `src/components/Hero/Hero.css`
- Modify: `src/components/Hero/Hero.test.jsx`
- Delete: `src/assets/hero/hero-portrait.png`

**Interfaces:**
- Consumes: `src/assets/hero/hero-banner.png` (already in the repo, 1916×821px), referenced only from CSS (`background-image: url(...)`), not imported in JS.
- Produces: `.hero` has three children in the DOM: `.hero__overlay` (decorative, empty), then `.hero__content` (unchanged text block). No more `.hero__media`/`.hero__portrait`.

- [ ] **Step 1: Update the failing/changed test first**

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
});
```

(This removes the `renders the placeholder portrait image` test — there's no `<img>` anymore, the photo is a CSS background.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: FAIL — the remaining test still references the old markup indirectly only through class names that are about to change, but since it doesn't query `.hero__media`, it should actually still PASS at this point. This step is a checkpoint, not a strict TDD red: confirm output is `1 passed (1)` before moving on, so you know the baseline before editing `Hero.jsx`.

- [ ] **Step 3: Update Hero.jsx**

Remove the image import (line 6) — change:

```jsx
import './Hero.css';
import heroPortraitPlaceholder from '../../assets/hero/hero-portrait.png';
```

to:

```jsx
import './Hero.css';
```

Replace the `<section>` body — change:

```jsx
    <section id="sobre" className="hero">
      <motion.div
        className="hero__content"
```

to:

```jsx
    <section id="sobre" className="hero">
      <div className="hero__overlay" aria-hidden="true" />
      <motion.div
        className="hero__content"
```

Then remove the entire `.hero__media` block at the end (everything from `<motion.div className="hero__media"` through its closing `</motion.div>`, right before `</section>`) — change:

```jsx
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
}
```

to:

```jsx
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite Hero.css**

Replace the full contents of `src/components/Hero/Hero.css` with:

```css
.hero {
  position: relative;
  min-height: clamp(560px, 100vh, 820px);
  display: flex;
  align-items: center;
  padding: 8rem 1.5rem 2rem;
  overflow: hidden;
  background: linear-gradient(160deg, var(--bg) 0%, var(--bg-alt-2) 100%);
}

@media (min-width: 768px) {
  .hero {
    background-image: url('../../assets/hero/hero-banner.png');
    background-size: cover;
    background-position: right center;
    background-repeat: no-repeat;
  }
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0.95) 0%,
    rgba(26, 26, 26, 0.6) 45%,
    rgba(26, 26, 26, 0.15) 75%
  );
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
```

- [ ] **Step 5: Delete the now-unused portrait asset**

```bash
git rm src/assets/hero/hero-portrait.png
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: PASS (`1 passed (1)`).

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.css src/components/Hero/Hero.test.jsx
git commit -m "feat: replace hero portrait card with full-width banner background"
```

(The `git rm` from Step 5 stages the deletion automatically; it will be included in this commit.)

---

### Task 2: Full verification and manual QA

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no new errors (the two pre-existing `react-refresh/only-export-components` warnings in `FoldText.jsx`/`StrokeText.jsx` are unrelated and expected to remain).

- [ ] **Step 4: Manual QA in the browser**

Run: `npm run dev`, open the site, and check:
- Desktop width (≥768px): `hero-banner.png` visible as the background, person visible on the right, text block readable on the left over the dark overlay.
- Mobile width (<768px): no photo request (check Network tab — `hero-banner.png` should not be listed), plain dark gradient background, text still fully readable.
- No layout shift, no overlap between the overlay and the CTAs/links (they must remain clickable).

- [ ] **Step 5: Report back**

Confirm to Lucca that the banner background is live and matches the approved spec.
