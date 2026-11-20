import type { Metadata } from 'next';
import { Inter, Noto_Kufi_Arabic } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CompareSelector } from '@/components/compare/compare-selector';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const notoKufi = Noto_Kufi_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DarFinder AI — Dubai Property Search',
    template: '%s | DarFinder AI',
  },
  description:
    'Find your perfect property in Dubai with AI-powered natural language search. Browse apartments, villas, and townhouses across Dubai Marina, Downtown, JVC, and more.',
  keywords: ['Dubai real estate', 'property search', 'AI', 'rent Dubai', 'buy Dubai'],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoKufi.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <CompareSelector />
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
