export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

/**
 * Formata um número decimal no padrão brasileiro (vírgula decimal).
 *
 * A versão 4.0 usava `toFixed()` direto na interface, o que imprimia "5.8%" e
 * "4.5 estrelas" — notação inglesa em um aplicativo inteiramente em português.
 */
export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Formata uma porcentagem já expressa em pontos percentuais (ex.: 5.8 → "5,8%"). */
export function formatPercent(value: number, digits = 1): string {
  return `${formatDecimal(value, digits)}%`;
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atrás`;
  return date.toLocaleDateString('pt-BR');
}

export function formatDateTimeBR(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateBR(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function getGreeting(name: string): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: `Bom dia, ${name}!`, emoji: '☀️' };
  if (hour >= 12 && hour < 18) return { text: `Boa tarde, ${name}!`, emoji: '👋' };
  return { text: `Boa noite, ${name}!`, emoji: '🌙' };
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  return `${months[date.getMonth()]}/${date.getFullYear()}`;
}
