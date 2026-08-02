import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { favoriteStore, listingStore, useStoreVersion } from '@/lib/store';
import { useRequireAuth } from '@/lib/session';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from '@/components/common/EmptyState';
import AppHeader from '@/components/layout/AppHeader';
import { ListingGridSkeleton } from '@/components/common/StateViews';
import type { Listing } from '@/lib/types';

/**
 * Favoritos (5.0).
 *
 * Passou a usar `useRequireAuth` + `useStoreVersion`: ao desfavoritar um item em
 * outra tela a lista se atualiza sozinha, e durante a restauração da sessão
 * aparece um esqueleto em lugar do `return null` da versão 4.0.
 */
export default function Favorites() {
  const { user, loading } = useRequireAuth();
  useStoreVersion();

  const favs = user ? favoriteStore.filter(f => f.user_email === user.email) : [];
  const listings = favs
    .map(f => listingStore.get(f.listing_id))
    .filter((l): l is Listing => Boolean(l));

  return (
    <div>
      <AppHeader showBack title="Favoritos" />
      <div className="px-4 py-4">
        {loading || !user ? (
          <ListingGridSkeleton count={4} />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-12 h-12" />}
            title="Nenhum favorito"
            description="Salve anúncios que você gostou para encontrá-los facilmente depois."
            action={
              <Button asChild>
                <Link to="/marketplace">Explorar anúncios</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
