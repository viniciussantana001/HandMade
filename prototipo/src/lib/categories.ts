import { TreePine, Mountain, Cog, Zap, Recycle, Package, Droplets, Cpu, Hammer, Boxes } from 'lucide-react';

export const CATEGORIES: Record<string, { label: string; icon: any; color: string; emoji: string }> = {
  madeira: { label: 'Madeira', icon: TreePine, color: 'bg-amber-100 text-amber-700', emoji: '🪵' },
  pedras: { label: 'Pedras', icon: Mountain, color: 'bg-stone-100 text-stone-700', emoji: '🪨' },
  metais: { label: 'Metais', icon: Cog, color: 'bg-slate-100 text-slate-700', emoji: '⚙️' },
  eletrico: { label: 'Elétrico', icon: Zap, color: 'bg-yellow-100 text-yellow-700', emoji: '⚡' },
  plastico: { label: 'Plástico', icon: Recycle, color: 'bg-green-100 text-green-700', emoji: '♻️' },
  vidro: { label: 'Vidro', icon: Droplets, color: 'bg-cyan-100 text-cyan-700', emoji: '🫙' },
  eletronico: { label: 'Eletrônico', icon: Cpu, color: 'bg-indigo-100 text-indigo-700', emoji: '💻' },
  construcao: { label: 'Construção', icon: Hammer, color: 'bg-orange-100 text-orange-700', emoji: '🔨' },
  outro: { label: 'Outros', icon: Boxes, color: 'bg-gray-100 text-gray-700', emoji: '📦' },
};

export const CONDITIONS: Record<string, string> = {
  new: 'Novo',
  used_good: 'Usado — bom estado',
  used_repair: 'Usado — precisa reparo',
  for_pickup: 'Para retirada',
};

export const LISTING_TYPES: Record<string, { label: string; emoji: string; color: string }> = {
  sale: { label: 'Venda', emoji: '💰', color: 'bg-info/10 text-info' },
  donation: { label: 'Doação', emoji: '💚', color: 'bg-success/10 text-success' },
  trade: { label: 'Troca', emoji: '🔄', color: 'bg-warning/10 text-warning-strong' },
};

export const UNITS: Record<string, string> = {
  units: 'unidades',
  kg: 'kg',
  tons: 'toneladas',
  m: 'metros',
  m2: 'metros²',
  l: 'litros',
  boxes: 'caixas',
  other: 'outros',
};

export const DELIVERY_OPTIONS: Record<string, string> = {
  pickup: 'Retirada no local pelo comprador',
  delivery_paid: 'Entrego — cobro frete a combinar',
  delivery_free: 'Entrego grátis dentro da cidade',
  mail: 'Envio pelos Correios',
};

export const BOOST_PLANS: Record<string, { label: string; price: number; days: number; description: string }> = {
  basic: { label: '3 dias', price: 9.90, days: 3, description: 'Destaque por 3 dias' },
  standard: { label: '7 dias', price: 19.90, days: 7, description: 'Destaque por 1 semana' },
  premium: { label: '15 dias', price: 34.90, days: 15, description: 'Destaque por 15 dias' },
};

export const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

export const SEGMENTS = [
  'Construção Civil', 'Indústria Metalúrgica', 'Madeireira',
  'Eletrônica e TI', 'Reciclagem', 'Agronegócio', 'Comércio', 'Outro'
];

export const TRANSPORTERS = [
  'Correios', 'Jadlog', 'Total Express', 'Mercado Envios',
  'Moto frete', 'Retirada no local', 'Outra'
];
