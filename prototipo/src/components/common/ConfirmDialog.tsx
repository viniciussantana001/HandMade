import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

/**
 * Diálogo de confirmação para ações relevantes ou destrutivas (U4).
 *
 * Substitui o `window.confirm()` da versão 4.0, que quebrava a estética do
 * aplicativo e não era acessível. Mantém o botão em estado de carregamento
 * enquanto a ação assíncrona termina, evitando o duplo toque.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
}: ConfirmDialogProps) {
  const [working, setWorking] = useState(false);

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    setWorking(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setWorking(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm mx-4 rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={working}
            className={`w-full h-11 ${
              destructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''
            }`}
          >
            {working ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel disabled={working} className="w-full h-11 mt-0">
            {cancelLabel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
