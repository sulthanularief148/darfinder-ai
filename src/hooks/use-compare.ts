'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'darfinder-compare';
const MAX_COMPARE = 3;

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setIds(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const add = useCallback(
    (id: string) => {
      if (ids.includes(id) || ids.length >= MAX_COMPARE) return;
      persist([...ids, id]);
    },
    [ids, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(ids.filter((i) => i !== id));
    },
    [ids, persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, add, remove, clear, has, isFull: ids.length >= MAX_COMPARE, count: ids.length };
}
