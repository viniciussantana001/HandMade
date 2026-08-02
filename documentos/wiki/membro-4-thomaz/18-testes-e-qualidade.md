# Testes e qualidade de software (QTS)

**Responsável:** Thomaz de Moraes Teixeira

Registro de **como** o protótipo 5.0 foi avaliado: qual método, com que instrumento, sobre qual
amostra e com qual critério de aprovação.

O princípio metodológico adotado: **avaliação sem critério declarado antes da medição não é
avaliação, é opinião.** Cada verificação abaixo traz o limiar fixado de antemão, o instrumento que
produz o número e o resultado obtido. Onde o protótipo não sustenta uma afirmação, o documento diz
isso — em vez de sugerir evidência que não existe.

Documento completo em `documentos/qualidade/metodos-de-avaliacao.md`.

---

## 1. Escopo e limites

| Aspecto | Situação |
|---|---|
| Natureza do artefato | Protótipo funcional de alta fidelidade, mobile, 100% client-side |
| Persistência | `localStorage`, 13 coleções, sem servidor e sem banco remoto |
| Rotas avaliadas | 24 rotas distintas, das 31 declaradas |
| Temas avaliados | Claro e escuro — 48 combinações tela × tema |
| Navegador de referência | Chromium, viewport 412 × 915, `deviceScaleFactor` 3, modo móvel com toque, pt-BR |

**O que esta avaliação não é.** Não houve teste com usuários reais nem coleta de métricas de uso em
produção. Os números de usabilidade da seção 4 são **alvos de projeto e protocolos prontos para
execução**, não resultados observados. Tratar protocolo como resultado seria o erro metodológico
mais grave possível aqui, e é evitado deliberadamente.

---

## 2. Estrutura de testes em três camadas

A separação por camada é intencional: cada uma pega uma classe de defeito que as outras não pegam.

### Camada 1 — Testes unitários e de integração (Vitest)

**94 testes, 6 arquivos, 100% de aprovação.** Concentram-se na lógica que produz número ou decide
fluxo — onde o erro é silencioso e não aparece na tela.

| Arquivo | Testes | O que verifica |
|---|:-:|---|
| `business.test.ts` | 27 | Premissas, receita, taxa efetiva, custos, ponto de equilíbrio, LTV/CAC, projeção trienal, investimento, impacto socioambiental |
| `payments.test.ts` | 18 | Aprovação PIX, boleto pendente, recusa de cartão, quatro últimos dígitos sem guardar o número, estorno, persistência |
| `validators.test.ts` | 14 | CPF e CNPJ com dígito verificador, cartão, contato, senha |
| `store.test.ts` | 14 | Prefixo de armazenamento, operações de coleção, observabilidade, exclusão total de conta (LGPD art. 18) |
| `images.test.ts` | 12 | Manifesto de imagens, larguras disponíveis, ausência de dependência externa |
| `formatters.test.ts` | 9 | Moeda, decimal e porcentagem em pt-BR |

**Achado que justifica esta camada.** Dois erros de modelagem do plano de negócio foram
descobertos por estes testes, não por revisão visual:

1. **Base de assinantes inflada 3,5×** — a taxa de conversão de 22% incide sobre *anúncios*, não
   sobre *vendedores*. Corrigido com a premissa de anúncios por vendedor.
2. **Razão LTV/CAC de 59×** — comparava o LTV de um assinante com o CAC de um usuário qualquer.
   Corrigido com CAC por assinante; a razão real é 6,3× e o payback, 2,6 meses.

Ambos passariam por qualquer revisão visual: os números eram plausíveis. Só um teste que recalcula
a partir das premissas os encontra.

### Camada 2 — Teste de fluxo em navegador (Playwright)

**36 verificações, 8 fluxos, 100% de aprovação**, em navegador real com viewport de celular.

Instrumento: `documentos/qualidade/ferramentas/fluxos-e2e.mjs`
Resultado: `documentos/qualidade/evidencias/fluxos-e2e-resultado.json`

**Definição operacional de "tela branca"**, fixada antes da medição: raiz da aplicação renderizada
com **menos de 40 caracteres de texto visível**. Sem definição operacional, "não ficou branca" não
é verificável.

| Fluxo | Verificações | Foco |
|:-:|:-:|---|
| 1 | 2 | Abertura e navegação pública |
| 2 | 1 | Autenticação |
| 3 | 16 | Telas autenticadas |
| 4 | 3 | Impulsionamento sem tela branca |
| 5 | 7 | Compra com pagamento direto e recibo `HM-AAAA-NNNNNN` |
| 6 | 4 | Encerrar sessão, inclusive pelo botão voltar do navegador |
| 7 | 1 | Rota inexistente exibe 404 |
| 8 | 2 | Rota de carteira inexistente e ausência de erro no console |

### Camada 3 — Auditoria estática e de acessibilidade

**Auditoria estática** (`ferramentas/auditoria-estatica.mjs`): varre os arquivos procurando classes
de estilo fora da escala real, botões sem tipo explícito e utilitários citados no código mas nunca
definidos. Defeitos dessa natureza **atravessam a verificação de tipos sem erro** e só se
manifestam no navegador. Resultado atual: **0**.

**Auditoria de acessibilidade** (`ferramentas/acessibilidade.mjs`): 48 telas, sete classes de
verificação, detalhadas na seção 5. Resultado atual: **0**.

---

## 3. Comandos de verificação

Tudo é reexecutável. A partir de `prototipo/`:

```bash
npm install
npx tsc --noEmit     # tipagem: 0 erro
npm test             # 94 testes
npm run build        # 2.200 módulos
npm run preview      # serve o build para as camadas 2 e 3
```

Com o build servido:

```bash
node ../documentos/qualidade/ferramentas/auditoria-estatica.mjs
node ../documentos/qualidade/ferramentas/fluxos-e2e.mjs http://localhost:4173
node ../documentos/qualidade/ferramentas/acessibilidade.mjs http://localhost:4173
node ../documentos/qualidade/ferramentas/contar-telas.mjs
```

---

## 4. Métricas de usabilidade — protocolo, não resultado

Esta seção define **como medir**, com instrumento e limiar fixados. A coluna de resultado
permanece vazia porque **o teste com usuários não foi executado** — o artefato é um protótipo sem
base de usuários reais.

### 4.1 Tarefas do roteiro

| # | Tarefa | Persona | Alvo de tempo | Alvo de sucesso |
|---|---|---|:-:|:-:|
| T1 | Publicar um lote com foto da galeria | Carlos | ≤ 3 min | ≥ 90% |
| T2 | Localizar material por categoria e distância | Ana Paula | ≤ 90 s | ≥ 95% |
| T3 | Concluir uma compra por PIX | Juliana | ≤ 2 min | ≥ 90% |
| T4 | Impulsionar um anúncio existente | Carlos | ≤ 90 s | ≥ 85% |
| T5 | Encontrar a orientação tributária do próprio perfil | Roberto | ≤ 2 min | ≥ 80% |
| T6 | Encerrar a sessão e voltar a entrar | Dona Marlene | ≤ 60 s | ≥ 95% |

### 4.2 Indicadores

| Indicador | Definição operacional | Alvo |
|---|---|:-:|
| Taxa de sucesso | Tarefas concluídas sem intervenção ÷ tentadas | ≥ 90% |
| Tempo por tarefa | Do primeiro toque à confirmação na tela | Ver 4.1 |
| Taxa de erro | Ações que exigem correção ÷ total de ações | ≤ 10% |
| Eficiência relativa | Tempo do participante ÷ tempo de especialista | ≤ 2,0 |
| SUS | Escala de 10 itens, ao fim da sessão | ≥ 75 |
| Esforço percebido (SEQ) | Item único por tarefa, escala 1 a 7 | ≥ 5,5 |
| Confiança no pagamento | Item específico, escala 1 a 5 | ≥ 4,0 |

### 4.3 Amostra prevista

Cinco a sete participantes por perfil prioritário. Cinco participantes revelam a maior parte dos
problemas de um perfil homogêneo; perfis heterogêneos exigem amostra **por perfil**, não amostra
única.

Procedimento: consentimento informado, tarefa lida em voz alta, protocolo de pensar em voz alta,
sem intervenção salvo bloqueio superior a 60 segundos, questionário ao final.

---

## 5. Acessibilidade

### 5.1 Norma e resultado

**WCAG 2.2, nível AA.** Sete verificações automatizadas e reexecutáveis, cobrindo os critérios
objetivamente mensuráveis por inspeção de árvore e de estilo computado.

| # | Verificação | Critério | Limiar | Resultado |
|---|---|---|---|:-:|
| 1 | Contraste de texto | 1.4.3 | 4,5:1 normal · 3:1 grande | 0 falha |
| 2 | Alvo de toque | 2.5.8 | 24 × 24 px CSS | 0 falha |
| 3 | Nome acessível | 4.1.2 | Todo controle com nome não vazio | 0 falha |
| 4 | Alternativa textual | 1.1.1 | Todo `<img>` com `alt` | 0 falha |
| 5 | Hierarquia de títulos | 1.3.1 | Um `<h1>` visível por tela | 0 falha |
| 6 | Transbordo horizontal | 1.4.10 | Sem rolagem lateral em 412 px | 0 falha |
| 7 | Rótulo de campo | 3.3.2 | Todo campo com rótulo associado | 0 falha |

Atendidos por construção: `prefers-reduced-motion` (2.3.3), foco visível (2.4.7), zoom preservado
(1.4.4) e preenchimento automático nos campos de identidade (1.3.5).

### 5.2 Rigor do instrumento

O medidor foi corrigido tanto quanto o produto. Um verificador de contraste ingênuo produz falso
positivo e falso negativo em quantidade suficiente para inutilizar o resultado. Este instrumento
trata explicitamente:

- **Camadas translúcidas.** Um tingimento sobre cartão precisa ser composto: o fundo real é a
  mistura, não a cor declarada.
- **Gradiente.** Vive em `background-image`, com `backgroundColor` transparente. Sem tratamento, o
  teste lê "branco sobre branco" (1,00:1) onde o olho vê texto claro sobre verde escuro. O
  instrumento toma a parada mais clara — o pior caso para texto claro.
- **Opacidade herdada.** Não altera o valor de `color`: a mistura ocorre na composição. Sem
  contabilizá-la, o contraste é superestimado.
- **Nome acessível.** Resolvido na ordem que os leitores de tela usam.
- **Exceção de alvo em linha.** O critério isenta link inserido em frase, cuja altura é ditada pelo
  texto ao redor.
- **Isenção de controle inativo.** O critério exclui componente desabilitado.

### 5.3 Defeitos de acessibilidade encontrados e corrigidos

Amostra do que a auditoria pegou e a revisão visual não pegaria:

| Defeito | Situação |
|---|---|
| Token de destaque com texto branco a 2,14:1, aplicado em 33 pontos de toque | Corrigido — voltou a ser superfície neutra |
| Âmbar como texto a 1,98:1 | Corrigido — token próprio para primeiro plano, em 51 trocas |
| Gradiente derrubando texto branco a 3,99:1 | Corrigido — parada opaca mais escura |
| Contador de fotos e setas do carrossel a 3,39:1 e 2,54:1 | Corrigidos para 6,58:1 e 4,66:1 |
| Campo de e-mail e seletor de estado sem rótulo associado | Corrigidos |
| Botões só de ícone sem nome acessível | Corrigidos |
| Alvos de toque abaixo de 24 × 24 px | Ampliados |
| Classe de espaçamento inexistente na escala, deixando ícone sem tamanho | Corrigida |
| 30 botões sem tipo explícito dentro de formulário | Corrigidos |
| 42 casos de conteúdo interativo aninhado | Corrigidos |
| Ausência de suporte a redução de movimento e de foco visível | Implementados |

### 5.4 Limite declarado

A conformidade verificada é a **automatizável**. Uma auditoria completa exige, além disto: teste
manual com leitor de tela real (NVDA, TalkBack, VoiceOver), navegação exclusiva por teclado
conduzida por pessoa com deficiência, e revisão por especialista. **Os três não foram executados.**

Afirmar "conformidade WCAG AA" sem essa ressalva seria impreciso. O que se afirma é: conformidade
verificada nos sete critérios mensuráveis acima, em 48 telas, com resultado zero.

---

## 6. Atributos de qualidade (ISO/IEC 25010)

> **Nota de conferência (agosto de 2026).** Os nomes de atributos abaixo seguem a edição de **2011**
> da ISO/IEC 25010. A norma foi revisada em **2023**, com renomeação e reorganização de parte das
> características. A tabela deve ser lida, por ora, como **o modelo de qualidade adotado pelo
> grupo**; a conferência da nomenclatura oficial da edição vigente está registrada como pendência
> em [Referências](21-referencias).

| Atributo | Critério adotado | Verificação | Resultado |
|---|---|---|:-:|
| Adequação funcional | Todo fluxo declarado percorrível de ponta a ponta | 36 verificações | 36/36 |
| Correção | Pagamento, validação e plano de negócio cobertos por teste | 94 testes | 94/94 |
| Confiabilidade | Nenhuma falha inesperada produz tela branca | Captura de erro + fluxos | 0 tela branca |
| Usabilidade | Dez heurísticas sem violação aberta | Inspeção tela a tela | [Heurísticas](17-heuristicas-de-nielsen) |
| Acessibilidade | WCAG 2.2 AA nos critérios mensuráveis | 48 telas | 0 falha |
| Manutenibilidade | Tipagem estrita sem erro | `tsc --noEmit` | 0 erro |
| Compatibilidade | Layout íntegro em 412 px | Auditoria de transbordo | 0 falha |
| Desempenho | Imagem por contexto; sem sincronização por intervalo | Inspeção de código | Ver 6.1 |

### 6.1 Observação sobre desempenho

O pacote de produção gera **894 kB (263 kB comprimido)**, acima do limite de aviso de 500 kB do
empacotador. Para um protótipo acadêmico executado localmente, o efeito é irrelevante, e a divisão
em pedaços foi deliberadamente não feita para manter o código legível na defesa. Em produção, a
medida indicada é divisão por rota com importação dinâmica. **O aviso é registrado aqui em vez de
omitido** — é limitação conhecida, não defeito oculto.

Duas correções de desempenho foram aplicadas por serem também correções de comportamento: a tela
de mensagens não ressincroniza mais por temporizador, e as imagens passaram a ser solicitadas na
largura do contexto de exibição.

---

## 7. Resultado consolidado

| O quê | Resultado |
|---|---|
| Tipagem (`tsc --noEmit`) | 0 erro |
| Testes automatizados | 94 de 94 |
| Fluxos ponta a ponta | 36 de 36, 0 erro de console |
| Acessibilidade (48 telas, claro e escuro) | 0 problema |
| Auditoria estática | 0 problema |
| Compilação | 2.200 módulos |

## 8. Rastreabilidade

| Entrega | Arquivo |
|---|---|
| Personas, antipersona e matriz de cobertura | `documentos/qualidade/personas.md` |
| Métodos de avaliação (documento completo) | `documentos/qualidade/metodos-de-avaliacao.md` |
| Testes unitários e de integração | `prototipo/src/test/*.test.ts` |
| Teste de fluxo | `documentos/qualidade/ferramentas/fluxos-e2e.mjs` |
| Auditoria de acessibilidade | `documentos/qualidade/ferramentas/acessibilidade.mjs` |
| Auditoria estática | `documentos/qualidade/ferramentas/auditoria-estatica.mjs` |
| Resolução numérica da paleta | `documentos/qualidade/ferramentas/paleta.mjs` |
| Contagem de telas e interações | `documentos/qualidade/ferramentas/contar-telas.mjs` |
| Evidências em JSON | `documentos/qualidade/evidencias/` |

---

## 9. O que falta

| Item | Situação |
|---|---|
| Teste com usuário real (roteiro T1–T6) | Protocolo pronto, **não executado** |
| Teste com leitor de tela | **Não executado** |
| Navegação por teclado com pessoa com deficiência | **Não executado** |
| Revisão de acessibilidade por especialista | **Não executado** |
| Divisão do pacote por rota | Não feito, por decisão de legibilidade |

Os quatro primeiros exigem recrutamento de participantes e constituem a etapa natural seguinte da
avaliação. Declará-los é o que permite que os resultados das seções 2, 5 e 6 sejam lidos com o peso
correto.

Referência de método em [Referências](21-referencias).
