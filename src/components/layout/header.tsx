'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Search,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useTheme } from './theme-provider';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/properties?view=map', label: 'Map', icon: Search },
];

const agentLinks = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agent/properties', label: 'My Listings', icon: Building2 },
  { href: '/agent/leads', label: 'Leads', icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

  const isAgent = pathname.startsWith('/agent');
  const links = isAgent ? agentLinks : publicLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-dark to-gold">
              <Building2 className="h-5 w-5 text-background" />
            </div>
            <span className="text-lg font-bold text-gradient hidden sm:block">
              DarFinder AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href.split('?')[0] + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: theme toggle + auth */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {!isAgent && (
                  <Link href="/agent/dashboard">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Agent Panel
                    </Button>
                  </Link>
                )}
                {isAgent && (
                  <Link href="/properties">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Search className="h-4 w-4 mr-1" />
                      Public Site
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-lg text-muted-foreground"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <Button size="sm" className="btn-gold rounded-lg">
                  <LogIn className="h-4 w-4 mr-1" />
                  Agent Login
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="md:hidden inline-flex items-center justify-center rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 glass-card">
                <SheetTitle className="text-gradient font-bold text-lg">
                  DarFinder AI
                </SheetTitle>
                <nav className="mt-6 flex flex-col gap-2">
                  {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="my-2 h-px bg-border" />

                  {user ? (
                    <>
                      {!isAgent && (
                        <Link
                          href="/agent/dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Agent Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { handleSignOut(); setMobileOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium btn-gold"
                    >
                      <LogIn className="h-5 w-5" />
                      Agent Login
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
