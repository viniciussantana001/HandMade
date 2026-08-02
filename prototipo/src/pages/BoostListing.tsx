import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  TrendingUp,
  Eye,
  Check,
  Loader2,
  Lock,
  QrCode,
  CreditCard,
  Barcode,
  ChevronRight,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { listingStore, boostStore, paymentStore, notificationStore, useStoreVersion } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency, formatDateBR } from '@/lib/formatters';
import { BOOST_PLANS, CATEGORIES } from '@/lib/categories';
import {
  PAYMENT_METHODS,
  calculateFees,
  detectCardBrand,
  generateReceiptCode,
  generateAuthorizationCode,
  generatePixCode,
  PAYMENT_METHOD_LABEL,
} from '@/lib/payments';
import type { PaymentMethod } from '@/lib/types';
import { maskCardNumber, maskCardExpiry, validateCardNumber, validateCardExpiry } from '@/lib/validators';
import AppHeader from '@/components/layout/AppHeader';
import SmartImage from '@/components/common/SmartImage';
import FormField from '@/components/common/FormField';
import { LoadingScreen } from '@/components/common/StateViews';
import { toast } from 'sonner';

type Step = 'plan' | 'payment' | 'processing' | 'done';

/**
 * Impulsionamento de anúncio (B2 — corrigido na 5.0).
 *
 * Na v4.0 o impulso consumia saldo da carteira dentro de um diálogo e, ao
 * fechar, a tela ficava branca até o recarregamento manual. Agora é uma rota
 * própria com pagamento direto, etapas explícitas e uma tela de sucesso que
 * mostra o resultado e devolve o usuário ao fluxo com feedback claro.
 */
export default function BoostListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  useStoreVersion();

  const [step, setStep] = useState<Step>('plan');
  const [planKey, setPlanKey] = useState('standard');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [boostEnd, setBoostEnd] = useState<string | null>(null);

  const listing = listingStore.get(id || '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (loading) return <LoadingScreen label="Carregando…" />;
  if (!user) return null;

  if (!listing) {
    return (
      <div>
        <AppHeader showBack title="Impulsionar" />
        <div className="px-4 py-20 text-center">
          <p className="text-lg font-bold mb-2">Anúncio não encontrado</p>
          <Button asChild>
            <Link to="/meus-anuncios">Voltar aos meus anúncios</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (listing.created_by !== user.email) {
    return (
      <div>
        <AppHeader showBack title="Impulsionar" />
        <div className="px-4 py-20 text-center">
          <p className="text-lg font-bold mb-2">Este anúncio não é seu</p>
          <p className="text-sm text-muted-foreground mb-4">
            Somente o autor do anúncio pode impulsioná-lo.
          </p>
          <Button asChild>
            <Link to="/meus-anuncios">Ver meus anúncios</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
  const plan = BOOST_PLANS[planKey];

  const validateCard = () => {
    const next: Record<string, string> = {};
    if (!validateCardNumber(cardNumber)) next.cardNumber = 'Número de cartão inválido.';
    if (cardHolder.trim().length < 3) next.cardHolder = 'Informe o nome impresso no cartão.';
    if (!validateCardExpiry(cardExpiry)) next.cardExpiry = 'Validade inválida ou vencida.';
    if (!/^\d{3,4}$/.test(cardCvv)) next.cardCvv = 'CVV deve ter 3 ou 4 dígitos.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /**
   * Conclui o impulsionamento.
   *
   * Diferente da v4.0, todo o efeito colateral acontece antes da troca de
   * etapa e a store notifica os assinantes — então "Meus anúncios" já reflete
   * o destaque quando o usuário volta, sem recarregar a página.
   */
  const handlePay = async () => {
    if (method === 'credit_card' && !validateCard()) {
      toast.error('Confira os dados do cartão');
      return;
    }

    setStep('processing');
    const option = PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[0];

    await new Promise(resolve => window.setTimeout(resolve, option.latency));

    const now = new Date();
    const ends = new Date(now.getTime() + plan.days * 86400000);
    const receiptCode = generateReceiptCode();
    const cardDigits = cardNumber.replace(/\D/g, '');

    const payment = paymentStore.create({
      order_id: `boost_${listing.id}`,
      payer_email: user.email,
      payee_email: 'plataforma@handmade.com.br',
      method,
      status: method === 'boleto' ? 'pending' : 'approved',
      amount: plan.price,
      platform_fee: 0,
      net_amount: plan.price,
      fee_percent_applied: 0,
      card_last4: cardDigits ? cardDigits.slice(-4) : undefined,
      card_brand: cardDigits ? detectCardBrand(cardDigits) : undefined,
      pix_code: method === 'pix' ? generatePixCode(plan.price, receiptCode) : undefined,
      receipt_code: receiptCode,
      authorization_code: method === 'boleto' ? undefined : generateAuthorizationCode(),
      paid_at: method === 'boleto' ? undefined : now.toISOString(),
      created_at: now.toISOString(),
    } as any);

    boostStore.create({
      listing_id: listing.id,
      listing_title: listing.title,
      user_email: user.email,
      plan_key: planKey,
      days: plan.days,
      amount: plan.price,
      payment_id: payment.id,
      starts_at: now.toISOString(),
      ends_at: ends.toISOString(),
      created_at: now.toISOString(),
    } as any);

    // Boleto só aplica o destaque após a compensação; PIX e cartão aplicam já.
    if (method !== 'boleto') {
      listingStore.update(listing.id, { is_boosted: true, boost_until: ends.toISOString() });
    }

    notificationStore.create({
      recipient_email: user.email,
      type: 'boost_active',
      title: method === 'boleto' ? 'Impulso aguardando pagamento' : 'Anúncio impulsionado',
      message:
        method === 'boleto'
          ? `O destaque de "${listing.title}" começa assim que o boleto for compensado.`
          : `"${listing.title}" está em destaque até ${formatDateBR(ends.toISOString())}.`,
      action_url: `/anuncio/${listing.id}`,
      read: false,
      created_at: now.toISOString(),
    } as any);

    setBoostEnd(ends.toISOString());
    setStep('done');
  };

  const methodIcon = (value: PaymentMethod) =>
    value === 'pix' ? QrCode : value === 'credit_card' ? CreditCard : Barcode;

  // --- Processando --------------------------------------------------------
  if (step === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" role="status" aria-live="assertive">
        <div className="w-20 h-20 rounded-3xl bg-warning/10 flex items-center justify-center mb-5">
          <Loader2 className="w-9 h-9 text-warning-strong animate-spin" />
        </div>
        <h1 className="text-lg font-bold text-center">Ativando o destaque</h1>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
          Confirmando o pagamento do impulsionamento. Não feche o aplicativo.
        </p>
      </div>
    );
  }

  // --- Sucesso (B2: sempre com feedback claro) ----------------------------
  if (step === 'done') {
    const pendingBoleto = method === 'boleto';
    return (
      <div>
        <AppHeader title="Impulsionamento" />
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="text-center mb-6"
          >
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-3 ${
                pendingBoleto ? 'bg-warning/10' : 'bg-success/10'
              }`}
            >
              {pendingBoleto ? (
                <Barcode className="w-9 h-9 text-warning-strong" />
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
                >
                  <Rocket className="w-9 h-9 text-success" />
                </motion.div>
              )}
            </div>
            <h1 className="text-xl font-bold">
              {pendingBoleto ? 'Boleto gerado' : 'Anúncio impulsionado!'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              {pendingBoleto
                ? 'O destaque começa assim que o pagamento do boleto for compensado.'
                : `Seu anúncio aparece no topo das buscas e da tela inicial até ${
                    boostEnd ? formatDateBR(boostEnd) : ''
                  }.`}
            </p>
          </motion.div>

          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <SmartImage
                  src={listing.images?.[0]}
                  alt={listing.title}
                  slot="thumb"
                  fallback={<cat.icon className="w-5 h-5 text-muted-foreground/30" />}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium line-clamp-2">{listing.title}</p>
                {!pendingBoleto && (
                  <Badge className="bg-warning/10 text-warning-strong border-0 text-[10px] gap-0.5 mt-1">
                    <Sparkles className="w-2.5 h-2.5" /> Em destaque
                  </Badge>
                )}
              </div>
            </div>
            <Separator className="mb-3" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Plano</dt>
                <dd className="text-sm font-medium">{plan.label} de destaque</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Valor pago</dt>
                <dd className="text-sm font-bold tabular-nums">{formatCurrency(plan.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Método</dt>
                <dd className="text-sm font-medium">{PAYMENT_METHOD_LABEL[method]}</dd>
              </div>
              {boostEnd && !pendingBoleto && (
                <div className="flex justify-between">
                  <dt className="text-xs text-muted-foreground">Destaque até</dt>
                  <dd className="text-sm font-medium">{formatDateBR(boostEnd)}</dd>
                </div>
              )}
            </dl>
          </Card>

          {!pendingBoleto && (
            <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
              <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" /> O que muda agora
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  Seu anúncio aparece antes dos demais nas buscas da categoria.
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  Ganha o selo "Destaque" na listagem e na tela inicial.
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  Anúncios em destaque aparecem antes dos demais enquanto o período durar.
                </li>
              </ul>
            </Card>
          )}

          <div className="space-y-2">
            <Button className="w-full h-12 gap-2" onClick={() => navigate('/meus-anuncios')}>
              <Eye className="w-4 h-4" /> Ver meus anúncios
            </Button>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => navigate(`/anuncio/${listing.id}`)}
            >
              Ver o anúncio publicado
            </Button>
            <Button variant="ghost" className="w-full h-11" onClick={() => navigate('/dashboard')}>
              Ir para o painel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Pagamento ----------------------------------------------------------
  if (step === 'payment') {
    return (
      <div>
        <AppHeader title="Pagar impulsionamento" />
        <div className="px-4 py-4">
          <Card className="p-4 mb-4 bg-warning/5 border-warning-strong/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-warning-strong" /> Destaque de {plan.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <p className="text-xl font-bold text-primary tabular-nums">{formatCurrency(plan.price)}</p>
            </div>
          </Card>

          <h2 className="text-sm font-semibold mb-2">Forma de pagamento</h2>
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
                </Label>
              );
            })}
          </RadioGroup>

          {method === 'credit_card' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-4 mb-4 space-y-3">
                <FormField label="Número do cartão" error={errors.cardNumber} required
                  valid={validateCardNumber(cardNumber)}>
                  {props => (
                    <Input
                      {...props}
                      inputMode="numeric"
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
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(maskCardExpiry(e.target.value))}
                      />
                    )}
                  </FormField>
                  <FormField label="CVV" error={errors.cardCvv} required
                    valid={/^\d{3,4}$/.test(cardCvv)}>
                    {props => (
                      <Input
                        {...props}
                        inputMode="numeric"
                        placeholder="000"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      />
                    )}
                  </FormField>
                </div>
              </Card>
            </motion.div>
          )}

          <Card className="p-4 mb-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary tabular-nums">{formatCurrency(plan.price)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Cobrança única. O impulsionamento não renova automaticamente.
            </p>
          </Card>

          <div className="space-y-2">
            <Button className="w-full h-12 text-[15px] gap-2" onClick={handlePay}>
              <Lock className="w-4 h-4" /> Pagar {formatCurrency(plan.price)}
            </Button>
            <Button variant="outline" className="w-full h-11" onClick={() => setStep('plan')}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Escolha do plano ---------------------------------------------------
  return (
    <div>
      <AppHeader showBack title="Impulsionar anúncio" />
      <div className="px-4 py-4">
        <Card className="p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <SmartImage
                src={listing.images?.[0]}
                alt={listing.title}
                slot="thumb"
                fallback={<cat.icon className="w-5 h-5 text-muted-foreground/30" />}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium line-clamp-2">{listing.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {listing.views || 0} visualizações até agora
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-warning/5 border-primary/20">
          <p className="text-sm font-semibold flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> Por que impulsionar?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Anúncios em destaque aparecem no topo das buscas da categoria e na tela inicial, com selo
            próprio. O destaque vale pelo período contratado e pode ser acompanhado no painel.
          </p>
        </Card>

        <h2 className="text-sm font-semibold mb-2">Escolha a duração</h2>
        <RadioGroup value={planKey} onValueChange={setPlanKey} className="space-y-2 mb-4">
          {Object.entries(BOOST_PLANS).map(([key, option]) => {
            const isSelected = planKey === key;
            const perDay = option.price / option.days;
            return (
              <Label
                key={key}
                className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={key} />
                  <div>
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      {option.label}
                      {key === 'standard' && (
                        <Badge className="bg-primary text-primary-foreground border-0 text-[9px] px-1.5 py-0">
                          MAIS ESCOLHIDO
                        </Badge>
                      )}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(perDay)} por dia
                    </p>
                  </div>
                </div>
                <span className="font-bold text-primary text-sm tabular-nums">
                  {formatCurrency(option.price)}
                </span>
              </Label>
            );
          })}
        </RadioGroup>

        <Button className="w-full h-12 text-[15px] gap-2" onClick={() => setStep('payment')}>
          Continuar para o pagamento <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="w-full h-11 mt-2" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
