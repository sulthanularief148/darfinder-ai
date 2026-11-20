'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2 } from 'lucide-react';
import { LeadsTable } from '@/components/agent/leads-table';
import { Badge } from '@/components/ui/badge';

interface LeadWithProperty {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  preferred_contact_time: string | null;
  status: string;
  language: string;
  created_at: string;
  properties?: {
    id: string;
    title: string;
    area: string;
    type: string;
    purpose: string;
    price_aed: number;
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleStatusChange(leadId: string, status: string) {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
    }
  }

  const filtered =
    filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    viewing_booked: leads.filter((l) => l.status === 'viewing_booked').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Leads</h1>
        {!loading && (
          <Badge variant="secondary" className="text-xs">
            {leads.length} total
          </Badge>
        )}
      </motion.div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'contacted', 'viewing_booked', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'glass-card hover:bg-white/[0.05]'
            }`}
          >
            {status === 'all'
              ? 'All'
              : status === 'viewing_booked'
                ? 'Viewing Booked'
                : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1 opacity-60">
              ({counts[status as keyof typeof counts] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <LeadsTable leads={filtered} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
