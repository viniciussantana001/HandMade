import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Mail, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
        <span className="text-primary-foreground font-bold text-2xl">H</span>
      </div>
      <div className="text-center mb-6">
        <PartyPopper className="w-12 h-12 text-warning-strong mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Conta criada com sucesso!</h1>
        <p className="text-sm text-muted-foreground mt-2">Verifique seu e-mail para ativar a conta.</p>
      </div>
      <Card className="bg-warning/10 border-warning-strong/30 p-4 mb-6 w-full max-w-sm">
        <div className="flex items-start gap-2">
          <Mail className="w-5 h-5 text-warning-strong shrink-0 mt-0.5" />
          <p className="text-sm">Sem a confirmação do e-mail você pode explorar a plataforma, mas não poderá publicar anúncios.</p>
        </div>
      </Card>
      <div className="w-full max-w-sm space-y-3">
        <Button asChild className="w-full h-12 text-[15px]">
          <Link to="/" className="block">Explorar a HandMade</Link>
        </Button>
        <Button variant="outline" className="w-full h-12" onClick={() => toast.success('E-mail de confirmação reenviado!')}>
          Reenviar e-mail de confirmação
        </Button>
      </div>
    </div>
  );
}
