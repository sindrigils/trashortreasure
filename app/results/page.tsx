'use client';

import { AwardCard } from '@/components/AwardCard';
import { LikeHateBar } from '@/components/LikeHateBar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStats } from '@/hooks/useStats';
import {
  ArrowLeft,
  Flame,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const { stats, loading, error, lastUpdate, refresh } = useStats();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-300">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
        <p>Loading the latest votes...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-slate-300">
        <p className="text-lg text-rose-300">Unable to load results: {error}</p>
        <Button onClick={refresh} className="gap-2">
          Retry
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-300 md:flex-row">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <span className="h-3 w-px bg-white/20" aria-hidden />
              <Button
                variant="ghost"
                className="gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-emerald-200 hover:bg-white/10"
                onClick={refresh}
              >
                Auto refresh • every 10s
                <RefreshCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Link
                href="/hater"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200 transition hover:bg-amber-500/20"
              >
                <Flame className="h-4 w-4" />
                Hater
              </Link>
              <Link
                href="/outlier"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-fuchsia-200 transition hover:bg-fuchsia-500/20"
              >
                <Sparkles className="h-4 w-4" />
                Outlier
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
              Live results
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Candy Mood Board
              </h1>
              {lastUpdate && (
                <p className="text-sm text-slate-300">
                  Updated {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
            <p className="max-w-3xl text-base text-slate-300 md:text-lg">
              Track the sweet victories and dramatic takedowns in real time. The
              chart below mirrors the pulse of the crowd—greens for love, roses
              for the boos.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <AwardCard
            title="Most Loved Candy"
            emoji="🏆"
            winners={stats.awards.most_loved}
            className="shadow-violet-900/30"
          />
          <AwardCard
            title="Most Hated Candy"
            emoji="💀"
            winners={stats.awards.most_hated}
            delay={0.1}
            className="shadow-rose-900/30"
          />
        </section>

        <Separator className="border-white/10" />

        <section className="space-y-6">
          <LikeHateBar data={stats.perCandy} />
          {stats.perPerson.length > 0 && (
            <p className="text-center text-sm uppercase tracking-[0.3em] text-slate-400">
              Total votes logged: {stats.perPerson.length}
            </p>
          )}
        </section>

        <footer className="flex flex-col items-center justify-center gap-4 text-slate-400">
          <p className="text-xs uppercase tracking-[0.3em]">
            Trash or Treasure Dashboard
          </p>
        </footer>
      </div>
    </div>
  );
}
