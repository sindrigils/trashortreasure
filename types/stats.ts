export interface AwardEntry {
  candy?: string;
  name?: string;
  hate_vote?: string;
  love_vote?: string;
  likes?: number;
  hates?: number;
  net?: number;
  spicy_score?: number;
  pure_score?: number;
}

export interface StatsData {
  awards: {
    most_loved: AwardEntry[];
    most_hated: AwardEntry[];
    spiciest_take: AwardEntry[];
    purest_heart: AwardEntry[];
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
