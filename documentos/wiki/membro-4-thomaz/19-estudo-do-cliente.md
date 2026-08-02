# 5.1 Estudo do cliente

**Responsável:** Thomaz de Moraes Teixeira

Esta página descreve quem são os clientes do HandMade, o que esperam e como a plataforma pretende
se relacionar com cada perfil. As representações acionáveis desses perfis estão em
[Personas](13-personas); aqui o recorte é de relacionamento e retenção.

## Uma característica que define o modelo

No HandMade, **o mesmo cliente ocupa os dois lados do mercado**. A artesã compra material e vende
o excedente do que compra; o pedreiro vende sobra e compra ferramenta usada. Isso tem duas
consequências diretas:

1. **Não existem duas bases separadas** para captar e reter. Quem entra por um lado tende a
   experimentar o outro, o que reduz o custo de aquisição efetivo.
2. **A confiança precisa funcionar nas duas direções.** Quem vendeu bem e recebeu volta a
   anunciar; quem comprou e recebeu volta a comprar. Uma experiência ruim contamina os dois papéis.

## Quem são os clientes

| Perfil | Papel predominante | Faixa de gasto ou receita típica | Necessidade central |
|---|---|---|---|
| Autônomo da construção | Vende | Lotes de R$ 100 a R$ 800 | Converter sobra em receita sem burocracia |
| Artesão e pequeno empreendedor | Compra e vende | R$ 150 a R$ 600 por compra | Encontrar material específico e barato |
| Construtora e indústria | Vende em volume | Lotes acima de R$ 1.000 | Reduzir custo de destinação e comprovar descarte |
| Cooperativa e catador | Vende | R$ 200 a R$ 1.500 por lote | Vender direto, sem atravessador |
| Consumidor em reforma | Compra | R$ 80 a R$ 500 | Material barato com segurança na compra |

O ticket médio adotado no plano de negócio é de **R$ 420,00**, com origem declarada em
[Levantamento de requisitos](07-levantamento-de-requisitos).

## O que esses clientes valorizam

**Preço com referência.** Não basta ser barato: o cliente precisa saber que é barato. A
comparação com anúncios semelhantes da mesma categoria cumpre esse papel.

**Proximidade.** Material de reaproveitamento é pesado e de baixo valor por quilo. Um lote a 80 km
raramente compensa — razão do filtro por distância e do recorte regional descrito em
[Microrregião e macrorregião](09-microrregiao-e-macrorregiao).

**Foto que permita decidir.** Quem compra material de acabamento precisa ver textura e defeito.
Foto insuficiente inviabiliza a compra, e é por isso que a imagem é servida em três larguras
conforme o contexto.

**Previsibilidade no dinheiro.** Saber o valor final antes de confirmar e saber quando vai
receber. Surpresa no valor é o principal motivo de abandono.

## Onde estão hoje

| Canal atual | Papel |
|---|---|
| Grupos de mensagens de bairro | Onde a oferta informal circula hoje |
| Ferros-velhos e depósitos | Onde a sucata é vendida por peso |
| Feiras de artesanato | Onde os compradores de material reaproveitado se encontram |
| Lojas de material de construção | Onde compram quando não encontram reaproveitado |
| Cooperativas de reciclagem | Onde catadores se organizam |
| Classificados generalistas | Onde tentam anunciar, com baixo retorno |

Esses canais são simultaneamente a concorrência (ver [Concorrentes](08-concorrentes)) e o ponto de
captação: é onde a divulgação inicial precisa acontecer.

## Classificação dos clientes

### Cliente interno

Os quatro integrantes da equipe e, em operação real, quem prestar atendimento e mediação. São
clientes internos porque dependem do funcionamento do sistema para trabalhar.

**Como tratar:** documentação que permita operar sem depender de uma única pessoa, e ferramentas de
verificação reexecutáveis — o que já existe em `documentos/qualidade/ferramentas/`.

### Cliente externo

Todos os usuários da plataforma: vendedores, compradores, empresas e cooperativas.

**Como tratar:** interface que funcione para quem tem pouca familiaridade digital, valor
transparente e canal de ajuda acessível de qualquer tela.

### Cliente ativo

Quem publicou, comprou ou conversou nos últimos 30 dias.

**Como tratar:** o painel do vendedor mostra desempenho para reforçar a percepção de resultado;
notificações informam movimentação relevante. Para este perfil, o objetivo é aumentar a frequência
— mais anúncios ativos por vendedor.

### Cliente inativo

Sem atividade há mais de 60 dias, ou com anúncio vencido sem renovação.

**Como tratar:** lembrete de anúncio parado com sugestão de reativar ou impulsionar. Em operação
real, comunicação por e-mail com material novo na categoria de interesse. O indicador a acompanhar
é o cancelamento de assinatura, projetado em 6% ao mês.

### Cliente satisfeito

Concluiu negociação, avaliou positivamente e voltou.

**Como tratar:** é a base do programa de indicação. Também é a fonte de prova social — reputação
visível no anúncio ajuda a converter quem chega desconfiado.

### Cliente insatisfeito

Abriu disputa, avaliou negativamente ou abandonou o fluxo.

**Como tratar:** a plataforma registra disputa como estado próprio do pedido, com histórico. O
tratamento previsto é resposta em prazo definido, mediação e estorno pelo mesmo método de pagamento
quando cabível. **Cliente insatisfeito atendido rápido volta; ignorado, reclama publicamente** — e
em plataforma de nicho, reputação regional é o ativo mais frágil.

## Estratégias de relacionamento

### Fidelização

- Planos com taxa reduzida: quanto mais se vende, mais compensa assinar.
- Reputação acumulada — histórico de avaliações é um ativo que o usuário perde ao migrar.
- Painel com resultado visível, que reforça a percepção de retorno.

### Retenção

- Notificação de movimentação relevante, sem excesso.
- Renovação simples de anúncio vencido.
- Impulsionamento avulso, para quem não quer assinatura.

### Recuperação

- Lembrete de anúncio parado, com sugestão de ação.
- Contato após disputa resolvida, para reverter a experiência negativa.
- Reativação de conta preservando o histórico de reputação.

### Programa de indicação

Previsto para a operação real: quem indica e quem é indicado recebem um impulsionamento gratuito
após a primeira negociação concluída. A condição de conclusão evita cadastro sem uso.

### Promoções

- Primeira publicação sempre gratuita.
- Primeiro mês de assinatura com desconto no lançamento regional.
- Destaque gratuito para cooperativas parceiras na entrada.

### Pesquisa de satisfação

Instrumentos definidos em [Testes e qualidade](18-testes-e-qualidade): escala SUS ao fim da
sessão, item único de esforço percebido por tarefa e item específico de confiança no pagamento —
este último medindo a barreira central do público que compra pela primeira vez.

**Situação:** protocolo pronto, **não executado**. Não há pesquisa de satisfação aplicada, porque
não há base de usuários reais.

### Atendimento

Central de ajuda e página "Como funciona" disponíveis no protótipo. Em operação real, o
atendimento está orçado em R$ 1.400/mês (meio período), incluindo análise de denúncias e mediação
de disputas — valor que consta no [Estudo de viabilidade](06-estudo-de-viabilidade).

Prazos de resposta previstos por plano: FAQ no gratuito, 48 h no Pro e 4 h no Empresarial.

### Coleta de feedback

- Avaliação mútua após cada negociação.
- Denúncia de anúncio irregular.
- Abertura de disputa como sinal de problema no fluxo.

### Melhoria contínua

O processo já praticado no desenvolvimento: cada versão do protótipo partiu de defeitos concretos
observados na anterior. A versão 5.0 corrigiu tela branca ao encerrar sessão, tela branca após
impulsionar, e substituiu a carteira por pagamento direto — cada correção derivada de um problema
identificado, não de preferência.

Detalhes em [Prototipagem](10-prototipagem).

---

**Limite declarado.** As faixas de gasto e os canais descritos vêm da pesquisa aplicada e da
observação de anúncios reais, cujas evidências primárias ainda não foram arquivadas no repositório
— ver [Levantamento de requisitos](07-levantamento-de-requisitos). As estratégias de fidelização,
indicação e promoção são **planejadas**: não há operação real, portanto nenhuma delas foi testada
com clientes.
