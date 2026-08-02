import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restaura o topo da rolagem a cada troca de rota (U4).
 *
 * Em um SPA a posição de rolagem é preservada por padrão, o que faz uma tela
 * nova abrir no meio — comportamento estranho em um aplicativo mobile.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
