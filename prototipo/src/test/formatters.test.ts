// ---------------------------------------------------------------------------
// C2 / U4 — formatação numérica em português
//
// A versão 4.0 imprimia "5.8%" e "4.5" na interface porque chamava `toFixed()`
// direto no JSX — notação inglesa em um aplicativo inteiramente em pt-BR. O
// teste de fluxo capturou isso no painel do vendedor.
// ---------------------------------------------------------------------------
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDecimal, formatPercent } from '@/lib/formatters';

describe('formatação de moeda', () => {
  it('usa o padrão brasileiro com R$, ponto de milhar e vírgula decimal', () => {
    //   é o espaço não separável que o Intl insere depois de R$.
    expect(formatCurrency(1234.5).replace(/ /g, ' ')).toBe('R$ 1.234,50');
    expect(formatCurrency(0).replace(/ /g, ' ')).toBe('R$ 0,00');
  });

  it('sempre mostra duas casas decimais', () => {
    expect(formatCurrency(19.9)).toContain('19,90');
    expect(formatCurrency(250)).toContain('250,00');
  });
});

describe('formatação decimal', () => {
  it('troca o ponto decimal pela vírgula', () => {
    expect(formatDecimal(5.8)).toBe('5,8');
    expect(formatDecimal(4.5)).toBe('4,5');
  });

  it('completa a casa decimal em números inteiros', () => {
    expect(formatDecimal(6)).toBe('6,0');
    expect(formatDecimal(6, 0)).toBe('6');
  });

  it('respeita a quantidade de casas pedida', () => {
    expect(formatDecimal(4.76, 2)).toBe('4,76');
    expect(formatDecimal(4.764, 1)).toBe('4,8');
  });

  it('aplica separador de milhar', () => {
    expect(formatDecimal(1234.5)).toBe('1.234,5');
  });
});

describe('formatação de porcentagem', () => {
  it('acrescenta o símbolo ao número já em pontos percentuais', () => {
    expect(formatPercent(5.8)).toBe('5,8%');
    expect(formatPercent(21.23)).toBe('21,2%');
    expect(formatPercent(4.76, 2)).toBe('4,76%');
  });

  it('não multiplica o valor por 100', () => {
    // Erro comum ao trocar para Intl com style: 'percent'.
    expect(formatPercent(5)).toBe('5,0%');
  });

  it('trata zero sem sinal negativo', () => {
    expect(formatPercent(0)).toBe('0,0%');
  });
});
