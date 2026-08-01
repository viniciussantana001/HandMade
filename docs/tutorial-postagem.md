# Tutorial de postagem — como cada integrante envia sua parte

Guia prático para os quatro integrantes. Cada um edita **apenas a sua pasta**, envia o próprio
*commit*, abre o próprio *pull request* e publica a própria seção da Wiki.

Se você tem dúvida sobre qual é a sua pasta, comece pela tabela da seção 1.

---

## 1. Qual pasta é sua

| Integrante | Pasta que você edita | Páginas da Wiki que você publica |
|---|---|---|
| **Vinicius Santana dos Santos** | `documentos/wiki/membro-1-vinicius/` | Home, Introdução, Integrantes, Descrição do TCC, Cronograma |
| **Yago Smith da Silva** | `documentos/wiki/membro-2-yago/` | Área de atuação, Problema, Viabilidade, Requisitos (levantamento), Concorrentes, Regiões |
| **Nathan Costa Batista** | `documentos/wiki/membro-3-nathan/` | Prototipagem, Requisitos funcionais e não funcionais, Personas, Fluxo, Heurísticas, UI/UX |
| **Thomaz de Moraes Teixeira** | `documentos/wiki/membro-4-thomaz/` | Modelagem, Testes e qualidade, Legislação, Contratos, Estudo do cliente, Referências |

**Regra única e obrigatória:** não altere arquivos dentro da pasta de outro integrante. Se
precisar de uma mudança lá, abra uma *issue* e marque a pessoa responsável.

### Pastas compartilhadas

Estas pastas pertencem ao grupo. Alterações nelas exigem aviso no grupo **antes** do envio:

| Pasta | Responsável por aprovar |
|---|---|
| `README.md` | Vinicius |
| `prototipo/` | Nathan |
| `documentos/diagramas/` | Thomaz |
| `documentos/qualidade/` | Thomaz |
| `documentos/monografia/` | Vinicius |

---

## 2. Onde colocar cada tipo de arquivo

| O que você produziu | Onde salvar |
|---|---|
| Texto de uma seção da Wiki | `documentos/wiki/<sua-pasta>/<numero>-<assunto>.md` |
| Imagem, gráfico ou tabela da sua seção | `documentos/wiki/<sua-pasta>/imagens/` |
| Captura de tela do protótipo | `documentos/telas/` |
| Diagrama (casos de uso, classes, DER) | `documentos/diagramas/` |
| Planilha, formulário ou evidência de pesquisa | `documentos/qualidade/evidencias/` |
| Alteração de código | `prototipo/src/` |

**Nomes de arquivo:** use apenas letras minúsculas, números e hífen. Sem espaço, sem acento,
sem maiúscula. Exemplo correto: `07-requisitos-funcionais.md`. Exemplo errado:
`07 Requisitos Funcionais.md`.

**Imagens:** prefira PNG para captura de tela e SVG para diagrama. Nomeie descrevendo o conteúdo
(`grafico-frequencia-descarte.png`), não a ordem (`imagem2.png`).

---

## 3. Preparar o computador (só na primeira vez)

```bash
# 1. Baixar o repositório
git clone https://github.com/<organizacao>/<repositorio>.git
cd <repositorio>

# 2. Identificar-se (use o mesmo e-mail da sua conta GitHub)
git config user.name "Seu Nome Completo"
git config user.email "seu-email@exemplo.com"
```

---

## 4. Enviar suas alterações

Siga os cinco passos na ordem. Os comandos são os mesmos para todos; muda apenas o nome da
*branch* e a pasta que você edita.

### Passo 1 — atualizar sua cópia e criar a branch

Nunca trabalhe direto na `main`.

```bash
git checkout main
git pull origin main

# Padrão do nome: <seu-primeiro-nome>/<assunto-curto>
git checkout -b vinicius/introducao-wiki
```

### Passo 2 — editar seus arquivos

Abra a **sua** pasta e faça as alterações.

### Passo 3 — conferir o que mudou

```bash
git status     # lista os arquivos alterados
git diff       # mostra linha a linha o que mudou
```

Confira que **todos** os arquivos listados estão dentro da sua pasta. Se aparecer arquivo de
outra pessoa, veja a seção 7.

### Passo 4 — registrar o commit

```bash
git add documentos/wiki/membro-1-vinicius/
git commit -m "docs(wiki): escreve a seção de introdução do projeto"
```

**Formato da mensagem:** `tipo(escopo): o que foi feito`, em português, no presente.

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `docs` | Texto, Wiki, documentação | `docs(wiki): adiciona personas com matriz de cobertura` |
| `feat` | Nova funcionalidade no protótipo | `feat(planos): permite pagar assinatura por PIX ou boleto` |
| `fix` | Correção de defeito | `fix(anuncios): atualiza a lista ao pausar sem recarregar` |
| `test` | Testes | `test(pagamentos): cobre recusa de cartão` |
| `chore` | Organização, arquivos de apoio | `chore: move diagramas para documentos/diagramas` |

Escreva o que a mudança **faz**, não o que você fez. Evite `atualizações`, `mudanças`, `ajustes`.

### Passo 5 — enviar e abrir o pull request

```bash
git push origin vinicius/introducao-wiki
```

No GitHub:

1. Abra o repositório — aparecerá o aviso **Compare & pull request**. Clique nele.
2. **Título:** o mesmo texto do commit principal.
3. **Descrição:** preencha o modelo abaixo.
4. Em **Reviewers**, escolha um colega.
5. Clique em **Create pull request**.

```markdown
## O que foi feito
Descreva em duas ou três linhas.

## Arquivos alterados
- documentos/wiki/membro-1-vinicius/01-introducao.md

## Seções da Wiki afetadas
Introdução

## Confirmação
- [ ] Editei apenas a minha pasta
- [ ] Os links e imagens abrem corretamente
- [ ] Revisei ortografia e concordância
- [ ] Não há nome de integrante fora da lista oficial
```

Depois que um colega aprovar, clique em **Merge pull request**.

---

## 5. Atualizar a Wiki do GitHub

O texto vive em duas camadas: o arquivo `.md` no repositório (histórico e revisão) e a página
publicada na Wiki (o que o professor lê). **As duas precisam ficar iguais.**

### Modo recomendado — pelo navegador

1. Abra a aba **Wiki** do repositório.
2. **New Page** (nova) ou **Edit** (existente).
3. **Título:** exatamente o nome definido no mapa de páginas — por exemplo `1.1 Introdução`.
4. Copie o conteúdo do seu arquivo `.md` e cole no corpo.
5. Em *Edit message*, escreva o que mudou.
6. **Save Page**.

### Imagens na Wiki

A Wiki do GitHub não enxerga as imagens do repositório por caminho relativo. Use o endereço
completo do arquivo em `main`:

```markdown
![Diagrama de casos de uso](https://raw.githubusercontent.com/<organizacao>/<repositorio>/main/documentos/diagramas/fig-24-casos-de-uso.png)
```

Troque `<organizacao>` e `<repositorio>` pelos valores reais. Depois de salvar, **confira se a
imagem realmente aparece** — link quebrado conta como seção incompleta.

### Barra lateral

A navegação fica na página especial `_Sidebar`. O conteúdo dela está em
`documentos/wiki/_Sidebar.md`. Se você criar uma página nova, acrescente o link ali também.

---

## 6. Conferir antes de enviar

Percorra a lista. Qualquer item negativo significa que ainda não está pronto.

**Conteúdo**

- [ ] A seção tem explicação própria, não texto copiado de outra fonte.
- [ ] Toda afirmação com número traz a fonte (pesquisa do grupo, lei, documento oficial).
- [ ] Não há seção vazia nem com o texto "em construção".
- [ ] Aparecem imagens, tabelas ou diagramas quando fazem sentido.

**Organização**

- [ ] O arquivo está na **sua** pasta.
- [ ] O nome do arquivo é minúsculo, sem espaço e sem acento.
- [ ] As imagens estão em `imagens/` dentro da sua pasta, ou na pasta comum correta.

**Consistência do projeto**

- [ ] Os únicos nomes citados são: Vinicius Santana dos Santos, Yago Smith da Silva,
      Nathan Costa Batista e Thomaz de Moraes Teixeira.
- [ ] O texto distingue **protótipo React** (o que existe) de **aplicativo Flutter**
      (o que está planejado).
- [ ] Não há promessa de recurso que o protótipo não tem.

**Envio**

- [ ] `git status` mostra apenas arquivos seus.
- [ ] A mensagem de commit segue `tipo(escopo): descrição`.
- [ ] O pull request tem descrição preenchida e um revisor marcado.
- [ ] A página correspondente na Wiki foi atualizada com o mesmo conteúdo.

### Conferência rápida pelo terminal

```bash
# Mostra apenas os arquivos que você alterou
git diff --name-only main

# Procura nome fora da lista oficial (não deve retornar nada)
grep -ri "leonardo" documentos/ README.md
```

---

## 7. Problemas comuns

**Editei o arquivo de outra pessoa por engano.**
Se ainda não enviou o commit:
```bash
git checkout -- caminho/do/arquivo-alheio.md
```

**Quero desfazer o último commit, mantendo o que escrevi.**
```bash
git reset --soft HEAD~1
```

**`git push` foi recusado com "rejected".**
A `main` avançou. Traga as novidades e reenvie:
```bash
git pull origin main --rebase
git push origin <sua-branch>
```

**Apareceu conflito.**
O arquivo mostrará marcas `<<<<<<<`, `=======` e `>>>>>>>`. Apague as marcas, deixe o texto
final correto e então:
```bash
git add <arquivo>
git rebase --continue
```
Se o conflito for na pasta de outro integrante, chame a pessoa antes de resolver.

**Minha imagem não aparece na Wiki.**
Use o endereço completo `raw.githubusercontent.com` (seção 5) e confirme que a imagem já foi
enviada para a `main`.

---

## 8. Publicar o protótipo

Feito uma vez pelo responsável do protótipo (**Nathan**), com o link resultante indo para o
README e para a Wiki.

```bash
cd prototipo
npm install
npm run build     # gera a pasta dist/
```

Opções de publicação, da mais simples para a mais completa:

| Opção | Como |
|---|---|
| **Vercel** | Importar o repositório, definir *Root Directory* = `prototipo`, framework Vite. Publicação automática a cada envio na `main`. |
| **Netlify** | *Base directory* = `prototipo`, *Build command* = `npm run build`, *Publish directory* = `prototipo/dist`. |
| **GitHub Pages** | Publicar o conteúdo de `prototipo/dist`. Exige `base` configurado no `vite.config.ts` quando o site não está na raiz do domínio. |

Como é uma aplicação de página única, configure o redirecionamento de todas as rotas para
`index.html` — sem isso, abrir `/marketplace` direto retorna erro 404.

Depois de publicar:

1. Substitua `<INSERIR-LINK>` no `README.md` pelo endereço real.
2. Atualize o mesmo link na página **Protótipo** da Wiki.
3. Abra o endereço no celular e confirme que entra com a conta de demonstração.

---

## 9. Antes da apresentação

A avaliação considera a participação de todos, e o tempo de fala de cada integrante é
computado. Só a Wiki pode ser usada como material.

- [ ] Todas as páginas da Wiki estão publicadas e abrem sem erro.
- [ ] Cada integrante consegue mostrar, no histórico do GitHub, os commits que fez.
- [ ] Cada integrante sabe apresentar a própria seção sem depender dos colegas.
- [ ] O protótipo abre pelo link publicado, num aparelho real.
- [ ] O professor consta como colaborador (`pedrorsac@gmail.com`).

O roteiro de apresentação, com a divisão de tempo, está em
[`matriz-responsabilidades.md`](matriz-responsabilidades.md).
