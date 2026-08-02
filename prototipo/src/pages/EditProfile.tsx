import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Camera, ImagePlus, Moon, Sun, Trash2, Save, AlertTriangle, Loader2, Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { useTheme } from '@/lib/ThemeContext';
import { maskPhone, validatePhone } from '@/lib/validators';
import { BRAZILIAN_STATES } from '@/lib/categories';
import { PHOTO_ACCEPT_ATTR, processAvatarPhoto, imageUrl } from '@/lib/images';
import AppHeader from '@/components/layout/AppHeader';
import FormField from '@/components/common/FormField';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { LoadingScreen } from '@/components/common/StateViews';
import { toast } from 'sonner';

/**
 * Edição de perfil.
 *
 * Mudança na 5.0 (U3): a foto de perfil passa a vir da galeria ou da câmera do
 * dispositivo, com recorte quadrado, validação e pré-visualização — antes o
 * usuário escolhia entre seis avatares fixos de um banco de imagens.
 */
export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { loading } = useRequireAuth();
  const { theme, toggleTheme } = useTheme();

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [avatarDialog, setAvatarDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    avatar_url: user?.avatar_url || '',
  });

  if (loading) return <LoadingScreen label="Carregando seus dados…" />;
  if (!user) return null;

  const u = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.full_name.trim().length < 3) {
      next.full_name = 'Informe seu nome completo (mínimo 3 caracteres).';
    }
    if (form.phone && !validatePhone(form.phone)) {
      next.phone = 'Telefone incompleto. Use DDD + número.';
    }
    if (form.city && form.city.trim().length < 2) {
      next.city = 'Informe o nome da cidade.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /** Lê a foto escolhida no dispositivo, recorta em quadrado e valida. */
  const handleAvatarFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const { dataUrl, error } = await processAvatarPhoto(file);
    setUploadingAvatar(false);
    if (galleryRef.current) galleryRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
    if (error) {
      toast.error(error);
      return;
    }
    if (dataUrl) {
      u('avatar_url', dataUrl);
      setAvatarDialog(false);
      toast.success('Foto de perfil atualizada', {
        description: 'Não esqueça de salvar as alterações.',
      });
    }
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Confira os campos destacados');
      return;
    }
    setSaving(true);
    await new Promise(resolve => window.setTimeout(resolve, 700));
    updateUser({
      full_name: form.full_name.trim(),
      phone: form.phone,
      city: form.city.trim(),
      state: form.state,
      avatar_url: form.avatar_url,
    });
    setSaving(false);
    toast.success('Perfil atualizado');
    navigate('/perfil', { replace: true });
  };

  const removeAvatar = () => {
    u('avatar_url', '');
    setAvatarDialog(false);
    toast.success('Foto removida', {
      description: 'Sua inicial volta a ser exibida no lugar da foto.',
    });
  };

  const handleDeleteAccount = () => {
    updateUser({ deletion_requested: true, deletion_requested_at: new Date().toISOString() });
    toast.success('Solicitação registrada', {
      description: 'Sua conta e seus dados serão eliminados em até 30 dias, conforme a LGPD.',
    });
    setDeleteDialog(false);
    navigate('/perfil', { replace: true });
  };

  return (
    <div>
      <AppHeader showBack title="Editar Perfil" />

      <input
        ref={galleryRef}
        type="file"
        accept={PHOTO_ACCEPT_ATTR}
        className="hidden"
        onChange={e => handleAvatarFile(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={cameraRef}
        type="file"
        accept={PHOTO_ACCEPT_ATTR}
        capture="user"
        className="hidden"
        onChange={e => handleAvatarFile(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="px-4 py-4">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {form.avatar_url ? (
                <AvatarImage src={imageUrl(form.avatar_url, 'avatar')} alt={form.full_name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {form.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-background/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setAvatarDialog(true)}
              disabled={uploadingAvatar}
              aria-label="Alterar foto de perfil"
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Toque na câmera para usar uma foto do seu celular
          </p>
        </div>

        {/* Dados pessoais */}
        <div className="space-y-4 mb-6">
          <FormField
            label="Nome completo"
            error={errors.full_name}
            required
            valid={form.full_name.trim().length >= 3}
          >
            {props => (
              <Input
                {...props}
                autoComplete="name"
                value={form.full_name}
                onChange={e => u('full_name', e.target.value)}
              />
            )}
          </FormField>

          <div>
            <Label htmlFor="perfil-email" className="text-sm font-medium flex items-center gap-1.5">
              E-mail <Lock className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
            </Label>
            <Input
              id="perfil-email"
              value={user.email}
              disabled
              readOnly
              aria-describedby="perfil-email-nota"
              className="mt-1 h-12 bg-muted"
            />
            <p id="perfil-email-nota" className="text-[11px] text-muted-foreground mt-1">
              O e-mail identifica sua conta e não pode ser alterado.
            </p>
          </div>

          <FormField
            label="Telefone"
            error={errors.phone}
            hint="Usado apenas para contato sobre negociações"
            valid={Boolean(form.phone) && validatePhone(form.phone)}
          >
            {props => (
              <Input
                {...props}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={e => u('phone', maskPhone(e.target.value))}
                maxLength={15}
              />
            )}
          </FormField>

          <div className="flex gap-3">
            <div className="flex-1">
              <FormField label="Cidade" error={errors.city} valid={form.city.trim().length >= 2}>
                {props => (
                  <Input
                    {...props}
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={e => u('city', e.target.value)}
                  />
                )}
              </FormField>
            </div>
            <div className="w-28">
              <Label htmlFor="perfil-estado" className="text-sm font-medium">Estado</Label>
              <Select value={form.state} onValueChange={v => u('state', v)}>
                <SelectTrigger id="perfil-estado" aria-label="Estado (UF)" className="mt-1 h-12"><SelectValue placeholder="UF" /></SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Aparência
          </p>
          <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-warning-strong" />
              )}
              <div>
                <p className="text-sm font-medium">Modo escuro</p>
                <p className="text-xs text-muted-foreground">Mais confortável à noite</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Alternar modo escuro"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Informações da conta
          </p>
          <Card className="p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo de conta</span>
              <span className="font-medium">
                {user.account_type === 'company' ? 'Empresa' : 'Pessoa Física'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-medium capitalize">{user.subscription_plan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Membro desde</span>
              <span className="font-medium">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </Card>
        </div>

        <Button className="w-full h-12 gap-2 mb-4" onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
          ) : (
            <><Save className="w-4 h-4" /> Salvar alterações</>
          )}
        </Button>

        <Separator className="my-4" />
        <div>
          <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-3">
            Zona de perigo
          </p>
          <Button
            variant="outline"
            className="w-full h-11 text-destructive border-destructive/30 gap-2"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" /> Solicitar exclusão da conta
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Direito garantido pelo art. 18 da LGPD. A exclusão ocorre em até 30 dias.
          </p>
        </div>
      </div>

      {/* Escolha da foto — galeria ou câmera do dispositivo */}
      <Dialog open={avatarDialog} onOpenChange={setAvatarDialog}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>Foto de perfil</DialogTitle></DialogHeader>
          <div className="py-2 space-y-2">
            <Button
              variant="outline"
              className="w-full h-12 gap-2 justify-start"
              onClick={() => galleryRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <ImagePlus className="w-4 h-4 text-primary" /> Escolher da galeria
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 gap-2 justify-start"
              onClick={() => cameraRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <Camera className="w-4 h-4 text-primary" /> Tirar uma foto agora
            </Button>
            <p className="text-[11px] text-muted-foreground pt-1">
              JPG, PNG ou WEBP · até 8 MB · a imagem é recortada em quadrado automaticamente.
            </p>
          </div>
          <DialogFooter className="flex-col gap-2">
            {form.avatar_url && (
              <Button
                variant="outline"
                className="w-full gap-2 text-destructive"
                onClick={removeAvatar}
              >
                <Trash2 className="w-4 h-4" /> Remover foto atual
              </Button>
            )}
            <Button variant="ghost" className="w-full" onClick={() => setAvatarDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Solicitar exclusão da conta?"
        description="Seus dados, anúncios e histórico serão eliminados em até 30 dias, salvo os registros que a lei exige guardar (pedidos e notas fiscais por 5 anos). Pedidos em andamento precisam ser concluídos antes."
        confirmLabel="Solicitar exclusão"
        destructive
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
