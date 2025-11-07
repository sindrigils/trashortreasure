'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Vote } from '@/lib/supabase';
import { getAllVoters, namesMatch } from '@/lib/getAvatarUrl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VoterWithStatus {
  name: string;
  avatarUrl: string;
  hasVoted: boolean;
  vote?: Vote;
}

export default function VotersPage() {
  const [voters, setVoters] = useState<VoterWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVoterStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all votes
      const res = await fetch('/api/admin/votes');
      if (!res.ok) {
        throw new Error('Failed to fetch votes');
      }

      const votes: Vote[] = await res.json();
      const allVoters = getAllVoters();

      // Map voters to their status
      const votersWithStatus: VoterWithStatus[] = allVoters.map((voter) => {
        const vote = votes.find((v) => {
          // Use the same smart matching as getAvatarUrl
          return namesMatch(v.voter_name, voter.name);
        });

        return {
          name: voter.name,
          avatarUrl: voter.avatarUrl,
          hasVoted: !!vote,
          vote,
        };
      });

      // Sort: non-voters first, then by name
      votersWithStatus.sort((a, b) => {
        if (a.hasVoted !== b.hasVoted) {
          return a.hasVoted ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });

      setVoters(votersWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voter data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoterStatus();
  }, []);

  const votedCount = voters.filter((v) => v.hasVoted).length;
  const totalCount = voters.length;

  return (
    <div className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition hover:bg-white/10 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Voter Status</h1>
              <p className="mt-2 text-slate-400">
                Track who has submitted their candy votes
              </p>
            </div>
            <Button
              onClick={fetchVoterStatus}
              variant="outline"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex gap-4">
            <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-2 text-sm">
              {votedCount} Voted
            </Badge>
            <Badge className="border-slate-500/40 bg-slate-500/10 text-slate-200 px-4 py-2 text-sm">
              {totalCount - votedCount} Not Yet
            </Badge>
            <Badge className="border-white/20 bg-white/10 text-white px-4 py-2 text-sm">
              {totalCount} Total
            </Badge>
          </div>
        </header>

        {loading && voters.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-300">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-white" />
            <p>Loading voter status...</p>
          </div>
        ) : error ? (
          <Card className="border-red-500/40 bg-red-500/10 p-8 text-center">
            <p className="text-red-200">{error}</p>
            <Button onClick={fetchVoterStatus} className="mt-4">
              Try Again
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {voters.map((voter) => (
              <Card
                key={voter.name}
                className={`overflow-hidden border transition-all ${
                  voter.hasVoted
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-500/30 bg-slate-500/5'
                }`}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/20">
                    <Image
                      src={voter.avatarUrl}
                      alt={voter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">
                      {voter.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {voter.hasVoted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm text-emerald-200">Voted</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-300">Not yet</span>
                        </>
                      )}
                    </div>
                    {voter.vote && (
                      <p className="mt-2 text-xs text-slate-400">
                        on {new Date(voter.vote.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
