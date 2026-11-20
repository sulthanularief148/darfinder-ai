export { cn } from 'cn';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AE').format(price);
}

export function formatPriceLabel(price: number, purpose: 'rent' | 'sale'): string {
  const formatted = formatPrice(price);
  return purpose === 'rent' ? `AED ${formatted} / year` : `AED ${formatted}`;
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat('en-AE').format(sqft)} sq ft`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.RATE_LIMIT_SALT || 'darfinder'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
