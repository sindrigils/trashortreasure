'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AwardCardProps {
  title: string;
  emoji: string;
  winners: Array<{
    candy?: string;
    name?: string;
    hate_vote?: string;
    love_vote?: string;
    likes?: number;
    hates?: number;
    net?: number;
    spicy_score?: number;
    pure_score?: number;
  }>;
  delay?: number;
}

export function AwardCard({ title, emoji, winners, delay = 0 }: AwardCardProps) {
  const hasWinners = winners && winners.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="text-2xl px-3 py-1">
              {emoji}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!hasWinners ? (
            <p className="text-muted-foreground text-center">—</p>
          ) : (
            <div className="space-y-3">
              {winners.map((winner, idx) => (
                <div key={idx} className="space-y-1">
                  {/* Candy awards */}
                  {winner.candy && (
                    <>
                      <p className="font-bold text-2xl">{winner.candy}</p>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        {winner.likes !== undefined && (
                          <span>👍 {winner.likes}</span>
                        )}
                        {winner.hates !== undefined && (
                          <span>👎 {winner.hates}</span>
                        )}
                        {winner.net !== undefined && (
                          <span className={winner.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                            Net: {winner.net > 0 ? '+' : ''}{winner.net}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {/* Person awards */}
                  {winner.name && (
                    <>
                      <p className="font-bold text-2xl">{winner.name}</p>
                      {winner.hate_vote && (
                        <p className="text-sm text-muted-foreground">
                          Hated: {winner.hate_vote}
                        </p>
                      )}
                      {winner.love_vote && (
                        <p className="text-sm text-muted-foreground">
                          Loved: {winner.love_vote}
                        </p>
                      )}
                      {winner.spicy_score !== undefined && (
                        <p className="text-sm font-medium">
                          Score: {winner.spicy_score}
                        </p>
                      )}
                      {winner.pure_score !== undefined && (
                        <p className="text-sm font-medium">
                          Score: {winner.pure_score}
                        </p>
                      )}
                    </>
                  )}
                  {idx < winners.length - 1 && (
                    <div className="border-t pt-2 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
