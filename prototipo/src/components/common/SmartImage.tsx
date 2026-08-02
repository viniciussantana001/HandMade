import { useState } from 'react';
import { imageUrl, imageSrcSet, type ImageSlot } from '@/lib/images';
import { cn } from '@/lib/utils';

interface SmartImageProps {
  src?: string;
  alt: string;
  slot?: ImageSlot;
  className?: string;
  /** Classes aplicadas à própria imagem — usado para efeitos de hover/zoom. */
  imgClassName?: string;
  /** Carrega imediatamente, para fotos visíveis na primeira dobra. */
  eager?: boolean;
  /** Ícone ou elemento exibido quando não há foto ou o carregamento falha. */
  fallback?: React.ReactNode;
}

/**
 * Imagem com resolução adequada ao slot, esqueleto de carregamento e
 * tratamento de falha (U2 e U4).
 *
 * Evita o "salto" de layout: o contêiner reserva o espaço, o esqueleto pulsa
 * enquanto a foto chega e um estado de falha assume o lugar se a imagem não
 * carregar — em vez do ícone de imagem quebrada do navegador.
 */
export default function SmartImage({
  src,
  alt,
  slot = 'card',
  className,
  imgClassName,
  eager,
  fallback,
}: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  if (!src || state === 'error') {
    return (
      <div
        className={cn('w-full h-full flex items-center justify-center bg-muted', className)}
        role="img"
        aria-label={alt}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-muted', className)}>
      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />}
      <img
        src={imageUrl(src, slot)}
        srcSet={imageSrcSet(src, slot)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          state === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName
        )}
      />
    </div>
  );
}
