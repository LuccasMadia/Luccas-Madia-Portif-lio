# Redirecionador de QR Codes (adesivos pré-impressos)

**Data:** 2026-09-29
**Status:** Aprovado para implementação

## Objetivo

Permitir que Luccas (MADIA Consultoria Digital) imprima lotes de adesivos/plaquinhas com QR code (e NFC) **antes** de saber quem vai usá-los, e só depois vincule cada código a um cliente e a um link de destino — escaneando o próprio adesivo com o celular logado como admin. Trocar o destino de um código não exige reimprimir o adesivo.

## Contexto

O projeto vive dentro do **Portifolio Luccas Madia** (`luccasmadia.com.br`), hoje um SPA em Vite + React sem nenhum backend (o spec original do portfólio lista "formulário de contato funcional / backend" como fora de escopo). Este é o primeiro recurso de backend/banco de dados adicionado ao projeto.

## Stack

- **Frontend admin:** React + React Router, dentro do SPA existente (`/src/admin/*`), visual simples e utilitário (sem seguir a identidade visual do portfólio — é uma ferramenta de uso pessoal).
- **Backend:** Vercel Functions no mesmo projeto/deploy do portfólio.
  - `GET /api/qr/[codigo]` roda em **Edge Runtime** (redirecionamento precisa ser rápido e distribuído globalmente).
  - `/api/admin/*` roda em Node Function normal (uso baixo, só Luccas).
- **Banco:** Postgres via Neon (Vercel Marketplace), acessado com `@neondatabase/serverless` (driver HTTP, sem overhead de connection pooling — funciona bem tanto em Edge quanto em Function normal).
- **Geração de QR:** biblioteca `qrcode` (npm), usada em nível baixo (matriz de módulos) para permitir limpar a área central antes de renderizar o SVG.
- **Domínio:** mesmo domínio do portfólio, path `luccasmadia.com.br/qr/<codigo>`.

## Modelo de dados

```sql
CREATE TABLE codigos (
  codigo TEXT PRIMARY KEY,                      -- 6-8 chars, alfabeto sem 0/O/1/l/I
  status TEXT NOT NULL DEFAULT 'nao_ativado',   -- nao_ativado | ativo | desativado
  cliente_nome TEXT,
  destino_url TEXT,
  observacoes TEXT,
  escaneamentos INTEGER NOT NULL DEFAULT 0,
  ultimo_acesso_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE login_tentativas (
  ip TEXT PRIMARY KEY,
  tentativas INTEGER NOT NULL DEFAULT 0,
  bloqueado_ate TIMESTAMPTZ
);
```

Schema mínimo de propósito — dá pra evoluir depois (múltiplos clientes com login próprio, relatório de escaneamentos por período) sem migração dolorosa, mas nada disso é construído agora (YAGNI).

## Roteamento

`vercel.json` ganha uma rewrite específica **antes** da rewrite catch-all do SPA:

```json
{
  "rewrites": [
    { "source": "/qr/:codigo", "destination": "/api/qr/:codigo" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

As páginas `/qr/nao-ativado` e `/qr/indisponivel` são rotas React normais do SPA (estáticas, sem chamada de API), reaproveitando o layout/estilo do site público — não há duplicação de HTML/CSS na function.

## Fluxo público — `GET /api/qr/[codigo]` (Edge)

```
1. SELECT do código no banco.
2. Não existe                → 302 para /qr/indisponivel
3. status = desativado       → 302 para /qr/indisponivel
4. status = nao_ativado:
     - Lê o cookie de sessão. Válido e é admin?
         sim → 302 para /admin/ativar/:codigo
         não → 302 para /qr/nao-ativado (página neutra, não revela nada sobre o código)
5. status = ativo:
     - UPDATE codigos SET escaneamentos = escaneamentos + 1, ultimo_acesso_em = now()
       WHERE codigo = $1 RETURNING destino_url   (uma única query: lookup + contador)
     - 302 para destino_url
```

Redirecionamento é sempre **302** (nunca 301), para o navegador nunca cachear e a troca de destino valer no próximo escaneamento.

## Autenticação admin

- `POST /api/admin/login` recebe a senha e compara com `ADMIN_PASSWORD` (env var).
  - **Errou:** incrementa `login_tentativas.tentativas` para o IP; ao passar de 5 tentativas em 15 minutos, seta `bloqueado_ate` e recusa novas tentativas até esse horário (rate limit simples, sem dependência nova).
  - **Acertou:** gera cookie de sessão assinado com HMAC (`SESSION_SECRET`), `httpOnly`, `secure`, `SameSite=Strict`, validade de 30 dias; zera as tentativas do IP.
- Toda rota `/api/admin/*` (exceto login) exige esse cookie válido; sem ele, responde 401.
- No frontend, qualquer chamada à API admin que volte 401 redireciona a SPA para a tela de login.

## Área admin

Telas simples e utilitárias (sem investimento visual — uso pessoal, foco em ser rápido no celular):

1. **Login** — campo de senha, botão entrar.
2. **Lista de códigos** (`/admin`) — tabela com busca (código/cliente) e filtro (todos/ativos/não ativados/desativados); mostra código, cliente, destino, status, escaneamentos, último acesso; botão "copiar link" por linha (útil para gravar na etiqueta NFC).
3. **Ativar/editar** (`/admin/ativar/:codigo` e `/admin/editar/:codigo` — mesma tela, comportamento idêntico) — nome do cliente, URL de destino, observações, toggle ativo/inativo, botão salvar.

Validação de `destino_url` no backend: aceita apenas `http://` ou `https://`; rejeita `javascript:` e qualquer outro esquema, tanto na ativação quanto na edição.

## Script de geração de lote — `npm run gerar-lote -- --qtd 100`

```
scripts/gerar-lote.js
1. Gera N códigos únicos (6-8 chars, alfabeto sem 0/O/1/l/I), checando colisão no banco.
2. INSERT em lote na tabela `codigos` (status = nao_ativado).
3. Para cada código:
   a. monta a matriz do QR via `qrcode` (nível de correção de erro H)
   b. limpa manualmente os módulos de um quadrado central (~20% da área), preservando
      os 3 padrões de localização (cantos) e a quiet zone de 4 módulos
   c. renderiza a matriz como SVG vetorial puro (retângulos pretos sobre fundo
      transparente, sem gradientes/efeitos)
   d. salva em `./lote/<codigo>.svg`
4. Gera `./lote/lote.csv` (colunas: codigo, url completa)
5. Gera `./lote/folha.svg` — grade com todos os N QRs numa folha só, reaproveitando os
   SVGs já gerados (sem dependência nova de geração de PDF; importável direto no CorelDRAW)
```

Limpar o centro manualmente (em vez de só confiar na tolerância da correção de erro) garante uma área realmente vazia e previsível para o CorelDRAW colocar a logo do cliente depois — nível H tolera até ~30% de dano, então sobra margem confortável para os ~20% centrais reservados.

## Segurança / não-funcionais

- Nenhum dado pessoal armazenado além de nome do cliente e URL de destino.
- Cookie de sessão nunca exposto a JS (`httpOnly`), nunca em texto puro (assinado com HMAC).
- Rate limit de tentativas de login via a tabela `login_tentativas` (sem infraestrutura nova).
- Caminho quente (`GET /api/qr/[codigo]` com status ativo) resolve leitura + contador em uma única query `UPDATE ... RETURNING`, rodando em Edge para latência baixa globalmente.

## Variáveis de ambiente

`ADMIN_PASSWORD`, `SESSION_SECRET`, `DATABASE_URL` (Neon), `BASE_URL`.

## Fora de escopo (por enquanto)

- Múltiplos clientes com login próprio.
- Relatórios de escaneamento por período/gráficos.
- Geração de PDF (a folha de impressão sai em SVG).
- Identidade visual dedicada para a área admin.
- Integração automática com NFC (a gravação da tag é manual, fora do sistema).

## README

Novo `README` (ou seção no README existente) cobrindo: criar o banco Neon pelo marketplace da Vercel, rodar a migration (`codigos` + `login_tentativas`), configurar as env vars no projeto Vercel existente, e como rodar `npm run gerar-lote`.

## Testes e verificação

- Testes automatizados (Vitest, já usado no projeto) para: validação de esquema de URL de destino, geração/checagem de colisão de códigos, lógica de rate limit, e a query de redirecionamento (lookup + contador).
- Verificação manual dos critérios de aceite do spec original:
  - Escanear um QR novo sem estar logado → página neutra.
  - Escanear logado → cai direto na ativação; salvar e o próximo escaneamento já redireciona.
  - Editar o destino no painel → o mesmo QR passa a ir para o novo link imediatamente.
  - Desativar um código → ele deixa de redirecionar.
  - Sem senha, não é possível ver, criar ou editar nada no painel.
  - Os SVGs abrem no CorelDRAW e o QR lê no celular mesmo com logo sobreposta no centro (até ~20%).
