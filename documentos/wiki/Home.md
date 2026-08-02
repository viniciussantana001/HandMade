# HandMade — Marketplace Mobile para Economia Circular

Documentação oficial do Trabalho de Conclusão de Curso (TCC) e da disciplina de Qualidade e
Teste de Software (QTS) — Etec Euro Albino de Souza, Mogi Guaçu (SP), 2026.

O HandMade conecta quem gera **materiais excedentes** — construtoras, marcenarias, marmorarias,
indústrias e pessoas físicas em reforma — a quem precisa desses materiais como matéria-prima:
artesãos, pequenos empreendedores, cooperativas de reciclagem e consumidores finais.

## O que existe hoje e o que está planejado

Esta distinção vale para toda a documentação e não deve ser confundida em nenhuma seção:

| | Protótipo atual | Produto final planejado |
|---|---|---|
| **Situação** | Concluído e verificado (versão 5.0) | Não iniciado |
| **Tecnologia** | React 18 + Vite 5 + TypeScript 5 | Flutter (Dart) + Firebase |
| **Persistência** | `localStorage` do navegador | Cloud Firestore |
| **Finalidade** | Demonstrar telas, fluxos e interações | Aplicativo publicado para Android e iOS |

O protótipo **não possui backend, API nem banco de dados**. É um demonstrador navegável de alta
fidelidade, usado para validar a experiência antes da implementação nativa.

## Números verificados do protótipo 5.0

| Indicador | Valor |
|---|---|
| Telas | 48 cheias + 7 sobreposições = 55 |
| Pontos de interação | 272 |
| Rotas | 31 |
| Testes automatizados | 94 de 94 |
| Fluxos ponta a ponta | 36 de 36 |
| Telas auditadas em acessibilidade | 48, com 0 problema |

Todos reexecutáveis pelos roteiros descritos em [Testes e qualidade](18-testes-e-qualidade).

## Mapa da documentação

### 1. Introdução
- [1.1 Introdução e visão geral](01-introducao)
- [1.2 Integrantes e funções](02-integrantes-e-funcoes)
- [1.3 Breve descrição do TCC](03-descricao-do-tcc)
- [1.4 Área de atuação](05-area-de-atuacao)
- [1.5 Problema encontrado](04-problema-encontrado)
- [1.6 Formas de resolver o problema](22-formas-de-resolver)

### 2. Estudo de viabilidade
- [2.1 Viabilidade operacional e cronograma](04-cronograma-e-viabilidade-operacional)
- [2.2 Viabilidade técnica, de cronograma e econômica](06-estudo-de-viabilidade)

### 3. Técnicas de levantamento de requisitos
- [3.1 Entrevista, questionário e análise dos resultados](07-levantamento-de-requisitos)

### 4. Prototipagem
- [4.1 Processo de prototipagem](10-prototipagem)
- [4.2 Requisitos funcionais](11-requisitos-funcionais)
- [4.3 Requisitos não funcionais](12-requisitos-nao-funcionais)
- [4.4 Personas](13-personas)
- [4.5 Fluxo de interação de dados](14-fluxo-de-interacao)
- [4.6 Heurísticas de Nielsen](17-heuristicas-de-nielsen)
- [4.7 Telas do protótipo](15-prototipo-telas)
- [4.8 UI / UX](16-ui-ux)

### 5. Estudo do cliente
- [5.1 Estudo do cliente](19-estudo-do-cliente)

### 6. Área de atuação por região
- [6.1 Microrregião e macrorregião](09-microrregiao-e-macrorregiao)

### 7. Concorrentes
- [7.1 Concorrentes diretos e indiretos](08-concorrentes)

### 8. Legislação e aspectos contratuais
- [8.1 Legislação e contratos](20-legislacao-e-contratos)

### Complementos
- [Testes e qualidade de software (QTS)](18-testes-e-qualidade)
- [Referências bibliográficas](21-referencias)

## Equipe

| Integrante | Função | Seções que assina |
|---|---|---|
| Vinicius Santana dos Santos | Gerenciamento do projeto e requisitos | 1.1 a 1.3, 1.6, 2.1 |
| Yago Smith da Silva | Pesquisa de campo, viabilidade e mercado | 1.4, 1.5, 2.2, 3.1, 6.1, 7.1 |
| Nathan Costa Batista | Front-end, prototipagem e UI/UX | 4.1 a 4.4, 4.7, 4.8 |
| Thomaz de Moraes Teixeira | Modelagem, testes e conformidade | 4.5, 4.6, 5.1, 8.1, Testes, Referências |

## Links úteis

| Recurso | Endereço |
|---|---|
| Protótipo em funcionamento | [Protótipo](https://handmade-b0f.pages.dev/) |
| Código do protótipo | `prototipo/` no repositório |
| Monografia completa | `documentos/monografia/` |
| Diagramas (UML e DER) | `documentos/diagramas/` |
| Evidências de teste | `documentos/qualidade/evidencias/` |

---

**Limite declarado.** Não houve teste com usuário real nem com leitor de tela nesta versão. As
métricas de usabilidade documentadas são **alvos de projeto**, não resultados observados. O que
foi efetivamente medido está em [Testes e qualidade](18-testes-e-qualidade).
