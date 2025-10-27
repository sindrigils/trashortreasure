import Link from 'next/link'
import { ArrowRight, BarChart3, Flame, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-col justify-center px-6 py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-40 max-w-2xl rounded-full bg-gradient-to-br from-violet-600/40 via-fuchsia-500/20 to-emerald-400/20 blur-3xl" />
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <section className="space-y-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-medium text-emerald-200 ring-1 ring-white/10 md:justify-start">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live candy showdown
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Trash or Treasure
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">
              Track the sweetest victories and pettiest candy feuds in real time.
              Drill into the heat map of opinions, spotlight the loud haters, and celebrate the fearless outliers.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Button asChild size="lg" className="gap-2">
              <Link href="/results">
                View Live Results
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/5 text-slate-100 backdrop-blur transition hover:border-white/50 hover:bg-white/10"
            >
              <Link href="/admin">
                Admin Console
                <ShieldCheck className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 border-white/10 shadow-xl shadow-violet-900/20 backdrop-blur">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div className="flex items-center gap-3 text-violet-200">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wide">Results Hub</span>
              </div>
              <p className="text-sm text-slate-300">
                Dive into likes vs. hates, uncover runaway favorites, and spot the candies everyone loves to dunk on.
              </p>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-between bg-white/5 text-slate-100 hover:bg-white/10"
              >
                <Link href="/results">
                  Explore results
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-xl shadow-emerald-900/20 backdrop-blur">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div className="flex items-center gap-3 text-emerald-200">
                <Flame className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wide">Award Spotlights</span>
              </div>
              <p className="text-sm text-slate-300">
                Meet the loudest haters and the fearless outliers rewriting the candy narrative.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-between bg-white/5 text-slate-100 hover:bg-white/10"
                >
                  <Link href="/hater">
                    Hater
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-between bg-white/5 text-slate-100 hover:bg-white/10"
                >
                  <Link href="/outlier">
                    Outlier
                    <Sparkles className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
