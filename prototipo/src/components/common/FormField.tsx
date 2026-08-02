import { useId } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  /** Exibe o ícone de validação positiva quando o campo já está correto. */
  valid?: boolean;
  required?: boolean;
  counter?: { current: number; max: number };
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    className: string;
  }) => React.ReactNode;
}

/**
 * Campo de formulário com rótulo, dica, contador e mensagem de erro inline (U4).
 *
 * Amarra o rótulo, a dica e o erro ao controle por `id`/`aria-describedby`, de
 * modo que leitores de tela anunciem o problema junto com o campo — requisito
 * do critério WCAG 3.3.1 (Identificação de erro).
 */
export default function FormField({
  label,
  error,
  hint,
  valid,
  required,
  counter,
  children,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id} className="text-sm">
          {label}
          {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
        </Label>
        <div className="flex items-center gap-1.5">
          {counter && (
            <span
              className={cn(
                'text-[10px] tabular-nums',
                counter.current > counter.max ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}
            >
              {counter.current}/{counter.max}
            </span>
          )}
          {valid && !error && <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />}
        </div>
      </div>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: cn(
          'h-12',
          error && 'border-destructive focus-visible:ring-destructive',
          valid && !error && 'border-success/60'
        ),
      })}

      {hint && !error && (
        <p id={hintId} className="text-[11px] text-muted-foreground mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive mt-1 flex items-center gap-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
