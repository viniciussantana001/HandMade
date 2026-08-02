# 4.1 Processo de prototipagem

**Responsável:** Nathan Costa Batista

## Por que prototipar antes de implementar

O aplicativo final será escrito em Flutter, tecnologia que a equipe ainda não domina. Descobrir um
erro de fluxo depois de implementá-lo em Dart custa muito mais do que descobri-lo em um
demonstrador. O protótipo existe para que as decisões de interface e de fluxo sejam validadas
enquanto mudá-las ainda é barato.

A escolha de React, Vite e TypeScript para o protótipo — e não Flutter — é deliberada: a equipe
domina essa stack, o que permitiu construir 55 telas navegáveis no tempo disponível. Um protótipo
em tecnologia desconhecida teria produzido menos telas e mais defeitos, sem ganho para a validação.

## O que este protótipo é e o que não é

| É | Não é |
|---|---|
| Demonstrador navegável de alta fidelidade | Produto final |
| Reprodução fiel das telas e fluxos pretendidos | Aplicativo publicado em loja |
| Base de validação para a implementação em Flutter | Código a ser reaproveitado em Flutter |
| Persistência simulada em `localStorage` | Sistema com backend, API ou banco de dados |

O protótipo **não tem servidor**. Toda a persistência acontece no navegador, com prefixo `hm_v5_`,
em 13 coleções que simulam o que serão as coleções do Firestore. Isso permite que os fluxos sejam
percorridos de ponta a ponta — publicar, comprar, pagar, avaliar — sem infraestrutura.

## Método de trabalho

O protótipo evoluiu em versões, cada uma corrigindo o que a anterior revelou. O ciclo aplicado a
cada versão:

1. **Mapear** os fluxos a partir dos requisitos levantados.
2. **Construir** as telas e as interações.
3. **Percorrer** cada fluxo em navegador com viewport de celular.
4. **Medir** com instrumento automatizado — teste de fluxo e auditoria de acessibilidade.
5. **Corrigir** o que a medição apontou, e apenas isso.

O passo 4 é o que diferencia este processo de uma revisão visual. Um roteiro que percorre 24 rotas
nos temas claro e escuro encontra defeito que o olho não encontra: contraste de 2,14:1 em botão
que só aparece ao toque, alvo de toque de 20 px, campo sem rótulo associado.

## Evolução das versões

### Versão 4.0 → 5.0

A versão 5.0 partiu de defeitos concretos observados na 4.0:

| Defeito na 4.0 | Correção na 5.0 |
|---|---|
| Tela branca ao encerrar a sessão | Sessão observável; nenhuma tela protegida devolve conteúdo vazio |
| Tela branca após impulsionar anúncio | Impulsionamento com rota própria (`/impulsionar/:id`) e efeitos antes da troca de etapa |
| Carteira com saldo, depósito e saque | Removida por completo — pagamento direto em três passos |
| Imagem na resolução da miniatura em todas as telas | Imagem solicitada na largura do contexto de exibição |
| Lista de anúncios exigia recarregar a página após pausar | Store observável notifica os assinantes |

**A remoção da Carteira mudou o modelo de dados, não só a tela.** As coleções `transactions` e
`withdrawals` deram lugar a `payments`, e entraram `boosts` e `consents`. A versão 4.0 tinha 12
coleções; a 5.0 tem 13.

A decisão veio de uma barreira de usabilidade real: exigir depósito prévio na plataforma aumenta
exatamente a desconfiança que o produto precisa vencer.

### Comparação medida entre as versões

Números produzidos pelo mesmo roteiro (`documentos/qualidade/ferramentas/contar-telas.mjs`)
aplicado às duas versões, com critério declarado no cabeçalho do arquivo:

| Indicador | 4.0 | 5.0 |
|---|:-:|:-:|
| Rotas | 23 | 31 |
| Passos de fluxo em etapas | 6 | 11 |
| Estados de tela cheia | 3 | 6 |
| **Telas cheias** | **32** | **48** |
| Sobreposições (diálogo e painel) | 11 | 7 |
| **Telas no total** | **43** | **55** |
| **Pontos de interação** | **219** | **272** |

A redução de sobreposições é intencional: diálogo que interrompe o fluxo foi substituído por rota
própria onde a tarefa tem mais de um passo — caso do impulsionamento.

## Acabamento da versão 5.0

Duas frentes de polimento, ambas verificadas por instrumento:

**Interface.** Validação por etapa antes de avançar, estados de vazio e de carregamento
padronizados, diálogo de confirmação em ação destrutiva, desfazer em exclusão, e micro-interações
de resposta ao toque.

**Acessibilidade.** As 48 telas foram auditadas nos temas claro e escuro. A paleta não foi
escolhida a olho: as luminosidades vieram de um roteiro que calcula a menor alteração capaz de
satisfazer o contraste mínimo da WCAG 2.2 nível AA em todas as combinações que o código
efetivamente usa, preservando matiz e saturação da marca.

Detalhes das decisões visuais em [UI / UX](16-ui-ux). Resultados da auditoria em
[Testes e qualidade](18-testes-e-qualidade).

## Fotos do catálogo embutidas no projeto

Decisão tomada após um problema concreto: uma foto hospedada em banco de imagens externo passou a
responder erro 404 e quebrou uma figura da monografia. O mesmo poderia acontecer com qualquer
outra durante a apresentação.

As fotos foram baixadas para `public/materiais/` — 13 materiais em três larguras cada
(320, 640 e 1280 px), mais o avatar da vendedora, totalizando 41 arquivos — com manifesto gerado a
partir dos arquivos reais, para que nunca seja solicitada uma variante inexistente.

**Resultado:** o protótipo abre sem internet e nenhuma imagem pode caducar. **Custo:** 3,5 MB no
pacote. Doze testes automatizados protegem as duas garantias.

## Estado de verificação

| O quê | Instrumento | Resultado |
|---|---|---|
| Tipagem | `tsc --noEmit` | 0 erro |
| Testes automatizados | Vitest, 6 arquivos | 94 de 94 |
| Fluxos ponta a ponta | Playwright, 8 fluxos | 36 de 36, 0 erro de console |
| Acessibilidade | 24 rotas × 2 temas | 48 telas, 0 problema |
| Compilação | `vite build` | 2.200 módulos |

## Itens de polimento pendentes

Registro honesto do que ficou fora desta versão:

| Item | Situação |
|---|---|
| Divisão do pacote por rota (`import()` dinâmico) | Não feito. O pacote gera 894 kB (263 kB comprimido), acima do aviso de 500 kB do Vite. Para um protótipo executado localmente o efeito é irrelevante, e a divisão foi evitada para manter o código legível na defesa |
| Teste com usuário real | Não executado |
| Teste com leitor de tela (NVDA, TalkBack, VoiceOver) | Não executado |

Os dois últimos são limite declarado do trabalho, não pendência de implementação.

## Próxima etapa

A reimplementação em Flutter com Firebase parte de um alvo já validado: telas definidas, fluxos
percorridos, regras de negócio especificadas e cobertas por teste, e estrutura de dados modelada em
[Fluxo de interação de dados](14-fluxo-de-interacao). O protótipo serve como especificação
executável — é possível comparar o comportamento do aplicativo nativo com o do demonstrador, tela
por tela.
