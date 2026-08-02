# 6.1 Área de atuação por região

**Responsável:** Yago Smith da Silva

O recorte geográfico não é detalhe administrativo: material de reaproveitamento é **pesado e de
baixo valor por quilo**, o que faz o frete inviabilizar a negociação a distância. Um lote de
tijolos a 200 km custa mais em transporte do que vale. Por isso a plataforma é planejada por
raio, não por cobertura nacional.

## O raio econômico do material

Estimativa de viabilidade por distância, considerando o ticket médio de R$ 420 adotado no
[Estudo de viabilidade](06-estudo-de-viabilidade):

| Distância | Situação | Observação |
|---|---|---|
| Até 15 km | Viável para qualquer lote | Retirada com veículo próprio ou frete curto |
| 15 a 40 km | Viável para lote médio e grande | Frete dilui no valor do lote |
| 40 a 80 km | Viável apenas para lote de alto valor | Metal, madeira nobre, equipamento |
| Acima de 80 km | Inviável na maioria dos casos | Frete se aproxima ou supera o valor |

**Consequência de projeto:** a plataforma precisa de **densidade local**, não de abrangência. Mil
anúncios em uma cidade valem mais que cem mil espalhados pelo país. É isso que define a estratégia
de lançamento concentrado descrita abaixo.

O filtro por distância implementado no protótipo (`pages/Marketplace.tsx`) existe por essa razão.

## Microrregião — lançamento

Sede do projeto: **Mogi Guaçu, São Paulo**, no interior do estado, próxima à divisa com Minas
Gerais.

> **Correção de agosto de 2026.** Uma versão anterior descrevia Mogi Guaçu como pertencente à
> "região administrativa de Campinas". A verificação externa apurou que **Mogi Guaçu não integra
> a Região Metropolitana de Campinas** — cuja composição oficial inclui Campinas, Hortolândia,
> Sumaré e Paulínia, entre outras, mas não Mogi Guaçu. O texto foi ajustado.

### Municípios do raio inicial

Dados da **Fundação Seade**, estimativas populacionais para 2025:

| Município | População (2025) | Área (km²) | IDHM | Empresas ativas |
|---|---:|---:|:-:|---:|
| **Mogi Guaçu** (sede) | 108.671 | 262,9 | 0,754 | 10.349 |
| Mogi Mirim | 72.515 | 223,2 | 0,762 | 8.232 |
| Itapira | 47.977 | 749,5 | 0,788 | 5.121 |
| Casa Branca | 40.273 | 338,3 | 0,775 | 4.132 |
| Aguaí | 27.665 | 516,2 | 0,745 | 2.675 |
| Espírito Santo do Pinhal | 19.248 | 322,2 | 0,770 | 1.881 |
| Estiva Gerbi | 12.715 | 248,3 | 0,774 | 1.172 |
| **Total** | **329.064** | **2.660,6** | — | **33.562** |

Todos os sete municípios têm IDHM na faixa de **alto desenvolvimento humano** (0,700 a 0,799).

### Mercado inicial dimensionado

| Indicador | Valor |
|---|---|
| População do raio inicial | 329.064 habitantes |
| Empresas ativas na região | 33.562 |
| Empresas de construção civil em Mogi Guaçu | **375** |

As 375 empresas de construção da sede são o indicador mais direto do **lado da oferta**: são elas
que geram sobra de obra em volume e hoje pagam pela destinação.

### Por que começar aqui

- É onde a equipe está e onde a pesquisa de campo foi aplicada.
- Os municípios estão dentro do raio economicamente viável para material pesado.
- Há presença simultânea dos dois lados do mercado: geradores (construção, indústria, marcenarias)
  e consumidores (artesãos, pequenos empreendedores, cooperativas).
- Existe **demanda orgânica comprovada**: foi identificado o grupo "Sobra de Materiais de
  Construção Campinas e Região" em rede social, com atividade no mesmo recorte geográfico.

### Prontidão digital

A viabilidade de uma plataforma mobile depende de acesso. Dados do IBGE (PNAD Contínua, 2025):

| Indicador | Valor |
|---|---|
| Domicílios com acesso à internet no Brasil | **95%** |
| Uso de internet em São Paulo (10 anos ou mais) | acima de **90%** |
| Pessoas de 10 anos ou mais com celular próprio | **89,8%** |

A barreira de acesso, portanto, **não é o dispositivo nem a conexão** — é a usabilidade, tratada
em [Personas](13-personas) e verificada em [Testes e qualidade](18-testes-e-qualidade).

## Macrorregião — expansão planejada

Expansão prevista por proximidade e continuidade logística, **não executada** — o projeto está em
fase de protótipo:

| Fase | Alcance | Base do plano |
|---|---|---|
| 1 | Mogi Guaçu e municípios limítrofes | Fase de validação; corresponde ao ano 1 da projeção |
| 2 | Eixo Campinas | Maior densidade industrial do interior paulista |
| 3 | Interior de São Paulo e sul de Minas Gerais | Continuidade geográfica a partir da divisa |
| 4 | Demais regiões | Depende de densidade atingida nas fases anteriores |

> A fase 2 é descrita como **eixo Campinas** por continuidade econômica e logística, e não por
> pertencimento administrativo: Mogi Guaçu não integra a Região Metropolitana de Campinas.

As fases correspondem à projeção trienal do [Estudo de viabilidade](06-estudo-de-viabilidade): 180
transações/mês no ano 1, 432 no ano 2 e 828 no ano 3.

**Critério para avançar de fase:** só faz sentido abrir uma região nova quando a anterior atinge
densidade suficiente para se sustentar — caso contrário, a plataforma fica dispersa e deixa de ser
útil em qualquer lugar. O indicador adotado é o ponto de equilíbrio: **165 transações por mês**.

## Perfil econômico regional

Características que justificam o recorte:

- **Construção civil ativa**, com obras residenciais e comerciais que geram sobra de material.
- **Indústria diversificada** na região de Campinas, com excedente de embalagem, metal e plástico.
- **Agroindústria**, que gera embalagem e estrutura reaproveitável.
- **Artesanato e pequeno empreendedorismo**, o lado da demanda por matéria-prima barata.
- **Cooperativas de reciclagem organizadas**, parceiro potencial de oferta.

## Estratégia de entrada

Concentrar em vez de espalhar, com três frentes:

1. **Parceria com cooperativas de reciclagem** — oferta inicial de volume e um canal de venda
   direta para o cooperado, hoje dependente de intermediário.
2. **Contato direto com geradores locais** — construtoras, marcenarias e marmorarias, para quem o
   argumento é financeiro e imediato: receber pelo lote em vez de pagar pela caçamba.
3. **Divulgação em feiras de artesanato e grupos regionais** — o lado da demanda, onde o público
   já se reúne.

O orçamento de aquisição previsto (R$ 1.500/mês) é compatível com mídia regional segmentada, não
com campanha nacional — coerente com o recorte.

---

**O que ainda precisa ser confirmado.** A verificação externa trouxe os dados populacionais e
econômicos da Fundação Seade acima, mas **não confirmou a classificação regional oficial** do
IBGE. O material recebido continha erro evidente nesse ponto — confundia Mogi Guaçu com Mogi das
Cruzes, municípios distintos e distantes entre si —, e por isso nenhuma denominação de "Região
Geográfica Imediata" ou "Intermediária" foi publicada aqui.

Antes da entrega final:

1. Consultar https://cidades.ibge.gov.br para obter a **Região Geográfica Imediata** e a
   **Região Geográfica Intermediária** a que Mogi Guaçu pertence, com a lista de municípios de
   cada uma, e registrar a data de consulta.
2. Confirmar as **distâncias rodoviárias** entre a sede e cada município do raio inicial. As
   distâncias não foram publicadas nesta página porque os valores recebidos eram incoerentes com
   a proximidade real entre os municípios.
3. Consultar o **Panorama dos Resíduos Sólidos** da ABREMA para o volume regional de resíduo da
   construção civil.

O registro completo do que foi aceito e do que foi descartado está em
`documentos/qualidade/evidencias/pesquisa-externa.md`. As fontes constam em
[Referências](21-referencias).
