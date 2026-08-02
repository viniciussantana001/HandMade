export interface User {
  id: string;
  email: string;
  full_name: string;
  account_type: 'individual' | 'company';
  company_name?: string;
  trade_name?: string;
  segment?: string;
  cpf_last4?: string;
  cnpj_last4?: string;
  phone?: string;
  city?: string;
  state?: string;
  verified: boolean;
  email_verified: boolean;
  verification_status?: string;
  role: 'user' | 'admin';
  subscription_plan: 'free' | 'pro' | 'enterprise';
  subscription_expires_at?: string;
  deletion_requested?: boolean;
  deletion_requested_at?: string;
  status: 'active' | 'suspended' | 'deleted';
  onboarding_completed_screens: string[];
  /** Métodos de pagamento salvos para o checkout de pagamento direto. */
  saved_payment_methods?: SavedPaymentMethod[];
  /** Consentimentos aceitos, por documento e versão (LGPD art. 8º). */
  accepted_terms_version?: string;
  accepted_privacy_version?: string;
  marketing_opt_in?: boolean;
  /** Regime tributário declarado pelo vendedor (conteúdo orientativo). */
  tax_regime?: 'none' | 'pf' | 'mei' | 'simples' | 'other';
  avatar_url?: string;
  auth_provider?: 'password' | 'google';
  firebase_uid?: string;
  last_login_at?: string;
  session_expires_at?: string;
  created_at: string;
}

/** Método de pagamento salvo no dispositivo (dados mascarados, sem backend). */
export interface SavedPaymentMethod {
  id: string;
  method: PaymentMethod;
  label: string;
  card_last4?: string;
  card_brand?: string;
  card_holder?: string;
  card_expiry?: string;
  pix_key_type?: string;
  pix_key?: string;
  is_default: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_email: string;
  action: string;
  entity?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  quantity?: string;
  unit?: string;
  location: string;
  images: string[];
  listing_type: 'sale' | 'donation' | 'trade';
  delivery_options: string[];
  seller_name: string;
  seller_email: string;
  created_by: string;
  status: 'active' | 'paused' | 'sold' | 'removed' | 'draft';
  views: number;
  contacts: number;
  is_boosted: boolean;
  boost_until?: string;
  is_flagged: boolean;
  report_count: number;
  renewed_at?: string;
  created_date: string;
}

export interface Order {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  listing_snapshot?: any;
  seller_email: string;
  seller_name: string;
  buyer_email: string;
  buyer_name: string;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  fee_percent_applied: number;
  payment_method: PaymentMethod;
  /** Pagamento direto vinculado (5.0 — substitui o fluxo de carteira). */
  payment_id?: string;
  payment_status?: PaymentStatus;
  receipt_code?: string;
  status: 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'disputed' | 'refunded' | 'cancelled';
  tracking_code?: string;
  tracking_carrier?: string;
  tracking_url?: string;
  notes?: string;
  dispute_id?: string;
  status_history: { status: string; date: string }[];
  created_date: string;
}

/**
 * Pagamento direto (HandMade 5.0).
 * Substitui a antiga Carteira: cada pedido é quitado diretamente pelo método
 * escolhido (PIX, cartão ou boleto) e gera um recibo próprio.
 */
export interface Payment {
  id: string;
  order_id: string;
  payer_email: string;
  payee_email: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  platform_fee: number;
  net_amount: number;
  fee_percent_applied: number;
  installments?: number;
  card_last4?: string;
  card_brand?: string;
  pix_code?: string;
  boleto_line?: string;
  boleto_due_date?: string;
  receipt_code: string;
  authorization_code?: string;
  paid_at?: string;
  refunded_at?: string;
  failure_reason?: string;
  created_at: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'declined'
  | 'refunded'
  | 'cancelled';

/**
 * Compra de impulsionamento. Também é quitada por pagamento direto —
 * não há mais consumo de saldo.
 */
export interface BoostPurchase {
  id: string;
  listing_id: string;
  listing_title: string;
  user_email: string;
  plan_key: string;
  days: number;
  amount: number;
  payment_id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

/** Registro de consentimento (LGPD art. 8º) — versionado e rastreável. */
export interface ConsentRecord {
  id: string;
  user_email: string;
  document: 'terms' | 'privacy' | 'marketing' | 'cookies';
  document_version: string;
  granted: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  listing_price: number;
  sender_email: string;
  sender_name: string;
  recipient_email: string;
  recipient_name: string;
  content: string;
  offer_price?: number;
  offer_status?: 'pending' | 'accepted' | 'rejected';
  read: boolean;
  created_date: string;
}

export interface Notification {
  id: string;
  recipient_email: string;
  type: string;
  title: string;
  message: string;
  action_url: string;
  read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_email: string;
  reviewed_email: string;
  rating: number;
  comment: string;
  type: 'buyer_review' | 'seller_review';
  created_at: string;
}

export interface Favorite {
  id: string;
  user_email: string;
  listing_id: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  buyer_email: string;
  seller_email: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: 'open' | 'analyzing' | 'resolved_buyer' | 'resolved_seller' | 'cancelled';
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Report {
  id: string;
  listing_id: string;
  reporter_email: string;
  reason: string;
  description: string;
  evidence_url?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  created_at: string;
}
