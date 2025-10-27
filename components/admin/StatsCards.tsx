import { Vote } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  votes: Vote[];
}

function normalizeCandyName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

export default function StatsCards({ votes }: StatsCardsProps) {
  // Compute statistics
  const totalVotes = votes.length;

  // Unique voters (case-insensitive)
  const uniqueVoters = new Set(
    votes.map(v => v.voter_name.toLowerCase().trim())
  ).size;

  // Total unique candies (normalized)
  const allCandies = [
    ...votes.map(v => normalizeCandyName(v.brought_candy)),
    ...votes.map(v => normalizeCandyName(v.hate_vote)),
    ...votes.map(v => normalizeCandyName(v.love_vote)),
  ];
  const totalCandies = new Set(allCandies.filter(c => c.length > 0)).size;

  // Most brought candy
  const broughtCounts = new Map<string, { count: number; original: string }>();
  votes.forEach(v => {
    const normalized = normalizeCandyName(v.brought_candy);
    if (normalized) {
      const existing = broughtCounts.get(normalized);
      if (existing) {
        existing.count++;
      } else {
        broughtCounts.set(normalized, { count: 1, original: v.brought_candy });
      }
    }
  });

  let mostBrought = 'N/A';
  let maxCount = 0;
  broughtCounts.forEach((value) => {
    if (value.count > maxCount) {
      maxCount = value.count;
      mostBrought = value.original;
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <span className="text-2xl">🗳️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVotes}</div>
          <p className="text-xs text-muted-foreground">
            All votes cast
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
          <span className="text-2xl">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueVoters}</div>
          <p className="text-xs text-muted-foreground">
            Distinct voter names
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candies</CardTitle>
          <span className="text-2xl">🍬</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCandies}</div>
          <p className="text-xs text-muted-foreground">
            Unique candy types
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Brought</CardTitle>
          <span className="text-2xl">⭐</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">{mostBrought}</div>
          <p className="text-xs text-muted-foreground">
            {maxCount > 0 ? `${maxCount} times` : 'No data yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
