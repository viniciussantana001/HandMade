# HandMade — Marketplace Mobile para Economia Circular

Repositório oficial do Trabalho de Conclusão de Curso (TCC) e da disciplina de Qualidade e Teste
de Software (QTS). Reúne o protótipo navegável, a documentação escrita e as evidências de
verificação do projeto.

| | |
|---|---|
| **Projeto** | HandMade — marketplace mobile para reaproveitamento de materiais excedentes |
| **Curso** | Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas |
| **Turma** | 3º ano — Desenvolvimento de Sistemas (2026) |
| **Instituição** | Etec Euro Albino de Souza — Mogi Guaçu, SP (Centro Paula Souza) |
| **Professor orientador** | Prof. Gilson Andrade |
| **Disciplinas** | TCC e Qualidade e Teste de Software (QTS) |
| **Status** | Protótipo 5.0 concluído e verificado · aplicação final em Flutter não iniciada |

## Integrantes

| Integrante | Função no projeto | Área no repositório |
|---|---|---|
| Vinicius Santana dos Santos | Gerenciamento do projeto e requisitos | [`documentos/wiki/membro-1-vinicius/`](documentos/wiki/membro-1-vinicius/) |
| Yago Smith da Silva | Pesquisa de campo, viabilidade e estudo de mercado | [`documentos/wiki/membro-2-yago/`](documentos/wiki/membro-2-yago/) |
| Nathan Costa Batista | Front-end, prototipagem e UI/UX | [`documentos/wiki/membro-3-nathan/`](documentos/wiki/membro-3-nathan/) |
| Thomaz de Moraes Teixeira | Modelagem de dados, testes e conformidade legal | [`documentos/wiki/membro-4-thomaz/`](documentos/wiki/membro-4-thomaz/) |

A divisão completa de responsabilidades está em
[`documentos/wiki/membro-1-vinicius/02-integrantes-e-funcoes.md`](documentos/wiki/membro-1-vinicius/02-integrantes-e-funcoes.md).

## Descrição do projeto

O HandMade é um marketplace mobile voltado à **economia circular**. Ele conecta quem gera
materiais excedentes — construtoras, marcenarias, marmorarias, indústrias e pessoas físicas em
reforma — a quem precisa desses materiais como matéria-prima: artesãos, pequenos
empreendedores, cooperativas de reciclagem e consumidores finais.

O usuário publica um anúncio com fotos, categoria, quantidade, condição, preço e localização.
O comprador busca por filtros combináveis, conversa pelo chat, faz proposta, paga diretamente
pelo aplicativo e acompanha o pedido até a avaliação final.

### Problema que resolve

Materiais com valor comercial são descartados porque não existe um canal específico, seguro e
organizado para redistribuí-los. Plataformas genéricas de classificados misturam esses itens a
milhares de produtos não relacionados, não oferecem filtros por tipo de resíduo nem por
proximidade, e não tratam reputação, mediação ou moderação para esse nicho.

O resultado é triplo: a empresa paga para descartar o que poderia vender, o artesão paga mais
caro por matéria-prima nova, e o material que voltaria ao ciclo produtivo termina em aterro. A
Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010) estabelece a hierarquia
*não geração → redução → reutilização → reciclagem → disposição final*, mas a falta de canais
práticos dificulta operacionalizar a etapa de reutilização no dia a dia.

O detalhamento com dados está em
[`documentos/wiki/membro-2-yago/04-problema-encontrado.md`](documentos/wiki/membro-2-yago/04-problema-encontrado.md).

## Tecnologias utilizadas

O projeto tem **duas stacks distintas**, e a separação é deliberada:

### Protótipo atual — demonstrador navegável

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript 5 |
| Biblioteca de interface | React 18 |
| Empacotador | Vite 5 |
| Estilo | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Navegação | React Router DOM 6 |
| Formulários e validação | react-hook-form + zod |
| Animação | framer-motion |
| Gráficos | recharts |
| Testes | Vitest + Playwright |
| Persistência | `localStorage` (prefixo `hm_v5_`), simulando o Firestore |

O protótipo **não possui backend, API nem banco de dados**. É um demonstrador de alta fidelidade
usado para validar telas, fluxos e interações antes da implementação nativa.

### Produto final planejado — aplicativo nativo

| Camada | Tecnologia |
|---|---|
| Framework | Flutter (Dart), padrão BLoC |
| Banco de dados | Cloud Firestore (NoSQL) |
| Autenticação | Firebase Authentication |
| Arquivos | Firebase Storage |
| Regras de negócio no servidor | Cloud Functions (Node.js) |
| Notificações | Firebase Cloud Messaging |
| Infraestrutura | Serverless, sem servidor próprio |

**Ferramentas de apoio:** Figma, Visual Studio Code, Git, GitHub, Firebase Console.

A justificativa de cada escolha está em
[`documentos/wiki/membro-2-yago/06-estudo-de-viabilidade.md`](documentos/wiki/membro-2-yago/06-estudo-de-viabilidade.md).

## Status atual do desenvolvimento

| Etapa | Situação |
|---|---|
| Levantamento de requisitos e pesquisa de campo | Concluído — 87 respondentes |
| Modelagem (casos de uso, classes, DER) | Concluído — 3 diagramas em SVG e PNG |
| Protótipo de alta fidelidade (React) | **Concluído — versão 5.0** |
| Monografia / PDTCC | Concluído — 304 parágrafos, 8 tabelas, 26 figuras |
| Documentação de qualidade e testes (QTS) | Concluído |
| Aplicativo final em Flutter + Firebase | **Não iniciado** — planejado |
| Teste com usuário real e leitor de tela | **Não executado** |

### Verificação do protótipo 5.0

Todos os números abaixo são reexecutáveis pelos roteiros em `documentos/qualidade/ferramentas/`.

| O quê | Como | Resultado |
|---|---|---|
| Tipagem | `tsc --noEmit` | 0 erro |
| Testes automatizados | Vitest, 6 arquivos | 94 de 94 |
| Fluxos ponta a ponta | Playwright, 8 fluxos | 36 de 36, 0 erro de console |
| Acessibilidade | 24 rotas × 2 temas | 48 telas, 0 problema |
| Compilação | `vite build` | 2.200 módulos |

**Cobertura da interface:** 48 telas cheias, 7 sobreposições (55 telas no total) e 272 pontos
de interação.

**Limite declarado:** não houve teste com usuário real nem com leitor de tela. As métricas de
usabilidade em [`documentos/qualidade/metodos-de-avaliacao.md`](documentos/qualidade/metodos-de-avaliacao.md)
são **alvos de projeto**, não resultados observados.

## Links

| Recurso | Endereço |
|---|---|
| **Protótipo (demonstração)** | `<INSERIR-LINK>` |
| **Wiki do projeto** | [Acessar Wiki](https://github.com/viniciussantana001/HandMade/wiki) |
| Código do protótipo | [`prototipo/`](prototipo/) |
| Documentação escrita | [`documentos/`](documentos/) |
| Conteúdo da Wiki (fonte) | [`documentos/wiki/`](documentos/wiki/) |

> Os dois links marcados com `<INSERIR-LINK>` devem ser preenchidos após a publicação. O
> procedimento está descrito no tutorial de postagem.

## Como rodar o protótipo

Requisitos: Node.js 20 ou superior.

```bash
cd prototipo
npm install
npm run dev      # ambiente de desenvolvimento
```

Outros comandos:

```bash
npm run build    # compila para produção
npm run preview  # serve o build compilado
npm test         # 94 testes automatizados
```

O protótipo abre **sem conexão com a internet**: as fotos do catálogo estão embutidas em
`prototipo/public/materiais/`.

### Conta de demonstração

```
e-mail: demo@handmade.com
senha:  Demo@1234
```

## Estrutura do repositório

```
prototipo/                    Código do demonstrador React + Vite + TypeScript
documentos/
  monografia/                 Monografia do TCC (.docx)
  diagramas/                  Casos de uso, classes e DER (SVG editável + PNG)
  telas/                      29 capturas do protótipo 5.0
  qualidade/                  Personas, métodos de avaliação, ferramentas e evidências
  wiki/                       Conteúdo da Wiki, separado por integrante
docs/
  tutorial-postagem.md        Como cada integrante publica sua parte
  matriz-responsabilidades.md Quem faz o quê, com escopo e apresentação
  fluxo-github.md             Issues, branches, commits e pull requests

---

**Licença de uso:** projeto acadêmico desenvolvido na Etec Euro Albino de Souza, 2026. O conteúdo
é de autoria dos integrantes listados acima.
