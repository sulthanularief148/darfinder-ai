'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ListingForm } from '@/components/agent/listing-form';

export default function NewPropertyPage() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Plus className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Add Property</h1>
      </motion.div>

      <ListingForm />
    </div>
  );
}
