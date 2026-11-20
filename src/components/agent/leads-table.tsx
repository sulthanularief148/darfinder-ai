'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface LeadsTableProps {
  leads: LeadWithProperty[];
  onStatusChange: (leadId: string, status: string) => Promise<void>;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  viewing_booked: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  closed: 'bg-green-500/20 text-green-400 border-green-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  viewing_booked: 'Viewing Booked',
  closed: 'Closed',
  lost: 'Lost',
};

export function LeadsTable({ leads, onStatusChange }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleFollowUp(leadId: string) {
    setAiLoading(true);
    setAiMessage(null);

    const res = await fetch('/api/ai/follow-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId }),
    });

    if (res.ok) {
      const data = await res.json();
      setAiMessage(data.message);
    }
    setAiLoading(false);
  }

  async function copyMessage() {
    if (!aiMessage) return;
    await navigator.clipboard.writeText(aiMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">No leads yet</h3>
        <p className="text-sm text-muted-foreground">
          Leads from property enquiries will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead, i) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          {/* Summary row */}
          <button
            onClick={() => {
              setExpandedId(expandedId === lead.id ? null : lead.id);
              setAiMessage(null);
            }}
            className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{lead.name}</span>
                <Badge className={`text-[10px] px-2 py-0 ${statusColors[lead.status] || ''}`}>
                  {statusLabels[lead.status] || lead.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lead.properties?.title} — {lead.properties?.area}
              </p>
            </div>

            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </button>

          {/* Expanded details */}
          {expandedId === lead.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-t border-white/5 p-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                    {lead.phone}
                  </a>
                </div>
                {lead.preferred_contact_time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{lead.preferred_contact_time}</span>
                  </div>
                )}
              </div>

              {lead.message && (
                <div className="glass-card rounded-lg p-3">
                  <p className="text-sm text-muted-foreground italic">"{lead.message}"</p>
                </div>
              )}

              {/* Status changer */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select
                  defaultValue={lead.status}
                  onValueChange={(val) => val && onStatusChange(lead.id, val)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="viewing_booked">Viewing Booked</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Follow-up */}
              <div className="border-t border-white/5 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFollowUp(lead.id)}
                  disabled={aiLoading}
                  className="rounded-xl"
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  )}
                  {aiLoading ? 'Generating...' : 'Draft AI Follow-up'}
                </Button>

                {aiMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 glass-card rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        AI-Generated Follow-up
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyMessage}
                        className="h-7 text-xs"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 mr-1 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{aiMessage}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
