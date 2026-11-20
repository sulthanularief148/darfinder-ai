'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Plus, Loader2, MapPin, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/types';

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/properties?limit=50');
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Listings</h1>
          {!loading && (
            <Badge variant="secondary" className="text-xs">
              {properties.length}
            </Badge>
          )}
        </div>
        <Link href="/agent/properties/new">
          <Button className="btn-gold rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">No listings yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first property listing with AI assistance.
          </p>
          <Link href="/agent/properties/new">
            <Button className="btn-gold rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/properties/${property.id}`}
                className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors block"
              >
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{property.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold text-primary">
                    AED {formatPrice(property.price_aed)}
                  </div>
                  <Badge
                    className={`text-[10px] mt-1 ${
                      property.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : property.status === 'rented'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {property.status}
                  </Badge>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
