'use client';

import { MapView } from '@/components/map/map-view';
import type { Property } from '@/types';

interface PropertyMapProps {
  property: Property;
}

export function PropertyMap({ property }: PropertyMapProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="h-[300px]">
        <MapView
          properties={[property]}
          center={[property.latitude, property.longitude]}
          zoom={14}
        />
      </div>
    </div>
  );
}
