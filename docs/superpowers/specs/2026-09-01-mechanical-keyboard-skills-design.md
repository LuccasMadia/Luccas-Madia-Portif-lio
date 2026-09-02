# Seção Habilidades — Teclado Mecânico Interativo

**Data:** 2026-09-01
**Status:** Aprovado para implementação

## Objetivo

Substituir o bloco de tecnologias da seção "Habilidades" (hoje um carrossel `LogoLoop` + listas de badges por categoria) por um teclado mecânico interativo: cada tecnologia vira uma tecla colorida, vista de frente, com efeito de relevo (bevel). Passar o mouse dá um leve brilho/elevação; clicar afunda a tecla como se fosse pressionada de verdade. Inspirado na imagem de referência fornecida pelo usuário (teclado 3D isométrico colorido com o rótulo "SKILLS — hint: press a key"), mas com perspectiva frontal em vez de isométrica, para ficar responsivo em qualquer largura de tela.

O contador "X+ projetos entregues" (`AnimatedCounter`) continua no topo da seção, acima do teclado.

## Dados

Hoje as tecnologias estão espalhadas em dois lugares:
- Array `languages` fixo dentro de `Skills.jsx` (ícones importados diretamente de `react-icons/si`: React, JavaScript, Node.js, Next.js, Python, MySQL, HTML5, CSS3).
- Array `skills` em `src/data/content.js`, agrupado por categoria (`Gestão`, `Ferramentas`), com ícones referenciados por string via `iconMap` (`src/utils/icons.js`).

Mudança: unificar tudo em um único array plano em `content.js`, no mesmo formato `{ name, icon }` (string de ícone + `iconMap`), sem agrupamento por categoria:

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

`src/utils/icons.js` ganha as entradas que faltam no `iconMap` (`SiReact`, `SiJavascript`, `SiNodedotjs`, `SiNextdotjs`, `SiPython`, `SiMysql`, `SiHtml5`, `SiCss`), importadas de `react-icons/si`.

O componente `LogoLoop` deixa de ser usado por `Skills` (fica disponível para outros usos futuros, não é removido do projeto).

## Componente e interação

- `Skills.jsx` recebe `skills` (agora array plano) e renderiza um painel de teclado (`<div className="keyboard">`) contendo uma tecla por tecnologia.
- Cada tecla é um elemento com `role="button"` (ou `<button>`) para acessibilidade — foco por teclado (Tab) também deve funcionar, com o mesmo estado visual "pressionado" no `:focus-visible`/`whileFocus`.
- Animação de tecla via `framer-motion` (`motion.div`/`motion.button`, já usado em `AnimatedSection`/`AnimatedCounter`/`LogoLoop`):
  - `whileHover`: leve elevação (`translateY` negativo) + brilho.
  - `whileTap`/`whileFocus`: a tecla afunda (`translateY` positivo, perde a sombra inferior), simulando o pressionar físico.
- Efeito de relevo (bevel) construído com `box-shadow` inferior sólida (simulando a lateral/altura da tecla) + gradiente sutil no topo da tecla; ao "afundar", a sombra reduz e o gradiente escurece.
- Cores fixas e cíclicas (não ligadas às CSS custom properties de tema `--accent`/`--bg`): um pequeno array de 4-5 cores vivas (teal, laranja, azul, rosa/roxo) aplicado por índice (`index % cores.length`), reproduzindo o clima colorido da referência.
- Painel do teclado (`.keyboard`) tem fundo escuro fixo (não segue o toggle claro/escuro do site), para preservar contraste e o clima "premium" da referência independente do tema ativo.
- Cada tecla mostra o ícone da tecnologia (via `iconMap`) e o nome abaixo, em fonte pequena.
- Grid responsivo com `repeat(auto-fill, minmax(...))` (sem scroll horizontal), quebrando naturalmente em telas estreitas.

## Fora de escopo

- Reação a teclas físicas do teclado do usuário (ex.: apertar "J" no teclado real anima a tecla "JavaScript" na tela) — mencionado na referência mas descartado nesta fase por só funcionar em desktop.
- Perspectiva isométrica 3D (rotação em XYZ) — descartada em favor do layout frontal com relevo, mais robusto em diferentes larguras de tela.
- Alternância de cores das teclas conforme o tema claro/escuro — o painel do teclado é sempre escuro.

## Componentes afetados

- `src/data/content.js` — `skills` vira array plano (sem `category`); ganha os itens hoje hardcoded em `Skills.jsx`.
- `src/utils/icons.js` — novas entradas no `iconMap` para os ícones de linguagem (`Si*`).
- `src/components/Skills/Skills.jsx` — remove o array `languages` local e o uso de `LogoLoop`; renderiza o grid de teclas a partir de `skills`.
- `src/components/Skills/Skills.css` — novos estilos (`.keyboard`, `.keyboard__key`, bevel, cores cíclicas, grid responsivo); remove estilos de `.skills__badges`/`.skills__badge` que deixam de existir.
- `src/components/Skills/Skills.test.jsx` — reescrever: cada tecnologia do array `skills` aparece como uma tecla; o contador "projetos entregues" continua sendo renderizado. Remove as asserções sobre categorias.

## Testes e verificação

- `npm run test`, `npm run build`, `npm run lint` limpos.
- QA manual no navegador: hover e clique/tap em teclas dão o feedback visual esperado (elevação no hover, afundar no clique), navegação por Tab também ativa o estado "pressionado", grid quebra bem em viewport estreita, painel do teclado mantém fundo escuro nos dois temas (claro/escuro) do site.
