'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  Brain,
  MapPin,
  ArrowRight,
  Zap,
  Globe,
  Star,
  Search,
  Key,
  Sparkles,
  Camera,
  Bell,
  BarChart3,
  Quote,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/search-bar';
import { PropertyCard } from '@/components/property/property-card';
import { DUBAI_AREAS } from '@/types';
import type { Property } from '@/types';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

/* ─── Floating particles (deterministic to avoid hydration mismatch) ─── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return Math.round((x - Math.floor(x)) * 10000) / 10000;
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${seededRandom(i * 2) * 100}%`,
            top: `${seededRandom(i * 2 + 1) * 100}%`,
          }}
          animate={{
            y: [0, -120 - seededRandom(i * 3) * 200],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + seededRandom(i * 4) * 8,
            repeat: Infinity,
            delay: seededRandom(i * 5) * 6,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Star rating ─── */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
      ))}
    </div>
  );
}

/* ─── Data ─── */
const stats = [
  { label: 'Premium Properties', value: 80, suffix: '+', icon: Building2 },
  { label: 'Dubai Neighborhoods', value: 10, suffix: '', icon: MapPin },
  { label: 'AI Accuracy', value: 98, suffix: '%', icon: Brain },
  { label: 'Languages', value: 2, suffix: '', display: 'EN/AR', icon: Globe },
];

const highlights = [
  {
    icon: Camera,
    title: 'Virtual Tour Ready',
    desc: 'Experience properties in 360° before you visit',
  },
  {
    icon: Bell,
    title: 'Instant Price Alerts',
    desc: 'Get notified when properties match your budget',
  },
  {
    icon: BarChart3,
    title: 'Neighborhood Insights',
    desc: 'Schools, transport scores & lifestyle ratings for every area',
  },
];

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Describe Your Dream',
    desc: 'Tell us what you want in plain English or Arabic. Our AI understands nuance — "cozy marina flat with sea view" just works.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'AI Finds Matches',
    desc: 'Gemini AI parses your intent, applies smart filters, then pgvector ranks results by semantic relevance.',
  },
  {
    num: '03',
    icon: Key,
    title: 'Move In',
    desc: 'Compare shortlisted properties side-by-side, contact agents directly, and book your viewing — all in one place.',
  },
];

const showcaseFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Natural Language Search',
    desc: 'No more clicking through 20 dropdowns. Just describe what you want and our AI extracts precise filters — bedrooms, price, area, amenities — in seconds.',
    gradient: 'from-primary/20 to-cyan/10',
  },
  {
    icon: Zap,
    title: 'Hybrid Smart Ranking',
    desc: 'Traditional filters narrow results, then pgvector embeddings rank by semantic similarity. "Cozy waterfront apartment" ranks marina properties higher.',
    gradient: 'from-cyan/20 to-primary/10',
  },
  {
    icon: Globe,
    title: 'Bilingual EN/AR with RTL',
    desc: 'Search in English or Arabic. Every listing has dual-language descriptions with proper right-to-left rendering for Arabic speakers.',
    gradient: 'from-primary/15 to-purple-500/10',
  },
];

const testimonials = [
  {
    quote: 'I described my dream apartment in one sentence and DarFinder found exactly what I was looking for in JVC. The AI search is genuinely magical.',
    name: 'Sarah K.',
    role: 'Relocated from London',
  },
  {
    quote: 'As an agent, the AI listing writer saves me hours. I input the details and get professional EN/AR descriptions instantly. My listings stand out now.',
    name: 'Ahmed R.',
    role: 'Licensed RE Agent, Dubai Marina',
  },
  {
    quote: 'The compare feature with AI-generated pros and cons helped us decide between three villas in Arabian Ranches. Closed the deal within a week.',
    name: 'Priya M.',
    role: 'Family relocation from Mumbai',
  },
];

const trustedBy = ['Bayut', 'Property Finder', 'Dubizzle', 'Arabian Business', 'Gulf News'];

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties?limit=6')
      .then((r) => r.json())
      .then((d) => setFeaturedProperties(d.properties ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════ */}
      <section className="relative hero-mesh min-h-[100vh] flex items-center justify-center overflow-hidden">
        <Particles />

        {/* Dramatic gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.78 0.1 65 / 15%) 0%, transparent 60%)' }}
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.75 0.14 195 / 12%) 0%, transparent 60%)' }}
            animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.6 0.12 300 / 8%) 0%, transparent 60%)' }}
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.7 0.15 150 / 6%) 0%, transparent 60%)' }}
            animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card text-xs font-medium tracking-wide text-muted-foreground mb-8 uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            AI-Powered Property Search
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Discover Dubai&apos;s
            <br />
            <span className="text-gradient">Finest</span> Properties
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Just describe what you&apos;re looking for in plain English or Arabic.
            Our AI understands your needs and finds the perfect property.
          </motion.p>

          {/* Search bar */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <SearchBar size="hero" />
          </motion.div>

          {/* Trusted by */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-12 flex flex-col items-center gap-4"
          >
            <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">As seen on</span>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
              {trustedBy.map((name) => (
                <span
                  key={name}
                  className="text-sm sm:text-base font-semibold text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors tracking-wide"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat) => {
              const counter = useCounter(stat.value);
              return (
                <div
                  key={stat.label}
                  ref={counter.ref}
                  className="glass-card rounded-2xl p-5 text-center group hover:border-primary/20 transition-all duration-300"
                >
                  <stat.icon className="h-5 w-5 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl sm:text-4xl font-bold text-gradient tabular-nums">
                    {stat.display ?? `${counter.count}${stat.suffix}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          EXTRA: 3 Feature Highlights
          ═══════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {highlights.map((h) => (
            <motion.div
              key={h.title}
              variants={staggerItem}
              className="glass-card-hover rounded-2xl p-6 flex items-start gap-4 group"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <h.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{h.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-primary/40 via-cyan/40 to-primary/40" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="relative text-center group"
              >
                {/* Number circle */}
                <div className="relative mx-auto w-28 h-28 mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-cyan opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
                  <div className="relative w-full h-full rounded-full border-2 border-primary/30 flex items-center justify-center glass-card group-hover:border-primary/60 transition-colors">
                    <span className="text-3xl font-bold text-gradient">{step.num}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: FEATURED PROPERTIES
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-medium">Curated Selection</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
                Handpicked <span className="text-gradient">Properties</span>
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Explore our curated collection of Dubai&apos;s finest listings, updated daily.
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl group">
                View All Properties
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {featuredProperties.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProperties.slice(0, 6).map((property, i) => (
                <motion.div key={property.id} variants={staggerItem}>
                  <PropertyCard property={property} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-80 rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: WHY DARFINDER (Feature Showcase)
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
              Built for <span className="text-gradient">Modern</span> Living
            </h2>
          </motion.div>

          <div className="space-y-16 md:space-y-24">
            {showcaseFeatures.map((feature, i) => {
              const isReversed = i % 2 === 1;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
                >
                  {/* Text side */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan/10 mb-5">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Visual side */}
                  <div className="flex-1 w-full max-w-md">
                    <div className={`relative rounded-3xl overflow-hidden glass-card p-8 bg-gradient-to-br ${feature.gradient}`}>
                      {/* Decorative grid */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }} />
                      <div className="relative flex items-center justify-center h-48">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan/20 blur-2xl" />
                        </div>
                        <feature.icon className="h-20 w-20 text-primary/40" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: POPULAR AREAS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            var(--foreground),
            var(--foreground) 1px,
            transparent 1px,
            transparent 20px
          )`,
        }} />

        <div className="mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Locations</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
              Explore <span className="text-gradient">Dubai Areas</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Browse properties across Dubai&apos;s most prestigious neighborhoods.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {DUBAI_AREAS.map((area) => (
              <motion.div key={area} variants={scaleIn}>
                <Link
                  href={`/properties?area=${encodeURIComponent(area)}`}
                  className="block glass-card-hover rounded-2xl p-5 text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MapPin className="h-6 w-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm block">{area}</span>
                  <span className="text-xs text-muted-foreground mt-1 block">8 properties</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6: TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
              What Our <span className="text-gradient">Users</span> Say
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={staggerItem}
                className="glass-card-hover rounded-2xl p-8 flex flex-col"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm leading-relaxed text-foreground/90 flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <Stars />
                  <div className="mt-3">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan/5 pointer-events-none" />

        <div className="mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16"
          >
            {/* Text side */}
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-primary font-medium">For Agents</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
                Are You a <span className="text-gradient">Real Estate Agent</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
                List your properties with AI-generated descriptions, manage leads with pipeline tracking,
                and discover what buyers are searching for — all in one dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link href="/auth/login">
                  <Button size="lg" className="btn-gold rounded-xl px-8 text-sm">
                    Agent Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login?demo=true">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 text-sm group">
                    Try the Demo
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative side */}
            <div className="flex-shrink-0 hidden md:flex items-center justify-center w-64 h-64 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-cyan/10 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-24 h-24 rounded-2xl glass-card flex items-center justify-center"
                    animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Building2 className="h-8 w-8 text-primary/20" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
