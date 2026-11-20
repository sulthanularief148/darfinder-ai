'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize, MapPin, PawPrint, Train, Sofa } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaceholderImage } from '@/components/layout/placeholder-image';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const isRent = property.purpose === 'rent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/properties/${property.id}`} className="block group">
        <div className="glass-card-hover rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="property-image-container aspect-[4/3] relative overflow-hidden">
            <PlaceholderImage
              index={index}
              className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={isRent ? 'bg-cyan/90 text-white' : 'bg-gold/90 text-background'}>
                {isRent ? 'Rent' : 'Buy'}
              </Badge>
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/60">
                {property.type}
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <div className="price-badge">
                {formatPrice(property.price_aed)}
                {isRent && <span className="text-xs opacity-80">/yr</span>}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate">{property.area}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {property.size_sqft.toLocaleString()} ft²
              </span>
            </div>

            {/* Feature badges */}
            <div className="flex items-center gap-2 mt-3">
              {property.furnished && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <Sofa className="h-3 w-3" /> Furnished
                </span>
              )}
              {property.near_metro && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <Train className="h-3 w-3" /> Metro
                </span>
              )}
              {property.pet_friendly && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <PawPrint className="h-3 w-3" /> Pets
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
