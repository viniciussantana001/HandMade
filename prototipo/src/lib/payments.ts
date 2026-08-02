// ---------------------------------------------------------------------------
// HandMade 5.0 — motor de pagamento direto (B3)
//
// Substitui integralmente a Carteira da versão 4.0. Não há saldo, depósito nem
// saque: cada pedido é quitado no ato pelo método escolhido e gera um recibo.
//
// Tudo roda no cliente. A latência e as respostas do "provedor" são simuladas
// para que a experiência seja indistinguível da do aplicativo real.
// ---------------------------------------------------------------------------
import { paymentStore, orderStore, auditStore } from './store';
import type { Payment, PaymentMethod, PaymentStatus, Order } from './types';
import { PLATFORM_FEE_PERCENT } from './plans';

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  settlement: string;
  /** Prazo simulado de processamento, em milissegundos. */
  latency: number;
  /** Status atingido imediatamente após a confirmação. */
  immediateStatus: PaymentStatus;
  discountPercent?: number;
  supportsInstallments?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: 'pix',
    label: 'PIX',
    description: 'Aprovação imediata',
    settlement: 'O vendedor é notificado na hora',
    latency: 1400,
    immediateStatus: 'approved',
  },
  {
    value: 'credit_card',
    label: 'Cartão de crédito',
    description: 'Em até 12x',
    settlement: 'Aprovação em segundos',
    latency: 2100,
    immediateStatus: 'approved',
    supportsInstallments: true,
  },
  {
    value: 'boleto',
    label: 'Boleto bancário',
    description: 'Vence em 3 dias úteis',
    settlement: 'O pedido avança após a compensação',
    latency: 1200,
    immediateStatus: 'pending',
  },
];

export const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 6, 10, 12];

/** Juros mensais simulados para parcelamentos acima de 6 vezes. */
const INSTALLMENT_INTEREST = 0.0199;

export function calculateInstallment(amount: number, installments: number) {
  if (installments <= 6) {
    return { total: amount, perInstallment: amount / installments, interestFree: true };
  }
  const rate = INSTALLMENT_INTEREST;
  const factor = (rate * Math.pow(1 + rate, installments)) / (Math.pow(1 + rate, installments) - 1);
  const perInstallment = amount * factor;
  return { total: perInstallment * installments, perInstallment, interestFree: false };
}

export function feePercentFor(plan: string | undefined) {
  return PLATFORM_FEE_PERCENT[plan || 'free'] ?? PLATFORM_FEE_PERCENT.free;
}

export function calculateFees(amount: number, plan: string | undefined) {
  const feePercent = feePercentFor(plan);
  const platformFee = Math.round(amount * (feePercent / 100) * 100) / 100;
  return { feePercent, platformFee, netAmount: Math.round((amount - platformFee) * 100) / 100 };
}

// --- Geradores de artefatos do provedor ------------------------------------
const randomDigits = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

export function generateReceiptCode() {
  const stamp = new Date();
  const year = stamp.getFullYear();
  return `HM-${year}-${randomDigits(6)}`;
}

export function generateAuthorizationCode() {
  return `AUT${randomDigits(9)}`;
}

/** Gera um código PIX copia-e-cola com a aparência do padrão EMV do Bacen. */
export function generatePixCode(amount: number, receiptCode: string) {
  // O payload EMV exige ponto como separador decimal, independente do idioma.
  // Não troque por formatCurrency/formatDecimal: aqui a vírgula quebraria o código.
  const value = amount.toFixed(2);
  const merchant = 'HANDMADE MARKETPLACE';
  return [
    '00020126',
    `580014BR.GOV.BCB.PIX0136${receiptCode.toLowerCase()}-handmade-prototipo`,
    `52040000530398654${value.length.toString().padStart(2, '0')}${value}`,
    `5802BR5920${merchant}6009MOGI GUACU`,
    `62070503***6304${randomDigits(4)}`,
  ].join('');
}

/** Gera uma linha digitável de boleto no formato de 47 posições. */
export function generateBoletoLine() {
  const blocks = [randomDigits(5), randomDigits(5), randomDigits(5), randomDigits(6), randomDigits(5), randomDigits(6), randomDigits(1), randomDigits(14)];
  return `${blocks[0]}.${blocks[1]} ${blocks[2]}.${blocks[3]} ${blocks[4]}.${blocks[5]} ${blocks[6]} ${blocks[7]}`;
}

export function boletoDueDate(from = new Date()) {
  const due = new Date(from);
  let added = 0;
  // Soma 3 dias úteis, ignorando sábados e domingos.
  while (added < 3) {
    due.setDate(due.getDate() + 1);
    const weekday = due.getDay();
    if (weekday !== 0 && weekday !== 6) added += 1;
  }
  return due;
}

export function detectCardBrand(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'American Express';
  if (/^(4011|4312|4389|5041|6277|6362|6363|650|651|655)/.test(clean)) return 'Elo';
  if (/^(606282|3841)/.test(clean)) return 'Hipercard';
  return 'Cartão';
}

export interface PaymentRequest {
  orderId: string;
  payerEmail: string;
  payeeEmail: string;
  method: PaymentMethod;
  amount: number;
  plan: string | undefined;
  installments?: number;
  cardNumber?: string;
  cardHolder?: string;
}

export interface PaymentResult {
  payment: Payment;
  order?: Order;
}

/**
 * Processa um pagamento direto de forma assíncrona, com latência realista.
 *
 * Resolve sempre — falhas do provedor vêm como `status: 'declined'` com motivo,
 * para que a interface trate o erro sem depender de try/catch espalhado.
 */
export function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  const option = PAYMENT_METHODS.find(m => m.value === request.method) || PAYMENT_METHODS[0];
  const { feePercent, platformFee, netAmount } = calculateFees(request.amount, request.plan);
  const now = new Date();
  const receiptCode = generateReceiptCode();

  return new Promise<PaymentResult>(resolve => {
    window.setTimeout(() => {
      // Cartão inválido (dígito de teste) é recusado de propósito para
      // exercitar o estado de erro no protótipo.
      const cardDigits = (request.cardNumber || '').replace(/\D/g, '');
      const declined = request.method === 'credit_card' && cardDigits.endsWith('0000');

      const status: PaymentStatus = declined ? 'declined' : option.immediateStatus;

      const payment = paymentStore.create({
        order_id: request.orderId,
        payer_email: request.payerEmail,
        payee_email: request.payeeEmail,
        method: request.method,
        status,
        amount: request.amount,
        platform_fee: platformFee,
        net_amount: netAmount,
        fee_percent_applied: feePercent,
        installments: request.method === 'credit_card' ? request.installments || 1 : undefined,
        card_last4: cardDigits ? cardDigits.slice(-4) : undefined,
        card_brand: cardDigits ? detectCardBrand(cardDigits) : undefined,
        pix_code: request.method === 'pix' ? generatePixCode(request.amount, receiptCode) : undefined,
        boleto_line: request.method === 'boleto' ? generateBoletoLine() : undefined,
        boleto_due_date: request.method === 'boleto' ? boletoDueDate(now).toISOString() : undefined,
        receipt_code: receiptCode,
        authorization_code: status === 'approved' ? generateAuthorizationCode() : undefined,
        paid_at: status === 'approved' ? now.toISOString() : undefined,
        failure_reason: declined ? 'Cartão recusado pelo emissor. Verifique os dados ou use outro método.' : undefined,
        created_at: now.toISOString(),
      } as any);

      auditStore.create({
        actor_email: request.payerEmail,
        action: `payment.${status}`,
        entity: 'payment',
        metadata: { order_id: request.orderId, method: request.method, amount: request.amount, receipt: receiptCode },
        created_at: now.toISOString(),
      } as any);

      let order: Order | undefined;
      if (!declined) {
        const orderStatus = status === 'approved' ? 'paid' : 'pending_payment';
        order = orderStore.update(request.orderId, {
          status: orderStatus,
          payment_id: payment.id,
          payment_method: request.method,
          payment_status: status,
          receipt_code: receiptCode,
          status_history: [
            ...(orderStore.get(request.orderId)?.status_history || []),
            { status: orderStatus, date: now.toISOString() },
          ],
        } as any);
      }

      resolve({ payment, order });
    }, option.latency);
  });
}

/** Confirma a compensação de um boleto (usado na tela do pedido). */
export function confirmBoletoPayment(paymentId: string) {
  const payment = paymentStore.get(paymentId);
  if (!payment || payment.status !== 'pending') return undefined;
  const now = new Date().toISOString();
  const updated = paymentStore.update(paymentId, { status: 'approved', paid_at: now, authorization_code: generateAuthorizationCode() });
  const order = orderStore.get(payment.order_id);
  if (order) {
    orderStore.update(order.id, {
      status: 'paid',
      payment_status: 'approved',
      status_history: [...(order.status_history || []), { status: 'paid', date: now }],
    } as any);
  }
  return updated;
}

/** Estorna um pagamento aprovado, devolvendo pelo mesmo método. */
export function refundPayment(paymentId: string, reason: string) {
  const payment = paymentStore.get(paymentId);
  if (!payment || payment.status !== 'approved') return undefined;
  const now = new Date().toISOString();
  const updated = paymentStore.update(paymentId, { status: 'refunded', refunded_at: now, failure_reason: reason });
  auditStore.create({
    actor_email: payment.payer_email,
    action: 'payment.refunded',
    entity: 'payment',
    metadata: { payment_id: paymentId, reason },
    created_at: now,
  } as any);
  return updated;
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: 'Aguardando pagamento',
  processing: 'Processando',
  approved: 'Pago',
  declined: 'Recusado',
  refunded: 'Estornado',
  cancelled: 'Cancelado',
};

export const REFUND_DEADLINE: Record<PaymentMethod, string> = {
  pix: 'até 1 dia útil na conta de origem',
  credit_card: 'em até 2 faturas do cartão',
  boleto: 'em até 5 dias úteis após o envio dos dados bancários',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto bancário',
};
