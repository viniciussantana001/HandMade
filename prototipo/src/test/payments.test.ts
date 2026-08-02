// ---------------------------------------------------------------------------
// C2 — testes do motor de pagamento direto (B3)
//
// Cobrem as regras de dinheiro do aplicativo: taxa por plano, parcelamento,
// artefatos do provedor (PIX, boleto), aprovação, recusa e estorno.
// ---------------------------------------------------------------------------
import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateFees,
  calculateInstallment,
  feePercentFor,
  detectCardBrand,
  generateBoletoLine,
  generatePixCode,
  generateReceiptCode,
  boletoDueDate,
  processPayment,
  confirmBoletoPayment,
  refundPayment,
  PAYMENT_METHODS,
} from '@/lib/payments';
import { orderStore, paymentStore, resetAllData } from '@/lib/store';

function seedOrder(id = 'order-test-001', amount = 200) {
  orderStore.create({
    id,
    listing_id: 'listing-test-001',
    listing_title: 'Lote de madeira de demolição',
    listing_image: '',
    seller_email: 'vendedor@teste.com',
    seller_name: 'Vendedor Teste',
    buyer_email: 'comprador@teste.com',
    buyer_name: 'Comprador Teste',
    amount,
    platform_fee: 0,
    seller_amount: amount,
    fee_percent_applied: 5,
    status: 'created',
    status_history: [{ status: 'created', date: new Date().toISOString() }],
    created_date: new Date().toISOString(),
  } as any);
  return id;
}

beforeEach(() => {
  resetAllData();
});

describe('taxas da plataforma', () => {
  it('aplica 5% no plano gratuito, 3% no Pro e 2% no Empresarial', () => {
    expect(feePercentFor('free')).toBe(5);
    expect(feePercentFor('pro')).toBe(3);
    expect(feePercentFor('enterprise')).toBe(2);
  });

  it('trata plano ausente como gratuito', () => {
    expect(feePercentFor(undefined)).toBe(5);
  });

  it('calcula taxa e valor líquido com duas casas decimais', () => {
    const { feePercent, platformFee, netAmount } = calculateFees(250, 'free');
    expect(feePercent).toBe(5);
    expect(platformFee).toBe(12.5);
    expect(netAmount).toBe(237.5);
    expect(platformFee + netAmount).toBeCloseTo(250, 2);
  });

  it('reduz a taxa conforme o plano do vendedor', () => {
    expect(calculateFees(1000, 'free').platformFee).toBe(50);
    expect(calculateFees(1000, 'pro').platformFee).toBe(30);
    expect(calculateFees(1000, 'enterprise').platformFee).toBe(20);
  });
});

describe('parcelamento', () => {
  it('mantém o total sem juros até 6 vezes', () => {
    const result = calculateInstallment(600, 6);
    expect(result.interestFree).toBe(true);
    expect(result.total).toBe(600);
    expect(result.perInstallment).toBe(100);
  });

  it('aplica juros acima de 6 vezes', () => {
    const result = calculateInstallment(600, 12);
    expect(result.interestFree).toBe(false);
    expect(result.total).toBeGreaterThan(600);
    expect(result.perInstallment * 12).toBeCloseTo(result.total, 2);
  });
});

describe('artefatos do provedor', () => {
  it('emite recibo no padrão HM-ANO-NNNNNN', () => {
    expect(generateReceiptCode()).toMatch(/^HM-\d{4}-\d{6}$/);
  });

  it('gera linha digitável de boleto com 47 dígitos', () => {
    const line = generateBoletoLine();
    expect(line.replace(/\D/g, '')).toHaveLength(47);
  });

  it('gera código PIX copia-e-cola com o prefixo do Bacen', () => {
    const code = generatePixCode(150, 'HM-2026-000001');
    expect(code.startsWith('00020126')).toBe(true);
    expect(code).toContain('BR.GOV.BCB.PIX');
  });

  it('vence o boleto em 3 dias úteis, nunca no fim de semana', () => {
    // Sexta-feira, 31/07/2026 → vence na quarta, 05/08.
    const due = boletoDueDate(new Date('2026-07-31T12:00:00'));
    expect(due.getDay()).not.toBe(0);
    expect(due.getDay()).not.toBe(6);
    expect(due.getDate()).toBe(5);
    expect(due.getMonth()).toBe(7);
  });

  it('identifica a bandeira pelo prefixo do cartão', () => {
    expect(detectCardBrand('4111 1111 1111 1111')).toBe('Visa');
    expect(detectCardBrand('5555 5555 5555 4444')).toBe('Mastercard');
    expect(detectCardBrand('3782 822463 10005')).toBe('American Express');
  });
});

describe('processamento do pagamento', () => {
  it('aprova PIX e move o pedido para pago', async () => {
    const orderId = seedOrder();
    const { payment, order } = await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'pix',
      amount: 200,
      plan: 'free',
    });

    expect(payment.status).toBe('approved');
    expect(payment.pix_code).toBeTruthy();
    expect(payment.platform_fee).toBe(10);
    expect(payment.net_amount).toBe(190);
    expect(payment.receipt_code).toMatch(/^HM-/);
    expect(payment.authorization_code).toBeTruthy();
    expect(order?.status).toBe('paid');
    expect(order?.receipt_code).toBe(payment.receipt_code);
  });

  it('deixa o boleto pendente e só avança o pedido após a compensação', async () => {
    const orderId = seedOrder('order-test-boleto', 320);
    const { payment, order } = await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'boleto',
      amount: 320,
      plan: 'pro',
    });

    expect(payment.status).toBe('pending');
    expect(payment.boleto_line).toBeTruthy();
    expect(payment.boleto_due_date).toBeTruthy();
    expect(payment.paid_at).toBeUndefined();
    expect(order?.status).toBe('pending_payment');

    const settled = confirmBoletoPayment(payment.id);
    expect(settled?.status).toBe('approved');
    expect(settled?.paid_at).toBeTruthy();
    expect(orderStore.get(orderId)?.status).toBe('paid');
  });

  it('recusa o cartão de teste terminado em 0000 sem alterar o pedido', async () => {
    const orderId = seedOrder('order-test-declined', 90);
    const { payment, order } = await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'credit_card',
      amount: 90,
      plan: 'free',
      installments: 3,
      cardNumber: '4111 1111 1111 0000',
    });

    expect(payment.status).toBe('declined');
    expect(payment.failure_reason).toBeTruthy();
    expect(payment.authorization_code).toBeUndefined();
    expect(order).toBeUndefined();
    expect(orderStore.get(orderId)?.status).toBe('created');
  });

  it('registra os quatro últimos dígitos e a bandeira, sem guardar o número', async () => {
    const orderId = seedOrder('order-test-card', 450);
    const { payment } = await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'credit_card',
      amount: 450,
      plan: 'free',
      installments: 6,
      cardNumber: '5555 5555 5555 4444',
    });

    expect(payment.card_last4).toBe('4444');
    expect(payment.card_brand).toBe('Mastercard');
    expect(payment.installments).toBe(6);
    expect(JSON.stringify(payment)).not.toContain('5555555555554444');
  });

  it('estorna apenas pagamentos aprovados', async () => {
    const orderId = seedOrder('order-test-refund', 120);
    const { payment } = await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'pix',
      amount: 120,
      plan: 'free',
    });

    const refunded = refundPayment(payment.id, 'Material diferente do anunciado');
    expect(refunded?.status).toBe('refunded');
    expect(refunded?.refunded_at).toBeTruthy();
    // Segunda tentativa não faz efeito: o pagamento já não está aprovado.
    expect(refundPayment(payment.id, 'Repetido')).toBeUndefined();
  });

  it('persiste todos os pagamentos no armazenamento consultável', async () => {
    const orderId = seedOrder('order-test-list', 60);
    await processPayment({
      orderId,
      payerEmail: 'comprador@teste.com',
      payeeEmail: 'vendedor@teste.com',
      method: 'pix',
      amount: 60,
      plan: 'free',
    });
    expect(paymentStore.filter(p => p.order_id === orderId)).toHaveLength(1);
  });

  it('oferece exatamente os três métodos diretos, sem carteira', () => {
    expect(PAYMENT_METHODS.map(m => m.value)).toEqual(['pix', 'credit_card', 'boleto']);
  });
});
