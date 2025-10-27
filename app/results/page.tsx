'use client';

import { useEffect, useState } from 'react';
import { AwardCard } from '@/components/AwardCard';
import { LikeHateBar } from '@/components/LikeHateBar';
import { Separator } from '@/components/ui/separator';

interface StatsData {
  awards: {
    most_loved: Array<{
      candy: string;
      likes: number;
      hates: number;
      net: number;
    }>;
    most_hated: Array<{
      candy: string;
      likes: number;
      hates: number;
      net: number;
    }>;
    spiciest_take: Array<{
      name: string;
      hate_vote: string;
      spicy_score: number;
    }>;
    purest_heart: Array<{
      name: string;
      love_vote: string;
      pure_score: number;
    }>;
  };
  perCandy: Array<{
    candy: string;
    likes: number;
    hates: number;
    net: number;
  }>;
  perPerson: Array<{
    name: string;
    hate_vote: string;
    love_vote: string;
    spicy_score: number;
    pure_score: number;
  }>;
}

export default function ResultsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await res.json();
      setStats(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Trash or Treasure 🍬
          </h1>
          <p className="text-muted-foreground">
            Live results {lastUpdate && `• Last updated: ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>

        <Separator />

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AwardCard
            title="Most Loved Candy"
            emoji="🏆"
            winners={stats?.awards.most_loved || []}
            delay={0}
          />
          <AwardCard
            title="Most Hated Candy"
            emoji="💀"
            winners={stats?.awards.most_hated || []}
            delay={0.1}
          />
          <AwardCard
            title="Spiciest Take"
            emoji="🔥"
            winners={stats?.awards.spiciest_take || []}
            delay={0.2}
          />
          <AwardCard
            title="Purest Heart"
            emoji="💖"
            winners={stats?.awards.purest_heart || []}
            delay={0.3}
          />
        </div>

        {/* Chart */}
        <LikeHateBar data={stats?.perCandy || []} />

        {/* Total votes count */}
        {stats && stats.perPerson.length > 0 && (
          <p className="text-center text-muted-foreground">
            Total votes: {stats.perPerson.length}
          </p>
        )}
      </div>
    </div>
  );
}
