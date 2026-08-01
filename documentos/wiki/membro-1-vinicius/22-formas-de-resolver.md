# 1.6 Formas de resolver o problema

*Seção sob responsabilidade de Vinicius Santana dos Santos.*

O [problema encontrado](04-problema-encontrado) é a ausência de um canal específico, seguro e
organizado para redistribuir materiais excedentes. Esta página apresenta as alternativas
consideradas, a escolha feita e a justificativa.

## Alternativas avaliadas

| Alternativa | Como funcionaria | Por que foi descartada |
|---|---|---|
| Grupos de mensagens por bairro | Anúncio em grupo de WhatsApp ou Telegram | Sem busca, sem filtro, sem histórico e sem reputação. A oferta se perde na conversa e não há registro da negociação |
| Anunciar em plataforma generalista | Usar categorias existentes de OLX ou Mercado Livre | Sem categoria dedicada a resíduo, sem filtro por tipo de material, sem contexto de reaproveitamento. O anúncio compete com milhares de itens não relacionados |
| Site institucional com formulário | Página com catálogo e formulário de contato | Não resolve a descoberta: quem procura não chega ao site. Sem negociação, sem pagamento e sem reputação |
| Sistema desktop para empresas | Software de gestão de resíduo instalado | Exclui o público principal — pedreiro, artesão e catadora usam celular, não computador de mesa |
| **Aplicativo mobile especializado** | **Marketplace de nicho com busca, chat, pagamento e reputação** | **Escolhida** |

## Solução escolhida

Um **aplicativo mobile marketplace especializado em materiais reutilizáveis**, com cinco
decisões estruturais:

### 1. Mobile antes de tudo

O material é fotografado onde está: no canteiro, no galpão, no quintal. Quem anuncia tem o
celular na mão e não vai transferir foto para um computador para publicar. Toda a interface parte
da largura de 412 px e a navegação principal fica na base da tela, ao alcance do polegar.

### 2. Especialização em vez de amplitude

Nove categorias de material (madeira, pedras, metais, elétrico, plástico, vidro, eletrônico,
construção e outros), com filtro por estado de conservação, tipo de negociação, faixa de preço e
distância. O vocabulário é o do canteiro de obra — "sobra", "lote", "retirada no local" — e não
o de comércio eletrônico genérico.

### 3. Três modalidades de negociação

Venda, **doação** e **troca**. A doação não é um detalhe: parte do material excedente não tem
valor de revenda suficiente para justificar uma venda, mas resolve o problema de quem precisa
dele. Sem essa modalidade, o material continuaria no aterro.

### 4. Pagamento direto, sem saldo na plataforma

O comprador paga o vendedor pelo método escolhido — PIX, cartão ou boleto —, a taxa de serviço é
descontada no ato conforme o plano, e o fluxo termina em recibo com código de autorização. Não
existe saldo, depósito nem saque.

A decisão vem de uma barreira concreta: exigir que o usuário deposite dinheiro na plataforma
antes de comprar aumenta exatamente a desconfiança que o produto precisa vencer. O fluxo tem três
passos visíveis — **método → confirmação → recibo**.

### 5. Segurança pela reputação e pela moderação

Chat vinculado ao anúncio, avaliação após a negociação, denúncia de anúncio, moderação
administrativa e trilha de auditoria. A confiança é construída por histórico verificável, não por
promessa.

## Como cada dor é atendida

| Dor identificada | Recurso da solução |
|---|---|
| Não sei onde ofertar minha sobra | Publicação em três etapas, com foto tirada na hora |
| Não encontro o material que preciso | Busca com filtro por categoria, estado, preço e distância |
| Tenho medo de pagar e não receber | Pagamento direto com recibo, código de autorização e caminho de disputa |
| Não sei se posso confiar no outro lado | Reputação, avaliação, denúncia e moderação |
| Perco tempo com curioso que não compra | Chat vinculado ao anúncio e proposta registrada |
| Não sei quanto vale o que estou vendendo | Comparação com anúncios semelhantes na categoria |
| Não sei o que preciso declarar | Guia de tributos com trilha de pessoa física e jurídica |
| Preciso comprovar destinação do resíduo | Histórico de negociação com recibo por transação |

## Escopo declarado

O que a solução **não** faz, por decisão de projeto:

- Não mantém estoque próprio nem faz logística — a entrega é combinada entre as partes.
- Não garante qualidade do material: a responsabilidade pela descrição é do anunciante.
- Não atende quem busca material novo com garantia de fábrica e entrega em 24 horas. Esse
  perfil está declarado como antipersona em [Personas](13-personas).

Declarar o escopo evita que decisões futuras diluam o propósito do produto.

## Situação atual da solução

| Camada | Situação |
|---|---|
| Experiência e fluxos | Validada no protótipo 5.0 — 55 telas, 272 interações |
| Modelagem de dados | Definida — casos de uso, classes e DER |
| Regras de negócio | Especificadas e cobertas por 94 testes automatizados |
| Interface | Concluída e auditada em acessibilidade (48 telas, 0 problema) |
| Implementação nativa Flutter + Firebase | **Não iniciada** — etapa seguinte |

O protótipo demonstra que a solução é **navegável e coerente**. A construção do aplicativo
publicado é a etapa seguinte, com a vantagem de partir de um alvo já validado.
