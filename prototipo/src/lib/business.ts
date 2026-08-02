// ---------------------------------------------------------------------------
// HandMade 5.0 — plano de negócio (L3)
//
// Fonte única dos números usados no aplicativo e na monografia. Cada valor é
// calculado a partir das premissas declaradas em PREMISSAS, de modo que a
// planilha do TCC e as telas nunca divirjam.
//
// Premissas de mercado: dados públicos do setor de resíduos da construção civil
// (ABRECON, Panorama ABRELPE) e a pesquisa aplicada do próprio TCC, com 87
// respondentes na região de Mogi Guaçu (SP).
// ---------------------------------------------------------------------------
import { PLATFORM_FEE_PERCENT, PLANS } from './plans';
import { formatCurrency, formatPercent } from './formatters';

export interface Premissa {
  chave: string;
  rotulo: string;
  valor: number;
  unidade: string;
  fonte: string;
}

/** Premissas declaradas — toda projeção abaixo deriva daqui. */
export const PREMISSAS: Premissa[] = [
  {
    chave: 'ticket_medio',
    rotulo: 'Ticket médio por transação',
    valor: 420,
    unidade: 'R$',
    fonte: 'Média dos 87 respondentes da pesquisa aplicada (jun. 2026)',
  },
  {
    chave: 'transacoes_mes_ano1',
    rotulo: 'Transações concluídas por mês (12º mês)',
    valor: 180,
    unidade: 'transações',
    fonte: 'Meta de adoção: 1,8% dos anunciantes ativos projetados',
  },
  {
    chave: 'taxa_conversao_anuncio',
    rotulo: 'Anúncios ativos que resultam em venda no mês',
    valor: 22,
    unidade: '%',
    fonte: 'Benchmark de marketplaces C2C de nicho',
  },
  {
    chave: 'anuncios_por_vendedor',
    rotulo: 'Anúncios ativos por vendedor',
    valor: 3.5,
    unidade: 'anúncios',
    fonte: 'Mediana declarada pelos respondentes que já revendem sobra de obra',
  },
  {
    chave: 'pct_contas_empresa',
    rotulo: 'Base de vendedores que é pessoa jurídica',
    valor: 18,
    unidade: '%',
    fonte: 'Pesquisa aplicada: 16 dos 87 respondentes atuam como empresa',
  },
  {
    chave: 'assinantes_pro_pct',
    rotulo: 'Vendedores ativos que assinam o plano Pro',
    valor: 8,
    unidade: '%',
    fonte: 'Taxa de conversão para plano pago em marketplaces comparáveis',
  },
  {
    chave: 'assinantes_ent_pct',
    rotulo: 'Contas empresa que assinam o plano Empresarial',
    valor: 15,
    unidade: '%',
    fonte: 'Estimativa conservadora sobre a base de contas jurídicas',
  },
  {
    chave: 'cac',
    rotulo: 'Custo de aquisição por usuário (CAC)',
    valor: 12.5,
    unidade: 'R$',
    fonte: 'Mídia paga regional + orgânico, orçamento de R$ 1.500/mês',
  },
  {
    chave: 'churn_mensal',
    rotulo: 'Cancelamento mensal de assinaturas',
    valor: 6,
    unidade: '%',
    fonte: 'Mediana de SaaS B2C de baixo ticket',
  },
  {
    chave: 'impulsos_mes',
    rotulo: 'Impulsionamentos vendidos por mês (12º mês)',
    valor: 74,
    unidade: 'compras',
    fonte: '9% dos 818 anúncios ativos, plano de 7 dias como mais vendido',
  },
];

export const premissa = (chave: string): number =>
  PREMISSAS.find(p => p.chave === chave)?.valor ?? 0;

// --- Estrutura de receita ---------------------------------------------------

export interface FonteReceita {
  nome: string;
  descricao: string;
  formula: string;
  valorMensal: number;
}

const TICKET = premissa('ticket_medio');
const TRANSACOES = premissa('transacoes_mes_ano1');
const IMPULSOS = premissa('impulsos_mes');

/**
 * Base de vendedores ativos implícita no volume de transações projetado.
 *
 * A conversão de 22% incide sobre ANÚNCIOS, não sobre vendedores: para 180
 * vendas por mês são necessários ~818 anúncios ativos, que a uma mediana de 3,5
 * anúncios por vendedor correspondem a ~234 vendedores. Confundir as duas bases
 * — como uma primeira versão deste modelo fazia — infla a base de assinantes em
 * 3,5 vezes e faz a receita de assinatura superar a de taxa de serviço, o que
 * contradiz o posicionamento do negócio.
 */
export const ANUNCIOS_ATIVOS = Math.round(
  TRANSACOES / (premissa('taxa_conversao_anuncio') / 100)
);

export const VENDEDORES_ATIVOS = Math.round(
  ANUNCIOS_ATIVOS / premissa('anuncios_por_vendedor')
);

export const ASSINANTES_PRO = Math.round(VENDEDORES_ATIVOS * (premissa('assinantes_pro_pct') / 100));
export const CONTAS_EMPRESA = Math.round(
  VENDEDORES_ATIVOS * (premissa('pct_contas_empresa') / 100)
);
export const ASSINANTES_ENTERPRISE = Math.round(
  CONTAS_EMPRESA * (premissa('assinantes_ent_pct') / 100)
);

/**
 * Taxa média efetiva por venda.
 *
 * Não é 5%: parte das vendas sai de vendedores Pro (3%) e Empresarial (2%).
 * A média é ponderada pela participação de cada plano na base ativa.
 */
export function taxaMediaEfetiva(): number {
  const base = VENDEDORES_ATIVOS;
  const pro = ASSINANTES_PRO;
  const ent = ASSINANTES_ENTERPRISE;
  const free = base - pro - ent;
  const ponderada =
    (free * PLATFORM_FEE_PERCENT.free +
      pro * PLATFORM_FEE_PERCENT.pro +
      ent * PLATFORM_FEE_PERCENT.enterprise) /
    base;
  return Math.round(ponderada * 100) / 100;
}

const PRECO_IMPULSO_MEDIO = 19.9; // plano de 7 dias, o mais vendido

/** Impulsos projetados: 9% dos anúncios ativos compram destaque no mês. */
export const IMPULSOS_DERIVADOS = Math.round(ANUNCIOS_ATIVOS * 0.09);

export const RECEITAS: FonteReceita[] = [
  {
    nome: 'Taxa de serviço por venda',
    descricao: 'Percentual retido em cada transação concluída, conforme o plano do vendedor',
    formula: `${TRANSACOES} transações × ${formatCurrency(TICKET)} × ${formatPercent(taxaMediaEfetiva(), 2)}`,
    valorMensal: Math.round(TRANSACOES * TICKET * (taxaMediaEfetiva() / 100) * 100) / 100,
  },
  {
    nome: 'Assinatura Pro',
    descricao: 'Mensalidade de vendedores pessoa física com volume recorrente',
    formula: `${ASSINANTES_PRO} assinantes × ${formatCurrency(PLANS.pro.price)}`,
    valorMensal: Math.round(ASSINANTES_PRO * PLANS.pro.price * 100) / 100,
  },
  {
    nome: 'Assinatura Empresarial',
    descricao: 'Mensalidade de empresas e prestadores com anúncios ilimitados',
    formula: `${ASSINANTES_ENTERPRISE} assinantes × ${formatCurrency(PLANS.enterprise.price)}`,
    valorMensal: Math.round(ASSINANTES_ENTERPRISE * PLANS.enterprise.price * 100) / 100,
  },
  {
    nome: 'Impulsionamento de anúncios',
    descricao: 'Compra pontual de destaque por 3, 7 ou 15 dias',
    formula: `${IMPULSOS} compras × ${formatCurrency(PRECO_IMPULSO_MEDIO)}`,
    valorMensal: Math.round(IMPULSOS * PRECO_IMPULSO_MEDIO * 100) / 100,
  },
];

export const RECEITA_MENSAL = Math.round(RECEITAS.reduce((s, r) => s + r.valorMensal, 0) * 100) / 100;

// --- Estrutura de custos ----------------------------------------------------

export interface Custo {
  nome: string;
  descricao: string;
  valorMensal: number;
  tipo: 'fixo' | 'variavel';
}

export const CUSTOS: Custo[] = [
  {
    nome: 'Infraestrutura em nuvem',
    descricao: 'Firebase (Firestore, Authentication, Storage) e hospedagem do aplicativo',
    valorMensal: 320,
    tipo: 'fixo',
  },
  {
    nome: 'Taxas do provedor de pagamento',
    descricao: 'Custo do adquirente sobre o volume transacionado (média de 1,2%)',
    valorMensal: Math.round(TRANSACOES * TICKET * 0.012 * 100) / 100,
    tipo: 'variavel',
  },
  {
    nome: 'Marketing e aquisição',
    descricao: 'Mídia paga regional, conteúdo e parcerias com cooperativas',
    valorMensal: 1500,
    tipo: 'variavel',
  },
  {
    nome: 'Atendimento e mediação',
    descricao: 'Suporte, análise de denúncias e mediação de disputas (meio período)',
    valorMensal: 1400,
    tipo: 'fixo',
  },
  {
    nome: 'Contabilidade e obrigações',
    descricao: 'Escritório contábil, DAS/Simples e certificado digital',
    valorMensal: 480,
    tipo: 'fixo',
  },
  {
    nome: 'Ferramentas e licenças',
    descricao: 'Domínio, monitoramento de erros, e-mail transacional e design',
    valorMensal: 260,
    tipo: 'fixo',
  },
];

export const CUSTO_MENSAL = Math.round(CUSTOS.reduce((s, c) => s + c.valorMensal, 0) * 100) / 100;
export const CUSTO_FIXO_MENSAL =
  Math.round(CUSTOS.filter(c => c.tipo === 'fixo').reduce((s, c) => s + c.valorMensal, 0) * 100) / 100;

export const RESULTADO_MENSAL = Math.round((RECEITA_MENSAL - CUSTO_MENSAL) * 100) / 100;
export const MARGEM_PERCENTUAL = Math.round((RESULTADO_MENSAL / RECEITA_MENSAL) * 10000) / 100;

// --- Indicadores de viabilidade --------------------------------------------

/** Receita média por transação, considerando a taxa efetiva. */
export const RECEITA_POR_TRANSACAO = Math.round(TICKET * (taxaMediaEfetiva() / 100) * 100) / 100;

/**
 * Ponto de equilíbrio em transações por mês.
 *
 * Considera apenas a receita transacional contra o custo fixo, tratando as
 * assinaturas como reforço de margem e não como garantia — leitura conservadora.
 */
export const PONTO_EQUILIBRIO_TRANSACOES = Math.ceil(
  CUSTO_FIXO_MENSAL / (RECEITA_POR_TRANSACAO - TICKET * 0.012)
);

export const PONTO_EQUILIBRIO_VOLUME =
  Math.round(PONTO_EQUILIBRIO_TRANSACOES * TICKET * 100) / 100;

/** Tempo de vida médio da assinatura, em meses, dado o churn declarado. */
export const VIDA_MEDIA_MESES = Math.round((1 / (premissa('churn_mensal') / 100)) * 10) / 10;

/** Receita média por assinante, ponderada entre Pro e Empresarial. */
export const RECEITA_MEDIA_ASSINANTE =
  Math.round(
    ((ASSINANTES_PRO * PLANS.pro.price + ASSINANTES_ENTERPRISE * PLANS.enterprise.price) /
      (ASSINANTES_PRO + ASSINANTES_ENTERPRISE)) *
      100
  ) / 100;

export const LTV = Math.round(RECEITA_MEDIA_ASSINANTE * VIDA_MEDIA_MESES * 100) / 100;

/** Custo de aquisição por usuário cadastrado — o que a mídia paga entrega. */
export const CAC_USUARIO = premissa('cac');

/** Parcela da base de vendedores que efetivamente assina um plano pago. */
export const CONVERSAO_ASSINATURA =
  Math.round(((ASSINANTES_PRO + ASSINANTES_ENTERPRISE) / VENDEDORES_ATIVOS) * 10000) / 100;

/**
 * Custo de aquisição por ASSINANTE.
 *
 * Comparar o LTV de um assinante com o CAC de um usuário qualquer superestima o
 * retorno em quase dez vezes: só ~11% dos vendedores assinam, então cada
 * assinante custa o equivalente a nove usuários adquiridos. É este o número que
 * entra na razão LTV/CAC.
 */
export const CAC = Math.round((CAC_USUARIO / (CONVERSAO_ASSINATURA / 100)) * 100) / 100;

export const RAZAO_LTV_CAC = Math.round((LTV / CAC) * 10) / 10;

/** Meses de assinatura para recuperar o custo de aquisição. */
export const PAYBACK_MESES = Math.round((CAC / RECEITA_MEDIA_ASSINANTE) * 10) / 10;

// --- Projeção trienal -------------------------------------------------------

export interface AnoProjetado {
  ano: number;
  transacoesMes: number;
  receitaAnual: number;
  custoAnual: number;
  resultadoAnual: number;
}

/** Crescimento anual composto adotado na projeção. */
const CRESCIMENTO_ANUAL = [1, 2.4, 4.6];

export const PROJECAO: AnoProjetado[] = CRESCIMENTO_ANUAL.map((fator, i) => {
  const transacoesMes = Math.round(TRANSACOES * fator);
  // A receita transacional cresce com o volume; assinaturas e impulsos também,
  // porém os custos fixos crescem menos que proporcionalmente (0,55 do fator).
  const receitaMes = Math.round(RECEITA_MENSAL * fator * 100) / 100;
  const variavelMes = CUSTOS.filter(c => c.tipo === 'variavel').reduce((s, c) => s + c.valorMensal, 0) * fator;
  const fixoMes = CUSTO_FIXO_MENSAL * (1 + (fator - 1) * 0.55);
  const custoMes = variavelMes + fixoMes;
  return {
    ano: i + 1,
    transacoesMes,
    receitaAnual: Math.round(receitaMes * 12 * 100) / 100,
    custoAnual: Math.round(custoMes * 12 * 100) / 100,
    resultadoAnual: Math.round((receitaMes - custoMes) * 12 * 100) / 100,
  };
});

// --- Investimento inicial ---------------------------------------------------

export const INVESTIMENTO_INICIAL: { item: string; valor: number }[] = [
  { item: 'Desenvolvimento do aplicativo (concluído no TCC)', valor: 0 },
  { item: 'Registro de marca no INPI', valor: 1_045 },
  { item: 'Abertura de empresa e contabilidade inicial', valor: 800 },
  { item: 'Domínio, certificado e infraestrutura (3 meses)', valor: 1_160 },
  { item: 'Campanha de lançamento regional', valor: 3_000 },
  { item: 'Capital de giro (3 meses de custo fixo)', valor: Math.round(CUSTO_FIXO_MENSAL * 3) },
];

export const INVESTIMENTO_TOTAL = INVESTIMENTO_INICIAL.reduce((s, i) => s + i.valor, 0);

/** Meses de operação no patamar do 12º mês para devolver o investimento. */
export const RETORNO_INVESTIMENTO_MESES =
  RESULTADO_MENSAL > 0 ? Math.ceil(INVESTIMENTO_TOTAL / RESULTADO_MENSAL) : Infinity;

// --- Impacto socioambiental -------------------------------------------------
//
// ATENÇÃO — os dois fatores abaixo são ESTIMATIVAS PRELIMINARES do projeto, e
// não valores medidos ou extraídos de fonte publicada. A verificação externa de
// agosto de 2026 não localizou fonte que confirmasse nenhum dos dois. Enquanto
// permanecerem sem lastro, os resultados desta seção devem ser apresentados como
// ordem de grandeza, jamais como dado ambiental verificado.

/**
 * Massa média de resíduo desviada do descarte por transação, em toneladas.
 *
 * ESTIMATIVA DO PROJETO — sem base publicada. Depende do tipo de material e do
 * tamanho do lote, que variam muito entre as categorias do catálogo.
 */
const RESIDUO_POR_TRANSACAO_T = 0.35;

export const RESIDUO_DESVIADO_ANO_T =
  Math.round(TRANSACOES * 12 * RESIDUO_POR_TRANSACAO_T * 10) / 10;

/**
 * CO₂ equivalente evitado por ano, em toneladas.
 *
 * ESTIMATIVA DO PROJETO — o fator de 0,42 tCO₂e por tonelada reaproveitada não
 * foi confirmado por fonte publicada. O fator real varia conforme o material
 * (concreto, aço, madeira e agregado têm perfis muito diferentes) e conforme a
 * fronteira do sistema adotada na análise de ciclo de vida.
 */
const FATOR_CO2_POR_TONELADA = 0.42;

export const CO2_EVITADO_ANO_T =
  Math.round(RESIDUO_DESVIADO_ANO_T * FATOR_CO2_POR_TONELADA * 10) / 10;
