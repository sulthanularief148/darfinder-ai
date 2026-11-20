import { createClient } from '@/lib/supabase/server';
import { Building2, Users, TrendingUp, Search } from 'lucide-react';

export const metadata = { title: 'Agent Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const placeholderStats = [
    { label: 'Active Listings', value: '—', icon: Building2 },
    { label: 'Total Leads', value: '—', icon: Users },
    { label: 'Most Searched Area', value: '—', icon: TrendingUp },
    { label: 'Zero-Result Searches', value: '—', icon: Search },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of your properties and leads.
        </p>
      </div>

      {/* Stats grid — will be populated in Phase 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {placeholderStats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gradient">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-primary/30" />
        <p className="text-lg font-medium mb-1">Dashboard Coming in Phase 6</p>
        <p className="text-sm">
          Active listings, lead stats, search analytics, and AI insights will appear here.
        </p>
      </div>
    </div>
  );
}
