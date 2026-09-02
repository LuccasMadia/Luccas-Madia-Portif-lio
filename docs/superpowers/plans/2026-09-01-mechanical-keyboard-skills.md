# Teclado Mecânico na Seção Habilidades — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `LogoLoop` + listas de badges por categoria da seção "Habilidades" por um teclado mecânico interativo, onde cada tecnologia é uma tecla colorida que reage a hover/clique/foco.

**Architecture:** Dado plano unificado (`skills` em `content.js`, sem agrupamento por categoria) alimenta um grid de `motion.button` (framer-motion) dentro de um painel escuro fixo (`.keyboard`). Cada tecla usa CSS custom properties por posição (`nth-child`) para variar cor de fundo e cor de sombra (bevel), e `whileHover`/`whileTap`/`whileFocus` do framer-motion para a elevação/afundamento.

**Tech Stack:** React 19, framer-motion (já instalado), react-icons, Vitest + Testing Library.

## Global Constraints

- O painel do teclado (`.keyboard`) tem fundo escuro fixo, **não** segue o toggle claro/escuro do site (`--bg`/`data-theme`).
- Cores das teclas são fixas e cíclicas (não usam `--accent`/variáveis de tema).
- Sem reação a teclas físicas do teclado do usuário (fora de escopo desta fase).
- Sem perspectiva isométrica 3D — layout frontal com relevo (bevel), responsivo via `grid-template-columns: repeat(auto-fill, minmax(...))`, sem scroll horizontal.
- O contador "X+ projetos entregues" (`AnimatedCounter`) continua acima do teclado, inalterado.
- `LogoLoop` não é removido do projeto (fica disponível para uso futuro), só deixa de ser usado por `Skills`.

---

### Task 1: Adicionar ícones de linguagem ao `iconMap`

**Files:**
- Modify: `src/utils/icons.js`
- Test: `src/utils/icons.test.js`

**Interfaces:**
- Consumes: nada (arquivo de utilitário isolado).
- Produces: `iconMap` (objeto `{ [nomeDoIcone: string]: ComponentType }`) exportado por `src/utils/icons.js`, com as chaves `SiReact`, `SiJavascript`, `SiNodedotjs`, `SiNextdotjs`, `SiPython`, `SiMysql`, `SiHtml5`, `SiCss` além das já existentes. Tasks 2-5 dependem dessas chaves existirem em `iconMap`.

- [ ] **Step 1: Escrever o teste que falha**

Edite `src/utils/icons.test.js` para incluir as novas chaves no array `keys`:

```js
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
      'SiNotion',
      'SiReact',
      'SiJavascript',
      'SiNodedotjs',
      'SiNextdotjs',
      'SiPython',
      'SiMysql',
      'SiHtml5',
      'SiCss',
    ];

    keys.forEach((key) => {
      expect(typeof iconMap[key]).toBe('function');
    });
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run test -- src/utils/icons.test.js`
Expected: FAIL — `expect(typeof iconMap['SiReact']).toBe('function')` recebe `undefined`.

- [ ] **Step 3: Implementar**

Substitua o conteúdo de `src/utils/icons.js` por:

```js
import {
  FaCode,
  FaChartLine,
  FaChartBar,
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
import {
  SiNotion,
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiPython,
  SiMysql,
  SiHtml5,
  SiCss,
} from 'react-icons/si';

export const iconMap = {
  FaCode,
  FaChartLine,
  FaChartBar,
  FaRobot,
  FaClipboardList,
  FaReact,
  FaNodeJs,
  FaJs,
  FaTasks,
  FaFileExcel,
  FaGitAlt,
  FaFigma,
  SiNotion,
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiPython,
  SiMysql,
  SiHtml5,
  SiCss,
};
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm run test -- src/utils/icons.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/icons.js src/utils/icons.test.js
git commit -m "feat: add language icons to iconMap for keyboard skills grid"
```

---

### Task 2: Unificar `skills` em `content.js` num array plano

**Files:**
- Modify: `src/data/content.js:189-206`
- Test: `src/data/content.test.js:47-56`

**Interfaces:**
- Consumes: `iconMap` com as chaves adicionadas na Task 1 (usadas apenas para validar visualmente depois, não neste teste).
- Produces: `export const skills` em `content.js` — agora `Array<{ name: string, icon: string }>` (14 itens), sem `category`/`items`. Tasks 3 e 5 consomem esse formato diretamente.

- [ ] **Step 1: Escrever o teste que falha**

Substitua o teste de skills em `src/data/content.test.js` (linhas 47-56) por:

```js
  it('exports a non-empty flat skills list', () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((item) => {
      expect(item).toMatchObject({ name: expect.any(String), icon: expect.any(String) });
    });
  });
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run test -- src/data/content.test.js`
Expected: FAIL — `item.name` é `undefined` porque `skills[0]` ainda é `{ category, items }`, não `{ name, icon }`.

- [ ] **Step 3: Implementar**

Em `src/data/content.js`, substitua o bloco (linhas 189-206):

```js
export const skills = [
  {
    category: 'Gestão',
    items: [
      { name: 'Gestão de Projetos', icon: 'FaTasks' },
      { name: 'Excel Avançado', icon: 'FaFileExcel' },
      { name: 'Power BI', icon: 'FaChartBar' },
    ],
  },
  {
    category: 'Ferramentas',
    items: [
      { name: 'Git', icon: 'FaGitAlt' },
      { name: 'Figma', icon: 'FaFigma' },
      { name: 'Notion', icon: 'SiNotion' },
    ],
  },
];
```

por:

```js
export const skills = [
  { name: 'React', icon: 'SiReact' },
  { name: 'JavaScript', icon: 'SiJavascript' },
  { name: 'Node.js', icon: 'SiNodedotjs' },
  { name: 'Next.js', icon: 'SiNextdotjs' },
  { name: 'Python', icon: 'SiPython' },
  { name: 'MySQL', icon: 'SiMysql' },
  { name: 'HTML5', icon: 'SiHtml5' },
  { name: 'CSS3', icon: 'SiCss' },
  { name: 'Gestão de Projetos', icon: 'FaTasks' },
  { name: 'Excel Avançado', icon: 'FaFileExcel' },
  { name: 'Power BI', icon: 'FaChartBar' },
  { name: 'Git', icon: 'FaGitAlt' },
  { name: 'Figma', icon: 'FaFigma' },
  { name: 'Notion', icon: 'SiNotion' },
];
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm run test -- src/data/content.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/content.js src/data/content.test.js
git commit -m "feat: flatten skills data into a single list for the keyboard grid"
```

---

### Task 3: Reescrever `Skills.test.jsx` para o novo formato

**Files:**
- Modify: `src/components/Skills/Skills.test.jsx`

**Interfaces:**
- Consumes: componente `Skills` de `src/components/Skills/Skills.jsx` (ainda no formato antigo neste ponto — este teste vai falhar até a Task 4 ser concluída, o que é esperado em TDD).
- Produces: nada consumido por outras tasks; só valida `Skills.jsx`.

- [ ] **Step 1: Escrever o teste que falha**

Substitua todo o conteúdo de `src/components/Skills/Skills.test.jsx` por:

```jsx
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

const skills = [
  { name: 'React', icon: 'FaReact' },
  { name: 'Gestão de Projetos', icon: 'FaTasks' },
];

const about = { yearsExperience: 3, projectsDelivered: 12 };

describe('Skills', () => {
  it('renders a key button for every skill', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByRole('button', { name: /React/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gestão de Projetos/i })).toBeInTheDocument();
  });

  it('renders the stat label', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByText('projetos entregues')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run test -- src/components/Skills/Skills.test.jsx`
Expected: FAIL — não existe nenhum `button` com nome acessível "React" (o componente atual renderiza `<li className="skills__badge">`, não um botão), e `skills.map` no componente atual espera `group.category`/`group.items`, então vai quebrar tentando ler `.category` de um item plano.

- [ ] **Step 3: Commit do teste (ainda falhando, será resolvido na Task 4)**

```bash
git add src/components/Skills/Skills.test.jsx
git commit -m "test: expect Skills to render each skill as a keyboard key button"
```

---

### Task 4: Reescrever `Skills.jsx` e `Skills.css` (teclado interativo)

**Files:**
- Modify: `src/components/Skills/Skills.jsx`
- Modify: `src/components/Skills/Skills.css`
- Test: `src/components/Skills/Skills.test.jsx` (já escrito na Task 3)

**Interfaces:**
- Consumes: `skills` (array plano `{ name, icon }[]` da Task 2), `iconMap` (Task 1), `AnimatedSection`, `AnimatedCounter` (sem mudanças de interface).
- Produces: `Skills` continua exportando o mesmo componente `export function Skills({ skills, about })`, usado por `src/App.jsx:20` sem nenhuma mudança de prop necessária.

- [ ] **Step 1: Implementar `Skills.jsx`**

Substitua todo o conteúdo de `src/components/Skills/Skills.jsx` por:

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { AnimatedCounter } from '../AnimatedCounter/AnimatedCounter';
import { iconMap } from '../../utils/icons';
import './Skills.css';

const COUNTER_START_DELAY = 500;
const KEY_TRANSITION = { type: 'spring', stiffness: 500, damping: 25 };

export function Skills({ skills, about }) {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <AnimatedSection id="habilidades" className="skills" onViewportEnter={() => setHasEntered(true)}>
      <p className="section-label">Competências &</p>
      <h2 className="section-title">Habilidades</h2>

      <div className="skills__stats">
        <div className="skills__stat">
          <AnimatedCounter
            target={about.projectsDelivered}
            suffix="+"
            start={hasEntered}
            delay={COUNTER_START_DELAY}
          />
          <p>projetos entregues</p>
        </div>
      </div>

      <div className="keyboard">
        <p className="keyboard__hint">(dica: clique numa tecla)</p>
        <div className="keyboard__grid">
          {skills.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.button
                type="button"
                className="keyboard__key"
                key={item.name}
                whileHover={{ y: -4 }}
                whileTap={{ y: 3 }}
                whileFocus={{ y: -4 }}
                transition={KEY_TRANSITION}
              >
                {Icon && <Icon aria-hidden="true" />}
                <span>{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Implementar `Skills.css`**

Substitua todo o conteúdo de `src/components/Skills/Skills.css` por:

```css
.skills {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
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

.keyboard {
  background: #101010;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.keyboard__hint {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6b7a77;
}

.keyboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 0.75rem;
  width: 100%;
  max-width: 640px;
}

.keyboard__key {
  --key-shadow: #0a4a44;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  aspect-ratio: 1;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 0.25rem;
  color: #eafffb;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(160deg, #2dd4bf, #0f766e);
  box-shadow:
    0 5px 0 var(--key-shadow),
    0 7px 12px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.15s ease;
}

.keyboard__key svg {
  font-size: 1.3rem;
}

.keyboard__key:nth-child(4n + 2) {
  --key-shadow: #78350f;
  background: linear-gradient(160deg, #f59e0b, #b45309);
}

.keyboard__key:nth-child(4n + 3) {
  --key-shadow: #1e3a8a;
  background: linear-gradient(160deg, #60a5fa, #1d4ed8);
}

.keyboard__key:nth-child(4n + 4) {
  --key-shadow: #831843;
  background: linear-gradient(160deg, #f472b6, #be185d);
}

.keyboard__key:hover,
.keyboard__key:focus-visible {
  outline: none;
  box-shadow:
    0 7px 0 var(--key-shadow),
    0 9px 16px rgba(0, 0, 0, 0.5);
}

.keyboard__key:active {
  box-shadow: 0 1px 0 var(--key-shadow);
}
```

- [ ] **Step 3: Rodar o teste e confirmar que passa**

Run: `npm run test -- src/components/Skills/Skills.test.jsx`
Expected: PASS

- [ ] **Step 4: Rodar a suíte inteira**

Run: `npm run test`
Expected: PASS (todos os arquivos, incluindo `content.test.js` e `icons.test.js` das Tasks 1-2)

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills/Skills.jsx src/components/Skills/Skills.css
git commit -m "feat: render skills as an interactive mechanical keyboard"
```

---

### Task 5: Build, lint e QA manual final

**Files:**
- Nenhum arquivo novo — apenas verificação.

**Interfaces:**
- Consumes: todas as mudanças das Tasks 1-4.
- Produces: nada (task de verificação final).

- [ ] **Step 1: Rodar lint**

Run: `npm run lint`
Expected: sem erros. Se o ESLint reclamar de `react-hooks`/props não usadas, corrija antes de prosseguir.

- [ ] **Step 2: Rodar build de produção**

Run: `npm run build`
Expected: build conclui sem erros (verifica que os novos ícones `Si*` existem em `react-icons/si` e que não há import quebrado).

- [ ] **Step 3: Rodar o dev server e QA manual no navegador**

Run: `npm run dev`

Checklist manual (seção "Habilidades"):
- Passar o mouse numa tecla eleva ela levemente (glow/hover).
- Clicar numa tecla faz ela "afundar" (perde a sombra) e voltar ao soltar.
- Navegar com Tab até uma tecla também mostra o estado de destaque (foco), sem quebrar a ordem de tabulação da página.
- O grid quebra em mais de uma "fileira" corretamente em viewport estreito (~375px), sem gerar scroll horizontal na página.
- Alternando entre tema claro e escuro do site (toggle do header), o painel do teclado continua com fundo escuro fixo e as cores das teclas não mudam.
- O contador "X+ projetos entregues" acima do teclado continua animando ao entrar na viewport.

- [ ] **Step 4: Commit final (se алgum ajuste manual tiver sido necessário)**

Se o QA manual não exigiu nenhuma mudança de código, não há o que commitar nesta task — as Tasks 1-4 já cobrem todo o código. Se algum ajuste foi feito durante o QA, repita `npm run test`, `npm run lint`, `npm run build` e commit normalmente com uma mensagem `fix:` descrevendo o ajuste.
