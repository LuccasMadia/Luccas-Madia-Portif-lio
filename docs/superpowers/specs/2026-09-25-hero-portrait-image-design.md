# Hero — Imagem de Retrato (placeholder por IA)

**Data:** 2026-09-25
**Status:** Aprovado para implementação

## Objetivo

Adicionar uma imagem à Hero para deixar o site mais confiável e profissional. Por enquanto, a imagem será um placeholder de retrato gerado por IA (pessoa genérica, estilo profissional), até o Lucca ter uma foto real sua para substituir.

## Layout

- `.hero` passa de coluna única centralizada para um grid de 2 colunas em telas ≥ 960px: `grid-template-columns: 1.1fr 0.9fr`, com `.hero__content` na coluna esquerda e novo `.hero__media` na coluna direita.
- Em telas < 960px, empilha verticalmente: texto primeiro, imagem depois.
- `.hero__content` deixa de ter `margin: 0 auto` centralizado — passa a ocupar sua coluna, mantendo `max-width` para não esticar demais em telas largas.

## Imagem

- Card retrato, proporção ~4:5, `border-radius` grande (consistente com o resto do site), leve borda/glow em `var(--accent)` para integrar ao tema dark.
- Fundo liso/estúdio (neutro ou gradiente leve) já embutido na própria imagem gerada — sem necessidade de tratamento extra (remoção de fundo) nesta fase.
- Entrada animada em conjunto com `.hero__content` (fade + leve scale), mesmo padrão de easing já usado no `motion.div` do conteúdo.

## Prompt sugerido para gerar a imagem (IA de imagem)

```
Professional studio portrait photo of a young adult software developer,
confident friendly smile, arms crossed or one hand in pocket, modern
casual-smart outfit (plain t-shirt or button-up, no logos), shot from
chest up, soft studio lighting, plain neutral background with a subtle
dark-to-teal gradient, shallow depth of field, high resolution,
photorealistic, portrait orientation (4:5), editorial headshot style,
sharp focus on face, minimal color palette (dark background, teal/mint
accent light rim).
```

- Aspecto: retrato (4:5), resolução mínima recomendada ~1200×1500px.
- Cor de destaque a usar no rim-light/gradiente: a `--accent` do site (verde-água/teal), para casar com a paleta atual.

## Arquivo e integração

- Novo diretório `src/assets/hero/`, arquivo `hero-portrait.png`. **Pré-requisito:** o Lucca precisa gerar e salvar essa imagem antes da implementação ser testada/buildada — como é `import` estático (mesmo padrão dos assets de projetos), o build quebra se o arquivo não existir.
- `Hero.jsx` importa a imagem e renderiza em `.hero__media` com `<img src={heroPortrait} alt="Retrato ilustrativo de desenvolvedor" />` (alt genérico enquanto for placeholder).
- Nenhum campo novo necessário em `src/data/content.js` — a imagem é importada diretamente no componente (mesmo padrão dos assets de projetos).

## Componentes afetados

- `src/components/Hero/Hero.jsx` — novo bloco `.hero__media` com a imagem.
- `src/components/Hero/Hero.css` — grid de 2 colunas, estilos do card de imagem, breakpoint de stack em mobile.
- `src/components/Hero/Hero.test.jsx` — atualizar se necessário para refletir a nova estrutura (presença da imagem/alt).

## Fora de escopo

- Foto real do Lucca (troca futura do arquivo, sem mudança de código).
- Remoção/tratamento de fundo da imagem (a imagem já vem com fundo de estúdio liso).
- Geração da imagem em si — fica a cargo do Lucca rodar o prompt numa ferramenta de IA de imagem à parte.

## Testes e verificação

- `npm run test`, `npm run build`, `npm run lint` limpos (com `hero-portrait.png` já presente em `src/assets/hero/`).
- QA manual no navegador: confirmar grid 2 colunas em desktop, stack em mobile, e proporção/enquadramento da imagem no card.
