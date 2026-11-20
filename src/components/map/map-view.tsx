'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property } from '@/types';

const MapViewInner = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-xl" />,
});

interface MapViewProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function MapView({ properties, center, zoom, className }: MapViewProps) {
  return <MapViewInner properties={properties} center={center} zoom={zoom} className={className} />;
}
