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
      <Card className="shadow-md border border-[#457b9d]/10 hover:shadow-lg transition-shadow">
        <CardHeader className="bg-[#1d3557]/5 border-b border-[#1d3557]/10">
          <CardTitle className="text-lg text-[#1d3557] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#e63946]">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" x2="18" y1="12" y2="12"></line>
              <line x1="6" x2="2" y1="12" y2="12"></line>
              <line x1="12" x2="12" y1="6" y2="2"></line>
              <line x1="12" x2="12" y1="22" y2="18"></line>
            </svg>
            進球統計
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStatsSummaries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-30} 
                textAnchor="end" 
                height={70} 
                interval={0} 
                tick={{ fontSize: '0.75rem', fill: '#333' }}
                stroke="#ccc" 
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: '0.75rem', fill: '#333' }}
                stroke="#ccc"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }} 
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="goals" fill="#1d3557" name="進球" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-[#457b9d]/10 hover:shadow-lg transition-shadow">
        <CardHeader className="bg-[#1d3557]/5 border-b border-[#1d3557]/10">
          <CardTitle className="text-lg text-[#1d3557] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#457b9d]">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            助攻統計
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStatsSummaries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-30} 
                textAnchor="end" 
                height={70} 
                interval={0} 
                tick={{ fontSize: '0.75rem', fill: '#333' }}
                stroke="#ccc" 
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: '0.75rem', fill: '#333' }}
                stroke="#ccc"
              />              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }} 
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="assists" fill="#457b9d" name="助攻" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="text-xs text-gray-500 text-center mt-4 pt-2 border-t border-gray-100">
            資料來源: 球隊比賽數據庫 · {new Date().getFullYear()} 年
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
