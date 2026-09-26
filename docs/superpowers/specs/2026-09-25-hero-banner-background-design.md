# Hero — Banner de Fundo Full-Width

**Data:** 2026-09-25
**Status:** Aprovado para implementação
**Supersede:** `docs/superpowers/specs/2026-09-25-hero-portrait-image-design.md` (o layout split com card retrato é substituído pelo banner de fundo descrito aqui).

## Objetivo

Trocar o layout de Hero (texto + card de imagem lado a lado) por um formato de banner: a imagem passa a ser o próprio fundo full-width da seção, com o texto sobreposto por cima, no espaço vazio que a foto deixa do lado esquerdo.

## Imagem

- Já gerada e salva em `src/assets/hero/hero-banner.png` (1916×821px, ~2.3:1), pessoa posicionada no terço direito do quadro, fundo escuro/vazio no lado esquerdo — espaço reservado para o texto.
- Usada como `background-image` em CSS (não `<img>`), porque é decorativa e precisa de controle de `background-position`/`background-size` e de camada de overlay por cima.

## Layout

- `.hero` deixa de ser grid de 2 colunas e volta a ser um bloco único relativo (`position: relative`), com a imagem de fundo aplicada via CSS.
- **Desktop/tablet (≥768px):** `background-image: url(hero-banner.png)`, `background-size: cover`, `background-position: right center` (mantém a pessoa visível, cortando preferencialmente pelas bordas).
- **Mobile (<768px):** sem a foto — `.hero` usa um gradiente CSS liso nas cores do tema (`var(--bg)` → `var(--bg-alt-2)`, mesmo estilo já usado em outras partes do site) como fundo. A regra de `background-image` da foto fica dentro do media query `@media (min-width: 768px)`, então o navegador não baixa o arquivo em telas estreitas.
- **Overlay de legibilidade:** uma camada (`.hero__overlay`, `position: absolute; inset: 0`) com `linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.6) 45%, rgba(26,26,26,0.15) 75%)` fica entre o fundo e o conteúdo, garantindo contraste do texto independente da iluminação da foto. Aplicada em todas as larguras (também ajuda sobre o gradiente CSS do mobile, deixando o visual consistente).
- `.hero__content` perde o `margin: 0 auto` (não fica mais centralizado) — passa a ficar alinhado à esquerda, dentro do espaço escuro que a foto reserva. Mantém `max-width: 640px` e ganha `z-index` acima do overlay.

## Componentes afetados

- `src/components/Hero/Hero.jsx` — remove o `motion.div.hero__media` (bloco antigo do card retrato) e o import de `hero-portrait.png`; adiciona um `.hero__overlay` (`div` simples, sem necessidade de motion) antes de `.hero__content`.
- `src/components/Hero/Hero.css` — reescreve `.hero` (fundo, sem grid), remove `.hero__media`/`.hero__portrait`, adiciona `.hero__overlay` e a regra de `background-image` dentro do media query.
- `src/components/Hero/Hero.test.jsx` — remove o teste `renders the placeholder portrait image` (não existe mais `<img>` de retrato); os outros testes (nome, tagline, bio, CTAs) continuam validando o mesmo comportamento.

## Assets removidos

- `src/assets/hero/hero-portrait.png` — deletado do working tree (recuperável via git history se necessário). Não é mais referenciado por nenhum componente.

## Fora de escopo

- Otimização/compressão do PNG do banner (2,1MB) — fica para uma passada de performance depois, não bloqueia esta mudança.
- Testes automatizados do `background-image`/media query em si (não é verificável de forma significativa em jsdom, mesmo padrão já adotado para outros efeitos visuais deste projeto) — validado via QA manual no navegador.

## Testes e verificação

- `npm run test`, `npm run build`, `npm run lint` limpos.
- QA manual no navegador: confirmar fundo com a foto em desktop (pessoa visível à direita, texto legível à esquerda sobre o overlay), gradiente CSS liso em mobile (sem a foto), e que não há regressão no comportamento de scroll/CTAs da Hero.
