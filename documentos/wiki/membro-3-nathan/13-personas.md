# 4.4 Personas

**Responsável:** Nathan Costa Batista

Cinco personas representam os perfis de usuário do HandMade. Elas foram construídas a partir da
pesquisa aplicada, das entrevistas com gestores de cooperativa e da observação de anúncios reais
de sobra de obra em classificados generalistas — situação das evidências declarada em
[Levantamento de requisitos](07-levantamento-de-requisitos).

Cada persona termina com um **critério de sucesso verificável**. Persona sem critério de sucesso
não orienta decisão de projeto: vira descrição literária. O documento completo está em
`documentos/qualidade/personas.md`.

---

## Persona 1 — Carlos Mendes, o pedreiro autônomo

| Atributo | Descrição |
|---|---|
| Idade | 47 anos |
| Profissão | Pedreiro autônomo, trabalha com dois ajudantes |
| Escolaridade | Ensino fundamental completo |
| Local | Mogi Guaçu, SP |
| Renda | R$ 3.800/mês, variável por obra |
| Dispositivo | Motorola Moto G, Android 13, plano com 8 GB |
| Conhecimento tecnológico | Baixo — usa WhatsApp e câmera; digita devagar |

**Contexto.** Termina três reformas por mês. De cada uma sobram tábuas de forma, restos de
tubulação, sacos de cimento fechados e às vezes tijolo de demolição. Empilha tudo no quintal e,
quando o espaço acaba, paga R$ 180 por uma caçamba que leva inclusive o que ainda serve.

**Objetivos.** Transformar em dinheiro o que hoje paga para descartar; não perder tempo com quem
não vai comprar; receber sem depender de conversa fora do aplicativo.

**Dificuldades.** Digitação é penosa — formulário longo faz desistir. Não confia em desconhecido,
já foi enganado em venda por telefone. Não sabe precificar: não tem referência de quanto vale um
lote de tábuas usadas.

**Necessidades.** Publicar por foto, com campos de escolha em vez de texto livre. Saber quanto vai
receber e quando.

> **Critério de sucesso:** publica um lote de tábuas em menos de 3 minutos, usando apenas fotos e
> campos com opção pronta, e entende sem ajuda quanto vai receber e quando.

---

## Persona 2 — Ana Paula Ferreira, a artesã

| Atributo | Descrição |
|---|---|
| Idade | 34 anos |
| Profissão | Artesã — vasos, luminárias e móveis com material reaproveitado |
| Escolaridade | Superior incompleto (Design de Interiores) |
| Local | Mogi Mirim, SP |
| Renda | R$ 2.400/mês, cerca de 70% do artesanato |
| Dispositivo | iPhone 12, iOS 18; usa muito Instagram |
| Conhecimento tecnológico | Alto — compra online com frequência |

**Contexto.** É **compradora** antes de vendedora. Procura garrafas de vidro, paletes, retalhos de
tecido e restos de madeira nobre. Hoje roda três ferros-velhos e dois marceneiros por semana,
consumindo uma manhã inteira e combustível.

**Objetivos.** Encontrar material específico sem sair de casa; comparar preço antes de se
comprometer; saber, como MEI, o que precisa declarar.

**Dificuldades.** Busca genérica não serve — "madeira" traz de tudo. Foto ruim inviabiliza a
decisão: sem ver textura e defeito, não compra material de acabamento. Dúvida fiscal recorrente
sobre o limite do MEI.

**Necessidades.** Filtro por tipo, estado e distância. Imagem em resolução que permita avaliar a
peça. Orientação tributária no próprio aplicativo.

> **Critério de sucesso:** localiza um lote de vidro em raio de 40 km, avalia o estado pela foto
> ampliada e conclui a compra sem telefonar para ninguém — e encontra no aplicativo a resposta
> sobre o DAS.

---

## Persona 3 — Roberto Nakamura, o gestor da construtora

| Atributo | Descrição |
|---|---|
| Idade | 52 anos |
| Profissão | Sócio-administrador de construtora com 24 funcionários |
| Escolaridade | Engenharia Civil, pós em Gestão de Obras |
| Local | Campinas, SP |
| Faturamento | R$ 4,2 milhões/ano (Simples Nacional) |
| Dispositivo | iPhone 15 Pro e notebook; delega o operacional |
| Conhecimento tecnológico | Médio — usa sistemas de gestão, delega o uso diário |

**Contexto.** Problema oposto ao de Carlos: **volume**. Cada obra gera caçambas de entulho
separável. A empresa paga pela destinação e precisa comprovar o descarte correto para o
licenciamento ambiental. Vender a sobra interessa, mas é irrelevante se der trabalho — o tempo do
engenheiro custa mais que o lote.

**Objetivos.** Reduzir o custo de destinação transformando parte em receita; comprovar destinação;
operar em escala, sem intervenção manual constante.

**Dificuldades.** Limite de anúncios não cobre o volume de duas obras. Precisa de documento fiscal,
não só recibo. Taxa de 5% pesa em volume alto — em R$ 20 mil mensais, vira R$ 1.000.

**Necessidades.** Anúncios ilimitados, taxa reduzida, relatório exportável e orientação sobre qual
documento emitir em cada caso.

> **Critério de sucesso:** publica trinta lotes em uma tarde delegando a operação, acompanha
> receita e taxa retida em uma tela única, e encontra a orientação de qual documento fiscal emitir.

---

## Persona 4 — Juliana Costa, a compradora de primeira viagem

| Atributo | Descrição |
|---|---|
| Idade | 28 anos |
| Profissão | Professora de ensino fundamental |
| Escolaridade | Pedagogia |
| Local | Mogi Guaçu, SP |
| Renda | R$ 3.100/mês |
| Dispositivo | Samsung Galaxy A34, Android 14 |
| Conhecimento tecnológico | Médio — compra em loja online conhecida, desconfia de plataforma nova |

**Contexto.** Reformando o quintal de um apartamento alugado: precisa de tijolo para jardineira,
pedra para o caminho e madeira para um banco. Nunca comprou material de construção em marketplace
e tem medo específico de pagar e não receber. Também busca material para projeto escolar — garrafa
PET, tampinha, papelão —, caso em que a doação atende melhor que a venda.

**Objetivos.** Comprar barato sem correr risco; entender exatamente quanto vai pagar; ter para
onde recorrer se o material não chegar.

**Dificuldades.** Desconfiança de pagamento antecipado — a barreira mais forte. Não sabe avaliar
quantidade: "5 m³ de pedra" não significa nada para ela. Surpresa no valor final faz abandonar.

**Necessidades.** Valor final e taxa visíveis antes de confirmar. Nenhum depósito prévio. Caminho
claro para disputa. Filtro de doações.

> **Critério de sucesso:** conclui a primeira compra por PIX sem pedir ajuda, sabe o valor exato
> antes de confirmar e localiza em um toque o que fazer se o material não chegar.

---

## Persona 5 — Dona Marlene Aparecida, a catadora cooperada

| Atributo | Descrição |
|---|---|
| Idade | 58 anos |
| Profissão | Catadora, cooperada em associação de reciclagem |
| Escolaridade | Ensino fundamental incompleto |
| Local | Mogi Guaçu, SP |
| Renda | R$ 1.650/mês (rateio da cooperativa) |
| Dispositivo | Samsung Galaxy A03 (entrada), Android 12, plano pré-pago |
| Conhecimento tecnológico | Muito baixo — usa chamada e mensagem de voz; leitura pausada |

**Contexto.** Representa o **usuário de fronteira**: baixa familiaridade digital, aparelho de
entrada, internet intermitente. Está incluída deliberadamente — um marketplace de material
reaproveitado que não a atende falha justamente com quem mais depende dele. A cooperativa hoje
vende a atravessador por preço imposto.

**Objetivos.** Vender direto, sem atravessador; usar o aplicativo sozinha, sem depender do neto;
ter certeza de que o dinheiro chegou.

**Dificuldades.** Texto pequeno e contraste baixo dificultam a leitura. Aparelho lento: tela
pesada trava. Erro sem explicação a paralisa — mensagem técnica encerra a tentativa.

**Necessidades.** Alvo de toque grande, tipografia legível, contraste adequado, estado de
carregamento visível e mensagem de erro em linguagem comum.

> **Critério de sucesso:** publica um anúncio e encerra a sessão sem encontrar nenhuma tela em
> branco, nenhum texto ilegível e nenhuma mensagem que não consiga interpretar.

---

## Matriz de cobertura

Relaciona cada persona às decisões de projeto da versão 5.0, evidenciando que nenhuma ficou sem
contrapartida no produto:

| Decisão da versão 5.0 | Carlos | Ana Paula | Roberto | Juliana | Marlene |
|---|:-:|:-:|:-:|:-:|:-:|
| Fim da tela branca ao sair | ● | ○ | ○ | ○ | ● |
| Impulsionamento sem tela branca | ● | ○ | ● | — | ○ |
| Pagamento direto, sem carteira | ● | ● | ● | ● | ● |
| Painel do vendedor redesenhado | ○ | ○ | ● | — | ○ |
| Qualidade de imagem por contexto | ○ | ● | ○ | ● | ○ |
| Foto pela galeria e pela câmera | ● | ● | ○ | — | ● |
| Validação, estados e desfazer | ○ | ○ | ○ | ● | ● |
| Termos, privacidade e LGPD | ○ | ○ | ● | ● | ○ |
| Guia de tributos PF/PJ | ○ | ● | ● | — | ○ |
| Acessibilidade (alvo, contraste) | ○ | — | — | ○ | ● |

● impacto direto e determinante · ○ impacto indireto · — não se aplica

## Antipersona

**Quem o HandMade deliberadamente não atende:** o comprador que procura material novo, com
garantia de fábrica e entrega em 24 horas.

Atender esse perfil exigiria estoque próprio, logística e política de troca — o oposto do modelo
de intermediação entre quem gera e quem precisa de material reaproveitado. Declarar a antipersona
evita que decisões futuras diluam o propósito do produto.

## Como as personas orientaram o projeto

Duas personas guiaram diretamente o percurso cognitivo aplicado às tarefas de maior risco —
**Carlos e Dona Marlene**, os de menor familiaridade digital. O raciocínio: se a tarefa funciona
para eles, funciona para os demais; o inverso não é verdadeiro.

| Tarefa | Passo de maior risco | Correção derivada |
|---|---|---|
| Publicar anúncio | Reconhecer que a foto vem da galeria do celular | Seletor com rótulo explícito e área de toque grande |
| Concluir compra | Entender o valor final antes de confirmar | Taxa e total discriminados no passo de confirmação |
| Encerrar sessão | Perceber que a sessão terminou | Redirecionamento imediato, sem tela branca |

O método está detalhado em [Testes e qualidade](18-testes-e-qualidade).
