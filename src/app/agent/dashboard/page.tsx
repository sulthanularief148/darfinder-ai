'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import { DashboardStats } from '@/components/agent/dashboard-stats';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/agent/dashboard');
      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your properties, leads, and search insights at a glance.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data ? (
        <DashboardStats data={data} />
      ) : (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          <p>Sign in to view your dashboard.</p>
        </div>
      )}
    </div>
  );
}
