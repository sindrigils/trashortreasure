'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CandyData {
  candy: string;
  likes: number;
  hates: number;
  net: number;
}

interface LikeHateBarProps {
  data: CandyData[];
}

export function LikeHateBar({ data }: LikeHateBarProps) {
  // Truncate long candy names for chart display
  const chartData = data.map((item) => ({
    ...item,
    candyShort: item.candy.length > 15 ? item.candy.slice(0, 15) + '...' : item.candy,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-white">Likes vs. Hates</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  dataKey="candyShort"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12, fill: '#cbd5f5' }}
                />
                <YAxis tick={{ fill: '#cbd5f5' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-white/10 bg-slate-950/90 p-3 shadow-xl backdrop-blur">
                          <p className="font-semibold text-white">{data.candy}</p>
                          <p className="text-sm text-emerald-400">
                            Likes: {data.likes}
                          </p>
                          <p className="text-sm text-rose-400">
                            Hates: {data.hates}
                          </p>
                          <p className="text-sm font-medium text-slate-200">
                            Net: {data.net > 0 ? '+' : ''}{data.net}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#cbd5f5' }}
                  iconType="circle"
                />
                <Bar dataKey="likes" fill="url(#likesGradient)" name="Likes" radius={[8, 8, 0, 0]} />
                <Bar dataKey="hates" fill="url(#hatesGradient)" name="Hates" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  <linearGradient id="hatesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
