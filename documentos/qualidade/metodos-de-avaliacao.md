# Métodos de inspeção, teste, métricas, acessibilidade e qualidade — HandMade 5.0

Documento da fase C3. Registra **como** a versão 5.0 foi avaliada: quais métodos foram aplicados,
com que instrumento, sobre qual amostra e com qual critério de aprovação.

A escolha metodológica segue um princípio: **avaliação sem critério declarado antes da medição não
é avaliação, é opinião.** Por isso cada método abaixo traz o limiar de aceitação fixado de
antemão, o instrumento que produz o número e o resultado obtido. Onde o protótipo não pode
sustentar uma afirmação — por ser um protótipo client-side, sem usuários reais em produção — o
documento diz isso explicitamente em lugar de sugerir evidência que não existe.



---

## 1. Escopo e limites da avaliação

| Aspecto | Situação |
| --- | --- |
| Natureza do artefato | Protótipo funcional de alta fidelidade, mobile, 100% client-side |
| Persistência | `localStorage` (13 coleções), sem servidor e sem banco remoto |
| Rotas avaliadas | 24 rotas distintas, das 30 declaradas em `App.tsx` |
| Temas avaliados | Claro e escuro — 48 combinações tela × tema |
| Navegador de referência | Chromium, viewport 412 × 915, `deviceScaleFactor` 3, `isMobile`, `hasTouch`, `locale` pt-BR |

**O que esta avaliação não é.** Não houve teste com usuários reais nem coleta de métricas de uso em
produção. Os números de usabilidade declarados na seção 4 são **alvos de projeto e protocolos
prontos para execução**, não resultados observados. Tratar protocolo como resultado seria o erro
metodológico mais grave que este documento poderia cometer, e ele é evitado deliberadamente.

---

## 2. Inspeção — avaliação heurística

### 2.1 Método

Avaliação heurística conforme Nielsen (1994), aplicada tela a tela sobre as 24 rotas. A inspeção é
o método adequado nesta fase porque encontra a maior parte dos problemas de interface a um custo
muito menor que o teste com usuário, e porque não depende de recrutamento.

Cada heurística recebeu um veredito por tela, com a evidência correspondente no código ou na
captura. A tabela abaixo consolida o resultado e aponta a decisão de projeto da 5.0 que atende cada
heurística.

| # | Heurística | Como a 5.0 atende | Evidência |
| --- | --- | --- | --- |
| 1 | Visibilidade do estado do sistema | Esqueleto de carregamento com a silhueta real do conteúdo; botão de envio com estado de espera | `components/common/StateViews.tsx` |
| 2 | Correspondência com o mundo real | Vocabulário do canteiro de obra: "sobra", "retirada no local", "lote", "caçamba" | `lib/categories.ts` |
| 3 | Controle e liberdade | Desfazer em exclusão de anúncio e de favorito; voltar em todo fluxo de passos | `pages/EditListing.tsx`, `pages/ListingDetail.tsx` |
| 4 | Consistência e padrões | Estados de vazio, erro e carregamento centralizados em um só módulo | `StateViews.tsx` |
| 5 | Prevenção de erro | Validação por passo antes de avançar; diálogo de confirmação em ação destrutiva | `pages/CreateListing.tsx`, `components/common/ConfirmDialog.tsx` |
| 6 | Reconhecer em vez de lembrar | Categoria, estado e tipo de negociação por escolha visual, não por digitação | `CreateListing.tsx` |
| 7 | Flexibilidade e eficiência | Busca com sugestões; filtro por categoria, estado, faixa de preço e distância | `pages/Marketplace.tsx` |
| 8 | Estética e design minimalista | Uma ação primária por tela; hierarquia por tamanho e peso, não por cor saturada | `index.css` |
| 9 | Recuperação de erro | Mensagem em linguagem comum com o próximo passo; `ErrorBoundary` no lugar de tela branca | `components/common/ErrorBoundary.tsx` |
| 10 | Ajuda e documentação | Telas de ajuda, como funciona, termos, privacidade e guia de tributos | `pages/Help.tsx`, `pages/SellerTaxes.tsx` |

### 2.2 Percurso cognitivo

Percurso cognitivo (*cognitive walkthrough*) aplicado às três tarefas de maior risco, na perspectiva
das personas de menor familiaridade digital — Carlos e Dona Marlene. Em cada passo pergunta-se: o
usuário vai tentar a ação correta? Vai perceber que o controle existe? Vai associar o controle ao
efeito desejado? Vai entender o retorno do sistema?

| Tarefa | Passo de maior risco identificado | Correção aplicada na 5.0 |
| --- | --- | --- |
| Publicar anúncio | Reconhecer que a foto vem da galeria do próprio celular | `PhotoPicker` com rótulo explícito e área de toque grande (U3) |
| Concluir compra | Entender o valor final antes de confirmar | Taxa e total discriminados no passo de confirmação (B3) |
| Encerrar sessão | Perceber que a sessão terminou | Redirecionamento imediato para `/login`, sem tela branca (B1) |

---

## 3. Teste — estrutura, cobertura e resultado

A verificação é automatizada em três camadas, executáveis por linha de comando. A separação por
camada é intencional: cada uma pega uma classe de defeito que as outras não pegam.

### 3.1 Camada 1 — testes unitários e de integração (Vitest)

**82 testes, 5 arquivos, 100% de aprovação.** Concentram-se na lógica que produz número ou decide
fluxo — precisamente onde o erro é silencioso e não aparece na tela.

| Arquivo | Testes | O que verifica |
| --- | :-: | --- |
| `business.test.ts` | 27 | Premissas, receita, taxa efetiva, custos, ponto de equilíbrio, LTV/CAC, projeção trienal, investimento, impacto socioambiental |
| `payments.test.ts` | 18 | Aprovação PIX, boleto pendente, recusa de cartão, quatro últimos dígitos sem guardar o número, estorno, persistência |
| `validators.test.ts` | 14 | CPF e CNPJ com dígito verificador, cartão de crédito, contato e identidade, senha |
| `store.test.ts` | 14 | Prefixo de armazenamento, operações de coleção, observabilidade (B1 e B2), exclusão total de conta (LGPD art. 18, VI) |
| `formatters.test.ts` | 9 | Moeda, decimal e porcentagem em pt-BR |

**Achado relevante:** dois erros de modelagem do plano de negócio foram descobertos por estes
testes, não por revisão visual — base de assinantes inflada 3,5× e razão LTV/CAC de 59× por
comparar bases distintas. Ambos corrigidos e registrados no `PROGRESSO.md`. É a justificativa
empírica para a existência desta camada.

### 3.2 Camada 2 — teste de fluxo no navegador (Playwright)

**36 verificações, 8 fluxos, 100% de aprovação**, em navegador real com viewport de celular.
Instrumento: `work/e2e/flows.mjs`. Resultado: `work/e2e/resultado.json`. Capturas: 29 arquivos em
`work/e2e/shots/`.

Definição operacional de "tela branca", fixada antes da medição: **a raiz da aplicação renderizada
com menos de 40 caracteres de texto visível.** Sem definição operacional, "não ficou branca" não é
verificável.

| Fluxo | Verificações | Foco |
| --- | :-: | --- |
| 1 | 2 | Abertura e navegação pública |
| 2 | 1 | Autenticação |
| 3 | 16 | Telas autenticadas |
| 4 | 3 | B2 — impulsionamento sem tela branca |
| 5 | 7 | B3 — compra com pagamento direto e recibo `HM-AAAA-NNNNNN` |
| 6 | 4 | B1 — encerrar sessão, inclusive o botão voltar do navegador |
| 7 | 1 | Rota inexistente exibe 404 |
| 8 | 2 | `/carteira` inexistente e ausência de erro no console |

### 3.3 Camada 3 — auditoria estática e de acessibilidade

**Auditoria estática** (`work/audit_u5.mjs`): 71 arquivos, procura classes Tailwind fora da escala
real, `<button>` sem `type` explícito e utilitários citados no JSX mas nunca definidos no CSS.
Defeitos desta natureza atravessam o `tsc` sem erro e só se manifestam no navegador. Resultado
atual: **0**.

**Auditoria de acessibilidade** (`work/e2e/acessibilidade.mjs`): 48 telas, sete classes de
verificação, detalhadas na seção 5. Resultado atual: **0**.

### 3.4 Comando único de verificação

```bash
npx tsc --noEmit                       # tipagem: 0 erro
npx vitest run                         # 82 testes
npx vite build                          # 2199 módulos
node work/audit_u5.mjs                 # 0 problema estático
node work/e2e/flows.mjs <url>          # 36/36
node work/e2e/acessibilidade.mjs <url> # 0 problema em 48 telas
```

---

## 4. Métricas de usabilidade — protocolo de execução

Esta seção define **como medir**, com o instrumento e o limiar já fixados. Os valores da coluna
"alvo" são metas de projeto; a coluna "resultado" permanece vazia porque **o teste com usuários
não foi executado** — o artefato é um protótipo sem base de usuários reais.

### 4.1 Tarefas do roteiro

| # | Tarefa | Persona de referência | Alvo de tempo | Alvo de sucesso |
| --- | --- | --- | :-: | :-: |
| T1 | Publicar um lote de material com foto da galeria | Carlos | ≤ 3 min | ≥ 90% |
| T2 | Localizar material por categoria e distância | Ana Paula | ≤ 90 s | ≥ 95% |
| T3 | Concluir uma compra por PIX | Juliana | ≤ 2 min | ≥ 90% |
| T4 | Impulsionar um anúncio existente | Carlos | ≤ 90 s | ≥ 85% |
| T5 | Encontrar a orientação tributária aplicável ao próprio perfil | Roberto | ≤ 2 min | ≥ 80% |
| T6 | Encerrar a sessão e voltar a entrar | Dona Marlene | ≤ 60 s | ≥ 95% |

### 4.2 Indicadores

| Indicador | Definição operacional | Alvo | Instrumento |
| --- | --- | :-: | --- |
| Taxa de sucesso | Tarefas concluídas sem intervenção do moderador ÷ tarefas tentadas | ≥ 90% | Observação direta |
| Tempo por tarefa | Do primeiro toque à confirmação na tela | Ver 4.1 | Cronômetro |
| Taxa de erro | Ações que exigem correção ÷ total de ações da tarefa | ≤ 10% | Observação direta |
| Eficiência relativa | Tempo do participante ÷ tempo de um especialista na mesma tarefa | ≤ 2,0 | Cálculo |
| SUS | Escala de 10 itens, aplicada ao fim da sessão | ≥ 75 (faixa "bom") | Questionário |
| Esforço percebido (SEQ) | Item único por tarefa, escala de 1 a 7 | ≥ 5,5 | Questionário |
| Confiança no pagamento | Item específico, escala de 1 a 5 — mede a barreira central de Juliana | ≥ 4,0 | Questionário |

### 4.3 Amostra e procedimento previstos

Cinco a sete participantes por perfil prioritário, conforme a curva de retorno de descoberta de
problemas de usabilidade — cinco participantes revelam a maior parte dos problemas de um perfil
homogêneo, e perfis heterogêneos exigem amostra por perfil, não amostra única.

Procedimento: consentimento informado, tarefa lida em voz alta, protocolo de pensar em voz alta,
sem intervenção do moderador salvo bloqueio superior a 60 segundos, questionário ao final.

---

## 5. Acessibilidade — critérios, instrumento e resultado

### 5.1 Norma adotada

**WCAG 2.2, nível AA.** As sete verificações abaixo são automatizadas e reexecutáveis; cobrem os
critérios objetivamente mensuráveis por inspeção de árvore e de estilo computado.

| # | Verificação | Critério WCAG | Limiar | Resultado |
| --- | --- | --- | --- | :-: |
| 1 | Contraste de texto | 1.4.3 Contraste (mínimo) | 4,5:1 normal · 3:1 grande (≥ 24px, ou ≥ 18,66px em negrito) | 0 falha |
| 2 | Alvo de toque | 2.5.8 Tamanho do alvo (mínimo) | 24 × 24 px CSS, com exceção do alvo em linha | 0 falha |
| 3 | Nome acessível | 4.1.2 Nome, função, valor | Todo controle tem nome não vazio | 0 falha |
| 4 | Alternativa textual | 1.1.1 Conteúdo não textual | Todo `<img>` tem `alt` (vazio se decorativa) | 0 falha |
| 5 | Hierarquia de títulos | 1.3.1 Informação e relações | Exatamente um `<h1>` visível por tela | 0 falha |
| 6 | Transbordo horizontal | 1.4.10 Refluxo | Sem rolagem lateral em 412 px | 0 falha |
| 7 | Rótulo de campo | 3.3.2 Rótulos ou instruções | Todo campo tem rótulo associado | 0 falha |

Verificações adicionais atendidas por construção, não por medição pontual:

- **2.3.3 Animação a partir de interação** — `prefers-reduced-motion: reduce` desliga animações e
  transições globalmente (`index.css`).
- **2.4.7 Foco visível** — anel de foco padronizado em `:focus-visible` para link, botão, campo e
  elemento focalizável, aparecendo na navegação por teclado e não no toque.
- **1.4.4 Redimensionar texto** — o `viewport` não fixa `maximum-scale`, preservando o zoom.
- **1.3.5 Identificar propósito do campo** — `autoComplete` nos campos de identidade e endereço.

### 5.2 Rigor do instrumento de medida

O medidor foi corrigido tanto quanto o produto. Um verificador de contraste ingênuo produz falso
positivo e falso negativo em quantidade suficiente para inutilizar o resultado; o instrumento desta
avaliação trata explicitamente:

- **Composição de camadas translúcidas.** `bg-primary/10` sobre `card` precisa ser composto, não
  ignorado — o valor real do fundo é a mistura, não a cor declarada.
- **Gradiente.** `bg-gradient-to-br` vive em `background-image`; `backgroundColor` fica
  `transparent`. Sem tratamento, o teste lê "branco sobre branco" (1,00:1) onde o olho vê texto
  claro sobre verde escuro. O instrumento toma a parada mais clara do gradiente, o pior caso para
  texto claro.
- **Opacidade herdada.** `opacity-80` não altera o valor de `color`: a mistura ocorre na
  composição. Sem contabilizá-la, o contraste é superestimado.
- **Nome acessível.** Resolvido na ordem que os leitores de tela usam: `aria-labelledby`,
  `<label for>`, `aria-label`, `title`, texto próprio, `alt` de imagem interna.
- **Exceção de alvo em linha.** A 2.5.8 isenta o link inserido em uma frase, cuja altura é ditada
  pelo texto ao redor.
- **Isenção de controle inativo.** A nota da 1.4.3 exclui componente de interface desabilitado.

### 5.3 Paleta resolvida por cálculo

A conformidade de contraste não foi obtida por ajuste visual. O utilitário `work/paleta.mjs` resolve
a **menor alteração de luminosidade** que satisfaz todas as restrições simultâneas de cada token —
texto sobre `card`, `background` e `muted`, e texto sobre o tingimento do próprio matiz nas
proporções que o código efetivamente usa (`/5`, `/10`, `/20`, apuradas por varredura no `src`).
Matiz e saturação de marca ficam intactos; apenas o brilho muda.

Dois tokens exigiram desdobramento porque um único valor não cobre dois papéis:

- **`--warning-strong`** — o âmbar vivo funciona como preenchimento do crachá "Destaque", mas como
  cor de texto sobre fundo claro atinge 1,98:1. O papel de primeiro plano ganhou token próprio.
- **`--primary-deep`** — a parada `to-primary/80` dos painéis com gradiente clareava o verde por
  transparência e derrubava o texto branco a 3,99:1. A parada passou a ser opaca e mais escura.

### 5.4 Limites declarados

A conformidade verificada é a **automatizável**. Uma auditoria completa de acessibilidade exige,
além disto: teste manual com leitor de tela real (NVDA, TalkBack, VoiceOver), navegação exclusiva
por teclado conduzida por pessoa com deficiência, e revisão por especialista. Estes três não foram
executados. Afirmar "conformidade WCAG AA" sem essa ressalva seria impreciso; o que se afirma é
**conformidade verificada nos sete critérios mensuráveis acima, em 48 telas, com resultado zero.**

---

## 6. Qualidade de software — atributos e verificação

Atributos da ISO/IEC 25010 aplicáveis a um protótipo client-side, com o critério de cada um.

| Atributo | Critério adotado | Verificação | Resultado |
| --- | --- | --- | :-: |
| Adequação funcional | Todo fluxo declarado na monografia percorrível de ponta a ponta | 36 verificações e2e | 36/36 |
| Correção | Lógica de pagamento, validação e plano de negócio coberta por teste | 82 testes Vitest | 82/82 |
| Confiabilidade | Nenhuma falha inesperada produz tela branca | `ErrorBoundary` + fluxos B1/B2/B3 | 0 tela branca |
| Usabilidade | Dez heurísticas de Nielsen sem violação aberta | Inspeção tela a tela | Seção 2.1 |
| Acessibilidade | WCAG 2.2 AA nos critérios mensuráveis | 48 telas auditadas | 0 falha |
| Manutenibilidade | Tipagem estrita sem erro; estados compartilhados centralizados | `tsc --noEmit` | 0 erro |
| Compatibilidade | Layout íntegro em 412 px, com área segura respeitada | Auditoria de transbordo | 0 falha |
| Desempenho | Imagem dimensionada por contexto; sem laço de sincronização por intervalo | `lib/images.ts`, `useStoreVersion` | Ver 6.1 |

### 6.1 Observação sobre desempenho

O pacote de produção gera um agrupamento único de aproximadamente 890 kB (262 kB comprimido), acima
do limite de aviso de 500 kB do Vite. Para um protótipo acadêmico executado localmente, o efeito é
irrelevante e a divisão em pedaços foi deliberadamente não feita, para manter o código legível na
defesa. Em produção, a medida indicada é divisão por rota com `import()` dinâmico. **O aviso é
registrado aqui em lugar de omitido** — é uma limitação conhecida, não um defeito oculto.

Duas correções de desempenho foram aplicadas por serem também correções de comportamento: a tela de
mensagens não ressincroniza mais por `setInterval` a cada 2,5 s, e as imagens passaram a ser
solicitadas na largura do contexto de exibição, em lugar da resolução da miniatura para todos os
casos.

---

## 7. Rastreabilidade

| Fase | Entrega | Arquivo |
| --- | --- | --- |
| C1 | Personas, antipersona e matriz de cobertura | `docs/personas.md` |
| C2 | Testes unitários e de integração | `src/test/*.test.ts` |
| C2 | Teste de fluxo no navegador | `work/e2e/flows.mjs`, `work/e2e/resultado.json` |
| C3 | Este documento | `docs/metodos-de-avaliacao.md` |
| U5 | Auditoria estática | `work/audit_u5.mjs` |
| U5 | Auditoria de acessibilidade | `work/e2e/acessibilidade.mjs`, `work/e2e/acessibilidade.json` |
| U5 | Resolução numérica da paleta | `work/paleta.mjs` |
