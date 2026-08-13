# Portfólio Luccas Madia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page React portfolio site (black + aqua theme) presenting Luccas Madia's services, experience, projects, skills, and contact info, with placeholder content ready to be edited later.

**Architecture:** Vite + React SPA, one page, section components mounted in a fixed order in `App.jsx`, all content sourced from a single `src/data/content.js` file. Framer Motion drives scroll-triggered animations; two small custom hooks (`useTypingEffect`, `useActiveSection`) drive the hero typing effect and the nav's active-link highlighting. No backend, no routing, no CMS.

**Tech Stack:** React 18, Vite 5, Framer Motion, react-icons (Font Awesome set), Vitest + React Testing Library for tests, ESLint (flat config) for linting.

## Global Constraints

- Stack is React + Vite (JavaScript, no TypeScript), Framer Motion for animation, react-icons for icons — per spec.
- One-page site with anchors: `sobre`, `servicos`, `experiencias`, `projetos`, `habilidades`, `contato` — per spec.
- Color tokens: `--bg: #0a0a0a`, `--bg-alt: #050505`, `--bg-alt-2: #111111`, `--accent: #2dd4bf`, `--accent-dark: #14b8a6`, `--text: #eafffb`, `--text-muted: #8a9a97` — per spec.
- Headings font: Space Grotesk (Google Fonts). Body font: Inter (Google Fonts) — per spec.
- All content is placeholder and must be marked `// EDITAR AQUI` in `src/data/content.js` — per spec.
- No contact form/backend, no deploy step, no i18n — site is Portuguese-only — per spec (out of scope).
- Custom cursor is desktop-only; disabled on touch devices (`pointer: coarse`) — per spec.
- Verification bar: `npm run build` with no errors, `npm run lint` clean, manual responsive/QA pass — per spec.

---

### Task 1: Project scaffold (Vite + React + Vitest + ESLint)

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/test/setup.js`
- Create: `src/App.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Produces: default export `App` from `src/App.jsx` (placeholder in this task, replaced in Task 17).
- Produces: global test setup at `src/test/setup.js` (provides `IntersectionObserver`, `matchMedia`, `requestAnimationFrame`/`cancelAnimationFrame` mocks + `@testing-library/jest-dom` matchers) — every later component test relies on this running automatically via `vite.config.js`'s `test.setupFiles`.
- Produces: CSS custom properties on `:root` in `src/index.css` (`--bg`, `--bg-alt`, `--bg-alt-2`, `--accent`, `--accent-dark`, `--text`, `--text-muted`, `--border`, `--font-heading`, `--font-body`, `--max-width`) plus shared classes `.section-label`, `.section-title`, `.btn`, `.btn--primary`, `.btn--outline`, `.btn--ghost` — every later component's CSS relies on these tokens/classes existing.
- Produces: npm scripts `dev`, `build`, `preview`, `lint`, `test`.

- [ ] **Step 1: Initialize package.json**

Run: `npm init -y`

- [ ] **Step 2: Install runtime dependencies**

Run: `npm install react react-dom framer-motion react-icons`

- [ ] **Step 3: Install dev dependencies**

Run: `npm install -D vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals`

- [ ] **Step 4: Edit package.json — add "type": "module" and scripts**

Edit `package.json` so it includes:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

(Keep the `dependencies`/`devDependencies` that `npm install` already wrote — only add `"type"` and `"scripts"`.)

- [ ] **Step 5: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
});
```

- [ ] **Step 6: Create eslint.config.js**

```js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
```

- [ ] **Step 7: Create index.html**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Portfólio de Luccas Madia — desenvolvimento, administração e gestão de projetos." />
    <title>Luccas Madia — Portfólio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/main.jsx**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 9: Create src/index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0a0a0a;
  --bg-alt: #050505;
  --bg-alt-2: #111111;
  --accent: #2dd4bf;
  --accent-dark: #14b8a6;
  --text: #eafffb;
  --text-muted: #8a9a97;
  --border: rgba(45, 212, 191, 0.2);
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --max-width: 1120px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  cursor: none;
}

@media (pointer: coarse) {
  body {
    cursor: auto;
  }
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

.section-label {
  color: var(--accent);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn--primary {
  background: var(--accent);
  color: #04211c;
}
.btn--primary:hover {
  background: var(--accent-dark);
}

.btn--outline {
  border: 1px solid var(--accent);
  color: var(--accent);
}
.btn--outline:hover {
  background: rgba(45, 212, 191, 0.1);
}

.btn--ghost {
  color: var(--text-muted);
}
.btn--ghost:hover {
  color: var(--text);
}
```

- [ ] **Step 10: Create src/test/setup.js**

```js
import '@testing-library/jest-dom';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = IntersectionObserverMock;
  global.IntersectionObserver = IntersectionObserverMock;
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}
```

- [ ] **Step 11: Write the failing smoke test**

```jsx
// src/App.test.jsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Portfólio em construção')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/App.jsx` does not exist yet.

- [ ] **Step 13: Create the placeholder App.jsx**

```jsx
// src/App.jsx
function App() {
  return <div className="app-placeholder">Portfólio em construção</div>;
}

export default App;
```

- [ ] **Step 14: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS (1 test).

- [ ] **Step 15: Verify build and lint**

Run: `npm run build`
Expected: build succeeds, `dist/` created.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json vite.config.js eslint.config.js index.html src/main.jsx src/index.css src/test/setup.js src/App.jsx src/App.test.jsx
git commit -m "chore: scaffold Vite + React project with Vitest and ESLint"
```

---

### Task 2: Content data file

**Files:**
- Create: `src/data/content.js`
- Test: `src/data/content.test.js`

**Interfaces:**
- Produces: named exports `about`, `services`, `experiences`, `projects`, `skills`, `socials` from `src/data/content.js`.
  - `about`: `{ name, role, tagline, bio, yearsExperience, projectsDelivered }`
  - `services`: `Array<{ id, title, description, icon }>` — `icon` is a string key into the icon map built in Task 3.
  - `experiences`: `Array<{ id, role, company, period, description }>`
  - `projects`: `Array<{ id, title, description, stack: string[], liveUrl, codeUrl }>`
  - `skills`: `Array<{ category, items: Array<{ name, icon }> }>` — `icon` is a string key into the icon map built in Task 3.
  - `socials`: `{ whatsapp, linkedin, github }` — full URLs.
- These shapes are consumed as-is by every section component in Tasks 9–16.

- [ ] **Step 1: Write the failing test**

```js
// src/data/content.test.js
import { about, services, experiences, projects, skills, socials } from './content';

describe('content data', () => {
  it('exports a well-formed about object', () => {
    expect(about).toMatchObject({
      name: expect.any(String),
      role: expect.any(String),
      tagline: expect.any(String),
      bio: expect.any(String),
      yearsExperience: expect.any(Number),
      projectsDelivered: expect.any(Number),
    });
  });

  it('exports non-empty services with required fields', () => {
    expect(services.length).toBeGreaterThan(0);
    services.forEach((service) => {
      expect(service).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
      });
    });
  });

  it('exports non-empty experiences with required fields', () => {
    expect(experiences.length).toBeGreaterThan(0);
    experiences.forEach((item) => {
      expect(item).toMatchObject({
        id: expect.any(String),
        role: expect.any(String),
        company: expect.any(String),
        period: expect.any(String),
        description: expect.any(String),
      });
    });
  });

  it('exports non-empty projects with a stack array', () => {
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((project) => {
      expect(project).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        liveUrl: expect.any(String),
        codeUrl: expect.any(String),
      });
      expect(Array.isArray(project.stack)).toBe(true);
      expect(project.stack.length).toBeGreaterThan(0);
    });
  });

  it('exports non-empty skill categories with items', () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((group) => {
      expect(group.category).toEqual(expect.any(String));
      expect(group.items.length).toBeGreaterThan(0);
      group.items.forEach((item) => {
        expect(item).toMatchObject({ name: expect.any(String), icon: expect.any(String) });
      });
    });
  });

  it('exports all three social links', () => {
    expect(socials).toMatchObject({
      whatsapp: expect.any(String),
      linkedin: expect.any(String),
      github: expect.any(String),
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/data/content.test.js`
Expected: FAIL — `src/data/content.js` does not exist.

- [ ] **Step 3: Create the content data file**

```js
// src/data/content.js
// EDITAR AQUI: troque todo o conteúdo abaixo pelas suas informações reais.

export const about = {
  name: 'Luccas Madia',
  role: 'Desenvolvedor & Consultor de Gestão',
  tagline: 'Desenvolvimento, Administração e Gestão de Projetos',
  bio: 'Texto de apresentação curto sobre você, sua trajetória e o que você faz. Substitua por um resumo real de 2-3 frases.',
  yearsExperience: 3,
  projectsDelivered: 12,
};

export const services = [
  {
    id: 'web-dev',
    title: 'Desenvolvimento Web',
    description: 'Criação de sites e aplicações web modernas, responsivas e performáticas.',
    icon: 'FaCode',
  },
  {
    id: 'consulting',
    title: 'Consultoria em Gestão',
    description: 'Análise e otimização de processos administrativos e de negócio.',
    icon: 'FaChartLine',
  },
  {
    id: 'automation',
    title: 'Automação de Processos',
    description: 'Automatização de tarefas repetitivas para ganho de eficiência.',
    icon: 'FaRobot',
  },
  {
    id: 'support',
    title: 'Suporte Administrativo',
    description: 'Apoio na organização e gestão administrativa de projetos e equipes.',
    icon: 'FaClipboardList',
  },
];

export const experiences = [
  {
    id: 'exp-1',
    role: 'Cargo Placeholder',
    company: 'Empresa Placeholder',
    period: '2024 — Atual',
    description: 'Descrição das responsabilidades e conquistas nesse cargo.',
  },
  {
    id: 'exp-2',
    role: 'Cargo Anterior',
    company: 'Empresa Anterior',
    period: '2022 — 2024',
    description: 'Descrição das responsabilidades e conquistas nesse cargo.',
  },
  {
    id: 'exp-3',
    role: 'Primeiro Cargo',
    company: 'Primeira Empresa',
    period: '2020 — 2022',
    description: 'Descrição das responsabilidades e conquistas nesse cargo.',
  },
];

export const projects = [
  {
    id: 'proj-1',
    title: 'Projeto Um',
    description: 'Breve descrição do projeto e o problema que ele resolve.',
    stack: ['React', 'Node.js'],
    liveUrl: 'https://example.com',
    codeUrl: 'https://github.com/seu-usuario/projeto-um',
  },
  {
    id: 'proj-2',
    title: 'Projeto Dois',
    description: 'Breve descrição do projeto e o problema que ele resolve.',
    stack: ['Vite', 'Tailwind'],
    liveUrl: 'https://example.com',
    codeUrl: 'https://github.com/seu-usuario/projeto-dois',
  },
  {
    id: 'proj-3',
    title: 'Projeto Três',
    description: 'Breve descrição do projeto e o problema que ele resolve.',
    stack: ['Python', 'Django'],
    liveUrl: 'https://example.com',
    codeUrl: 'https://github.com/seu-usuario/projeto-tres',
  },
];

export const skills = [
  {
    category: 'Desenvolvimento',
    items: [
      { name: 'JavaScript', icon: 'FaJs' },
      { name: 'React', icon: 'FaReact' },
      { name: 'Node.js', icon: 'FaNodeJs' },
    ],
  },
  {
    category: 'Gestão',
    items: [
      { name: 'Gestão de Projetos', icon: 'FaTasks' },
      { name: 'Excel Avançado', icon: 'FaFileExcel' },
    ],
  },
  {
    category: 'Ferramentas',
    items: [
      { name: 'Git', icon: 'FaGitAlt' },
      { name: 'Figma', icon: 'FaFigma' },
    ],
  },
];

export const socials = {
  whatsapp: 'https://wa.me/5500000000000',
  linkedin: 'https://linkedin.com/in/seu-usuario',
  github: 'https://github.com/seu-usuario',
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/data/content.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/content.js src/data/content.test.js
git commit -m "feat: add placeholder content data"
```

---

### Task 3: Icon map utility

**Files:**
- Create: `src/utils/icons.js`
- Test: `src/utils/icons.test.js`

**Interfaces:**
- Produces: named export `iconMap` from `src/utils/icons.js` — an object keyed by the exact icon strings used in `content.js` (`FaCode`, `FaChartLine`, `FaRobot`, `FaClipboardList`, `FaReact`, `FaNodeJs`, `FaJs`, `FaTasks`, `FaFileExcel`, `FaGitAlt`, `FaFigma`), each value a React component from `react-icons/fa`.
- Consumed by `Services` (Task 11) and `Skills` (Task 14) to resolve `icon` strings from content data into rendered icons.

- [ ] **Step 1: Write the failing test**

```js
// src/utils/icons.test.js
import { iconMap } from './icons';

describe('iconMap', () => {
  it('maps every content icon key to a component', () => {
    const keys = [
      'FaCode',
      'FaChartLine',
      'FaRobot',
      'FaClipboardList',
      'FaReact',
      'FaNodeJs',
      'FaJs',
      'FaTasks',
      'FaFileExcel',
      'FaGitAlt',
      'FaFigma',
    ];

    keys.forEach((key) => {
      expect(typeof iconMap[key]).toBe('function');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/utils/icons.test.js`
Expected: FAIL — `src/utils/icons.js` does not exist.

- [ ] **Step 3: Create the icon map**

```js
// src/utils/icons.js
import {
  FaCode,
  FaChartLine,
  FaRobot,
  FaClipboardList,
  FaReact,
  FaNodeJs,
  FaJs,
  FaTasks,
  FaFileExcel,
  FaGitAlt,
  FaFigma,
} from 'react-icons/fa';

export const iconMap = {
  FaCode,
  FaChartLine,
  FaRobot,
  FaClipboardList,
  FaReact,
  FaNodeJs,
  FaJs,
  FaTasks,
  FaFileExcel,
  FaGitAlt,
  FaFigma,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/utils/icons.test.js`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/utils/icons.js src/utils/icons.test.js
git commit -m "feat: add icon map utility"
```

---

### Task 4: useTypingEffect hook

**Files:**
- Create: `src/hooks/useTypingEffect.js`
- Test: `src/hooks/useTypingEffect.test.jsx`

**Interfaces:**
- Produces: named export `useTypingEffect(text, speed = 40)` returning `{ displayedText: string, isDone: boolean }`.
- Consumed by `Hero` (Task 10) to type out `about.tagline`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/hooks/useTypingEffect.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { useTypingEffect } from './useTypingEffect';

function TestComponent({ text }) {
  const { displayedText } = useTypingEffect(text, 5);
  return <span data-testid="output">{displayedText}</span>;
}

describe('useTypingEffect', () => {
  it('starts with an empty string', () => {
    render(<TestComponent text="Oi" />);
    expect(screen.getByTestId('output').textContent).toBe('');
  });

  it('types out the full text over time', async () => {
    render(<TestComponent text="Oi" />);
    await waitFor(() => expect(screen.getByTestId('output').textContent).toBe('Oi'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useTypingEffect.test.jsx`
Expected: FAIL — `src/hooks/useTypingEffect.js` does not exist.

- [ ] **Step 3: Implement the hook**

```js
// src/hooks/useTypingEffect.js
import { useEffect, useState } from 'react';

export function useTypingEffect(text, speed = 40) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);

    if (!text) {
      setIsDone(true);
      return undefined;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isDone };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/hooks/useTypingEffect.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTypingEffect.js src/hooks/useTypingEffect.test.jsx
git commit -m "feat: add useTypingEffect hook"
```

---

### Task 5: useActiveSection hook

**Files:**
- Create: `src/hooks/useActiveSection.js`
- Test: `src/hooks/useActiveSection.test.js`

**Interfaces:**
- Produces: named export `useActiveSection(sectionIds: string[])` returning the currently active section id (`string | null`), defaulting to `sectionIds[0]`.
- Consumed by `Header` (Task 9) to highlight the nav link matching the section currently in view.

- [ ] **Step 1: Write the failing test**

```js
// src/hooks/useActiveSection.test.js
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
    IntersectionObserverStub.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
IntersectionObserverStub.instances = [];

describe('useActiveSection', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = [];
    global.IntersectionObserver = IntersectionObserverStub;
    document.body.innerHTML = '<div id="sobre"></div><div id="projetos"></div>';
  });

  it('defaults to the first section id', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'projetos']));
    expect(result.current).toBe('sobre');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'projetos']));
    const observerInstance = IntersectionObserverStub.instances[0];

    act(() => {
      observerInstance.callback([
        { isIntersecting: true, target: document.getElementById('projetos') },
      ]);
    });

    expect(result.current).toBe('projetos');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useActiveSection.test.js`
Expected: FAIL — `src/hooks/useActiveSection.js` does not exist.

- [ ] **Step 3: Implement the hook**

```js
// src/hooks/useActiveSection.js
import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/hooks/useActiveSection.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActiveSection.js src/hooks/useActiveSection.test.js
git commit -m "feat: add useActiveSection hook"
```

---

### Task 6: AnimatedSection component

**Files:**
- Create: `src/components/AnimatedSection/AnimatedSection.jsx`
- Test: `src/components/AnimatedSection/AnimatedSection.test.jsx`

**Interfaces:**
- Produces: named export `AnimatedSection({ id, className, children, delay })` — renders a `<section>` with the given `id`/`className` that fades and slides in via Framer Motion's `whileInView`.
- Consumed by `Services`, `Experience`, `Projects`, `Skills`, `Contact` (Tasks 11–15) to wrap each section.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/AnimatedSection/AnimatedSection.test.jsx
import { render, screen } from '@testing-library/react';
import { AnimatedSection } from './AnimatedSection';

describe('AnimatedSection', () => {
  it('renders its children inside a section with the given id and class', () => {
    render(
      <AnimatedSection id="teste" className="test-class">
        <p>Conteúdo</p>
      </AnimatedSection>
    );

    const section = document.getElementById('teste');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('test-class');
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/AnimatedSection/AnimatedSection.test.jsx`
Expected: FAIL — `AnimatedSection.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/AnimatedSection/AnimatedSection.jsx
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedSection({ id, className, children, delay = 0 }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/AnimatedSection/AnimatedSection.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/AnimatedSection/AnimatedSection.jsx src/components/AnimatedSection/AnimatedSection.test.jsx
git commit -m "feat: add AnimatedSection wrapper component"
```

---

### Task 7: CustomCursor component

**Files:**
- Create: `src/components/CustomCursor/CustomCursor.jsx`
- Create: `src/components/CustomCursor/CustomCursor.css`
- Test: `src/components/CustomCursor/CustomCursor.test.jsx`

**Interfaces:**
- Produces: named export `CustomCursor()` — renders a `div[data-testid="custom-cursor"]` that follows the mouse on desktop, renders `null` when `window.matchMedia('(pointer: coarse)').matches` is `true`.
- Consumed by `App` (Task 17), mounted once at the root.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/CustomCursor/CustomCursor.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomCursor } from './CustomCursor';

function mockMatchMedia(matches) {
  window.matchMedia = () => ({
    matches,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

describe('CustomCursor', () => {
  it('does not render on touch devices', () => {
    mockMatchMedia(true);
    render(<CustomCursor />);
    expect(screen.queryByTestId('custom-cursor')).not.toBeInTheDocument();
  });

  it('follows the mouse position on desktop', () => {
    mockMatchMedia(false);
    render(<CustomCursor />);
    const cursor = screen.getByTestId('custom-cursor');

    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });

    expect(cursor.style.transform).toBe('translate(120px, 80px)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/CustomCursor/CustomCursor.test.jsx`
Expected: FAIL — `CustomCursor.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/CustomCursor/CustomCursor.jsx
import { useEffect, useState } from 'react';
import './CustomCursor.css';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    if (isTouch) return undefined;

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      className="custom-cursor"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      data-testid="custom-cursor"
    />
  );
}
```

```css
/* src/components/CustomCursor/CustomCursor.css */
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  background: var(--accent);
  pointer-events: none;
  z-index: 999;
  mix-blend-mode: difference;
  transition: transform 0.08s ease-out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/CustomCursor/CustomCursor.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/CustomCursor/CustomCursor.jsx src/components/CustomCursor/CustomCursor.css src/components/CustomCursor/CustomCursor.test.jsx
git commit -m "feat: add CustomCursor component (desktop only)"
```

---

### Task 8: AnimatedCounter component

**Files:**
- Create: `src/hooks/useAnimatedCounter.js`
- Create: `src/components/AnimatedCounter/AnimatedCounter.jsx`
- Test: `src/components/AnimatedCounter/AnimatedCounter.test.jsx`

**Interfaces:**
- Produces: named export `useAnimatedCounter(target: number, duration = 1200)` returning the current animated numeric value.
- Produces: named export `AnimatedCounter({ target, suffix = '', duration = 1200 })` — renders `<span className="animated-counter">{value}{suffix}</span>`.
- Consumed by `Skills` (Task 14) for the "years of experience" / "projects delivered" stats.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/AnimatedCounter/AnimatedCounter.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { AnimatedCounter } from './AnimatedCounter';

describe('AnimatedCounter', () => {
  it('starts at zero', () => {
    render(<AnimatedCounter target={12} duration={2000} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('counts up to the target value with the given suffix', async () => {
    render(<AnimatedCounter target={12} suffix="+" duration={50} />);
    await waitFor(() => expect(screen.getByText('12+')).toBeInTheDocument(), { timeout: 1000 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/AnimatedCounter/AnimatedCounter.test.jsx`
Expected: FAIL — `AnimatedCounter.jsx` does not exist.

- [ ] **Step 3: Implement the hook and component**

```js
// src/hooks/useAnimatedCounter.js
import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    let frame;
    startRef.current = null;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      setValue(Math.floor(progress * target));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
```

```jsx
// src/components/AnimatedCounter/AnimatedCounter.jsx
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export function AnimatedCounter({ target, suffix = '', duration = 1200 }) {
  const value = useAnimatedCounter(target, duration);
  return (
    <span className="animated-counter">
      {value}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/AnimatedCounter/AnimatedCounter.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAnimatedCounter.js src/components/AnimatedCounter/AnimatedCounter.jsx src/components/AnimatedCounter/AnimatedCounter.test.jsx
git commit -m "feat: add AnimatedCounter component"
```

---

### Task 9: Header component

**Files:**
- Create: `src/components/Header/Header.jsx`
- Create: `src/components/Header/Header.css`
- Test: `src/components/Header/Header.test.jsx`

**Interfaces:**
- Consumes: `useActiveSection(sectionIds: string[])` from `src/hooks/useActiveSection.js` (Task 5).
- Produces: named export `Header({ name })` — fixed nav with 6 anchor links (Sobre, Serviços, Experiências, Projetos, Habilidades, Contato), hamburger toggle below 768px.
- Consumed by `App` (Task 17) with `name={about.name}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Header/Header.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders a link for every nav section', () => {
    render(<Header name="Luccas Madia" />);

    ['Sobre', 'Serviços', 'Experiências', 'Projetos', 'Habilidades', 'Contato'].forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('toggles the mobile menu when the hamburger button is clicked', () => {
    render(<Header name="Luccas Madia" />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu when a nav link is clicked', () => {
    render(<Header name="Luccas Madia" />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('link', { name: 'Projetos' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Header/Header.test.jsx`
Expected: FAIL — `Header.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Header/Header.jsx
import { useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import './Header.css';

const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'experiencias', label: 'Experiências' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'contato', label: 'Contato' },
];

export function Header({ name }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#sobre" className="header__logo">
          {name}
        </a>
        <button
          type="button"
          className="header__toggle"
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`header__link ${activeId === item.id ? 'header__link--active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

```css
/* src/components/Header/Header.css */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text);
}

.header__nav {
  display: flex;
  gap: 1.5rem;
}

.header__link {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.header__link:hover,
.header__link--active {
  color: var(--accent);
}

.header__toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.header__toggle span {
  width: 22px;
  height: 2px;
  background: var(--accent);
}

@media (max-width: 768px) {
  .header__toggle {
    display: flex;
  }

  .header__nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-alt);
    padding: 1rem 1.5rem;
    gap: 1rem;
    display: none;
  }

  .header__nav--open {
    display: flex;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Header/Header.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Header/Header.jsx src/components/Header/Header.css src/components/Header/Header.test.jsx
git commit -m "feat: add Header component with active-link nav"
```

---

### Task 10: Hero component

**Files:**
- Create: `src/components/Hero/Hero.jsx`
- Create: `src/components/Hero/Hero.css`
- Test: `src/components/Hero/Hero.test.jsx`

**Interfaces:**
- Consumes: `useTypingEffect(text, speed)` from `src/hooks/useTypingEffect.js` (Task 4).
- Produces: named export `Hero({ about })` — `about` matches the shape from `src/data/content.js` (Task 2). Renders `<section id="sobre">`.
- Consumed by `App` (Task 17) with `about={about}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Hero/Hero.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { Hero } from './Hero';

const about = {
  name: 'Luccas Madia',
  tagline: 'Dev',
  bio: 'Bio de teste.',
};

describe('Hero', () => {
  it('renders the name, bio and CTAs', async () => {
    render(<Hero about={about} />);

    expect(screen.getByRole('heading', { name: 'Luccas Madia' })).toBeInTheDocument();
    expect(screen.getByText('Bio de teste.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '#projetos');
    expect(screen.getByRole('link', { name: 'Fale comigo' })).toHaveAttribute('href', '#contato');

    await waitFor(() => {
      expect(screen.getByText('Dev', { exact: false })).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Hero/Hero.test.jsx`
Expected: FAIL — `Hero.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Hero/Hero.jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import './Hero.css';

export function Hero({ about }) {
  const { displayedText } = useTypingEffect(about.tagline, 40);
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 400], [0, 120]);

  return (
    <section id="sobre" className="hero">
      <motion.div className="hero__glow" style={{ y: glowY }} aria-hidden="true" />
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="hero__eyebrow">Portfólio</p>
        <h1 className="hero__name">{about.name}</h1>
        <p className="hero__tagline">
          {displayedText}
          <span className="hero__cursor" aria-hidden="true">
            |
          </span>
        </p>
        <p className="hero__bio">{about.bio}</p>
        <div className="hero__actions">
          <a href="#projetos" className="btn btn--primary">
            Ver projetos
          </a>
          <a href="#contato" className="btn btn--outline">
            Fale comigo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
```

```css
/* src/components/Hero/Hero.css */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 8rem 1.5rem 4rem;
  overflow: hidden;
}

.hero__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.25), transparent 70%);
  filter: blur(10px);
  pointer-events: none;
}

.hero__content {
  max-width: 640px;
  margin: 0 auto;
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

.hero__cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Hero/Hero.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.css src/components/Hero/Hero.test.jsx
git commit -m "feat: add Hero component with typing effect and parallax glow"
```

---

### Task 11: Services component

**Files:**
- Create: `src/components/Services/Services.jsx`
- Create: `src/components/Services/Services.css`
- Test: `src/components/Services/Services.test.jsx`

**Interfaces:**
- Consumes: `AnimatedSection` (Task 6), `iconMap` (Task 3).
- Produces: named export `Services({ services })` — `services` matches the shape from `src/data/content.js` (Task 2). Renders `<section id="servicos">` with one card per service.
- Consumed by `App` (Task 17) with `services={services}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Services/Services.test.jsx
import { render, screen } from '@testing-library/react';
import { Services } from './Services';

const services = [
  { id: 's1', title: 'Serviço 1', description: 'Descrição 1', icon: 'FaCode' },
  { id: 's2', title: 'Serviço 2', description: 'Descrição 2', icon: 'FaRobot' },
];

describe('Services', () => {
  it('renders a card for each service', () => {
    render(<Services services={services} />);

    expect(screen.getByRole('heading', { name: 'Serviço 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Serviço 2' })).toBeInTheDocument();
    expect(screen.getByText('Descrição 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição 2')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Services/Services.test.jsx`
Expected: FAIL — `Services.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Services/Services.jsx
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { iconMap } from '../../utils/icons';
import './Services.css';

export function Services({ services }) {
  return (
    <AnimatedSection id="servicos" className="services">
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <div className="service-card" key={service.id}>
              {Icon && <Icon className="service-card__icon" aria-hidden="true" />}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
```

```css
/* src/components/Services/Services.css */
.services {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.service-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.5rem;
  background: var(--bg-alt-2);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.service-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
}

.service-card__icon {
  color: var(--accent);
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.service-card h3 {
  margin-bottom: 0.5rem;
}

.service-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Services/Services.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Services/Services.jsx src/components/Services/Services.css src/components/Services/Services.test.jsx
git commit -m "feat: add Services component"
```

---

### Task 12: Experience component

**Files:**
- Create: `src/components/Experience/Experience.jsx`
- Create: `src/components/Experience/Experience.css`
- Test: `src/components/Experience/Experience.test.jsx`

**Interfaces:**
- Consumes: `AnimatedSection` (Task 6).
- Produces: named export `Experience({ experiences })` — `experiences` matches the shape from `src/data/content.js` (Task 2). Renders `<section id="experiencias">` as a vertical timeline.
- Consumed by `App` (Task 17) with `experiences={experiences}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Experience/Experience.test.jsx
import { render, screen } from '@testing-library/react';
import { Experience } from './Experience';

const experiences = [
  { id: 'e1', role: 'Cargo A', company: 'Empresa A', period: '2023 — Atual', description: 'Descrição A' },
  { id: 'e2', role: 'Cargo B', company: 'Empresa B', period: '2021 — 2023', description: 'Descrição B' },
];

describe('Experience', () => {
  it('renders one timeline item per experience', () => {
    render(<Experience experiences={experiences} />);

    expect(screen.getByRole('heading', { name: 'Cargo A · Empresa A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cargo B · Empresa B' })).toBeInTheDocument();
    expect(screen.getByText('2023 — Atual')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Experience/Experience.test.jsx`
Expected: FAIL — `Experience.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Experience/Experience.jsx
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Experience.css';

export function Experience({ experiences }) {
  return (
    <AnimatedSection id="experiencias" className="experience">
      <p className="section-label">Trajetória</p>
      <h2 className="section-title">Experiências</h2>
      <ol className="experience__timeline">
        {experiences.map((item) => (
          <li key={item.id} className="experience__item">
            <div className="experience__marker" aria-hidden="true" />
            <div className="experience__content">
              <p className="experience__period">{item.period}</p>
              <h3>
                {item.role} · {item.company}
              </h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </AnimatedSection>
  );
}
```

```css
/* src/components/Experience/Experience.css */
.experience {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem;
}

.experience__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid var(--border);
}

.experience__item {
  position: relative;
  padding: 0 0 2.5rem 2rem;
}

.experience__marker {
  position: absolute;
  left: -7px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
}

.experience__period {
  color: var(--accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.experience__content h3 {
  margin-bottom: 0.5rem;
}

.experience__content p {
  color: var(--text-muted);
  line-height: 1.5;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Experience/Experience.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Experience/Experience.jsx src/components/Experience/Experience.css src/components/Experience/Experience.test.jsx
git commit -m "feat: add Experience timeline component"
```

---

### Task 13: Projects component

**Files:**
- Create: `src/components/Projects/Projects.jsx`
- Create: `src/components/Projects/Projects.css`
- Test: `src/components/Projects/Projects.test.jsx`

**Interfaces:**
- Consumes: `AnimatedSection` (Task 6).
- Produces: named export `Projects({ projects })` — `projects` matches the shape from `src/data/content.js` (Task 2). Renders `<section id="projetos">` as a card grid, with `liveUrl`/`codeUrl` links opening in a new tab.
- Consumed by `App` (Task 17) with `projects={projects}`.

- [ ] **Step 1: Write the failing test**

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
];

describe('Projects', () => {
  it('renders project details and links that open in a new tab', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();

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
Expected: FAIL — `Projects.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Projects/Projects.jsx
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Projects.css';

export function Projects({ projects }) {
  return (
    <AnimatedSection id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <div className="projects__grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="project-card__stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-card__actions">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Ver projeto
              </a>
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                Código
              </a>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
```

```css
/* src/components/Projects/Projects.css */
.projects {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.project-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.5rem;
  background: var(--bg-alt-2);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 24px rgba(45, 212, 191, 0.15);
}

.project-card h3 {
  margin-bottom: 0.5rem;
}

.project-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.project-card__stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0 0 1.25rem;
}

.project-card__stack li {
  font-size: 0.75rem;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
}

.project-card__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Projects/Projects.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects/Projects.jsx src/components/Projects/Projects.css src/components/Projects/Projects.test.jsx
git commit -m "feat: add Projects grid component"
```

---

### Task 14: Skills component

**Files:**
- Create: `src/components/Skills/Skills.jsx`
- Create: `src/components/Skills/Skills.css`
- Test: `src/components/Skills/Skills.test.jsx`

**Interfaces:**
- Consumes: `AnimatedSection` (Task 6), `AnimatedCounter` (Task 8), `iconMap` (Task 3).
- Produces: named export `Skills({ skills, about })` — `skills` and `about` match the shapes from `src/data/content.js` (Task 2). Renders `<section id="habilidades">` with two animated stats and grouped skill badges.
- Consumed by `App` (Task 17) with `skills={skills}` and `about={about}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Skills/Skills.test.jsx
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

const skills = [
  { category: 'Desenvolvimento', items: [{ name: 'React', icon: 'FaReact' }] },
  { category: 'Gestão', items: [{ name: 'Gestão de Projetos', icon: 'FaTasks' }] },
];

const about = { yearsExperience: 3, projectsDelivered: 12 };

describe('Skills', () => {
  it('renders every category and its badges', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByRole('heading', { name: 'Desenvolvimento' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gestão' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Projetos')).toBeInTheDocument();
  });

  it('renders the stat labels', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByText('anos de experiência')).toBeInTheDocument();
    expect(screen.getByText('projetos entregues')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Skills/Skills.test.jsx`
Expected: FAIL — `Skills.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Skills/Skills.jsx
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { AnimatedCounter } from '../AnimatedCounter/AnimatedCounter';
import { iconMap } from '../../utils/icons';
import './Skills.css';

export function Skills({ skills, about }) {
  return (
    <AnimatedSection id="habilidades" className="skills">
      <p className="section-label">Competências</p>
      <h2 className="section-title">Habilidades</h2>

      <div className="skills__stats">
        <div className="skills__stat">
          <AnimatedCounter target={about.yearsExperience} suffix="+" />
          <p>anos de experiência</p>
        </div>
        <div className="skills__stat">
          <AnimatedCounter target={about.projectsDelivered} suffix="+" />
          <p>projetos entregues</p>
        </div>
      </div>

      {skills.map((group) => (
        <div className="skills__group" key={group.category}>
          <h3>{group.category}</h3>
          <ul className="skills__badges">
            {group.items.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li className="skills__badge" key={item.name}>
                  {Icon && <Icon aria-hidden="true" />}
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </AnimatedSection>
  );
}
```

```css
/* src/components/Skills/Skills.css */
.skills {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem;
}

.skills__stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
}

.skills__stat span {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--accent);
  display: block;
}

.skills__stat p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
}

.skills__group {
  margin-bottom: 2rem;
}

.skills__group h3 {
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: 1rem;
}

.skills__badges {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.skills__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  color: var(--text);
}

.skills__badge svg {
  color: var(--accent);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Skills/Skills.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills/Skills.jsx src/components/Skills/Skills.css src/components/Skills/Skills.test.jsx
git commit -m "feat: add Skills component with animated stats"
```

---

### Task 15: Contact component

**Files:**
- Create: `src/components/Contact/Contact.jsx`
- Create: `src/components/Contact/Contact.css`
- Test: `src/components/Contact/Contact.test.jsx`

**Interfaces:**
- Consumes: `AnimatedSection` (Task 6).
- Produces: named export `Contact({ socials })` — `socials` matches the shape from `src/data/content.js` (Task 2): `{ whatsapp, linkedin, github }`. Renders `<section id="contato">` with 3 external link cards.
- Consumed by `App` (Task 17) with `socials={socials}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Contact/Contact.test.jsx
import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';

const socials = {
  whatsapp: 'https://wa.me/5500000000000',
  linkedin: 'https://linkedin.com/in/test',
  github: 'https://github.com/test',
};

describe('Contact', () => {
  it('renders a link for each social channel with the correct href', () => {
    render(<Contact socials={socials} />);

    expect(screen.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute('href', socials.whatsapp);
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', socials.linkedin);
    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', socials.github);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Contact/Contact.test.jsx`
Expected: FAIL — `Contact.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Contact/Contact.jsx
import { FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Contact.css';

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin },
  { key: 'github', label: 'GitHub', Icon: FaGithub },
];

export function Contact({ socials }) {
  return (
    <AnimatedSection id="contato" className="contact">
      <p className="section-label">Vamos conversar</p>
      <h2 className="section-title">Contato</h2>
      <div className="contact__grid">
        {CHANNELS.map(({ key, label, Icon }) => (
          <a key={key} href={socials[key]} target="_blank" rel="noopener noreferrer" className="contact__card">
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </AnimatedSection>
  );
}
```

```css
/* src/components/Contact/Contact.css */
.contact {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 6rem 1.5rem 8rem;
}

.contact__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.contact__card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text);
  transition: border-color 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.contact__card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  color: var(--accent);
}

.contact__card svg {
  font-size: 1.75rem;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Contact/Contact.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact/Contact.jsx src/components/Contact/Contact.css src/components/Contact/Contact.test.jsx
git commit -m "feat: add Contact component"
```

---

### Task 16: Footer component

**Files:**
- Create: `src/components/Footer/Footer.jsx`
- Create: `src/components/Footer/Footer.css`
- Test: `src/components/Footer/Footer.test.jsx`

**Interfaces:**
- Produces: named export `Footer({ name })` — renders a `<footer>` with copyright text (current year + `name`) and quick links.
- Consumed by `App` (Task 17) with `name={about.name}`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/Footer/Footer.test.jsx
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the current year and the given name', () => {
    render(<Footer name="Luccas Madia" />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}.*Luccas Madia`))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Footer/Footer.test.jsx`
Expected: FAIL — `Footer.jsx` does not exist.

- [ ] **Step 3: Implement the component**

```jsx
// src/components/Footer/Footer.jsx
import './Footer.css';

export function Footer({ name }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {year} {name}. Todos os direitos reservados.
      </p>
      <div className="footer__links">
        <a href="#sobre">Sobre</a>
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
      </div>
    </footer>
  );
}
```

```css
/* src/components/Footer/Footer.css */
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer__links {
  display: flex;
  gap: 1rem;
}

.footer__links a:hover {
  color: var(--accent);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/Footer/Footer.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer/Footer.jsx src/components/Footer/Footer.css src/components/Footer/Footer.test.jsx
git commit -m "feat: add Footer component"
```

---

### Task 17: Wire the full page together and final QA

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: `Header` (Task 9), `Hero` (Task 10), `Services` (Task 11), `Experience` (Task 12), `Projects` (Task 13), `Skills` (Task 14), `Contact` (Task 15), `Footer` (Task 16), `CustomCursor` (Task 7), and `about`/`services`/`experiences`/`projects`/`skills`/`socials` from `src/data/content.js` (Task 2).
- Produces: the final default export `App` — the composed one-page site.

- [ ] **Step 1: Write the failing test (replaces the Task 1 smoke test)**

```jsx
// src/App.test.jsx
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders every top-level section by id', () => {
    const { container } = render(<App />);

    ['sobre', 'servicos', 'experiencias', 'projetos', 'habilidades', 'contato'].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/App.test.jsx`
Expected: FAIL — current `App.jsx` only renders the placeholder div, none of the section ids exist.

- [ ] **Step 3: Wire up the full App**

```jsx
// src/App.jsx
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Services } from './components/Services/Services';
import { Experience } from './components/Experience/Experience';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { about, services, experiences, projects, skills, socials } from './data/content';

function App() {
  return (
    <>
      <CustomCursor />
      <Header name={about.name} />
      <main>
        <Hero about={about} />
        <Services services={services} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Skills skills={skills} about={about} />
        <Contact socials={socials} />
      </main>
      <Footer name={about.name} />
    </>
  );
}

export default App;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/App.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: PASS — all tests across all tasks (App, content, icons, hooks, and every component) green.

- [ ] **Step 6: Verify build and lint**

Run: `npm run build`
Expected: build succeeds with no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Manual QA pass**

Run: `npm run dev`, open the printed local URL, and check:
- All 6 sections render in order and the fade-in animations play once when scrolled into view.
- Hero tagline types out once on load; blinking cursor animates continuously.
- Nav highlights the correct section while scrolling; hamburger menu opens/closes correctly below 768px.
- Custom cursor follows the mouse on desktop; resize the window to a narrow/touch-emulated viewport in devtools and confirm the native cursor returns and no cursor dot is drawn.
- Projects and Contact links open in a new tab.
- Skills counters animate up to their target values once visible.
- No console errors/warnings.

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat: wire full one-page portfolio layout"
```

---

## Self-Review Notes

- **Spec coverage:** Header/nav (Task 9), Hero/Sobre (Task 10), Serviços (Task 11), Experiências (Task 12), Projetos (Task 13), Habilidades (Task 14), Contato (Task 15), Footer (Task 16), typing effect (Task 4/10), scroll-spy nav (Task 5/9), fade-in animations (Task 6), animated counters (Task 8/14), parallax (Task 10), custom cursor desktop-only (Task 7), color/font tokens (Task 1), placeholder content marked `// EDITAR AQUI` (Task 2), build/lint verification (Tasks 1 and 17) — all spec sections are covered.
- **Placeholder scan:** no TBD/TODO left in any step; all code blocks are complete and runnable as written.
- **Type/interface consistency:** `about`, `services`, `experiences`, `projects`, `skills`, `socials` shapes defined once in Task 2 and referenced identically by every consuming task; `iconMap` keys in Task 3 match every `icon` string used in Task 2's data; `AnimatedCounter`/`useAnimatedCounter` signatures match between Task 8's definition and Task 14's usage.
- **Scope:** matches the approved design doc 1:1; deploy, contact form/backend, and i18n are explicitly out of scope and untouched by this plan.
