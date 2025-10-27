'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  className?: string;
}

export function AwardCard({
  title,
  emoji,
  winners,
  delay = 0,
  className,
}: AwardCardProps) {
  const hasWinners = winners && winners.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn('h-full bg-white/5 border-white/10 backdrop-blur-sm shadow-lg shadow-black/30', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">{title}</CardTitle>
            <Badge className="border-white/10 bg-white/10 text-2xl px-3 py-1 text-white">
              {emoji}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {!hasWinners ? (
            <p className="text-slate-400 text-center">—</p>
          ) : (
            <div className="space-y-3">
              {winners.map((winner, idx) => (
                <div key={idx} className="space-y-1">
                  {/* Candy awards */}
                  {winner.candy && (
                    <>
                      <p className="font-bold text-xl text-white">{winner.candy}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                        {winner.likes !== undefined && (
                          <span>👍 {winner.likes}</span>
                        )}
                        {winner.hates !== undefined && (
                          <span>👎 {winner.hates}</span>
                        )}
                        {winner.net !== undefined && (
                          <span className={winner.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            Net: {winner.net > 0 ? '+' : ''}{winner.net}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {/* Person awards */}
                  {winner.name && (
                    <>
                      <p className="font-bold text-xl text-white">{winner.name}</p>
                      {winner.hate_vote && (
                        <p className="text-sm text-slate-300">
                          Hated: {winner.hate_vote}
                        </p>
                      )}
                      {winner.love_vote && (
                        <p className="text-sm text-slate-300">
                          Loved: {winner.love_vote}
                        </p>
                      )}
                      {winner.spicy_score !== undefined && (
                        <p className="text-sm font-medium text-emerald-300">
                          Score: {winner.spicy_score}
                        </p>
                      )}
                      {winner.pure_score !== undefined && (
                        <p className="text-sm font-medium text-sky-300">
                          Score: {winner.pure_score}
                        </p>
                      )}
                    </>
                  )}
                  {idx < winners.length - 1 && (
                    <div className="border-t border-white/10 pt-2 mt-2" />
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
