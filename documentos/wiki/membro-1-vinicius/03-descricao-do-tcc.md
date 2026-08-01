# 1.3 Breve descrição do TCC

*Seção sob responsabilidade de Vinicius Santana dos Santos.*

## O que é o projeto

O HandMade é um aplicativo de marketplace para dispositivos móveis dedicado a **materiais
reutilizáveis e excedentes**. Não é uma loja: a plataforma não tem estoque próprio. Ela
intermedeia negociações entre quem oferece material e quem procura material, oferecendo as
ferramentas necessárias para que essa negociação aconteça com segurança — anúncio estruturado,
busca com filtros, chat, pagamento, rastreamento de pedido e reputação.

A especialização temática é o eixo do projeto. Existem plataformas genéricas de compra e venda
com muito mais alcance; nenhuma delas trata materiais de reaproveitamento como categoria de
primeira classe, com os filtros, o vocabulário e as garantias que esse tipo de negociação exige.

## Qual necessidade ele atende

Três necessidades distintas, uma por perfil de usuário:

**Quem gera excedente** precisa de um destino melhor que a caçamba. Uma construtora paga pela
destinação do entulho separável; um pedreiro autônomo paga pela retirada de material que ainda
serve. Transformar parte disso em receita, sem esforço operacional relevante, é a necessidade.

**Quem consome material reaproveitado** precisa encontrar o item específico sem percorrer
fisicamente ferros-velhos, marcenarias e marmorarias. Artesãos e pequenos empreendedores gastam
tempo e combustível nessa busca, e ainda assim compram matéria-prima nova mais caro quando não
encontram.

**Quem compra pela primeira vez** precisa confiar. O medo de pagar e não receber é a barreira
central desse público, e ela precisa ser tratada pelo produto — não por promessa, mas por fluxo
de pagamento transparente, rastreamento e caminho explícito para disputa.

O dimensionamento dessas necessidades, com dados da pesquisa de campo, está em
[Problema encontrado](04-problema-encontrado).

## Qual será seu funcionamento

### Cadastro e acesso

Cadastro em três etapas, com trilhas separadas para pessoa física (nome, CPF, data de
nascimento) e pessoa jurídica (CNPJ, razão social, segmento, responsável pela conta). Validação
de CPF e CNPJ com dígito verificador, indicador de força de senha e registro do aceite dos
termos com data e versão.

### Publicação de anúncio

Também em três etapas, para reduzir erro de preenchimento:

1. **Fotos** — até 8 imagens, da galeria ou da câmera, com pré-visualização.
2. **Material** — categoria, condição, tipo de negociação (venda, doação ou troca), descrição,
   quantidade e unidade.
3. **Preço e entrega** — valor ou "aceito propostas", localização e formas de retirada ou envio,
   com pré-visualização do anúncio em tempo real.

### Busca e negociação

Busca por texto com sugestões, combinada a filtros de categoria, condição, faixa de preço e
distância. O anúncio aberto mostra galeria de fotos, dados do material, perfil e reputação do
vendedor, e as ações disponíveis: conversar, favoritar, fazer proposta ou comprar.

### Pagamento

Pagamento direto entre comprador e vendedor, em três passos visíveis: **escolha do método →
confirmação → recibo**. Os métodos são PIX (aprovação imediata), cartão de crédito (em até 12
parcelas) e boleto bancário (com compensação em até 3 dias úteis).

Não existe saldo, depósito ou saque na plataforma. A taxa de serviço é descontada no momento da
venda, conforme o plano do vendedor, e o recibo traz código próprio e código de autorização.

### Acompanhamento

O pedido percorre estados rastreáveis — aguardando pagamento, pago, enviado, entregue,
concluído, em disputa, estornado ou cancelado — com histórico de cada transição. Ao final, as
duas partes se avaliam, alimentando a reputação exibida nos anúncios.

### Gestão para quem vende

Painel com visualizações, contatos recebidos, anúncios ativos e valor recebido; gestão de
anúncios com pausa, reativação, edição e exclusão; histórico de pagamentos; planos de assinatura;
impulsionamento de anúncio; e guia de orientação tributária conforme o perfil fiscal declarado.

## Qual será o público-alvo

| Perfil | Papel predominante | Necessidade central |
|---|---|---|
| Pedreiros, marceneiros e autônomos da construção | Vende | Transformar sobra em receita sem burocracia |
| Artesãos e pequenos empreendedores | Compra e vende | Encontrar matéria-prima específica e barata |
| Construtoras e indústrias | Vende em volume | Reduzir custo de destinação e comprovar descarte |
| Cooperativas de reciclagem e catadores | Vende | Vender direto, sem atravessador |
| Consumidor final em reforma | Compra | Material barato, com segurança na compra |
| Administração da plataforma | Modera | Anúncios, denúncias, usuários e categorias |

O aprofundamento de cada perfil, com hábitos, faixa de gasto e estratégias de relacionamento,
está em [Estudo do cliente](19-estudo-do-cliente). As representações acionáveis desses perfis
estão em [Personas](13-personas).

## Quais benefícios serão oferecidos

**Econômicos.** Receita nova para quem antes pagava para descartar; matéria-prima mais barata
para quem produz; redução do custo de destinação para empresas; e geração de renda para
catadores e cooperativas que hoje vendem a preço imposto por intermediários.

**Ambientais.** Material desviado do aterro e devolvido ao ciclo produtivo. A plataforma atua
especificamente na etapa de **reutilização** da hierarquia estabelecida pela Política Nacional
de Resíduos Sólidos (BRASIL, 2010) — a etapa que hoje tem menos canais práticos disponíveis.

**Operacionais.** Concentração em um único lugar de busca, negociação, pagamento e
acompanhamento, substituindo a combinação informal de grupos de mensagem, telefonemas e
deslocamento físico.

**De segurança.** Identificação dos participantes, reputação construída por avaliação mútua,
histórico de pedidos, canais de denúncia e moderação especializada — elementos ausentes na
negociação informal que hoje predomina.

## Tipo de sistema e justificativa da escolha mobile

O HandMade será um **aplicativo mobile para Android e iOS**. A escolha não é estética: o fluxo de
trabalho do usuário é móvel por natureza. O vendedor fotografa o material onde ele está — no
canteiro, no fundo do quintal, na marcenaria —, informa a localização a partir do próprio
aparelho e responde mensagens ao longo do dia. Exigir um computador para publicar um anúncio
eliminaria a maior parte do público-alvo.

Para a demonstração acadêmica, o grupo construiu um protótipo web **mobile-first** que reproduz
essa experiência em alta fidelidade. É um instrumento de validação, não o produto: o aplicativo
final está planejado em Flutter com Firebase, conforme detalhado em
[Estudo de viabilidade](06-estudo-de-viabilidade).
