# 1.5 Problema encontrado

**Responsável:** Yago Smith da Silva

## Enunciado do problema

> Não existe um canal específico, seguro e organizado que conecte quem possui materiais
> reutilizáveis ou excedentes a quem precisa desses materiais para produzir, reparar, criar ou
> revender. A consequência é dupla: material com valor comercial é descartado, e quem precisaria
> dele compra matéria-prima nova mais caro.

## As duas pontas do problema

O problema não é falta de material nem falta de demanda. É falta de **encontro** entre os dois.

### Ponta da oferta — quem tem o material

Construtoras, marcenarias, marmorarias, indústrias e pessoas físicas em reforma acumulam sobra
com valor de revenda. O que impede a venda hoje:

| Obstáculo | Efeito prático |
|---|---|
| Não há canal especializado | O anúncio se perde entre categorias que não têm relação com material |
| Volume pequeno por lote | O esforço de anunciar não se paga em plataforma genérica |
| Custo de tempo | Para a empresa, o tempo do funcionário vale mais que o lote de sobra |
| Falta de rastreabilidade | Sem documento, a venda não serve para comprovação ambiental |

O resultado é o descarte: paga-se pela caçamba que leva material que ainda serve.

### Ponta da demanda — quem precisa do material

Artesãos, pequenos empreendedores, cooperativas e consumidores finais precisam de matéria-prima
barata. O que impede a compra hoje:

| Obstáculo | Efeito prático |
|---|---|
| Busca genérica não filtra por material | "Madeira" devolve resultado irrelevante em maioria |
| Não se sabe onde procurar | A busca é física: rodar ferro-velho e marcenaria a pé ou de carro |
| Foto insuficiente para decidir | Sem ver o estado da peça, não se compra material de acabamento |
| Desconfiança no pagamento | Medo de pagar e não receber, especialmente na primeira compra |

## Por que as plataformas existentes não resolvem

Plataformas generalistas de classificados resolvem o problema de **anunciar**, mas não o de
**encontrar material reaproveitável**. As lacunas observadas:

1. **Sem taxonomia de material.** Não há categoria para "sobra de obra", "madeira de demolição"
   ou "retalho". O vendedor encaixa o item onde couber, e o comprador não sabe onde procurar.
2. **Sem filtro por condição real do material.** Novo, usado em bom estado e usado precisando
   reparo são decisões de compra diferentes, e a distinção não existe.
3. **Sem filtro por proximidade útil.** Material de construção é pesado: um lote a 200 km é
   inviável mesmo barato. O raio de busca é a variável mais importante e a menos disponível.
4. **Sem apoio à obrigação documental.** Empresa que vende resíduo precisa de nota e, em vários
   casos, de Manifesto de Transporte de Resíduos. Recibo simples não atende à auditoria.
5. **Sem moderação especializada.** Não há quem distinga anúncio legítimo de material irregular.

O detalhamento por concorrente está em [Concorrentes](08-concorrentes).

## Dimensão do problema

Dados apurados na verificação externa de agosto de 2026:

| Indicador | Valor | Fonte |
|---|---|---|
| Materiais que o Brasil reaproveita do que consome | **1,3%** | Circularity Gap Report, divulgado em 2026 |
| Geração de resíduo sólido urbano por habitante | **1,051 kg/dia** | ABREMA, Panorama dos Resíduos Sólidos |
| Resíduo sólido gerado no estado de São Paulo | cerca de **40 mil toneladas/dia** | Levantamento setorial |
| Empresas de construção civil em Mogi Guaçu | **375** | Fundação Seade |

O índice de 1,3% é o dado mais eloquente: **quase tudo o que o país consome deixa de retornar ao
ciclo produtivo**. A circularidade da economia brasileira está abaixo da média global.

> **Ressalva de leitura.** Os três primeiros indicadores referem-se ao resíduo sólido em geral, e
> não exclusivamente ao resíduo da construção civil, que é o recorte do projeto. Foram mantidos
> por dimensionarem o contexto, não por medirem o mercado endereçável. O volume regional
> específico de resíduo da construção permanece **não levantado** — pendência registrada em
> [Microrregião e macrorregião](09-microrregiao-e-macrorregiao).

## Consequência econômica e ambiental

O problema tem os dois lados, e é isso que sustenta a proposta:

| Dimensão | Consequência |
|---|---|
| Econômica — oferta | Paga-se pela destinação de material que tem valor de revenda |
| Econômica — demanda | Compra-se matéria-prima nova quando existiria equivalente reaproveitado |
| Ambiental | Material com ciclo produtivo restante vai para aterro ou descarte irregular |
| Legal | A ordem de prioridade da PNRS coloca reutilização acima de reciclagem, mas falta o canal |

A Política Nacional de Resíduos Sólidos (BRASIL, 2010) estabelece a ordem de prioridade: não
geração, redução, **reutilização**, reciclagem, tratamento e disposição final. A lei também
institui a responsabilidade compartilhada pelo ciclo de vida do produto. O HandMade atua
exatamente no terceiro nível dessa hierarquia — o da reutilização, anterior à reciclagem.

Existe, portanto, uma exigência legal de priorizar a reutilização e uma ausência prática de
ferramenta que a viabilize no dia a dia. É essa distância que o projeto endereça.

## Pergunta de pesquisa

> Como uma plataforma mobile especializada em materiais reutilizáveis pode facilitar a conexão
> entre vendedores e compradores, reduzir o descarte inadequado e gerar oportunidades econômicas
> locais, mantendo segurança e usabilidade adequadas para todos os perfis de usuário?

A pergunta orienta as decisões do projeto e delimita o que conta como sucesso: não basta a
plataforma existir, ela precisa ser usável por quem tem baixa familiaridade digital — condição
tratada em [Personas](13-personas) e verificada em [Testes e qualidade](18-testes-e-qualidade).

## Como o problema se converteu em requisito

Cada obstáculo listado acima gerou um requisito verificável no protótipo:

| Obstáculo | Requisito correspondente |
|---|---|
| Sem taxonomia de material | 9 categorias próprias de material (RF-08) |
| Sem filtro por condição | 4 condições declaradas por anúncio (RF-08) |
| Sem filtro por proximidade | Filtro por cidade, estado e faixa de distância (RF-10) |
| Foto insuficiente | Até 8 fotos por anúncio, em três larguras (RF-07, RNF-04) |
| Desconfiança no pagamento | Valor e taxa discriminados antes de confirmar (RF-16) |
| Falta de apoio documental | Guia de tributos PF/PJ com orientação por regime (RF-24) |

A lista completa está em [Requisitos funcionais](11-requisitos-funcionais).

## Fontes

- BRASIL. Lei nº 12.305/2010 — Política Nacional de Resíduos Sólidos.
- ELLEN MACARTHUR FOUNDATION. The circular economy in detail, 2013.
- ABREMA. Panorama dos Resíduos Sólidos no Brasil.

Referências completas em [Referências](21-referencias).

---

**Nota de método.** As lacunas das plataformas concorrentes foram levantadas por observação
direta dos serviços (ver [Concorrentes](08-concorrentes)). Os obstáculos de cada ponta foram
consolidados a partir da revisão bibliográfica e da observação de anúncios reais de sobra de obra
em classificados generalistas. O estado das evidências de pesquisa de campo está declarado em
[Levantamento de requisitos](07-levantamento-de-requisitos).
