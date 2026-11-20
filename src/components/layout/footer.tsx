import Link from 'next/link';
import { Building2, Heart } from 'lucide-react';
import { DUBAI_AREAS } from '@/types';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-dark to-gold">
                <Building2 className="h-5 w-5 text-background" />
              </div>
              <span className="text-lg font-bold text-gradient">
                DarFinder AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered property search for Dubai. Find your perfect home with natural
              language — just describe what you want.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=rent" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Rent in Dubai
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=sale" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Buy in Dubai
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Agent Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular areas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Popular Areas</h3>
            <ul className="space-y-2">
              {DUBAI_AREAS.slice(0, 6).map((area) => (
                <li key={area}>
                  <Link
                    href={`/properties?area=${encodeURIComponent(area)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DarFinder AI is a portfolio project demonstrating AI-powered real estate search
              with natural language processing, pgvector similarity ranking, and
              Supabase Row Level Security.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3">
              All property listings are fictional and for demonstration purposes only.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DarFinder AI — Portfolio Project
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-destructive" /> using Next.js, Supabase &amp; Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
