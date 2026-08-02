import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, Recycle, Shield, TrendingUp, Leaf, Search, Sparkles, Package, HelpCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { listingStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/categories';
import ListingCard from '@/components/listings/ListingCard';
import AppHeader from '@/components/layout/AppHeader';
import type { Listing } from '@/lib/types';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(listingStore.filter(l => l.status === 'active').slice(0, 8));
  }, []);

  const boosted = listings.filter(l => l.is_boosted && l.boost_until && new Date(l.boost_until) > new Date());
  const regular = listings.filter(l => !boosted.includes(l));
  const sorted = [...boosted, ...regular].slice(0, 8);

  return (
    <div>
      <AppHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-warning/5 px-4 pt-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            <Leaf className="w-3 h-3 mr-1" /> Economia Circular
          </Badge>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">
            Transforme resíduos em{' '}
            <span className="text-primary">oportunidades</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Tem material sobrando? Venda aqui. Precisa de material? Compre mais barato.
          </p>
          <div className="flex gap-3 mt-5">
            <Button asChild className="w-full bg-primary gap-2 h-12 text-[15px]">
              <Link to="/marketplace" className="flex-1">
                <Search className="w-4 h-4" /> Explorar
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2 h-12 text-[15px]">
              <Link to="/criar-anuncio" className="flex-1">
                Anunciar <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <Link to="/como-funciona" className="block mt-3 text-center">
            <span className="text-xs text-primary font-medium">Como funciona? →</span>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card px-4 py-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: '10K+', label: 'Anúncios' },
            { value: '5K+', label: 'Usuários' },
            { value: '98%', label: 'Satisfação' },
            { value: '150t', label: 'Reciclado' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-5">
        <h2 className="text-lg font-bold mb-3">Categorias</h2>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const CatIcon = cat.icon;
            return (
              <Link key={key} to={`/marketplace?category=${key}`}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-medium text-center leading-tight">{cat.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* O que você quer fazer hoje? */}
      <section className="px-4 pb-5">
        <h2 className="text-lg font-bold mb-3">O que você quer fazer hoje?</h2>
        <div className="space-y-3">
          {[
            { icon: Package, title: 'Quero vender meu material', desc: 'Publique grátis em 3 minutos. Sem taxa até vender.', btn: 'Publicar anúncio', link: '/criar-anuncio', bg: 'bg-success/5 border-success/20' },
            { icon: Search, title: 'Quero comprar material', desc: 'Encontre material de qualidade por preço justo perto de você.', btn: 'Ver anúncios', link: '/marketplace', bg: 'bg-info/5 border-info/20' },
            { icon: HelpCircle, title: 'Quero entender como funciona', desc: 'Veja como a HandMade protege sua negociação do início ao fim.', btn: 'Como funciona', link: '/como-funciona', bg: 'bg-muted border-border' },
          ].map((item, i) => (
            <Card key={i} className={`p-4 ${item.bg}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-sm">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  <Button asChild size="sm" variant="outline" className="mt-2 h-8 text-xs">
                    <Link to={item.link}>{item.btn}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      {sorted.length > 0 && (
        <section className="px-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Recentes</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs h-7">
              <Link to="/marketplace">Ver todos <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-card border-y px-4 py-6">
        <h2 className="text-lg font-bold text-center mb-4">Como Funciona</h2>
        <div className="space-y-3">
          {[
            { icon: Recycle, title: 'Anuncie Grátis', desc: 'Tire fotos do seu material e publique em 3 minutos.' },
            { icon: Shield, title: 'Pagamento Protegido', desc: 'O valor fica retido até você confirmar o recebimento.' },
            { icon: TrendingUp, title: 'Receba o Repasse', desc: 'Após a confirmação, o valor cai direto na sua conta, com recibo.' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Boost CTA */}
      <section className="px-4 py-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-deep text-primary-foreground p-5">
          <Sparkles className="absolute top-3 right-3 w-16 h-16 opacity-10" />
          <h2 className="text-lg font-bold mb-1">Impulsione seu anúncio</h2>
          <p className="text-xs mb-4">Destaque seu anúncio e venda mais rápido. A partir de R$ 9,90.</p>
          <Button asChild variant="secondary" className="gap-2 w-full">
            <Link to="/meus-anuncios">
              <Sparkles className="w-4 h-4" /> Impulsionar Agora
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
