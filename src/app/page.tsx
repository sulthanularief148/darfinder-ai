'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  Brain,
  Shield,
  MapPin,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/search-bar';
import { DUBAI_AREAS } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stats = [
  { label: 'Properties', value: '80+', icon: Building2 },
  { label: 'Dubai Areas', value: '10', icon: MapPin },
  { label: 'AI Powered', value: '100%', icon: Brain },
  { label: 'Languages', value: 'EN/AR', icon: Globe },
];

const features = [
  {
    icon: Brain,
    title: 'Natural Language Search',
    description:
      'Just describe what you want: "2 bed near metro in JVC under 90k". Our AI understands and finds matching properties instantly.',
  },
  {
    icon: Zap,
    title: 'Hybrid Smart Ranking',
    description:
      'Hard filters narrow results, then pgvector AI ranking surfaces the most relevant matches based on your intent.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description:
      'AI never touches your database directly. Every query goes through validated filters and Row Level Security.',
  },
  {
    icon: MapPin,
    title: 'Interactive Map View',
    description:
      'See all properties on a live map with price markers. Zoom into your preferred area to explore listings.',
  },
  {
    icon: BarChart3,
    title: 'Agent Dashboard',
    description:
      'Real-time insights: what buyers are searching for, most popular areas, and gaps in your inventory.',
  },
  {
    icon: Globe,
    title: 'Bilingual EN/AR',
    description:
      'Search in English or Arabic. Property descriptions available in both languages with proper RTL support.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative hero-mesh min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.78 0.1 65 / 12%) 0%, transparent 70%)',
            }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.75 0.14 195 / 10%) 0%, transparent 70%)',
            }}
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.6 0.08 280 / 6%) 0%, transparent 70%)',
            }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium text-muted-foreground mb-8"
          >
            <Sparkle />
            AI-Powered Property Search
          </motion.div>

          {/* Main heading */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Find Your Dream Home
            <br />
            <span className="text-gradient">in Dubai</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Just describe what you&apos;re looking for in plain English or Arabic.
            Our AI understands your needs and finds the perfect property.
          </motion.p>

          {/* Search bar */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <SearchBar size="hero" />
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by <span className="text-gradient">AI Intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Not just another property portal. DarFinder uses AI to understand what you
              really want and find it faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card-hover rounded-2xl p-6"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR AREAS SECTION ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore <span className="text-gradient">Dubai Areas</span>
            </h2>
            <p className="text-muted-foreground">
              Browse properties across Dubai&apos;s most popular neighborhoods.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {DUBAI_AREAS.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/properties?area=${encodeURIComponent(area)}`}
                  className="block glass-card-hover rounded-xl p-4 text-center group"
                >
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{area}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Are You a <span className="text-gradient">Real Estate Agent</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              List your properties, generate AI-powered descriptions, manage leads,
              and discover what buyers are searching for.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="btn-gold rounded-xl px-8">
                  Agent Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login?demo=true">
                <Button size="lg" variant="outline" className="rounded-xl px-8">
                  Try Agent Demo
                  <Zap className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Sparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
      <path
        d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
