# 1.1 Introdução e visão geral

*Seção sob responsabilidade de Vinicius Santana dos Santos.*

## O que é o HandMade

O HandMade é um **marketplace mobile voltado à economia circular**. A plataforma conecta pessoas
e empresas que possuem materiais excedentes ou reutilizáveis a quem precisa desses materiais
como matéria-prima, permitindo comprar, vender, doar ou trocar.

O escopo são materiais que ainda têm valor comercial e produtivo, mas que hoje seguem para
descarte por falta de um canal adequado: madeira de demolição e sobras de forma, pedras
ornamentais, metais, plásticos, vidro, componentes elétricos e eletrônicos, ferragens e sobras
de construção em geral.

## Por que este projeto existe

A escolha do tema partiu de uma observação concreta na região de Mogi Guaçu: sobra de obra é
tratada como entulho por quem a gera e comprada como matéria-prima cara por quem a consome —
duas partes com interesses complementares que não se encontram.

Um pedreiro autônomo paga por caçamba para descartar tábuas que ainda servem. A poucos
quilômetros, uma artesã roda ferros-velhos e marcenarias procurando exatamente aquele material.
Nenhum dos dois tem como saber da existência do outro. É essa falha de encontro que o projeto
ataca.

O problema é detalhado, com dados da pesquisa de campo, em
[Problema encontrado](04-problema-encontrado).

## Como o sistema funciona

O fluxo central tem dois lados que se encontram no anúncio:

**Quem oferece** publica o material em três etapas — fotos, dados do material (categoria,
condição, quantidade, tipo de negociação) e preço com localização e forma de entrega. O anúncio
entra no marketplace e pode ser pausado, editado, impulsionado ou marcado como vendido a
qualquer momento.

**Quem procura** busca por texto, categoria, condição, faixa de preço e distância; abre o
anúncio; conversa pelo chat; e conclui a compra pagando diretamente por PIX, cartão ou boleto.
O pedido avança por estados rastreáveis até a confirmação de recebimento e a avaliação mútua.

A plataforma se sustenta por três fontes: taxa de serviço sobre a venda concluída (variável
conforme o plano do vendedor), assinaturas mensais e venda avulsa de impulsionamento de
anúncios.

## Estágio atual do trabalho

O projeto tem dois artefatos, e a distinção entre eles é essencial para entender qualquer
afirmação desta documentação:

| | Protótipo — **existe hoje** | Aplicativo final — **planejado** |
|---|---|---|
| Tecnologia | React 18, Vite 5, TypeScript 5 | Flutter (Dart) com padrão BLoC |
| Dados | `localStorage` do navegador | Cloud Firestore (NoSQL) |
| Autenticação | Simulada no cliente | Firebase Authentication |
| Servidor | Nenhum | Cloud Functions (serverless) |
| Distribuição | Página web mobile-first | Aplicativo Android e iOS |
| Situação | **Concluído e verificado (v5.0)** | **Não iniciado** |

O protótipo é um **demonstrador navegável de alta fidelidade**: reproduz as telas, os fluxos e
as interações do aplicativo pretendido, com dados simulados, para validar a experiência antes de
escrever o código nativo. Ele não tem backend, API nem banco de dados.

Essa estratégia reduz retrabalho: erros de fluxo e de interface aparecem enquanto corrigi-los
custa pouco, e não depois da implementação em Flutter.

### O que já está verificado

| Indicador | Valor |
|---|---|
| Telas | 48 cheias + 7 sobreposições = 55 |
| Pontos de interação | 272 |
| Rotas de navegação | 31 |
| Testes automatizados | 94 de 94 aprovados |
| Fluxos ponta a ponta | 36 de 36 aprovados |
| Acessibilidade | 48 telas auditadas, 0 problema |

Os métodos e instrumentos que produzem esses números estão em
[Testes e qualidade](18-testes-e-qualidade).

## Organização desta documentação

A Wiki segue a estrutura exigida pela atividade e está dividida entre os quatro integrantes,
cada um responsável por um grupo de páginas:

1. **Introdução** — visão geral, equipe, descrição do TCC, área de atuação, problema e solução.
2. **Estudo de viabilidade** — operacional, técnica, de cronograma e econômica.
3. **Levantamento de requisitos** — entrevista, questionário e análise dos resultados.
4. **Prototipagem** — requisitos, personas, fluxo de dados, heurísticas, telas e UI/UX.
5. **Estudo do cliente** — perfis, classificação e estratégias de relacionamento.
6. **Área de atuação por região** — microrregião de lançamento e plano de expansão.
7. **Concorrentes** — diretos, indiretos e comparação.
8. **Legislação e aspectos contratuais** — leis aplicáveis e modelos de documento.

A divisão nominal está em [Integrantes e funções](02-integrantes-e-funcoes).

## Limites declarados

Para que a leitura seja honesta quanto ao alcance do trabalho:

- **Não houve teste com usuário real** nesta versão do protótipo. As métricas de usabilidade
  documentadas são alvos de projeto, com protocolo pronto para execução, e não resultados
  observados.
- **Não houve teste com leitor de tela.** A conformidade de acessibilidade verificada é a
  automatizável — sete critérios mensuráveis da WCAG 2.2 nível AA.
- **O aplicativo em Flutter não foi iniciado.** Toda afirmação sobre Firebase, Cloud Functions
  ou publicação em loja refere-se a planejamento, não a implementação.

Declarar esses limites é parte do método: uma documentação que sugere evidência inexistente
compromete tudo o que afirma.
