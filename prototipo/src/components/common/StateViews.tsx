import { AlertTriangle, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Estados compartilhados de carregamento, vazio e erro (U4).
 *
 * Toda tela do aplicativo usa estes componentes, de modo que a espera, a lista
 * vazia e a falha tenham sempre a mesma aparência e o mesmo tom de voz.
 */

export function LoadingScreen({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Esqueleto da grade de anúncios — reproduz a silhueta real dos cartões. */
export function ListingGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-2.5 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Esqueleto de lista em linha — pedidos, conversas, anúncios do vendedor. */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Esqueleto do painel — cartões de métrica e blocos de conteúdo. */
export function DashboardSkeleton() {
  return (
    <div className="px-4 py-4 space-y-4" aria-hidden="true">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  offline?: boolean;
}

export function ErrorState({
  title = 'Algo não saiu como esperado',
  description = 'Não conseguimos carregar esta parte agora. Tente novamente em instantes.',
  onRetry,
  offline,
}: ErrorStateProps) {
  const Icon = offline ? WifiOff : AlertTriangle;
  return (
    <div className="text-center py-16 px-6" role="alert">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="font-bold text-base">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{description}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4 gap-2" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" /> Tentar novamente
        </Button>
      )}
    </div>
  );
}

/** Aviso inline para blocos que falharam sem comprometer a tela inteira. */
export function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="p-3 bg-destructive/5 border-destructive/20" role="alert">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-destructive">{message}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="text-xs font-medium text-primary mt-1">
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
