# Portfólio Pessoal — Luccas Madia

**Data:** 2026-08-13
**Status:** Aprovado para implementação

## Objetivo

Criar um portfólio pessoal em formato one-page para apresentar experiências e projetos de Luccas Madia, com o objetivo de atrair clientes e se apresentar para empresas das áreas de programação, administração e desenvolvimento.

## Stack

- **React + Vite** (JavaScript)
- **Framer Motion** para animações
- **react-icons** para ícones de tecnologias/redes sociais
- Build estático, pronto para deploy em Vercel/Netlify/GitHub Pages (deploy não incluído neste escopo — a confirmar depois)

## Estrutura de navegação

One-page com scroll único e menu de âncoras fixo no topo:

`Sobre` → `Serviços` → `Experiências` → `Projetos` → `Habilidades` → `Contato`

Menu vira hambúrguer em telas < 768px.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0a0a0a` | Fundo base |
| `--bg-alt` | `#050505` / `#111111` | Alternância entre seções |
| `--accent` | `#2dd4bf` | Verde água — destaque, links, bordas ativas |
| `--accent-dark` | `#14b8a6` | Verde água escuro — gradientes, hover |
| `--text` | `#eafffb` | Texto principal |
| `--text-muted` | `#8a9a97` | Texto secundário |

- **Tipografia de títulos:** Space Grotesk ou Sora (geométrica, tech) via Google Fonts.
- **Tipografia de corpo:** Inter.
- **Estilo geral:** muito espaço negativo, linhas finas verde água como separadores, cards com borda sutil `rgba(45,212,191,0.2)` que acende no hover, botões outline que preenchem no hover.
- **Responsivo:** mobile-first.

Referência visual aprovada: mockup "A — Dark Tech Minimalista" (fundo preto limpo, acento verde água pontual, tipografia forte, sem enfeites).

## Seções (conteúdo placeholder, a ser editado depois pelo usuário)

1. **Header/Nav** — fixo, com blur de fundo ao rolar a página; logo/nome + âncoras + hambúrguer no mobile.
2. **Hero (Sobre mim)** — nome, tagline com efeito de digitação (typing effect), texto de apresentação curto, CTAs para Projetos e Contato. Fundo com gradiente radial sutil em verde água e leve parallax.
3. **Serviços** — 3-4 cards (ex: Desenvolvimento Web, Consultoria em Gestão, Automação de Processos, Suporte Administrativo) com ícone, título, descrição curta. Fade-in escalonado ao entrar no viewport.
4. **Experiências** — timeline vertical (linha verde água central, pontos marcando cada item) com cargo, empresa, período, descrição. 2-3 experiências placeholder.
5. **Projetos** — grid de cards (3-4 projetos placeholder) com thumb, título, stack usada, botões "Ver projeto" / "Código". Hover com leve zoom e brilho na borda.
6. **Habilidades** — badges agrupados por categoria (Dev, Gestão, Ferramentas) com ícones via react-icons. Contadores animados onde fizer sentido (ex: "X anos de experiência", "X projetos entregues").
7. **Contato** — cards/botões grandes linkando para WhatsApp, LinkedIn e GitHub (placeholders). Sem formulário funcional (não há backend).
8. **Footer** — nome, ano, links rápidos.

## Interatividade e animações

- Fade-in/slide escalonado ao rolar (`AnimatedSection` wrapper reutilizável com Framer Motion + `whileInView`).
- Typing effect na tagline do hero.
- Contadores animados nas estatísticas.
- Parallax sutil no hero.
- Transições suaves no menu (scroll suave para âncoras, destaque do item ativo).
- Cursor customizado (ponto verde água seguindo o mouse com leve delay), **ativo apenas em desktop** — desabilitado em dispositivos touch por performance/usabilidade.

## Componentização e dados

- `src/data/content.js` — fonte única de conteúdo, exporta `about`, `services[]`, `experiences[]`, `projects[]`, `skills[]`, `socials{}`. Todo o conteúdo é placeholder, marcado com comentários `// EDITAR AQUI` para facilitar a substituição futura.
- Componentes de seção: `Header`, `Hero`, `Services`, `Experience`, `Projects`, `Skills`, `Contact`, `Footer`.
- Componentes utilitários: `AnimatedSection`, `CustomCursor`, `TypingText`.
- Links de contato apontam para placeholders (`https://wa.me/55...`, `linkedin.com/in/...`, `github.com/...`), fáceis de trocar em `socials{}`.

## Fora de escopo

- Formulário de contato funcional / backend.
- Deploy (será tratado separadamente, se solicitado).
- Internacionalização (site em português apenas).
- CMS ou painel de edição de conteúdo.

## Testes e verificação

- `npm run build` sem erros e `npm run lint` limpo.
- Verificação manual com `npm run dev`: responsividade (mobile/desktop), funcionamento do menu hambúrguer, scroll suave até âncoras, animações sem travamentos perceptíveis.
