# 4.2 Requisitos funcionais

**Responsável:** Nathan Costa Batista

Requisitos do que o sistema deve fazer. A coluna **Situação** distingue o que está implementado no
protótipo do que pertence à etapa Flutter + Firebase — distinção essencial para que nenhuma
afirmação desta Wiki sugira recurso inexistente.

Legenda: **Implementado** = funciona no protótipo 5.0 · **Planejado** = especificado para o
aplicativo final

## Cadastro e acesso

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-01 | Cadastrar pessoa física | Cadastro em três etapas: dados pessoais (nome, CPF, nascimento), contato (e-mail, telefone, cidade, estado) e senha com aceite dos termos | Implementado |
| RF-02 | Cadastrar pessoa jurídica | Cadastro em três etapas: dados empresariais (CNPJ, razão social, nome fantasia, segmento), responsável e senha com descrição da empresa | Implementado |
| RF-03 | Validar documentos | CPF e CNPJ verificados por dígito verificador, com máscara automática durante a digitação | Implementado |
| RF-04 | Autenticar usuário | Entrada por e-mail e senha, com sessão persistente | Implementado |
| RF-05 | Indicar força da senha | Medidor em tempo real durante a criação da senha | Implementado |
| RF-06 | Editar perfil | Alteração de dados cadastrais, foto e preferências | Implementado |
| RF-06a | Recuperar senha | Envio de e-mail de redefinição | Planejado — exige serviço de e-mail |
| RF-06b | Entrar com provedor social | Autenticação por conta Google | Planejado — exige Firebase Authentication |
| RF-06c | Verificar e-mail | Confirmação do endereço no cadastro | Planejado — exige serviço de e-mail |

## Anúncios

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-07 | Publicar anúncio | Publicação em três etapas: fotos (até 8), dados do material e preço com localização | Implementado |
| RF-08 | Classificar material | 9 categorias (madeira, pedras, metais, elétrico, plástico, vidro, eletrônico, construção, outros), 4 condições e 3 tipos de negociação (venda, doação, troca) | Implementado |
| RF-09 | Selecionar fotos do dispositivo | Escolha da galeria ou captura pela câmera, com pré-visualização e remoção individual | Implementado |
| RF-10 | Buscar e filtrar | Busca por texto com sugestões, combinada a filtros de categoria, condição, faixa de preço e localização | Implementado |
| RF-11 | Visualizar detalhe do anúncio | Galeria de fotos, dados do material, vendedor, reputação e ações disponíveis | Implementado |
| RF-12 | Gerenciar anúncios | Editar, pausar, reativar, marcar como vendido e excluir, com confirmação em ação destrutiva e atualização imediata da lista | Implementado |
| RF-13 | Favoritar | Marcar e desmarcar anúncio, com lista própria | Implementado |
| RF-14 | Impulsionar anúncio | Compra de destaque por 3, 7 ou 15 dias, com pagamento por PIX, cartão ou boleto | Implementado |

## Negociação e pedidos

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-15 | Conversar com o anunciante | Chat vinculado ao anúncio, com lista de conversas e contador de não lidas | Implementado |
| RF-16 | Concluir compra | Fluxo em três passos — método, confirmação e recibo —, com valor e taxa discriminados antes de confirmar | Implementado |
| RF-17 | Pagar por múltiplos métodos | PIX (aprovação imediata), cartão de crédito (até 12 parcelas) e boleto (compensação em até 3 dias úteis) | Implementado |
| RF-18 | Emitir recibo | Recibo com código próprio (`HM-AAAA-NNNNNN`) e código de autorização | Implementado |
| RF-19 | Acompanhar pedido | Oito estados rastreáveis com histórico de transições | Implementado |
| RF-20 | Consultar pagamentos | Histórico do que foi pago e recebido, com método, situação e código | Implementado |
| RF-21 | Avaliar negociação | Avaliação mútua após a conclusão, alimentando a reputação | Implementado |
| RF-21a | Registrar rastreio de envio | Código e transportadora no pedido | Implementado |
| RF-21b | Abrir disputa | Contestação de pedido com mediação | Implementado (registro) — mediação depende de operação real |

## Área do vendedor

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-22 | Consultar painel de desempenho | Visualizações, contatos recebidos, anúncios ativos e valor recebido | Implementado |
| RF-23 | Assinar plano | Gratuito, Pro (R$ 29,90) e Empresarial (R$ 89,90), com pagamento por PIX, cartão ou boleto | Implementado |
| RF-24 | Consultar orientação tributária | Guia por perfil fiscal — pessoa física, MEI, Simples Nacional —, com DAS, NFC-e e NF-e | Implementado |
| RF-24a | Consultar plano de negócio | Tela com receita, custo, ponto de equilíbrio e projeção calculados | Implementado |

## Notificações e apoio

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-25 | Receber notificações internas | Central com mensagem, proposta, pedido, avaliação e impulsionamento | Implementado |
| RF-26 | Consultar ajuda | Central de ajuda e página "Como funciona" | Implementado |
| RF-26a | Receber notificação push | Aviso fora do aplicativo | Planejado — exige Firebase Cloud Messaging |

## Conformidade e privacidade (LGPD)

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-27 | Registrar consentimento | Aceite de termos e privacidade com data, hora e versão do documento (art. 8º) | Implementado |
| RF-28 | Consultar documentos legais | Termos de Uso e Política de Privacidade como telas do aplicativo | Implementado |
| RF-29 | Exercer direitos do titular | Central de privacidade com exportação e exclusão de dados (art. 18) | Implementado |
| RF-30 | Denunciar anúncio | Registro de denúncia com motivo | Implementado |

## Administração

| # | Requisito | Descrição | Situação |
|---|---|---|:-:|
| RF-31 | Moderar conteúdo | Análise de anúncios, usuários e denúncias | Planejado — exige painel administrativo e backend |
| RF-32 | Registrar trilha de auditoria | Log de ações relevantes para conformidade | Implementado (registro local) |
| RF-33 | Gerenciar categorias | Criação e edição de categorias da plataforma | Planejado |

## Resumo

| Situação | Quantidade |
|---|:-:|
| Implementados no protótipo 5.0 | 33 |
| Planejados para a etapa Flutter + Firebase | 7 |

Os requisitos planejados dependem, sem exceção, de infraestrutura que o protótipo não possui:
serviço de e-mail, autenticação federada, mensagem push e painel administrativo com servidor.

## Rastreabilidade

Cada requisito implementado corresponde a uma rota ou módulo verificável no código:

| Requisito | Onde está |
|---|---|
| RF-01 a RF-05 | `pages/Register.tsx`, `pages/Login.tsx`, `lib/validators.ts` |
| RF-07 a RF-09 | `pages/CreateListing.tsx`, `components/common/PhotoPicker.tsx` |
| RF-10, RF-11 | `pages/Marketplace.tsx`, `pages/ListingDetail.tsx` |
| RF-12 | `pages/MyListings.tsx`, `pages/EditListing.tsx` |
| RF-14 | `pages/BoostListing.tsx` |
| RF-16 a RF-18 | `pages/Checkout.tsx`, `pages/PaymentReceipt.tsx`, `lib/payments.ts` |
| RF-19, RF-20 | `pages/MyOrders.tsx`, `pages/MyPayments.tsx` |
| RF-22 | `pages/Dashboard.tsx` |
| RF-23 | `pages/Plans.tsx`, `lib/plans.ts` |
| RF-24, RF-24a | `pages/SellerTaxes.tsx`, `pages/BusinessPlan.tsx`, `lib/business.ts` |
| RF-27 a RF-29 | `pages/LegalDocument.tsx`, `pages/PrivacyCenter.tsx`, `lib/legal.ts` |

A verificação de que esses fluxos funcionam de ponta a ponta está em
[Testes e qualidade](18-testes-e-qualidade).
