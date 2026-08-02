import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Check, QrCode, CreditCard, Barcode, Lock, Loader2 } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { useAuth } from '@/lib/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import { toast } from 'sonner';
import { paymentStore } from '@/lib/store';
import { formatCurrency } from '@/lib/formatters';
import {
  PAYMENT_METHODS,
  generateReceiptCode,
  generateAuthorizationCode,
  generatePixCode,
  generateBoletoLine,
  boletoDueDate,
  PAYMENT_METHOD_LABEL,
} from '@/lib/payments';
import type { PaymentMethod } from '@/lib/types';

export default function Plans() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isCompany = user?.account_type === 'company';

  // Passo de pagamento da assinatura. `null` = ainda na vitrine de planos.
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [processing, setProcessing] = useState(false);

  /**
   * Assinatura do plano — cobrada por pagamento direto (5.0).
   *
   * Na v4.0 a mensalidade era lançada como débito na carteira. Aqui gera um
   * pagamento com recibo próprio, igual a qualquer outra cobrança do aplicativo,
   * e o método é escolhido pelo usuário — PIX, cartão ou boleto — em lugar de
   * assumir cartão de crédito, como fazia a primeira versão desta tela.
   */
  const confirmSubscription = async (planKey: string) => {
    if (!user) return;
    const plan = PLANS[planKey as keyof typeof PLANS];
    const option = PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[0];

    setProcessing(true);
    await new Promise(resolve => window.setTimeout(resolve, option.latency));

    const now = new Date();
    const receiptCode = generateReceiptCode();
    // Boleto só é reconhecido após a compensação: o plano permanece pendente.
    const approved = method !== 'boleto';

    const payment = paymentStore.create({
      order_id: `subscription_${planKey}_${now.getTime()}`,
      payer_email: user.email,
      payee_email: 'plataforma@handmade.com.br',
      method,
      status: approved ? 'approved' : 'pending',
      amount: plan.price,
      platform_fee: 0,
      net_amount: plan.price,
      fee_percent_applied: 0,
      installments: method === 'credit_card' ? 1 : undefined,
      pix_code: method === 'pix' ? generatePixCode(plan.price, receiptCode) : undefined,
      boleto_line: method === 'boleto' ? generateBoletoLine() : undefined,
      boleto_due_date: method === 'boleto' ? boletoDueDate(now).toISOString() : undefined,
      receipt_code: receiptCode,
      authorization_code: approved ? generateAuthorizationCode() : undefined,
      paid_at: approved ? now.toISOString() : undefined,
      created_at: now.toISOString(),
    } as any);

    setProcessing(false);
    setCheckoutPlan(null);

    if (!approved) {
      toast.info('Boleto gerado', {
        description: `O plano ${plan.name} é ativado assim que o boleto for compensado.`,
        action: { label: 'Ver recibo', onClick: () => navigate(`/pagamento/recibo/${payment.id}`) },
      });
      return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    updateUser({
      subscription_plan: planKey as 'free' | 'pro' | 'enterprise',
      subscription_expires_at: expires.toISOString(),
    });
    toast.success(`Bem-vindo ao plano ${plan.name}!`, {
      description: `Pago via ${PAYMENT_METHOD_LABEL[method]}. A taxa por venda cai para ${plan.fee_percent}%.`,
      action: { label: 'Ver recibo', onClick: () => navigate(`/pagamento/recibo/${payment.id}`) },
    });
  };

  const subscribe = (planKey: string) => {
    if (!user) return;
    if (planKey === 'free') return;
    setMethod('pix');
    setCheckoutPlan(planKey);
  };

  const methodIcon = (value: PaymentMethod) =>
    value === 'pix' ? QrCode : value === 'credit_card' ? CreditCard : Barcode;

  // --- Pagamento da assinatura --------------------------------------------
  if (checkoutPlan) {
    const plan = PLANS[checkoutPlan as keyof typeof PLANS];
    return (
      <div>
        <AppHeader showBack title="Pagar assinatura" />
        <div className="px-4 py-4">
          <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Plano {plan.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mensalidade · taxa de {plan.fee_percent}% por venda
                </p>
              </div>
              <p className="text-xl font-bold text-primary tabular-nums">
                {formatCurrency(plan.price)}
              </p>
            </div>
          </Card>

          <h2 className="text-sm font-semibold mb-2">Forma de pagamento</h2>
          <RadioGroup
            value={method}
            onValueChange={value => setMethod(value as PaymentMethod)}
            className="space-y-2 mb-4"
          >
            {PAYMENT_METHODS.map(option => {
              const Icon = methodIcon(option.value);
              const isSelected = method === option.value;
              return (
                <Label
                  key={option.value}
                  className={`flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={option.value} />
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.settlement}</p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>

          <Card className="p-4 mb-4">
            <div className="flex justify-between font-bold">
              <span>Total hoje</span>
              <span className="text-primary tabular-nums">{formatCurrency(plan.price)}</span>
            </div>
            <Separator className="my-2" />
            <p className="text-[11px] text-muted-foreground">
              Renovação manual em 30 dias. Sem contrato de fidelidade: você pode voltar ao plano
              gratuito quando quiser.
            </p>
          </Card>

          <div className="space-y-2">
            <Button
              type="button"
              className="w-full h-12 text-[15px] gap-2"
              disabled={processing}
              onClick={() => confirmSubscription(checkoutPlan)}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Confirmando…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pagar {formatCurrency(plan.price)}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              disabled={processing}
              onClick={() => setCheckoutPlan(null)}
            >
              Voltar aos planos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Vitrine de planos --------------------------------------------------
  return (
    <div>
      <AppHeader showBack title="Planos" />
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-center mb-1">Escolha o plano certo para você</h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {isCompany ? 'Planos para empresas e profissionais' : 'Planos para pessoa física'} · Sem contrato. Cancele quando quiser.
        </p>

        <div className="inline-flex items-center gap-2 mb-6 mx-auto w-full justify-center">
          <Badge variant="outline" className="text-xs">
            {isCompany ? '🏢 Conta Empresa' : '👤 Conta Pessoa Física'}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Free */}
          <Card className="p-5 border-2">
            <h3 className="text-lg font-bold">Gratuito</h3>
            <p className="text-3xl font-bold mt-1">R$ 0</p>
            <p className="text-xs text-muted-foreground">Para sempre</p>
            <div className="mt-4 space-y-2">
              {PLANS.free.features.map((f, i) => <p key={i} className="text-xs flex items-center gap-2"><Check className="w-3.5 h-3.5 text-success shrink-0" />{f}</p>)}
            </div>
            <Button variant="outline" className="w-full mt-4 h-11" disabled={user?.subscription_plan === 'free'}>
              {user?.subscription_plan === 'free' ? 'Seu plano atual' : 'Plano gratuito'}
            </Button>
          </Card>

          {/* Pro */}
          <Card className="p-5 border-2 border-primary bg-primary/5 relative">
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0">★ MAIS POPULAR</Badge>
            <h3 className="text-lg font-bold">Pro</h3>
            <p className="text-3xl font-bold mt-1">R$ 29,90</p>
            <p className="text-xs text-muted-foreground">/mês</p>
            <div className="mt-4 space-y-2">
              {PLANS.pro.features.map((f, i) => <p key={i} className="text-xs flex items-center gap-2"><Check className="w-3.5 h-3.5 text-warning-strong shrink-0" />{f}</p>)}
            </div>
            <Button className="w-full mt-4 h-11" onClick={() => subscribe('pro')} disabled={user?.subscription_plan === 'pro'}>
              {user?.subscription_plan === 'pro' ? 'Plano atual' : 'Assinar Pro agora'}
            </Button>
          </Card>

          {/* Enterprise — apenas para empresas */}
          {isCompany && (
            <Card className="p-5 border-2 border-foreground bg-foreground text-background relative overflow-hidden">
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                <Badge className="bg-success text-success-foreground border-0 text-[10px]">💰 MELHOR CUSTO-BENEFÍCIO</Badge>
                <Badge className="bg-background text-foreground border-0 text-[10px]">PARA EMPRESAS</Badge>
              </div>
              <h3 className="text-lg font-bold mt-2">Empresarial</h3>
              <p className="text-3xl font-bold mt-1">R$ 89,90</p>
              <p className="text-xs opacity-70">/mês</p>

              <div className="mt-3 p-3 rounded-lg bg-success/20 border border-success/40">
                <p className="text-xs font-semibold">⚡ Vale muito a pena em larga escala</p>
                <p className="text-[11px] mt-1">
                  Economize até <strong>60% em taxas</strong> a partir de R$ 3.000/mês em vendas. Anúncios ilimitados e prioridade total.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {PLANS.enterprise.features.map((f, i) => <p key={i} className="text-xs flex items-center gap-2"><Check className="w-3.5 h-3.5 shrink-0" />{f}</p>)}
              </div>
              <Button variant="secondary" className="w-full mt-4 h-11" onClick={() => subscribe('enterprise')} disabled={user?.subscription_plan === 'enterprise'}>
                {user?.subscription_plan === 'enterprise' ? 'Plano atual' : 'Assinar Empresarial'}
              </Button>
            </Card>
          )}

          {!isCompany && (
            <Card className="p-4 bg-muted/50 border-dashed">
              <p className="text-xs text-center text-muted-foreground">
                💡 Tem uma empresa? <strong>Crie uma conta empresarial</strong> para acessar o plano Empresarial com taxas reduzidas e anúncios ilimitados.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
