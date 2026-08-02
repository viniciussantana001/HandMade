import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { User, Building2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { maskCPF, maskCNPJ, maskPhone, validateCPF, validateCNPJ, getPasswordStrength } from '@/lib/validators';
import PasswordStrength from '@/components/common/PasswordStrength';
import AppHeader from '@/components/layout/AppHeader';
import { BRAZILIAN_STATES, SEGMENTS } from '@/lib/categories';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [accountType, setAccountType] = useState<'individual' | 'company' | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const u = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }));

  // Step 1 - Choose account type
  if (!accountType) {
    return (
      <div>
        <AppHeader showBack title="Criar Conta" />
        <div className="px-4 py-6 space-y-4">
          <h2 className="text-xl font-bold text-center mb-2">Como você quer usar a HandMade?</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Escolha o tipo de conta que melhor se encaixa</p>

          <Card className="p-5 cursor-pointer border-2 hover:border-primary transition-colors bg-success/5"
            onClick={() => setAccountType('individual')}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sou Pessoa Física</h3>
                <p className="text-sm text-muted-foreground">Vendo ou compro por conta própria</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Artesão', 'Colecionador', 'Reformas', 'Faço em casa'].map(t => (
                    <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 cursor-pointer border-2 hover:border-info transition-colors bg-info/5"
            onClick={() => setAccountType('company')}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8 text-info" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sou Empresa</h3>
                <p className="text-sm text-muted-foreground">Minha empresa gera ou compra material</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Indústria', 'Construção', 'Comércio', 'Reciclagem'].map(t => (
                    <span key={t} className="text-[10px] bg-info/10 text-info px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-primary font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    );
  }

  const totalSteps = 3;
  const strength = getPasswordStrength(form.password || '');

  const handleSubmit = () => {
    if (!termsAccepted) { toast.error('Aceite os termos de uso para continuar'); return; }
    if (strength.level < 2) { toast.error('Sua senha precisa ser pelo menos "Média"'); return; }
    if (form.password !== form.confirmPassword) { toast.error('As senhas não coincidem'); return; }

    setIsSubmitting(true);
    setTimeout(() => {
      register({
        email: form.email,
        full_name: accountType === 'individual' ? form.fullName : form.responsibleName,
        account_type: accountType,
        cpf_last4: accountType === 'individual' ? form.cpf?.replace(/\D/g, '').slice(-4) : undefined,
        cnpj_last4: accountType === 'company' ? form.cnpj?.replace(/\D/g, '').slice(-4) : undefined,
        company_name: form.companyName,
        trade_name: form.tradeName,
        segment: form.segment,
        phone: form.phone,
        city: form.city,
        state: form.state,
      }, form.password);
      navigate('/bem-vindo');
    }, 800);
  };

  return (
    <div>
      <AppHeader showBack title={accountType === 'individual' ? 'Pessoa Física' : 'Empresa'} />
      <div className="px-4 py-4">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Etapa {step} de {totalSteps}</p>

        {/* Individual Step 1 */}
        {accountType === 'individual' && step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Quem é você?</h2>
            <div>
              <Label className="text-sm font-medium">Nome completo</Label>
              <Input placeholder="Ex: Maria Aparecida Silva" value={form.fullName || ''} onChange={e => u('fullName', e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label className="text-sm font-medium">CPF</Label>
              <Input placeholder="000.000.000-00" value={form.cpf || ''} onChange={e => u('cpf', maskCPF(e.target.value))} className="mt-1 h-12" maxLength={14} />
              {form.cpf && form.cpf.replace(/\D/g, '').length === 11 && !validateCPF(form.cpf) && (
                <p className="text-destructive text-xs mt-1">CPF inválido. Verifique os números.</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Data de nascimento</Label>
              <Input type="date" value={form.birthDate || ''} onChange={e => u('birthDate', e.target.value)} className="mt-1 h-12" />
            </div>
            <Button className="w-full h-12 text-[15px]" onClick={() => {
              if (!form.fullName || !form.cpf) { toast.error('Preencha todos os campos'); return; }
              setStep(2);
            }}>Continuar <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {/* Company Step 1 */}
        {accountType === 'company' && step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Sua empresa</h2>
            <div>
              <Label className="text-sm font-medium">CNPJ</Label>
              <Input placeholder="00.000.000/0000-00" value={form.cnpj || ''} onChange={e => u('cnpj', maskCNPJ(e.target.value))} className="mt-1 h-12" maxLength={18} />
              {form.cnpj && form.cnpj.replace(/\D/g, '').length === 14 && !validateCNPJ(form.cnpj) && (
                <p className="text-destructive text-xs mt-1">CNPJ inválido.</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Razão Social</Label>
              <Input placeholder="Nome da empresa" value={form.companyName || ''} onChange={e => u('companyName', e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label className="text-sm font-medium">Nome Fantasia (opcional)</Label>
              <Input value={form.tradeName || ''} onChange={e => u('tradeName', e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label className="text-sm font-medium">Segmento</Label>
              <Select value={form.segment || ''} onValueChange={v => u('segment', v)}>
                <SelectTrigger className="mt-1 h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-12 text-[15px]" onClick={() => {
              if (!form.cnpj || !form.companyName) { toast.error('Preencha CNPJ e Razão Social'); return; }
              setStep(2);
            }}>Continuar <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {/* Step 2 - Contact */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{accountType === 'company' ? 'Responsável e contato' : 'Como entrar em contato?'}</h2>
            {accountType === 'company' && (
              <>
                <div>
                  <Label className="text-sm font-medium">Nome do responsável</Label>
                  <Input placeholder="Nome completo" value={form.responsibleName || ''} onChange={e => u('responsibleName', e.target.value)} className="mt-1 h-12" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Cargo (opcional)</Label>
                  <Input placeholder="Ex: Gerente, Proprietário" value={form.role || ''} onChange={e => u('role', e.target.value)} className="mt-1 h-12" />
                </div>
              </>
            )}
            <div>
              <Label className="text-sm font-medium">E-mail</Label>
              <Input type="email" placeholder="Ex: maria@gmail.com" value={form.email || ''} onChange={e => u('email', e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label className="text-sm font-medium">Telefone com DDD</Label>
              <Input placeholder="(00) 00000-0000" value={form.phone || ''} onChange={e => u('phone', maskPhone(e.target.value))} className="mt-1 h-12" maxLength={15} />
            </div>
            <div>
              <Label className="text-sm font-medium">Cidade</Label>
              <Input value={form.city || ''} onChange={e => u('city', e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label className="text-sm font-medium">Estado</Label>
              <Select value={form.state || ''} onValueChange={v => u('state', v)}>
                <SelectTrigger className="mt-1 h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <Button className="flex-1 h-12" onClick={() => {
                if (!form.email) { toast.error('Preencha o e-mail'); return; }
                setStep(3);
              }}>Continuar <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 3 - Password */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Crie sua senha</h2>
            <div>
              <Label className="text-sm font-medium">Senha</Label>
              <Input type="password" value={form.password || ''} onChange={e => u('password', e.target.value)} className="mt-1 h-12" />
              <PasswordStrength password={form.password || ''} />
            </div>
            <div>
              <Label className="text-sm font-medium">Confirmar senha</Label>
              <Input type="password" value={form.confirmPassword || ''} onChange={e => u('confirmPassword', e.target.value)} className="mt-1 h-12" />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-destructive text-xs mt-1">As senhas não coincidem</p>
              )}
            </div>
            {accountType === 'company' && (
              <div>
                <Label className="text-sm font-medium">Descrição da empresa (opcional)</Label>
                <Textarea placeholder="Breve descrição..." value={form.companyDesc || ''} onChange={e => u('companyDesc', e.target.value)} className="mt-1" maxLength={300} />
                <p className="text-xs text-muted-foreground text-right mt-1">{(form.companyDesc || '').length}/300</p>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} className="mt-0.5" />
              <label htmlFor="terms" className="text-sm cursor-pointer">Li e concordo com os <span className="text-primary font-medium">Termos de Uso</span></label>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
              <Checkbox id="news" checked={newsletter} onCheckedChange={(c) => setNewsletter(!!c)} className="mt-0.5" />
              <label htmlFor="news" className="text-sm cursor-pointer">Quero receber novidades da HandMade por e-mail</label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <Button className="flex-1 h-12" onClick={handleSubmit} disabled={!termsAccepted || isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {accountType === 'company' ? 'Criar conta da empresa' : 'Criar minha conta'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
