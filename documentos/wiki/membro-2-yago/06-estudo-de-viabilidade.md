# 2.2 Estudo de viabilidade — técnica, de cronograma e econômica

**Responsável:** Yago Smith da Silva

A viabilidade operacional e o cronograma detalhado estão em
[Viabilidade operacional e cronograma](04-cronograma-e-viabilidade-operacional). Esta página
trata da infraestrutura, do tempo por etapa e dos custos.

## 1. Viabilidade técnica

### 1.1 Infraestrutura do protótipo — o que já roda

| Item | Escolha | Por quê | Custo |
|---|---|---|---|
| Linguagem | TypeScript 5 | Tipagem estática pega erro antes da execução; o `tsc --noEmit` é o primeiro filtro de qualidade | Gratuito |
| Biblioteca de interface | React 18 | Domínio prévio da equipe; ecossistema amplo | Gratuito |
| Empacotador | Vite 5 | Recarregamento imediato durante o desenvolvimento e build rápido | Gratuito |
| Estilo | Tailwind CSS 3 | Escala de espaçamento e cor consistente, sem folha de estilo paralela | Gratuito |
| Componentes | shadcn/ui sobre Radix UI | Acessibilidade de teclado e ARIA já resolvida na base | Gratuito |
| Navegação | React Router DOM 6 | Rota declarativa, com parâmetro e estado | Gratuito |
| Formulários | react-hook-form + zod | Validação declarativa reaproveitada entre telas | Gratuito |
| Testes | Vitest + Playwright | Teste unitário e verificação em navegador real | Gratuito |
| Persistência | `localStorage` | Simula o Firestore sem exigir servidor | Gratuito |

**Equipamento usado:** computadores pessoais dos integrantes e celulares próprios para conferir o
comportamento em tela real. Nenhum equipamento foi adquirido para o projeto.

### 1.2 Infraestrutura do aplicativo final — o que está planejado

| Item | Escolha | Por quê |
|---|---|---|
| Framework | Flutter (Dart) | Uma base de código para Android e iOS; integração nativa com Firebase |
| Arquitetura | Padrão BLoC | Separação entre lógica e interface, testável isoladamente |
| Banco de dados | Cloud Firestore | NoSQL documental, sincronização em tempo real, suporte offline |
| Autenticação | Firebase Authentication | E-mail/senha e provedor social, com verificação de e-mail |
| Arquivos | Firebase Storage | Armazenamento das fotos dos anúncios |
| Regras de servidor | Cloud Functions (Node.js) | Notificação, limpeza de imagem, cálculo de reputação — o que não pode ficar no dispositivo |
| Notificações | Firebase Cloud Messaging | Mensagem, proposta e atualização de pedido |
| Hospedagem | Serverless | Sem servidor próprio para manter |

**Por que Firestore e não banco relacional.** O anúncio tem dados variáveis: categorias
diferentes pedem campos diferentes, e a quantidade de fotos varia. O modelo documental absorve
essa variação sem alteração de esquema. O custo é o cuidado com consultas que exigiriam junção,
resolvido por desnormalização controlada.

**Por que serverless.** Não há orçamento nem pessoa disponível para administrar servidor. O
modelo cobra por uso e escala sozinho — adequado a um projeto que começa com volume baixo.

### 1.3 Ferramentas de apoio

| Ferramenta | Uso | Licença |
|---|---|---|
| Visual Studio Code | Edição de código | Gratuito |
| Git e GitHub | Versionamento, Wiki e revisão | Gratuito (plano educacional) |
| Figma | Estudo de telas | Plano gratuito |
| Firebase Console | Administração da infraestrutura planejada | Plano Spark, gratuito |
| Node.js e npm | Execução e dependências | Gratuito |
| Playwright | Verificação em navegador | Gratuito |

**Licenças de software: nenhuma paga.** Todo o desenvolvimento usa ferramenta gratuita ou de
código aberto.

### 1.4 Requisitos de conectividade

O protótipo abre **sem conexão com a internet**: as fotos do catálogo estão embutidas no projeto
(13 materiais em três larguras cada, mais o avatar da vendedora). A decisão veio de um problema
real — uma foto hospedada externamente passou a responder erro 404 e quebrou uma figura da
monografia. Com as imagens no projeto, nenhuma pode caducar durante a apresentação.

O aplicativo final dependerá de conexão para sincronizar, mas o Firestore oferece cache local, o
que mantém o conteúdo já carregado disponível em conexão intermitente — situação comum no público
descrito em [Personas](13-personas).

## 2. Viabilidade de cronograma

| Etapa | Período | Duração |
|---|---|---|
| Levantamento de requisitos e pesquisa de campo | 02/03 a 31/03/2026 | 4 semanas |
| Mockup e prototipação mobile-first | 01/04 a 30/04/2026 | 4 semanas |
| UML, DER e modelagem de dados | 15/04 a 15/05/2026 | 4 semanas |
| Desenvolvimento: autenticação, anúncios e busca | 01/05 a 30/06/2026 | 8 semanas |
| Desenvolvimento: chat, notificações, pedidos e pagamento | 01/07 a 31/07/2026 | 4 semanas |
| Testes, ajustes, acessibilidade e documentação | 01/08 a 05/09/2026 | 5 semanas |
| Preparação da apresentação | 01/09 a 15/09/2026 | 2 semanas |

**Total:** 28 semanas, com sobreposição entre modelagem e desenvolvimento.

**Situação atual:** todas as etapas concluídas no que se refere ao protótipo e à documentação. A
implementação nativa em Flutter constitui a etapa seguinte e não está no cronograma acima.

## 3. Viabilidade econômica

### 3.1 Custo do desenvolvimento acadêmico

| Item | Valor |
|---|---|
| Licenças de software | R$ 0,00 |
| Hospedagem durante o desenvolvimento | R$ 0,00 |
| Equipamentos (uso de computadores e celulares próprios) | R$ 0,00 |
| Ferramentas de design e versionamento | R$ 0,00 |
| **Total desembolsado** | **R$ 0,00** |

Todo o desenvolvimento usou ferramenta gratuita. O custo real foi o tempo dos integrantes.

### 3.2 Quanto custaria com soluções comerciais

Estimativa do que seria gasto caso as mesmas necessidades fossem atendidas por serviços pagos, em
valores mensais de referência:

| Necessidade | Solução comercial equivalente | Custo mensal estimado |
|---|---|---|
| Servidor de aplicação | Instância dedicada em nuvem | R$ 250,00 |
| Banco de dados gerenciado | Serviço gerenciado | R$ 200,00 |
| Armazenamento de imagens | Objeto em nuvem com CDN | R$ 90,00 |
| Ferramenta de design | Licença profissional, 4 usuários | R$ 300,00 |
| Repositório privado com CI | Plano de equipe | R$ 100,00 |
| Monitoramento de erros | Plano inicial | R$ 130,00 |
| **Total mensal** | | **R$ 1.070,00** |

Em seis meses de projeto, R$ 6.420,00 — valor incompatível com um trabalho acadêmico. O uso do
plano gratuito do Firebase e de ferramentas abertas é o que torna o projeto viável.

### 3.3 Investimento para operação real

Caso a plataforma seja lançada comercialmente:

| Item | Valor |
|---|---|
| Desenvolvimento do aplicativo (concluído no TCC) | R$ 0,00 |
| Registro de marca no INPI | R$ 1.045,00 |
| Abertura de empresa e contabilidade inicial | R$ 800,00 |
| Domínio, certificado e infraestrutura (3 meses) | R$ 1.160,00 |
| Campanha de lançamento regional | R$ 3.000,00 |
| Capital de giro (3 meses de custo fixo) | R$ 7.380,00 |
| **Total** | **R$ 13.385,00** |

**Composição do registro de marca (verificada em agosto de 2026).** Os R$ 1.045,00 correspondem à
taxa de depósito do pedido (R$ 418,00) somada à taxa de concessão do registro (R$ 627,00), pela
tabela do INPI vigente desde agosto de 2025. **Há desconto de 60% para microempresa**, o que
reduziria o depósito para cerca de R$ 167,20 e o total para aproximadamente R$ 794,20. O valor
integral foi mantido na projeção por ser o cenário conservador — o desconto depende de a empresa
estar formalizada como microempresa no momento do pedido.

### 3.4 Custo operacional mensal projetado

| Item | Valor | Tipo |
|---|---|---|
| Infraestrutura em nuvem (Firebase e hospedagem) | R$ 320,00 | Fixo |
| Taxas do provedor de pagamento (1,2% do volume) | R$ 907,20 | Variável |
| Marketing e aquisição | R$ 1.500,00 | Variável |
| Atendimento e mediação (meio período) | R$ 1.400,00 | Fixo |
| Contabilidade e obrigações | R$ 480,00 | Fixo |
| Ferramentas e licenças | R$ 260,00 | Fixo |
| **Total mensal** | **R$ 4.867,20** | |

Custo fixo mensal: **R$ 2.460,00**.

#### Sensibilidade à taxa do provedor de pagamento

A verificação externa de agosto de 2026 apurou as taxas praticadas por adquirentes brasileiros e
indicou que **1,2% é otimista como média combinada**. As taxas verificadas:

| Provedor | Modalidade | Taxa apurada |
|---|---|---:|
| PagBank | Crédito | ~1,99% |
| PagBank | Débito | ~0,99% |
| Mercado Pago | Crédito, recebimento imediato | até ~3,99% |

O PIX tem taxa sensivelmente menor que cartão e responde por participação crescente no mercado
brasileiro. Como o protótipo apresenta o PIX como primeira opção e a modalidade de aprovação
imediata, a premissa de 1,2% **só se sustenta se o PIX dominar a composição real**.

Por isso o número não deve ser lido como certeza. O efeito da variação sobre o resultado:

| Taxa média efetiva | Custo mensal do adquirente | Resultado mensal | Margem |
|---|---:|---:|---:|
| 1,2% (premissa atual) | R$ 907,20 | R$ 1.311,46 | 21,2% |
| 1,5% | R$ 1.134,00 | R$ 1.084,66 | 17,6% |
| 2,0% | R$ 1.512,00 | R$ 706,66 | 11,4% |

**Leitura.** O negócio permanece superavitário em toda a faixa verificada, mas a margem cai de
21,2% para 11,4% no pior caso. A conclusão de viabilidade não se inverte; a folga diminui. A
premissa de 1,2% fica mantida no modelo por ser a projeção de composição desejada, **com esta
tabela declarando o risco** — em vez de omiti-lo.

Fonte da apuração: `documentos/qualidade/evidencias/pesquisa-externa.md`.

### 3.5 Receita projetada e resultado

Projeção para o 12º mês de operação, com 180 transações mensais e ticket médio de R$ 420,00:

| Fonte | Cálculo | Valor mensal |
|---|---|---|
| Taxa de serviço por venda | 180 × R$ 420,00 × 4,76% | R$ 3.598,56 |
| Assinatura Pro | 19 assinantes × R$ 29,90 | R$ 568,10 |
| Assinatura Empresarial | 6 assinantes × R$ 89,90 | R$ 539,40 |
| Impulsionamento de anúncios | 74 compras × R$ 19,90 | R$ 1.472,60 |
| **Receita mensal** | | **R$ 6.178,66** |

| Indicador | Valor |
|---|---|
| Receita mensal | R$ 6.178,66 |
| Custo mensal | R$ 4.867,20 |
| **Resultado mensal** | **R$ 1.311,46** |
| Margem | 21,23% |
| Ponto de equilíbrio | 165 transações/mês (R$ 69.300,00 em volume) |
| Retorno do investimento | 11 meses |

**Taxa média efetiva de 4,76%:** não é 5% porque parte das vendas vem de assinantes Pro (3%) e
Empresarial (2%). A média é ponderada pela participação de cada plano na base ativa.

### 3.6 Indicadores de sustentação

| Indicador | Valor | Leitura |
|---|---|---|
| Vida média da assinatura | 16,7 meses | Decorre do churn de 6% ao mês |
| Receita média por assinante | R$ 44,30 | Ponderada entre Pro e Empresarial |
| LTV | R$ 739,81 | Receita esperada por assinante ao longo da vida |
| Conversão para plano pago | 10,68% | Dos vendedores ativos |
| CAC por assinante | R$ 117,04 | CAC de usuário (R$ 12,50) ajustado pela conversão |
| **Razão LTV/CAC** | **6,3×** | Acima de 3× é considerado saudável |
| Payback do CAC | 2,6 meses | Tempo para recuperar o custo de aquisição |

O CAC usado na razão é o **por assinante**, não o por usuário. Comparar o LTV de um assinante com
o custo de adquirir um usuário qualquer superestimaria o retorno em quase dez vezes — apenas
10,68% dos vendedores assinam, então cada assinante custa o equivalente a nove usuários captados.

### 3.7 Projeção trienal

| Ano | Transações/mês | Receita anual | Custo anual | Resultado anual |
|---|---|---|---|---|
| 1 | 180 | R$ 74.143,92 | R$ 58.406,40 | R$ 15.737,52 |
| 2 | 432 | R$ 177.945,36 | R$ 121.577,76 | R$ 56.367,60 |
| 3 | 828 | R$ 341.062,08 | R$ 220.847,04 | R$ 120.215,04 |

O custo fixo cresce menos que proporcionalmente ao volume (fator de 0,55), o que amplia a margem
conforme a base aumenta.

### 3.8 Impacto socioambiental projetado

| Indicador | Valor anual |
|---|---|
| Resíduo desviado do descarte irregular | 756 toneladas |
| CO₂ equivalente evitado | 317,5 toneladas |

> **Estimativa preliminar — sem fonte que a confirme.** Os dois números derivam de dois fatores
> adotados pelo grupo: 0,35 t de resíduo por transação e 0,42 tCO₂e evitado por tonelada
> reaproveitada. A verificação externa de agosto de 2026 **não localizou fonte publicada para
> nenhum dos dois**. O fator real de CO₂ varia conforme o material — concreto, aço, madeira e
> agregado têm perfis muito diferentes — e conforme a fronteira do sistema adotada na análise de
> ciclo de vida.
>
> Por isso, esta seção deve ser apresentada como **ordem de grandeza do potencial de impacto**, e
> nunca como dado ambiental verificado. A mesma ressalva foi inserida na tela
> `/plano-de-negocio` do protótipo, para que quem usa o aplicativo veja o mesmo limite que quem lê
> a documentação.
>
> **Para tornar o número defensável** seria preciso adotar fatores por material, extraídos de
> inventário de ciclo de vida publicado, e ponderá-los pela composição real do catálogo.

---

## Origem e limite dos números

Todos os valores das seções 3.3 a 3.8 são **calculados**, não estimados a olho: vêm do módulo
`prototipo/src/lib/business.ts`, que deriva cada resultado das premissas declaradas no próprio
arquivo. O módulo é coberto por 27 testes automatizados, e a tela `/plano-de-negocio` do
protótipo exibe os mesmos números — planilha e aplicativo não podem divergir.

**Limite declarado.** Três premissas (ticket médio, proporção de pessoa jurídica e anúncios por
vendedor) vêm da pesquisa aplicada, cujos dados primários ainda não foram arquivados no
repositório — situação detalhada em
[Levantamento de requisitos](07-levantamento-de-requisitos). Nenhuma projeção deriva de operação
real, porque a plataforma não está em operação.

### Premissas de mercado — nenhuma validada externamente

A verificação de agosto de 2026 buscou benchmark publicado para cada premissa de comportamento de
marketplace. O resultado foi **NÃO ENCONTRADO em todos os casos**, sobretudo para o mercado
brasileiro e latino-americano:

| Premissa | Valor adotado | Situação |
|---|---:|---|
| Conversão de anúncios ativos em venda no mês | 22% | Sem benchmark publicado |
| Vendedores que assinam plano pago | 8% | Sem benchmark publicado |
| Contas empresa que assinam o Empresarial | 15% | Sem benchmark publicado |
| Cancelamento mensal de assinatura | 6% | Sem benchmark publicado |
| Anúncios ativos por vendedor | 3,5 | Sem benchmark publicado |
| CAC por usuário cadastrado | R$ 12,50 | Sem benchmark setorial; faixa de R$ 10 a R$ 20 considerada plausível para serviço digital |

**Consequência para a leitura deste estudo.** As projeções são **hipóteses internas coerentes entre
si**, não previsões apoiadas em dados de mercado. A razão LTV/CAC de 6,3× e o payback de 2,6 meses
são resultados aritméticos dessas hipóteses — se as premissas mudarem, eles mudam.

Isso não invalida o estudo: um plano de negócio de projeto acadêmico, para um produto que não
entrou em operação, não tem outra base possível. O que seria indefensável é apresentar essas
premissas como dado de mercado verificado — e é isso que esta seção evita.

**Único parâmetro com faixa externa apurada:** a taxa do provedor de pagamento, cuja sensibilidade
está na seção 3.4.

Registro completo da apuração: `documentos/qualidade/evidencias/pesquisa-externa.md`.
