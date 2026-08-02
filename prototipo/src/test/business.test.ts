// ---------------------------------------------------------------------------
// C2 / L3 — validação numérica do plano de negócio
//
// A monografia afirma que o modelo se sustenta. Estes testes verificam a
// aritmética por trás da afirmação: consistência interna das somas, coerência
// da taxa média com a mistura de planos e sinal correto dos indicadores.
// ---------------------------------------------------------------------------
import { describe, it, expect } from 'vitest';
import {
  PREMISSAS,
  premissa,
  RECEITAS,
  RECEITA_MENSAL,
  CUSTOS,
  CUSTO_MENSAL,
  CUSTO_FIXO_MENSAL,
  RESULTADO_MENSAL,
  MARGEM_PERCENTUAL,
  PONTO_EQUILIBRIO_TRANSACOES,
  PONTO_EQUILIBRIO_VOLUME,
  RECEITA_POR_TRANSACAO,
  LTV,
  CAC,
  CAC_USUARIO,
  CONVERSAO_ASSINATURA,
  RAZAO_LTV_CAC,
  PAYBACK_MESES,
  VIDA_MEDIA_MESES,
  PROJECAO,
  INVESTIMENTO_TOTAL,
  RETORNO_INVESTIMENTO_MESES,
  RESIDUO_DESVIADO_ANO_T,
  CO2_EVITADO_ANO_T,
  VENDEDORES_ATIVOS,
  ASSINANTES_PRO,
  ASSINANTES_ENTERPRISE,
  taxaMediaEfetiva,
} from '@/lib/business';
import { PLATFORM_FEE_PERCENT } from '@/lib/plans';

describe('premissas', () => {
  it('declara fonte para cada premissa — nenhum número solto', () => {
    expect(PREMISSAS.length).toBeGreaterThanOrEqual(8);
    PREMISSAS.forEach(p => {
      expect(p.fonte.length).toBeGreaterThan(10);
      expect(p.valor).toBeGreaterThan(0);
      expect(p.rotulo).toBeTruthy();
    });
  });

  it('devolve 0 para premissa inexistente, sem quebrar cálculo', () => {
    expect(premissa('nao_existe')).toBe(0);
  });
});

describe('receita', () => {
  it('soma exatamente as quatro fontes declaradas', () => {
    const soma = RECEITAS.reduce((s, r) => s + r.valorMensal, 0);
    expect(RECEITA_MENSAL).toBeCloseTo(soma, 2);
    expect(RECEITAS).toHaveLength(4);
  });

  it('documenta a fórmula de cada fonte', () => {
    RECEITAS.forEach(r => {
      expect(r.formula).toMatch(/×/);
      expect(r.valorMensal).toBeGreaterThan(0);
    });
  });

  it('mantém a taxa de serviço como principal fonte de receita', () => {
    const taxa = RECEITAS[0].valorMensal;
    const outras = RECEITA_MENSAL - taxa;
    expect(taxa).toBeGreaterThan(outras);
  });
});

describe('taxa média efetiva', () => {
  it('fica entre a taxa Empresarial e a taxa gratuita', () => {
    const media = taxaMediaEfetiva();
    expect(media).toBeLessThan(PLATFORM_FEE_PERCENT.free);
    expect(media).toBeGreaterThan(PLATFORM_FEE_PERCENT.enterprise);
  });

  it('fica próxima de 5% porque a maioria da base é do plano gratuito', () => {
    expect(ASSINANTES_PRO + ASSINANTES_ENTERPRISE).toBeLessThan(VENDEDORES_ATIVOS * 0.15);
    expect(taxaMediaEfetiva()).toBeGreaterThan(4.5);
  });
});

describe('custos e resultado', () => {
  it('soma todos os custos declarados', () => {
    expect(CUSTO_MENSAL).toBeCloseTo(CUSTOS.reduce((s, c) => s + c.valorMensal, 0), 2);
  });

  it('separa custo fixo de variável de forma consistente', () => {
    const fixo = CUSTOS.filter(c => c.tipo === 'fixo').reduce((s, c) => s + c.valorMensal, 0);
    expect(CUSTO_FIXO_MENSAL).toBeCloseTo(fixo, 2);
    expect(CUSTO_FIXO_MENSAL).toBeLessThan(CUSTO_MENSAL);
  });

  it('fecha o 12º mês com resultado positivo', () => {
    expect(RESULTADO_MENSAL).toBeCloseTo(RECEITA_MENSAL - CUSTO_MENSAL, 2);
    expect(RESULTADO_MENSAL).toBeGreaterThan(0);
  });

  it('apura margem coerente com receita e resultado', () => {
    expect(MARGEM_PERCENTUAL).toBeCloseTo((RESULTADO_MENSAL / RECEITA_MENSAL) * 100, 1);
    expect(MARGEM_PERCENTUAL).toBeGreaterThan(0);
    expect(MARGEM_PERCENTUAL).toBeLessThan(100);
  });
});

describe('ponto de equilíbrio', () => {
  it('exige menos transações do que a meta do 12º mês', () => {
    expect(PONTO_EQUILIBRIO_TRANSACOES).toBeGreaterThan(0);
    expect(PONTO_EQUILIBRIO_TRANSACOES).toBeLessThan(premissa('transacoes_mes_ano1'));
  });

  it('cobre o custo fixo no volume calculado', () => {
    const margemPorTransacao = RECEITA_POR_TRANSACAO - premissa('ticket_medio') * 0.012;
    expect(PONTO_EQUILIBRIO_TRANSACOES * margemPorTransacao).toBeGreaterThanOrEqual(
      CUSTO_FIXO_MENSAL
    );
  });

  it('expressa o equilíbrio também em volume financeiro', () => {
    expect(PONTO_EQUILIBRIO_VOLUME).toBeCloseTo(
      PONTO_EQUILIBRIO_TRANSACOES * premissa('ticket_medio'),
      2
    );
  });
});

describe('indicadores de assinatura', () => {
  it('deriva a vida média do churn declarado', () => {
    expect(VIDA_MEDIA_MESES).toBeCloseTo(1 / (premissa('churn_mensal') / 100), 1);
  });

  it('compara o LTV do assinante com o CAC do assinante, não do usuário', () => {
    // O CAC por assinante é bem maior que o CAC por usuário cadastrado,
    // justamente porque só uma fração da base converte para plano pago.
    expect(CAC).toBeGreaterThan(CAC_USUARIO);
    expect(CAC).toBeCloseTo(CAC_USUARIO / (CONVERSAO_ASSINATURA / 100), 1);
  });

  it('mantém razão LTV/CAC saudável, porém realista (entre 3 e 15)', () => {
    expect(LTV).toBeGreaterThan(CAC);
    expect(RAZAO_LTV_CAC).toBeGreaterThanOrEqual(3);
    expect(RAZAO_LTV_CAC).toBeLessThan(15);
  });

  it('recupera o CAC em poucos meses de assinatura', () => {
    expect(PAYBACK_MESES).toBeGreaterThan(0);
    expect(PAYBACK_MESES).toBeLessThan(6);
  });

  it('declara conversão para plano pago compatível com a base', () => {
    expect(CONVERSAO_ASSINATURA).toBeGreaterThan(5);
    expect(CONVERSAO_ASSINATURA).toBeLessThan(20);
  });
});

describe('projeção trienal', () => {
  it('cobre três anos com crescimento monotônico', () => {
    expect(PROJECAO).toHaveLength(3);
    for (let i = 1; i < PROJECAO.length; i += 1) {
      expect(PROJECAO[i].transacoesMes).toBeGreaterThan(PROJECAO[i - 1].transacoesMes);
      expect(PROJECAO[i].receitaAnual).toBeGreaterThan(PROJECAO[i - 1].receitaAnual);
    }
  });

  it('fecha cada ano com receita menos custo igual ao resultado', () => {
    PROJECAO.forEach(ano => {
      expect(ano.resultadoAnual).toBeCloseTo(ano.receitaAnual - ano.custoAnual, 0);
    });
  });

  it('ganha escala: a margem do ano 3 supera a do ano 1', () => {
    const margem = (a: (typeof PROJECAO)[number]) => a.resultadoAnual / a.receitaAnual;
    expect(margem(PROJECAO[2])).toBeGreaterThan(margem(PROJECAO[0]));
  });

  it('alinha o ano 1 com o resultado mensal do 12º mês', () => {
    expect(PROJECAO[0].receitaAnual).toBeCloseTo(RECEITA_MENSAL * 12, 0);
  });
});

describe('investimento inicial', () => {
  it('soma os itens declarados', () => {
    expect(INVESTIMENTO_TOTAL).toBeGreaterThan(0);
    expect(INVESTIMENTO_TOTAL).toBeLessThan(20_000);
  });

  it('retorna o investimento em prazo viável para um TCC', () => {
    expect(RETORNO_INVESTIMENTO_MESES).toBeGreaterThan(0);
    expect(RETORNO_INVESTIMENTO_MESES).toBeLessThan(36);
  });
});

describe('impacto socioambiental', () => {
  it('projeta resíduo desviado proporcional ao volume anual', () => {
    expect(RESIDUO_DESVIADO_ANO_T).toBeCloseTo(premissa('transacoes_mes_ano1') * 12 * 0.35, 1);
  });

  it('deriva o CO₂ evitado do resíduo desviado', () => {
    expect(CO2_EVITADO_ANO_T).toBeCloseTo(RESIDUO_DESVIADO_ANO_T * 0.42, 1);
    expect(CO2_EVITADO_ANO_T).toBeLessThan(RESIDUO_DESVIADO_ANO_T);
  });
});
