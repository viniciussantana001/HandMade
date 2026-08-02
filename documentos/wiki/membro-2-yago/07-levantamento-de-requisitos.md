# 3.1 Técnicas de levantamento de requisitos

**Responsável:** Yago Smith da Silva

O levantamento combinou quatro técnicas. Nenhuma delas isolada seria suficiente: pesquisa
bibliográfica não revela hábito de uso, questionário não explica motivo, entrevista não escala e
análise de similares não diz o que o público local precisa.

| # | Técnica | Finalidade | Situação da evidência |
|---|---|---|:-:|
| 1 | Pesquisa bibliográfica | Fundamentar economia circular, marketplace, PNRS, LGPD e tecnologia | Arquivada |
| 2 | Análise de sistemas similares | Identificar lacuna funcional nos concorrentes | Arquivada |
| 3 | Questionário aplicado | Dimensionar hábito, ticket e disposição de uso | **Declarada, não arquivada** |
| 4 | Entrevista | Entender motivo e obstáculo operacional | **Declarada, não arquivada** |

A coluna de situação é o ponto central desta página e está detalhada na seção 5.

## 1. Pesquisa bibliográfica

Base teórica do trabalho, com as fontes registradas em [Referências](21-referencias).

| Tema | Fonte principal | O que sustentou no projeto |
|---|---|---|
| Economia circular | Ellen MacArthur Foundation (2013) | Conceito de manter material em uso; posição da reutilização |
| Resíduos sólidos | BRASIL, Lei nº 12.305/2010 | Ordem de prioridade e responsabilidade compartilhada |
| Panorama de resíduos | ABREMA | Dimensão do descarte no Brasil |
| Proteção de dados | BRASIL, Lei nº 13.709/2018 | Direitos do titular, base legal, consentimento versionado |
| Acessibilidade | W3C, WCAG 2.2 (2023) | Critérios objetivos de contraste, alvo e rótulo |
| Usabilidade | Nielsen (1994) | As dez heurísticas aplicadas na inspeção |
| Tecnologia final | Flutter, Firebase, Material Design 3 | Justificativa da stack planejada |

## 2. Análise de sistemas similares

Observação direta dos serviços concorrentes, com registro do que existe e do que falta. O método
foi: procurar um material específico ("tábua de madeira usada", "sobra de azulejo") em cada
plataforma e registrar quantos passos e quantos resultados irrelevantes a busca produz.

Resultado consolidado em [Concorrentes](08-concorrentes). As lacunas encontradas viraram
requisito direto — taxonomia de material, filtro por condição e filtro por distância.

## 3. Questionário aplicado

### Instrumento previsto

| Aspecto | Definição |
|---|---|
| Formato | Questionário estruturado, autoaplicado |
| Público | Moradores e profissionais da região de Mogi Guaçu (SP) |
| Perfis buscados | Quem gera sobra (obra, marcenaria, indústria) e quem consome material reaproveitado |
| Respondentes declarados | 87 |
| Período declarado | Junho de 2026 |
| Blocos | Perfil; hábito atual de descarte ou aquisição; valor típico por lote; disposição de usar aplicativo; barreira percebida |

### Dados declarados a partir do questionário

Estes três valores são usados como premissa no plano de negócio
(`prototipo/src/lib/business.ts`), com a fonte anotada no próprio código:

| Premissa | Valor | Fonte anotada no código |
|---|---|---|
| Ticket médio por transação | R$ 420,00 | Média dos 87 respondentes |
| Vendedores que são pessoa jurídica | 18% | 16 dos 87 respondentes atuam como empresa |
| Anúncios ativos por vendedor | 3,5 | Mediana de quem já revende sobra de obra |

O restante das premissas do plano de negócio vem de referência de mercado, não do questionário, e
está identificado como tal no mesmo arquivo. A separação é deliberada: premissa de pesquisa e
premissa de benchmark não têm o mesmo peso probatório.

## 4. Entrevista

### Instrumento previsto

| Aspecto | Definição |
|---|---|
| Formato | Entrevista semiestruturada, com roteiro aberto |
| Entrevistados declarados | 2 gestores de cooperativa de reciclagem |
| Finalidade | Entender a cadeia do atravessador e o obstáculo de quem tem baixa familiaridade digital |

### O que a entrevista produziu no projeto

O relato dos gestores fundamentou a persona **Dona Marlene Aparecida**, a catadora cooperada, em
`documentos/qualidade/personas.md`. Dela derivaram decisões verificáveis no protótipo:

| Achado da entrevista | Decisão de projeto | Verificação |
|---|---|---|
| A cooperativa vende a atravessador por preço imposto | Venda direta sem intermediário | Fluxo de publicação (RF-07) |
| Aparelho de entrada, internet intermitente | Fotos embutidas, protótipo abre sem internet | 12 testes em `images.test.ts` |
| Texto pequeno e contraste baixo dificultam a leitura | Paleta resolvida por cálculo para WCAG 2.2 AA | 48 telas, 0 falha |
| Erro sem explicação encerra a tentativa | Mensagem em linguagem comum com próximo passo | Heurística 9 |

## 5. Situação das evidências — declaração explícita

**O que existe no repositório:** a bibliografia, a análise de concorrentes, as personas
construídas a partir da pesquisa, e as premissas numéricas com a fonte anotada no código.

**O que não existe no repositório:** o formulário aplicado, as 87 respostas brutas, a tabulação,
os gráficos de resultado e a transcrição das duas entrevistas.

Ou seja: os **resultados** da pesquisa estão incorporados ao projeto e rastreáveis até o código
que os usa, mas os **instrumentos e os dados primários** não foram arquivados aqui. Enquanto isso
não for resolvido, a formulação correta é "premissa declarada a partir de pesquisa aplicada", e
não "dado comprovado".

### O que precisa ser anexado antes da entrega final

| Item | Destino no repositório |
|---|---|
| Formulário do questionário (PDF ou link) | `documentos/qualidade/evidencias/questionario-instrumento.pdf` |
| Tabulação das 87 respostas (planilha) | `documentos/qualidade/evidencias/questionario-respostas.csv` |
| Gráficos de resultado por bloco | `documentos/wiki/membro-2-yago/imagens/` |
| Roteiro da entrevista | `documentos/qualidade/evidencias/entrevista-roteiro.md` |
| Síntese das duas entrevistas | `documentos/qualidade/evidencias/entrevista-sintese.md` |

Este é o item de maior prioridade da lista de pendências do projeto. Sem ele, três premissas do
plano de negócio e uma persona ficam sem lastro documental verificável.

## 6. Da técnica ao requisito

Rastreabilidade entre origem e requisito — permite auditar de onde veio cada exigência:

| Origem | Requisito gerado |
|---|---|
| Análise de similares — sem taxonomia de material | RF-08 (9 categorias próprias) |
| Análise de similares — sem filtro de proximidade | RF-10 (filtro por localização) |
| Questionário — ticket médio de R$ 420 | Faixas de filtro de preço e modelo de taxa |
| Questionário — 18% de pessoa jurídica | Cadastro PJ separado e plano Empresarial |
| Entrevista — baixa familiaridade digital | RNF-05 e RNF-06 (acessibilidade e legibilidade) |
| Entrevista — internet intermitente | RNF-04 (fotos embutidas, sem dependência de rede) |
| Bibliografia — LGPD | RF-25 a RF-27 (consentimento, exportação, exclusão) |
| Bibliografia — PNRS | Guia de tributos e orientação documental (RF-24) |
| Bibliografia — WCAG 2.2 | RNF-05, verificado em 48 telas |

Requisitos completos em [Requisitos funcionais](11-requisitos-funcionais) e
[Requisitos não funcionais](12-requisitos-nao-funcionais).

---

**Nota de método.** Declarar o que falta é parte do levantamento, não uma falha dele. Apresentar
87 respostas como evidência arquivada quando o arquivo não existe seria o erro mais grave que esta
página poderia cometer, e ele é evitado deliberadamente — o mesmo critério aplicado em
[Testes e qualidade](18-testes-e-qualidade) para as métricas de usabilidade.
