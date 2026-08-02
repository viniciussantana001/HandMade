import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Barreira de erro da aplicação (U4).
 *
 * Na versão 4.0, qualquer exceção durante a renderização derrubava a árvore de
 * componentes e deixava a tela branca — o mesmo sintoma dos bugs B1 e B2. Aqui,
 * a falha é capturada e o usuário recebe uma tela de recuperação com caminho de
 * volta, em vez de um aplicativo aparentemente travado.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Em produção, este é o ponto de envio para o monitoramento de erros.
    console.error('Falha inesperada na interface:', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  private goHome = () => {
    this.setState({ error: null });
    window.location.assign('/');
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen max-w-lg mx-auto flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-lg font-bold">Algo deu errado nesta tela</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Tivemos um problema ao montar esta parte do aplicativo. Seus anúncios e pedidos continuam
          salvos.
        </p>

        <div className="w-full max-w-xs space-y-2 mt-6">
          <button
            type="button"
            onClick={this.reset}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm inline-flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            <RefreshCw className="w-4 h-4" /> Tentar novamente
          </button>
          <button
            type="button"
            onClick={this.goHome}
            className="w-full h-12 rounded-xl border border-border font-medium text-sm inline-flex items-center justify-center gap-2 active:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" /> Ir para a tela inicial
          </button>
        </div>

        <details className="mt-6 w-full max-w-xs text-left">
          <summary className="text-xs text-muted-foreground cursor-pointer">
            Detalhes técnicos
          </summary>
          <pre className="mt-2 text-[10px] text-muted-foreground bg-muted rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
      </div>
    );
  }
}
