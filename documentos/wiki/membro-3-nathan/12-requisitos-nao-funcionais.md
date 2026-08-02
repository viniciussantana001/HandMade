# 4.3 Requisitos não funcionais

**Responsável:** Nathan Costa Batista

Requisitos de **como** o sistema deve se comportar. Cada um traz o critério de aceitação e a
situação de verificação — um requisito não funcional sem critério mensurável não é requisito, é
intenção.

## RNF-01 — Desempenho

| | |
|---|---|
| **Critério** | Resposta perceptível a qualquer toque em até 100 ms; transição entre telas sem travamento |
| **Situação** | Atendido no protótipo |

Duas decisões sustentam o critério:

- **Sem sincronização por intervalo.** A tela de mensagens não ressincroniza por temporizador; a
  atualização é notificada pela store apenas quando há alteração real.
- **Imagem na largura do contexto.** Miniatura, cartão de grade e tela de detalhe pedem larguras
  diferentes (320, 640 e 1280 px). Solicitar sempre a maior desperdiça banda; sempre a menor
  produz imagem borrada.

**Limitação conhecida:** o pacote de produção gera 894 kB (263 kB comprimido), acima do limite de
aviso de 500 kB do Vite. A divisão por rota não foi feita, para manter o código legível na defesa.
Em produção, a medida indicada é `import()` dinâmico por rota. Registrado aqui em vez de omitido.

## RNF-02 — Segurança

| | |
|---|---|
| **Critério** | Dado sensível nunca armazenado por inteiro; ação destrutiva sempre confirmada; acesso restrito ao dono do recurso |
| **Situação** | Parcialmente atendido — ver ressalva |

No protótipo:

- O número do cartão **não é armazenado**: guardam-se apenas os quatro últimos dígitos e a
  bandeira, comportamento coberto por teste automatizado.
- Ação destrutiva exige confirmação em diálogo, com opção de desfazer quando aplicável.
- Uma tela de recurso alheio verifica a propriedade antes de renderizar — impulsionar anúncio de
  outra pessoa é bloqueado com mensagem explícita.

**Ressalva obrigatória.** O protótipo é client-side: os dados ficam no `localStorage` do
navegador, sem criptografia e sem controle de acesso real. **Não é seguro para dados reais** e não
deve ser usado com informação verdadeira de ninguém. A segurança efetiva depende da etapa
Flutter + Firebase, com regras de segurança do Firestore, autenticação federada e validação no
servidor por Cloud Functions.

## RNF-03 — Disponibilidade

| | |
|---|---|
| **Critério** | O protótipo abre e funciona sem conexão com a internet |
| **Situação** | Atendido |

As 41 imagens do catálogo estão embutidas em `public/materiais/`, com manifesto gerado a partir
dos arquivos reais. Nenhuma imagem depende de serviço externo e nenhuma pode caducar durante a
apresentação. Doze testes automatizados protegem essa garantia.

Para o aplicativo final, a disponibilidade dependerá do Firebase, que oferece cache local — o
conteúdo já carregado permanece acessível em conexão intermitente, situação comum no público
descrito em [Personas](13-personas).

## RNF-04 — Usabilidade

| | |
|---|---|
| **Critério** | Nenhuma falha inesperada produz tela em branco; todo erro traz o próximo passo em linguagem comum |
| **Situação** | Atendido e verificado |

**Definição operacional de "tela branca"**, fixada antes da medição: raiz da aplicação renderizada
com menos de 40 caracteres de texto visível. Sem definição operacional, "não ficou branca" não é
verificável.

Resultado: **0 tela branca em 36 verificações de fluxo**, incluindo os três casos que falhavam na
versão 4.0 — encerrar sessão, voltar pelo botão do navegador após sair e concluir impulsionamento.

Sustentam o critério: componente de captura de erro no lugar da tela vazia; estados de
carregamento com esqueleto da silhueta real do conteúdo; e mensagens de erro com o próximo passo
("tente outra foto", "confira o número do cartão").

## RNF-05 — Acessibilidade

| | |
|---|---|
| **Critério** | WCAG 2.2 nível AA nos critérios objetivamente mensuráveis |
| **Situação** | Atendido nos sete critérios verificados — ver limite |

| Verificação | Critério WCAG | Limiar | Resultado |
|---|---|---|:-:|
| Contraste de texto | 1.4.3 | 4,5:1 normal · 3:1 grande | 0 falha |
| Alvo de toque | 2.5.8 | 24 × 24 px CSS | 0 falha |
| Nome acessível | 4.1.2 | Todo controle com nome não vazio | 0 falha |
| Alternativa textual | 1.1.1 | Todo `<img>` com `alt` | 0 falha |
| Hierarquia de títulos | 1.3.1 | Um `<h1>` visível por tela | 0 falha |
| Transbordo horizontal | 1.4.10 | Sem rolagem lateral em 412 px | 0 falha |
| Rótulo de campo | 3.3.2 | Todo campo com rótulo associado | 0 falha |

Medido em **48 telas** (24 rotas × 2 temas). Atendidos também por construção:
`prefers-reduced-motion` (2.3.3), foco visível em `:focus-visible` (2.4.7), zoom preservado
(1.4.4) e `autoComplete` nos campos de identidade (1.3.5).

**Limite declarado.** A conformidade verificada é a **automatizável**. Auditoria completa exigiria
teste com leitor de tela real, navegação exclusiva por teclado conduzida por pessoa com
deficiência e revisão por especialista — nenhum dos três executado. O que se afirma é
conformidade nos sete critérios mensuráveis acima, não conformidade WCAG AA integral.

## RNF-06 — Compatibilidade

| | |
|---|---|
| **Critério** | Layout íntegro em 412 px de largura, com área segura respeitada |
| **Situação** | Atendido |

Referência de teste: Chromium, viewport 412 × 915, `deviceScaleFactor` 3, modo móvel com toque,
idioma pt-BR. A barra inferior usa `env(safe-area-inset-bottom)` com `viewport-fit=cover`, para não
ficar sob o indicador de gestos do sistema.

O aplicativo final terá compatibilidade nativa com Android e iOS a partir de uma base de código
única em Flutter.

## RNF-07 — Escalabilidade

| | |
|---|---|
| **Critério** | A arquitetura planejada deve suportar crescimento sem redesenho |
| **Situação** | Planejado — não verificável no protótipo |

O protótipo não escala por definição: os dados vivem no navegador de um único usuário. A
escalabilidade é atributo da etapa seguinte, apoiada em Firestore (escalonamento automático) e
Cloud Functions (cobrança por execução).

A projeção de crescimento — 180 transações/mês no ano 1 para 828 no ano 3 — está em
[Estudo de viabilidade](06-estudo-de-viabilidade).

## RNF-08 — Responsividade

| | |
|---|---|
| **Critério** | Interface concebida para celular, com navegação ao alcance do polegar |
| **Situação** | Atendido |

O projeto é **mobile-first**: parte de 412 px e a navegação principal fica na base da tela. Não é
um site adaptado para celular, é uma interface de celular. A verificação de transbordo horizontal
confirma que nenhuma das 48 telas exige rolagem lateral.

## RNF-09 — Manutenibilidade

| | |
|---|---|
| **Critério** | Tipagem estrita sem erro; estado compartilhado centralizado |
| **Situação** | Atendido |

`tsc --noEmit` sem erro. Estados de vazio, erro e carregamento centralizados em um único módulo,
evitando divergência entre telas. Conteúdo jurídico e regras de negócio isolados em módulos
próprios (`lib/legal.ts`, `lib/business.ts`), de modo que a alteração de uma regra ocorre em um
lugar só.

## RNF-10 — Conformidade legal

| | |
|---|---|
| **Critério** | Tratamento de dados compatível com a LGPD |
| **Situação** | Estrutura implementada — efetividade depende da etapa final |

Consentimento registrado com data, hora e versão do documento (art. 8º); exportação e exclusão de
dados disponíveis ao titular (art. 18); e coleta mínima — o CPF, por exemplo, é guardado apenas
pelos quatro últimos dígitos.

Detalhamento em [Legislação e contratos](20-legislacao-e-contratos).

## Resumo da verificação

| Requisito | Situação |
|---|---|
| RNF-01 Desempenho | Atendido, com limitação declarada |
| RNF-02 Segurança | Parcial — ressalva de protótipo client-side |
| RNF-03 Disponibilidade | Atendido |
| RNF-04 Usabilidade | Atendido — 0 tela branca em 36 fluxos |
| RNF-05 Acessibilidade | Atendido em 7 critérios, 48 telas, 0 falha |
| RNF-06 Compatibilidade | Atendido |
| RNF-07 Escalabilidade | Planejado |
| RNF-08 Responsividade | Atendido |
| RNF-09 Manutenibilidade | Atendido |
| RNF-10 Conformidade legal | Estrutura implementada |

Os instrumentos que produzem esses resultados estão descritos em
[Testes e qualidade](18-testes-e-qualidade).
