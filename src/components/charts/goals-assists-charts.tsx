"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/lib/types';

interface PlayerStatsSummary {
  name: string;
  goals: number;
  assists: number;
}

interface GoalsAssistsChartsProps {
  playerStatsSummaries: PlayerStatsSummary[];
}

export function GoalsAssistsCharts({ playerStatsSummaries }: GoalsAssistsChartsProps) {
  if (playerStatsSummaries.length === 0) {
    return <p className="text-center text-muted-foreground py-4">無球員數據可供繪製圖表。</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">進球統計</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStatsSummaries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} tick={{ fontSize: '0.75rem' }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="goals" fill="hsl(var(--primary))" name="進球" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">助攻統計</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStatsSummaries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} tick={{ fontSize: '0.75rem' }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="assists" fill="hsl(var(--secondary))" name="助攻" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
