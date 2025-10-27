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
      <Card>
        <CardHeader>
          <CardTitle>Likes vs Hates</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="candyShort"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">{data.candy}</p>
                          <p className="text-sm text-green-600">
                            Likes: {data.likes}
                          </p>
                          <p className="text-sm text-red-600">
                            Hates: {data.hates}
                          </p>
                          <p className="text-sm font-medium">
                            Net: {data.net > 0 ? '+' : ''}{data.net}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="likes" fill="#22c55e" name="Likes" />
                <Bar dataKey="hates" fill="#ef4444" name="Hates" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
