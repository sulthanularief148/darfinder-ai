/**
 * Seed script: creates a demo agent + 80 fictional properties across 10 Dubai areas.
 *
 * Run with: npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Uses the service role key to bypass RLS for seeding.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Demo Agent ───

const DEMO_EMAIL = process.env.DEMO_AGENT_EMAIL || 'demo@darfinder.ai';
const DEMO_PASSWORD = process.env.DEMO_AGENT_PASSWORD || 'demo-agent-2024';

// ─── Area coordinates (center of each neighborhood) ───

const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  'Dubai Marina': { lat: 25.0805, lng: 55.1403 },
  'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
  'Business Bay': { lat: 25.1851, lng: 55.2719 },
  'JVC': { lat: 25.0657, lng: 55.2094 },
  'JLT': { lat: 25.0772, lng: 55.1535 },
  'Al Barsha': { lat: 25.1134, lng: 55.2006 },
  'Deira': { lat: 25.2697, lng: 55.3094 },
  'Dubai Hills': { lat: 25.1400, lng: 55.2400 },
  'Arabian Ranches': { lat: 25.0590, lng: 55.2670 },
  'Dubai Silicon Oasis': { lat: 25.1234, lng: 55.3781 },
};

function jitter(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

// ─── Property templates ───

type Purpose = 'rent' | 'sale';
type PType = 'apartment' | 'villa' | 'townhouse';

interface PropertySeed {
  title: string;
  type: PType;
  purpose: Purpose;
  price_aed: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  area: string;
  furnished: boolean;
  pet_friendly: boolean;
  near_metro: boolean;
  parking: number;
  amenities: string[];
  description_en: string;
  description_ar: string;
}

const AMENITIES_POOL = [
  'Pool', 'Gym', 'Balcony', 'Garden', 'Concierge', 'Sauna', 'Kids Play Area',
  'BBQ Area', 'Security', 'Covered Parking', 'Maid Room', 'Walk-in Closet',
  'Smart Home', 'Private Pool', 'Sea View', 'City View', 'Canal View',
  'Community Center', 'Jogging Track', 'Tennis Court',
];

function pickAmenities(count: number): string[] {
  const shuffled = [...AMENITIES_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateProperties(): PropertySeed[] {
  const properties: PropertySeed[] = [];

  // Template configs per area — mix of types and price ranges
  const templates: Array<{
    area: string;
    configs: Array<{
      type: PType;
      purpose: Purpose;
      bedrooms: number;
      bathrooms: number;
      size_sqft: number;
      price_aed: number;
      furnished: boolean;
      near_metro: boolean;
      pet_friendly: boolean;
    }>;
  }> = [
    {
      area: 'Dubai Marina',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 450, price_aed: 55000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 750, price_aed: 85000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1200, price_aed: 130000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 800, price_aed: 1500000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1300, price_aed: 2800000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 1800, price_aed: 200000, furnished: true, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2000, price_aed: 4500000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 650, price_aed: 70000, furnished: false, near_metro: true, pet_friendly: false },
      ],
    },
    {
      area: 'Downtown Dubai',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 500, price_aed: 65000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 850, price_aed: 110000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1400, price_aed: 180000, furnished: true, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1500, price_aed: 3500000, furnished: true, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2200, price_aed: 6000000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2000, price_aed: 250000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 900, price_aed: 2200000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 3500, price_aed: 12000000, furnished: true, near_metro: true, pet_friendly: true },
      ],
    },
    {
      area: 'Business Bay',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 400, price_aed: 45000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 700, price_aed: 75000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1100, price_aed: 110000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 750, price_aed: 1200000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1200, price_aed: 2200000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1600, price_aed: 160000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 1800, price_aed: 3200000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1000, price_aed: 95000, furnished: false, near_metro: true, pet_friendly: false },
      ],
    },
    {
      area: 'JVC',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 380, price_aed: 32000, furnished: true, near_metro: false, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 650, price_aed: 50000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1000, price_aed: 75000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 700, price_aed: 650000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1100, price_aed: 950000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2200, price_aed: 120000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2400, price_aed: 1800000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 950, price_aed: 65000, furnished: true, near_metro: true, pet_friendly: true },
      ],
    },
    {
      area: 'JLT',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 420, price_aed: 42000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 700, price_aed: 65000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1050, price_aed: 90000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 750, price_aed: 900000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1150, price_aed: 1400000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1500, price_aed: 120000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 1700, price_aed: 2100000, furnished: false, near_metro: true, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 600, price_aed: 55000, furnished: true, near_metro: true, pet_friendly: false },
      ],
    },
    {
      area: 'Al Barsha',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 700, price_aed: 55000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1000, price_aed: 80000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'villa', purpose: 'rent', bedrooms: 4, bathrooms: 4, size_sqft: 3500, price_aed: 180000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 5, bathrooms: 5, size_sqft: 5000, price_aed: 5500000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1100, price_aed: 1100000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'villa', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2800, price_aed: 150000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1400, price_aed: 110000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'villa', purpose: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 4000, price_aed: 4200000, furnished: false, near_metro: false, pet_friendly: true },
      ],
    },
    {
      area: 'Deira',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 350, price_aed: 28000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 600, price_aed: 42000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 900, price_aed: 60000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 650, price_aed: 500000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 950, price_aed: 800000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1300, price_aed: 80000, furnished: false, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 550, price_aed: 38000, furnished: true, near_metro: true, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 2, size_sqft: 1400, price_aed: 1200000, furnished: false, near_metro: true, pet_friendly: false },
      ],
    },
    {
      area: 'Dubai Hills',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 750, price_aed: 70000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1200, price_aed: 110000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'rent', bedrooms: 4, bathrooms: 4, size_sqft: 3200, price_aed: 220000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 3500, price_aed: 5000000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 5, bathrooms: 5, size_sqft: 5500, price_aed: 8500000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2400, price_aed: 170000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2500, price_aed: 3200000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 1800, price_aed: 3000000, furnished: false, near_metro: false, pet_friendly: true },
      ],
    },
    {
      area: 'Arabian Ranches',
      configs: [
        { type: 'villa', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2800, price_aed: 180000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'rent', bedrooms: 4, bathrooms: 4, size_sqft: 3500, price_aed: 250000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 3000, price_aed: 3800000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 4, bathrooms: 5, size_sqft: 4200, price_aed: 5500000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'sale', bedrooms: 5, bathrooms: 6, size_sqft: 6000, price_aed: 9000000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2200, price_aed: 150000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2300, price_aed: 2800000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'villa', purpose: 'rent', bedrooms: 5, bathrooms: 5, size_sqft: 5500, price_aed: 350000, furnished: true, near_metro: false, pet_friendly: true },
      ],
    },
    {
      area: 'Dubai Silicon Oasis',
      configs: [
        { type: 'apartment', purpose: 'rent', bedrooms: 0, bathrooms: 1, size_sqft: 400, price_aed: 25000, furnished: true, near_metro: false, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 650, price_aed: 40000, furnished: false, near_metro: false, pet_friendly: false },
        { type: 'apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 950, price_aed: 55000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'sale', bedrooms: 1, bathrooms: 1, size_sqft: 700, price_aed: 450000, furnished: false, near_metro: false, pet_friendly: false },
        { type: 'apartment', purpose: 'sale', bedrooms: 2, bathrooms: 2, size_sqft: 1000, price_aed: 700000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 2000, price_aed: 90000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'townhouse', purpose: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 2100, price_aed: 1500000, furnished: false, near_metro: false, pet_friendly: true },
        { type: 'apartment', purpose: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1300, price_aed: 70000, furnished: false, near_metro: false, pet_friendly: true },
      ],
    },
  ];

  for (const { area, configs } of templates) {
    const coords = AREA_COORDS[area];
    for (const c of configs) {
      const bedroomLabel = c.bedrooms === 0 ? 'Studio' : `${c.bedrooms} BR`;
      const typeLabel = c.type.charAt(0).toUpperCase() + c.type.slice(1);
      const purposeLabel = c.purpose === 'rent' ? 'for Rent' : 'for Sale';

      const title = `${bedroomLabel} ${typeLabel} ${purposeLabel} in ${area}`;

      const descEn = generateDescriptionEn(c, area);
      const descAr = generateDescriptionAr(c, area);

      properties.push({
        title,
        type: c.type,
        purpose: c.purpose,
        price_aed: c.price_aed,
        bedrooms: c.bedrooms,
        bathrooms: c.bathrooms,
        size_sqft: c.size_sqft,
        area,
        furnished: c.furnished,
        pet_friendly: c.pet_friendly,
        near_metro: c.near_metro,
        parking: c.type === 'villa' ? 2 : c.bedrooms >= 2 ? 1 : 0,
        amenities: pickAmenities(c.type === 'villa' ? 6 : 4),
        description_en: descEn,
        description_ar: descAr,
      });
    }
  }

  return properties;
}

function generateDescriptionEn(c: { type: PType; purpose: Purpose; bedrooms: number; bathrooms: number; size_sqft: number; furnished: boolean; near_metro: boolean; pet_friendly: boolean }, area: string): string {
  const bed = c.bedrooms === 0 ? 'studio' : `${c.bedrooms}-bedroom`;
  const lines = [
    `Spacious ${bed} ${c.type} located in the heart of ${area}.`,
    `This ${c.size_sqft.toLocaleString()} sq ft property features ${c.bathrooms} bathroom${c.bathrooms > 1 ? 's' : ''} and modern finishes throughout.`,
  ];
  if (c.furnished) lines.push('Comes fully furnished with high-quality furniture and appliances.');
  if (c.near_metro) lines.push('Walking distance to the nearest metro station — perfect for commuters.');
  if (c.pet_friendly) lines.push('Pet-friendly community welcoming furry family members.');
  lines.push(`Ideal for ${c.bedrooms >= 3 ? 'families looking for ample living space' : c.bedrooms === 0 ? 'young professionals or investors' : 'couples or small families'}.`);
  if (c.purpose === 'rent') lines.push('Available for immediate move-in. Flexible payment plans offered.');
  else lines.push('Excellent investment opportunity with strong rental yields in the area.');
  return lines.join(' ');
}

function generateDescriptionAr(c: { type: PType; bedrooms: number; size_sqft: number; furnished: boolean }, area: string): string {
  const bed = c.bedrooms === 0 ? 'استوديو' : `${c.bedrooms} غرف نوم`;
  const typeAr = c.type === 'apartment' ? 'شقة' : c.type === 'villa' ? 'فيلا' : 'تاون هاوس';
  const lines = [
    `${typeAr} ${bed} واسعة في قلب ${area}.`,
    `تبلغ مساحتها ${c.size_sqft.toLocaleString()} قدم مربع مع تشطيبات عصرية.`,
  ];
  if (c.furnished) lines.push('مفروشة بالكامل بأثاث عالي الجودة.');
  lines.push('فرصة مثالية للسكن أو الاستثمار.');
  return lines.join(' ');
}

// ─── Main seeding function ───

async function seed() {
  console.log('🌱 Starting DarFinder seed...\n');

  // 1. Create demo agent auth user
  console.log('1. Creating demo agent auth user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('   Demo user already exists, fetching...');
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users.find(u => u.email === DEMO_EMAIL);
      if (!existing) { console.error('Could not find existing demo user'); process.exit(1); }
      var agentId = existing.id;
    } else {
      console.error('Auth error:', authError.message);
      process.exit(1);
    }
  } else {
    var agentId = authData.user.id;
  }
  console.log(`   Agent ID: ${agentId}`);

  // 2. Create agent profile
  console.log('2. Creating agent profile...');
  const { error: profileError } = await supabase
    .from('agents')
    .upsert({
      id: agentId,
      full_name: 'Sarah Al-Demo',
      email: DEMO_EMAIL,
      phone: '+971 50 123 4567',
      agency_name: 'DarFinder Properties',
      bio: 'Experienced Dubai real estate agent specializing in Marina, Downtown, and JVC properties. Helping clients find their dream homes since 2018.',
      is_demo: true,
    });

  if (profileError) {
    console.error('Profile error:', profileError.message);
    process.exit(1);
  }
  console.log('   ✅ Agent profile created');

  // 3. Generate and insert properties
  console.log('3. Generating 80 properties...');
  const properties = generateProperties();

  // Use placeholder images — numbered 1-10, cycling through
  const propertyRows = properties.map((p, i) => ({
    agent_id: agentId,
    title: p.title,
    type: p.type,
    purpose: p.purpose,
    price_aed: p.price_aed,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    size_sqft: p.size_sqft,
    area: p.area,
    latitude: jitter(AREA_COORDS[p.area].lat, 0.015),
    longitude: jitter(AREA_COORDS[p.area].lng, 0.015),
    furnished: p.furnished,
    pet_friendly: p.pet_friendly,
    near_metro: p.near_metro,
    parking: p.parking,
    amenities: p.amenities,
    description_en: p.description_en,
    description_ar: p.description_ar,
    photos: [`/placeholder/property-${(i % 10) + 1}.jpg`],
    status: 'active' as const,
  }));

  const { error: insertError } = await supabase
    .from('properties')
    .insert(propertyRows);

  if (insertError) {
    console.error('Insert error:', insertError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${propertyRows.length} properties inserted`);

  // 4. Summary
  console.log('\n✨ Seed complete!\n');
  console.log('Demo agent login:');
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log('\nProperty breakdown:');
  const byArea = propertyRows.reduce((acc, p) => {
    acc[p.area] = (acc[p.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [area, count] of Object.entries(byArea)) {
    console.log(`  ${area}: ${count} properties`);
  }
}

seed().catch(console.error);
