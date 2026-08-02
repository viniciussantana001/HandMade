# HandMade 5.0 — Marketplace de Economia Circular

Protótipo de alta fidelidade **mobile-first** do marketplace HandMade, desenvolvido como
Trabalho de Conclusão de Curso do Curso Técnico em Desenvolvimento de Sistemas da Etec Euro
Albino de Souza, Mogi Guaçu — SP, 2026.

O protótipo é uma demonstração navegável: **não há backend, API nem banco de dados**. Toda a
persistência acontece no `localStorage` do navegador, simulando o Firestore previsto para a
aplicação final em Flutter.

## Equipe

- Vinicius Santana dos Santos
- Yago Smith da Silva
- Nathan Costa Batista
- Thomaz de Moraes Teixeira

## Stack técnica

- **React 18** + **TypeScript 5**
- **Vite 5** como bundler
- **Tailwind CSS 3** + componentes **shadcn/ui** (Radix UI)
- **React Router DOM 6** para navegação
- **TanStack React Query 5** para estado
- **react-hook-form** + **zod** para formulários e validação
- **framer-motion** para animações
- **recharts** para os gráficos do painel
- **sonner** para avisos
- **lucide-react** para ícones
- **Vitest** para os testes automatizados
- Persistência local via **localStorage** (prefixo `hm_v5_`)

## Como rodar

```bash
npm install        # ou: bun install

npm run dev        # desenvolvimento
npm run build      # build de produção
npm run preview    # servir o build
npm test           # 94 testes automatizados
```

O protótipo abre **sem conexão com a internet**: as fotos do catálogo estão embutidas em
`public/materiais/` — 13 materiais em três larguras cada (320/640/1280 px), mais o avatar da
vendedora —, com manifesto gerado a partir dos arquivos reais.

### Conta de demonstração

```
e-mail: demo@handmade.com
senha:  Demo@1234
```

## O que mudou da versão 4.0 para a 5.0

### Correções de falhas
1. **Tela branca após sair da conta** — a sessão passou a ser observável; nenhuma tela
   protegida devolve `null` e não há mais `window.location.reload()` no projeto.
2. **Tela branca após impulsionar anúncio** — o impulsionamento ganhou rota própria
   (`/impulsionar/:id`) e os efeitos passaram a rodar antes da troca de passo.

### Carteira removida — pagamento direto
A Carteira saiu por inteiro, e não só da interface: mudou o modelo de dados. As coleções
`transactions` e `withdrawals` deram lugar a `payments`. O comprador paga o vendedor
diretamente pelo método escolhido (PIX, cartão ou boleto), a taxa de serviço é descontada no
momento da venda conforme o plano, e não existe saldo, depósito nem saque.

Fluxo: **método → confirmação → recibo**.

### Novidades
- Painel do vendedor redesenhado, com métricas de desempenho
- Seleção de fotos do próprio dispositivo, no anúncio e no perfil
- Termos de Uso, Política de Privacidade e Central de Privacidade (LGPD) como telas
- Guia de tributos para o vendedor (PF/PJ, MEI, Simples, DAS, NFC-e/NF-e)
- Plano de negócio com números calculados (`lib/business.ts`)

### Acabamento e acessibilidade
As 48 telas foram auditadas nos temas claro e escuro. A paleta não foi escolhida a olho: as
luminosidades saíram de um roteiro que resolve a menor alteração capaz de satisfazer o
contraste mínimo da **WCAG 2.2 nível AA** em todas as combinações que o código realmente
usa, preservando matiz e saturação da marca.

Também entraram suporte a `prefers-reduced-motion`, foco visível nos controles nativos,
alvos de toque de no mínimo 24×24 px e `env(safe-area-inset-bottom)` na barra inferior.

## Estrutura de pastas

```
public/
  materiais/        # fotos do catálogo, 3 larguras cada
src/
  components/
    common/         # PhotoPicker, SmartImage, EmptyState, ErrorBoundary
    layout/         # AppHeader, AppLayout, BottomNav
    listings/       # ListingCard
    ui/             # componentes shadcn/ui
  hooks/            # hooks próprios
  lib/              # AuthContext, ThemeContext, session, store, types, seedData,
                    # business, images, imageManifest, validators, categories, plans
  pages/            # 30 páginas
  test/             # 94 testes (vitest)
  App.tsx
  main.tsx
  index.css
```

A documentação escrita (personas, métodos de avaliação, monografia, diagramas e Wiki) fica fora
do protótipo, em `documentos/`, para manter esta pasta apenas com código executável.

## Telas

**Públicas** — Início, Marketplace, Detalhe do anúncio, Login, Cadastro (PF e PJ, três
etapas cada), Boas-vindas, Como Funciona, Central de Ajuda, Termos de Uso, Política de
Privacidade, página 404.

**Área do usuário** — Perfil, Editar perfil, Favoritos, Notificações, Conversas e chat,
Meus Pedidos, Meus Pagamentos, Central de Privacidade.

**Área do vendedor** — Painel de desempenho, Meus Anúncios, Publicar anúncio (três etapas),
Editar anúncio, Impulsionar anúncio, Planos, Guia de Tributos, Plano de Negócio.

**Pagamento** — escolha do método, confirmação, processamento e recibo.

Ao todo: 48 telas cheias mais 7 sobreposições, e 272 pontos de interação.

## Verificação

| O quê | Como | Resultado |
|---|---|---|
| Tipos | `tsc --noEmit` | sem erros |
| Testes | `npm test` | 94 de 94 |
| Fluxos ponta a ponta | Playwright | 36 de 36, zero erro de console |
| Acessibilidade | auditoria em navegador | 48 telas, 0 problema |

## Limites declarados

Não houve teste com usuário real nem com leitor de tela nesta versão. As métricas de
usabilidade descritas em `../documentos/qualidade/metodos-de-avaliacao.md` são **alvos de
projeto**, não resultados observados. O que foi medido de fato é o que consta na tabela acima.

## Status

Versão 5.0 final — pronta para apresentação em banca.
