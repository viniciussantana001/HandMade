import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Lock, Download, Trash2, ShieldCheck, FileText, Shield, Mail, Database, Cookie,
  CheckCircle2, ChevronRight, Users, ScrollText,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import {
  listingStore, orderStore, paymentStore, messageStore, favoriteStore, reviewStore,
  notificationStore, consentStore, auditStore, useStoreVersion,
} from '@/lib/store';
import {
  LGPD_RIGHTS, CONTROLLER, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION,
} from '@/lib/legal';
import { formatDateTimeBR } from '@/lib/formatters';
import AppHeader from '@/components/layout/AppHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { LoadingScreen } from '@/components/common/StateViews';
import { toast } from 'sonner';

/**
 * Central de Privacidade e Dados (L1).
 *
 * Materializa no aplicativo os direitos do art. 18 da LGPD: acesso, correção,
 * portabilidade (exportação em JSON), gestão de consentimentos e exclusão de
 * conta. Na v4.0 esses direitos só existiam como texto na Central de Ajuda.
 */
export default function PrivacyCenter() {
  const { user, updateUser } = useAuth();
  const { loading } = useRequireAuth();
  const navigate = useNavigate();
  useStoreVersion();

  const [showData, setShowData] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (loading) return <LoadingScreen label="Carregando seus dados…" />;
  if (!user) return null;

  const myListings = listingStore.filter(l => l.created_by === user.email);
  const myOrders = orderStore.filter(o => o.buyer_email === user.email || o.seller_email === user.email);
  const myPayments = paymentStore.filter(p => p.payer_email === user.email || p.payee_email === user.email);
  const myMessages = messageStore.filter(m => m.sender_email === user.email || m.recipient_email === user.email);
  const myFavorites = favoriteStore.filter(f => f.user_email === user.email);
  const myReviews = reviewStore.filter(r => r.reviewer_email === user.email || r.reviewed_email === user.email);
  const myNotifications = notificationStore.filter(n => n.recipient_email === user.email);
  const myConsents = consentStore.filter(c => c.user_email === user.email);
  const myAudit = auditStore.filter(a => a.actor_email === user.email);

  const dataSummary = [
    { label: 'Dados cadastrais', count: 1, detail: 'nome, e-mail, telefone, cidade e tipo de conta' },
    { label: 'Anúncios publicados', count: myListings.length, detail: 'fotos, descrição, preço e localização' },
    { label: 'Pedidos', count: myOrders.length, detail: 'compras e vendas registradas' },
    { label: 'Pagamentos', count: myPayments.length, detail: 'método, valor, status e recibo' },
    { label: 'Mensagens', count: myMessages.length, detail: 'conversas com outros usuários' },
    { label: 'Favoritos', count: myFavorites.length, detail: 'anúncios que você salvou' },
    { label: 'Avaliações', count: myReviews.length, detail: 'notas e comentários' },
    { label: 'Notificações', count: myNotifications.length, detail: 'avisos enviados a você' },
    { label: 'Registros de consentimento', count: myConsents.length, detail: 'aceites de termos e políticas' },
    { label: 'Registros de acesso', count: myAudit.length, detail: 'entradas e ações sensíveis na conta' },
  ];

  /** Portabilidade (art. 18, V): exporta tudo em JSON estruturado. */
  const exportData = () => {
    const payload = {
      exportado_em: new Date().toISOString(),
      aviso: 'Exportação de dados pessoais gerada pelo protótipo HandMade 5.0 (LGPD art. 18, V).',
      controlador: { nome: CONTROLLER.name, contato: CONTROLLER.email, encarregado: CONTROLLER.dpo_email },
      titular: {
        nome: user.full_name,
        email: user.email,
        telefone: user.phone,
        cidade: user.city,
        estado: user.state,
        tipo_de_conta: user.account_type,
        plano: user.subscription_plan,
        criado_em: user.created_at,
        provedor_de_login: user.auth_provider,
        versao_termos_aceita: user.accepted_terms_version,
        versao_privacidade_aceita: user.accepted_privacy_version,
        aceite_marketing: user.marketing_opt_in ?? false,
      },
      anuncios: myListings,
      pedidos: myOrders,
      pagamentos: myPayments,
      mensagens: myMessages,
      favoritos: myFavorites,
      avaliacoes: myReviews,
      notificacoes: myNotifications,
      consentimentos: myConsents,
      registros_de_acesso: myAudit,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `handmade-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    auditStore.create({
      actor_email: user.email,
      action: 'privacy.data_exported',
      entity: 'user',
      created_at: new Date().toISOString(),
    } as any);
    toast.success('Seus dados foram exportados', {
      description: 'Arquivo JSON estruturado, pronto para levar a outro fornecedor.',
    });
  };

  /** Revogação de consentimento (art. 18, IX) — registro versionado. */
  const toggleMarketing = (granted: boolean) => {
    updateUser({ marketing_opt_in: granted });
    consentStore.create({
      user_email: user.email,
      document: 'marketing',
      document_version: CURRENT_PRIVACY_VERSION,
      granted,
      created_at: new Date().toISOString(),
    } as any);
    toast.success(
      granted ? 'Você voltou a receber novidades' : 'Comunicações de marketing desativadas'
    );
  };

  const toggleAnalytics = (granted: boolean) => {
    consentStore.create({
      user_email: user.email,
      document: 'cookies',
      document_version: CURRENT_PRIVACY_VERSION,
      granted,
      created_at: new Date().toISOString(),
    } as any);
    toast.success(
      granted ? 'Análise de uso ativada' : 'Análise de uso desativada',
      { description: granted ? undefined : 'O aplicativo continua funcionando normalmente.' }
    );
  };

  const analyticsGranted = (() => {
    const cookieConsents = myConsents.filter(c => c.document === 'cookies');
    return cookieConsents.length > 0 ? cookieConsents[0].granted : true;
  })();

  const requestDeletion = () => {
    updateUser({ deletion_requested: true, deletion_requested_at: new Date().toISOString() });
    auditStore.create({
      actor_email: user.email,
      action: 'privacy.deletion_requested',
      entity: 'user',
      created_at: new Date().toISOString(),
    } as any);
    toast.success('Solicitação de exclusão registrada', {
      description: 'Concluímos a eliminação em até 30 dias e avisamos por e-mail.',
    });
    setConfirmDelete(false);
  };

  const rightAction = (code: string) => {
    if (code === 'art. 18, II') setShowData(true);
    else if (code === 'art. 18, III') navigate('/perfil/editar');
    else if (code === 'art. 18, V') exportData();
    else if (code === 'art. 18, VI') setConfirmDelete(true);
    else if (code === 'art. 18, IV') setConfirmDelete(true);
    else if (code === 'art. 18, VII') navigate('/politica-de-privacidade');
    else if (code === 'art. 18, IX') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      toast.info('Gerencie seus consentimentos abaixo');
    } else {
      toast.info(`Solicitação registrada`, {
        description: `Nosso encarregado responde em até 15 dias por ${CONTROLLER.dpo_email}.`,
      });
    }
  };

  return (
    <div>
      <AppHeader showBack title="Privacidade e dados" />
      <div className="px-4 py-4 space-y-5">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Você controla seus dados</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Aqui você consulta, corrige, exporta e apaga seus dados pessoais, além de escolher
                quais tratamentos opcionais autoriza — todos os direitos previstos no art. 18 da
                LGPD, sem precisar enviar e-mail.
              </p>
            </div>
          </div>
        </Card>

        {/* Consentimentos */}
        <section aria-labelledby="consent-title">
          <h2 id="consent-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Seus consentimentos
          </h2>
          <Card className="divide-y">
            <div className="p-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">Termos de Uso</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Obrigatório para usar a plataforma.
                </p>
              </div>
              <Badge className="bg-success/10 text-success border-0 text-[10px] gap-1 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5" /> v{user.accepted_terms_version || CURRENT_TERMS_VERSION}
              </Badge>
            </div>
            <div className="p-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">Política de Privacidade</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Obrigatório para usar a plataforma.
                </p>
              </div>
              <Badge className="bg-success/10 text-success border-0 text-[10px] gap-1 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5" /> v{user.accepted_privacy_version || CURRENT_PRIVACY_VERSION}
              </Badge>
            </div>
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Label htmlFor="consent-marketing" className="text-sm font-medium">
                  Novidades e dicas por e-mail
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Opcional. Você pode desativar quando quiser.
                </p>
              </div>
              <Switch
                id="consent-marketing"
                checked={Boolean(user.marketing_opt_in)}
                onCheckedChange={toggleMarketing}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Label htmlFor="consent-analytics" className="text-sm font-medium">
                  Análise de uso e personalização
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Opcional. Ajuda a recomendar anúncios relevantes.
                </p>
              </div>
              <Switch
                id="consent-analytics"
                checked={analyticsGranted}
                onCheckedChange={toggleAnalytics}
              />
            </div>
          </Card>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-start gap-1.5">
            <Cookie className="w-3 h-3 shrink-0 mt-0.5" />
            Cookies essenciais mantêm sua sessão e preferências e não podem ser desativados, pois o
            aplicativo não funciona sem eles.
          </p>
        </section>

        {/* Ações rápidas */}
        <section aria-labelledby="actions-title">
          <h2 id="actions-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Ações rápidas
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full h-12 justify-start gap-2.5" onClick={() => setShowData(true)}>
              <Database className="w-4 h-4 text-primary" /> Ver todos os meus dados
            </Button>
            <Button variant="outline" className="w-full h-12 justify-start gap-2.5" onClick={exportData}>
              <Download className="w-4 h-4 text-primary" /> Baixar meus dados (JSON)
            </Button>
            <Button asChild variant="outline" className="w-full h-12 justify-start gap-2.5">
              <Link to="/perfil/editar" className="block">
                <FileText className="w-4 h-4 text-primary" /> Corrigir meus dados
              </Link>
            </Button>
          </div>
        </section>

        {/* Dados armazenados */}
        {showData && (
          <section aria-labelledby="data-title">
            <h2 id="data-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Dados que mantemos sobre você
            </h2>
            <Card className="divide-y animate-fade-in">
              {dataSummary.map(item => (
                <div key={item.label} className="p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums shrink-0">{item.count}</span>
                </div>
              ))}
            </Card>
            <p className="text-[11px] text-muted-foreground mt-2">
              Estes dados ficam no armazenamento local do seu navegador, pois este é um protótipo sem
              servidor. No aplicativo final, ficariam no Firestore com regras de acesso por usuário.
            </p>
          </section>
        )}

        {/* Direitos do titular */}
        <section aria-labelledby="rights-title">
          <h2 id="rights-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Seus direitos como titular
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {LGPD_RIGHTS.map(right => (
              <AccordionItem
                key={right.code}
                value={right.code}
                className="border rounded-xl px-3 bg-card"
              >
                <AccordionTrigger className="text-sm text-left font-medium py-3">
                  <span className="flex-1 pr-2">{right.title}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <Badge variant="outline" className="text-[10px] mb-2">
                    LGPD, {right.code}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                    {right.description}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[11px]"
                    onClick={() => rightAction(right.code)}
                  >
                    {right.action}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Histórico de consentimentos */}
        {myConsents.length > 0 && (
          <section aria-labelledby="history-title">
            <h2 id="history-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Histórico de aceites
            </h2>
            <Card className="divide-y">
              {myConsents.slice(0, 8).map(consent => (
                <div key={consent.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium capitalize">
                      {consent.document === 'terms' ? 'Termos de Uso'
                        : consent.document === 'privacy' ? 'Política de Privacidade'
                        : consent.document === 'marketing' ? 'Comunicações de marketing'
                        : 'Cookies e análise'}
                      {' '}· v{consent.document_version}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDateTimeBR(consent.created_at)}
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] border-0 shrink-0 ${
                      consent.granted ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {consent.granted ? 'Aceito' : 'Recusado'}
                  </Badge>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* Documentos */}
        <section aria-labelledby="docs-title">
          <h2 id="docs-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Documentos
          </h2>
          <Card className="divide-y">
            <Link to="/termos" className="flex items-center gap-3 p-3.5 active:bg-muted transition-colors">
              <ScrollText className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm font-medium">Termos de Uso</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/politica-de-privacidade" className="flex items-center gap-3 p-3.5 active:bg-muted transition-colors">
              <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm font-medium">Política de Privacidade</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/tributos" className="flex items-center gap-3 p-3.5 active:bg-muted transition-colors">
              <Users className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm font-medium">Tributos e obrigações do vendedor</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </Card>
        </section>

        {/* Encarregado */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
            <Mail className="w-4 h-4" /> Falar com o encarregado (DPO)
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para qualquer solicitação sobre seus dados, escreva para{' '}
            <strong>{CONTROLLER.dpo_email}</strong>. O prazo de resposta é de até 15 dias. Você
            também pode peticionar à ANPD e aos órgãos de defesa do consumidor.
          </p>
        </Card>

        <Separator />

        {/* Exclusão */}
        <section aria-labelledby="delete-title">
          <h2 id="delete-title" className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
            Excluir minha conta
          </h2>
          {user.deletion_requested ? (
            <Card className="p-3.5 bg-warning/5 border-warning-strong/30">
              <p className="text-sm font-medium">Exclusão já solicitada</p>
              <p className="text-xs text-muted-foreground mt-1">
                Pedido registrado em{' '}
                {user.deletion_requested_at ? formatDateTimeBR(user.deletion_requested_at) : '—'}. A
                eliminação é concluída em até 30 dias.
              </p>
            </Card>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full h-12 text-destructive border-destructive/30 gap-2"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4" /> Solicitar exclusão da conta
              </Button>
              <p className="text-[11px] text-muted-foreground mt-2">
                Mantemos apenas o que a lei exige: pedidos e comprovantes fiscais por 5 anos e
                registros de acesso por 6 meses (Marco Civil, art. 15).
              </p>
            </>
          )}
        </section>

        <p className="text-[10px] text-muted-foreground text-center pt-2">
          Política de Privacidade versão {CURRENT_PRIVACY_VERSION} · {CONTROLLER.name}
        </p>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Solicitar a exclusão dos seus dados?"
        description="Seus dados de cadastro, anúncios, mensagens e favoritos serão eliminados em até 30 dias. Pedidos e comprovantes de pagamento são mantidos por 5 anos por obrigação fiscal, conforme o art. 16 da LGPD."
        confirmLabel="Solicitar exclusão"
        destructive
        onConfirm={requestDeletion}
      />
    </div>
  );
}
