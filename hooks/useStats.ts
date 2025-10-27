'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StatsData } from '@/types/stats';

interface UseStatsOptions {
  refreshInterval?: number | null;
}

export function useStats(options: UseStatsOptions = {}) {
  const { refreshInterval = 10000 } = options;
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data: StatsData = await res.json();
      setStats(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    if (!refreshInterval) {
      return;
    }

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    lastUpdate,
    refresh: fetchStats,
  };
}
