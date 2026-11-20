'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/types';

import 'leaflet/dist/leaflet.css';

function createPriceIcon(price: string, purpose: string) {
  const color = purpose === 'rent' ? '#06B6D4' : '#D4A574';
  return L.divIcon({
    className: 'map-price-marker',
    html: `<div style="background:${color};color:#070B14;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${price}</div>`,
    iconSize: [80, 28],
    iconAnchor: [40, 28],
  });
}

interface MapViewInnerProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapViewInner({
  properties,
  center = [25.2048, 55.2708],
  zoom = 11,
  className = '',
}: MapViewInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`leaflet-container rounded-xl ${className}`}
      style={{ height: '100%', width: '100%', minHeight: 400 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={createPriceIcon(
            formatPrice(property.price_aed),
            property.purpose
          )}
        >
          <Popup>
            <Link
              href={`/properties/${property.id}`}
              className="block text-sm font-medium hover:text-primary"
            >
              {property.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              {property.bedrooms} bed · {property.bathrooms} bath · {property.size_sqft.toLocaleString()} ft²
            </p>
            <p className="text-sm font-bold mt-1">
              {formatPrice(property.price_aed)}
              {property.purpose === 'rent' && '/yr'}
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
