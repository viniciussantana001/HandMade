# 4.5 Fluxo de interação de dados

**Responsável:** Thomaz de Moraes Teixeira

Esta página mostra como a informação percorre o sistema: quais entidades existem, como se
relacionam e o que acontece em cada etapa dos fluxos principais.

Os diagramas estão em `documentos/diagramas/`, em **SVG editável** (abre no navegador, no Figma e
no Inkscape, com o texto ainda editável) e em PNG para inclusão em documento.

Para exibir na Wiki, use o endereço completo:
`https://raw.githubusercontent.com/<organizacao>/<repositorio>/main/documentos/diagramas/<arquivo>`

---

## 1. Diagrama de casos de uso

**Arquivos:** `fig-24-casos-de-uso.svg` · `fig-24-casos-de-uso.png`

Três atores, com herança entre dois deles:

| Ator | O que pode fazer |
|---|---|
| **Usuário Comprador** | Cadastrar-se, buscar materiais, visualizar anúncios, favoritar, iniciar conversa, fazer proposta, comprar, avaliar e gerenciar o próprio perfil |
| **Vendedor / Empresa** | **Estende o comprador** — herda tudo acima e acrescenta publicar, editar, pausar, reativar e excluir anúncios, gerenciar pedidos recebidos, acompanhar pagamentos, assinar plano, impulsionar anúncio e consultar o painel |
| **Administrador** | Moderar anúncios, usuários e denúncias; gerenciar categorias |

A relação de extensão entre comprador e vendedor é a decisão de modelagem mais importante do
diagrama: **não existem duas contas separadas**. Quem vende também compra, e o perfil de vendedor
é um acréscimo de capacidades sobre o de comprador — o que reflete o comportamento real do
público, em que a artesã compra material e revende o excedente.

---

## 2. Diagrama de classes

**Arquivos:** `fig-25-classes.svg` · `fig-25-classes.png`

Onze classes de domínio, com estereótipo de entidade, atributos e métodos:

| Classe | Papel |
|---|---|
| `Usuario` | Pessoa física ou jurídica, com plano e perfil fiscal |
| `Anuncio` | Material ofertado, com fotos, categoria, condição e preço |
| `Categoria` | Classificação do material (9 categorias) |
| `Conversa` | Diálogo entre duas pessoas sobre um anúncio |
| `Mensagem` | Item de uma conversa |
| `Pedido` | Negociação em andamento, com histórico de estados |
| `Pagamento` | Quitação de um pedido, por PIX, cartão ou boleto |
| `Avaliacao` | Nota e comentário após a conclusão |
| `Favorito` | Vínculo entre usuário e anúncio |
| `Notificacao` | Aviso interno ao usuário |
| `Denuncia` | Registro de anúncio irregular |
| `Impulsionamento` | Compra de destaque por período |
| `Consentimento` | Aceite de termos, com data e versão (LGPD art. 8º) |

**Enumerações:** `TipoUsuario` (individual, empresa, admin), `StatusAnuncio` (rascunho, ativo,
pausado, vendido, removido), `StatusPedido` (oito valores) e `MetodoPagamento` (PIX, cartão,
boleto).

### Cardinalidades principais

```
Usuario  1 ──── 0..* Anuncio          um usuário publica vários anúncios
Anuncio  * ──── 1    Categoria        cada anúncio tem uma categoria
Conversa 1 ──── 1..* Mensagem         uma conversa contém mensagens
Pedido   1 ──── 1    Pagamento        pagamento direto: um pedido, um pagamento
Pedido   1 ──── 0..2 Avaliacao        cada lado avalia o outro, no máximo
Usuario  * ──── *    Anuncio          favoritos, relação muitos-para-muitos
Anuncio  1 ──── 0..* Impulsionamento  um anúncio pode ser impulsionado várias vezes
```

A relação **1:1 entre pedido e pagamento** é a tradução gráfica da decisão de pagamento direto:
não há saldo intermediário, cada pedido é quitado por um pagamento próprio.

---

## 3. Diagrama entidade-relacionamento

**Arquivos:** `fig-26-der.svg` · `fig-26-der.png`

Treze entidades, em notação pé de galinha: `USUARIO`, `ANUNCIO`, `CATEGORIA`, `CONVERSA`,
`MENSAGEM`, `PEDIDO`, `PAGAMENTO`, `AVALIACAO`, `FAVORITO`, `NOTIFICACAO`, `DENUNCIA`,
`IMPULSIONAMENTO` e `CONSENTIMENTO`.

Chaves primárias marcadas com ícone de chave; estrangeiras com o sufixo `_FK`. `FAVORITO` é tabela
de relacionamento N:N entre `USUARIO` e `ANUNCIO`.

**Por que um DER se o banco será NoSQL.** O Firestore não exige tabela de junção nem esquema
fixo. A modelagem relacional foi mantida porque explicita as relações lógicas que precisam ser
preservadas — e é ela que orienta a decisão de quando usar subcoleção, quando referenciar por
identificador e onde desnormalizar. Sem esse mapa, a estrutura documental vira improviso.

### Correspondência com o protótipo

As 13 coleções do `localStorage` (prefixo `hm_v5_`) correspondem às entidades do DER e antecipam
as coleções do Firestore:

`listings` · `orders` · `payments` · `boosts` · `messages` · `notifications` · `reviews` ·
`favorites` · `disputes` · `reports` · `users` · `audit_logs` · `consents`

**Mudança em relação à versão 4.0.** As coleções `transactions` e `withdrawals` — saldo e saque —
foram removidas e substituídas por `payments`. Entraram `boosts` e `consents`. A remoção da
Carteira não foi só de tela: mudou o modelo de dados, e os três diagramas foram regerados para
refletir isso.

---

## 4. Fluxo de publicação de anúncio

```
[Vendedor autenticado]
   ↓
Etapa 1 — Fotos
   • seleciona da galeria ou fotografa (até 8)
   • cada imagem é redimensionada em três larguras
   ↓ validação: ao menos uma foto
Etapa 2 — Dados do material
   • categoria, condição, tipo de negociação, descrição, quantidade, unidade
   ↓ validação: campos obrigatórios preenchidos
Etapa 3 — Preço e entrega
   • valor ou "aceito propostas", localização, formas de entrega
   • pré-visualização em tempo real
   ↓
[Gravação] cria registro em `listings` com status ATIVO
   ↓
[Notificação] a store avisa os assinantes
   ↓
O anúncio aparece no marketplace e em "Meus anúncios", sem recarregar a página
```

**Ponto crítico.** A validação ocorre **por etapa**, não no envio final. O usuário não descobre no
terceiro passo que errou no primeiro — decisão derivada da persona Carlos, que abandona formulário
longo.

---

## 5. Fluxo de compra e pagamento

```
[Comprador] abre o anúncio → "Comprar"
   ↓
[Pedido] criado com status AGUARDANDO_PAGAMENTO
   ↓
Passo 1 — Método
   • PIX (imediato) · Cartão (até 12x) · Boleto (3 dias úteis)
   ↓
Passo 2 — Confirmação
   • valor do material + taxa de serviço + total, discriminados
   ↓ [usuário confirma]
Passo 3 — Processamento
   • cálculo da taxa conforme o plano do vendedor
   • geração do artefato do método (código PIX, linha do boleto)
   • gravação em `payments` + registro em `audit_logs`
   ↓
   ├── PIX ou cartão aprovado → Pedido = PAGO
   ├── Boleto → Pagamento = PENDENTE, Pedido = AGUARDANDO_PAGAMENTO
   └── Cartão recusado → Pagamento = RECUSADO, pedido inalterado
   ↓
[Recibo] código HM-AAAA-NNNNNN + código de autorização
```

Depois do pagamento, o pedido percorre: `PAGO → ENVIADO → ENTREGUE → CONCLUIDO`, com
`EM_DISPUTA`, `ESTORNADO` e `CANCELADO` como desvios possíveis. Cada transição grava data e
situação no histórico do pedido.

**Regra de negócio.** A taxa varia conforme o plano do vendedor: 5% no gratuito, 3% no Pro e 2% no
Empresarial. É descontada no momento da venda — não existe saldo, depósito nem saque.

---

## 6. Fluxo de dados no protótipo

```
Componente React
   ↓ lê
useStoreVersion()  ─── assina ───► store observável
   ↓                                    │
Coleção (listings, orders, …)           │ notifica
   ↓ persiste                           │
localStorage (prefixo hm_v5_) ──────────┘
```

Toda escrita em qualquer coleção incrementa uma versão e notifica os assinantes. A interface
reage à mudança sem recarregar a página.

**Por que isso importa.** Na versão 4.0, pausar um anúncio exigia recarregar a página para ver o
efeito, e havia chamadas explícitas de recarregamento no código. Hoje não existe nenhuma: a lista
se atualiza sozinha ao pausar, reativar ou excluir. O mesmo mecanismo corrige a tela branca após
encerrar a sessão.

## 7. Fluxo de dados planejado — Flutter + Firebase

```
Aplicativo Flutter (BLoC)
   ↓
Firebase Authentication  ── identidade e sessão
   ↓
Cloud Firestore  ── coleções, com regras de segurança por documento
   ↓
Firebase Storage  ── fotos dos anúncios
   ↓
Cloud Functions  ── notificação, cálculo de reputação, limpeza de imagem,
                    validação crítica, exclusão e portabilidade de dados
   ↓
Firebase Cloud Messaging  ── notificação push
```

**O que muda em relação ao protótipo.** A validação deixa de ser apenas do lado do cliente: as
regras do Firestore controlam o acesso por documento — só o dono edita o próprio anúncio — e as
Cloud Functions executam o que não pode ficar no dispositivo. Essa camada **não existe** no
protótipo, e é por isso que ele não é seguro para dados reais.

---

## Verificação da modelagem contra o código

Os diagramas foram conferidos contra o protótipo, não desenhados a partir da intenção. A revisão
encontrou e corrigiu:

| Defeito encontrado | Correção |
|---|---|
| Enumeração de status do pedido com 5 valores | O tipo real tem 8 — corrigido no diagrama e no texto |
| Classe `Pagamento` ausente no diagrama de classes | Acrescentada, com a enumeração de método |
| Relação pedido → pagamento ausente no DER | Acrescentada, com cardinalidade 1:1 |
| Tabela `PAGAMENTO` ausente no DER | Acrescentada |
| Documento declarava 9 coleções | O código tem 13 — corrigido |
| Caso de uso "Acessar carteira" | Removido: a Carteira não existe na versão 5.0 |

Divergência entre diagrama e código é defeito de documentação, e foi tratada como tal.
