# Projects Section — Stacking Scroll Cards

**Data:** 2026-08-13
**Status:** Aprovado para implementação

## Objetivo

Redesenhar a seção Projetos para que cada projeto seja um card grande que "gruda" na tela conforme o usuário rola a página, com o próximo projeto subindo suavemente por cima do anterior — efeito de stacking cards inspirado na referência visual fornecida pelo usuário (portfólio com cards numerados, imagem em destaque e botão "Ver projeto" no topo).

## Mecânica de scroll

- Cada card é envolvido por um wrapper com `position: sticky` e um `top` que aumenta por índice (ex.: `90px + index * 20px`), fazendo os cards se empilharem visualmente conforme o próximo card sobe por cima do anterior.
- Cada wrapper tem altura mínima suficiente (ex.: `min-height: 80vh` em desktop) para dar "espaço de rolagem" ao efeito antes do próximo card cobrir o atual.
- Framer Motion (`useScroll` com `target` no wrapper do card + `useTransform`) aplica um leve `scale` (de 1 para ~0.94) e redução de opacidade/brilho no card conforme ele é coberto pelo próximo, suavizando a transição.
- Em mobile (< 768px), a altura mínima dos wrappers é reduzida (ex.: `min-height: auto`, cards empilham com overlap menor) para não deixar a seção excessivamente longa.

## Novo layout do card

Estrutura por projeto, de cima para baixo:
1. Cabeçalho: número do projeto (`01`, `02`, ...), rótulo fixo "PROJETO", título — com botão "Ver projeto" (`liveUrl`) alinhado à direita.
2. Bloco visual grande: `div` com gradiente CSS preto/verde água, variação determinística por índice do projeto (ciclando entre 3 variantes de gradiente pré-definidas). Não depende de imagens externas.
3. Rodapé: tags de stack (`project.stack`) e link "Código" (`codeUrl`), mantidos como estão hoje.

Nenhum campo novo é necessário em `src/data/content.js` — o número e o gradiente são derivados do índice do projeto no array.

## Componentes afetados

- `src/components/Projects/Projects.jsx` — reestruturação do JSX (wrapper sticky, cabeçalho numerado, bloco de gradiente).
- `src/components/Projects/Projects.css` — novos estilos (`sticky`, `top` incremental, gradientes, layout do cabeçalho).
- `src/components/Projects/Projects.test.jsx` — atualizar para refletir a nova estrutura (número, rótulo "PROJETO", título, botão "Ver projeto" no topo, stack e "Código" mantidos).

## Fora de escopo

- Novo campo de imagem real no `content.js` (fica para quando o usuário substituir o conteúdo placeholder).
- Testes automatizados do efeito visual de scroll em si (`position: sticky` + transform de scroll não é verificável de forma significativa em jsdom) — validado via QA manual no navegador, como já feito para o parallax do Hero.

## Testes e verificação

- `npm run test`, `npm run build`, `npm run lint` limpos.
- QA manual no navegador: confirmar que os cards empilham suavemente ao rolar, que o botão "Ver projeto" e os links de stack/código continuam funcionando, e que o comportamento é razoável em viewport estreita.
