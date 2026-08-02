// ---------------------------------------------------------------------------
// HandMade 5.0 — hooks de sessão e navegação protegida
//
// Concentra a correção do bug B1: encerrar a sessão precisa desmontar as telas
// autenticadas e navegar para /login de forma atômica, sem passar por um
// render intermediário sem usuário (que produzia a tela branca na v4.0).
// ---------------------------------------------------------------------------
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { notifyStoreChange } from './store';

/**
 * Encerra a sessão e leva o usuário à tela de login com o estado limpo.
 *
 * A ordem importa: navegamos com `replace: true` ANTES de limpar o usuário, de
 * modo que a rota protegida já tenha sido substituída quando o contexto zerar.
 * Assim nenhuma tela autenticada chega a renderizar sem usuário — que era
 * exatamente o caminho da tela branca da versão 4.0.
 */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(() => {
    navigate('/login', { replace: true, state: { signedOut: true } });
    logout();
    notifyStoreChange();
  }, [logout, navigate]);
}

/**
 * Garante que uma tela só seja exibida com sessão ativa.
 *
 * Enquanto a sessão é restaurada do localStorage devolve `loading`, para que a
 * tela mostre um esqueleto em vez de `return null` — outro caminho de tela
 * branca da v4.0. Sem usuário, redireciona para /login preservando o destino.
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', {
        replace: true,
        state: { from: window.location.pathname + window.location.search },
      });
    }
  }, [isLoading, user, navigate]);

  return { user, loading: isLoading, ready: Boolean(user) && !isLoading };
}
