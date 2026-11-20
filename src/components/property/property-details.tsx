'use client';

import { useState } from 'react';
import {
  Bed, Bath, Maximize, MapPin, Building2, Car,
  PawPrint, Train, Sofa, Calendar, Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/types';

interface PropertyDetailsProps {
  property: Property;
  agent?: { full_name: string; agency_name: string | null } | null;
}

export function PropertyDetails({ property, agent }: PropertyDetailsProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRent = property.purpose === 'rent';

  return (
    <div className="space-y-6">
      {/* Title & Price */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={isRent ? 'bg-cyan/90 text-white' : 'bg-gold/90 text-background'}>
            For {isRent ? 'Rent' : 'Sale'}
          </Badge>
          <Badge variant="secondary">{property.type}</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{property.title}</h1>
        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{property.area}, Dubai</span>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold text-gradient">
            {formatPrice(property.price_aed)}
          </span>
          {isRent && <span className="text-muted-foreground ml-1">/year</span>}
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Bed} label="Bedrooms" value={String(property.bedrooms)} />
        <StatCard icon={Bath} label="Bathrooms" value={String(property.bathrooms)} />
        <StatCard icon={Maximize} label="Size" value={`${property.size_sqft.toLocaleString()} ft²`} />
        <StatCard icon={Car} label="Parking" value={`${property.parking} spots`} />
      </div>

      {/* Features */}
      <div className="glass-card rounded-xl p-4">
        <h2 className="font-semibold mb-3">Features</h2>
        <div className="flex flex-wrap gap-2">
          {property.furnished && (
            <FeatureBadge icon={Sofa} label="Furnished" />
          )}
          {property.near_metro && (
            <FeatureBadge icon={Train} label="Near Metro" />
          )}
          {property.pet_friendly && (
            <FeatureBadge icon={PawPrint} label="Pet Friendly" />
          )}
          {property.amenities?.map((amenity) => (
            <FeatureBadge key={amenity} icon={Tag} label={amenity} />
          ))}
        </div>
      </div>

      {/* Description with language toggle */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Description</h2>
          <div className="flex gap-1">
            <Button
              variant={lang === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLang('en')}
              className="h-7 text-xs rounded-lg"
            >
              English
            </Button>
            <Button
              variant={lang === 'ar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLang('ar')}
              className="h-7 text-xs rounded-lg"
            >
              العربية
            </Button>
          </div>
        </div>
        <p
          className={`text-sm text-muted-foreground leading-relaxed ${
            lang === 'ar' ? 'text-right font-arabic' : ''
          }`}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {lang === 'en' ? property.description_en : property.description_ar}
        </p>
      </div>

      {/* Agent info */}
      {agent && (
        <div className="glass-card rounded-xl p-4">
          <h2 className="font-semibold mb-3">Listed By</h2>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center">
              <Building2 className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="font-medium text-sm">{agent.full_name}</p>
              {agent.agency_name && (
                <p className="text-xs text-muted-foreground">{agent.agency_name}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Listed {new Date(property.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
