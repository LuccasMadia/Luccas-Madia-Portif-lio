# Redesign visual — Dark Premium com Assinatura

## Contexto

O portfólio atual (React + Vite, one-page) usa um visual dark/teal genérico — comum
demais entre portfólios de dev, sem diferenciação. O objetivo é uma reformulação
visual completa: nova paleta, tipografia e um elemento de assinatura, mantendo a
estrutura de conteúdo e as seções existentes (Hero, Services, Projects, Skills,
Contact, Footer).

A maior parte do site já é orientada por CSS custom properties definidas em
`src/index.css` (`--bg`, `--accent`, `--text`, `--text-muted`, `--border`,
`--font-heading`, `--font-body`), consumidas por todos os componentes. Trocar os
tokens já propaga a nova identidade para Header, Skills, Contact, Footer, cursor e
Projects sem precisar tocar em cada arquivo individualmente. As mudanças
estruturais ficam concentradas no Hero.

Direção validada com o usuário via mockups visuais (companion de brainstorming):
"Dark Premium com Assinatura" — continua escuro, mas troca o verde-água por
dourado/âmbar, tipografia serifada de peso para títulos, mono para labels/índice,
com uma textura de grão sutil.

## Design tokens (`src/index.css`)

Substituir o bloco `:root` atual por:

| Token | Valor atual | Novo valor | Uso |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#0c0c0e` | fundo principal |
| `--bg-alt` | `#050505` | `#050506` | footer / seções mais escuras |
| `--bg-alt-2` | `#111111` | `#141210` | cards (services, projects) |
| `--accent` | `#2dd4bf` (teal) | `#cba05a` (dourado/âmbar) | cor de assinatura |
| `--accent-dark` | `#14b8a6` | `#a9813f` | hover de botões/links |
| `--text` | `#eafffb` | `#f2efe9` | texto principal, off-white quente |
| `--text-muted` | `#8a9a97` | `#9b968c` | texto secundário |
| `--border` | `rgba(45,212,191,0.2)` | `rgba(203,160,90,0.2)` | bordas finas translúcidas |
| `--font-heading` | Space Grotesk | **Fraunces** (variável, serifada) | títulos |
| `--font-body` | Inter | Inter (mantido) | texto corrido |
| `--font-mono` | *(novo)* | **IBM Plex Mono** | eyebrows, labels, índice, tags de stack |

Import do Google Fonts atualizado para incluir Fraunces (pesos 600/700, incluindo
a variante `opsz`/soft se disponível) e IBM Plex Mono (peso 500), mantendo Inter.

`.btn--primary` usa `#04211c` (texto sobre teal) — trocar para uma cor escura que
tenha contraste correto sobre o novo dourado (ex.: `#1a1206`).

## Textura de grão (global)

Camada de ruído SVG sutil, fixa, atrás do conteúdo, aplicada uma vez em `body`
(ou um elemento `::before` fixo cobrindo a viewport): opacidade ~4–5%,
`mix-blend-mode: overlay`, `pointer-events: none`. Não deve interferir em
scroll, cliques ou performance (camada estática, sem animação).

## Hero — mudança estrutural (`Hero.jsx` / `Hero.css`)

Layout muda de "texto centralizado" para o padrão validado (opção C): foto de
retrato como fundo full-bleed da seção, com gradiente duotone dourado/preto por
cima (`linear-gradient` + leve dessaturação via `filter`) para garantir
legibilidade do texto. Nome (`about.name`) em `Fraunces` extra-bold, tamanho
grande (`clamp(3rem, 9vw, 6rem)`), sobreposto à imagem. Eyebrow e tagline em
`IBM Plex Mono`. Índice discreto no canto (`01`) como assinatura visual,
repetido como padrão nas outras seções (Services já numera `02`, Projects já
numera, Skills/Contact podem ganhar o padrão se fizer sentido visualmente).

A imagem-fonte é `src/assets/hero/lucca-portrait.webp` (já existe no repo, sem
uso atual). Como o usuário pode querer trocar essa foto depois por uma de
melhor qualidade, o tratamento (gradiente, filtro) deve ser feito via CSS sobre
a `<img>`/`background-image`, não hardcoded para as dimensões específicas da
foto atual — trocar o arquivo de imagem deve continuar funcionando sem editar
CSS.

As animações de entrada existentes (`StrokeText`, `FoldText`, fade do bio/botões)
são mantidas; só a cor do stroke (`var(--accent)`) muda automaticamente.

## Services

Mantém a mesma grade de cards (`Services.jsx`/`Services.css`). Adiciona
numeração `01`–`04` em `IBM Plex Mono`, pequena, no canto superior direito de
cada card (mockup aprovado). Borda dos cards já é `var(--border)` — herda o
dourado translúcido automaticamente.

## Projects — sem mudança estrutural

Por pedido explícito do usuário, a seção de Projetos mantém 100% da estrutura
atual (scroll empilhado/sticky, carrossel de imagens, modal de case study,
numeração `project-card__number`, badges de status). Só os tokens de cor e
fonte mudam, o que já acontece automaticamente por herdar `var(--accent)`,
`var(--border)`, `var(--font-heading)`, `var(--bg-alt-2)`.

Exceção: os 3 gradientes hardcoded de fallback (`.project-card__visual--0/1/2`
em `Projects.css`, usados quando não há thumbnail) estão em tons de teal
(`#2dd4bf`, `#14b8a6`) e precisam ser atualizados para tons dourado/preto
coerentes com a nova paleta, já que não usam custom properties.

Os badges de status (`project-card__status` / `--live`, em âmbar/verde
hardcoded) não fazem parte da paleta de marca — ficam como estão (âmbar já
funciona bem perto do dourado; verde de "live" continua sendo o sinalizador
universal de status ativo).

## Skills, Contact, Footer, Header, Cursor

Sem mudanças estruturais — só herdam os novos tokens (`var(--accent)`,
`var(--border)`, `var(--bg-alt-2)`, `var(--font-heading)`, `var(--font-body)`).

O cursor customizado (`CustomCursor.css`) mantém o comportamento atual (ponto
que segue o mouse, `mix-blend-mode: difference`) e herda a cor dourada via
`var(--accent)`. Como `difference` pode produzir resultados diferentes sobre um
fundo mais quente (`#0c0c0e` vs. o preto puro anterior), validar visualmente
durante a implementação e ajustar o blend mode ou a cor se o contraste ficar
ruim.

## Fora de escopo

- Conteúdo/textos das seções.
- Estrutura de seções e ordem no `App.jsx`.
- Mecânica de scroll/carousel/modal dos Projects.
- Substituição da foto do Hero por uma foto nova (fica com a `lucca-portrait.webp`
  existente por enquanto).
- Qualquer mudança em `Header.jsx`/`Header.css` além da herança automática de
  tokens.

## Critério de conclusão

- `npm run dev` renderiza o site com a nova paleta/tipografia em todas as
  seções, sem quebrar layout em desktop/mobile.
- Hero mostra o novo layout com a foto em duotone e nome grande sobreposto.
- Projects mantém exatamente a mesma estrutura/interação, só com cores/fontes
  novas (incluindo os gradientes de fallback atualizados).
- Testes existentes (`npm run test`) continuam passando; nenhum teste depende
  de valores de cor hardcoded do tema antigo.
