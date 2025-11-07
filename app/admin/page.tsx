'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Users } from 'lucide-react';
import { Vote } from '@/lib/supabase';
import StatsCards from '@/components/admin/StatsCards';
import AdminVotesTable from '@/components/admin/AdminVotesTable';
import ClearAllDialog from '@/components/admin/ClearAllDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchVotes = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/votes');
      if (!res.ok) {
        throw new Error('Failed to fetch votes');
      }
      const data = await res.json();
      setVotes(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load votes');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    const res = await fetch('/api/admin/votes?confirm=true', {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to clear votes');
    }

    await fetchVotes(); // Refresh the list
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-200">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
        <p className="text-lg tracking-wide">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-slate-300 md:flex-row md:items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Last refresh {lastRefresh.toLocaleTimeString()} • auto every 10s
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Admin Control Room
              </h1>
              <p className="text-sm text-slate-300">
                Manage candy submissions, monitor the dashboard, and keep the showdown balanced.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                variant="ghost"
                className="gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 whitespace-nowrap"
              >
                <Link href="/admin/voters" className="flex items-center gap-2">
                  Voter Status
                  <Users className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 whitespace-nowrap"
              >
                <Link href="/results" className="flex items-center gap-2">
                  View live board
                  <BarChart3 className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-100 shadow-lg shadow-rose-900/20">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-xl shadow-black/30">
          <StatsCards votes={votes} />
        </section>

        <Separator className="border-white/10" />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold text-white">All Votes</h2>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => fetchVotes()}
                className="gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-slate-100 hover:bg-white/10"
              >
                Refresh now
                <span role="img" aria-label="refresh">
                  🔄
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setClearDialogOpen(true)}
                className="gap-2 rounded-full border-rose-500/40 bg-rose-500/10 px-4 text-rose-100 hover:bg-rose-500/20"
                disabled={votes.length === 0}
              >
                Clear votes
                <span role="img" aria-label="warning">
                  🔴
                </span>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <AdminVotesTable votes={votes} onVotesChange={setVotes} />
          </div>
        </section>

        <ClearAllDialog
          isOpen={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          onConfirm={handleClearAll}
        />
      </div>
    </div>
  );
}
