# 1.2 Integrantes e funções

*Seção sob responsabilidade de Vinicius Santana dos Santos.*

A equipe tem quatro integrantes. Cada um responde por uma área definida do projeto, com pasta
própria no repositório, páginas próprias nesta Wiki e um trecho próprio da apresentação. A
divisão foi feita para que ninguém dependa de outro para versionar ou publicar o próprio
trabalho.

## Quadro geral

| Integrante | Função principal | Área técnica no repositório |
|---|---|---|
| **Vinicius Santana dos Santos** | Gerenciamento do projeto e requisitos | `README.md`, monografia, cronograma |
| **Yago Smith da Silva** | Pesquisa de campo, viabilidade e estudo de mercado | `documentos/qualidade/evidencias/` |
| **Nathan Costa Batista** | Desenvolvimento front-end, prototipagem e UI/UX | `prototipo/`, `documentos/telas/` |
| **Thomaz de Moraes Teixeira** | Modelagem de dados, testes e conformidade legal | `documentos/diagramas/`, `documentos/qualidade/` |

## Vinicius Santana dos Santos — Gerenciamento do projeto e requisitos

Coordena o andamento do trabalho e responde pela coerência entre os artefatos: README, Wiki e
monografia precisam contar a mesma história, com os mesmos números.

**Atribuições:**

- Planejamento das etapas e acompanhamento do cronograma.
- Consolidação dos requisitos levantados em especificação utilizável pela equipe.
- Manutenção do `README.md` e da estrutura de navegação da Wiki.
- Revisão final de consistência antes de cada entrega.

**Seções que assina:** [Introdução](01-introducao), esta página,
[Descrição do TCC](03-descricao-do-tcc), [Formas de resolver](22-formas-de-resolver),
[Cronograma e viabilidade operacional](04-cronograma-e-viabilidade-operacional).

## Yago Smith da Silva — Pesquisa de campo, viabilidade e mercado

Responde por tudo que exige evidência externa. Nenhuma estatística entra na documentação sem
passar pela verificação de fonte.

**Atribuições:**

- Elaboração e aplicação do questionário e do roteiro de entrevista.
- Tabulação e análise dos resultados da pesquisa de campo.
- Estudo de viabilidade técnica, de cronograma e econômica.
- Levantamento de concorrentes e definição das regiões de atuação.

**Seções que assina:** [Área de atuação](05-area-de-atuacao),
[Problema encontrado](04-problema-encontrado),
[Estudo de viabilidade](06-estudo-de-viabilidade),
[Levantamento de requisitos](07-levantamento-de-requisitos),
[Concorrentes](08-concorrentes),
[Microrregião e macrorregião](09-microrregiao-e-macrorregiao).

## Nathan Costa Batista — Front-end, prototipagem e UI/UX

Único integrante que altera o código do protótipo. Responde pela interface e pela publicação da
demonstração usada na apresentação.

**Atribuições:**

- Construção do protótipo em React, Vite e TypeScript.
- Definição da identidade visual, paleta, tipografia e componentes.
- Especificação dos requisitos funcionais e não funcionais.
- Criação das personas e das capturas de tela.
- Publicação do protótipo e manutenção do link.

**Seções que assina:** [Prototipagem](10-prototipagem),
[Requisitos funcionais](11-requisitos-funcionais),
[Requisitos não funcionais](12-requisitos-nao-funcionais),
[Personas](13-personas), [Telas do protótipo](15-prototipo-telas),
[UI / UX](16-ui-ux).

## Thomaz de Moraes Teixeira — Modelagem, testes e conformidade

Responde pela camada de dados e por tudo que precisa ser demonstrado em vez de afirmado.

**Atribuições:**

- Diagramas de casos de uso, de classes e entidade-relacionamento.
- Estratégia de testes: unitários, de fluxo e auditoria de acessibilidade.
- Reexecução das verificações antes de cada entrega.
- Levantamento da legislação aplicável e redação dos modelos contratuais.
- Consolidação das referências bibliográficas em ABNT.

**Seções que assina:** [Fluxo de interação de dados](14-fluxo-de-interacao),
[Heurísticas de Nielsen](17-heuristicas-de-nielsen),
[Testes e qualidade](18-testes-e-qualidade),
[Estudo do cliente](19-estudo-do-cliente),
[Legislação e contratos](20-legislacao-e-contratos),
[Referências](21-referencias).

## Cobertura das funções previstas

A atividade sugere funções típicas de uma equipe de desenvolvimento. A correspondência com este
projeto:

| Função sugerida | Quem exerce | Observação |
|---|---|---|
| Desenvolvimento front-end | Nathan | Protótipo React concluído |
| Desenvolvimento back-end | Thomaz (modelagem) | Sem implementação: o protótipo é client-side; o backend é o Firebase planejado |
| Banco de dados | Thomaz | DER e diagrama de classes; 13 coleções mapeadas |
| Documentação | Vinicius | Wiki, README e monografia |
| Testes | Thomaz | 94 testes, 36 fluxos, 48 telas auditadas |
| Gerenciamento do projeto | Vinicius | Cronograma e coordenação |
| Pesquisa e requisitos | Yago | 87 respondentes |

A ausência de desenvolvimento back-end implementado é consequência direta do estágio do
projeto: o protótipo simula a persistência em `localStorage`, e a camada Firebase pertence à
fase seguinte.

## Como a participação individual é comprovada

O histórico do repositório é a evidência. Cada integrante:

- usa a própria conta do GitHub, com nome real no perfil;
- trabalha em branch com o próprio prefixo (`vinicius/`, `yago/`, `nathan/`, `thomaz/`);
- abre os próprios *pull requests* e faz o *merge* deles;
- publica as próprias páginas da Wiki;
- apresenta apenas o que efetivamente produziu.

O procedimento está descrito em `docs/tutorial-postagem.md` e as convenções em
`docs/fluxo-github.md`, no repositório.
