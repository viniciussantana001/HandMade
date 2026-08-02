# 4.7 Telas do protótipo

**Responsável:** Nathan Costa Batista

O protótipo 5.0 tem **48 telas cheias e 7 sobreposições** (55 no total), com **272 pontos de
interação** distribuídos por **31 rotas**. As capturas estão em `documentos/telas/` e foram
geradas em navegador real, viewport 412 × 915 com `deviceScaleFactor` 3.

> **Nota sobre a ferramenta.** A atividade sugere protótipo em Figma. Este projeto usa um
> demonstrador **navegável e funcional** em React, e não telas estáticas: os fluxos são
> percorríveis de ponta a ponta, com validação real, persistência entre telas e estados de erro.
> A fidelidade é maior que a de um protótipo de alta fidelidade em ferramenta de design, e as
> capturas abaixo saem do artefato executável.

Para exibir uma imagem na Wiki do GitHub, use o endereço completo:
`https://raw.githubusercontent.com/<organizacao>/<repositorio>/main/documentos/telas/<arquivo>`

---

## Área pública

### Tela inicial — `01-home.png`

**Objetivo.** Apresentar a proposta a quem ainda não tem conta e conduzir à exploração ou ao
cadastro.

**Funcionalidades.** Destaques de materiais recentes, atalho para categorias, entrada para
marketplace, login e cadastro.

**Componentes.** Cabeçalho com identidade, cartões de anúncio com imagem responsiva, navegação
inferior, blocos de proposta de valor.

**Navegação.** É a raiz (`/`). Leva a `/marketplace`, `/login`, `/cadastro` e ao detalhe de
qualquer anúncio em destaque.

**Decisões de design.** O verde da marca aparece já na primeira tela para fixar identidade. A
prova de valor vem antes do pedido de cadastro: o usuário vê material real antes de decidir se
cria conta.

### Marketplace — `02-marketplace.png`

**Objetivo.** Permitir encontrar material específico.

**Funcionalidades.** Busca por texto com sugestões, filtro por categoria, condição, faixa de preço
e localização, alternância entre grade e lista, ordenação.

**Componentes.** Campo de busca com limpeza, chips de categoria, painel de filtros, grade de
cartões.

**Decisões de design.** O filtro por distância tem destaque porque material pesado tem raio
econômico curto — justificativa em [Microrregião e macrorregião](09-microrregiao-e-macrorregiao).
Os botões só de ícone (filtro e modo de exibição) receberam nome acessível após a auditoria.

### Detalhe do anúncio — `23-anuncio-detalhe.png`

**Objetivo.** Reunir tudo que o comprador precisa para decidir.

**Funcionalidades.** Galeria de fotos com contador, dados do material, perfil e reputação do
vendedor, ações de conversar, favoritar, comprar e denunciar.

**Decisões de design.** O contador de fotos e as setas do carrossel ficam sobre a imagem, o que
gerava contraste de 3,39:1 e 2,54:1 sobre foto clara. Foram corrigidos para 6,58:1 e 4,66:1. A
ação de denúncia existe, mas em hierarquia visual baixa: precisa estar acessível sem competir com
a ação principal.

### Login — captura em `documentos/telas/`

**Objetivo.** Autenticar com o menor atrito possível.

**Componentes.** Campos de e-mail e senha com rótulo associado, link de recuperação, entrada para
cadastro.

**Decisões de design.** O link "Esqueci minha senha" teve a área de toque ampliada para atender ao
mínimo de 24 × 24 px da WCAG 2.5.8.

### Cadastro — três etapas por perfil

**Objetivo.** Coletar os dados necessários sem sobrecarregar uma única tela.

**Etapas — pessoa física:** dados pessoais (nome, CPF, nascimento) → contato (e-mail, telefone,
cidade, estado) → senha e termos.

**Etapas — empresa:** dados empresariais (CNPJ, razão social, nome fantasia, segmento) →
responsável e contato → senha e descrição (até 300 caracteres).

**Decisões de design.** A divisão em três etapas reduz a carga cognitiva e permite validar por
etapa: o usuário só avança com os campos obrigatórios corretos. CPF e CNPJ são validados por
dígito verificador, com máscara durante a digitação. A senha tem medidor de força em tempo real.

### Como funciona e Central de ajuda — `18-como-funciona.png`, `17-ajuda.png`

**Objetivo.** Explicar o funcionamento a quem nunca usou e reduzir a barreira de desconfiança.

**Funcionalidades.** Trilhas separadas para quem vende e quem compra, perguntas frequentes.

---

## Área do usuário

### Painel do vendedor — `04-painel.png`

**Objetivo.** Centralizar o desempenho e servir de ponto de partida para a gestão.

**Funcionalidades.** Visualizações totais, contatos recebidos, anúncios ativos, valor recebido e
gráfico de desempenho.

**Decisões de design.** Os painéis com gradiente usavam uma parada translúcida que clareava o
verde e derrubava o texto branco a 3,99:1. Criou-se um tom opaco mais escuro para a parada. A
hierarquia deixou de vir de opacidade e passou a vir de tamanho e peso.

### Meus anúncios — `05-meus-anuncios.png`

**Objetivo.** Gerenciar todos os anúncios do vendedor em um lugar.

**Funcionalidades.** Abas de ativos, pausados e vendidos com contador; ações de editar, pausar,
reativar, marcar como vendido, impulsionar e excluir.

**Decisões de design.** Pausar, reativar e excluir **atualizam a lista imediatamente**, sem
recarregar a página — a store notifica os assinantes. Ação destrutiva exige confirmação e oferece
desfazer.

### Meus pedidos — `06-meus-pedidos.png`

**Objetivo.** Acompanhar negociações como comprador e como vendedor.

**Funcionalidades.** Lista com material, valor, situação atual e ações conforme o papel;
rastreamento de envio; abertura de disputa.

**Decisões de design.** São oito estados possíveis, com histórico de transições. A situação é
comunicada por texto e cor — nunca só por cor.

### Meus pagamentos — `07-meus-pagamentos.png`

**Objetivo.** Reunir o que foi pago e recebido.

**Funcionalidades.** Lançamentos com método, situação e código de autorização, separando venda,
compra e impulsionamento.

### Favoritos, Notificações e Perfil — `08`, `09`, `10`

**Favoritos:** lista dos anúncios marcados, com remoção e desfazer.
**Notificações:** central com mensagem, proposta, pedido, avaliação e impulsionamento; marcar
todas como lidas atualiza sem recarregar.
**Perfil:** dados, foto e acesso a edição, privacidade e tributos.

**Decisões de design.** Na edição de perfil, o campo de e-mail e o seletor de estado não tinham
rótulo associado — corrigido após a auditoria.

### Mensagens — `19-mensagens.png`

**Objetivo.** Conversar sobre um anúncio específico.

**Funcionalidades.** Lista de conversas com última mensagem e contador de não lidas; conversa com
o anúncio fixo no topo para contexto.

**Decisões de design.** A tela não ressincroniza por temporizador — a atualização vem da store
quando há alteração real, o que também é uma correção de desempenho.

---

## Fluxo de pagamento

Três passos visíveis, decisão central da versão 5.0.

### Escolha do método — `24-checkout-metodo.png`

PIX (aprovação imediata), cartão de crédito (até 12 parcelas) e boleto (compensação em até 3 dias
úteis). Cada opção mostra o prazo de liquidação.

### Confirmação — `25-checkout-confirmacao.png`

**Objetivo.** Eliminar surpresa antes do pagamento.

Valor do material, taxa de serviço aplicada conforme o plano e total discriminados **antes** de
confirmar. Atende diretamente a barreira central da persona Juliana.

### Recibo — `26-recibo.png`

Código próprio (`HM-AAAA-NNNNNN`), código de autorização, método e situação. Para PIX, código
copia-e-cola; para boleto, linha digitável e vencimento.

**Decisão de projeto.** Não existe saldo, depósito nem saque. O comprador paga o vendedor
diretamente, e a taxa é descontada no ato. Exigir depósito prévio aumentaria exatamente a
desconfiança que o produto precisa vencer.

---

## Impulsionamento — `20`, `21`, `22`

Fluxo próprio em rota dedicada (`/impulsionar/:id`), com três passos: escolha da duração (3, 7 ou
15 dias) → pagamento (PIX, cartão ou boleto) → conclusão.

**Decisões de design.** Na versão 4.0 o impulsionamento acontecia dentro de um diálogo e deixava a
tela branca ao fechar. Passou a ter rota própria, e os efeitos ocorrem antes da troca de etapa —
ao voltar para "Meus anúncios", o destaque já aparece. Com boleto, o destaque só é aplicado após a
compensação, e a tela final informa isso.

---

## Planos — `11-planos.png`

**Objetivo.** Apresentar as opções de assinatura e permitir contratar.

**Funcionalidades.** Gratuito (taxa de 5%), Pro (R$ 29,90, taxa de 3%) e Empresarial (R$ 89,90,
taxa de 2%, apenas para conta empresa). A contratação abre um passo de pagamento com escolha entre
PIX, cartão e boleto, encerrando em recibo.

**Decisões de design.** O plano Empresarial só aparece para conta empresa, com aviso para pessoa
física sobre como obtê-lo. O ponto em que a economia de taxa compensa a mensalidade é informado
explicitamente, em vez de deixado para o usuário calcular.

> A captura `11-planos.png` mostra a vitrine de planos. O passo de pagamento da assinatura foi
> acrescentado depois da geração das capturas e ainda **não está registrado em imagem** — item
> listado nas pendências.

---

## Conteúdo legal e orientação

| Tela | Arquivo | Conteúdo |
|---|---|---|
| Guia de tributos | `12-tributos.png` | Trilhas de pessoa física, MEI e Simples Nacional; DAS, NFC-e e NF-e |
| Plano de negócio | `13-plano-de-negocio.png` | Receita, custo, ponto de equilíbrio e projeção calculados |
| Central de privacidade | `14-privacidade.png` | Exportação e exclusão de dados (LGPD art. 18) |
| Termos de Uso | `15-termos.png` | Documento versionado, com registro de aceite |
| Política de Privacidade | `16-politica-privacidade.png` | Bases legais e direitos do titular |

---

## Estados e erros

| Tela | Arquivo | Situação |
|---|---|---|
| Após encerrar sessão | `27-pos-logout.png` | Redirecionamento imediato ao login |
| Voltar após encerrar sessão | `28-pos-logout-voltar.png` | Botão voltar do navegador não expõe conteúdo protegido |
| Rota inexistente | `29-404.png` | Página 404 com caminho de retorno |

As três correspondem a defeitos da versão 4.0 que produziam tela branca. Hoje são verificadas
automaticamente a cada execução do roteiro de fluxos.

---

## Navegação geral

```
Público:  Início → Marketplace → Detalhe do anúncio → Login/Cadastro
                                       ↓
Autenticado:  Painel ─┬─ Meus anúncios ─┬─ Publicar (3 etapas)
                      │                 ├─ Editar
                      │                 └─ Impulsionar (3 passos)
                      ├─ Meus pedidos → Pagamento (3 passos) → Recibo
                      ├─ Meus pagamentos
                      ├─ Mensagens → Conversa
                      ├─ Favoritos · Notificações
                      └─ Perfil ─┬─ Editar perfil
                                 ├─ Privacidade · Termos
                                 ├─ Planos → Pagamento → Recibo
                                 └─ Tributos · Plano de negócio
```

A navegação inferior dá acesso permanente a Início, Marketplace, Publicar, Mensagens e Perfil,
posicionada na base da tela e respeitando a área segura do sistema.

## Pendências de captura

| Item | Situação |
|---|---|
| Passo de pagamento da assinatura (`/planos`) | Não capturado — recurso posterior à geração das imagens |
| Telas de cadastro em imagem própria | As etapas constam nas figuras da monografia, não em `documentos/telas/` |
