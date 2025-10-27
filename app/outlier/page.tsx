'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, RefreshCcw, Sparkles } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OutlierPage() {
  const { stats, loading, error, lastUpdate, refresh } = useStats({ refreshInterval: 15000 });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-300">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-fuchsia-400" />
        <p>Spotting the bravest outliers...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-rose-200">
        <p className="text-lg">Could not load outlier data: {error}</p>
        <Button onClick={refresh} className="gap-2">
          Retry
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const formatScore = (score?: number) =>
    typeof score === 'number' ? score.toFixed(1) : '—';

  const outliers = stats.awards.purest_heart;
  const headliner = outliers[0];
  const headlinerCandy = headliner
    ? stats.perCandy.find((item) => item.candy === headliner.love_vote)
    : null;

  return (
    <div className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-slate-300 md:flex-row md:items-center">
            <Link
              href="/results"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to results
            </Link>
            {lastUpdate && (
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Updated {lastUpdate.toLocaleTimeString()} • auto every 15s
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-fuchsia-200">
              <Sparkles className="h-4 w-4" />
              Outlier Showcase
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Candy Outlier Roll
            </h1>
            <p className="text-base text-slate-300 md:text-lg">
              These sweet-tooth rebels hype treats that everyone else trashes. A higher Outlier Score means their favorite candy faces more boos than cheers.
            </p>
          </div>
        </header>

        {headliner ? (
          <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-fuchsia-500/10 to-transparent backdrop-blur shadow-xl shadow-fuchsia-900/30">
            <CardHeader className="flex flex-col gap-4 pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge className="border-white/20 bg-black/40 text-xs uppercase tracking-widest text-fuchsia-200">
                  Spotlight
                </Badge>
                <CardTitle className="text-3xl text-white">{headliner.name}</CardTitle>
              </div>
              <Badge className="border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                Outlier Score {formatScore(headliner.pure_score)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200">Their chosen candy</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {headliner.love_vote}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Cheering for the underdog candy without hesitation.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Crowd reaction</p>
                  {headlinerCandy ? (
                    <ul className="mt-3 space-y-1 text-sm text-slate-300">
                      <li>
                        👍 Likes from the crowd: <span className="font-semibold text-emerald-300">{headlinerCandy.likes}</span>
                      </li>
                      <li>
                        👎 Hates from the crowd: <span className="font-semibold text-rose-300">{headlinerCandy.hates}</span>
                      </li>
                      <li>
                        Net sentiment: <span className={headlinerCandy.net >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                          {headlinerCandy.net > 0 ? '+' : ''}{headlinerCandy.net}
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-300">
                      We&apos;re still gathering reactions for this candy.
                    </p>
                  )}
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-between rounded-full border border-white/10 bg-white/5 px-6 py-3 text-slate-100 hover:bg-white/10"
              >
                <Link href="/results">
                  Return to the main board
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-white/10 bg-white/5 p-10 text-center text-slate-300">
            No outliers have stepped forward yet. Keep an eye on the votes!
          </Card>
        )}

        {outliers.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white uppercase tracking-[0.3em]">Outlier Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {outliers.slice(1).map((entry, idx) => {
                const candy = stats.perCandy.find((item) => item.candy === entry.love_vote);
                return (
                  <Card
                    key={`${entry.name}-${idx}`}
                    className="border-white/10 bg-white/5 backdrop-blur-sm shadow-lg shadow-black/30"
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-white">{entry.name}</p>
                        <Badge className="border-white/10 bg-white/10 px-2 py-0.5 text-xs text-fuchsia-200">
                          {formatScore(entry.pure_score)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">
                        Standing by <span className="font-semibold text-white">{entry.love_vote}</span> no matter the groans.
                      </p>
                      {candy && (
                        <p className="text-xs text-slate-400">
                          Crowd boos: <span className="text-rose-300 font-semibold">{candy.hates}</span> hates
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
