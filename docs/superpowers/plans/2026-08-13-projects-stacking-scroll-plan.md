# Projects Stacking Scroll Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Projects section so each project is a numbered card that sticks to the top of the viewport while the next project's card slides up and gently covers it, matching the stacking-cards reference the user provided.

**Architecture:** Each project card is wrapped in a `position: sticky` div with an index-based `top` offset (native scroll-driven stacking, no JS scroll listener needed for the core pin behavior). Framer Motion's `useScroll` (target-based) drives a subtle scale/opacity transform on each card as it gets covered by the next one.

**Tech Stack:** Same as the rest of the project — React, Framer Motion, Vitest + React Testing Library.

## Global Constraints

- Color tokens and fonts stay as defined in `src/index.css` (`--accent`, `--accent-dark`, `--bg-alt-2`, `--border`, `--font-heading`) — per the original design spec.
- No new fields in `src/data/content.js` — project number and gradient variant are derived from the array index. Per `docs/superpowers/specs/2026-08-13-projects-stacking-scroll-design.md`.
- **Technical constraint discovered during design:** `position: sticky` does not work reliably inside an ancestor that has a CSS `transform` applied (Framer Motion's `AnimatedSection` applies `transform: translateY(...)` for its fade-in-on-scroll effect). The Projects section must NOT be wrapped in `AnimatedSection` — use a plain `<section>` instead. The individual cards still animate via their own scroll-linked scale/opacity, so the section doesn't lose its animated feel.
- Existing behavior that must keep working: `#projetos` anchor id (used by `Header`'s nav + `useActiveSection`), `Ver projeto` (liveUrl) and `Código` (codeUrl) links opening in a new tab with `rel="noopener noreferrer"`, stack tags rendered from `project.stack`.

---

### Task 1: Rebuild Projects as sticky stacking cards

**Files:**
- Modify: `src/components/Projects/Projects.jsx`
- Modify: `src/components/Projects/Projects.css`
- Modify: `src/components/Projects/Projects.test.jsx`
- Modify: `src/test/setup.js`

**Interfaces:**
- `Projects({ projects })` keeps the same prop shape as today (`Array<{ id, title, description, stack, liveUrl, codeUrl }>` from `src/data/content.js`) — no data-layer changes.
- Renders `<section id="projetos" className="projects">` (plain, not `AnimatedSection`) so `Header`'s `useActiveSection` and the nav anchor keep working unchanged.

- [ ] **Step 1: Write the failing test (replaces current file)**

```jsx
// src/components/Projects/Projects.test.jsx
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

const projects = [
  {
    id: 'p1',
    title: 'Projeto A',
    description: 'Descrição A',
    stack: ['React', 'Vite'],
    liveUrl: 'https://example.com/a',
    codeUrl: 'https://github.com/user/a',
  },
  {
    id: 'p2',
    title: 'Projeto B',
    description: 'Descrição B',
    stack: ['Python'],
    liveUrl: 'https://example.com/b',
    codeUrl: 'https://github.com/user/b',
  },
];

describe('Projects', () => {
  it('renders a numbered card for each project with its title', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto B' })).toBeInTheDocument();
  });

  it('renders project details and links that open in a new tab', () => {
    render(<Projects projects={[projects[0]]} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
    expect(screen.getByText('Descrição A')).toBeInTheDocument();

    const liveLink = screen.getByRole('link', { name: 'Ver projeto' });
    expect(liveLink).toHaveAttribute('href', 'https://example.com/a');
    expect(liveLink).toHaveAttribute('target', '_blank');
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');

    const codeLink = screen.getByRole('link', { name: 'Código' });
    expect(codeLink).toHaveAttribute('href', 'https://github.com/user/a');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Projects/Projects.test.jsx`
Expected: FAIL — current component doesn't render "01"/"02" number spans.

- [ ] **Step 3: Add a ResizeObserver mock to the shared test setup**

Framer Motion's target-based `useScroll` (used in Step 4) relies on `ResizeObserver`, which jsdom doesn't implement. Add it next to the existing `IntersectionObserver` mock:

```js
// src/test/setup.js
// Add this block near the IntersectionObserver mock, before the matchMedia block:

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock;
  global.ResizeObserver = ResizeObserverMock;
}
```

- [ ] **Step 4: Rebuild the Projects component**

```jsx
// src/components/Projects/Projects.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Projects.css';

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="project-sticky" style={{ top: `${90 + index * 20}px` }} ref={ref}>
      <motion.article className="project-card" style={{ scale, opacity }}>
        <div className="project-card__header">
          <div className="project-card__heading">
            <span className="project-card__number">{number}</span>
            <div>
              <p className="project-card__label">Projeto</p>
              <h3>{project.title}</h3>
            </div>
          </div>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            Ver projeto
          </a>
        </div>
        <div className={`project-card__visual project-card__visual--${index % 3}`} aria-hidden="true" />
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__footer">
          <ul className="project-card__stack">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            Código
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects({ projects }) {
  return (
    <section id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <div className="projects__stack">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.id} />
        ))}
      </div>
    </section>
  );
}
```

```css
/* src/components/Projects/Projects.css */
.projects {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem 2rem;
}

.projects__stack {
  position: relative;
}

.project-sticky {
  position: sticky;
  padding-bottom: 2rem;
}

.project-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.75rem;
  background: var(--bg-alt-2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.project-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.project-card__heading {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.project-card__number {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--accent);
}

.project-card__label {
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
}

.project-card__heading h3 {
  font-size: 1.5rem;
}

.project-card__visual {
  height: clamp(220px, 32vw, 380px);
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.project-card__visual--0 {
  background: linear-gradient(135deg, #0f2f2a, #2dd4bf 140%);
}

.project-card__visual--1 {
  background: linear-gradient(135deg, #0a0a0a, #14b8a6 160%);
}

.project-card__visual--2 {
  background: radial-gradient(circle at 30% 30%, #2dd4bf, #050505 75%);
}

.project-card__description {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-card__stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
}

.project-card__stack li {
  font-size: 0.75rem;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
}

@media (min-width: 769px) {
  .project-sticky {
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

  .project-card {
    width: 100%;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/components/Projects/Projects.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the full suite, build, and lint**

Run: `npm run test`
Expected: PASS — all test files green (Projects test updated; no other file references the removed `AnimatedSection` import in `Projects.jsx`).

Run: `npm run build`
Expected: build succeeds with no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Manual QA in the browser**

Run: `npm run dev`, open the local URL, scroll to the Projetos section, and confirm:
- Each project card sticks near the top of the viewport as you scroll, then the next card slides up and covers it with a visible sliver of the previous card's edge still showing (per the `top: 90px + index*20px` offset).
- The scale/opacity transition on the covered card is smooth, not jumpy.
- "Ver projeto" and "Código" links still open the right URLs in a new tab.
- The `#projetos` nav link in the header still highlights correctly while scrolling through this section (confirms `useActiveSection` still finds `#projetos`).
- No console errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/Projects/Projects.jsx src/components/Projects/Projects.css src/components/Projects/Projects.test.jsx src/test/setup.js
git commit -m "feat: redesign Projects as sticky stacking scroll cards"
```

---

## Self-Review Notes

- **Spec coverage:** sticky stacking mechanic, numbered header with "Ver projeto" top-right, gradient visual block, stack tags + "Código" kept — all covered in Step 4. The `AnimatedSection`-vs-`position:sticky` conflict is called out explicitly as a Global Constraint so the implementer doesn't reintroduce it.
- **Placeholder scan:** no TBD/TODO; all code blocks are complete.
- **Type/interface consistency:** `Projects({ projects })` prop shape unchanged from what `App.jsx` already passes (`projects={projects}` from `src/data/content.js`) — no changes needed in `App.jsx` or `content.js`.
- **Scope:** matches the approved design doc; no new content fields, no changes to other sections.
