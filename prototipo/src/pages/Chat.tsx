import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Send, Tag, Check, X, MessageSquare, ShoppingCart, ChevronRight, AlertTriangle, Search,
  Image as ImageIcon,
} from 'lucide-react';
import { messageStore, notificationStore, useStoreVersion } from '@/lib/store';
import { useRequireAuth } from '@/lib/session';
import { formatRelativeDate, formatCurrency } from '@/lib/formatters';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/common/EmptyState';
import SmartImage from '@/components/common/SmartImage';
import { ListSkeleton } from '@/components/common/StateViews';
import { toast } from 'sonner';
import type { Message } from '@/lib/types';

const SCAM_WORDS = ['pix', 'transferência', 'banco', 'fora da plataforma', 'whatsapp', 'zap', 'paga fora'];

/**
 * Mensagens e propostas (5.0).
 *
 * A versão 4.0 mantinha uma cópia das mensagens em estado local e a
 * ressincronizava com `setInterval` a cada 2,5 s — o que gastava processamento
 * à toa e ainda assim atrasava a atualização. Agora a tela lê o armazenamento
 * diretamente e apenas assina as mudanças com `useStoreVersion`: qualquer
 * escrita reflete na conversa no mesmo quadro de renderização.
 */
export default function Chat() {
  const { conversationId } = useParams();
  const { user, loading } = useRequireAuth();
  useStoreVersion();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [offerDialog, setOfferDialog] = useState(false);
  const [offerValue, setOfferValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messages: Message[] = user
    ? messageStore.filter(m => m.sender_email === user.email || m.recipient_email === user.email)
    : [];

  const conversations = useMemo(
    () =>
      Object.values(
        messages.reduce((acc: Record<string, Message>, msg) => {
          if (
            !acc[msg.conversation_id] ||
            new Date(msg.created_date) > new Date(acc[msg.conversation_id].created_date)
          ) {
            acc[msg.conversation_id] = msg;
          }
          return acc;
        }, {})
      ).sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()),
    [messages]
  );

  const currentMessages = conversationId
    ? messages
        .filter(m => m.conversation_id === conversationId)
        .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
    : [];

  const currentInfo = currentMessages[0];
  const otherPerson = currentInfo
    ? currentInfo.sender_email === user?.email
      ? { email: currentInfo.recipient_email, name: currentInfo.recipient_name }
      : { email: currentInfo.sender_email, name: currentInfo.sender_name }
    : null;

  // Ao abrir a conversa, as mensagens recebidas passam a lidas.
  useEffect(() => {
    if (!user || !conversationId) return;
    messageStore
      .filter(m => m.conversation_id === conversationId && m.recipient_email === user.email && !m.read)
      .forEach(m => messageStore.update(m.id, { read: true }));
  }, [conversationId, user?.email, currentMessages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  const hasScamWord = (value: string) => SCAM_WORDS.some(w => value.toLowerCase().includes(w));

  const sendMessage = () => {
    if (!text.trim() || !currentInfo || !user) return;
    if (otherPerson?.email === user.email) { toast.error('Você não pode enviar mensagem para si mesmo'); return; }
    messageStore.create({
      conversation_id: conversationId!, listing_id: currentInfo.listing_id,
      listing_title: currentInfo.listing_title, listing_image: currentInfo.listing_image, listing_price: currentInfo.listing_price,
      sender_email: user.email, sender_name: user.full_name,
      recipient_email: otherPerson!.email, recipient_name: otherPerson!.name,
      content: text.trim(), read: false, created_date: new Date().toISOString(),
    } as any);
    notificationStore.create({
      recipient_email: otherPerson!.email,
      type: 'new_message',
      title: `Nova mensagem de ${user.full_name}`,
      message: `Sobre "${currentInfo.listing_title}".`,
      action_url: `/chat/${conversationId}`,
      read: false,
      created_at: new Date().toISOString(),
    } as any);
    setText('');
  };

  const sendOffer = () => {
    const price = parseFloat(offerValue.replace(',', '.'));
    if (!currentInfo || !user) return;
    if (!price || price <= 0) { toast.error('Informe um valor maior que zero.'); return; }
    if (currentInfo.listing_price > 0 && price > currentInfo.listing_price) {
      toast.error('A proposta está acima do preço anunciado.', {
        description: 'Ofereça um valor igual ou menor que o do anúncio.',
      });
      return;
    }
    messageStore.create({
      conversation_id: conversationId!, listing_id: currentInfo.listing_id,
      listing_title: currentInfo.listing_title, listing_image: currentInfo.listing_image, listing_price: currentInfo.listing_price,
      sender_email: user.email, sender_name: user.full_name,
      recipient_email: otherPerson!.email, recipient_name: otherPerson!.name,
      content: `💰 Proposta de ${formatCurrency(price)}`, offer_price: price, offer_status: 'pending',
      read: false, created_date: new Date().toISOString(),
    } as any);
    notificationStore.create({
      recipient_email: otherPerson!.email,
      type: 'offer_sent',
      title: 'Nova proposta recebida',
      message: `${user.full_name} enviou uma proposta de ${formatCurrency(price)}.`,
      action_url: `/chat/${conversationId}`,
      read: false,
      created_at: new Date().toISOString(),
    } as any);
    setOfferDialog(false);
    setOfferValue('');
    toast.success('Proposta enviada!');
  };

  const respondOffer = (msg: Message, status: 'accepted' | 'rejected') => {
    if (msg.recipient_email !== user?.email) { toast.error('Apenas o destinatário pode responder'); return; }
    messageStore.update(msg.id, { offer_status: status });
    messageStore.create({
      conversation_id: conversationId!, listing_id: currentInfo.listing_id,
      listing_title: currentInfo.listing_title, listing_image: currentInfo.listing_image, listing_price: currentInfo.listing_price,
      sender_email: user!.email, sender_name: user!.full_name,
      recipient_email: otherPerson!.email, recipient_name: otherPerson!.name,
      content: status === 'accepted' ? '✅ Proposta aceita!' : '❌ Proposta recusada.',
      read: false, created_date: new Date().toISOString(),
    } as any);
    if (status === 'accepted') {
      toast.success('Proposta aceita!', {
        description: 'Combine a entrega pelo chat e finalize a compra pelo anúncio.',
      });
    } else {
      toast.info('Proposta recusada.');
    }
  };

  if (loading || !user) {
    return (
      <div>
        <AppHeader title="Mensagens" />
        <div className="px-4 py-4">
          <ListSkeleton count={4} />
        </div>
      </div>
    );
  }

  // Conversation view
  if (conversationId && currentInfo) {
    return (
      <div className="flex flex-col h-[calc(100dvh-5rem)]">
        <div className="px-4 py-3 border-b bg-card flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate('/chat')}>
            <X className="w-4 h-4" />
          </Button>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {otherPerson?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{otherPerson?.name}</p>
            <Link to={`/anuncio/${currentInfo.listing_id}`} className="text-xs text-primary truncate block">
              Sobre: {currentInfo.listing_title}
            </Link>
          </div>
          <Button asChild size="icon" variant="ghost" className="shrink-0 h-8 w-8">
            <Link to={`/anuncio/${currentInfo.listing_id}`}>
              <ShoppingCart className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Listing card at top */}
        <Link to={`/anuncio/${currentInfo.listing_id}`} className="block px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
              <SmartImage
                src={currentInfo.listing_image}
                alt={currentInfo.listing_title}
                slot="thumb"
                fallback={<ImageIcon className="w-4 h-4 text-muted-foreground/40" />}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentInfo.listing_title}</p>
              <p className="text-xs text-primary font-bold">{formatCurrency(currentInfo.listing_price || 0)}</p>
            </div>
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
          {currentMessages.map(msg => {
            const isMe = msg.sender_email === user?.email;
            const showOffer = msg.offer_price && msg.offer_status;
            const canRespond = !isMe && msg.offer_status === 'pending';
            const showScamWarning = hasScamWord(msg.content);
            return (
              <div key={msg.id}>
                {showScamWarning && (
                  <div className="flex items-start gap-2 p-2 bg-warning/10 border border-warning-strong/30 rounded-lg mb-1 text-xs">
                    <AlertTriangle className="w-4 h-4 text-warning-strong shrink-0 mt-0.5" />
                    <p>⚠️ A HandMade recomenda que pagamentos sejam feitos apenas pela plataforma. Nunca faça transferências diretamente.</p>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-3 py-2 text-sm ${
                      isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card rounded-tl-sm shadow-sm border'
                    } ${showOffer ? 'border-2 border-warning' : ''}`}>
                      {msg.content}
                      {showOffer && msg.offer_status !== 'pending' && (
                        <Badge className={`mt-1 ${msg.offer_status === 'accepted' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                          {msg.offer_status === 'accepted' ? '✅ Aceita' : '❌ Recusada'}
                        </Badge>
                      )}
                    </div>
                    {canRespond && (
                      <div className="flex gap-2">
                        <Button size="sm" className="h-8 text-xs bg-success gap-1" onClick={() => respondOffer(msg, 'accepted')}>
                          <Check className="w-3 h-3" /> Aceitar
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => respondOffer(msg, 'rejected')}>
                          <X className="w-3 h-3" /> Recusar
                        </Button>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground px-1">{formatRelativeDate(msg.created_date)}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-3 py-3 border-t bg-card flex gap-2 items-center">
          <Button variant="outline" size="sm" className="shrink-0 h-10 gap-1 text-xs" onClick={() => setOfferDialog(true)}>
            <Tag className="w-4 h-4" /> + Proposta
          </Button>
          <Input placeholder="Escreva sua mensagem..." value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} className="flex-1 h-10" />
          <Button onClick={sendMessage} disabled={!text.trim()} size="icon" className="shrink-0 h-10 w-10">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
          <DialogContent className="max-w-sm mx-4 rounded-2xl">
            <DialogHeader><DialogTitle>Fazer uma Proposta</DialogTitle></DialogHeader>
            <div className="py-2 space-y-3">
              <p className="text-sm text-muted-foreground">
                Preço anunciado:{' '}
                <strong className="text-foreground">{formatCurrency(currentInfo?.listing_price || 0)}</strong>
              </p>
              <div>
                <label htmlFor="offer-value" className="text-sm font-medium">Sua proposta (R$)</label>
                <Input id="offer-value" type="number" step="0.01" min="0" placeholder="Ex: 850,00" value={offerValue}
                  onChange={e => setOfferValue(e.target.value)} className="mt-1 h-11" autoFocus />
                <p className="text-xs text-muted-foreground mt-1.5">
                  O vendedor pode aceitar ou recusar. Propostas aceitas valem para a compra deste anúncio.
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2">
              <Button className="w-full h-11" onClick={sendOffer} disabled={!offerValue}>Enviar Proposta</Button>
              <Button variant="outline" className="w-full" onClick={() => setOfferDialog(false)}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Inbox list
  return (
    <div>
      <AppHeader title="Mensagens" />
      <div className="px-4 py-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar nas conversas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-10" />
        </div>
        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="Nenhuma conversa ainda"
            description="Quando você contatar um vendedor ou receber um contato, a conversa aparece aqui."
            action={<Button asChild><Link to="/marketplace">Explorar anúncios</Link></Button>}
          />
        ) : (
          <div className="space-y-1">
            {conversations.filter(c => !searchQuery || c.listing_title?.toLowerCase().includes(searchQuery.toLowerCase())).map(msg => {
              const other = msg.sender_email === user?.email ? { name: msg.recipient_name } : { name: msg.sender_name };
              const hasUnread = messages.some(m => m.conversation_id === msg.conversation_id && m.recipient_email === user?.email && !m.read);
              return (
                <button key={msg.conversation_id} type="button" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted active:bg-muted transition-colors text-left"
                  onClick={() => navigate(`/chat/${msg.conversation_id}`)}>
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{other.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${hasUnread ? 'font-bold' : 'font-medium'}`}>{other.name}</p>
                      <p className="text-[10px] text-muted-foreground shrink-0">{formatRelativeDate(msg.created_date)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Sobre: {msg.listing_title}</p>
                    <p className={`text-xs truncate ${hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{msg.content}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {hasUnread && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
