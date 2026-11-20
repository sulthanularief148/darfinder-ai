'use client';

import Link from 'next/link';
import { Building2, Heart, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { DUBAI_AREAS } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 mt-auto overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand — larger column */}
          <motion.div
            className="lg:col-span-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-dark to-gold shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow">
                <Building2 className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-gradient">
                DarFinder AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              AI-powered property search for Dubai. Find your perfect home with natural
              language — just describe what you want.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold/70 shrink-0" />
                <span>Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-gold/70 shrink-0" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-gold/70 shrink-0" />
                <span>info@darfinder.ai</span>
              </div>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            className="lg:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/properties', label: 'Browse Properties' },
                { href: '/properties?purpose=rent', label: 'Rent in Dubai' },
                { href: '/properties?purpose=sale', label: 'Buy in Dubai' },
                { href: '/compare', label: 'Compare Properties' },
                { href: '/auth/login', label: 'Agent Portal' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Popular areas */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeUp}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Popular Areas</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {DUBAI_AREAS.slice(0, 8).map((area) => (
                <li key={area}>
                  <Link
                    href={`/properties?area=${encodeURIComponent(area)}`}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter / About */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeUp}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Get notified about new premium listings and market insights.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button className="btn-gold rounded-lg px-4 py-2 text-sm font-medium shrink-0">
                Subscribe
              </button>
            </div>

            <p className="text-xs text-muted-foreground/50 mt-6">
              Portfolio project — all listings are fictional and for demonstration only.
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} DarFinder AI — Portfolio Project
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground/70">Privacy Policy</span>
              <span className="text-xs text-muted-foreground/70">Terms of Service</span>
              <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                Built with <Heart className="h-3 w-3 text-red-500 animate-pulse" /> Next.js &amp; Gemini AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
