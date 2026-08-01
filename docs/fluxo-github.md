# Fluxo de trabalho no GitHub

Convenções de *issues*, *branches*, *commits* e *pull requests*. O objetivo é que o histórico do
repositório mostre, sem ambiguidade, o que cada integrante produziu — critério explícito de
avaliação da atividade.

O passo a passo dos comandos está em [`tutorial-postagem.md`](tutorial-postagem.md). Este
documento trata das convenções e da divisão do trabalho.

## 1. Branches

| Branch | Papel |
|---|---|
| `main` | Versão entregue. Recebe alteração **somente** por pull request aprovado. |
| `<nome>/<assunto>` | Trabalho individual. Uma por entrega. |

Padrão do nome: primeiro nome do integrante, barra, assunto curto com hífens.

```
vinicius/introducao-wiki
yago/pesquisa-questionario
nathan/requisitos-funcionais
thomaz/diagrama-der
```

Uma branch por entrega. Não acumule assuntos diferentes na mesma branch: isso impede revisar e
aprovar em separado.

## 2. Issues

Toda entrega começa como *issue*. É ela que dá rastreabilidade entre o que foi combinado e o
que foi enviado.

**Título:** `[Área] O que precisa ser feito`
**Responsável:** marcar em *Assignees* — sempre uma pessoa
**Etiqueta:** conforme a tabela abaixo

| Etiqueta | Uso | Cor sugerida |
|---|---|---|
| `documentacao` | Texto da Wiki e documentos | azul |
| `prototipo` | Código do demonstrador | verde |
| `pesquisa` | Coleta e análise de dados | amarelo |
| `modelagem` | Diagramas e estrutura de dados | roxo |
| `testes` | Verificação e qualidade | laranja |
| `correcao` | Defeito encontrado | vermelho |
| `apresentacao` | Preparação da banca | cinza |

### Issues previstas por integrante

**Vinicius — gerenciamento e requisitos**

| # | Título | Etiqueta |
|---|---|---|
| 1 | [Wiki] Criar página inicial e barra lateral de navegação | `documentacao` |
| 2 | [Wiki] Escrever introdução e visão geral do projeto | `documentacao` |
| 3 | [Wiki] Descrever integrantes e funções de cada um | `documentacao` |
| 4 | [Wiki] Escrever a descrição do TCC (necessidade, funcionamento, público, benefícios) | `documentacao` |
| 5 | [Wiki] Montar cronograma e viabilidade operacional | `documentacao` |
| 6 | [Repo] Manter README com links do protótipo e da Wiki | `documentacao` |
| 7 | [Repo] Adicionar o professor como colaborador | `documentacao` |

**Yago — pesquisa, viabilidade e mercado**

| # | Título | Etiqueta |
|---|---|---|
| 8 | [Wiki] Descrever a área de atuação e o funcionamento do mercado | `pesquisa` |
| 9 | [Wiki] Detalhar o problema encontrado com dados e fontes | `pesquisa` |
| 10 | [Wiki] Escrever o estudo de viabilidade técnica, de cronograma e econômica | `pesquisa` |
| 11 | [Wiki] Documentar entrevista, questionário e análise dos resultados | `pesquisa` |
| 12 | [Wiki] Levantar concorrentes diretos e indiretos | `pesquisa` |
| 13 | [Wiki] Definir microrregião de implantação e plano de expansão | `pesquisa` |

**Nathan — front-end, prototipagem e UI/UX**

| # | Título | Etiqueta |
|---|---|---|
| 14 | [Wiki] Documentar o processo de prototipagem e a evolução das versões | `documentacao` |
| 15 | [Wiki] Listar e descrever os requisitos funcionais | `documentacao` |
| 16 | [Wiki] Listar e descrever os requisitos não funcionais | `documentacao` |
| 17 | [Wiki] Publicar as personas do sistema | `documentacao` |
| 18 | [Wiki] Documentar as telas do protótipo com objetivo e decisões de design | `prototipo` |
| 19 | [Wiki] Registrar identidade visual, paleta, tipografia e acessibilidade | `prototipo` |
| 20 | [Protótipo] Publicar a demonstração e informar o link | `prototipo` |

**Thomaz — modelagem, testes e conformidade**

| # | Título | Etiqueta |
|---|---|---|
| 21 | [Wiki] Documentar o fluxo de interação de dados | `modelagem` |
| 22 | [Wiki] Analisar as dez heurísticas de Nielsen sobre o protótipo | `testes` |
| 23 | [Wiki] Documentar a estratégia de testes e os resultados obtidos | `testes` |
| 24 | [Wiki] Escrever o estudo do cliente e a classificação de perfis | `documentacao` |
| 25 | [Wiki] Levantar legislação aplicável e modelos de contrato | `documentacao` |
| 26 | [Wiki] Consolidar as referências bibliográficas em ABNT | `documentacao` |

**Do grupo**

| # | Título | Etiqueta |
|---|---|---|
| 27 | [Entrega] Revisar a Wiki inteira antes da apresentação | `apresentacao` |
| 28 | [Entrega] Ensaiar a apresentação com divisão de tempo | `apresentacao` |

## 3. Commits

Formato: `tipo(escopo): descrição no presente`

```
docs(wiki): escreve a seção de introdução do projeto
feat(planos): permite pagar assinatura por PIX ou boleto
fix(anuncios): atualiza a lista ao pausar sem recarregar
test(pagamentos): cobre a recusa de cartão inválido
chore: move os diagramas para documentos/diagramas
```

Tipos: `docs`, `feat`, `fix`, `test`, `refactor`, `chore`.

Regras:

- Português, presente do indicativo, primeira letra minúscula, sem ponto final.
- Descreva o efeito da mudança, não a atividade. `docs(wiki): adiciona personas` é útil;
  `docs: alterações` não é.
- Um assunto por commit.
- Referencie a issue quando houver: `docs(wiki): escreve a introdução (#2)`.

## 4. Pull requests

Um pull request por entrega, sempre da sua branch para a `main`.

**Título:** igual ao commit principal.

**Descrição:**

```markdown
Resolve #<numero-da-issue>

## O que foi feito
Duas ou três linhas.

## Arquivos alterados
- documentos/wiki/membro-1-vinicius/01-introducao.md

## Seções da Wiki afetadas
Introdução

## Confirmação
- [ ] Editei apenas a minha pasta
- [ ] Os links e imagens abrem corretamente
- [ ] Revisei ortografia e concordância
- [ ] A página correspondente na Wiki foi atualizada
```

### Revisão

Cada pull request é revisado por um colega, na rotação abaixo. Ela garante que ninguém revisa
apenas a si mesmo e que todos leem o trabalho dos outros.

| Autor | Revisor |
|---|---|
| Vinicius | Thomaz |
| Yago | Vinicius |
| Nathan | Yago |
| Thomaz | Nathan |

O revisor confere: o autor mexeu só na própria pasta; o texto explica em vez de copiar; toda
afirmação com número tem fonte; imagens e links abrem; nenhum nome fora da lista oficial.

Aprovado, o **autor** faz o *merge* — assim o histórico mantém a autoria correta.

## 5. Alterações no protótipo

Além da revisão, alteração em `prototipo/` só entra na `main` se as quatro verificações passarem:

```bash
cd prototipo
npm install
npx tsc --noEmit    # tipagem: 0 erro
npm test            # 94 testes
npm run build       # compila sem erro
```

E, com o build servido:

```bash
node ../documentos/qualidade/ferramentas/fluxos-e2e.mjs http://localhost:4173
node ../documentos/qualidade/ferramentas/acessibilidade.mjs http://localhost:4173
```

Se um número mudar — mais telas, mais testes —, atualize também o README e a página de testes da
Wiki no mesmo pull request. Documentação e código divergentes contam como defeito.

## 6. Comprovar a participação individual

A participação de todos é critério de avaliação. Para que ela fique demonstrada:

- Cada integrante usa a **própria conta** do GitHub, com nome real no perfil.
- Ninguém envia commit em nome de outro. Trabalho feito junto usa `Co-authored-by:` no rodapé
  da mensagem.
- Envie ao longo do semestre, não tudo no último dia: a evolução do projeto é avaliada.

Como conferir o próprio histórico: aba **Commits** do repositório, filtro por autor; ou
`git log --author="Seu Nome" --oneline`.
