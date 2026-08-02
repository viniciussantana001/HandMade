// ---------------------------------------------------------------------------
// C2 — testes do armazenamento observável (correção de B1 e B2)
//
// A tela branca da versão 4.0 nascia do padrão "escreve e recarrega":
// `window.location.reload()` era a única forma de a interface enxergar uma
// mudança. Estes testes fixam o contrato que substituiu aquele padrão — toda
// escrita notifica quem estiver assinando, pelo mesmo canal que as telas usam
// (`useStoreVersion`), sem recarregar a página.
// ---------------------------------------------------------------------------
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  listingStore,
  paymentStore,
  boostStore,
  consentStore,
  notificationStore,
  notifyStoreChange,
  resetAllData,
  useStoreVersion,
  STORAGE_PREFIX,
} from '@/lib/store';

beforeEach(() => {
  resetAllData();
});

describe('prefixo de armazenamento', () => {
  it('usa o namespace da versão 5.0, isolando os dados da 4.0', () => {
    expect(STORAGE_PREFIX).toBe('hm_v5_');
  });

  it('grava cada coleção sob o prefixo da versão', () => {
    listingStore.create({ id: 'l1', title: 'Teste', created_date: new Date().toISOString() } as any);
    expect(localStorage.getItem('hm_v5_listings')).toBeTruthy();
    expect(localStorage.getItem('hm_v3_listings')).toBeNull();
  });
});

describe('operações da coleção', () => {
  it('cria, lê, atualiza e remove', () => {
    listingStore.create({ id: 'l1', title: 'Tábuas', created_date: new Date().toISOString() } as any);
    expect(listingStore.get('l1')?.title).toBe('Tábuas');

    listingStore.update('l1', { title: 'Tábuas de pinus' } as any);
    expect(listingStore.get('l1')?.title).toBe('Tábuas de pinus');

    expect(listingStore.delete('l1')).toBe(true);
    expect(listingStore.get('l1')).toBeUndefined();
    // Remover o que não existe devolve false em vez de lançar erro.
    expect(listingStore.delete('l1')).toBe(false);
  });

  it('gera id automático quando não é informado', () => {
    const created = listingStore.create({ title: 'Sem id', created_date: new Date().toISOString() } as any);
    expect(created.id).toBeTruthy();
    expect(listingStore.get(created.id)).toBeTruthy();
  });

  it('restaura o item completo com upsert — base do "desfazer"', () => {
    const original = listingStore.create({
      id: 'l2', title: 'Cabos', status: 'active', views: 42, created_date: new Date().toISOString(),
    } as any);

    listingStore.delete('l2');
    expect(listingStore.get('l2')).toBeUndefined();

    listingStore.upsert(original);
    const restored = listingStore.get('l2');
    expect(restored?.views).toBe(42);
    expect(restored?.status).toBe('active');
  });

  it('devolve undefined ao atualizar item inexistente, sem lançar erro', () => {
    expect(listingStore.update('nao-existe', { title: 'x' } as any)).toBeUndefined();
  });

  it('ordena as listas do mais recente para o mais antigo', () => {
    const older = new Date(Date.now() - 86400000).toISOString();
    const newer = new Date().toISOString();
    notificationStore.create({ id: 'n1', title: 'Antiga', created_at: older } as any);
    notificationStore.create({ id: 'n2', title: 'Nova', created_at: newer } as any);
    expect(notificationStore.list().map(n => n.id)).toEqual(['n2', 'n1']);
  });

  it('sobrevive a um valor corrompido no localStorage', () => {
    localStorage.setItem(`${STORAGE_PREFIX}listings`, '{"nao":"é um array"}');
    expect(listingStore.list()).toEqual([]);
    localStorage.setItem(`${STORAGE_PREFIX}listings`, 'json quebrado {');
    expect(listingStore.list()).toEqual([]);
  });
});

describe('observabilidade (B1 e B2)', () => {
  it('faz a tela assinante recalcular a cada escrita, sem recarregar a página', () => {
    const { result } = renderHook(() => useStoreVersion());
    const initial = result.current;

    act(() => {
      listingStore.create({ id: 'l3', title: 'A', created_date: new Date().toISOString() } as any);
    });
    const afterCreate = result.current;
    expect(afterCreate).toBeGreaterThan(initial);

    act(() => { listingStore.update('l3', { title: 'B' } as any); });
    expect(result.current).toBeGreaterThan(afterCreate);

    const beforeDelete = result.current;
    act(() => { listingStore.delete('l3'); });
    expect(result.current).toBeGreaterThan(beforeDelete);
  });

  it('propaga notificação explícita — usada pelo logout (B1)', () => {
    const { result } = renderHook(() => useStoreVersion());
    const before = result.current;
    act(() => { notifyStoreChange(); });
    expect(result.current).toBeGreaterThan(before);
  });

  it('notifica todas as telas montadas ao mesmo tempo', () => {
    const primeira = renderHook(() => useStoreVersion());
    const segunda = renderHook(() => useStoreVersion());

    act(() => {
      paymentStore.create({ id: 'p1', order_id: 'o1', created_at: new Date().toISOString() } as any);
    });

    expect(primeira.result.current).toBe(segunda.result.current);
    expect(primeira.result.current).toBeGreaterThan(0);
  });

  it('para de notificar telas desmontadas, sem vazar assinatura', () => {
    const { result, unmount } = renderHook(() => useStoreVersion());
    const atUnmount = result.current;
    unmount();

    act(() => {
      listingStore.create({ id: 'l4', title: 'C', created_date: new Date().toISOString() } as any);
    });
    // O valor congelou no desmonte: nenhuma atualização foi entregue depois.
    expect(result.current).toBe(atUnmount);
  });
});

describe('redefinição total (exclusão de conta — LGPD art. 18, VI)', () => {
  it('apaga todas as coleções do namespace 5.0 e preserva o resto', () => {
    listingStore.create({ id: 'l5', title: 'X', created_date: new Date().toISOString() } as any);
    paymentStore.create({ id: 'p2', order_id: 'o2', created_at: new Date().toISOString() } as any);
    boostStore.create({ id: 'b1', listing_id: 'l5', created_at: new Date().toISOString() } as any);
    consentStore.create({ id: 'c1', document: 'terms', created_at: new Date().toISOString() } as any);
    localStorage.setItem('outro_app_dado', 'preservar');

    resetAllData();

    expect(listingStore.list()).toEqual([]);
    expect(paymentStore.list()).toEqual([]);
    expect(boostStore.list()).toEqual([]);
    expect(consentStore.list()).toEqual([]);
    expect(localStorage.getItem('outro_app_dado')).toBe('preservar');
    localStorage.removeItem('outro_app_dado');
  });

  it('avisa as telas assinantes de que os dados foram apagados', () => {
    const { result } = renderHook(() => useStoreVersion());
    const before = result.current;
    act(() => { resetAllData(); });
    expect(result.current).toBeGreaterThan(before);
  });
});
