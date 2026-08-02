export const PLATFORM_FEE_PERCENT: Record<string, number> = {
  free: 5,
  pro: 3,
  enterprise: 2,
};

export const MINIMUM_TRANSACTION_VALUE = 5.00;

export const PLANS = {
  free: {
    name: 'Gratuito',
    price: 0,
    fee_percent: 5,
    max_listings_individual: 10,
    max_listings_company: 25,
    monthly_boosts: 0,
    features: [
      'Até 10 anúncios ativos',
      'Publicação gratuita',
      'Chat com compradores',
      'Taxa de 5% por venda',
      'Suporte via FAQ',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29.90,
    fee_percent: 3,
    max_listings: 50,
    monthly_boosts: 1,
    badge_color: 'dourado',
    features: [
      'Até 50 anúncios ativos',
      'Taxa reduzida de 3% por venda',
      '1 boost gratuito por mês',
      'Badge "Pro" dourado no perfil',
      'Relatório de visualizações',
      'Suporte por e-mail (48h)',
    ],
  },
  enterprise: {
    name: 'Empresarial',
    price: 89.90,
    fee_percent: 2,
    max_listings: null as number | null,
    monthly_boosts: 3,
    badge_color: 'verde',
    only_for: 'company' as const,
    features: [
      'Anúncios ilimitados',
      'Taxa mínima de 2% por venda',
      '3 boosts gratuitos por mês',
      'Badge "Empresa Verificada" verde',
      'Relatório completo + exportação CSV',
      'Seção especial "Empresas Parceiras" na Home',
      'Suporte prioritário (4h)',
    ],
  },
};
