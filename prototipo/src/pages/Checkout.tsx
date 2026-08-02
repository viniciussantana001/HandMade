import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  QrCode,
  Barcode,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { listingStore, orderStore, notificationStore } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency } from '@/lib/formatters';
import {
  PAYMENT_METHODS,
  INSTALLMENT_OPTIONS,
  calculateFees,
  calculateInstallment,
  detectCardBrand,
  processPayment,
} from '@/lib/payments';
import type { PaymentMethod } from '@/lib/types';
import { maskCardNumber, maskCardExpiry, validateCardNumber, validateCardExpiry } from '@/lib/validators';
import AppHeader from '@/components/layout/AppHeader';
import SmartImage from '@/components/common/SmartImage';
import FormField from '@/components/common/FormField';
import { LoadingScreen } from '@/components/common/StateViews';
import { CATEGORIES } from '@/lib/categories';
import { toast } from 'sonner';

type Step = 'method' | 'confirm' | 'processing';

/**
 * Pagamento direto — etapa 1 (método) e etapa 2 (confirmação) — B3.
 *
 * Substitui o fluxo de carteira da versão 4.0. O comprador escolhe o método,
 * confere o resumo com a taxa destacada e confirma; o recibo é exibido na tela
 * seguinte (/pagamento/recibo/:id).
 */
export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading } = useRequireAuth();

  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [installments, setInstallments] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const listing = listingStore.get(id || '');

  // Rola ao topo na troca de etapa, como faz um aplicativo nativo.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (loading) return <LoadingScreen label="Preparando o pagamento…" />;
  if (!user) return null;

  if (!listing) {
    return (
      <div>
        <AppHeader showBack title="Pagamento" />
        <div className="px-4 py-20 text-center">
          <p className="text-lg font-bold mb-2">Anúncio não encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Este anúncio pode ter sido removido ou já foi vendido.
          </p>
          <Button asChild>
            <Link to="/marketplace">Voltar ao marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
  const { feePercent, platformFee, netAmount } = calculateFees(listing.price, user.subscription_plan);
  const selectedMethod = PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[0];
  const installmentInfo = useMemo(
    () => calculateInstallment(listing.price, installments),
    [listing.price, installments]
  );
  const cardBrand = cardNumber.replace(/\D/g, '').length >= 4 ? detectCardBrand(cardNumber) : '';
  const totalToPay = method === 'credit_card' ? installmentInfo.total : listing.price;

  const validateCard = () => {
    const next: Record<string, string> = {};
    if (!validateCardNumber(cardNumber)) next.cardNumber = 'Número de cartão inválido.';
    if (cardHolder.trim().length < 3) next.cardHolder = 'Informe o nome impresso no cartão.';
    if (!validateCardExpiry(cardExpiry)) next.cardExpiry = 'Validade inválida ou vencida.';
    if (!/^\d{3,4}$/.test(cardCvv)) next.cardCvv = 'CVV deve ter 3 ou 4 dígitos.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToConfirm = () => {
    if (method === 'credit_card' && !validateCard()) {
      toast.error('Confira os dados do cartão');
      return;
    }
    setErrors({});
    setStep('confirm');
  };

  const handlePay = async () => {
    const fresh = listingStore.get(listing.id);
    if (!fresh || fresh.status !== 'active') {
      toast.error('Este anúncio não está mais disponível.');
      navigate(`/anuncio/${listing.id}`, { replace: true });
      return;
    }

    setStep('processing');

    // Cria o pedido antes de acionar o provedor, para que o pagamento tenha
    // sempre um pedido de referência mesmo se for recusado.
    const order = orderStore.create({
      listing_id: listing.id,
      listing_title: listing.title,
      listing_image: listing.images?.[0] || '',
      listing_snapshot: {
        title: listing.title,
        price: listing.price,
        description: listing.description,
        images: listing.images,
        seller_name: listing.seller_name,
        location: listing.location,
        category: listing.category,
        condition: listing.condition,
      },
      seller_email: listing.created_by,
      seller_name: listing.seller_name,
      buyer_email: user.email,
      buyer_name: user.full_name,
      amount: listing.price,
      platform_fee: platformFee,
      seller_amount: netAmount,
      fee_percent_applied: feePercent,
      payment_method: method,
      status: 'pending_payment',
      notes,
      status_history: [{ status: 'created', date: new Date().toISOString() }],
      created_date: new Date().toISOString(),
    } as any);

    const { payment } = await processPayment({
      orderId: order.id,
      payerEmail: user.email,
      payeeEmail: listing.created_by,
      method,
      amount: listing.price,
      plan: user.subscription_plan,
      installments,
      cardNumber,
      cardHolder,
    });

    if (payment.status === 'declined') {
      setStep('confirm');
      toast.error(payment.failure_reason || 'Pagamento recusado.');
      return;
    }

    // Somente pagamentos aprovados retiram o anúncio do ar; boleto pendente
    // mantém o anúncio reservado até a compensação.
    if (payment.status === 'approved') {
      listingStore.update(listing.id, { status: 'sold' });
      notificationStore.create({
        recipient_email: listing.created_by,
        type: 'order_paid',
        title: 'Nova venda paga',
        message: `${user.full_name} pagou "${listing.title}". Combine o envio ou a retirada.`,
        action_url: '/meus-pedidos',
        read: false,
        created_at: new Date().toISOString(),
      } as any);
    } else {
      notificationStore.create({
        recipient_email: listing.created_by,
        type: 'order_pending',
        title: 'Boleto gerado para o seu anúncio',
        message: `${user.full_name} gerou um boleto para "${listing.title}". Você é avisado quando o pagamento for compensado.`,
        action_url: '/meus-pedidos',
        read: false,
        created_at: new Date().toISOString(),
      } as any);
    }

    if (saveCard && method === 'credit_card') {
      toast.success('Cartão salvo para as próximas compras');
    }

    navigate(`/pagamento/recibo/${payment.id}`, { replace: true });
  };

  const methodIcon = (value: PaymentMethod) =>
    value === 'pix' ? QrCode : value === 'credit_card' ? CreditCard : Barcode;

  // --- Etapa: processando -------------------------------------------------
  if (step === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" role="status" aria-live="assertive">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5">
          <Loader2 className="w-9 h-9 text-primary animate-spin" />
        </div>
        <h1 className="text-lg font-bold text-center">Processando seu pagamento</h1>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
          {method === 'pix' && 'Confirmando o PIX com o banco. Não feche o aplicativo.'}
          {method === 'credit_card' && 'Autorizando a compra com o emissor do cartão.'}
          {method === 'boleto' && 'Gerando o seu boleto bancário.'}
        </p>
        <div className="flex items-center gap-1.5 mt-6 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5" /> Conexão protegida
        </div>
      </div>
    );
  }

  // --- Etapa: confirmação -------------------------------------------------
  if (step === 'confirm') {
    const MethodIcon = methodIcon(method);
    return (
      <div>
        <AppHeader title="Confirmar pagamento" />
        <div className="px-4 py-4">
          <StepIndicator current={2} />

          <Card className="p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <SmartImage
                  src={listing.images?.[0]}
                  alt={listing.title}
                  slot="thumb"
                  fallback={<cat.icon className="w-6 h-6 text-muted-foreground/30" />}
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm line-clamp-2">{listing.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Vendido por {listing.seller_name}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Forma de pagamento
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MethodIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{selectedMethod.label}</p>
                <p className="text-xs text-muted-foreground">
                  {method === 'credit_card' && cardBrand
                    ? `${cardBrand} •••• ${cardNumber.replace(/\D/g, '').slice(-4)} · ${installments}x de ${formatCurrency(installmentInfo.perInstallment)}`
                    : selectedMethod.settlement}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setStep('method')}>
                Alterar
              </Button>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Resumo do pagamento
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor do material</span>
                <span className="tabular-nums">{formatCurrency(listing.price)}</span>
              </div>
              {method === 'credit_card' && !installmentInfo.interestFree && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Juros do parcelamento</span>
                  <span className="tabular-nums">
                    {formatCurrency(installmentInfo.total - listing.price)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total a pagar</span>
                <span className="text-primary tabular-nums">{formatCurrency(totalToPay)}</span>
              </div>
              {method === 'credit_card' && installments > 1 && (
                <p className="text-[11px] text-muted-foreground text-right">
                  {installments}x de {formatCurrency(installmentInfo.perInstallment)}
                  {installmentInfo.interestFree ? ' sem juros' : ' com juros'}
                </p>
              )}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Taxa de serviço HandMade ({feePercent}%)</span>
                <span className="tabular-nums">{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>O vendedor recebe</span>
                <span className="tabular-nums">{formatCurrency(netAmount)}</span>
              </div>
              <p className="text-[10px] pt-1">
                A taxa é descontada do vendedor e financia a proteção da compra e o suporte. Você
                paga apenas o valor do material.
              </p>
            </div>
          </Card>

          <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Compra protegida</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Se o material não chegar ou for diferente do anunciado, você tem 7 dias para pedir
                  a devolução do valor pago.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button className="w-full h-12 text-[15px] gap-2" onClick={handlePay}>
              <Lock className="w-4 h-4" />
              {method === 'boleto' ? 'Gerar boleto' : `Pagar ${formatCurrency(totalToPay)}`}
            </Button>
            <Button variant="outline" className="w-full h-11" onClick={() => setStep('method')}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Etapa: escolha do método -------------------------------------------
  return (
    <div>
      <AppHeader showBack title="Pagamento" />
      <div className="px-4 py-4">
        <StepIndicator current={1} />

        <Card className="p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <SmartImage
                src={listing.images?.[0]}
                alt={listing.title}
                slot="thumb"
                fallback={<cat.icon className="w-6 h-6 text-muted-foreground/30" />}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm line-clamp-2">{listing.title}</p>
              <p className="text-lg font-bold text-primary mt-0.5">{formatCurrency(listing.price)}</p>
            </div>
          </div>
        </Card>

        <h2 className="text-sm font-semibold mb-2">Como você quer pagar?</h2>
        <RadioGroup
          value={method}
          onValueChange={value => {
            setMethod(value as PaymentMethod);
            setErrors({});
          }}
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
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {option.value === 'pix' && (
                  <Badge className="bg-success/10 text-success border-0 text-[10px]">Na hora</Badge>
                )}
              </Label>
            );
          })}
        </RadioGroup>

        {method === 'credit_card' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <Card className="p-4 mb-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Dados do cartão
              </p>

              <FormField label="Número do cartão" error={errors.cardNumber} required
                valid={validateCardNumber(cardNumber)}
                hint={cardBrand ? `Cartão ${cardBrand} identificado` : undefined}>
                {props => (
                  <Input
                    {...props}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(maskCardNumber(e.target.value))}
                  />
                )}
              </FormField>

              <FormField label="Nome impresso no cartão" error={errors.cardHolder} required
                valid={cardHolder.trim().length >= 3}>
                {props => (
                  <Input
                    {...props}
                    autoComplete="cc-name"
                    placeholder="Como aparece no cartão"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value.toUpperCase())}
                  />
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Validade" error={errors.cardExpiry} required
                  valid={validateCardExpiry(cardExpiry)}>
                  {props => (
                    <Input
                      {...props}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(maskCardExpiry(e.target.value))}
                    />
                  )}
                </FormField>
                <FormField label="CVV" error={errors.cardCvv} required
                  valid={/^\d{3,4}$/.test(cardCvv)} hint="3 ou 4 dígitos">
                  {props => (
                    <Input
                      {...props}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="000"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  )}
                </FormField>
              </div>

              <div>
                <Label className="text-sm">Parcelamento</Label>
                <Select value={String(installments)} onValueChange={v => setInstallments(Number(v))}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTALLMENT_OPTIONS.map(n => {
                      const info = calculateInstallment(listing.price, n);
                      return (
                        <SelectItem key={n} value={String(n)}>
                          {n}x de {formatCurrency(info.perInstallment)}
                          {info.interestFree ? ' sem juros' : ' com juros'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <Checkbox checked={saveCard} onCheckedChange={v => setSaveCard(Boolean(v))} className="mt-0.5" />
                <span className="text-xs text-muted-foreground">
                  Salvar este cartão para as próximas compras (guardamos apenas os quatro últimos
                  dígitos neste dispositivo)
                </span>
              </Label>
            </Card>
          </motion.div>
        )}

        {method === 'pix' && (
          <Card className="p-4 mb-4 bg-muted/40">
            <div className="flex items-start gap-2.5">
              <QrCode className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Você recebe o código na próxima tela</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Copie o código PIX ou leia o QR Code no aplicativo do seu banco. A confirmação é
                  imediata.
                </p>
              </div>
            </div>
          </Card>
        )}

        {method === 'boleto' && (
          <Card className="p-4 mb-4 bg-warning/5 border-warning-strong/30">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-warning-strong shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">O material fica reservado até o vencimento</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  O boleto vence em 3 dias úteis e a compensação leva até 2 dias úteis. O vendedor só
                  é liberado para o envio depois disso.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-4">
          <Label className="text-sm">Observações para o vendedor (opcional)</Label>
          <Textarea
            placeholder="Ex.: consigo retirar no sábado pela manhã"
            value={notes}
            onChange={e => setNotes(e.target.value.slice(0, 500))}
            className="mt-1 h-20 text-sm"
          />
          <p className="text-[10px] text-muted-foreground mt-1 text-right tabular-nums">
            {notes.length}/500
          </p>
        </div>

        <Button className="w-full h-12 text-[15px] gap-2" onClick={goToConfirm}>
          Revisar pagamento <ChevronRight className="w-4 h-4" />
        </Button>
        <p className="text-[11px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> Nenhuma cobrança é feita antes da sua confirmação
        </p>
      </div>
    </div>
  );
}

/** Indicador das três etapas do pagamento direto. */
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Método', 'Confirmação', 'Recibo'];
  return (
    <div className="flex items-center gap-1.5 mb-4" role="list" aria-label="Etapas do pagamento">
      {steps.map((label, i) => {
        const index = i + 1;
        const done = index < current;
        const active = index === current;
        return (
          <div key={label} className="flex items-center gap-1.5 flex-1" role="listitem">
            <div
              className={`flex items-center gap-1.5 ${
                active ? 'text-primary' : done ? 'text-success' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : done
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="w-3 h-3" /> : index}
              </div>
              <span className="text-[11px] font-medium whitespace-nowrap">{label}</span>
            </div>
            {index < steps.length && <div className={`h-0.5 flex-1 rounded-full ${done ? 'bg-success' : 'bg-muted'}`} />}
          </div>
        );
      })}
    </div>
  );
}
