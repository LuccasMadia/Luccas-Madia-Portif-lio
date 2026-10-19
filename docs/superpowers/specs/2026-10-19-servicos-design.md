# Seção Serviços — rascunho (conversa pausada)

**Estado:** em conversa, não aprovado. Pausado em 2026-10-19 para trabalhar primeiro na hero. Nada foi implementado ainda.

## Por que mudar

Os clientes não sabem que o Lucca configura e gerencia Google Meu Negócio nem que vende placas NFC. Além disso, ele ainda não tinha uma descrição clara desses dois serviços. Hoje a seção mostra quatro cartões genéricos (`services` em `src/data/content.js`): Desenvolvimento Web, Consultoria em Gestão, Automação de Processos e Suporte Administrativo.

## O que já foi decidido

Ficam quatro serviços:

1. **Sites e Sistemas** (substitui "Desenvolvimento Web").
2. **Automação de Processos** (continua).
3. **Google Meu Negócio** (novo).
4. **Placas NFC** (novo).

Saem do site: Consultoria em Gestão e Suporte Administrativo.

### Google Meu Negócio

- **Configuração (valor único):** criar o perfil do negócio no Google, ou editar um que já existe, com fotos, horário de funcionamento e categoria. O objetivo é o negócio aparecer certo quando procuram no Google e no Maps.
- **Gerenciamento mensal (mensalidade):** manter o perfil ativo e atualizado. Inclui responder avaliações, publicar novidades e ofertas, trocar fotos, ajustar horários em feriados, fazer mudanças no perfil quando o negócio mudar e mandar um resumo mensal (visualizações, ligações, pedidos de rota).
- O Lucca confirmou esse resumo. O benefício "ser encontrado no Google e no Maps" e as métricas do resumo foram sugestões do Claude, e ele aprovou.

### Placas NFC

- **O que é:** placa que o cliente final aproxima do celular, ou lê pelo QR code, e cai direto num destino.
- **Principal:** avaliação no Google. É o que o Lucca vendeu até hoje. O argumento de venda é a importância de boas avaliações para o negócio aparecer e passar confiança.
- **Outras finalidades:** a mesma placa pode levar para Instagram, WhatsApp, cardápio, senha do Wi-Fi ou Pix. O Lucca quer apresentar as placas para várias finalidades, com a avaliação no Google como a principal.
- **Incluso:** arte (modelos prontos ou personalizada), configuração, instalação no local e suporte.
- Ligação com o GMN: um perfil bem configurado recebe as avaliações que a placa traz. Isso foi sugestão do Claude, e ele aprovou.

## Em aberto

- O Lucca quer **uma área específica** para os serviços. Falta definir a forma: página própria, seção maior na home, ou outra.
- Falta definir o que o visitante deve fazer depois de ler sobre um serviço (chamar no WhatsApp, ver preços, ver exemplos...).
- Descrições finais de Sites e Sistemas e de Automação de Processos.
- Se os preços aparecem ou não (no CRM, os preços das placas e dos packs já estão cadastrados).
