import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, X, ImagePlus, ArrowRight, ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { listingStore } from '@/lib/store';
import { CATEGORIES, CONDITIONS, UNITS, DELIVERY_OPTIONS } from '@/lib/categories';
import { formatCurrency } from '@/lib/formatters';
import { PLATFORM_FEE_PERCENT } from '@/lib/plans';
import AppHeader from '@/components/layout/AppHeader';
import PhotoPicker from '@/components/common/PhotoPicker';
import SmartImage from '@/components/common/SmartImage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';
import type { Listing } from '@/lib/types';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<any>({
    images: [], title: '', description: '', category: '', condition: '',
    listing_type: 'sale', price: '', priceMode: 'fixed', quantity: '', unit: 'units',
    location: '', delivery_options: ['pickup'], status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const listing = listingStore.get(id || '');

  useEffect(() => {
    if (listing && !loaded) {
      const priceMode = listing.price === 0 && listing.listing_type === 'sale' ? 'negotiable' : 'fixed';
      setForm({
        images: listing.images || [],
        title: listing.title || '',
        description: listing.description || '',
        category: listing.category || '',
        condition: listing.condition || '',
        listing_type: listing.listing_type || 'sale',
        price: listing.price ? String(listing.price) : '',
        priceMode,
        quantity: listing.quantity || '',
        unit: listing.unit || 'units',
        location: listing.location || '',
        delivery_options: listing.delivery_options || ['pickup'],
        status: listing.status || 'active',
      });
      setLoaded(true);
    }
  }, [listing, loaded]);

  if (!user) {
    return (
      <div>
        <AppHeader showBack title="Editar Anúncio" />
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">Você precisa estar logado.</p>
          <Button asChild><Link to="/login" className="block mt-4">Entrar</Link></Button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-lg font-bold mb-2">Anúncio não encontrado</p>
        <p className="text-sm text-muted-foreground mb-4">Este anúncio pode ter sido removido.</p>
        <Button asChild><Link to="/meus-anuncios">Voltar aos meus anúncios</Link></Button>
      </div>
    );
  }

  if (listing.created_by !== user.email) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-lg font-bold mb-2">Acesso negado</p>
        <p className="text-sm text-muted-foreground mb-4">Você só pode editar seus próprios anúncios.</p>
        <Button asChild><Link to="/meus-anuncios">Voltar aos meus anúncios</Link></Button>
      </div>
    );
  }

  const u = (f: string, v: any) => {
    setForm((p: any) => ({ ...p, [f]: v }));
    setErrors(prev => {
      if (!prev[f]) return prev;
      const next = { ...prev };
      delete next[f];
      return next;
    });
  };

  const setStepErrors = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revise os campos destacados para continuar.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Informe o nome do material.';
    else if (form.title.trim().length < 10) nextErrors.title = 'Use pelo menos 10 caracteres no nome do material.';
    if (!form.category) nextErrors.category = 'Escolha uma categoria para o material.';
    if (!form.condition) nextErrors.condition = 'Informe o estado de conservação.';
    if (!form.description.trim()) nextErrors.description = 'Descreva o material antes de avançar.';
    else if (form.description.trim().length < 30) nextErrors.description = 'A descrição precisa ter pelo menos 30 caracteres.';
    if (!form.quantity.trim()) nextErrors.quantity = 'Informe a quantidade disponível.';
    return setStepErrors(nextErrors);
  };

  const validateStep3 = () => {
    const nextErrors: Record<string, string> = {};
    if (form.listing_type === 'sale' && form.priceMode === 'fixed' && (!form.price || parseFloat(form.price) < 0.01)) {
      nextErrors.price = 'Informe um preço válido a partir de R$ 0,01.';
    }
    if (!form.location.trim()) nextErrors.location = 'Informe a cidade onde o material está disponível.';
    if (!form.delivery_options.length) nextErrors.delivery_options = 'Selecione pelo menos uma forma de retirada ou entrega.';
    return setStepErrors(nextErrors);
  };

  const handleImageAdd = () => {};

  const handleSave = async () => {
    if (form.images.length === 0) {
      setStep(1);
      setStepErrors({ images: 'O anúncio precisa de pelo menos 1 foto.' });
      return;
    }
    if (!validateStep2()) { setStep(2); return; }
    if (!validateStep3()) return;

    const price = form.listing_type === 'donation' ? 0 : form.priceMode === 'negotiable' ? 0 : parseFloat(form.price) || 0;

    setSaving(true);
    await new Promise(resolve => window.setTimeout(resolve, 800));

    listingStore.update(listing.id, {
      title: form.title,
      description: form.description.replace(/<[^>]*>/g, ''),
      category: form.category,
      condition: form.condition,
      price,
      quantity: form.quantity,
      unit: form.unit,
      location: form.location,
      images: form.images,
      listing_type: form.listing_type,
      delivery_options: form.delivery_options,
    } as Partial<Listing>);

    setSaving(false);
    toast.success('Anúncio atualizado', {
      description: 'As alterações já estão visíveis no marketplace.',
    });
    navigate(`/anuncio/${listing.id}`, { replace: true });
  };

  const handleDelete = () => {
    const snapshot = { ...listing };
    listingStore.delete(listing.id);
    toast.success('Anúncio excluído', {
      action: {
        label: 'Desfazer',
        onClick: () => {
          listingStore.upsert(snapshot);
          toast.success('Anúncio restaurado');
        },
      },
    });
    navigate('/meus-anuncios', { replace: true });
  };

  const feePercent = PLATFORM_FEE_PERCENT[user?.subscription_plan || 'free'];

  return (
    <div>
      <AppHeader showBack title="Editar Anúncio" />
      <div className="px-4 py-4">
        {/* Status badge */}
        <Card className="p-3 mb-4 bg-info/5 border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Status atual</p>
              <p className="text-sm font-semibold capitalize">
                {form.status === 'active' ? '✅ Ativo' :
                 form.status === 'paused' ? '⏸️ Pausado' :
                 form.status === 'sold' ? '💰 Vendido' :
                 form.status === 'draft' ? '📝 Rascunho' : form.status}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">ID: {listing.id.substring(0, 8)}...</span>
          </div>
        </Card>

        {/* Progress */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 mb-4 text-[11px]">
          {['Fotos', 'Material', 'Preço e local'].map((label, index) => {
            const current = index + 1;
            const active = current === step;
            const done = current < step;
            return (
              <div key={label} className={`flex items-center gap-1 ${active ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                {done ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <span className={`w-3.5 h-3.5 rounded-full border ${active ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`} />}
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Etapa {step} de 3</p>
        {Object.keys(errors).length > 0 && (
          <Card className="p-3 mb-4 border-destructive/40 bg-destructive/5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-destructive">Corrija antes de continuar</p>
                {Object.values(errors).map((message, index) => (
                  <p key={index} className="text-xs text-destructive/90 leading-relaxed">{message}</p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Etapa 1 — Fotos do dispositivo (U3) */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Fotos do anúncio</h2>
            <p className="text-sm text-muted-foreground">
              Adicione novas fotos da galeria ou da câmera, remova as que não quiser e escolha a capa.
            </p>

            <PhotoPicker
              photos={form.images}
              onChange={photos => {
                u('images', photos);
                if (photos.length > 0 && errors.images) setErrors({});
              }}
              error={errors.images}
            />

            {form.images.length > 0 && (
              <Card className="p-3 bg-info/5 border-info/20">
                <p className="text-xs">
                  💡 A primeira foto é a capa do anúncio — use a que mostra melhor o material.
                </p>
              </Card>
            )}

            <Button className="w-full h-12" onClick={() => {
              if (form.images.length === 0) {
                setStepErrors({ images: 'O anúncio precisa de pelo menos 1 foto.' });
                return;
              }
              setErrors({});
              setStep(2);
            }}>Continuar <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {/* Step 2 - Material Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">O material</h2>
            <div>
              <Label className="text-sm font-medium">Nome do material</Label>
              <Input placeholder="Ex: Tábuas de pinus 2 metros..." value={form.title}
                onChange={e => u('title', e.target.value)} className="mt-1 h-12" maxLength={120} />
              <div className="flex justify-between gap-2 mt-1">
                <p className="text-xs text-destructive">{errors.title}</p>
                <p className="text-xs text-muted-foreground ml-auto">{form.title.length}/120</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Categoria</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const CategoryIcon = cat.icon;
                  return (
                    <button key={key} type="button" onClick={() => u('category', key)}
                      aria-pressed={form.category === key}
                      className={`p-3 rounded-xl border-2 text-center transition-colors active:scale-[0.98] ${form.category === key ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <CategoryIcon className="w-5 h-5 mx-auto text-primary" />
                      <p className="text-xs font-medium mt-1">{cat.label}</p>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="text-xs text-destructive mt-2">{errors.category}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium">Estado do material</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(CONDITIONS).map(([key, label]) => (
                  <button key={key} type="button" onClick={() => u('condition', key)}
                    aria-pressed={form.condition === key}
                    className={`p-3 rounded-xl border-2 text-xs font-medium text-left transition-colors active:scale-[0.98] ${form.condition === key ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="text-xs text-destructive mt-2">{errors.condition}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium">Tipo de negociação</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { key: 'sale', label: 'Vender', emoji: '💰' },
                  { key: 'donation', label: 'Doar', emoji: '💚' },
                  { key: 'trade', label: 'Trocar', emoji: '🔄' },
                ].map(t => (
                  <button key={t.key} type="button" onClick={() => u('listing_type', t.key)}
                    aria-pressed={form.listing_type === t.key}
                    className={`p-3 rounded-xl border-2 text-center transition-colors active:scale-[0.98] ${form.listing_type === t.key ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <span className="text-lg" aria-hidden="true">{t.emoji}</span>
                    <p className="text-xs font-medium mt-1">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Descrição</Label>
              <Textarea placeholder="Ex: 50 tábuas de pinus, 2m x 10cm x 2cm..." value={form.description}
                onChange={e => u('description', e.target.value)} className="mt-1 h-28" maxLength={2000} />
              <div className="flex justify-between gap-2 mt-1">
                <p className="text-xs text-destructive">{errors.description}</p>
                <p className="text-xs text-muted-foreground ml-auto">{form.description.length}/2000</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm font-medium">Quantidade</Label>
                <Input placeholder="Ex: 50" value={form.quantity} onChange={e => u('quantity', e.target.value)} className="mt-1 h-12" />
                {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
              </div>
              <div className="w-32">
                <Label className="text-sm font-medium">Unidade</Label>
                <Select value={form.unit} onValueChange={v => u('unit', v)}>
                  <SelectTrigger className="mt-1 h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNITS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <Button className="flex-1 h-12" onClick={() => {
                if (!validateStep2()) return;
                setStep(3);
              }}>Continuar <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 3 - Price & Location */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Preço e local</h2>
            {form.listing_type !== 'donation' && (
              <div>
                <Label className="text-sm font-medium">Preço</Label>
                <div className="flex gap-2 mt-2 mb-3">
                  {[
                    { key: 'fixed', label: 'Tenho um preço' },
                    { key: 'negotiable', label: 'Aceito propostas' },
                  ].map(m => (
                    <button key={m.key} type="button" onClick={() => u('priceMode', m.key)}
                      aria-pressed={form.priceMode === m.key}
                      className={`flex-1 p-2.5 rounded-xl border-2 text-xs font-medium text-center transition-colors active:scale-[0.98] ${form.priceMode === m.key ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
                {form.priceMode === 'fixed' && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R$</span>
                    <Input type="number" step="0.01" min="0.01" placeholder="0,00" value={form.price}
                      onChange={e => u('price', e.target.value)} className="pl-10 h-12" />
                  </div>
                )}
                {errors.price && <p className="text-xs text-destructive mt-2">{errors.price}</p>}
                {form.priceMode === 'negotiable' && (
                  <p className="text-xs text-muted-foreground p-2 bg-muted rounded-lg">O preço aparecerá como "A combinar"</p>
                )}
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Localização</Label>
              <Input placeholder="Cidade" value={form.location} onChange={e => u('location', e.target.value)} className="mt-1 h-12" />
              {errors.location && <p className="text-xs text-destructive mt-2">{errors.location}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium">Retirada/Entrega</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(DELIVERY_OPTIONS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <Checkbox checked={form.delivery_options.includes(key)}
                      onCheckedChange={(checked) => {
                        if (checked) u('delivery_options', [...form.delivery_options, key]);
                        else u('delivery_options', form.delivery_options.filter((d: string) => d !== key));
                      }} />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
              {errors.delivery_options && <p className="text-xs text-destructive mt-2">{errors.delivery_options}</p>}
            </div>

            {/* Preview */}
            <div>
              <p className="text-sm font-semibold mb-2">Confira como vai aparecer para os compradores:</p>
              <Card className="p-3 flex gap-3">
                {form.images[0] && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <SmartImage src={form.images[0]} alt="Prévia da foto de capa" slot="thumb" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{form.title || 'Título do anúncio'}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">
                    {form.listing_type === 'donation' ? 'Grátis' : form.priceMode === 'negotiable' ? 'A combinar' : form.price ? formatCurrency(parseFloat(form.price)) : 'R$ 0,00'}
                  </p>
                  <p className="text-xs text-muted-foreground">{form.location || 'Localização'}</p>
                </div>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <Button
                className="flex-1 h-12 text-[15px] gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
                ) : (
                  <><Save className="w-4 h-4" /> Salvar alterações</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Taxa HandMade: {feePercent}% somente quando vender.
            </p>

            {/* Danger zone */}
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
                onClick={() => setShowRemoveConfirm(true)}>
                <Trash2 className="w-4 h-4" /> Excluir anúncio permanentemente
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Excluir este anúncio?"
        description={`"${listing.title}" sai do ar imediatamente. Você poderá desfazer a exclusão pelo aviso que aparece em seguida.`}
        confirmLabel="Excluir anúncio"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
