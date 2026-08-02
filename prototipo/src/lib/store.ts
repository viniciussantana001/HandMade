// HandMade 5.0 — camada de persistência local (simulação do Firestore)
// Todas as coleções vivem no localStorage e são observáveis via useSyncExternalStore.
// Qualquer escrita notifica os assinantes — sem window.location.reload().
import { useSyncExternalStore } from 'react';

export const STORAGE_PREFIX = 'hm_v5_';

// --- Observabilidade -------------------------------------------------------
const listeners = new Set<() => void>();
let _version = 0;
function emitChange() {
  _version += 1;
  listeners.forEach(fn => { try { fn(); } catch { /* isolado */ } });
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
const getVersion = () => _version;
export function useStoreVersion() {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
export function notifyStoreChange() { emitChange(); }

const generateId = () => Math.random().toString(36).substring(2, 10);

function getCollection<T>(name: string): T[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${name}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function setCollection<T>(name: string, data: T[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(data));
  } catch { /* quota excedida: preserva a sessão em vez de quebrar a interface */ }
  emitChange();
}

export function createStore<T extends { id: string }>(name: string) {
  return {
    list: (): T[] => getCollection<T>(name).sort((a: any, b: any) =>
      new Date(b.created_date || b.created_at || 0).getTime() - new Date(a.created_date || a.created_at || 0).getTime()
    ),
    filter: (predicate: (item: T) => boolean): T[] =>
      getCollection<T>(name).filter(predicate).sort((a: any, b: any) =>
        new Date(b.created_date || b.created_at || 0).getTime() - new Date(a.created_date || a.created_at || 0).getTime()
      ),
    get: (id: string): T | undefined => getCollection<T>(name).find(item => item.id === id),
    create: (data: Omit<T, 'id'>): T => {
      const items = getCollection<T>(name);
      const item = { ...data, id: (data as any).id || generateId() } as T;
      items.push(item);
      setCollection(name, items);
      return item;
    },
    update: (id: string, data: Partial<T>): T | undefined => {
      const items = getCollection<T>(name);
      const idx = items.findIndex(item => item.id === id);
      if (idx === -1) return undefined;
      items[idx] = { ...items[idx], ...data };
      setCollection(name, items);
      return items[idx];
    },
    /** Substitui o item inteiro — usado pelo "desfazer" para restaurar o estado exato. */
    upsert: (item: T): T => {
      const items = getCollection<T>(name);
      const idx = items.findIndex(existing => existing.id === item.id);
      if (idx === -1) items.push(item);
      else items[idx] = item;
      setCollection(name, items);
      return item;
    },
    delete: (id: string): boolean => {
      const items = getCollection<T>(name);
      const filtered = items.filter(item => item.id !== id);
      if (filtered.length === items.length) return false;
      setCollection(name, filtered);
      return true;
    },
  };
}

// Entity stores
import type { Listing, Order, Payment, BoostPurchase, Message, Notification, Review, Favorite, Dispute, Report, User, AuditLog, ConsentRecord } from './types';

export const listingStore = createStore<Listing>('listings');
export const orderStore = createStore<Order>('orders');
export const paymentStore = createStore<Payment>('payments');
export const boostStore = createStore<BoostPurchase>('boosts');
export const messageStore = createStore<Message>('messages');
export const notificationStore = createStore<Notification>('notifications');
export const reviewStore = createStore<Review>('reviews');
export const favoriteStore = createStore<Favorite>('favorites');
export const disputeStore = createStore<Dispute>('disputes');
export const reportStore = createStore<Report>('reports');
export const userStore = createStore<User>('users');
export const auditStore = createStore<AuditLog>('audit_logs');
export const consentStore = createStore<ConsentRecord>('consents');

/** Limpa todo o estado local (exclusão de conta / redefinição do protótipo). */
export function resetAllData() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach(key => localStorage.removeItem(key));
  emitChange();
}
