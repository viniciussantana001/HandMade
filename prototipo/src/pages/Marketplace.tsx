import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import { listingStore } from '@/lib/store';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from '@/components/common/EmptyState';
import AppHeader from '@/components/layout/AppHeader';
import { CATEGORIES, CONDITIONS } from '@/lib/categories';
import type { Listing } from '@/lib/types';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const listings = listingStore.filter(l => l.status === 'active' && !l.is_flagged);

  const updateParams = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val && val !== 'all') params.set(key, val);
    else params.delete(key);
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    let result = [...listings];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.title?.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term) ||
        l.location?.toLowerCase().includes(term)
      );
    }
    if (category !== 'all') result = result.filter(l => l.category === category);
    if (condition !== 'all') result = result.filter(l => l.condition === condition);

    const boosted = result.filter(l => l.is_boosted && l.boost_until && new Date(l.boost_until) > new Date());
    const regular = result.filter(l => !boosted.includes(l));

    if (sortBy === 'price_asc') regular.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price_desc') regular.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'views') regular.sort((a, b) => (b.views || 0) - (a.views || 0));
    return [...boosted, ...regular];
  }, [listings, searchTerm, category, condition, sortBy]);

  const activeFilters = [category !== 'all', condition !== 'all', searchTerm].filter(Boolean).length;
  const suggestions = ['Madeira', 'Ferro', 'Plástico', 'Eletrônicos', 'Pedras'];

  return (
    <div>
      <AppHeader title="Buscar" />
      <div className="px-3 py-3">
        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Busque por material, cidade ou palavra-chave"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); updateParams('q', e.target.value); }}
              className="pl-9 pr-11 h-[52px] text-[15px]"
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Limpar busca"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full active:bg-muted transition-colors"
                onClick={() => { setSearchTerm(''); updateParams('q', ''); }}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-[52px] w-[52px] shrink-0 relative"
            onClick={() => setShowFilters(!showFilters)}
            aria-label={`${showFilters ? 'Ocultar' : 'Mostrar'} filtros${activeFilters > 0 ? ` (${activeFilters} ativos)` : ''}`}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{activeFilters}</span>
            )}
          </Button>
        </div>

        {/* Category scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          <button type="button" onClick={() => { setCategory('all'); updateParams('category', ''); }}
            aria-pressed={category === 'all'}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
            Todos
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const CategoryIcon = cat.icon;
            return (
              <button key={key} type="button" onClick={() => { setCategory(key); updateParams('category', key); }}
                aria-pressed={category === key}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors inline-flex items-center gap-1.5 ${category === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                <CategoryIcon className="w-3.5 h-3.5" /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-3 bg-card rounded-xl border mb-3 space-y-3">
            <div>
              <p className="text-xs font-semibold mb-1">Condição — em que estado está o material?</p>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Todas condições" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas condições</SelectItem>
                  {Object.entries(CONDITIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Ordenar por</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="price_asc">Menor preço</SelectItem>
                  <SelectItem value="price_desc">Maior preço</SelectItem>
                  <SelectItem value="views">Mais vistos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => { setCategory('all'); setCondition('all'); setSearchTerm(''); }}>
                <X className="w-3 h-3" /> Limpar tudo
              </Button>
              <Button size="sm" className="h-8 text-xs bg-primary" onClick={() => setShowFilters(false)}>
                Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
              aria-label="Ver em grade"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
              aria-label="Ver em lista"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <h3 className="font-bold text-lg">Nenhum resultado{searchTerm ? ` para "${searchTerm}"` : ''}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Tente buscar por:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map(s => (
                <button key={s} type="button" onClick={() => setSearchTerm(s)} className="px-3 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium transition-colors active:bg-primary/20">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
