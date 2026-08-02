import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/layout/AppHeader';
import { toast } from 'sonner';

const FAQS = [
  { q: 'Como publicar um anúncio', a: 'Toque no botão "Vender" na barra inferior, tire fotos do material, preencha as informações e publique. É grátis!' },
  { q: 'Como comprar com segurança', a: 'Todos os pagamentos ficam retidos pela HandMade até você confirmar que recebeu o material. Se tiver problema, seu dinheiro é devolvido.' },
  { q: 'O que é pagamento protegido?', a: 'O dinheiro fica guardado pela HandMade. O vendedor só recebe depois que você confirmar que está tudo certo.' },
  { q: 'Como funciona o chat?', a: 'Ao clicar em "Conversar com Vendedor" no anúncio, uma conversa é criada. Todas as conversas ficam na aba Mensagens.' },
  { q: 'Como recebo o dinheiro das minhas vendas?', a: 'O pagamento é direto: quando o comprador confirma o recebimento, o valor é repassado para a sua conta pelo mesmo método usado na compra, já com a taxa de serviço descontada. Não existe carteira nem saque a fazer.' },
  { q: 'O que fazer se o produto não chegou?', a: 'Você pode abrir uma disputa pelo pedido. Nossa equipe analisa e, se o produto não chegou, devolvemos seu dinheiro.' },
  { q: 'Preciso sacar meu saldo?', a: 'Não. A HandMade não tem carteira nem saldo acumulado. Cada venda gera um repasse direto para a conta ou chave PIX cadastrada no seu perfil, em até 3 dias úteis após a confirmação de entrega. Todos os repasses ficam registrados em Perfil > Meus pagamentos.' },
  { q: 'Como cancelar minha assinatura?', a: 'Sua assinatura não renova automaticamente. Quando vencer, volta para o plano gratuito.' },
  { q: 'Como excluir minha conta?', a: 'Vá em Perfil > Configurações > Excluir conta. Sua conta será removida em 30 dias conforme a LGPD.' },
  { q: 'Meus dados estão protegidos?', a: 'Sim! Seguimos a LGPD. Seus dados pessoais como CPF nunca são exibidos publicamente.' },
];

export default function Help() {
  const [search, setSearch] = useState('');
  const filtered = search ? FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : FAQS;

  return (
    <div>
      <AppHeader showBack title="Central de Ajuda" />
      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="O que você precisa saber?" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-12" />
        </div>
        <Accordion type="single" collapsible>
          {filtered.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Card className="p-4 mt-6 text-center">
          <p className="font-semibold text-sm mb-1">Não encontrou o que precisava?</p>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1 justify-center"><Mail className="w-3.5 h-3.5" /> suporte@handmade.com.br</p>
          <Button variant="outline" className="w-full" onClick={() => toast.success('Mensagem enviada ao suporte!')}>Falar com suporte</Button>
        </Card>
      </div>
    </div>
  );
}
