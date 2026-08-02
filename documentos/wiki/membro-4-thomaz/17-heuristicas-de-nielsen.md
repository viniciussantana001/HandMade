# 4.6 Heurísticas de Nielsen

**Responsável:** Thomaz de Moraes Teixeira

Avaliação heurística conforme Nielsen (1994), aplicada tela a tela sobre as 24 rotas do protótipo.

**Por que este método nesta fase.** A inspeção heurística encontra a maior parte dos problemas de
interface a um custo muito menor que o teste com usuário e não depende de recrutamento. Não
substitui o teste com usuário — que não foi executado, conforme declarado em
[Testes e qualidade](18-testes-e-qualidade) —, mas antecede-o com proveito.

Cada heurística abaixo traz **como o protótipo a atende** e **onde isso pode ser verificado no
código**. Sem a evidência, a análise seria apenas opinião.

---

## 1. Visibilidade do estado do sistema

*O sistema deve manter o usuário informado sobre o que está acontecendo.*

**Como é atendida.** O carregamento usa esqueleto com a **silhueta real do conteúdo** que virá, e
não um indicador genérico — a tela comunica o formato do que está por vir. Botões de envio entram
em estado de espera durante o processamento. O pagamento tem uma tela própria de processamento,
com aviso para não fechar o aplicativo. A situação do pedido é exibida em todas as telas onde ele
aparece.

**Evidência.** `components/common/StateViews.tsx`, `pages/Checkout.tsx`

**Correção derivada.** Na versão 4.0, ações como pausar um anúncio não davam retorno visível — era
preciso recarregar a página. Hoje a store notifica os assinantes e a lista se atualiza sozinha.

---

## 2. Correspondência entre o sistema e o mundo real

*Falar a linguagem do usuário, com conceitos familiares.*

**Como é atendida.** O vocabulário é o do canteiro de obra: "sobra", "lote", "retirada no local",
"para retirada", "usado — precisa reparo". As unidades são as que o público usa — quilo, tonelada,
metro, litro, caixa, unidades —, não uma unidade genérica. As categorias nomeiam material
("Madeira", "Pedras", "Ferragens"), não departamentos comerciais.

**Evidência.** `lib/categories.ts`

**Decisão relacionada.** Termos técnicos do sistema não aparecem na interface. O usuário lê
"Aguardando pagamento", não o identificador interno do estado.

---

## 3. Controle e liberdade do usuário

*O usuário precisa de uma saída de emergência claramente marcada.*

**Como é atendida.** Exclusão de anúncio e de favorito oferecem **desfazer**. Todo fluxo em etapas
— cadastro, publicação, pagamento, impulsionamento — permite voltar ao passo anterior sem perder o
preenchimento. Diálogos podem ser fechados. O impulsionamento tem "Cancelar" visível em todas as
etapas.

**Evidência.** `pages/MyListings.tsx`, `pages/BoostListing.tsx`

---

## 4. Consistência e padrões

*O mesmo elemento deve significar a mesma coisa em todo o sistema.*

**Como é atendida.** Estados de vazio, erro e carregamento estão centralizados em um único módulo,
o que impede que telas diferentes tratem a mesma situação de formas distintas. A ação primária
ocupa sempre a mesma posição e recebe sempre o verde da marca. Os cartões de anúncio têm a mesma
estrutura no marketplace, nos favoritos e em "Meus anúncios".

**Evidência.** `components/common/StateViews.tsx`, `components/listings/ListingCard.tsx`

**Correção derivada.** Foram encontrados 42 casos de link envolvendo botão — conteúdo interativo
aninhado, proibido pelo HTML e inconsistente para leitor de tela. Todos migrados para uma
composição que renderiza um único elemento.

---

## 5. Prevenção de erros

*Melhor que uma boa mensagem de erro é evitar que o erro aconteça.*

**Como é atendida.** Validação **por etapa**: o usuário só avança com os campos obrigatórios
corretos, e não descobre no fim que errou no começo. CPF e CNPJ são validados por dígito
verificador, com máscara durante a digitação. A senha tem medidor de força em tempo real. Ação
destrutiva exige confirmação em diálogo. Impulsionar anúncio de outra pessoa é bloqueado antes de
qualquer efeito.

**Evidência.** `pages/CreateListing.tsx`, `lib/validators.ts`,
`components/common/ConfirmDialog.tsx`

---

## 6. Reconhecer em vez de lembrar

*Minimizar a carga de memória do usuário.*

**Como é atendida.** Categoria, condição e tipo de negociação são escolhidos em lista visual com
ícone, não digitados. A busca oferece sugestões. O anúncio vinculado permanece visível no topo da
conversa, para contexto. O formulário de edição abre com todos os dados preenchidos. O valor e a
taxa aparecem na confirmação do pagamento — o usuário não precisa lembrar quanto era.

**Evidência.** `pages/CreateListing.tsx`, `pages/Chat.tsx`, `pages/Checkout.tsx`

---

## 7. Flexibilidade e eficiência de uso

*Atalhos para o usuário experiente, sem atrapalhar o iniciante.*

**Como é atendida.** A busca aceita texto livre e também filtros combináveis — categoria,
condição, faixa de preço e distância. O marketplace alterna entre grade e lista. A navegação
inferior dá acesso permanente às cinco áreas principais em um toque. Métodos de pagamento salvos
aceleram a compra seguinte.

**Evidência.** `pages/Marketplace.tsx`, `components/layout/BottomNav.tsx`

---

## 8. Estética e design minimalista

*Cada elemento extra compete com os relevantes.*

**Como é atendida.** Uma ação primária por tela; as demais em hierarquia visual inferior. A
hierarquia vem de **tamanho e peso**, não de cor saturada nem de opacidade. Nenhum elemento existe
apenas para decorar.

**Evidência.** `src/index.css`

**Correção derivada.** Escalas construídas com opacidade sobre gradiente reduziam o contraste real
sem que isso aparecesse no valor declarado da cor. Substituídas por variação de tamanho e peso.

---

## 9. Ajudar o usuário a reconhecer, diagnosticar e recuperar-se de erros

*Mensagem em linguagem comum, com indicação da solução.*

**Como é atendida.** Toda mensagem de erro diz o próximo passo: "tente outra foto", "confira o
número do cartão", "cartão recusado pelo emissor — verifique os dados ou use outro método". Um
componente de captura de erro substitui a tela em branco por uma mensagem com caminho de retorno.
A rota inexistente mostra página 404 com saída, não erro do navegador.

**Evidência.** `components/common/ErrorBoundary.tsx`, `pages/NotFound.tsx`, `lib/payments.ts`

**Verificação.** A ausência de tela branca é medida, não afirmada. **Definição operacional**,
fixada antes da medição: raiz da aplicação com menos de 40 caracteres de texto visível. Resultado:
**0 ocorrências em 36 verificações**.

---

## 10. Ajuda e documentação

*A informação deve ser fácil de localizar e focada na tarefa.*

**Como é atendida.** Central de ajuda com perguntas frequentes; página "Como funciona" com trilhas
separadas para quem vende e quem compra; Termos de Uso e Política de Privacidade como telas do
próprio aplicativo; central de privacidade com os direitos do titular; e guia de tributos com
orientação por perfil fiscal — pessoa física, MEI e Simples Nacional.

**Evidência.** `pages/Help.tsx`, `pages/HowItWorks.tsx`, `pages/SellerTaxes.tsx`,
`pages/PrivacyCenter.tsx`

---

## Percurso cognitivo das tarefas de maior risco

Complementando a inspeção heurística, foi aplicado percurso cognitivo às três tarefas de maior
risco, na perspectiva das personas de menor familiaridade digital — **Carlos e Dona Marlene**. Em
cada passo pergunta-se: o usuário vai tentar a ação correta? Vai perceber que o controle existe?
Vai associar o controle ao efeito? Vai entender o retorno do sistema?

| Tarefa | Passo de maior risco | Correção aplicada |
|---|---|---|
| Publicar anúncio | Reconhecer que a foto vem da galeria do próprio celular | Seletor com rótulo explícito e área de toque ampla |
| Concluir compra | Entender o valor final antes de confirmar | Taxa e total discriminados no passo de confirmação |
| Encerrar sessão | Perceber que a sessão terminou | Redirecionamento imediato ao login, sem tela branca |

## Síntese

| # | Heurística | Situação |
|---|---|:-:|
| 1 | Visibilidade do estado do sistema | Atendida |
| 2 | Correspondência com o mundo real | Atendida |
| 3 | Controle e liberdade | Atendida |
| 4 | Consistência e padrões | Atendida |
| 5 | Prevenção de erros | Atendida |
| 6 | Reconhecer em vez de lembrar | Atendida |
| 7 | Flexibilidade e eficiência | Atendida |
| 8 | Estética e design minimalista | Atendida |
| 9 | Recuperação de erros | Atendida e verificada |
| 10 | Ajuda e documentação | Atendida |

**Limite da avaliação.** Inspeção heurística é conduzida por quem desenvolve o sistema, o que
introduz viés conhecido: o avaliador sabe onde as coisas estão. Ela indica ausência de violação
aberta, não usabilidade comprovada. A comprovação exigiria teste com usuário real, não executado
nesta versão — ver [Testes e qualidade](18-testes-e-qualidade).

Referência completa em [Referências](21-referencias).
