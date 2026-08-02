import { useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2, Star, Trash2, AlertCircle, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MAX_PHOTOS,
  MAX_PHOTO_SIZE_MB,
  PHOTO_ACCEPT_ATTR,
  processSelectedPhotos,
  type PhotoValidationError,
} from '@/lib/images';
import { toast } from 'sonner';

interface PhotoPickerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  /** Mensagem de erro do formulário (ex.: "Adicione pelo menos uma foto"). */
  error?: string;
}

/**
 * Seleção de fotos direto do dispositivo (U3).
 *
 * Usa dois inputs de arquivo: um abre a galeria e outro força a câmera pelo
 * atributo `capture`, que é o comportamento esperado em um app mobile. As
 * imagens são validadas (formato, peso, dimensão mínima), reamostradas e
 * exibidas em pré-visualização antes de entrar no anúncio.
 */
export default function PhotoPicker({ photos, onChange, max = MAX_PHOTOS, error }: PhotoPickerProps) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [rejections, setRejections] = useState<PhotoValidationError[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    setRejections([]);
    const { photos: accepted, errors } = await processSelectedPhotos(files, photos.length, max);
    if (accepted.length > 0) {
      onChange([...photos, ...accepted.map(p => p.dataUrl)]);
      toast.success(
        accepted.length === 1 ? 'Foto adicionada' : `${accepted.length} fotos adicionadas`
      );
    }
    if (errors.length > 0) setRejections(errors);
    setLoading(false);
    // Permite reescolher o mesmo arquivo em seguida.
    if (galleryRef.current) galleryRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const removed = photos[index];
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
    toast.success('Foto removida', {
      action: {
        label: 'Desfazer',
        onClick: () => {
          const restored = [...next];
          restored.splice(index, 0, removed);
          onChange(restored);
        },
      },
    });
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [chosen] = next.splice(index, 1);
    next.unshift(chosen);
    onChange(next);
    toast.success('Foto de capa atualizada');
  };

  const remaining = max - photos.length;

  return (
    <div>
      <input
        ref={galleryRef}
        type="file"
        accept={PHOTO_ACCEPT_ATTR}
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={cameraRef}
        type="file"
        accept={PHOTO_ACCEPT_ATTR}
        capture="environment"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((photo, i) => (
            <div
              key={`${photo.slice(-24)}-${i}`}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted border group animate-fade-in"
            >
              <img src={photo} alt={`Foto ${i + 1} do material`} className="w-full h-full object-cover" />
              {i === 0 && (
                <Badge className="absolute top-1 left-1 bg-primary text-primary-foreground border-0 text-[9px] px-1.5 py-0 gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" /> Capa
                </Badge>
              )}
              <div className="absolute bottom-1 right-1 flex gap-1">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    aria-label={`Definir foto ${i + 1} como capa`}
                    className="w-7 h-7 rounded-lg bg-card/90 backdrop-blur flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                  >
                    <Star className="w-3.5 h-3.5 text-warning-strong" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remover foto ${i + 1}`}
                  className="w-7 h-7 rounded-lg bg-card/90 backdrop-blur flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}

          {remaining > 0 && !loading && (
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground active:bg-muted transition-colors"
              aria-label="Adicionar mais fotos da galeria"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-[10px] font-medium">Adicionar</span>
            </button>
          )}
          {loading && (
            <div className="aspect-square rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-1">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-[10px] font-medium text-primary">Processando</span>
            </div>
          )}
        </div>
      )}

      {photos.length === 0 && (
        <div
          className={`rounded-2xl border-2 border-dashed p-6 text-center mb-3 ${
            error ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-muted/30'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary mx-auto mb-2 animate-spin" />
              <p className="text-sm font-medium">Processando suas fotos…</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-semibold">Adicione fotos do material</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[15rem] mx-auto">
                Escolha da galeria do celular ou tire uma foto agora. Anúncios com foto recebem
                bem mais contatos.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-11 gap-2"
          onClick={() => galleryRef.current?.click()}
          disabled={loading || remaining === 0}
        >
          <ImagePlus className="w-4 h-4" /> Galeria
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-11 gap-2"
          onClick={() => cameraRef.current?.click()}
          disabled={loading || remaining === 0}
        >
          <Camera className="w-4 h-4" /> Câmera
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground mt-2">
        {photos.length}/{max} fotos · JPG, PNG ou WEBP · até {MAX_PHOTO_SIZE_MB} MB cada
        {photos.length > 1 && ' · a primeira foto é a capa do anúncio'}
      </p>

      {error && (
        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}

      {rejections.length > 0 && (
        <div className="mt-2 rounded-xl bg-destructive/5 border border-destructive/20 p-2.5 space-y-1" role="alert">
          {rejections.map((rejection, i) => (
            <p key={i} className="text-[11px] text-destructive flex items-start gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>
                <strong className="font-medium">{rejection.fileName}</strong>: {rejection.reason}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
