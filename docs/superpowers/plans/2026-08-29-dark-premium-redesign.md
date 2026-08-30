# Dark Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark/teal generic visual identity with the approved "Dark Premium com Assinatura" direction (gold/amber accent, serif headings, mono labels, grain texture, full-bleed duotone Hero) across the whole portfolio, without changing content or the Projects section's structure/interaction.

**Architecture:** Almost the entire site is styled through CSS custom properties defined once in `src/index.css` and consumed by every component's own CSS file. Swapping those tokens (colors + fonts) cascades the new identity everywhere automatically. Only the Hero needs a structural rewrite (new full-bleed portrait layout); Services gets a small additive change (index numbers); Projects gets font/color-only edits to its few hardcoded values.

**Tech Stack:** React 19 + Vite, plain CSS (no CSS-in-JS, no Tailwind), Vitest + Testing Library for component tests, Google Fonts via `@import`.

## Global Constraints

- Projects mantém 100% a estrutura, mecânica de scroll/carousel/modal, numeração e badges atuais — só cores/fontes podem mudar ali.
- Fora de escopo: conteúdo/textos, estrutura de seções em `App.jsx`, a foto do Hero (usar `lucca-portrait.webp` existente), qualquer mudança em `Header.jsx`/`Header.css` além da herança automática de tokens.
- Sem novas dependências npm — fontes via Google Fonts `@import`, textura de grão via SVG data-uri inline em CSS puro.
- `npm run test` (Vitest) deve continuar 100% verde; nenhum teste novo ou existente deve depender de valores de cor hardcoded do tema antigo.

---

## File Structure

- Modify: `src/index.css` — novos tokens de cor/fonte, imports de fonte, textura de grão global, `.section-label` em mono, contraste do `.btn--primary`.
- Modify: `src/components/Hero/Hero.jsx` — nova estrutura (fundo duotone + índice `01`).
- Modify: `src/components/Hero/Hero.css` — novo layout full-bleed.
- Modify: `src/components/Hero/Hero.test.jsx` — cobre o novo fundo decorativo e o índice.
- Modify: `src/components/Services/Services.jsx` — numeração `01`–`04` por card.
- Modify: `src/components/Services/Services.css` — estilo da numeração.
- Modify: `src/components/Services/Services.test.jsx` — cobre a numeração.
- Modify: `src/components/Projects/Projects.css` — gradientes de fallback e label em tons dourado/preto.

---

### Task 1: Novos tokens de cor/fonte, textura de grão e ajuste de contraste (`src/index.css`)

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: novos custom properties globais consumidos por todos os componentes — `--bg: #0c0c0e`, `--bg-alt: #050506`, `--bg-alt-2: #141210`, `--accent: #cba05a`, `--accent-dark: #a9813f`, `--text: #f2efe9`, `--text-muted: #9b968c`, `--border: rgba(203,160,90,0.2)`, `--font-heading: 'Fraunces', serif`, `--font-body: 'Inter', sans-serif` (mantido), `--font-mono: 'IBM Plex Mono', monospace` (novo).

- [ ] **Step 1: Substituir o import de fontes e o bloco `:root`**

Em `src/index.css`, substituir as linhas 1–15 por:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0c0c0e;
  --bg-alt: #050506;
  --bg-alt-2: #141210;
  --accent: #cba05a;
  --accent-dark: #a9813f;
  --text: #f2efe9;
  --text-muted: #9b968c;
  --border: rgba(203, 160, 90, 0.2);
  --font-heading: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --max-width: 1120px;
}
```

- [ ] **Step 2: Colocar os labels de seção em mono e corrigir o contraste do botão primário**

Substituir a regra `.section-label` existente por:

```css
.section-label {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
```

Substituir a regra `.btn--primary` existente por:

```css
.btn--primary {
  background: var(--accent);
  color: #1a1206;
}
.btn--primary:hover {
  background: var(--accent-dark);
}
```

- [ ] **Step 3: Adicionar a textura de grão global**

Ao final do arquivo `src/index.css`, adicionar:

```css
body {
  position: relative;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.045;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
```

- [ ] **Step 4: Rodar a suíte de testes para confirmar que nada quebrou**

Run: `npm run test`
Expected: todos os testes existentes continuam passando (mudança é puramente CSS, nenhuma asserção depende de cor).

- [ ] **Step 5: Verificar visualmente**

Run: `npm run dev`, abrir a URL local no navegador.
Expected: fundo escuro `#0c0c0e`, títulos em serifada (Fraunces), labels de seção ("O que eu faço", "Portfólio" etc.) em mono dourado, botão primário legível (texto escuro sobre fundo dourado), grão sutil visível ao observar de perto o fundo.

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat: swap portfolio theme to dark premium gold palette"
```

---

### Task 2: Hero full-bleed com retrato em duotone e índice

**Files:**
- Modify: `src/components/Hero/Hero.jsx`
- Modify: `src/components/Hero/Hero.css`
- Modify: `src/components/Hero/Hero.test.jsx`

**Interfaces:**
- Consumes: `--bg`, `--accent`, `--text`, `--text-muted`, `--font-heading`, `--font-mono` (Task 1). Asset `src/assets/hero/lucca-portrait.webp` (já existe no repo).
- Produces: nenhuma interface nova consumida por outras tasks — Hero é folha da árvore de componentes em `App.jsx`.

- [ ] **Step 1: Escrever o teste que falha**

Em `src/components/Hero/Hero.test.jsx`, adicionar (mantendo o teste existente):

```jsx
it('renders a decorative portrait background and an index label', () => {
  const { container } = render(<Hero about={about} />);

  const portrait = container.querySelector('.hero__portrait');
  expect(portrait).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByText('01')).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: FAIL — `container.querySelector('.hero__portrait')` retorna `null` (elemento ainda não existe).

- [ ] **Step 3: Reescrever `Hero.jsx`**

Substituir o conteúdo de `src/components/Hero/Hero.jsx` por:

```jsx
import { motion } from 'framer-motion';
import StrokeText, { getStrokeTextDuration } from '../StrokeText/StrokeText';
import FoldText, { getFoldTextDuration } from '../FoldText/FoldText';
import { scrollToSection } from '../../utils/scrollToSection';
import heroPortrait from '../../assets/hero/lucca-portrait.webp';
import './Hero.css';

const NAME_ANIMATION = { drawDuration: 1.6, fillDelay: 0.2, stagger: 0.05 };
const TAGLINE_ANIMATION = { duration: 0.4, stagger: 0.02, splitBy: 'char' };
const TAGLINE_OVERLAP = 0.6;

export function Hero({ about }) {
  const taglineStart = Math.max(0, getStrokeTextDuration(about.name, NAME_ANIMATION) - TAGLINE_OVERLAP);
  const bioStart = taglineStart + getFoldTextDuration(about.tagline, TAGLINE_ANIMATION);

  return (
    <section id="sobre" className="hero">
      <div
        className="hero__portrait"
        style={{ backgroundImage: `url(${heroPortrait})` }}
        aria-hidden="true"
      />
      <div className="hero__tint" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      <span className="hero__index" aria-hidden="true">01</span>
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="hero__eyebrow">Portfólio</p>
        <h1 className="hero__name">
          <StrokeText
            text={about.name}
            strokeColor="var(--accent)"
            fillColor="var(--text)"
            strokeWidth={1.4}
            {...NAME_ANIMATION}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontWeight={700}
            letterSpacing={-1}
            reverse={false}
          />
        </h1>
        <p className="hero__tagline">
          <FoldText
            text={about.tagline}
            hinge="top"
            trigger="mount"
            {...TAGLINE_ANIMATION}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            color="var(--accent)"
            startDelay={taglineStart}
          />
        </p>
        <motion.p
          className="hero__bio"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: bioStart, ease: 'easeOut' }}
        >
          {about.bio}
        </motion.p>
        <div className="hero__actions">
          <a
            href="#projetos"
            className="btn btn--primary"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('projetos');
            }}
          >
            Ver projetos
          </a>
          <a
            href="#contato"
            className="btn btn--outline"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('contato');
            }}
          >
            Fale comigo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Reescrever `Hero.css`**

Substituir o conteúdo de `src/components/Hero/Hero.css` por:

```css
.hero {
  position: relative;
  min-height: clamp(560px, 100vh, 820px);
  display: flex;
  align-items: flex-end;
  padding: 3rem 1.5rem 4rem;
  overflow: hidden;
}

.hero__portrait {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 15%;
  filter: grayscale(1) contrast(1.1);
  z-index: 0;
}

.hero__tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(203, 160, 90, 0.9), rgba(12, 12, 14, 0.95));
  mix-blend-mode: color;
  z-index: 1;
}

.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(12, 12, 14, 0.15) 0%, rgba(12, 12, 14, 0.55) 55%, rgba(12, 12, 14, 0.95) 100%);
  z-index: 2;
}

.hero__index {
  position: absolute;
  top: 6.5rem;
  right: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  z-index: 3;
}

.hero__content {
  max-width: 720px;
  margin: 0;
  position: relative;
  z-index: 3;
}

.hero__eyebrow {
  color: var(--accent);
  font-family: var(--font-mono);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.hero__name {
  font-size: clamp(3rem, 9vw, 6rem);
  line-height: 0.98;
  margin-bottom: 0.75rem;
}

.hero__tagline {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 1rem;
  min-height: 1.6em;
  margin-bottom: 1.5rem;
}

.hero__bio {
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 46ch;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npx vitest run src/components/Hero/Hero.test.jsx`
Expected: PASS — os dois testes do arquivo passam.

- [ ] **Step 6: Rodar a suíte completa**

Run: `npm run test`
Expected: todos os testes continuam passando.

- [ ] **Step 7: Verificar visualmente**

Run: `npm run dev`, abrir a URL local.
Expected: Hero ocupa a viewport inteira com a foto em duotone dourado/preto ao fundo, nome grande e legível sobre o gradiente, índice `01` discreto no canto superior direito, animações de entrada (stroke/fold text) continuam funcionando.

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.css src/components/Hero/Hero.test.jsx
git commit -m "feat: rebuild hero as full-bleed duotone portrait layout"
```

---

### Task 3: Numeração dos cards de Serviços

**Files:**
- Modify: `src/components/Services/Services.jsx`
- Modify: `src/components/Services/Services.css`
- Modify: `src/components/Services/Services.test.jsx`

**Interfaces:**
- Consumes: `--font-mono`, `--text-muted` (Task 1).
- Produces: nenhuma interface nova consumida por outras tasks.

- [ ] **Step 1: Escrever o teste que falha**

Em `src/components/Services/Services.test.jsx`, adicionar (mantendo o teste existente):

```jsx
it('numbers each service card', () => {
  render(<Services services={services} />);

  expect(screen.getByText('01')).toBeInTheDocument();
  expect(screen.getByText('02')).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run src/components/Services/Services.test.jsx`
Expected: FAIL — `screen.getByText('01')` não encontra nenhum elemento.

- [ ] **Step 3: Adicionar a numeração em `Services.jsx`**

Em `src/components/Services/Services.jsx`, dentro do `.map`, alterar o bloco retornado para:

```jsx
return (
  <div
    className={`service-card${index === previewIndex ? ' service-card--active' : ''}`}
    key={service.id}
  >
    <span className="service-card__index">{String(index + 1).padStart(2, '0')}</span>
    {Icon && <Icon className="service-card__icon" aria-hidden="true" />}
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </div>
);
```

- [ ] **Step 4: Estilizar a numeração em `Services.css`**

Na regra `.service-card` existente, adicionar `position: relative;`:

```css
.service-card {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.5rem;
  background: var(--bg-alt-2);
  transition: border-color 0.2s ease, transform 0.2s ease;
}
```

Adicionar a nova regra:

```css
.service-card__index {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npx vitest run src/components/Services/Services.test.jsx`
Expected: PASS — os dois testes do arquivo passam.

- [ ] **Step 6: Rodar a suíte completa**

Run: `npm run test`
Expected: todos os testes continuam passando.

- [ ] **Step 7: Commit**

```bash
git add src/components/Services/Services.jsx src/components/Services/Services.css src/components/Services/Services.test.jsx
git commit -m "feat: add mono index numbers to service cards"
```

---

### Task 4: Atualizar cores hardcoded dos Projetos (sem mudar estrutura)

**Files:**
- Modify: `src/components/Projects/Projects.css`

**Interfaces:**
- Consumes: nenhum token novo diretamente — esta task só substitui valores hex hardcoded de teal por dourado/preto e troca duas `font-family` para mono, mantendo toda a estrutura/seletores existentes.

- [ ] **Step 1: Atualizar os gradientes de fallback**

Em `src/components/Projects/Projects.css`, substituir as três regras existentes por:

```css
.project-card__visual--0 {
  background: linear-gradient(135deg, #1a1206, #cba05a 140%);
}

.project-card__visual--1 {
  background: linear-gradient(135deg, #0c0c0e, #a9813f 160%);
}

.project-card__visual--2 {
  background: radial-gradient(circle at 30% 30%, #cba05a, #050506 75%);
}
```

- [ ] **Step 2: Colocar número do card e label em mono**

Substituir a regra `.project-card__number` existente por:

```css
.project-card__number {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--accent);
}
```

Substituir a regra `.project-card__label` existente por:

```css
.project-card__label {
  font-family: var(--font-mono);
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
}
```

- [ ] **Step 3: Confirmar que não restou nenhum tom de teal no arquivo**

Run: `grep -in "2dd4bf\|14b8a6\|0f2f2a" "src/components/Projects/Projects.css"`
Expected: nenhuma linha encontrada (comando não retorna resultado).

- [ ] **Step 4: Rodar a suíte completa**

Run: `npm run test`
Expected: todos os testes continuam passando (mudança é puramente CSS).

- [ ] **Step 5: Verificar visualmente**

Run: `npm run dev`, navegar até a seção Projetos.
Expected: cards de projeto com a mesma estrutura/scroll empilhado de sempre, agora com borda dourada, número e label em mono, e (se algum card cair no fallback sem thumbnail) gradiente dourado/preto no lugar do teal.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects/Projects.css
git commit -m "fix: recolor project card fallback gradients and labels to gold palette"
```

---

### Task 5: Verificação final end-to-end

**Files:** nenhum arquivo novo — task de verificação.

- [ ] **Step 1: Rodar a suíte de testes completa**

Run: `npm run test`
Expected: todos os testes passam.

- [ ] **Step 2: Rodar o build de produção**

Run: `npm run build`
Expected: build conclui sem erros (confirma que os imports de fonte e assets estão corretos).

- [ ] **Step 3: Rodar o lint**

Run: `npm run lint`
Expected: sem erros novos introduzidos pelas mudanças desta plan.

- [ ] **Step 4: Checklist visual manual**

Run: `npm run dev`, percorrer a página inteira.
Expected, comparando com os mockups aprovados (salvos em `.superpowers/brainstorm/2088-1788054420/content/` neste repo):
- Hero: foto em duotone dourado/preto, nome grande legível, índice `01`.
- Header, Services, Skills, Contact, Footer: fundo escuro `#0c0c0e`, acentos dourados, títulos serifados, labels em mono.
- Cursor customizado: acompanha o mouse na cor dourada; se o `mix-blend-mode: difference` deixar o cursor com contraste ruim sobre o novo fundo mais quente, trocar `mix-blend-mode: difference` por `mix-blend-mode: normal` em `src/components/CustomCursor/CustomCursor.css` (linha `mix-blend-mode: difference;`) como ajuste pontual.
- Projects: estrutura, scroll empilhado, carrossel e modal de case study idênticos a antes — só cores/fontes mudaram.
- Grão sutil visível no fundo ao observar de perto, sem atrapalhar leitura ou cliques.

- [ ] **Step 5: Commit final (se o ajuste do cursor do Step 4 foi necessário)**

```bash
git add src/components/CustomCursor/CustomCursor.css
git commit -m "fix: adjust cursor blend mode for new warm dark background"
```

Se nenhum ajuste foi necessário, pular este commit.
