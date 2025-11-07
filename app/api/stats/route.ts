import { NextResponse } from 'next/server';
import { getSupabaseClient, Vote } from '@/lib/supabase';
import { normalizeCandyName, getMostCommonSpelling } from '@/lib/candy';
import { getAvatarUrl } from '@/lib/getAvatarUrl';

interface CandyStats {
  candy: string;
  likes: number;
  hates: number;
  net: number;
}

interface PersonStats {
  name: string;
  avatar_url?: string;
  hate_vote: string;
  love_vote: string;
  spicy_score: number;
  pure_score: number;
}

interface Award {
  candy?: string;
  name?: string;
  avatar_url?: string;
  hate_vote?: string;
  love_vote?: string;
  likes?: number;
  hates?: number;
  net?: number;
  spicy_score?: number;
  pure_score?: number;
}

interface StatsResponse {
  awards: {
    most_loved: Award[];
    most_hated: Award[];
    spiciest_take: Award[];
    purest_heart: Award[];
  };
  perCandy: CandyStats[];
  perPerson: PersonStats[];
}

export async function GET() {
  try {
    // Fetch all votes
    const supabase = getSupabaseClient();
    const { data: votes, error } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    if (!votes || votes.length === 0) {
      // Return empty stats
      return NextResponse.json({
        awards: {
          most_loved: [],
          most_hated: [],
          spiciest_take: [],
          purest_heart: [],
        },
        perCandy: [],
        perPerson: [],
      });
    }

    // Build candy statistics with normalization
    const slugToOriginalNames = new Map<string, string[]>();
    const slugToLikes = new Map<string, number>();
    const slugToHates = new Map<string, number>();

    for (const vote of votes as Vote[]) {
      // Track love votes
      const loveSlug = normalizeCandyName(vote.love_vote);
      if (!slugToOriginalNames.has(loveSlug)) {
        slugToOriginalNames.set(loveSlug, []);
      }
      slugToOriginalNames.get(loveSlug)!.push(vote.love_vote);
      slugToLikes.set(loveSlug, (slugToLikes.get(loveSlug) || 0) + 1);

      // Track hate votes
      const hateSlug = normalizeCandyName(vote.hate_vote);
      if (!slugToOriginalNames.has(hateSlug)) {
        slugToOriginalNames.set(hateSlug, []);
      }
      slugToOriginalNames.get(hateSlug)!.push(vote.hate_vote);
      slugToHates.set(hateSlug, (slugToHates.get(hateSlug) || 0) + 1);

      // Track brought candy (for display names)
      const broughtSlug = normalizeCandyName(vote.brought_candy);
      if (!slugToOriginalNames.has(broughtSlug)) {
        slugToOriginalNames.set(broughtSlug, []);
      }
      slugToOriginalNames.get(broughtSlug)!.push(vote.brought_candy);
    }

    // Build perCandy stats
    const allSlugs = new Set([
      ...slugToLikes.keys(),
      ...slugToHates.keys(),
    ]);

    const perCandy: CandyStats[] = Array.from(allSlugs).map((slug) => {
      const likes = slugToLikes.get(slug) || 0;
      const hates = slugToHates.get(slug) || 0;
      const originalNames = slugToOriginalNames.get(slug) || [];
      const displayName = getMostCommonSpelling(originalNames);

      return {
        candy: displayName,
        likes,
        hates,
        net: likes - hates,
      };
    });

    // Sort by net score (descending)
    perCandy.sort((a, b) => b.net - a.net);

    // Build perPerson stats
    const perPerson: PersonStats[] = (votes as Vote[]).map((vote) => {
      const hateSlug = normalizeCandyName(vote.hate_vote);
      const loveSlug = normalizeCandyName(vote.love_vote);

      return {
        name: vote.voter_name,
        avatar_url: getAvatarUrl(vote.voter_name),
        hate_vote: vote.hate_vote,
        love_vote: vote.love_vote,
        spicy_score: slugToLikes.get(hateSlug) || 0, // How many people loved what they hated
        pure_score: slugToHates.get(loveSlug) || 0,  // How many people hated what they loved
      };
    });

    // Find awards (handle ties)
    const maxLikes = Math.max(...perCandy.map((c) => c.likes), 0);
    const maxHates = Math.max(...perCandy.map((c) => c.hates), 0);
    const maxSpicyScore = Math.max(...perPerson.map((p) => p.spicy_score), 0);
    const maxPureScore = Math.max(...perPerson.map((p) => p.pure_score), 0);

    const most_loved = perCandy
      .filter((c) => c.likes === maxLikes && maxLikes > 0)
      .map((c) => ({
        candy: c.candy,
        likes: c.likes,
        hates: c.hates,
        net: c.net,
      }));

    const most_hated = perCandy
      .filter((c) => c.hates === maxHates && maxHates > 0)
      .map((c) => ({
        candy: c.candy,
        likes: c.likes,
        hates: c.hates,
        net: c.net,
      }));

    const spiciest_take = perPerson
      .filter((p) => p.spicy_score === maxSpicyScore && maxSpicyScore > 0)
      .map((p) => ({
        name: p.name,
        avatar_url: p.avatar_url,
        hate_vote: p.hate_vote,
        spicy_score: p.spicy_score,
      }));

    const purest_heart = perPerson
      .filter((p) => p.pure_score === maxPureScore && maxPureScore > 0)
      .map((p) => ({
        name: p.name,
        avatar_url: p.avatar_url,
        love_vote: p.love_vote,
        pure_score: p.pure_score,
      }));

    const response: StatsResponse = {
      awards: {
        most_loved,
        most_hated,
        spiciest_take,
        purest_heart,
      },
      perCandy,
      perPerson,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
