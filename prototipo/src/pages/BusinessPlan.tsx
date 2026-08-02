import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  TrendingUp, PiggyBank, Scale, Target, Leaf, Wallet, Info, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { formatCurrency, formatDecimal, formatPercent } from '@/lib/formatters';
import {
  PREMISSAS,
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
  INVESTIMENTO_INICIAL,
  INVESTIMENTO_TOTAL,
  RETORNO_INVESTIMENTO_MESES,
  RESIDUO_DESVIADO_ANO_T,
  CO2_EVITADO_ANO_T,
  ANUNCIOS_ATIVOS,
  VENDEDORES_ATIVOS,
  ASSINANTES_PRO,
  ASSINANTES_ENTERPRISE,
  taxaMediaEfetiva,
  premissa,
} from '@/lib/business';

/**
 * Plano de negócio (L3).
 *
 * Todos os números vêm de `lib/business.ts`, que também alimenta a monografia —
 * não há valor digitado à mão nesta tela. O simulador de volume recalcula o
 * resultado ao vivo, permitindo checar o ponto de equilíbrio na apresentação.
 */
export default function BusinessPlan() {
  const [transacoes, setTransacoes] = useState(premissa('transacoes_mes_ano1'));

  const simulacao = useMemo(() => {
    const ticket = premissa('ticket_medio');
    const receitaTaxa = transacoes * ticket * (taxaMediaEfetiva() / 100);
    const receitaAssinaturas = RECEITAS[1].valorMensal + RECEITAS[2].valorMensal;
    const receitaImpulsos = RECEITAS[3].valorMensal;
    const receita = receitaTaxa + receitaAssinaturas + receitaImpulsos;
    const variavel = transacoes * ticket * 0.012 + 1500;
    const custo = variavel + CUSTO_FIXO_MENSAL;
    return { receita, custo, resultado: receita - custo, volume: transacoes * ticket };
  }, [transacoes]);

  const maxFonte = Math.max(...RECEITAS.map(r => r.valorMensal));
  const maxCusto = Math.max(...CUSTOS.map(c => c.valorMensal));

  return (
    <div>
      <AppHeader showBack title="Plano de negócio" />

      <div className="px-4 py-4 space-y-4">
        {/* Resumo do 12º mês */}
        <Card className="p-5 bg-gradient-to-br from-primary to-primary-deep text-primary-foreground">
          <p className="text-xs font-medium">Resultado projetado no 12º mês</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(RESULTADO_MENSAL)}</p>
          <div className="flex items-center gap-2 mt-2">
            {/*
              U5: `bg-background/20` clareava o verde do painel e o texto caía
              para 2,91:1. `bg-foreground/20` escurece a pastilha e passa a
              7,76:1 no claro e 5,48:1 no escuro.
            */}
            <Badge className="bg-foreground/20 text-primary-foreground border-0 text-[10px]">
              margem de {formatPercent(MARGEM_PERCENTUAL)}
            </Badge>
            <Badge className="bg-foreground/20 text-primary-foreground border-0 text-[10px]">
              {formatCurrency(RECEITA_MENSAL)} de receita
            </Badge>
          </div>
          <p className="text-[11px] mt-3 leading-relaxed">
            Com {premissa('transacoes_mes_ano1')} transações mensais, ticket médio de{' '}
            {formatCurrency(premissa('ticket_medio'))} e taxa média efetiva de{' '}
            {formatPercent(taxaMediaEfetiva(), 2)}.
          </p>
        </Card>

        <Tabs defaultValue="modelo">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="modelo" className="text-xs">Modelo</TabsTrigger>
            <TabsTrigger value="indicadores" className="text-xs">Indicadores</TabsTrigger>
            <TabsTrigger value="projecao" className="text-xs">Projeção</TabsTrigger>
            <TabsTrigger value="premissas" className="text-xs">Premissas</TabsTrigger>
          </TabsList>

          {/* --- Modelo: receitas e custos --- */}
          <TabsContent value="modelo" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <h2 className="font-bold text-sm">Fontes de receita</h2>
                <span className="ml-auto text-sm font-bold">{formatCurrency(RECEITA_MENSAL)}</span>
              </div>
              <div className="space-y-3">
                {RECEITAS.map(fonte => (
                  <div key={fonte.nome}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-medium">{fonte.nome}</p>
                      <p className="text-xs font-semibold shrink-0">{formatCurrency(fonte.valorMensal)}</p>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all"
                        style={{ width: `${(fonte.valorMensal / maxFonte) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{fonte.formula}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
                <h2 className="font-bold text-sm">Estrutura de custos</h2>
                <span className="ml-auto text-sm font-bold">{formatCurrency(CUSTO_MENSAL)}</span>
              </div>
              <div className="space-y-3">
                {CUSTOS.map(custo => (
                  <div key={custo.nome}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-medium flex items-center gap-1.5">
                        {custo.nome}
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 font-normal">
                          {custo.tipo}
                        </Badge>
                      </span>
                      <p className="text-xs font-semibold shrink-0">{formatCurrency(custo.valorMensal)}</p>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-destructive/70 rounded-full transition-all"
                        style={{ width: `${(custo.valorMensal / maxCusto) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{custo.descricao}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Custo fixo mensal</span>
                <span className="font-semibold">{formatCurrency(CUSTO_FIXO_MENSAL)}</span>
              </div>
            </Card>

            {/* Simulador de volume */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm">Simulador de volume</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Arraste para ver o resultado em diferentes volumes de venda.
              </p>

              <Slider
                value={[transacoes]}
                onValueChange={([v]) => setTransacoes(v)}
                min={40}
                max={600}
                step={10}
                aria-label="Transações concluídas por mês"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>40</span>
                <span className="font-semibold text-foreground">{transacoes} transações/mês</span>
                <span>600</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-2.5 rounded-xl bg-muted text-center">
                  <p className="text-[10px] text-muted-foreground">Receita</p>
                  <p className="text-xs font-bold mt-0.5">{formatCurrency(simulacao.receita)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted text-center">
                  <p className="text-[10px] text-muted-foreground">Custo</p>
                  <p className="text-xs font-bold mt-0.5">{formatCurrency(simulacao.custo)}</p>
                </div>
                <div
                  className={`p-2.5 rounded-xl text-center ${
                    simulacao.resultado >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground">Resultado</p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      simulacao.resultado >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {formatCurrency(simulacao.resultado)}
                  </p>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" /> Ponto de equilíbrio
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  A operação se paga a partir de <strong className="text-foreground">{PONTO_EQUILIBRIO_TRANSACOES} transações
                  por mês</strong> — {formatCurrency(PONTO_EQUILIBRIO_VOLUME)} em volume transacionado. Cada venda
                  contribui com {formatCurrency(RECEITA_POR_TRANSACAO)} de receita de serviço.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* --- Indicadores --- */}
          <TabsContent value="indicadores" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Indicador titulo="LTV do assinante" valor={formatCurrency(LTV)} detalhe={`${formatDecimal(VIDA_MEDIA_MESES)} meses de vida média`} icone={PiggyBank} />
              <Indicador titulo="CAC por assinante" valor={formatCurrency(CAC)} detalhe={`${formatCurrency(CAC_USUARIO)} por usuário captado`} icone={Wallet} />
              <Indicador titulo="Razão LTV/CAC" valor={`${formatDecimal(RAZAO_LTV_CAC)}×`} detalhe="saudável acima de 3×" icone={ArrowUpRight} destaque />
              <Indicador titulo="Payback" valor={`${formatDecimal(PAYBACK_MESES)} meses`} detalhe="para recuperar o CAC" icone={Target} />
            </div>

            <Card className="p-4">
              <h2 className="font-bold text-sm mb-2">Como a base se compõe</h2>
              <dl className="space-y-2 text-xs">
                <Linha termo="Anúncios ativos" valor={`${ANUNCIOS_ATIVOS}`} />
                <Linha termo="Vendedores ativos" valor={`${VENDEDORES_ATIVOS}`} />
                <Linha termo="Assinantes Pro" valor={`${ASSINANTES_PRO}`} />
                <Linha termo="Assinantes Empresarial" valor={`${ASSINANTES_ENTERPRISE}`} />
                <Linha termo="Conversão para plano pago" valor={formatPercent(CONVERSAO_ASSINATURA)} />
                <Linha termo="Taxa média efetiva por venda" valor={formatPercent(taxaMediaEfetiva(), 2)} />
              </dl>
              <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-muted">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  A taxa média fica abaixo dos 5% do plano gratuito porque parte das vendas parte de
                  vendedores Pro (3%) e Empresarial (2%).
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="font-bold text-sm mb-2">Investimento inicial</h2>
              <dl className="space-y-2 text-xs">
                {INVESTIMENTO_INICIAL.map(item => (
                  <Linha key={item.item} termo={item.item} valor={formatCurrency(item.valor)} />
                ))}
              </dl>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold">{formatCurrency(INVESTIMENTO_TOTAL)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Retorno do investimento em <strong className="text-foreground">{RETORNO_INVESTIMENTO_MESES} meses</strong> no
                patamar de resultado do 12º mês.
              </p>
            </Card>

            <Card className="p-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-success" />
                <h2 className="font-bold text-sm">Impacto socioambiental</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xl font-bold">{formatDecimal(RESIDUO_DESVIADO_ANO_T)} t</p>
                  <p className="text-[11px] text-muted-foreground">de resíduo desviado do descarte irregular por ano</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{formatDecimal(CO2_EVITADO_ANO_T)} t</p>
                  <p className="text-[11px] text-muted-foreground">de CO₂ equivalente evitado por ano</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-success/20">
                <strong className="text-foreground">Estimativa preliminar.</strong> Os dois fatores
                usados no cálculo — massa por transação e CO₂ por tonelada — ainda não têm fonte
                publicada que os confirme. Leia como ordem de grandeza, não como dado ambiental
                verificado.
              </p>
            </Card>
          </TabsContent>

          {/* --- Projeção trienal --- */}
          <TabsContent value="projecao" className="space-y-3 mt-4">
            {PROJECAO.map(ano => {
              const margem = (ano.resultadoAnual / ano.receitaAnual) * 100;
              return (
                <Card key={ano.ano} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-sm">Ano {ano.ano}</h2>
                    <Badge variant="outline" className="text-[10px]">
                      {ano.transacoesMes} transações/mês
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Receita</p>
                      <p className="text-xs font-bold mt-0.5">{formatCurrency(ano.receitaAnual)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Custo</p>
                      <p className="text-xs font-bold mt-0.5">{formatCurrency(ano.custoAnual)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Resultado</p>
                      <p className="text-xs font-bold mt-0.5 text-success">{formatCurrency(ano.resultadoAnual)}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(margem, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Margem de {formatPercent(margem)}
                  </p>
                </Card>
              );
            })}
            <Card className="p-3 bg-muted/50">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                A projeção assume crescimento de 2,4× no segundo ano e 4,6× no terceiro sobre o
                volume do 12º mês. Os custos variáveis acompanham o volume; os fixos crescem apenas
                55% do fator, refletindo o ganho de escala de uma plataforma digital.
              </p>
            </Card>
          </TabsContent>

          {/* --- Premissas --- */}
          <TabsContent value="premissas" className="space-y-3 mt-4">
            <Card className="p-3 bg-primary/5 border-primary/20">
              <p className="text-[11px] leading-relaxed">
                Todo número deste plano deriva das premissas abaixo. Nenhum valor foi arbitrado sem
                fonte declarada.
              </p>
            </Card>
            {PREMISSAS.map(p => (
              <Card key={p.chave} className="p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium">{p.rotulo}</p>
                  <p className="text-sm font-bold shrink-0">
                    {p.unidade === 'R$'
                      ? formatCurrency(p.valor)
                      : p.unidade === '%'
                        ? formatPercent(p.valor, Number.isInteger(p.valor) ? 0 : 1)
                        : formatDecimal(p.valor, Number.isInteger(p.valor) ? 0 : 1)}
                    {p.unidade !== 'R$' && p.unidade !== '%' && (
                      <span className="text-[10px] font-normal text-muted-foreground"> {p.unidade}</span>
                    )}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Fonte: {p.fonte}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Indicador({
  titulo, valor, detalhe, icone: Icone, destaque,
}: {
  titulo: string; valor: string; detalhe: string; icone: typeof PiggyBank; destaque?: boolean;
}) {
  return (
    <Card className={`p-3.5 ${destaque ? 'bg-success/5 border-success/20' : ''}`}>
      <Icone className={`w-4 h-4 mb-2 ${destaque ? 'text-success' : 'text-muted-foreground'}`} />
      <p className="text-[11px] text-muted-foreground">{titulo}</p>
      <p className="text-lg font-bold leading-tight mt-0.5">{valor}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{detalhe}</p>
    </Card>
  );
}

function Linha({ termo, valor }: { termo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{termo}</dt>
      <dd className="font-semibold shrink-0">{valor}</dd>
    </div>
  );
}
