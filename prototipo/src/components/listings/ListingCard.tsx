import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Sparkles, Heart } from 'lucide-react';
import { CATEGORIES, LISTING_TYPES } from '@/lib/categories';
import { formatRelativeDate, formatCurrency } from '@/lib/formatters';
import SmartImage from '@/components/common/SmartImage';
import type { Listing } from '@/lib/types';

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export default function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
  const listingType = LISTING_TYPES[listing.listing_type] || LISTING_TYPES.sale;
  const isBoosted = listing.is_boosted && listing.boost_until && new Date(listing.boost_until) > new Date();

  return (
    <Link to={`/anuncio/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all animate-fade-in group" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          <SmartImage
            src={listing.images?.[0]}
            alt={listing.title}
            slot="card"
            eager={index < 4}
            imgClassName="group-hover:scale-105 transition-transform duration-300"
            fallback={<cat.icon className="w-10 h-10 text-muted-foreground/20" />}
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className={`${listingType.color} border-0 text-[10px] px-1.5 py-0`}>
              {listingType.emoji} {listingType.label}
            </Badge>
          </div>
          {isBoosted && (
            <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground text-[10px] gap-0.5 px-1.5 py-0 border-0">
              <Sparkles className="w-2.5 h-2.5" /> Destaque
            </Badge>
          )}
        </div>
        <div className="p-2.5">
          <p className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{listing.title}</p>
          <p className="text-primary font-bold text-base mt-1">
            {listing.listing_type === 'donation' ? 'Grátis' :
             listing.price === 0 ? 'A combinar' :
             formatCurrency(listing.price)}
          </p>
          <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="w-3 h-3 shrink-0" />{listing.location || 'N/A'}
            </span>
            <span className="flex items-center gap-0.5 shrink-0">
              <Eye className="w-3 h-3" />{listing.views || 0}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeDate(listing.created_date)}</p>
        </div>
      </Card>
    </Link>
  );
}
