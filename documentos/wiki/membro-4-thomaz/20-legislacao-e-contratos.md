# 8.1 Legislação e aspectos contratuais

**Responsável:** Thomaz de Moraes Teixeira

Levantamento da legislação aplicável ao HandMade e dos documentos contratuais necessários. Cada
norma é acompanhada do **impacto concreto no desenvolvimento** — legislação listada sem
consequência prática não orienta decisão de projeto.

## 1. Legislação federal

### Lei nº 12.305/2010 — Política Nacional de Resíduos Sólidos

Fundamento ambiental do projeto. Estabelece a ordem de prioridade na gestão de resíduos:

> não geração → redução → **reutilização** → reciclagem → tratamento → disposição final
> ambientalmente adequada

Institui também a **responsabilidade compartilhada pelo ciclo de vida do produto** e reconhece o
papel das cooperativas de catadores.

**Impacto no sistema.** O HandMade atua na etapa de reutilização — anterior à reciclagem. Isso
define o escopo do que é anunciável: material com ciclo produtivo restante, não rejeito. A lei
também sustenta a proposta de valor apresentada a empresas, que precisam demonstrar a hierarquia
no licenciamento ambiental.

### Lei nº 13.709/2018 — Lei Geral de Proteção de Dados (LGPD)

A norma de maior impacto técnico direto. Exigências implementadas no protótipo:

| Exigência | Como foi atendida |
|---|---|
| Consentimento informado e registrável (art. 8º) | Aceite gravado com data, hora e **versão do documento** |
| Finalidade e base legal declaradas (art. 7º) | Política de Privacidade com seção própria de bases legais |
| Coleta mínima | CPF e CNPJ guardados apenas pelos quatro últimos dígitos |
| Direitos do titular (art. 18) | Central de privacidade com os dez direitos, incluindo exportação e exclusão |
| Encarregado (DPO) identificado | Contato do encarregado na Política de Privacidade |
| Retenção declarada | Prazo de guarda por tipo de dado |

Os dez direitos do art. 18 estão implementados como itens navegáveis: confirmação de tratamento,
acesso, correção, anonimização ou eliminação, portabilidade, eliminação de dados consentidos,
informação sobre compartilhamento, informação sobre a negativa de consentimento, revogação do
consentimento e revisão de decisão automatizada.

**Verificação.** A exclusão total de conta é coberta por teste automatizado — o teste confirma que
nenhuma coleção retém dado do usuário após a exclusão.

**Ressalva.** O protótipo é client-side: os dados ficam no `localStorage`, sem criptografia e sem
controle de acesso real. A conformidade **estrutural** existe; a conformidade **efetiva** depende
das regras de segurança do Firestore e das Cloud Functions previstas para a etapa final.

### Lei nº 8.078/1990 — Código de Defesa do Consumidor

Aplica-se quando há fornecedor profissional na relação. Em negociação entre duas pessoas físicas
não profissionais, a aplicação é discutível; quando o vendedor é empresa, incide integralmente.

**Impacto.** Os Termos de Uso delimitam o papel da plataforma como **intermediadora**, não como
proprietária ou fornecedora do material. A responsabilidade pela veracidade, procedência,
qualidade e legalidade do material anunciado é do anunciante. A plataforma responde pelo
funcionamento do serviço que oferece.

> **Correção de agosto de 2026 — limite dessa delimitação.** Uma versão anterior desta página
> tratava a condição de intermediadora como se afastasse a responsabilidade da plataforma. A
> verificação externa apurou que **a jurisprudência brasileira não sustenta essa leitura**. O
> Superior Tribunal de Justiça tem responsabilizado plataformas intermediadoras, que têm **dever
> de informação transparente sobre o vendedor** e podem responder por publicidade enganosa ou por
> fraude praticada por meio do serviço. A cláusula de intermediação **reduz**, mas não elimina, a
> exposição.
>
> **Consequência de projeto.** A defesa da plataforma não está no texto do contrato, e sim na
> **diligência demonstrável**: verificação de identidade do anunciante, termos claros, canal de
> denúncia, trilha de auditoria e mediação de disputa — todos já implementados no protótipo e
> descritos em [Fluxo de interação](14-fluxo-de-interacao). O que era argumento contratual passa a
> ser requisito funcional.
>
> A análise da extensão exata dessa responsabilidade é matéria jurídica e **está fora da
> competência técnica da equipe**. O que se afirma aqui é apenas que a redação anterior era
> imprecisa e que a diligência é o caminho de mitigação.

### Lei nº 12.965/2014 — Marco Civil da Internet

Define responsabilidade de provedor de aplicação, guarda de registros de acesso e o procedimento
de remoção de conteúdo.

**Impacto.** Justifica a trilha de auditoria (`audit_logs`), o canal de denúncia de anúncio e o
fluxo de moderação. A remoção de conteúdo segue notificação, não juízo próprio arbitrário.

### Resolução CONAMA nº 307/2002

Classifica os resíduos da construção civil em quatro classes e atribui ao gerador a
responsabilidade pela destinação.

| Classe | Composição | Situação quanto ao reaproveitamento |
|---|---|---|
| **A** | Agregados: concreto, argamassa, cerâmica, alvenaria | Reutilizável ou reciclável como agregado |
| **B** | Plástico, papel, papelão, metal, vidro, madeira, gesso | Reciclável para outras destinações |
| **C** | Sem tecnologia de recuperação economicamente viável | Não aproveitável |
| **D** | Perigoso: tinta, solvente, óleo, material com amianto | Destinação controlada; **não anunciável** |

**Impacto.** As classes A e B correspondem ao material que a plataforma se propõe a intermediar; a
classe D é vedada nos Termos de Uso. A classificação dá base normativa às nove categorias do
protótipo.

### MTR / SINIR — Manifesto de Transporte de Resíduos

> **Atualização de agosto de 2026.** A verificação externa indica que a emissão do MTR passou a
> ser **obrigatória em âmbito nacional a partir de abril de 2025**, com cadastro das empresas no
> sistema SINIR. Uma versão anterior desta página tratava o MTR apenas como "orientação útil".

O MTR rastreia o resíduo da geração até a destinação final. No estado de São Paulo há ainda o
**SIGOR**, sistema da CETESB com módulo específico para construção civil.

**Aplicação ao caso do HandMade — com a incerteza declarada.** Quando uma empresa transfere resíduo
para outra pessoa jurídica, a exigência de MTR é provável, pois a empresa figura como geradora.
Em negociação **entre duas pessoas físicas**, a aplicabilidade é menos clara. Essa ambiguidade
**não foi resolvida** pela pesquisa e é matéria de consulta ao órgão ambiental — não de dedução da
equipe.

**Consequência de projeto.** Reforça o oitavo critério de diferenciação frente aos generalistas:
nenhuma das plataformas dominantes oferece apoio a essa obrigação. Ao mesmo tempo, obriga o
projeto a ser cauteloso: a plataforma **orienta**, não emite o documento nem se responsabiliza
pelo cumprimento — que é do gerador.

### Lei nº 17.260/2020 — compras públicas do **município de São Paulo**

Determina que a administração pública **da cidade de São Paulo** incorpore critérios
socioambientais nas contratações, inclusive o uso de material reciclado e reutilizado em obras
públicas quando disponível e economicamente viável.

> **Atenção ao alcance.** Trata-se de legislação **municipal da capital**, e portanto **não se
> aplica a Mogi Guaçu** nem aos demais municípios do raio inicial. A verificação externa
> apresentou essa norma como se fosse estadual; a conferência da fonte mostrou que é municipal.

**Por que ainda assim é registrada aqui.** Indica um vetor de **demanda** que o projeto não havia
considerado — o poder público como comprador de material reaproveitado — e serve de precedente
normativo. Para que fosse aproveitável na região, seria preciso verificar se os municípios do raio
inicial têm norma equivalente. Registrado como **oportunidade a investigar**, não como mercado
endereçado: o protótipo não tem fluxo de compra pública.

### Legislação tributária

Implementada como conteúdo orientativo no guia de tributos, com trilhas por perfil:

| Perfil | Obrigações tratadas |
|---|---|
| Pessoa física | Venda eventual de bem próprio; ganho de capital; quando a atividade habitual exige formalização |
| MEI | Limite anual, DAS mensal, DASN-SIMEI, o que fazer ao ultrapassar o teto |
| Simples Nacional | DAS, DEFIS, NF-e, CFOP, CSOSN |

### Valores de referência vigentes em 2026

Conferidos na verificação externa de agosto de 2026:

| Parâmetro | Valor | Observação |
|---|---|---|
| Teto anual do MEI | **R$ 81.000,00** | Houve proposta de elevação para R$ 140.000,00, **não aprovada**. O limite segue em R$ 81 mil |
| Teto anual do Simples Nacional | **R$ 4.800.000,00** | Estável |
| Anexo aplicável ao comércio de material | **Anexo III**, alíquota inicial de 6% | Sobre os primeiros R$ 180 mil de receita |
| Anexo aplicável a construtora | **Anexo IV**, alíquota inicial de 20% | Sobre os primeiros R$ 180 mil de receita |

**Correção registrada.** O enquadramento do comércio de mercadorias no Simples Nacional
corresponde usualmente ao **Anexo I**. A pesquisa externa indicou o Anexo III (serviços) para
"comércio de materiais". A divergência **não foi resolvida** e está registrada como pendência: o
enquadramento correto depende do CNAE efetivo da atividade e deve ser confirmado com contador
antes de constar na monografia como afirmação.

### ICMS sobre sucata em São Paulo — a confirmar

A verificação externa indica a existência de **diferimento de ICMS** na venda de sucata e resíduo
no estado de São Paulo, o que reduziria a carga sobre a operação. A explicação recebida sobre o
mecanismo do diferimento estava, porém, tecnicamente confusa, e **nenhuma fonte oficial da
Secretaria da Fazenda foi apresentada**. Registrado como **indício a confirmar** no RICMS/SP, não
como benefício assegurado.

**Ressalva registrada no próprio aplicativo.** O guia é **conteúdo informativo**, não consultoria
tributária. A orientação de procurar contador consta na tela.

## 2. Normas técnicas

| Norma | Aplicação |
|---|---|
| **WCAG 2.2 (W3C)** | Nível AA. Sete critérios verificados em 48 telas, com 0 falha — ver [Testes e qualidade](18-testes-e-qualidade) |
| **ISO/IEC 25010** | Atributos de qualidade de produto de software, usados como critério de avaliação |
| **ABNT NBR 14724** | Estrutura do trabalho acadêmico (monografia) |
| **ABNT NBR 10520** | Citações em texto, formato autor-data |
| **ABNT NBR 6023** | Referências bibliográficas |
| **Material Design 3** | Diretrizes de interface para a etapa Flutter |

## 3. Legislação estadual e municipal

| Esfera | Situação |
|---|---|
| Estadual (São Paulo) | A política estadual de resíduos sólidos e as normas da CETESB incidem sobre licenciamento e transporte de resíduos. **A ser levantado em detalhe** |
| Municipal (Mogi Guaçu) | Plano municipal de gestão de resíduos, regras de caçamba e alvará para atividade comercial. **A ser levantado em detalhe** |

Declarado como pendência em vez de afirmado genericamente: citar norma municipal sem consultar o
texto vigente seria afirmação sem lastro.

## 4. Documentos contratuais

### Implementados no protótipo

**Termos de Uso** — versão 2.0, com doze seções: aceitação; quem pode usar; papel da HandMade na
negociação; regras para anúncios; pagamento direto e taxa de serviço; proteção ao comprador;
condutas vedadas; propriedade intelectual; obrigações fiscais do vendedor; suspensão e
encerramento; alterações; lei aplicável e foro.

*Finalidade:* delimitar o que a plataforma faz e o que não faz, e estabelecer as regras de conduta.
É o documento que sustenta a suspensão de conta em caso de descumprimento.

**Política de Privacidade** — versão 2.0, com doze seções: quem trata os dados; dados coletados e
finalidade; bases legais; compartilhamento; transferência internacional; prazo de guarda; direitos
do titular; consentimento no aplicativo; cookies e armazenamento local; crianças e adolescentes;
cuidados com os dados; alterações.

*Finalidade:* cumprir o dever de informação da LGPD e viabilizar o exercício dos direitos do
titular.

Ambos são **versionados**, e o aceite registra a versão vigente — sem isso, não é possível
demonstrar a que texto o usuário consentiu.

### Necessários para a operação real — não redigidos

| Documento | Finalidade |
|---|---|
| Contrato de prestação de serviços | Formalizar a relação entre a plataforma e o vendedor assinante, com escopo, prazo e condições de pagamento |
| Contrato com provedor de pagamento | Reger a relação com o adquirente que processa PIX, cartão e boleto |
| Acordo de confidencialidade (NDA) | Proteger informação sensível em parcerias com cooperativas e empresas |
| Contrato de suporte | Definir prazo de resposta por plano — hoje apenas anunciado nos planos |
| Contrato de parceria com cooperativas | Reger a relação prevista na estratégia de entrada regional |
| Política de moderação | Documentar o critério de remoção de anúncio e suspensão de conta |

Estes seis são **pendência declarada**. O protótipo tem os dois documentos que o usuário final
precisa aceitar; os contratos de operação pressupõem a existência jurídica da empresa, que não
existe — o CNPJ usado no protótipo é explicitamente fictício.

## 5. Como as normas moldaram o produto

| Norma | Decisão técnica resultante |
|---|---|
| LGPD art. 8º | Consentimento com data, hora e versão em coleção própria (`consents`) |
| LGPD art. 18 | Central de privacidade com exportação e exclusão, coberta por teste |
| LGPD — coleta mínima | Documentos guardados apenas pelos quatro últimos dígitos |
| Marco Civil | Trilha de auditoria e fluxo de denúncia |
| CDC | Termos que delimitam o papel de intermediadora |
| PNRS | Escopo do que é anunciável; proposta de valor para empresas |
| CONAMA 307 | Categorias de material e orientação sobre o manifesto de transporte |
| WCAG 2.2 AA | Paleta resolvida por cálculo; alvo mínimo de toque; rótulo em todo campo |
| Legislação tributária | Guia por perfil fiscal, com ressalva de não ser consultoria |

## 6. Riscos jurídicos identificados

| Risco | Tratamento previsto |
|---|---|
| Anúncio de material de origem irregular | Termos vedam expressamente; denúncia e moderação; trilha de auditoria |
| Responsabilidade por vício do material | Termos delimitam o papel de intermediadora; responsabilidade do anunciante |
| Vazamento de dados pessoais | Coleta mínima; regras de segurança do Firestore na etapa final; DPO identificado |
| Venda de resíduo sem documentação fiscal | Guia de tributos e orientação sobre nota fiscal por perfil |
| Uso por menor de 18 anos | Termos vedam; conta suspensa e dados excluídos ao ser identificado |
| Descumprimento de prazo de estorno | Prazo declarado por método de pagamento no próprio aplicativo |

---

**Limite declarado.** Este levantamento foi feito por estudantes do ensino técnico, sem revisão
por profissional do direito. Os Termos de Uso e a Política de Privacidade implementados são
**conteúdo acadêmico de protótipo** e não substituem documento jurídico validado. Antes de qualquer
operação real, ambos exigem revisão por advogado, e as pendências das seções 3 e 4 precisam ser
resolvidas.

Referências completas em [Referências](21-referencias).
