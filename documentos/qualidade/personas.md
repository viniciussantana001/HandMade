# Personas — HandMade 5.0

Documento da fase C1. As personas abaixo foram construídas a partir da pesquisa aplicada do TCC
(87 respondentes da região de Mogi Guaçu, São Paulo, junho de 2026), das entrevistas com dois
gestores de cooperativa de reciclagem e da observação de anúncios reais de sobra de obra em
classificados generalistas.

Cada persona traz o que a literatura de design de interação chama de *elementos acionáveis*: uma
meta primária, o obstáculo concreto que hoje a impede e o critério pelo qual ela julga se o
aplicativo resolveu o problema. Personas sem critério de sucesso não orientam decisão de projeto —
por isso todas terminam com uma frase de aceitação verificável.

---

## Persona 1 — Carlos Mendes, o pedreiro autônomo

| Atributo | Descrição |
| --- | --- |
| Idade | 47 anos |
| Ocupação | Pedreiro autônomo, trabalha com dois ajudantes |
| Escolaridade | Ensino fundamental completo |
| Local | Mogi Guaçu, SP — bairro Santa Cecília |
| Renda mensal | R$ 3.800 (variável, por obra) |
| Dispositivo | Motorola Moto G, Android 13, tela 6,5", plano com 8 GB de dados |
| Perfil fiscal | Pessoa física; nunca emitiu nota fiscal |

### Contexto

Carlos termina em média três reformas por mês. De cada uma sobram tábuas de forma, restos de
tubulação, sacos de cimento fechados e às vezes um lote de tijolos inteiros retirados de demolição.
Hoje ele empilha tudo no fundo do quintal. Quando o espaço acaba, paga R$ 180 para uma caçamba
levar o material — inclusive o que ainda serve.

Ele já tentou vender em um grupo de WhatsApp do bairro. Recebeu quatro mensagens em duas semanas,
três de curiosos e uma de alguém que combinou a retirada e não apareceu.

### Metas

1. Transformar em dinheiro o material que hoje ele paga para descartar.
2. Não perder tempo com quem não vai comprar.
3. Receber o dinheiro sem depender de conversa fora do aplicativo.

### Obstáculos atuais

- **Digitação é penosa.** Carlos escreve devagar e com dificuldade. Formulário longo faz ele desistir.
- **Não confia em quem não conhece.** Já foi enganado em uma venda combinada por telefone.
- **Não sabe precificar.** Não tem referência de quanto vale um lote de tábuas usadas.

### Frustrações com a versão 4.0

- O formulário de anúncio pedia informações em campos livres, sem sugestão de preço.
- A carteira exigia entender depósito, saldo e saque antes de receber o primeiro pagamento —
  três conceitos novos para quem só quer ver o dinheiro na conta.

### O que a versão 5.0 entrega para Carlos

- Publicação por foto: ele escolhe da galeria ou fotografa na hora, e o aplicativo já reduz e
  recorta a imagem sem que ele precise entender resolução.
- Pagamento direto: quando o comprador confirma o recebimento, o valor cai na chave PIX do perfil.
  Não existe saldo para entender nem saque para pedir.
- Recibo com código próprio (`HM-2026-000118`), que ele pode mostrar ao comprador.

### Critério de sucesso

> Carlos publica um lote de tábuas em menos de 3 minutos, usando apenas fotos e campos com opção
> pronta, e entende — sem ajuda de terceiros — quanto vai receber e quando.

---

## Persona 2 — Ana Paula Ferreira, a artesã

| Atributo | Descrição |
| --- | --- |
| Idade | 34 anos |
| Ocupação | Artesã; faz vasos, luminárias e móveis com material reaproveitado |
| Escolaridade | Ensino superior incompleto (Design de Interiores) |
| Local | Mogi Mirim, SP |
| Renda mensal | R$ 2.400, sendo cerca de 70% do artesanato |
| Dispositivo | iPhone 12, iOS 18, usa muito Instagram |
| Perfil fiscal | MEI desde 2024, faturamento anual de R$ 28 mil |

### Contexto

Ana Paula é **compradora** antes de ser vendedora. Ela procura garrafas de vidro, paletes, retalhos
de tecido e restos de madeira nobre. Hoje ela roda três ferros-velhos e dois marceneiros por semana
para achar material — o que consome uma manhã inteira e gasolina.

Ela vende as peças prontas no Instagram e em duas feiras mensais. Ocasionalmente também anuncia
sobra do que compra em excesso.

### Metas

1. Encontrar material específico sem sair de casa.
2. Comparar preço antes de se comprometer.
3. Saber, como MEI, o que precisa declarar sobre o que compra e vende.

### Obstáculos atuais

- **Busca genérica não serve.** "Madeira" traz de tudo; ela precisa filtrar por tipo, estado e distância.
- **Foto ruim inviabiliza a decisão.** Sem ver a peça em detalhe, ela não compra material de acabamento.
- **Dúvida fiscal recorrente.** Ela não sabe se compra de pessoa física gera obrigação e teme extrapolar o limite do MEI.

### Frustrações com a versão 4.0

- As imagens dos anúncios abriam com a mesma resolução da miniatura, o que impedia avaliar textura e defeito.
- Nenhuma orientação tributária: ela precisava consultar o contador para cada dúvida simples.

### O que a versão 5.0 entrega para Ana Paula

- Imagens em resolução adequada a cada contexto: miniatura, cartão da grade e tela de detalhe pedem
  larguras diferentes, e a foto chega nítida em todas.
- Guia de tributos com trilha própria de MEI: limite de R$ 81 mil, DAS mensal, DASN-SIMEI anual e o
  que fazer ao ultrapassar o teto.
- Filtros por categoria, estado de conservação, faixa de preço e distância.

### Critério de sucesso

> Ana Paula localiza um lote de vidro em raio de 40 km, avalia o estado pela foto ampliada e conclui
> a compra sem telefonar para ninguém — e encontra no próprio aplicativo a resposta sobre o DAS.

---

## Persona 3 — Roberto Nakamura, o gestor da construtora

| Atributo | Descrição |
| --- | --- |
| Idade | 52 anos |
| Ocupação | Sócio-administrador de construtora com 24 funcionários |
| Escolaridade | Engenharia Civil, pós em Gestão de Obras |
| Local | Campinas, SP |
| Faturamento da empresa | R$ 4,2 milhões/ano (Simples Nacional, Anexo IV) |
| Dispositivo | iPhone 15 Pro e notebook; delega o operacional |
| Perfil fiscal | Pessoa jurídica, emite NF-e regularmente |

### Contexto

Roberto tem um problema oposto ao de Carlos: volume. Cada obra grande gera caçambas de entulho
separável — restos de aço, sobra de cerâmica, embalagens, madeira de forma já usada duas vezes.
A empresa paga por destinação e precisa comprovar o descarte correto por meio do MTR (Manifesto de
Transporte de Resíduos), exigência da Política Nacional de Resíduos Sólidos.

Vender a sobra é interessante financeiramente, mas irrelevante se der trabalho: o custo do tempo do
engenheiro é maior que o valor de um lote de sobra.

### Metas

1. Reduzir o custo de destinação transformando parte do resíduo em receita.
2. Comprovar a destinação para fins de licenciamento ambiental.
3. Operar em escala, com muitos anúncios simultâneos e sem intervenção manual constante.

### Obstáculos atuais

- **Escala esbarra em limite de anúncios.** Dez anúncios ativos não cobrem o volume de duas obras.
- **Precisa de documento, não só de recibo.** Sem nota e sem MTR, a venda não serve para a auditoria.
- **Taxa de 5% pesa em volume alto.** Em R$ 20 mil mensais, a taxa vira R$ 1.000.

### Frustrações com a versão 4.0

- Não havia diferenciação real de conta jurídica além de um selo.
- Nenhum apoio à obrigação documental (MTR, CFOP, NF-e).

### O que a versão 5.0 entrega para Roberto

- Plano Empresarial: anúncios ilimitados, taxa de 2% e três impulsionamentos mensais — a economia
  de taxa paga a mensalidade a partir de cerca de R$ 3.000 de venda no mês.
- Guia tributário com a trilha de pessoa jurídica: Simples Nacional, DAS, DEFIS, NF-e, CFOP e a
  relação entre a venda de resíduo e o MTR.
- Painel com receita, taxa retida e valor líquido por período, exportável.

### Critério de sucesso

> Roberto publica trinta lotes em uma tarde delegando a operação, acompanha receita e taxa retida em
> uma tela única, e encontra no aplicativo a orientação de qual documento fiscal emitir em cada caso.

---

## Persona 4 — Juliana Costa, a compradora de primeira viagem

| Atributo | Descrição |
| --- | --- |
| Idade | 28 anos |
| Ocupação | Professora de ensino fundamental |
| Escolaridade | Pedagogia |
| Local | Mogi Guaçu, SP |
| Renda mensal | R$ 3.100 |
| Dispositivo | Samsung Galaxy A34, Android 14 |
| Perfil fiscal | Pessoa física, compra ocasional |

### Contexto

Juliana está reformando o quintal do apartamento alugado e precisa de material barato: tijolo para
uma jardineira, pedra para o caminho e alguma madeira para um banco. Ela nunca comprou em
marketplace de material de construção e tem medo específico de pagar e não receber.

Ela também precisa de material para projetos escolares — garrafas PET, tampinhas, papelão — e é o
tipo de usuária que uma doação atende melhor que uma venda.

### Metas

1. Comprar barato sem correr risco de golpe.
2. Entender exatamente quanto vai pagar, incluindo entrega.
3. Ter para onde recorrer se o material não chegar.

### Obstáculos atuais

- **Desconfiança de pagamento antecipado.** É a primeira barreira e a mais forte.
- **Não sabe avaliar quantidade.** "5 m³ de pedra" não significa nada para ela.
- **Precisa de clareza total no valor final.** Surpresa no checkout faz ela abandonar.

### Frustrações com a versão 4.0

- A compra passava por um diálogo que debitava a carteira: ela precisava depositar dinheiro na
  plataforma antes de comprar, o que aumentava exatamente o medo que já tinha.
- O botão de comprar levava a uma tela branca quando algo dava errado, sem explicação.

### O que a versão 5.0 entrega para Juliana

- Pagamento direto em três passos visíveis (método → confirmação → recibo), com o valor final e a
  taxa discriminados antes de confirmar.
- Nenhum depósito prévio: ela paga o pedido, não a plataforma.
- Recibo com código de autorização e caminho explícito para abrir disputa.
- Filtro de doações, para o material escolar que ela busca de graça.

### Critério de sucesso

> Juliana conclui a primeira compra por PIX sem pedir ajuda, sabe o valor exato antes de confirmar e
> localiza em um toque o que fazer se o material não chegar.

---

## Persona 5 — Dona Marlene Aparecida, a catadora cooperada

| Atributo | Descrição |
| --- | --- |
| Idade | 58 anos |
| Ocupação | Catadora, cooperada em associação de reciclagem |
| Escolaridade | Ensino fundamental incompleto |
| Local | Mogi Guaçu, SP — região do Jardim Ypê |
| Renda mensal | R$ 1.650 (rateio da cooperativa) |
| Dispositivo | Samsung Galaxy A03 (entrada), Android 12, plano pré-pago |
| Perfil fiscal | Pessoa física; a cooperativa centraliza a parte fiscal |

### Contexto

Dona Marlene representa o usuário de fronteira: baixa familiaridade digital, aparelho de entrada,
internet intermitente e leitura pausada. Ela é incluída deliberadamente porque um marketplace de
material reaproveitado que não a atende falha justamente com quem mais depende dele.

A cooperativa hoje vende para atravessadores a preço imposto. Anunciar direto significa margem
maior, mas exige que alguém consiga operar o aplicativo.

### Metas

1. Vender direto, sem atravessador.
2. Conseguir usar o aplicativo sozinha, sem depender do neto.
3. Ter certeza de que o dinheiro chegou.

### Obstáculos atuais

- **Texto pequeno e contraste baixo** tornam a leitura difícil.
- **Aparelho lento**: telas pesadas travam ou demoram.
- **Erro sem explicação a paralisa.** Uma mensagem técnica encerra a tentativa.

### Frustrações com a versão 4.0

- Toques em área pequena erravam o alvo com frequência.
- Depois de encerrar a sessão, o aplicativo abria em branco — e ela não tinha como saber que era
  preciso recarregar a página.

### O que a versão 5.0 entrega para Dona Marlene

- Alvos de toque de no mínimo 24 × 24 px CSS, o mínimo exigido pelo critério 2.5.8 da WCAG 2.2 no
  nível AA; a barra de navegação inferior usa 44 px de altura, alinhada ao critério 2.5.5 (nível
  AAA), por ser o controle de uso mais frequente. Tipografia com escala legível e contraste
  conforme WCAG 2.2 AA.
- Estados de carregamento com esqueleto: a tela mostra que está trabalhando em vez de ficar branca.
- Mensagens de erro em linguagem comum, sempre com o próximo passo ("tente outra foto", "confira o
  número do cartão").
- Encerramento de sessão que leva direto ao login, sem tela branca (correção do bug B1).

### Critério de sucesso

> Dona Marlene publica um anúncio e encerra a sessão sem encontrar nenhuma tela em branco, nenhum
> texto ilegível e nenhuma mensagem que ela não consiga interpretar.

---

## Matriz de cobertura

A tabela relaciona cada persona às decisões de projeto da versão 5.0, para evidenciar que nenhuma
persona ficou sem contrapartida no produto.

| Decisão da versão 5.0 | Carlos | Ana Paula | Roberto | Juliana | Marlene |
| --- | :-: | :-: | :-: | :-: | :-: |
| B1 — fim da tela branca ao sair | ● | ○ | ○ | ○ | ● |
| B2 — impulsionamento sem tela branca | ● | ○ | ● | — | ○ |
| B3 — pagamento direto, sem carteira | ● | ● | ● | ● | ● |
| U1 — painel do vendedor redesenhado | ○ | ○ | ● | — | ○ |
| U2 — qualidade de imagem por contexto | ○ | ● | ○ | ● | ○ |
| U3 — foto pela galeria e pela câmera | ● | ● | ○ | — | ● |
| U4 — validação, estados e desfazer | ○ | ○ | ○ | ● | ● |
| L1 — termos, privacidade e LGPD | ○ | ○ | ● | ● | ○ |
| L2 — guia de tributos PF/PJ | ○ | ● | ● | — | ○ |
| Acessibilidade (alvo, contraste, leitor) | ○ | — | — | ○ | ● |

● impacto direto e determinante ○ impacto indireto — não se aplica

## Antipersona

**Quem o HandMade deliberadamente não atende:** o comprador que procura material novo com garantia
de fábrica e entrega em 24 horas. Atender esse perfil exigiria estoque próprio, logística e política
de troca — o oposto do modelo de intermediação entre partes que geram e partes que precisam de
material reaproveitado. Declarar a antipersona evita que decisões futuras diluam o propósito do
produto.
