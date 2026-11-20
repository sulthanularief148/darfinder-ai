'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Eye,
  TrendingUp,
  MapPin,
  SearchX,
} from 'lucide-react';

interface DashboardData {
  totalListings: number;
  activeListings: number;
  leadStats: {
    total: number;
    new: number;
    contacted: number;
    viewing_booked: number;
    closed: number;
    lost: number;
  };
  topAreas: { area: string; count: number }[];
  zeroResultSearches: string[];
  recentSearchCount: number;
}

interface DashboardStatsProps {
  data: DashboardData;
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start = 0;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);

      if (el) el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span ref={ref}>0</span>;
}

const statCards = [
  {
    key: 'activeListings',
    label: 'Active Listings',
    icon: Building2,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    key: 'totalLeads',
    label: 'Total Leads',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'newLeads',
    label: 'New Leads',
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    key: 'searches',
    label: 'Recent Searches',
    icon: Eye,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

export function DashboardStats({ data }: DashboardStatsProps) {
  const values: Record<string, number> = {
    activeListings: data.activeListings,
    totalLeads: data.leadStats.total,
    newLeads: data.leadStats.new,
    searches: data.recentSearchCount,
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={values[card.key]} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4">Lead Pipeline</h3>
          <div className="space-y-3">
            {[
              { label: 'New', value: data.leadStats.new, color: 'bg-blue-500' },
              { label: 'Contacted', value: data.leadStats.contacted, color: 'bg-yellow-500' },
              { label: 'Viewing Booked', value: data.leadStats.viewing_booked, color: 'bg-cyan-500' },
              { label: 'Closed', value: data.leadStats.closed, color: 'bg-green-500' },
              { label: 'Lost', value: data.leadStats.lost, color: 'bg-red-500' },
            ].map((item) => {
              const pct = data.leadStats.total > 0
                ? (item.value / data.leadStats.total) * 100
                : 0;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28">{item.label}</span>
                  <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{item.value}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top searched areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4">
            <MapPin className="h-4 w-4 inline mr-1 text-primary" />
            Most Searched Areas
          </h3>
          {data.topAreas.length > 0 ? (
            <div className="space-y-3">
              {data.topAreas.map((area, i) => {
                const maxCount = data.topAreas[0].count;
                const pct = (area.count / maxCount) * 100;
                return (
                  <div key={area.area} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-6">{i + 1}</span>
                    <span className="text-sm flex-1">{area.area}</span>
                    <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {area.count}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No search data yet.</p>
          )}
        </motion.div>
      </div>

      {/* Zero-result searches */}
      {data.zeroResultSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="font-semibold mb-3">
            <SearchX className="h-4 w-4 inline mr-1 text-red-400" />
            Searches with No Results
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Opportunities — people searched for these but found nothing.
          </p>
          <div className="flex flex-wrap gap-2">
            {data.zeroResultSearches.map((q, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {q}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
