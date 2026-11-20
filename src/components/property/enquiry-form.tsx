'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function EnquiryForm({ propertyId, propertyTitle }: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: propertyId,
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        message: form.get('message') || undefined,
        preferred_contact_time: form.get('preferred_contact_time') || undefined,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Enquire about this property</h3>
      <p className="text-sm text-muted-foreground mb-6">{propertyTitle}</p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold mb-1">Enquiry Sent!</h4>
            <p className="text-sm text-muted-foreground">
              The agent will get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                required
                minLength={2}
                placeholder="Your name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                minLength={7}
                placeholder="+971 50 123 4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="I'd like to schedule a viewing..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preferred_contact_time">Preferred Contact Time (optional)</Label>
              <Input
                id="preferred_contact_time"
                name="preferred_contact_time"
                placeholder="Weekday evenings, after 6 PM"
                className="mt-1"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-gold rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Sending...' : 'Send Enquiry'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
