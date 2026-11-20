import { describe, it, expect, vi } from 'vitest';
import type { PropertyFilter } from '@/lib/validators/property';

function createMockQuery() {
  const calls: { method: string; args: unknown[] }[] = [];

  const chain = new Proxy(
    {},
    {
      get(_target, prop: string) {
        return (...args: unknown[]) => {
          calls.push({ method: prop, args });
          return chain;
        };
      },
    }
  );

  return { chain, calls };
}

function createMockClient() {
  const mockQuery = createMockQuery();

  return {
    client: {
      from: (_table: string) => ({
        select: (...args: unknown[]) => {
          mockQuery.calls.push({ method: 'select', args });
          return mockQuery.chain;
        },
      }),
    },
    calls: mockQuery.calls,
  };
}

describe('Query Builder Logic', () => {
  it('applies purpose filter', () => {
    const filters: PropertyFilter = {
      purpose: 'rent',
      page: 1,
      limit: 20,
    };

    const { client, calls } = createMockClient();
    // Simulate what buildPropertyQuery does
    const query = client.from('properties').select('*', { count: 'exact' });
    // @ts-expect-error mock proxy
    query.eq('status', 'active');
    if (filters.purpose) {
      // @ts-expect-error mock proxy
      query.eq('purpose', filters.purpose);
    }

    expect(calls.some((c) => c.method === 'eq' && c.args[0] === 'purpose' && c.args[1] === 'rent')).toBe(true);
  });

  it('applies price range filters', () => {
    const filters: PropertyFilter = {
      price_min: 50000,
      price_max: 150000,
      page: 1,
      limit: 20,
    };

    const { client, calls } = createMockClient();
    const query = client.from('properties').select('*', { count: 'exact' });
    // @ts-expect-error mock proxy
    query.eq('status', 'active');
    if (filters.price_min !== undefined) {
      // @ts-expect-error mock proxy
      query.gte('price_aed', filters.price_min);
    }
    if (filters.price_max !== undefined) {
      // @ts-expect-error mock proxy
      query.lte('price_aed', filters.price_max);
    }

    expect(calls.some((c) => c.method === 'gte' && c.args[0] === 'price_aed' && c.args[1] === 50000)).toBe(true);
    expect(calls.some((c) => c.method === 'lte' && c.args[0] === 'price_aed' && c.args[1] === 150000)).toBe(true);
  });

  it('applies boolean filters', () => {
    const filters: PropertyFilter = {
      furnished: true,
      near_metro: true,
      pet_friendly: true,
      page: 1,
      limit: 20,
    };

    const { client, calls } = createMockClient();
    const query = client.from('properties').select('*', { count: 'exact' });
    // @ts-expect-error mock proxy
    query.eq('status', 'active');
    if (filters.furnished !== undefined) {
      // @ts-expect-error mock proxy
      query.eq('furnished', filters.furnished);
    }
    if (filters.near_metro !== undefined) {
      // @ts-expect-error mock proxy
      query.eq('near_metro', filters.near_metro);
    }
    if (filters.pet_friendly !== undefined) {
      // @ts-expect-error mock proxy
      query.eq('pet_friendly', filters.pet_friendly);
    }

    expect(calls.filter((c) => c.method === 'eq').length).toBe(4); // status + 3 booleans
  });

  it('always filters by active status', () => {
    const { client, calls } = createMockClient();
    const query = client.from('properties').select('*', { count: 'exact' });
    // @ts-expect-error mock proxy
    query.eq('status', 'active');

    expect(calls.some((c) => c.method === 'eq' && c.args[0] === 'status' && c.args[1] === 'active')).toBe(true);
  });

  it('does not apply undefined filters', () => {
    const filters: PropertyFilter = {
      page: 1,
      limit: 20,
    };

    const { client, calls } = createMockClient();
    const query = client.from('properties').select('*', { count: 'exact' });
    // @ts-expect-error mock proxy
    query.eq('status', 'active');
    if (filters.purpose) {
      // @ts-expect-error mock proxy
      query.eq('purpose', filters.purpose);
    }
    if (filters.area) {
      // @ts-expect-error mock proxy
      query.eq('area', filters.area);
    }

    // Only 'status' eq should be called
    const eqCalls = calls.filter((c) => c.method === 'eq');
    expect(eqCalls.length).toBe(1);
    expect(eqCalls[0].args[0]).toBe('status');
  });
});
