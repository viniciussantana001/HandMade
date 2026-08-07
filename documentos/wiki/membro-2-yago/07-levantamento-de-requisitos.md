# 3.1 Técnicas de levantamento de requisitos

**Responsável:** Yago Smith da Silva

O levantamento combinou quatro técnicas, complementadas por uma rodada de teste de usabilidade
sobre o protótipo já construído. Nenhuma delas isolada seria suficiente: pesquisa bibliográfica
não revela hábito de uso, questionário não explica motivo, entrevista não escala, análise de
similares não diz o que o público local precisa, e nenhuma das quatro anteriores substitui
observar o usuário real operando o sistema.

| # | Técnica | Finalidade | Situação da evidência |
|---|---|---|:-:|
| 1 | Pesquisa bibliográfica | Fundamentar economia circular, marketplace, PNRS, LGPD e tecnologia | Arquivada |
| 2 | Análise de sistemas similares | Identificar lacuna funcional nos concorrentes | Arquivada |
| 3 | Questionário aplicado | Dimensionar hábito, ticket e disposição de uso | **Declarada, não arquivada** |
| 4 | Entrevista | Entender motivo e obstáculo operacional | **Declarada, não arquivada** |
| 5 | Teste de usabilidade (protótipo 4.0) | Validar a experiência de uso real, tela a tela, e localizar erro concreto de implementação | **Arquivada** |

A coluna de situação é o ponto central desta página e está detalhada na seção 6.

## 1. Pesquisa bibliográfica

Base teórica do trabalho, com as fontes registradas na página
[Referências](../membro-4-thomaz/21-referencias.md).

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

Resultado consolidado em [Concorrentes](08-concorrentes.md). As lacunas encontradas viraram
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

## 5. Teste de usabilidade aplicado — protótipo 4.0

Diferente das quatro técnicas anteriores, que levantam requisito antes de o sistema existir, esta
rodada foi aplicada **depois** de o protótipo estar funcional, com o objetivo de validar se o que
foi construído correspondia ao que a pesquisa indicou. O instrumento e as respostas brutas estão
arquivados neste repositório — é a única das cinco técnicas com esse status hoje.

> **Nota de escopo.** Este formulário foi respondido sobre o **protótipo 4.0**. Os erros
> constatados e as melhorias indicadas pelos respondentes foram tratados como requisito de
> correção e já estão corrigidos e incorporados no **protótipo 5.0**, versão atual do projeto. Os
> achados abaixo descrevem, portanto, um estado já superado — preservados aqui como evidência do
> processo, não como descrição do sistema em sua versão vigente.

### Instrumento aplicado

| Aspecto | Definição |
|---|---|
| Formato | Formulário estruturado, autoaplicado, após uso guiado do protótipo |
| Respondentes | 5 |
| Período | 19 de junho de 2026 |
| Blocos | Percepção geral (aprendizado, localização de função, navegação, visual, conclusão de tarefa); dificuldade por tela; funcionalidade mais fácil e mais difícil; erro encontrado; sugestão de melhoria; nota geral (0 a 10) |

### Percepção geral

| Pergunta | Resultado |
|---|---|
| O sistema foi fácil de aprender a utilizar? | Sim: 3 · Razoavelmente: 2 |
| Foi fácil localizar as funcionalidades desejadas? | Sim: 3 · Razoavelmente: 2 |
| A navegação entre as telas foi intuitiva? | Sim: 4 · Razoavelmente: 1 |
| O visual do sistema foi agradável? | Sim: 5 |
| Você conseguiu concluir todas as tarefas propostas? | Razoavelmente: 3 · Sim: 2 |
| Nota geral de experiência (0 a 10) | 9, 8, 9, 7, 8 — média **8,2** |

### Dificuldade percebida por tela

Escala declarada pelos respondentes (Muito Fácil / Fácil / Médio), consolidada por tela:

| Tela | Distribuição das respostas |
|---|---|
| Tela inicial | Médio: 2 · Muito Fácil: 2 · Fácil: 1 |
| Cadastro e confirmação de e-mail | Muito Fácil: 2 · Fácil: 2 · Médio: 1 |
| Login | Muito Fácil: 3 · Fácil: 2 |
| Marketplace e busca | Médio: 3 · Muito Fácil: 1 · Fácil: 1 |
| Detalhe do anúncio | Médio: 2 · Fácil: 2 · Muito Fácil: 1 |
| **Criação de anúncio** | **Médio: 3** · Fácil: 1 · Muito Fácil: 1 |
| Mensagens e propostas | Fácil: 3 · Muito Fácil: 1 · Médio: 1 |
| Compra protegida | Fácil: 4 · Médio: 1 |
| Negociações e pedidos | Fácil: 5 |
| Notificações | Muito Fácil: 3 · Fácil: 2 |
| Perfil e configurações | Muito Fácil: 3 · Fácil: 2 |
| Carteira e planos | Fácil: 3 · Médio: 2 |

Criação de anúncio é a única tela em que "Médio" foi a resposta majoritária — o que converge com
o próximo bloco.

### Funcionalidade mais fácil e mais difícil

| Aspecto | Resultado |
|---|---|
| Funcionalidade mais fácil | Login (3 de 5) · Criação de conta (1) · Personalização de perfil (1) |
| Funcionalidade mais difícil | **Criação/cadastro de anúncio (4 de 5)** · Edição de anúncio (1) |

### Erro relatado e sugestão de melhoria

| Respondente | Erro encontrado | Melhoria sugerida |
|---|---|---|
| 1 | Não relatou | Acesso a algumas telas |
| 2 | Edição de um anúncio publicado não estava disponível | Aperfeiçoar o que já está disponível |
| 3 | Não havia opção de editar o anúncio | Área de edição de anúncio |
| 4 | Relatou erro, sem detalhar | Intuitividade entre telas |
| 5 | Nenhum | Nada a acrescentar |

Dois dos cinco respondentes (2 e 3), de forma independente, relataram o **mesmo** problema
concreto: a impossibilidade de editar um anúncio já publicado. Esse é o único erro funcional
específico e recorrente identificado nesta rodada.

### Achados principais

- **Visual e navegação bem avaliados**: 100% aprovaram o visual e 80% consideraram a navegação
  intuitiva.
- **Criação/edição de anúncio é o ponto de maior atrito**: apontada como a funcionalidade mais
  difícil por 4 dos 5 respondentes e como erro concreto (ausência de edição) por 2 deles.
- **Conclusão de tarefa é o item mais baixo da percepção geral**: só 2 de 5 confirmaram "Sim" sem
  ressalva, sinal de que a etapa de anúncio interrompia o fluxo completo.
- **Nota geral consistente**: média 8,2, sem nenhuma nota abaixo de 7 — os problemas relatados
  foram pontuais, não estruturais.

### Do achado à correção — protótipo 4.0 → 5.0

| Achado no protótipo 4.0 | Correção incorporada no protótipo 5.0 |
|---|---|
| Ausência de edição de anúncio publicado (relatado por 2 de 5 respondentes como erro) | Edição de anúncio publicado implementada |
| Criação de anúncio apontada como a etapa mais difícil (4 de 5 respondentes) | Fluxo de criação de anúncio revisado |
| Navegação "razoavelmente" intuitiva para parte dos respondentes | Ajustes de navegação entre telas |

## 6. Situação das evidências — declaração explícita

**O que existe no repositório:** a bibliografia, a análise de concorrentes, as personas
construídas a partir da pesquisa, as premissas numéricas com a fonte anotada no código, e o
formulário com as respostas brutas do teste de usabilidade do protótipo 4.0.

**O que não existe no repositório:** o formulário do questionário de 87 respostas, a tabulação
completa, os gráficos de resultado e a transcrição das duas entrevistas.

Ou seja: os **resultados** da pesquisa estão incorporados ao projeto e rastreáveis até o código
que os usa, mas os **instrumentos e os dados primários** do questionário e da entrevista não foram
arquivados aqui. Enquanto isso não for resolvido, a formulação correta é "premissa declarada a
partir de pesquisa aplicada", e não "dado comprovado".

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

## 7. Da técnica ao requisito

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
| Teste de usabilidade — ausência de edição de anúncio (protótipo 4.0) | Edição de anúncio publicado, corrigida no protótipo 5.0 |
| Teste de usabilidade — criação de anúncio como etapa mais difícil (protótipo 4.0) | Revisão do fluxo de criação de anúncio, incorporada no protótipo 5.0 |

Requisitos completos em
[Requisitos funcionais](../membro-3-nathan/11-requisitos-funcionais.md) e
[Requisitos não funcionais](../membro-3-nathan/12-requisitos-nao-funcionais.md).

---

**Nota de método.** Declarar o que falta é parte do levantamento, não uma falha dele. Apresentar
87 respostas como evidência arquivada quando o arquivo não existe seria o erro mais grave que esta
página poderia cometer, e ele é evitado deliberadamente — o mesmo critério aplicado na página
[Testes e qualidade](../membro-4-thomaz/18-testes-e-qualidade.md) para as métricas de usabilidade.
