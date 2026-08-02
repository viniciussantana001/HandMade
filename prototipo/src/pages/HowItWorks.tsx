import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Recycle, Shield, TrendingUp, Camera, CreditCard, Truck, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '@/components/layout/AppHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HowItWorks() {
  const sellerSteps = [
    { icon: Camera, title: '1. Tire fotos do material', desc: 'Tire fotos do seu material com o celular. Fotos com boa iluminação vendem mais rápido.' },
    { icon: CreditCard, title: '2. Receba o pagamento', desc: 'Quando alguém comprar, o pagamento fica guardado na HandMade como garantia.' },
    { icon: Truck, title: '3. Envie o material', desc: 'Envie o material e coloque o código de rastreamento.' },
    { icon: DollarSign, title: '4. Receba o repasse direto', desc: 'Depois que o comprador confirmar o recebimento, o valor cai direto na sua conta ou chave PIX, já com a taxa de serviço descontada. Sem carteira, sem saque.' },
  ];
  const buyerSteps = [
    { icon: Recycle, title: '1. Encontre o que precisa', desc: 'Navegue pelos anúncios e encontre materiais que você precisa.' },
    { icon: CreditCard, title: '2. Compre com segurança', desc: 'Pague via PIX, cartão ou boleto. Seu dinheiro fica protegido.' },
    { icon: Truck, title: '3. Acompanhe a entrega', desc: 'Receba o código de rastreamento e acompanhe.' },
    { icon: CheckCircle, title: '4. Confirme o recebimento', desc: 'Confirme que recebeu e o vendedor recebe o pagamento.' },
  ];
  const faqs = [
    { q: 'Preciso pagar para anunciar?', a: 'Não! Anunciar é 100% grátis. Você só paga uma pequena taxa quando vender.' },
    { q: 'Como funciona o pagamento protegido?', a: 'Quando você compra, o dinheiro fica guardado na HandMade. O vendedor só recebe depois que você confirmar que recebeu o material em boas condições.' },
    { q: 'E se o produto não chegar?', a: 'Você pode abrir uma disputa e nossa equipe vai analisar. Se o produto não chegou, seu dinheiro é devolvido.' },
    { q: 'Como recebo o dinheiro das minhas vendas?', a: 'O repasse é direto para a conta ou chave PIX do seu perfil. A HandMade não guarda saldo: assim que o comprador confirma o recebimento, o valor da venda menos a taxa de serviço é enviado para você.' },
    { q: 'Quanto tempo demora o repasse?', a: 'Até 3 dias úteis após a confirmação de entrega. Você acompanha cada repasse, com recibo, em Perfil > Meus pagamentos.' },
  ];

  return (
    <div>
      <AppHeader showBack title="Como Funciona" />
      <div className="px-4 py-6">
        <Card className="p-5 bg-primary/5 border-primary/20 mb-6">
          <div className="flex items-center gap-3"><Shield className="w-10 h-10 text-primary shrink-0" /><div><h2 className="font-bold text-lg">Pagamento Protegido</h2><p className="text-sm text-muted-foreground mt-1">Seu pagamento fica retido até você confirmar o recebimento. Se houver problema, seu dinheiro é devolvido.</p></div></div>
        </Card>
        <h2 className="text-xl font-bold text-center mb-4">Para quem Vende</h2>
        <div className="space-y-3 mb-8">
          {sellerSteps.map((s, i) => (<Card key={i} className="p-4 flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><s.icon className="w-5 h-5 text-primary" /></div><div><h3 className="font-semibold text-sm">{s.title}</h3><p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p></div></Card>))}
        </div>
        <h2 className="text-xl font-bold text-center mb-4">Para quem Compra</h2>
        <div className="space-y-3 mb-8">
          {buyerSteps.map((s, i) => (<Card key={i} className="p-4 flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0"><s.icon className="w-5 h-5 text-info" /></div><div><h3 className="font-semibold text-sm">{s.title}</h3><p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p></div></Card>))}
        </div>
        <h2 className="text-xl font-bold text-center mb-4">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="mb-6">
          {faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`}><AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>))}
        </Accordion>
        <Button asChild className="w-full h-12 gap-2"><Link to="/criar-anuncio" className="block">Começar a Anunciar <ArrowRight className="w-4 h-4" /></Link></Button>
      </div>
    </div>
  );
}
