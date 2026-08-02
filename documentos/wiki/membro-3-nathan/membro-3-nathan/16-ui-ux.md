# 4.8 UI / UX

**Responsável:** Nathan Costa Batista

## Identidade visual

O HandMade negocia material de reaproveitamento entre pessoas que não se conhecem. A interface
precisa comunicar duas coisas ao mesmo tempo: **confiança**, porque há dinheiro envolvido, e
**simplicidade**, porque parte do público tem baixa familiaridade digital.

A direção escolhida foi de sobriedade: superfícies claras, um único verde como cor de ação,
tipografia legível e ausência de ornamento. Nada na tela existe só para decorar.

## Paleta de cores

A paleta **não foi escolhida a olho**. As luminosidades saíram de um roteiro
(`documentos/qualidade/ferramentas/paleta.mjs`) que resolve a menor alteração de brilho capaz de
satisfazer o contraste mínimo da WCAG 2.2 nível AA em **todas as combinações que o código
realmente usa** — texto sobre cartão, sobre fundo, sobre superfície neutra e sobre o tingimento do
próprio matiz nas proporções aplicadas. Matiz e saturação da marca ficam intactos; apenas o brilho
muda.

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `152 55% 28%` | Verde da marca; ação principal, links e foco |
| `--primary-deep` | `152 60% 21%` | Parada opaca de gradiente em painéis |
| `--background` | `0 0% 98%` | Fundo da aplicação |
| `--card` | `0 0% 100%` | Superfície de cartão |
| `--foreground` | `220 20% 10%` | Texto principal |
| `--muted-foreground` | `220 10% 44%` | Texto secundário |
| `--warning` | `38 92% 50%` | Âmbar vivo — preenchimento do selo "Destaque" |
| `--warning-strong` | `38 90% 30.5%` | Âmbar como **texto** sobre fundo claro |
| `--success` | `152 55% 28%` | Confirmação |
| `--info` | `210 80% 38.5%` | Informação neutra |
| `--destructive` | `0 72% 42.5%` | Exclusão e erro |

### Dois casos que exigiram desdobramento de token

**`--warning-strong`.** O âmbar vivo funciona como preenchimento de selo, mas como cor de texto
sobre fundo claro atinge 1,98:1 — muito abaixo do mínimo. O papel de primeiro plano ganhou token
próprio, mais escuro. Foram 51 substituições no código.

**`--primary-deep`.** Os painéis com gradiente usavam uma parada translúcida (`to-primary/80`). A
transparência clareava o verde e derrubava o texto branco a 3,99:1. A parada passou a ser opaca e
mais escura.

### Defeito de contraste corrigido no acabamento

O token de destaque (`--accent`) era âmbar com texto branco: **2,14:1**. Como os componentes da
biblioteca aplicam `hover:bg-accent` em 33 pontos, todo botão fantasma piscava âmbar ilegível ao
toque. Voltou a ser superfície neutra discreta.

O caso ilustra por que a auditoria automatizada é necessária: o defeito só aparecia no estado de
toque, que uma revisão visual estática não alcança.

## Tipografia

**Plus Jakarta Sans**, com `system-ui` como alternativa. Critérios da escolha: boa legibilidade em
tamanho pequeno, altura de x generosa e formas distinguíveis entre si — importante para o público
de leitura pausada descrito em [Personas](13-personas).

A hierarquia vem de **tamanho e peso**, nunca de opacidade. Durante o acabamento, escalas
construídas com `opacity-70/80/90` sobre gradiente foram substituídas: a transparência reduzia o
contraste real sem que isso aparecesse no valor declarado da cor.

Números usam variante tabular, para que valores alinhem em colunas de preço e recibo.

## Ícones

Biblioteca **Lucide**, com traço uniforme. Regras aplicadas:

- Ícone sozinho **sempre** tem nome acessível. A auditoria encontrou botões só de ícone sem nome
  (filtros e alternância de exibição no marketplace) — corrigidos.
- Ícone nunca é o único portador de informação: acompanha texto ou tem rótulo.
- Emoji foi evitado como elemento funcional, porque muda de desenho conforme o sistema
  operacional. Nos diagramas, os ícones de ator foram convertidos em vetor pelo mesmo motivo.
- Tamanhos seguem a escala do Tailwind. Um ícone usava `w-4.5`, valor inexistente na escala, e
  saía sem tamanho definido — corrigido.

## Acessibilidade

Tratada como requisito, não como acabamento. As **48 telas** (24 rotas × 2 temas) foram auditadas
em sete critérios objetivos, com **0 falha**. Detalhes em
[Requisitos não funcionais](12-requisitos-nao-funcionais) e
[Testes e qualidade](18-testes-e-qualidade).

Além dos sete critérios medidos, foram atendidos por construção:

- **`prefers-reduced-motion`** — animações e transições desligadas globalmente para quem configura
  redução de movimento (critério 2.3.3).
- **Foco visível** — anel padronizado em `:focus-visible`, que aparece na navegação por teclado e
  não no toque (2.4.7).
- **Zoom preservado** — o `viewport` não fixa `maximum-scale` (1.4.4).
- **Área segura** — a barra inferior usa `env(safe-area-inset-bottom)`, para não ficar sob o
  indicador de gestos.
- **Alvo de toque mínimo de 24 × 24 px** — ampliados: "Esqueci minha senha", limpar busca,
  sugestões de busca e "Denunciar anúncio".

### Correções estruturais de HTML

A auditoria estática encontrou dois problemas que atravessavam a verificação de tipos sem erro:

- **30 botões sem `type` explícito.** Dentro de formulário, o padrão do HTML é `submit` — um botão
  de ação secundária enviava o formulário sem intenção.
- **42 casos de link envolvendo botão.** Conteúdo interativo aninhado é proibido pelo HTML e
  confunde leitor de tela. Migrados para uma composição que renderiza um único elemento de âncora.

## Responsividade

Projeto **mobile-first** no sentido estrito: a interface parte de 412 px e a navegação principal
fica na base da tela, ao alcance do polegar. Não é um site adaptado para celular.

Referência de teste: viewport 412 × 915, `deviceScaleFactor` 3, modo móvel com toque, idioma
pt-BR. A verificação de transbordo horizontal confirma que nenhuma das 48 telas exige rolagem
lateral.

**Imagem por contexto.** Miniatura, cartão de grade e tela de detalhe pedem larguras diferentes
(320, 640 e 1280 px). Servir sempre a maior desperdiça banda de quem tem plano limitado; servir
sempre a menor produz imagem borrada onde a decisão de compra depende do detalhe. O componente de
imagem escolhe a largura conforme o contexto de exibição.

## Experiência do usuário

### Uma ação primária por tela

Cada tela tem uma ação evidente. As demais ficam em hierarquia visual inferior. Em "Meus
anúncios", por exemplo, publicar é primária; editar, pausar e impulsionar são secundárias; excluir
é destrutiva e exige confirmação.

### Formulário em etapas

Cadastro e publicação têm três etapas cada. A divisão reduz a carga cognitiva e permite validar
por etapa — o usuário não descobre no fim que errou no começo. Atende diretamente a Carlos, que
abandona formulário longo.

### Estados sempre visíveis

Carregamento usa esqueleto com a **silhueta real do conteúdo**, não um indicador genérico: a tela
comunica o que está por vir. Vazio, erro e carregamento são centralizados em um único módulo, o
que impede que telas diferentes tratem a mesma situação de formas diferentes.

### Erro com próximo passo

Toda mensagem de erro diz o que fazer: "tente outra foto", "confira o número do cartão". Mensagem
técnica encerra a tentativa de quem tem baixa familiaridade digital — comportamento observado na
persona Dona Marlene.

### Reversibilidade

Exclusão de anúncio e de favorito oferecem desfazer. Todo fluxo em etapas permite voltar. A
liberdade de errar sem consequência é o que permite explorar o aplicativo sem medo.

### Transparência no dinheiro

Valor do material, taxa de serviço e total aparecem discriminados **antes** de confirmar o
pagamento. A surpresa no valor final é o principal motivo de abandono no público representado por
Juliana.

## Tema claro e escuro

Ambos os temas são suportados e **ambos foram auditados** — as 48 telas verificadas são 24 rotas
em duas variantes. Não se trata de inverter cores: cada token tem valor próprio no tema escuro,
resolvido pelo mesmo roteiro de contraste.

## Justificativa das escolhas

| Escolha | Alternativa descartada | Por quê |
|---|---|---|
| Paleta resolvida por cálculo | Ajuste visual das cores | Ajuste a olho não garante conformidade e não é auditável |
| Verde único como cor de ação | Múltiplas cores de destaque | Cor de ação repetida em toda tela ensina o padrão mais rápido |
| Hierarquia por tamanho e peso | Hierarquia por opacidade | Opacidade reduz o contraste real sem aparecer no valor declarado |
| Ícone sempre com texto ou rótulo | Ícone isolado | Ícone sozinho é ambíguo e inacessível a leitor de tela |
| Navegação inferior | Menu lateral | Alcance do polegar em tela de 6 polegadas |
| Formulário em três etapas | Formulário único | Reduz carga cognitiva e permite validar por etapa |
| Imagem por contexto | Resolução única | Equilibra nitidez e consumo de dados |
| Fotos embutidas no projeto | Banco de imagens externo | Imagem externa caduca; uma delas já quebrou uma figura |
