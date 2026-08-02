# Pesquisa externa — auditoria das fontes

Registro da verificação externa encomendada em agosto de 2026 para confirmar, corrigir ou
descartar as afirmações da Wiki que dependiam de fonte de terceiros.

**Regra aplicada:** nenhum dado entrou na documentação sem ser conferido quanto à coerência
interna. Uma parte do material recebido continha erro factual, e a seção 3 registra o que foi
**descartado** — descartar é tão importante quanto incorporar.

---

## 1. Correções aceitas — a documentação estava errada

| # | Afirmação anterior | Situação | O que passou a valer |
|---|---|---|---|
| 1 | "Não foi identificada plataforma especializada concorrente" | **ERRADA** | Existem concorrentes diretos: Resto de Obra e S'Obra. Ver [Concorrentes](08-concorrentes) |
| 2 | Mogi Guaçu na "região administrativa de Campinas" | **IMPRECISA** | Mogi Guaçu **não** integra a Região Metropolitana de Campinas |
| 3 | ISO/IEC 25010:2011 | **DESATUALIZADA** | A versão vigente é a **ISO/IEC 25010:2023** |
| 4 | Alvo de toque "44 px" (personas) vs "24 × 24 px" (UI/UX) | **CONTRADIÇÃO APARENTE** | São critérios distintos: 2.5.8 exige 24 × 24 (nível AA); 2.5.5 exige 44 × 44 (nível AAA) |
| 5 | 0,42 tCO₂e evitado por tonelada reaproveitada | **SEM FONTE** | Nenhuma fonte confirmou o fator. Reclassificado como estimativa preliminar |
| 6 | "3× mais visualizações" para anúncio impulsionado | **SEM FONTE** | Nenhum estudo publicado sustenta o multiplicador. Removido do produto e da Wiki |
| 7 | Taxa média do provedor de pagamento de 1,2% | **ABAIXO DO MERCADO** | Faixa real praticada: 1,5% a 2,0%. Registrado como limitação do modelo |
| 8 | Plataforma como "mera intermediária" | **FRÁGIL** | O STJ tem responsabilizado plataformas. O texto passou a descrever o dever de diligência |

## 2. Dados novos incorporados

### Concorrência
- **Resto de Obra** (https://restodeobra.com.br) — declara-se "o maior marketplace de materiais
  de construção usados do Brasil". Concorrente direto.
- **S'Obra** — atua no mesmo segmento de resto de obra.
- **Yattó** (https://yatto.com.br) — Jaguariúna/SP, infraestrutura de circularidade para grandes
  empresas (B2B).
- **Recircula Brasil** (https://recirculabrasil.com.br) — rastreabilidade de resíduo plástico.
- **Bolsas de resíduos** de federações (FIESP/CIESP) — exclusivamente B2B, foco em simbiose
  industrial.
- Grupo "Sobra de Materiais de Construção Campinas e Região" no Facebook — demanda orgânica
  local, sem estrutura.

### Região (Fundação Seade, estimativas 2025)

| Município | População | Área (km²) |
|---|---:|---:|
| Mogi Guaçu | 108.671 | 262,9 |
| Mogi Mirim | 72.515 | 223,2 |
| Itapira | 47.977 | 749,5 |
| Casa Branca | 40.273 | 338,3 |
| Aguaí | 27.665 | 516,2 |
| Espírito Santo do Pinhal | 19.248 | 322,2 |
| Estiva Gerbi | 12.715 | 248,3 |
| **Total** | **329.064** | **2.660,6** |

- Mogi Guaçu: 10.349 empresas ativas, **375 na construção civil**; IDHM 0,754.
- **Mogi Guaçu não integra a Região Metropolitana de Campinas.**

### Conectividade (IBGE, PNAD Contínua 2025)
- Internet em **95% dos domicílios** do país.
- Uso de internet acima de **90%** da população de 10 anos ou mais em São Paulo.
- **89,8%** das pessoas de 10 anos ou mais possuem celular para uso pessoal.

### Setor de resíduos
- Brasil reaproveita apenas **1,3%** dos materiais que consome (Circularity Gap Report, via Folha).
- Geração de aproximadamente **1,051 kg de resíduo sólido urbano por habitante/dia** (ABREMA).
- São Paulo gera cerca de **40 mil toneladas de resíduo sólido por dia**.

### Regulação
- **MTR obrigatório desde 14 de abril de 2025**, com registro no sistema SINIR.
- **SIGOR — Módulo Construção Civil** (CETESB) controla transporte e destinação de RCC em SP.
- **CONAMA 307/2002** classifica o RCC em quatro classes: A (agregados reutilizáveis/recicláveis),
  B (recicláveis: plástico, papel, metal), C (sem tecnologia viável de recuperação),
  D (perigosos: tintas, solventes).
- **MEI:** teto de R$ 81.000/ano mantido em 2026 (a proposta de elevação para R$ 140 mil não foi
  aprovada). **Simples Nacional:** teto de R$ 4,8 milhões.
- **LGPD:** não há isenção para agentes de pequeno porte que reduza as obrigações centrais.

### Técnico
- **WCAG 2.2:** critério 2.5.8 (mínimo, nível AA) exige 24 × 24 px CSS; critério 2.5.5
  (ampliado, nível AAA) exige 44 × 44 px CSS.
- **Persistência offline do Firestore** é ativada por padrão no Flutter mobile.
- **BLoC** permanece padrão defensável para aplicações complexas.
- **INPI:** taxa de depósito R$ 418 + concessão R$ 627 = **R$ 1.045**, com desconto de 60% para
  microempresa. O valor que a documentação já usava está correto.

## 3. Material descartado — não entrou na documentação

Estes itens vieram na pesquisa mas **foram rejeitados por erro factual ou incoerência interna**.
Ficam registrados para que ninguém os reintroduza por engano.

| Item recebido | Por que foi descartado |
|---|---|
| População de Mogi Guaçu de 27.755.766 | Absurdo — supera a de qualquer município brasileiro. A própria pesquisa sinalizou o erro |
| PIB municipal de R$ 2,7 trilhões | Absurdo — seria superior ao de países inteiros. Descartado junto com o PIB per capita derivado dele |
| "Região Geográfica Intermediária de Mogi das Cruzes" | Confusão entre **Mogi Guaçu** e **Mogi das Cruzes**, municípios distintos e distantes. A classificação regional correta permanece pendente de consulta ao IBGE |
| "Região Administrativa de São Paulo" para Mogi Guaçu | Incompatível com a localização do município |
| "Anexo III do Simples Nacional = comércio, 6%" | Errado: o Anexo I trata do comércio. A própria pesquisa cita fonte que a contradiz |
| "Anexo IV com alíquota inicial de 20%" | Errado: a alíquota inicial do Anexo IV não é essa |
| "Art. 13 da PNRS trata da responsabilidade compartilhada" | Numeração não confirmada. Nenhum número de artigo da PNRS foi incorporado sem verificação direta |
| Lei nº 17.260/2020 como lei **estadual** de São Paulo | A fonte aponta legislação **municipal** da cidade de São Paulo, inaplicável a Mogi Guaçu |
| Distância de 60 km entre Mogi Guaçu e Estiva Gerbi | Incompatível com a proximidade real entre os municípios. Distâncias não foram publicadas |
| Lista de características da ISO/IEC 25010 apresentada como sendo da versão 2023 | A lista fornecida corresponde à versão 2011. Apenas o **ano da norma** foi atualizado |

## 4. Permanece sem confirmação

| Item | Situação |
|---|---|
| Pesquisa de campo com 87 respondentes | Instrumento e respostas continuam **não arquivados** no repositório |
| Classificação regional oficial do IBGE | Exige consulta direta a https://cidades.ibge.gov.br |
| Legislação municipal de Mogi Guaçu sobre resíduos | Não localizada |
| Benchmarks de marketplace (take rate, conversão, churn, LTV/CAC) | **NÃO ENCONTRADOS** em fonte publicada. Permanecem como premissas internas |
| Massa de 0,35 t de resíduo por transação | Sem base publicada |
| Diferimento de ICMS para sucata em São Paulo | Existe como instituto, mas o dispositivo do RICMS/SP não foi confirmado |

---

**Data da verificação:** agosto de 2026.
**Método:** pesquisa externa encomendada, seguida de auditoria de coerência interna item a item.
Fontes incorporadas constam em [Referências](21-referencias).
