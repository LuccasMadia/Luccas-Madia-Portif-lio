# Redirecionador de QR Codes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar ao portfólio (`luccasmadia.com.br`) um redirecionador de QR codes com ativação tardia: códigos são gerados e impressos antes de terem cliente, e são vinculados a um destino depois, escaneando com o celular logado como admin.

**Architecture:** Vercel Functions no mesmo projeto do portfólio (Vite + React). `GET /api/qr/[codigo]` roda em Edge Runtime e resolve o redirecionamento consultando Postgres (Neon) via `@neondatabase/serverless` (driver HTTP, funciona em Edge). As rotas `/api/admin/*` rodam como Node Function normal, protegidas por cookie de sessão assinado. O frontend do admin é um conjunto simples de páginas React roteadas dentro do SPA existente. Um script standalone (`scripts/gerar-lote.js`) gera lotes de códigos + SVGs vetoriais dos QRs.

**Tech Stack:** React 19, react-router-dom 7, Vite, Vercel Functions (Edge + Node), `@neondatabase/serverless`, `qrcode`, Vitest + @testing-library/react.

## Global Constraints

- Todo código-fonte e comentários (quando houver) em português do Brasil, nomes de função/variável em português, como no resto do repo.
- Sem novas dependências além de `@neondatabase/serverless` e `qrcode` — nada de ORM, nada de biblioteca de PDF, nada de framework de rate-limit.
- Redirecionamento do código ativo é sempre HTTP 302, nunca 301.
- Destino (`destino_url`) só aceita `http://` ou `https://`; qualquer outro esquema é rejeitado.
- Cookie de sessão: `httpOnly`, `secure`, `SameSite=Strict`, sem dados sensíveis no payload.
- Toda função criptográfica usa Web Crypto (`crypto.subtle`, `crypto.getRandomValues`) — nunca `node:crypto` — porque o handler público roda em Edge Runtime, que não tem os módulos `node:*`.
- Testes que tocam o banco rodam contra o Neon real criado na Task 1 (mesma `DATABASE_URL` do dev), limpando as linhas que criam (`afterEach`). Não há mocks de banco.
- Estilo do projeto: aspas simples, ponto e vírgula, 2 espaços de indentação (ver `eslint.config.js`).

---

## File Structure

```
db/schema.sql                          Task 1  — schema Postgres (codigos, login_tentativas)
scripts/migrar.js                      Task 1  — aplica db/schema.sql no DATABASE_URL
src/server/db.js                       Task 1  — cliente Neon (sql tagged template)
src/server/validarUrl.js               Task 2  — validação de destino_url
src/server/sessao.js                   Task 3  — cookie de sessão assinado (Web Crypto)
src/server/rateLimit.js                Task 4  — decisão pura de bloqueio de login
src/server/qrSvg.js                    Task 5  — matriz do QR → SVG, com centro limpo
src/server/codigos.js                  Task 6, 7 — CRUD de códigos (Postgres real)
src/server/loginTentativas.js          Task 8  — persistência de tentativas de login
src/server/qr.js                       Task 9  — resolverCodigo (lookup + contador)
src/server/qrResponse.js               Task 9  — descritor → Response HTTP
api/qr/[codigo].js                     Task 10 — Edge Function pública
src/server/login.js                    Task 11 — processarLogin
api/admin/login.js                     Task 12 — Node Function
api/admin/logout.js                    Task 12 — Node Function
src/server/adminAuth.js                Task 13 — exigirSessaoAdmin
api/admin/codigos.js                   Task 13 — GET lista
api/admin/codigos/[codigo].js          Task 13 — GET detalhe / PUT edição
scripts/gerar-lote.js                  Task 14 — CLI de geração de lote
vercel.json                            Task 15 — rewrite /qr/:codigo
src/App.jsx                            Task 15, 16, 17, 18 — novas rotas
src/pages/QrNaoAtivado.jsx             Task 15
src/pages/QrIndisponivel.jsx           Task 15
src/admin/api.js                       Task 16 — fetch wrapper do admin
src/admin/LoginPage.jsx                Task 16
src/admin/CodigosListPage.jsx          Task 17
src/admin/AtivarEditarPage.jsx         Task 18
README.md                              Task 19 — passo a passo
```

---

### Task 1: Setup — dependências, banco Neon, schema, cliente de conexão

**Files:**
- Modify: `package.json`
- Create: `db/schema.sql`
- Create: `scripts/migrar.js`
- Create: `src/server/db.js`
- Create: `.env.local.example`

**Interfaces:**
- Produces: `criarClienteDb(databaseUrl: string) => sql` (tagged template Neon), usado por todas as tasks de `src/server/*.js` que tocam banco.

- [ ] **Step 1: Instalar dependências**

Run: `npm install @neondatabase/serverless qrcode`

Expected: `package.json` ganha as duas entradas em `dependencies`.

- [ ] **Step 2: Criar o banco no Neon**

No painel da Vercel do projeto do portfólio: **Storage → Create Database → Postgres (Neon)**. Depois de criado, copie a `DATABASE_URL` (formato `postgres://user:pass@host/db?sslmode=require`) — ela é injetada automaticamente nas env vars do projeto na Vercel, mas para rodar local você também precisa dela em `.env.local`.

- [ ] **Step 3: Criar `.env.local.example`**

```bash
ADMIN_PASSWORD=troque-por-uma-senha-forte
SESSION_SECRET=troque-por-uma-string-aleatoria-longa
DATABASE_URL=postgres://user:pass@host/db?sslmode=require
BASE_URL=http://localhost:5173
```

Copie esse arquivo para `.env.local` (já ignorado pelo `.gitignore`) e preencha com os valores reais.

- [ ] **Step 4: Criar `db/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS codigos (
  codigo TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'nao_ativado',
  cliente_nome TEXT,
  destino_url TEXT,
  observacoes TEXT,
  escaneamentos INTEGER NOT NULL DEFAULT 0,
  ultimo_acesso_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_tentativas (
  ip TEXT PRIMARY KEY,
  tentativas INTEGER NOT NULL DEFAULT 0,
  bloqueado_ate TIMESTAMPTZ
);
```

- [ ] **Step 5: Criar `scripts/migrar.js`**

```js
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Defina DATABASE_URL antes de rodar a migração.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');

await sql(schema);
console.log('Migração aplicada com sucesso.');
```

- [ ] **Step 6: Criar `src/server/db.js`**

```js
import { neon } from '@neondatabase/serverless';

export function criarClienteDb(databaseUrl) {
  if (!databaseUrl) throw new Error('DATABASE_URL não configurada');
  return neon(databaseUrl);
}
```

- [ ] **Step 7: Rodar a migração e confirmar**

Run: `node --env-file=.env.local scripts/migrar.js`
Expected: `Migração aplicada com sucesso.` impresso no terminal, sem erros.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json db/schema.sql scripts/migrar.js src/server/db.js .env.local.example
git commit -m "feat: adiciona banco Postgres e cliente de conexao para o redirecionador de QR"
```

---

### Task 2: `src/server/validarUrl.js` — validação do destino

**Files:**
- Create: `src/server/validarUrl.js`
- Test: `src/server/validarUrl.test.js`

**Interfaces:**
- Produces: `ehUrlValida(url: string): boolean` — usado pela Task 7 (edição de código) e Task 11/13 (handlers de admin).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { ehUrlValida } from './validarUrl.js';

describe('ehUrlValida', () => {
  it('aceita http e https', () => {
    expect(ehUrlValida('https://exemplo.com.br')).toBe(true);
    expect(ehUrlValida('http://exemplo.com.br/pagina')).toBe(true);
  });

  it('rejeita javascript: e outros esquemas', () => {
    expect(ehUrlValida('javascript:alert(1)')).toBe(false);
    expect(ehUrlValida('data:text/html,oi')).toBe(false);
    expect(ehUrlValida('ftp://exemplo.com')).toBe(false);
  });

  it('rejeita string vazia, nula ou malformada', () => {
    expect(ehUrlValida('')).toBe(false);
    expect(ehUrlValida(null)).toBe(false);
    expect(ehUrlValida('não é uma url')).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/validarUrl.test.js`
Expected: FAIL — `validarUrl.js` não existe.

- [ ] **Step 3: Implementar**

```js
export function ehUrlValida(url) {
  if (typeof url !== 'string' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/validarUrl.test.js`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/validarUrl.js src/server/validarUrl.test.js
git commit -m "feat: adiciona validacao de url de destino"
```

---

### Task 3: `src/server/sessao.js` — cookie de sessão assinado

**Files:**
- Create: `src/server/sessao.js`
- Test: `src/server/sessao.test.js`

**Interfaces:**
- Produces:
  - `criarCookieSessao(segredo: string, validadeDias = 30): Promise<string>` — valor do cookie (sem o resto do header).
  - `sessaoEhAdminValida(segredo: string, valorCookie: string | undefined): Promise<boolean>`
  - `lerCookie(cabecalhoCookie: string | null, nome: string): string | null`
- Consumido por: Task 9 (`qr.js`), Task 11 (`login.js`), Task 13 (`adminAuth.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { criarCookieSessao, sessaoEhAdminValida, lerCookie } from './sessao.js';

describe('lerCookie', () => {
  it('extrai o valor de um cookie pelo nome', () => {
    expect(lerCookie('a=1; sessao=abc.def; b=2', 'sessao')).toBe('abc.def');
  });

  it('retorna null quando o cookie não existe ou o header é nulo', () => {
    expect(lerCookie('a=1', 'sessao')).toBeNull();
    expect(lerCookie(null, 'sessao')).toBeNull();
  });
});

describe('criarCookieSessao / sessaoEhAdminValida', () => {
  it('um cookie recém-criado é válido', async () => {
    const cookie = await criarCookieSessao('segredo-teste');
    expect(await sessaoEhAdminValida('segredo-teste', cookie)).toBe(true);
  });

  it('rejeita cookie assinado com outro segredo', async () => {
    const cookie = await criarCookieSessao('segredo-teste');
    expect(await sessaoEhAdminValida('outro-segredo', cookie)).toBe(false);
  });

  it('rejeita cookie adulterado', async () => {
    const cookie = await criarCookieSessao('segredo-teste');
    const adulterado = cookie.slice(0, -1) + (cookie.at(-1) === 'a' ? 'b' : 'a');
    expect(await sessaoEhAdminValida('segredo-teste', adulterado)).toBe(false);
  });

  it('rejeita cookie expirado', async () => {
    const cookie = await criarCookieSessao('segredo-teste', -1);
    expect(await sessaoEhAdminValida('segredo-teste', cookie)).toBe(false);
  });

  it('rejeita valor vazio ou indefinido', async () => {
    expect(await sessaoEhAdminValida('segredo-teste', undefined)).toBe(false);
    expect(await sessaoEhAdminValida('segredo-teste', '')).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/sessao.test.js`
Expected: FAIL — `sessao.js` não existe.

- [ ] **Step 3: Implementar**

```js
function paraBase64Url(bytes) {
  let binario = '';
  bytes.forEach((b) => { binario += String.fromCharCode(b); });
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64Url(texto) {
  const normalizado = texto.replace(/-/g, '+').replace(/_/g, '/');
  const preenchido = normalizado.padEnd(normalizado.length + ((4 - (normalizado.length % 4)) % 4), '=');
  const binario = atob(preenchido);
  return Uint8Array.from(binario, (c) => c.charCodeAt(0));
}

async function assinar(segredo, dados) {
  const chave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const assinatura = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(dados));
  return paraBase64Url(new Uint8Array(assinatura));
}

function comparacaoConstante(a, b) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

export function lerCookie(cabecalhoCookie, nome) {
  if (!cabecalhoCookie) return null;
  const partes = cabecalhoCookie.split(';').map((p) => p.trim());
  const encontrado = partes.find((p) => p.startsWith(`${nome}=`));
  return encontrado ? encontrado.slice(nome.length + 1) : null;
}

export async function criarCookieSessao(segredo, validadeDias = 30) {
  const payload = { admin: true, exp: Date.now() + validadeDias * 24 * 60 * 60 * 1000 };
  const payloadB64 = paraBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const assinatura = await assinar(segredo, payloadB64);
  return `${payloadB64}.${assinatura}`;
}

export async function sessaoEhAdminValida(segredo, valorCookie) {
  if (!valorCookie || !valorCookie.includes('.')) return false;
  const [payloadB64, assinatura] = valorCookie.split('.');
  const assinaturaEsperada = await assinar(segredo, payloadB64);
  if (!comparacaoConstante(assinatura, assinaturaEsperada)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(deBase64Url(payloadB64)));
    return payload.admin === true && payload.exp > Date.now();
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/sessao.test.js`
Expected: PASS (7 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/sessao.js src/server/sessao.test.js
git commit -m "feat: adiciona cookie de sessao assinado para o admin"
```

---

### Task 4: `src/server/rateLimit.js` — decisão pura de bloqueio de login

**Files:**
- Create: `src/server/rateLimit.js`
- Test: `src/server/rateLimit.test.js`

**Interfaces:**
- Produces:
  - `estaBloqueado(bloqueadoAte: Date | string | null, agora?: Date): boolean`
  - `proximoEstado(tentativasAtuais: number, agora?: Date): { tentativas: number, bloqueadoAte: Date | null }`
- Consumido por: Task 8 (`loginTentativas.js`) e Task 11 (`login.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { estaBloqueado, proximoEstado } from './rateLimit.js';

describe('estaBloqueado', () => {
  it('false quando bloqueadoAte é nulo', () => {
    expect(estaBloqueado(null)).toBe(false);
  });

  it('true quando bloqueadoAte é no futuro', () => {
    const agora = new Date('2026-01-01T12:00:00Z');
    expect(estaBloqueado(new Date('2026-01-01T12:05:00Z'), agora)).toBe(true);
  });

  it('false quando bloqueadoAte já passou', () => {
    const agora = new Date('2026-01-01T12:10:00Z');
    expect(estaBloqueado(new Date('2026-01-01T12:05:00Z'), agora)).toBe(false);
  });
});

describe('proximoEstado', () => {
  it('incrementa tentativas sem bloquear antes do limite', () => {
    const agora = new Date('2026-01-01T12:00:00Z');
    expect(proximoEstado(3, agora)).toEqual({ tentativas: 4, bloqueadoAte: null });
  });

  it('bloqueia por 15 minutos ao atingir 5 tentativas', () => {
    const agora = new Date('2026-01-01T12:00:00Z');
    const resultado = proximoEstado(4, agora);
    expect(resultado.tentativas).toBe(5);
    expect(resultado.bloqueadoAte.toISOString()).toBe('2026-01-01T12:15:00.000Z');
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/rateLimit.test.js`
Expected: FAIL — `rateLimit.js` não existe.

- [ ] **Step 3: Implementar**

```js
const LIMITE_TENTATIVAS = 5;
const JANELA_BLOQUEIO_MS = 15 * 60 * 1000;

export function estaBloqueado(bloqueadoAte, agora = new Date()) {
  return Boolean(bloqueadoAte) && new Date(bloqueadoAte) > agora;
}

export function proximoEstado(tentativasAtuais, agora = new Date()) {
  const tentativas = tentativasAtuais + 1;
  const bloqueadoAte = tentativas >= LIMITE_TENTATIVAS ? new Date(agora.getTime() + JANELA_BLOQUEIO_MS) : null;
  return { tentativas, bloqueadoAte };
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/rateLimit.test.js`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/rateLimit.js src/server/rateLimit.test.js
git commit -m "feat: adiciona regra pura de rate limit de login"
```

---

### Task 5: `src/server/qrSvg.js` — matriz do QR em SVG com centro limpo

**Files:**
- Create: `src/server/qrSvg.js`
- Test: `src/server/qrSvg.test.js`

**Interfaces:**
- Produces:
  - `matrizComCentroLimpo(modules: { size: number, data: Uint8Array }, percentualArea?: number): { size: number, data: Uint8Array }`
  - `matrizParaSvg(modules: { size: number, data: Uint8Array }, opcoes?: { moduleColor?: string, quietZone?: number }): string`
- Consumido por: Task 14 (`scripts/gerar-lote.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import QRCode from 'qrcode';
import { matrizComCentroLimpo, matrizParaSvg } from './qrSvg.js';

describe('matrizComCentroLimpo', () => {
  it('limpa um quadrado central de ~20% da área e preserva os cantos', () => {
    const modules = QRCode.create('https://luccasmadia.com.br/qr/abc1234', { errorCorrectionLevel: 'H' }).modules;
    const limpa = matrizComCentroLimpo(modules, 0.2);
    const { size, data } = limpa;

    // cantos (padrões de localização) preservados
    expect(data[0]).toBe(modules.data[0]);
    expect(data[size - 1]).toBe(modules.data[size - 1]);
    expect(data[(size - 1) * size]).toBe(modules.data[(size - 1) * size]);

    // centro exato está limpo (bit de escuro = 0)
    const meio = Math.floor(size / 2);
    expect(data[meio * size + meio] & 1).toBe(0);

    // área limpa é aproximadamente 20% do total (tolerância de arredondamento)
    const ladoEsperado = Math.floor(Math.sqrt(0.2) * size);
    const areaEsperada = ladoEsperado * ladoEsperado;
    let modulosLimpos = 0;
    for (let i = 0; i < data.length; i++) {
      if ((modules.data[i] & 1) === 1 && (data[i] & 1) === 0) modulosLimpos++;
    }
    expect(modulosLimpos).toBeLessThanOrEqual(areaEsperada);
  });
});

describe('matrizParaSvg', () => {
  it('gera um SVG vetorial com quiet zone e sem módulos no centro limpo', () => {
    const modules = QRCode.create('https://luccasmadia.com.br/qr/abc1234', { errorCorrectionLevel: 'H' }).modules;
    const limpa = matrizComCentroLimpo(modules, 0.2);
    const svg = matrizParaSvg(limpa, { quietZone: 4 });

    expect(svg).toContain('<svg');
    expect(svg).toContain(`viewBox="0 0 ${limpa.size + 8} ${limpa.size + 8}"`);
    expect(svg).toContain('<rect');

    const meio = Math.floor(limpa.size / 2) + 4;
    expect(svg).not.toContain(`x="${meio}" y="${meio}"`);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/qrSvg.test.js`
Expected: FAIL — `qrSvg.js` não existe.

- [ ] **Step 3: Implementar**

```js
export function matrizComCentroLimpo(modules, percentualArea = 0.2) {
  const { size, data } = modules;
  const novaData = Uint8Array.from(data);
  const ladoLimpo = Math.floor(Math.sqrt(percentualArea) * size);
  const inicio = Math.floor((size - ladoLimpo) / 2);
  for (let y = inicio; y < inicio + ladoLimpo; y++) {
    for (let x = inicio; x < inicio + ladoLimpo; x++) {
      novaData[y * size + x] = 0;
    }
  }
  return { size, data: novaData };
}

export function matrizParaSvg(modules, opcoes = {}) {
  const { moduleColor = '#000000', quietZone = 4 } = opcoes;
  const { size, data } = modules;
  const totalSize = size + quietZone * 2;
  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((data[y * size + x] & 1) === 1) {
        rects += `<rect x="${x + quietZone}" y="${y + quietZone}" width="1" height="1"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges" fill="${moduleColor}">${rects}</svg>`;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/qrSvg.test.js`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/qrSvg.js src/server/qrSvg.test.js
git commit -m "feat: adiciona geracao de svg do qr com centro livre para logo"
```

---

### Task 6: `src/server/codigos.js` (parte 1) — geração e busca

**Files:**
- Create: `src/server/codigos.js`
- Test: `src/server/codigos.test.js`

**Interfaces:**
- Produces:
  - `gerarCodigo(tamanho?: number): string`
  - `gerarCodigoUnico(sql, tamanho?: number): Promise<string>`
  - `criarCodigos(sql, codigos: string[]): Promise<void>`
  - `buscarCodigo(sql, codigo: string): Promise<object | undefined>`
- Consumes: `criarClienteDb` (Task 1) para obter `sql` nos testes.
- Consumido por: Task 7 (mesmo arquivo), Task 9 (`qr.js`), Task 14 (`gerar-lote.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { criarClienteDb } from './db.js';
import { gerarCodigo, gerarCodigoUnico, criarCodigos, buscarCodigo } from './codigos.js';

const sql = criarClienteDb(process.env.DATABASE_URL);

async function limpar(codigos) {
  for (const codigo of codigos) await sql`DELETE FROM codigos WHERE codigo = ${codigo}`;
}

describe('gerarCodigo', () => {
  it('gera código do tamanho pedido, sem caracteres ambíguos', () => {
    const codigo = gerarCodigo(7);
    expect(codigo).toHaveLength(7);
    expect(codigo).not.toMatch(/[0O1lI]/);
  });
});

describe('gerarCodigoUnico / criarCodigos / buscarCodigo', () => {
  it('gera um código que não existe no banco e persiste com criarCodigos', async () => {
    const codigo = await gerarCodigoUnico(sql, 7);
    await criarCodigos(sql, [codigo]);
    const registro = await buscarCodigo(sql, codigo);
    expect(registro.codigo).toBe(codigo);
    expect(registro.status).toBe('nao_ativado');
    await limpar([codigo]);
  });

  it('buscarCodigo retorna undefined para código inexistente', async () => {
    const registro = await buscarCodigo(sql, 'teste_inexistente');
    expect(registro).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/codigos.test.js`
Expected: FAIL — `codigos.js` não existe. (Requer `DATABASE_URL` em `.env.local`; rode com `npx --node-options='--env-file=.env.local' vitest run src/server/codigos.test.js` se as env vars não carregarem automaticamente.)

- [ ] **Step 3: Implementar**

```js
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function gerarCodigo(tamanho = 7) {
  let codigo = '';
  const aleatorios = crypto.getRandomValues(new Uint32Array(tamanho));
  for (let i = 0; i < tamanho; i++) {
    codigo += ALFABETO[aleatorios[i] % ALFABETO.length];
  }
  return codigo;
}

export async function gerarCodigoUnico(sql, tamanho = 7, tentativasMax = 10) {
  for (let i = 0; i < tentativasMax; i++) {
    const codigo = gerarCodigo(tamanho);
    const existente = await buscarCodigo(sql, codigo);
    if (!existente) return codigo;
  }
  throw new Error('Não foi possível gerar código único após várias tentativas');
}

export async function criarCodigos(sql, codigos) {
  for (const codigo of codigos) {
    await sql`INSERT INTO codigos (codigo, status) VALUES (${codigo}, 'nao_ativado')`;
  }
}

export async function buscarCodigo(sql, codigo) {
  const linhas = await sql`SELECT * FROM codigos WHERE codigo = ${codigo}`;
  return linhas[0];
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/codigos.test.js`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/codigos.js src/server/codigos.test.js
git commit -m "feat: adiciona geracao unica e busca de codigos no banco"
```

---

### Task 7: `src/server/codigos.js` (parte 2) — escaneamento, listagem e edição

**Files:**
- Modify: `src/server/codigos.js`
- Modify: `src/server/codigos.test.js`

**Interfaces:**
- Consumes: `ehUrlValida` (Task 2), `buscarCodigo` (Task 6).
- Produces:
  - `registrarEscaneamento(sql, codigo: string): Promise<string | null>` — retorna `destino_url` ou `null` se o código não existir.
  - `listarCodigos(sql, filtro?: { busca?: string, status?: string }): Promise<object[]>`
  - `atualizarCodigo(sql, codigo: string, dados: { clienteNome?: string, destinoUrl?: string, observacoes?: string, status?: string }): Promise<object>` — lança erro se `destinoUrl` for inválido.
- Consumido por: Task 9 (`qr.js`), Task 13 (handlers de admin).

- [ ] **Step 1: Adicionar os testes (falhando)**

Adicionar ao final de `src/server/codigos.test.js`, antes do fechamento do último `describe`:

```js
import { registrarEscaneamento, listarCodigos, atualizarCodigo } from './codigos.js';

describe('registrarEscaneamento', () => {
  it('incrementa o contador e retorna o destino', async () => {
    const codigo = await gerarCodigoUnico(sql, 7);
    await criarCodigos(sql, [codigo]);
    await sql`UPDATE codigos SET status = 'ativo', destino_url = 'https://exemplo.com' WHERE codigo = ${codigo}`;

    const destino = await registrarEscaneamento(sql, codigo);
    expect(destino).toBe('https://exemplo.com');

    const registro = await buscarCodigo(sql, codigo);
    expect(registro.escaneamentos).toBe(1);
    expect(registro.ultimo_acesso_em).not.toBeNull();
    await limpar([codigo]);
  });

  it('retorna null para código inexistente', async () => {
    expect(await registrarEscaneamento(sql, 'teste_inexistente')).toBeNull();
  });
});

describe('listarCodigos', () => {
  it('filtra por status e por busca no nome do cliente', async () => {
    const codigo = await gerarCodigoUnico(sql, 7);
    await criarCodigos(sql, [codigo]);
    await atualizarCodigo(sql, codigo, { clienteNome: 'Padaria Teste XYZ', destinoUrl: 'https://exemplo.com', status: 'ativo' });

    const porStatus = await listarCodigos(sql, { status: 'ativo' });
    expect(porStatus.some((c) => c.codigo === codigo)).toBe(true);

    const porBusca = await listarCodigos(sql, { busca: 'Padaria Teste XYZ' });
    expect(porBusca.map((c) => c.codigo)).toContain(codigo);
    await limpar([codigo]);
  });
});

describe('atualizarCodigo', () => {
  it('atualiza nome, destino e status', async () => {
    const codigo = await gerarCodigoUnico(sql, 7);
    await criarCodigos(sql, [codigo]);

    const atualizado = await atualizarCodigo(sql, codigo, {
      clienteNome: 'Cliente Teste',
      destinoUrl: 'https://exemplo.com/cliente',
      status: 'ativo',
    });
    expect(atualizado.cliente_nome).toBe('Cliente Teste');
    expect(atualizado.destino_url).toBe('https://exemplo.com/cliente');
    expect(atualizado.status).toBe('ativo');
    await limpar([codigo]);
  });

  it('rejeita destino_url inválida', async () => {
    const codigo = await gerarCodigoUnico(sql, 7);
    await criarCodigos(sql, [codigo]);
    await expect(atualizarCodigo(sql, codigo, { destinoUrl: 'javascript:alert(1)' })).rejects.toThrow();
    await limpar([codigo]);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/codigos.test.js`
Expected: FAIL nos testes novos — `registrarEscaneamento`, `listarCodigos`, `atualizarCodigo` não existem.

- [ ] **Step 3: Implementar**

Adicionar ao final de `src/server/codigos.js`:

```js
import { ehUrlValida } from './validarUrl.js';

export async function registrarEscaneamento(sql, codigo) {
  const linhas = await sql`
    UPDATE codigos SET escaneamentos = escaneamentos + 1, ultimo_acesso_em = now()
    WHERE codigo = ${codigo}
    RETURNING destino_url
  `;
  return linhas[0]?.destino_url ?? null;
}

export async function listarCodigos(sql, filtro = {}) {
  const { busca, status } = filtro;
  if (busca && status) {
    return sql`
      SELECT * FROM codigos
      WHERE status = ${status} AND (codigo ILIKE ${'%' + busca + '%'} OR cliente_nome ILIKE ${'%' + busca + '%'})
      ORDER BY criado_em DESC
    `;
  }
  if (busca) {
    return sql`
      SELECT * FROM codigos
      WHERE codigo ILIKE ${'%' + busca + '%'} OR cliente_nome ILIKE ${'%' + busca + '%'}
      ORDER BY criado_em DESC
    `;
  }
  if (status) {
    return sql`SELECT * FROM codigos WHERE status = ${status} ORDER BY criado_em DESC`;
  }
  return sql`SELECT * FROM codigos ORDER BY criado_em DESC`;
}

export async function atualizarCodigo(sql, codigo, dados) {
  const { clienteNome, destinoUrl, observacoes, status } = dados;
  if (destinoUrl !== undefined && destinoUrl !== null && destinoUrl !== '' && !ehUrlValida(destinoUrl)) {
    throw new Error('destino_url inválida');
  }
  const linhas = await sql`
    UPDATE codigos SET
      cliente_nome = COALESCE(${clienteNome ?? null}, cliente_nome),
      destino_url = COALESCE(${destinoUrl ?? null}, destino_url),
      observacoes = COALESCE(${observacoes ?? null}, observacoes),
      status = COALESCE(${status ?? null}, status),
      atualizado_em = now()
    WHERE codigo = ${codigo}
    RETURNING *
  `;
  if (!linhas[0]) throw new Error('Código não encontrado');
  return linhas[0];
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/codigos.test.js`
Expected: PASS (7 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/codigos.js src/server/codigos.test.js
git commit -m "feat: adiciona escaneamento, listagem e edicao de codigos"
```

---

### Task 8: `src/server/loginTentativas.js` — persistência de tentativas de login

**Files:**
- Create: `src/server/loginTentativas.js`
- Test: `src/server/loginTentativas.test.js`

**Interfaces:**
- Consumes: `estaBloqueado`, `proximoEstado` (Task 4).
- Produces:
  - `obterTentativas(sql, ip: string): Promise<{ tentativas: number, bloqueadoAte: Date | null }>`
  - `registrarFalha(sql, ip: string, agora?: Date): Promise<{ tentativas: number, bloqueadoAte: Date | null }>`
  - `resetarTentativas(sql, ip: string): Promise<void>`
- Consumido por: Task 11 (`login.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { criarClienteDb } from './db.js';
import { obterTentativas, registrarFalha, resetarTentativas } from './loginTentativas.js';

const sql = criarClienteDb(process.env.DATABASE_URL);
const IP_TESTE = 'teste_192.0.2.1';

afterEach(async () => {
  await sql`DELETE FROM login_tentativas WHERE ip = ${IP_TESTE}`;
});

describe('obterTentativas', () => {
  it('retorna zerado quando o IP nunca tentou', async () => {
    expect(await obterTentativas(sql, IP_TESTE)).toEqual({ tentativas: 0, bloqueadoAte: null });
  });
});

describe('registrarFalha', () => {
  it('incrementa a cada chamada e bloqueia na quinta', async () => {
    for (let i = 0; i < 4; i++) await registrarFalha(sql, IP_TESTE);
    const quinta = await registrarFalha(sql, IP_TESTE);
    expect(quinta.tentativas).toBe(5);
    expect(quinta.bloqueadoAte).not.toBeNull();
  });
});

describe('resetarTentativas', () => {
  it('zera as tentativas do IP', async () => {
    await registrarFalha(sql, IP_TESTE);
    await resetarTentativas(sql, IP_TESTE);
    expect(await obterTentativas(sql, IP_TESTE)).toEqual({ tentativas: 0, bloqueadoAte: null });
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/loginTentativas.test.js`
Expected: FAIL — `loginTentativas.js` não existe.

- [ ] **Step 3: Implementar**

```js
import { proximoEstado } from './rateLimit.js';

export async function obterTentativas(sql, ip) {
  const linhas = await sql`SELECT tentativas, bloqueado_ate FROM login_tentativas WHERE ip = ${ip}`;
  if (!linhas[0]) return { tentativas: 0, bloqueadoAte: null };
  return { tentativas: linhas[0].tentativas, bloqueadoAte: linhas[0].bloqueado_ate };
}

export async function registrarFalha(sql, ip, agora = new Date()) {
  const atual = await obterTentativas(sql, ip);
  const { tentativas, bloqueadoAte } = proximoEstado(atual.tentativas, agora);
  await sql`
    INSERT INTO login_tentativas (ip, tentativas, bloqueado_ate) VALUES (${ip}, ${tentativas}, ${bloqueadoAte})
    ON CONFLICT (ip) DO UPDATE SET tentativas = ${tentativas}, bloqueado_ate = ${bloqueadoAte}
  `;
  return { tentativas, bloqueadoAte };
}

export async function resetarTentativas(sql, ip) {
  await sql`DELETE FROM login_tentativas WHERE ip = ${ip}`;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/loginTentativas.test.js`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/loginTentativas.js src/server/loginTentativas.test.js
git commit -m "feat: adiciona persistencia de tentativas de login"
```

---

### Task 9: `src/server/qr.js` + `src/server/qrResponse.js` — resolução do código

**Files:**
- Create: `src/server/qr.js`
- Create: `src/server/qrResponse.js`
- Test: `src/server/qr.test.js`
- Test: `src/server/qrResponse.test.js`

**Interfaces:**
- Consumes: `buscarCodigo`, `registrarEscaneamento` (Task 7).
- Produces:
  - `resolverCodigo(sql, codigo: string, { ehAdmin: boolean }): Promise<{ tipo: 'destino', url: string } | { tipo: 'ativar', codigo: string } | { tipo: 'nao_ativado' } | { tipo: 'indisponivel' }>`
  - `descritorParaResponse(descritor, baseUrl: string): Response`
- Consumido por: Task 10 (`api/qr/[codigo].js`).

- [ ] **Step 1: Escrever os testes de `qr.js` (falhando)**

```js
import { criarClienteDb } from './db.js';
import { criarCodigos, gerarCodigoUnico } from './codigos.js';
import { resolverCodigo } from './qr.js';

const sql = criarClienteDb(process.env.DATABASE_URL);

async function limpar(codigo) {
  await sql`DELETE FROM codigos WHERE codigo = ${codigo}`;
}

describe('resolverCodigo', () => {
  it('retorna indisponivel para código inexistente', async () => {
    expect(await resolverCodigo(sql, 'teste_inexistente', { ehAdmin: false })).toEqual({ tipo: 'indisponivel' });
  });

  it('retorna indisponivel para código desativado', async () => {
    const codigo = await gerarCodigoUnico(sql);
    await criarCodigos(sql, [codigo]);
    await sql`UPDATE codigos SET status = 'desativado' WHERE codigo = ${codigo}`;
    expect(await resolverCodigo(sql, codigo, { ehAdmin: false })).toEqual({ tipo: 'indisponivel' });
    await limpar(codigo);
  });

  it('não ativado + visitante comum → nao_ativado', async () => {
    const codigo = await gerarCodigoUnico(sql);
    await criarCodigos(sql, [codigo]);
    expect(await resolverCodigo(sql, codigo, { ehAdmin: false })).toEqual({ tipo: 'nao_ativado' });
    await limpar(codigo);
  });

  it('não ativado + admin → ativar', async () => {
    const codigo = await gerarCodigoUnico(sql);
    await criarCodigos(sql, [codigo]);
    expect(await resolverCodigo(sql, codigo, { ehAdmin: true })).toEqual({ tipo: 'ativar', codigo });
    await limpar(codigo);
  });

  it('ativo → destino e incrementa contador', async () => {
    const codigo = await gerarCodigoUnico(sql);
    await criarCodigos(sql, [codigo]);
    await sql`UPDATE codigos SET status = 'ativo', destino_url = 'https://exemplo.com' WHERE codigo = ${codigo}`;
    expect(await resolverCodigo(sql, codigo, { ehAdmin: false })).toEqual({ tipo: 'destino', url: 'https://exemplo.com' });
    await limpar(codigo);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/qr.test.js`
Expected: FAIL — `qr.js` não existe.

- [ ] **Step 3: Implementar `src/server/qr.js`**

```js
import { buscarCodigo, registrarEscaneamento } from './codigos.js';

export async function resolverCodigo(sql, codigo, { ehAdmin }) {
  const registro = await buscarCodigo(sql, codigo);
  if (!registro || registro.status === 'desativado') {
    return { tipo: 'indisponivel' };
  }
  if (registro.status === 'nao_ativado') {
    return ehAdmin ? { tipo: 'ativar', codigo } : { tipo: 'nao_ativado' };
  }
  const url = await registrarEscaneamento(sql, codigo);
  return { tipo: 'destino', url };
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/qr.test.js`
Expected: PASS (5 testes).

- [ ] **Step 5: Escrever os testes de `qrResponse.js` (falhando)**

```js
import { descritorParaResponse } from './qrResponse.js';

describe('descritorParaResponse', () => {
  it('destino → 302 para a url', () => {
    const res = descritorParaResponse({ tipo: 'destino', url: 'https://exemplo.com' }, 'https://luccasmadia.com.br');
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://exemplo.com');
  });

  it('ativar → 302 para /admin/ativar/:codigo', () => {
    const res = descritorParaResponse({ tipo: 'ativar', codigo: 'abc1234' }, 'https://luccasmadia.com.br');
    expect(res.headers.get('location')).toBe('https://luccasmadia.com.br/admin/ativar/abc1234');
  });

  it('nao_ativado → 302 para /qr/nao-ativado', () => {
    const res = descritorParaResponse({ tipo: 'nao_ativado' }, 'https://luccasmadia.com.br');
    expect(res.headers.get('location')).toBe('https://luccasmadia.com.br/qr/nao-ativado');
  });

  it('indisponivel → 302 para /qr/indisponivel', () => {
    const res = descritorParaResponse({ tipo: 'indisponivel' }, 'https://luccasmadia.com.br');
    expect(res.headers.get('location')).toBe('https://luccasmadia.com.br/qr/indisponivel');
  });
});
```

- [ ] **Step 6: Rodar e confirmar que falha**

Run: `npx vitest run src/server/qrResponse.test.js`
Expected: FAIL — `qrResponse.js` não existe.

- [ ] **Step 7: Implementar `src/server/qrResponse.js`**

```js
export function descritorParaResponse(descritor, baseUrl) {
  const destinos = {
    destino: descritor.url,
    ativar: `${baseUrl}/admin/ativar/${descritor.codigo}`,
    nao_ativado: `${baseUrl}/qr/nao-ativado`,
    indisponivel: `${baseUrl}/qr/indisponivel`,
  };
  return Response.redirect(destinos[descritor.tipo], 302);
}
```

- [ ] **Step 8: Rodar e confirmar que passa**

Run: `npx vitest run src/server/qrResponse.test.js`
Expected: PASS (4 testes).

- [ ] **Step 9: Commit**

```bash
git add src/server/qr.js src/server/qrResponse.js src/server/qr.test.js src/server/qrResponse.test.js
git commit -m "feat: adiciona resolucao do codigo e mapeamento para resposta http"
```

---

### Task 10: `api/qr/[codigo].js` — Edge Function pública

**Files:**
- Create: `api/qr/[codigo].js`

**Interfaces:**
- Consumes: `criarClienteDb` (Task 1), `lerCookie`, `sessaoEhAdminValida` (Task 3), `resolverCodigo` (Task 9), `descritorParaResponse` (Task 9).

- [ ] **Step 1: Implementar**

```js
import { criarClienteDb } from '../../src/server/db.js';
import { lerCookie, sessaoEhAdminValida } from '../../src/server/sessao.js';
import { resolverCodigo } from '../../src/server/qr.js';
import { descritorParaResponse } from '../../src/server/qrResponse.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const codigo = new URL(request.url).pathname.split('/').pop();
  const sql = criarClienteDb(process.env.DATABASE_URL);
  const cookieSessao = lerCookie(request.headers.get('cookie'), 'sessao');
  const ehAdmin = await sessaoEhAdminValida(process.env.SESSION_SECRET, cookieSessao);

  const descritor = await resolverCodigo(sql, codigo, { ehAdmin });
  return descritorParaResponse(descritor, process.env.BASE_URL);
}
```

- [ ] **Step 2: Testar manualmente com `vercel dev`**

Run: `npx vercel dev` (primeira vez pede login/link do projeto — siga o prompt)

Em outro terminal, com um código de teste inserido manualmente no banco (`INSERT INTO codigos (codigo, status, destino_url) VALUES ('teste1', 'ativo', 'https://exemplo.com')`):

Run: `curl -i http://localhost:3000/qr/teste1`
Expected: `HTTP/1.1 302` com `location: https://exemplo.com`.

Run: `curl -i http://localhost:3000/qr/codigo-que-nao-existe`
Expected: `HTTP/1.1 302` com `location: .../qr/indisponivel`.

- [ ] **Step 3: Commit**

```bash
git add api/qr/[codigo].js
git commit -m "feat: adiciona edge function publica de redirecionamento do qr"
```

---

### Task 11: `src/server/login.js` — processamento do login admin

**Files:**
- Create: `src/server/login.js`
- Test: `src/server/login.test.js`

**Interfaces:**
- Consumes: `criarCookieSessao` (Task 3), `obterTentativas`, `registrarFalha`, `resetarTentativas` (Task 8), `estaBloqueado` (Task 4).
- Produces: `processarLogin(sql, { senha, ip, senhaEsperada, segredoSessao }): Promise<{ ok: true, cookie: string } | { ok: false, motivo: 'bloqueado' | 'senha_invalida' }>`
- Consumido por: Task 12 (`api/admin/login.js`).

- [ ] **Step 1: Escrever os testes (falhando)**

```js
import { criarClienteDb } from './db.js';
import { processarLogin } from './login.js';

const sql = criarClienteDb(process.env.DATABASE_URL);
const IP_TESTE = 'teste_198.51.100.1';

afterEach(async () => {
  await sql`DELETE FROM login_tentativas WHERE ip = ${IP_TESTE}`;
});

describe('processarLogin', () => {
  it('senha correta gera cookie de sessão', async () => {
    const resultado = await processarLogin(sql, {
      senha: 'senha-certa', ip: IP_TESTE, senhaEsperada: 'senha-certa', segredoSessao: 'segredo',
    });
    expect(resultado.ok).toBe(true);
    expect(typeof resultado.cookie).toBe('string');
  });

  it('senha errada retorna motivo senha_invalida e conta a tentativa', async () => {
    const resultado = await processarLogin(sql, {
      senha: 'errada', ip: IP_TESTE, senhaEsperada: 'senha-certa', segredoSessao: 'segredo',
    });
    expect(resultado).toEqual({ ok: false, motivo: 'senha_invalida' });
  });

  it('bloqueia após 5 tentativas erradas', async () => {
    for (let i = 0; i < 5; i++) {
      await processarLogin(sql, { senha: 'errada', ip: IP_TESTE, senhaEsperada: 'certa', segredoSessao: 'segredo' });
    }
    const resultado = await processarLogin(sql, { senha: 'certa', ip: IP_TESTE, senhaEsperada: 'certa', segredoSessao: 'segredo' });
    expect(resultado).toEqual({ ok: false, motivo: 'bloqueado' });
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/server/login.test.js`
Expected: FAIL — `login.js` não existe.

- [ ] **Step 3: Implementar**

```js
import { obterTentativas, registrarFalha, resetarTentativas } from './loginTentativas.js';
import { estaBloqueado } from './rateLimit.js';
import { criarCookieSessao } from './sessao.js';

export async function processarLogin(sql, { senha, ip, senhaEsperada, segredoSessao }) {
  const atual = await obterTentativas(sql, ip);
  if (estaBloqueado(atual.bloqueadoAte)) {
    return { ok: false, motivo: 'bloqueado' };
  }
  if (senha !== senhaEsperada) {
    await registrarFalha(sql, ip);
    return { ok: false, motivo: 'senha_invalida' };
  }
  await resetarTentativas(sql, ip);
  const cookie = await criarCookieSessao(segredoSessao);
  return { ok: true, cookie };
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/server/login.test.js`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add src/server/login.js src/server/login.test.js
git commit -m "feat: adiciona processamento de login com rate limit"
```

---

### Task 12: `api/admin/login.js` + `api/admin/logout.js`

**Files:**
- Create: `api/admin/login.js`
- Create: `api/admin/logout.js`

**Interfaces:**
- Consumes: `criarClienteDb` (Task 1), `processarLogin` (Task 11).

- [ ] **Step 1: Implementar `api/admin/login.js`**

```js
import { criarClienteDb } from '../../src/server/db.js';
import { processarLogin } from '../../src/server/login.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const { senha } = req.body ?? {};
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'desconhecido').split(',')[0].trim();
  const sql = criarClienteDb(process.env.DATABASE_URL);

  const resultado = await processarLogin(sql, {
    senha, ip, senhaEsperada: process.env.ADMIN_PASSWORD, segredoSessao: process.env.SESSION_SECRET,
  });

  if (!resultado.ok) {
    const status = resultado.motivo === 'bloqueado' ? 429 : 401;
    return res.status(status).json({ erro: resultado.motivo });
  }

  res.setHeader('Set-Cookie', `sessao=${resultado.cookie}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`);
  res.status(200).json({ ok: true });
}
```

- [ ] **Step 2: Implementar `api/admin/logout.js`**

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  res.setHeader('Set-Cookie', 'sessao=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  res.status(200).json({ ok: true });
}
```

- [ ] **Step 3: Testar manualmente com `vercel dev`**

Run: `curl -i -X POST http://localhost:3000/api/admin/login -H "Content-Type: application/json" -d '{"senha":"senha-errada"}'`
Expected: `HTTP/1.1 401` com `{"erro":"senha_invalida"}`.

Run: `curl -i -X POST http://localhost:3000/api/admin/login -H "Content-Type: application/json" -d '{"senha":"<ADMIN_PASSWORD do .env.local>"}'`
Expected: `HTTP/1.1 200` com header `set-cookie: sessao=...`.

- [ ] **Step 4: Commit**

```bash
git add api/admin/login.js api/admin/logout.js
git commit -m "feat: adiciona login e logout do admin"
```

---

### Task 13: `src/server/adminAuth.js` + rotas de admin de códigos

**Files:**
- Create: `src/server/adminAuth.js`
- Create: `api/admin/codigos.js`
- Create: `api/admin/codigos/[codigo].js`

**Interfaces:**
- Consumes: `lerCookie`, `sessaoEhAdminValida` (Task 3), `listarCodigos`, `buscarCodigo`, `atualizarCodigo` (Task 7).
- Produces: `exigirSessaoAdmin(req): Promise<boolean>`

- [ ] **Step 1: Implementar `src/server/adminAuth.js`**

```js
import { lerCookie, sessaoEhAdminValida } from './sessao.js';

export async function exigirSessaoAdmin(req) {
  const cookie = lerCookie(req.headers.cookie, 'sessao');
  return sessaoEhAdminValida(process.env.SESSION_SECRET, cookie);
}
```

- [ ] **Step 2: Implementar `api/admin/codigos.js`**

```js
import { criarClienteDb } from '../../src/server/db.js';
import { exigirSessaoAdmin } from '../../src/server/adminAuth.js';
import { listarCodigos } from '../../src/server/codigos.js';

export default async function handler(req, res) {
  if (!(await exigirSessaoAdmin(req))) return res.status(401).json({ erro: 'nao_autenticado' });
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

  const sql = criarClienteDb(process.env.DATABASE_URL);
  const { busca, status } = req.query;
  const lista = await listarCodigos(sql, { busca, status });
  res.status(200).json(lista);
}
```

- [ ] **Step 3: Implementar `api/admin/codigos/[codigo].js`**

```js
import { criarClienteDb } from '../../../src/server/db.js';
import { exigirSessaoAdmin } from '../../../src/server/adminAuth.js';
import { buscarCodigo, atualizarCodigo } from '../../../src/server/codigos.js';

export default async function handler(req, res) {
  if (!(await exigirSessaoAdmin(req))) return res.status(401).json({ erro: 'nao_autenticado' });

  const sql = criarClienteDb(process.env.DATABASE_URL);
  const { codigo } = req.query;

  if (req.method === 'GET') {
    const registro = await buscarCodigo(sql, codigo);
    if (!registro) return res.status(404).json({ erro: 'nao_encontrado' });
    return res.status(200).json(registro);
  }

  if (req.method === 'PUT') {
    try {
      const atualizado = await atualizarCodigo(sql, codigo, {
        clienteNome: req.body?.clienteNome,
        destinoUrl: req.body?.destinoUrl,
        observacoes: req.body?.observacoes,
        status: req.body?.status,
      });
      return res.status(200).json(atualizado);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  res.status(405).json({ erro: 'Método não permitido' });
}
```

- [ ] **Step 4: Testar manualmente com `vercel dev`**

Run: `curl -i http://localhost:3000/api/admin/codigos`
Expected: `HTTP/1.1 401` (sem cookie de sessão).

Com o cookie obtido no login da Task 12 (`-H "Cookie: sessao=<valor>"`):

Run: `curl -i http://localhost:3000/api/admin/codigos -H "Cookie: sessao=<valor>"`
Expected: `HTTP/1.1 200` com a lista de códigos em JSON.

- [ ] **Step 5: Commit**

```bash
git add src/server/adminAuth.js api/admin/codigos.js "api/admin/codigos/[codigo].js"
git commit -m "feat: adiciona rotas admin de listagem e edicao de codigos"
```

---

### Task 14: `scripts/gerar-lote.js` — geração de lote

**Files:**
- Create: `scripts/gerar-lote.js`

**Interfaces:**
- Consumes: `gerarCodigoUnico`, `criarCodigos` (Task 6), `matrizComCentroLimpo`, `matrizParaSvg` (Task 5), `criarClienteDb` (Task 1).

- [ ] **Step 1: Implementar**

```js
import { mkdirSync, writeFileSync } from 'node:fs';
import QRCode from 'qrcode';
import { criarClienteDb } from '../src/server/db.js';
import { gerarCodigoUnico, criarCodigos } from '../src/server/codigos.js';
import { matrizComCentroLimpo, matrizParaSvg } from '../src/server/qrSvg.js';

function lerQuantidade() {
  const indice = process.argv.indexOf('--qtd');
  const valor = indice >= 0 ? Number(process.argv[indice + 1]) : NaN;
  if (!Number.isInteger(valor) || valor < 1) {
    console.error('Uso: npm run gerar-lote -- --qtd 100');
    process.exit(1);
  }
  return valor;
}

function montarGrade(svgs, colunas = 10) {
  const ladoCelula = 40;
  const linhas = Math.ceil(svgs.length / colunas);
  let conteudo = '';
  svgs.forEach((svg, i) => {
    const col = i % colunas;
    const linha = Math.floor(i / colunas);
    const miolo = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    conteudo += `<g transform="translate(${col * ladoCelula}, ${linha * ladoCelula})"><svg width="${ladoCelula}" height="${ladoCelula}" viewBox="0 0 100 100">${miolo}</svg></g>`;
  });
  const largura = colunas * ladoCelula;
  const altura = linhas * ladoCelula;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}">${conteudo}</svg>`;
}

async function main() {
  const quantidade = lerQuantidade();
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error('Defina BASE_URL antes de rodar o script.');
    process.exit(1);
  }

  const sql = criarClienteDb(process.env.DATABASE_URL);
  mkdirSync('./lote', { recursive: true });

  const codigos = [];
  for (let i = 0; i < quantidade; i++) {
    codigos.push(await gerarCodigoUnico(sql));
  }
  await criarCodigos(sql, codigos);

  const linhasCsv = ['codigo,url'];
  const svgs = [];
  for (const codigo of codigos) {
    const url = `${baseUrl}/qr/${codigo}`;
    const modules = QRCode.create(url, { errorCorrectionLevel: 'H' }).modules;
    const limpa = matrizComCentroLimpo(modules, 0.2);
    const svg = matrizParaSvg(limpa);
    writeFileSync(`./lote/${codigo}.svg`, svg);
    svgs.push(svg);
    linhasCsv.push(`${codigo},${url}`);
  }

  writeFileSync('./lote/lote.csv', linhasCsv.join('\n'));
  writeFileSync('./lote/folha.svg', montarGrade(svgs));

  console.log(`Gerados ${quantidade} códigos em ./lote (SVGs individuais + lote.csv + folha.svg).`);
}

main();
```

- [ ] **Step 2: Adicionar o script no `package.json`**

```json
"gerar-lote": "node --env-file=.env.local scripts/gerar-lote.js"
```

- [ ] **Step 3: Rodar manualmente e verificar**

Run: `npm run gerar-lote -- --qtd 3`
Expected: `Gerados 3 códigos em ./lote (SVGs individuais + lote.csv + folha.svg).` — confira que `./lote/lote.csv` tem 4 linhas (cabeçalho + 3), que existem 3 arquivos `<codigo>.svg`, e que `./lote/folha.svg` abre num navegador mostrando os 3 QRs lado a lado. Escaneie um dos SVGs com o celular (abra no navegador primeiro, ou importe no CorelDRAW e exporte um PNG) e confirme que ele aponta para `<BASE_URL>/qr/<codigo>`.

- [ ] **Step 4: Adicionar `./lote/` ao `.gitignore`**

Adicionar linha `lote/` ao `.gitignore` (são artefatos gerados, não fonte).

- [ ] **Step 5: Commit**

```bash
git add scripts/gerar-lote.js package.json .gitignore
git commit -m "feat: adiciona script de geracao de lote de qr codes"
```

---

### Task 15: Roteamento público — `vercel.json` + páginas neutras

**Files:**
- Modify: `vercel.json`
- Modify: `src/App.jsx`
- Create: `src/pages/QrNaoAtivado.jsx`
- Create: `src/pages/QrIndisponivel.jsx`
- Test: `src/pages/QrNaoAtivado.test.jsx`
- Test: `src/pages/QrIndisponivel.test.jsx`

- [ ] **Step 1: Atualizar `vercel.json`**

```json
{
  "rewrites": [
    { "source": "/qr/:codigo", "destination": "/api/qr/:codigo" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Escrever os testes das páginas (falhando)**

```js
// src/pages/QrNaoAtivado.test.jsx
import { render, screen } from '@testing-library/react';
import { QrNaoAtivado } from './QrNaoAtivado';

describe('QrNaoAtivado', () => {
  it('mostra mensagem neutra sem revelar detalhes do código', () => {
    render(<QrNaoAtivado />);
    expect(screen.getByText(/ainda não foi ativado/i)).toBeInTheDocument();
  });
});
```

```js
// src/pages/QrIndisponivel.test.jsx
import { render, screen } from '@testing-library/react';
import { QrIndisponivel } from './QrIndisponivel';

describe('QrIndisponivel', () => {
  it('mostra mensagem de link indisponível', () => {
    render(<QrIndisponivel />);
    expect(screen.getByText(/link indisponível/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Rodar e confirmar que falham**

Run: `npx vitest run src/pages/QrNaoAtivado.test.jsx src/pages/QrIndisponivel.test.jsx`
Expected: FAIL — os componentes não existem.

- [ ] **Step 4: Implementar as páginas**

```jsx
// src/pages/QrNaoAtivado.jsx
export function QrNaoAtivado() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <p>Este código ainda não foi ativado.</p>
    </main>
  );
}
```

```jsx
// src/pages/QrIndisponivel.jsx
export function QrIndisponivel() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <p>Link indisponível.</p>
    </main>
  );
}
```

- [ ] **Step 5: Rodar e confirmar que passam**

Run: `npx vitest run src/pages/QrNaoAtivado.test.jsx src/pages/QrIndisponivel.test.jsx`
Expected: PASS (2 testes).

- [ ] **Step 6: Adicionar as rotas em `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProjectsPage } from './pages/ProjectsPage';
import { QrNaoAtivado } from './pages/QrNaoAtivado';
import { QrIndisponivel } from './pages/QrIndisponivel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<ProjectsPage />} />
        <Route path="/qr/nao-ativado" element={<QrNaoAtivado />} />
        <Route path="/qr/indisponivel" element={<QrIndisponivel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 7: Commit**

```bash
git add vercel.json src/App.jsx src/pages/QrNaoAtivado.jsx src/pages/QrIndisponivel.jsx src/pages/QrNaoAtivado.test.jsx src/pages/QrIndisponivel.test.jsx
git commit -m "feat: adiciona paginas publicas de codigo nao ativado e indisponivel"
```

---

### Task 16: `src/admin/api.js` + tela de login

**Files:**
- Create: `src/admin/api.js`
- Create: `src/admin/LoginPage.jsx`
- Test: `src/admin/LoginPage.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `adminApi(path: string, opcoes?: RequestInit): Promise<any>` — lança erro com `.status` em respostas não-OK; redireciona para `/admin/login` em 401.
- Consumido por: Task 17, Task 18.

- [ ] **Step 1: Implementar `src/admin/api.js`**

```js
export async function adminApi(path, opcoes = {}) {
  const res = await fetch(`/api/admin${path}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    credentials: 'include',
  });
  if (res.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('nao_autenticado');
  }
  if (!res.ok) {
    const corpo = await res.json().catch(() => ({}));
    const erro = new Error(corpo.erro ?? 'Erro na requisição');
    erro.status = res.status;
    throw erro;
  }
  return res.status === 204 ? null : res.json();
}
```

- [ ] **Step 2: Escrever o teste da tela de login (falhando)**

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('envia a senha e mostra erro quando a API recusa', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ erro: 'senha_invalida' }) });
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(screen.getByText(/senha inválida/i)).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith('/api/admin/login', expect.objectContaining({ method: 'POST' }));
  });
});
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npx vitest run src/admin/LoginPage.test.jsx`
Expected: FAIL — `LoginPage.jsx` não existe.

- [ ] **Step 4: Implementar `src/admin/LoginPage.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navegar = useNavigate();
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    });
    setEnviando(false);
    if (!res.ok) {
      const corpo = await res.json().catch(() => ({}));
      setErro(corpo.erro === 'bloqueado' ? 'Muitas tentativas. Aguarde alguns minutos.' : 'Senha inválida.');
      return;
    }
    navegar('/admin');
  }

  return (
    <main style={{ maxWidth: 320, margin: '4rem auto', padding: '0 1rem' }}>
      <form onSubmit={enviar}>
        <label htmlFor="senha">Senha admin</label>
        <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button type="submit" disabled={enviando}>Entrar</button>
        {erro && <p role="alert">{erro}</p>}
      </form>
    </main>
  );
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npx vitest run src/admin/LoginPage.test.jsx`
Expected: PASS (1 teste).

- [ ] **Step 6: Adicionar a rota em `src/App.jsx`**

```jsx
import { LoginPage } from './admin/LoginPage';
// ...
<Route path="/admin/login" element={<LoginPage />} />
```

- [ ] **Step 7: Commit**

```bash
git add src/admin/api.js src/admin/LoginPage.jsx src/admin/LoginPage.test.jsx src/App.jsx
git commit -m "feat: adiciona login do admin no frontend"
```

---

### Task 17: `src/admin/CodigosListPage.jsx` — lista, busca e filtro

**Files:**
- Create: `src/admin/CodigosListPage.jsx`
- Test: `src/admin/CodigosListPage.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `adminApi` (Task 16).

- [ ] **Step 1: Escrever o teste (falhando)**

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CodigosListPage } from './CodigosListPage';

describe('CodigosListPage', () => {
  it('lista os códigos retornados pela API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        { codigo: 'abc1234', cliente_nome: 'Padaria X', status: 'ativo', escaneamentos: 12, destino_url: 'https://x.com', ultimo_acesso_em: null },
      ]),
    });
    render(<MemoryRouter><CodigosListPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('abc1234')).toBeInTheDocument());
    expect(screen.getByText('Padaria X')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/admin/CodigosListPage.test.jsx`
Expected: FAIL — `CodigosListPage.jsx` não existe.

- [ ] **Step 3: Implementar**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from './api';

export function CodigosListPage() {
  const [codigos, setCodigos] = useState([]);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (busca) params.set('busca', busca);
    if (status) params.set('status', status);
    adminApi(`/codigos?${params.toString()}`).then(setCodigos).catch(() => {});
  }, [busca, status]);

  function copiarLink(codigo) {
    navigator.clipboard.writeText(`${window.location.origin}/qr/${codigo}`);
  }

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Códigos</h1>
      <input placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todos</option>
        <option value="ativo">Ativos</option>
        <option value="nao_ativado">Não ativados</option>
        <option value="desativado">Desativados</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Código</th><th>Cliente</th><th>Destino</th><th>Status</th><th>Scans</th><th>Último acesso</th><th></th>
          </tr>
        </thead>
        <tbody>
          {codigos.map((c) => (
            <tr key={c.codigo}>
              <td>{c.codigo}</td>
              <td>{c.cliente_nome ?? '—'}</td>
              <td>{c.destino_url ?? '—'}</td>
              <td>{c.status}</td>
              <td>{c.escaneamentos}</td>
              <td>{c.ultimo_acesso_em ?? '—'}</td>
              <td>
                <button onClick={() => copiarLink(c.codigo)}>Copiar link</button>
                <Link to={`/admin/editar/${c.codigo}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/admin/CodigosListPage.test.jsx`
Expected: PASS (1 teste).

- [ ] **Step 5: Adicionar a rota em `src/App.jsx`**

```jsx
import { CodigosListPage } from './admin/CodigosListPage';
// ...
<Route path="/admin" element={<CodigosListPage />} />
```

- [ ] **Step 6: Commit**

```bash
git add src/admin/CodigosListPage.jsx src/admin/CodigosListPage.test.jsx src/App.jsx
git commit -m "feat: adiciona lista de codigos com busca e filtro no admin"
```

---

### Task 18: `src/admin/AtivarEditarPage.jsx` — ativação e edição

**Files:**
- Create: `src/admin/AtivarEditarPage.jsx`
- Test: `src/admin/AtivarEditarPage.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `adminApi` (Task 16).

- [ ] **Step 1: Escrever o teste (falhando)**

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AtivarEditarPage } from './AtivarEditarPage';

describe('AtivarEditarPage', () => {
  it('carrega o código, edita e salva', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ codigo: 'abc1234', cliente_nome: '', destino_url: '', observacoes: '', status: 'nao_ativado' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(
      <MemoryRouter initialEntries={['/admin/ativar/abc1234']}>
        <Routes><Route path="/admin/ativar/:codigo" element={<AtivarEditarPage />} /></Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText(/nome do cliente/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/nome do cliente/i), { target: { value: 'Padaria X' } });
    fireEvent.change(screen.getByLabelText(/url de destino/i), { target: { value: 'https://padaria.com' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/admin/codigos/abc1234', expect.objectContaining({ method: 'PUT' })));
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/admin/AtivarEditarPage.test.jsx`
Expected: FAIL — `AtivarEditarPage.jsx` não existe.

- [ ] **Step 3: Implementar**

```jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from './api';

export function AtivarEditarPage() {
  const { codigo } = useParams();
  const navegar = useNavigate();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    adminApi(`/codigos/${codigo}`).then(setDados).catch(() => {});
  }, [codigo]);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    try {
      await adminApi(`/codigos/${codigo}`, {
        method: 'PUT',
        body: JSON.stringify({
          clienteNome: dados.cliente_nome,
          destinoUrl: dados.destino_url,
          observacoes: dados.observacoes,
          status: 'ativo',
        }),
      });
      navegar('/admin');
    } catch (e) {
      setErro(e.message);
    }
  }

  if (!dados) return <p>Carregando...</p>;

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{codigo}</h1>
      <form onSubmit={salvar}>
        <label htmlFor="cliente_nome">Nome do cliente</label>
        <input id="cliente_nome" value={dados.cliente_nome ?? ''} onChange={(e) => setDados({ ...dados, cliente_nome: e.target.value })} />

        <label htmlFor="destino_url">URL de destino</label>
        <input id="destino_url" value={dados.destino_url ?? ''} onChange={(e) => setDados({ ...dados, destino_url: e.target.value })} />

        <label htmlFor="observacoes">Observações</label>
        <textarea id="observacoes" value={dados.observacoes ?? ''} onChange={(e) => setDados({ ...dados, observacoes: e.target.value })} />

        <label>
          <input
            type="checkbox"
            checked={dados.status === 'ativo'}
            onChange={(e) => setDados({ ...dados, status: e.target.checked ? 'ativo' : 'desativado' })}
          />{' '}
          Ativo
        </label>

        <button type="submit">Salvar</button>
        {erro && <p role="alert">{erro}</p>}
      </form>
    </main>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run src/admin/AtivarEditarPage.test.jsx`
Expected: PASS (1 teste).

- [ ] **Step 5: Adicionar as rotas em `src/App.jsx`**

```jsx
import { AtivarEditarPage } from './admin/AtivarEditarPage';
// ...
<Route path="/admin/ativar/:codigo" element={<AtivarEditarPage />} />
<Route path="/admin/editar/:codigo" element={<AtivarEditarPage />} />
```

- [ ] **Step 6: Commit**

```bash
git add src/admin/AtivarEditarPage.jsx src/admin/AtivarEditarPage.test.jsx src/App.jsx
git commit -m "feat: adiciona tela de ativacao e edicao de codigo"
```

---

### Task 19: README com passo a passo

**Files:**
- Modify: `README.md` (criar se não existir)

- [ ] **Step 1: Escrever a seção**

Adicionar ao `README.md`:

```markdown
## Redirecionador de QR Codes

### Configuração inicial

1. Na Vercel, abra o projeto do portfólio → **Storage → Create Database → Postgres (Neon)**.
2. Copie a `DATABASE_URL` gerada.
3. Copie `.env.local.example` para `.env.local` e preencha `ADMIN_PASSWORD`, `SESSION_SECRET` (uma string aleatória longa), `DATABASE_URL` e `BASE_URL`.
4. Nas configurações do projeto na Vercel (Settings → Environment Variables), adicione as mesmas quatro variáveis para produção.
5. Rode a migração: `node --env-file=.env.local scripts/migrar.js`.

### Gerando um lote de adesivos

```bash
npm run gerar-lote -- --qtd 100
```

Gera em `./lote/`: um `.svg` por código, `lote.csv` (código + URL completa) e `folha.svg` (grade com todos, pra importar no CorelDRAW). Os QRs saem com o centro (~20%) livre para você posicionar a logo do cliente depois — o nível de correção de erro (H) tolera essa área faltando.

### Ativando um adesivo

1. Acesse `/admin/login` no site e entre com a `ADMIN_PASSWORD`.
2. Escaneie o QR do adesivo com o celular logado — você cai direto na tela de ativação.
3. Preencha nome do cliente e URL de destino, salve.
4. Da próxima vez que alguém escanear, vai direto para o destino. Pra trocar o destino depois, edite pelo painel em `/admin`.

### Rodando local

`npx vercel dev` (necessário porque as rotas `/api/*` não rodam no `vite dev` puro).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: adiciona passo a passo do redirecionador de qr"
```
