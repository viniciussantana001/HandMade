import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import { toast } from 'sonner';

function GoogleGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleOpen, setGoogleOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();
    setErrorMessage('');
    if (!normalizedEmail) {
      setErrorMessage('Informe seu e-mail para acessar a conta.');
      toast.error('Informe seu e-mail');
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage('Digite um e-mail válido, como nome@email.com.');
      toast.error('E-mail inválido');
      return;
    }
    if (!password) {
      setErrorMessage('Informe sua senha. Se não lembrar, use a recuperação de senha.');
      toast.error('Informe sua senha');
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const success = login(normalizedEmail, password);
      if (success) {
        setErrorMessage('');
        toast.success('Sessão Firebase simulada criada.');
        navigate('/');
      } else {
        setErrorMessage('Não encontramos uma conta com esses dados. Use a conta demo, entre com Google ou crie uma conta grátis.');
        toast.error('Não foi possível entrar');
      }
      setLoading(false);
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login com Google conectado ao mock do Firebase.');
      setGoogleOpen(false);
      navigate('/');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const normalizedEmail = forgotEmail.trim();
    setForgotError('');
    if (!normalizedEmail) {
      setForgotError('Informe o e-mail cadastrado para receber o link.');
      toast.error('Informe seu e-mail');
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setForgotError('Digite um e-mail válido antes de enviar o link.');
      toast.error('E-mail inválido');
      return;
    }
    window.setTimeout(() => {
      setForgotSent(true);
      setForgotError('');
      toast.success('E-mail de recuperação simulado enviado.');
    }, 800);
  };

  const fillDemo = () => {
    setEmail('demo@handmade.com');
    setPassword('Demo@1234');
    setErrorMessage('');
    toast.success('Conta demo preenchida.');
  };

  return (
    <div>
      <AppHeader showBack />
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-bold">Entrar na HandMade</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta para comprar e vender materiais.</p>
        </div>

        <button
          type="button"
          onClick={() => setGoogleOpen(true)}
          className="w-full h-12 rounded-md border border-[#747775] bg-white text-[#1f1f1f] font-medium text-sm flex items-center justify-center gap-3 shadow-sm active:bg-[#f7f8f8]"
        >
          <GoogleGIcon />
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">ou entre com e-mail</span>
          <Separator className="flex-1" />
        </div>

        {/*
          Formulário real (U4): na versão 4.0 os campos ficavam soltos em uma
          <div>, então a tecla Enter só funcionava no campo de senha, graças a um
          onKeyDown improvisado. Com <form onSubmit> o teclado passa a funcionar
          em qualquer campo — requisito de acessibilidade e o comportamento que
          todo usuário espera de uma tela de login.
        */}
        <form
          className="space-y-4"
          onSubmit={e => { e.preventDefault(); handleLogin(); }}
          noValidate
        >
          <div>
            <Label htmlFor="login-email" className="text-sm font-medium">E-mail</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'login-erro' : undefined}
              className="mt-1 h-12"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="login-senha" className="text-sm font-medium">Senha</Label>
              {/* -my-1 py-1 amplia o alvo a 24px sem alterar a altura da linha. */}
              <button
                type="button"
                onClick={() => { setForgotOpen(true); setForgotEmail(email); setForgotSent(false); }}
                className="text-xs text-primary font-medium hover:underline -my-1 py-1 px-1 -mr-1 rounded"
              >
                Esqueci minha senha
              </button>
            </div>
            <Input
              id="login-senha"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'login-erro' : undefined}
              className="h-12"
            />
          </div>
          {errorMessage && (
            <Card className="p-3 border-destructive/40 bg-destructive/5">
              <div className="flex items-start gap-2" id="login-erro" role="alert">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-xs text-destructive leading-relaxed">{errorMessage}</p>
              </div>
            </Card>
          )}
          <Button type="submit" className="w-full h-12 text-[15px]" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
            Entrar
          </Button>
          <Button type="button" variant="outline" className="w-full h-11" onClick={fillDemo}>
            Usar conta demo
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta? <Link to="/cadastro" className="text-primary font-medium">Criar conta grátis</Link>
          </p>
        </form>

        <Card className="mt-6 p-3 bg-primary/5 border-primary/15">
          <div className="flex gap-2">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Protótipo v5.0: o login simula Firebase Authentication, Google OAuth 2.0, token JWT e sessão local sem usar Firebase real.
            </p>
          </div>
        </Card>
      </div>

      <Dialog open={googleOpen} onOpenChange={setGoogleOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Entrar com Google</DialogTitle>
            <DialogDescription>Simulação do popup OAuth usado pelo Firebase Authentication.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full p-3 rounded-xl border bg-card text-left flex items-center gap-3"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">M</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Maria Silva</p>
                <p className="text-xs text-muted-foreground truncate">maria.silva.google@gmail.com</p>
              </div>
              {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-success" />}
            </button>
            <Card className="p-3 bg-muted/60">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permissões simuladas: nome, e-mail verificado e foto de perfil. Nenhuma chamada externa é feita.
              </p>
            </Card>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full h-11 gap-2" onClick={handleGoogleLogin} disabled={googleLoading}>
              {googleLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <GoogleGIcon />}
              Continuar como Maria
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setGoogleOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{forgotSent ? 'E-mail enviado' : 'Recuperar senha'}</DialogTitle>
          </DialogHeader>
          {forgotSent ? (
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Enviamos um link de recuperação para:</p>
              <p className="text-sm font-semibold mb-4">{forgotEmail}</p>
              <Card className="p-3 bg-muted text-left">
                <p className="text-xs text-muted-foreground">Verifique a caixa de entrada e a pasta de spam. O link simulado expira em 1 hora.</p>
              </Card>
            </div>
          ) : (
            <div className="py-2 space-y-4">
              <p className="text-sm text-muted-foreground">Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>
              <div>
                <Label className="text-sm font-medium">E-mail</Label>
                <Input type="email" placeholder="seu@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="mt-1 h-12" />
                {forgotError && <p className="text-xs text-destructive mt-2">{forgotError}</p>}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2">
            {forgotSent ? (
              <>
                <Button className="w-full h-11" onClick={() => setForgotOpen(false)}>Voltar ao login</Button>
                <Button variant="outline" className="w-full" onClick={() => { setForgotSent(false); toast.success('E-mail reenviado.'); }}>
                  Reenviar e-mail
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full h-11" onClick={handleForgotPassword} disabled={!forgotEmail}>
                  Enviar link de recuperação
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setForgotOpen(false)}>Cancelar</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
