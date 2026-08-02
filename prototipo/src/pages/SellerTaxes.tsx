import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Landmark, Receipt, FileText, AlertTriangle, CheckCircle2, Calendar, Calculator,
  BookOpen, ExternalLink, Percent, Info,
} from 'lucide-react';
import { TAX_PROFILES, PLATFORM_FEE_TABLE, TAX_GLOSSARY, type TaxProfile } from '@/lib/legal';
import { formatCurrency } from '@/lib/formatters';
import AppHeader from '@/components/layout/AppHeader';

/**
 * Tributos e obrigações do vendedor (L2).
 *
 * Conteúdo orientativo dentro do produto, comparando pessoa física, MEI e
 * Simples Nacional, com a tabela de taxas da plataforma e uma calculadora
 * simples do valor líquido. Não substitui a orientação de um contador.
 */
export default function SellerTaxes() {
  const [profileKey, setProfileKey] = useState<TaxProfile['key']>('mei');
  const [amount, setAmount] = useState(1000);

  const profile = TAX_PROFILES.find(p => p.key === profileKey) || TAX_PROFILES[0];

  // Simulação do líquido por plano, para o valor informado.
  const simulation = PLATFORM_FEE_TABLE.map(row => {
    const percent = parseFloat(row.fee);
    const fee = amount * (percent / 100);
    const monthly = parseFloat(row.monthly.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return { ...row, fee, net: amount - fee, monthly };
  });

  return (
    <div>
      <AppHeader showBack title="Tributos e obrigações" />
      <div className="px-4 py-4 space-y-5">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Vender legalizado é mais simples do que parece</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Reunimos aqui o que muda entre vender como pessoa física, como MEI ou como empresa no
                Simples Nacional: quanto se paga, quais documentos emitir e quais prazos cumprir.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-warning/5 border-warning-strong/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-warning-strong shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Conteúdo informativo, atualizado com as regras gerais vigentes. Valores e alíquotas
              mudam por ano e por estado — confirme com um contador antes de decidir. A HandMade não
              emite notas fiscais no lugar do vendedor.
            </p>
          </div>
        </Card>

        {/* Seletor de perfil */}
        <section aria-labelledby="perfil-title">
          <h2 id="perfil-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Qual é o seu caso?
          </h2>
          <Tabs value={profileKey} onValueChange={v => setProfileKey(v as TaxProfile['key'])}>
            <TabsList className="w-full">
              <TabsTrigger value="pf" className="flex-1 text-[11px]">Pessoa Física</TabsTrigger>
              <TabsTrigger value="mei" className="flex-1 text-[11px]">MEI</TabsTrigger>
              <TabsTrigger value="simples" className="flex-1 text-[11px]">Simples</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="p-4 mt-3 animate-fade-in">
            <h3 className="text-base font-bold">{profile.label}</h3>

            <div className="mt-3 space-y-3">
              <Block icon={CheckCircle2} title="Para quem é" text={profile.who} />
              <Block icon={Percent} title="Limites" text={profile.limits} />

              <div>
                <p className="text-xs font-semibold flex items-center gap-1.5 mb-1.5">
                  <Calculator className="w-3.5 h-3.5 text-primary" /> O que se paga
                </p>
                <ul className="space-y-1.5">
                  {profile.taxes.map((tax, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-primary shrink-0 mt-0.5" aria-hidden="true">•</span>
                      <span>{tax}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Block icon={Receipt} title="Nota fiscal" text={profile.invoice} />

              <div>
                <p className="text-xs font-semibold flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Obrigações e prazos
                </p>
                <ul className="space-y-1.5">
                  {profile.obligations.map((obligation, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                      <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
                      <span>{obligation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="p-3 bg-warning/5 border-warning-strong/30">
                <p className="text-xs font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning-strong" /> Fique atento
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {profile.attention}
                </p>
              </Card>
            </div>
          </Card>
        </section>

        {/* Taxa da plataforma */}
        <section aria-labelledby="taxa-title">
          <h2 id="taxa-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Taxa da HandMade por plano
          </h2>
          <Card className="divide-y">
            {PLATFORM_FEE_TABLE.map(row => (
              <div key={row.plan} className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">{row.plan}</p>
                  <Badge variant="outline" className="text-[10px]">{row.fee}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mensalidade: {row.monthly} · {row.example}
                </p>
              </div>
            ))}
          </Card>
          <p className="text-[11px] text-muted-foreground mt-2">
            A taxa incide apenas sobre vendas concluídas. Doações e trocas não têm taxa. Publicar é
            sempre gratuito.
          </p>
        </section>

        {/* Simulador */}
        <section aria-labelledby="sim-title">
          <h2 id="sim-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Simule quanto você recebe
          </h2>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Valor da venda</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {[250, 500, 1000, 3000, 5000].map(value => (
                <Button
                  key={value}
                  size="sm"
                  variant={amount === value ? 'default' : 'outline'}
                  className="h-8 text-[11px]"
                  onClick={() => setAmount(value)}
                >
                  {formatCurrency(value)}
                </Button>
              ))}
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2.5">
              {simulation.map(row => (
                <div key={row.plan} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{row.plan}</p>
                    <p className="text-[10px] text-muted-foreground">
                      taxa de {formatCurrency(row.fee)}
                      {row.monthly > 0 && ` + ${formatCurrency(row.monthly)}/mês`}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary tabular-nums shrink-0">
                    {formatCurrency(row.net)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              Valores antes dos tributos do seu regime. Para o MEI, some cerca de R$ 76 de DAS por
              mês, independentemente do número de vendas.
            </p>
          </Card>
        </section>

        {/* Comparativo */}
        <section aria-labelledby="comp-title">
          <h2 id="comp-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Comparativo rápido
          </h2>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-4 gap-1 p-2.5 bg-muted text-[10px] font-semibold">
              <span>Item</span>
              <span>PF</span>
              <span>MEI</span>
              <span>Simples</span>
            </div>
            {[
              ['CNPJ', 'Não', 'Sim', 'Sim'],
              ['Limite/ano', '—', 'R$ 81 mil', 'R$ 4,8 mi'],
              ['Nota fiscal', 'Não emite', 'Obrigatória p/ PJ', 'Sempre'],
              ['Guia mensal', 'Não', 'DAS fixo', 'DAS variável'],
              ['Contador', 'Dispensável', 'Opcional', 'Recomendado'],
              ['Declaração', 'IRPF', 'DASN-SIMEI', 'DEFIS'],
            ].map((row, i) => (
              <div
                key={row[0]}
                className={`grid grid-cols-4 gap-1 p-2.5 text-[10px] ${i % 2 === 0 ? '' : 'bg-muted/40'}`}
              >
                <span className="font-medium">{row[0]}</span>
                <span className="text-muted-foreground">{row[1]}</span>
                <span className="text-muted-foreground">{row[2]}</span>
                <span className="text-muted-foreground">{row[3]}</span>
              </div>
            ))}
          </Card>
        </section>

        {/* Glossário */}
        <section aria-labelledby="glos-title">
          <h2 id="glos-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Glossário
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {TAX_GLOSSARY.map(entry => (
              <AccordionItem key={entry.term} value={entry.term} className="border rounded-xl px-3 bg-card">
                <AccordionTrigger className="text-sm font-medium py-3">{entry.term}</AccordionTrigger>
                <AccordionContent className="pb-3 text-xs text-muted-foreground leading-relaxed">
                  {entry.meaning}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Onde resolver */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4" /> Onde resolver cada coisa
          </p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Abrir MEI e emitir o DAS: Portal do Empreendedor (gov.br).</li>
            <li>• Emitir NFC-e ou NF-e: emissor gratuito da Secretaria da Fazenda do seu estado.</li>
            <li>• Consultar o Simples Nacional: portal do Simples Nacional (Receita Federal).</li>
            <li>• MTR para resíduos: sistema do órgão ambiental estadual.</li>
            <li>• Declarar IRPF e ganho de capital: programas da Receita Federal.</li>
          </ul>
        </Card>

        <div className="space-y-2">
          <Button asChild variant="outline" className="w-full h-11 gap-2">
            <Link to="/planos" className="block">
              <Percent className="w-4 h-4" /> Comparar planos e taxas
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full h-11 gap-2">
            <Link to="/ajuda" className="block">
              <FileText className="w-4 h-4" /> Central de ajuda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, text }: { icon: typeof Receipt; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-primary" /> {title}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
