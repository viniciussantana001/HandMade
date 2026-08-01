# 2.1 Viabilidade operacional e cronograma

*Seção sob responsabilidade de Vinicius Santana dos Santos.*

Esta página trata da capacidade da equipe de executar o projeto e do tempo necessário para cada
etapa. A viabilidade técnica e econômica está em
[Estudo de viabilidade](06-estudo-de-viabilidade).

## Conhecimentos necessários

| Área | Conhecimento exigido | Situação da equipe |
|---|---|---|
| Front-end web | HTML, CSS, JavaScript, TypeScript, React | Domínio demonstrado — protótipo de 55 telas concluído |
| Componentização | Reuso, estado, propriedades, hooks | Domínio demonstrado — biblioteca própria sobre shadcn/ui |
| Modelagem | UML (casos de uso, classes), DER, cardinalidade | Domínio demonstrado — 3 diagramas revisados |
| Testes | Teste unitário, teste de fluxo, critério de aceitação | Domínio demonstrado — 94 testes e 36 fluxos |
| Acessibilidade | WCAG 2.2, contraste, alvo de toque, nome acessível | Domínio demonstrado — 48 telas auditadas |
| Versionamento | Git, branch, pull request, resolução de conflito | Em consolidação — convenções definidas neste semestre |
| Pesquisa aplicada | Questionário, entrevista, tabulação | Domínio demonstrado — 87 respondentes |
| **Flutter e Dart** | Widgets, estado com BLoC, navegação | **A adquirir** |
| **Firebase** | Firestore, Authentication, Storage, Cloud Functions | **A adquirir** |

As duas últimas linhas são a lacuna real e estão declaradas como tal. O protótipo foi construído
com o que a equipe já domina, justamente para que a curva de aprendizado do Flutter não
comprometesse a validação da experiência do usuário.

## Treinamentos previstos

| Necessidade | Recurso | Custo | Carga estimada |
|---|---|---|---|
| Fundamentos de Dart e Flutter | Documentação oficial e *codelabs* do Flutter | Gratuito | 40 h |
| Firebase para Flutter | Documentação oficial do Firebase | Gratuito | 20 h |
| Padrão BLoC | Documentação da biblioteca e exemplos oficiais | Gratuito | 15 h |
| Regras de segurança do Firestore | Documentação oficial | Gratuito | 10 h |

Todo o material previsto é gratuito e em acesso aberto. A carga total (85 h) cabe no intervalo
entre a entrega do PDTCC e o início da implementação nativa, distribuída entre os integrantes
conforme a área de cada um.

## Divisão das atividades

A divisão segue a especialização já demonstrada por cada integrante ao longo do
desenvolvimento do protótipo:

| Integrante | Frente de trabalho |
|---|---|
| Vinicius Santana dos Santos | Coordenação, requisitos, documentação e consistência entre artefatos |
| Yago Smith da Silva | Pesquisa de campo, viabilidade, mercado e concorrência |
| Nathan Costa Batista | Interface, prototipagem, identidade visual e publicação |
| Thomaz de Moraes Teixeira | Modelagem de dados, testes, acessibilidade e conformidade legal |

O detalhamento por entrega está em `docs/matriz-responsabilidades.md`, no repositório.

### Como a equipe se organiza

- **Repositório único**, com pasta própria por integrante — cada um versiona sem bloquear os
  demais.
- **Uma issue por entrega**, com responsável único.
- **Revisão cruzada em rodízio**: Vinicius revisa Yago, Yago revisa Nathan, Nathan revisa
  Thomaz, Thomaz revisa Vinicius. Ninguém aprova o próprio trabalho.
- **Reunião de acompanhamento** a cada etapa concluída, para conferir se os números da
  documentação continuam batendo com o artefato.

## A equipe tem capacidade técnica para concluir?

Sim, e a afirmação se apoia em resultado entregue, não em expectativa. O protótipo 5.0 está
concluído e verificado: 55 telas, 272 pontos de interação, 94 testes automatizados aprovados, 36
fluxos ponta a ponta sem erro de console e 48 telas auditadas em acessibilidade sem nenhum
problema. Os diagramas foram revisados e corrigidos a partir do código real, não do contrário.

O risco identificado é a **transição para Flutter**, tecnologia que a equipe ainda não domina.
Três fatores o reduzem:

1. A lógica de negócio já está especificada, testada e validada no protótipo — a
   reimplementação parte de um alvo conhecido, não de uma página em branco.
2. Os diagramas de classes e o DER já definem a estrutura de dados a ser criada no Firestore.
3. O material de estudo é gratuito e a carga cabe no cronograma.

## Cronograma do projeto

| Etapa | Início | Término | Duração | Responsáveis |
|---|---|---|---|---|
| Levantamento de requisitos e pesquisa de campo | 02/03/2026 | 31/03/2026 | 4 semanas | Yago, Vinicius e todos |
| Mockup e prototipação mobile-first | 01/04/2026 | 30/04/2026 | 4 semanas | Nathan, Yago e Thomaz |
| UML, DER e modelagem de dados | 15/04/2026 | 15/05/2026 | 4 semanas | Thomaz e Vinicius |
| Desenvolvimento: autenticação, anúncios e busca | 01/05/2026 | 30/06/2026 | 8 semanas | Nathan, Vinicius e Thomaz |
| Desenvolvimento: chat, notificações, pedidos e pagamento direto | 01/07/2026 | 31/07/2026 | 4 semanas | Nathan, Vinicius e Thomaz |
| Testes, ajustes, acessibilidade e documentação final | 01/08/2026 | 05/09/2026 | 5 semanas | Todos os integrantes |
| Preparação da apresentação e demonstração | 01/09/2026 | 15/09/2026 | 2 semanas | Todos os integrantes |

As etapas de modelagem e desenvolvimento se sobrepõem deliberadamente: a modelagem de dados
avança em paralelo à implementação dos primeiros módulos, para que a estrutura seja validada
contra código real em vez de permanecer no papel.

### Situação em agosto de 2026

| Etapa | Situação |
|---|---|
| Levantamento de requisitos e pesquisa | Concluída |
| Prototipação mobile-first | Concluída — versão 5.0 |
| UML, DER e modelagem | Concluída — 3 diagramas revisados |
| Módulos no protótipo (autenticação, anúncios, busca, chat, pedidos, pagamento) | Concluídos no protótipo React |
| Testes, acessibilidade e documentação | Concluídos |
| Apresentação | Em preparação |

**Não iniciado:** a implementação nativa em Flutter com Firebase. O cronograma acima descreve o
desenvolvimento do PDTCC e do protótipo; a construção do aplicativo final constitui a etapa
seguinte do projeto.

## Riscos operacionais e tratamento

| Risco | Efeito possível | Tratamento adotado |
|---|---|---|
| Curva de aprendizado do Flutter | Atraso na implementação nativa | Lógica já validada no protótipo; estudo dirigido de 85 h |
| Concentração de conhecimento em um integrante | Bloqueio na ausência da pessoa | Revisão cruzada obrigatória; documentação de cada decisão |
| Divergência entre documentação e artefato | Perda de credibilidade na banca | Números reexecutáveis por roteiro; conferência a cada entrega |
| Dependência de imagem externa | Tela quebrada durante a defesa | Fotos embutidas no projeto; protótipo abre sem internet |
| Conflito de versão no repositório | Perda de trabalho | Pasta por integrante; branch com prefixo próprio |
