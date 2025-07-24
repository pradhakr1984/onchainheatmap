'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, Surface } from 'recharts';
import { format } from 'date-fns';

export interface HeatmapData {
  asset: string;
  cohort: string;
  value: number;
  date: string;
  formattedValue?: string;
  yoyChange?: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  selectedCohorts: string[];
  onCellClick?: (data: HeatmapData) => void;
}

// Custom color scale using d3-scale logic
const getColorScale = (min: number, max: number) => {
  const absMax = Math.max(Math.abs(min), Math.abs(max));
  
  return (value: number) => {
    if (value === 0) return '#374151'; // Neutral gray for zero
    
    const normalized = value / absMax;
    
    if (value > 0) {
      // Green scale for positive values (inflows)
      const intensity = Math.min(Math.abs(normalized), 1);
      return `rgb(${Math.floor(34 * (1 - intensity))}, ${Math.floor(197 * intensity + 58)}, ${Math.floor(94 * intensity + 58)})`;
    } else {
      // Red scale for negative values (outflows)
      const intensity = Math.min(Math.abs(normalized), 1);
      return `rgb(${Math.floor(239 * intensity + 16)}, ${Math.floor(68 * intensity + 32)}, ${Math.floor(68 * intensity + 32)})`;
    }
  };
};

export default function Heatmap({ data, selectedCohorts, onCellClick }: HeatmapProps) {
  const processedData = useMemo(() => {
    if (!data.length) return [];
    
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));
    const colorScale = getColorScale(min, max);
    
    return data.map(item => ({
      ...item,
      color: colorScale(item.value),
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(item.value),
    }));
  }, [data]);

  const assets = useMemo(() => {
    return [...new Set(data.map(d => d.asset))].sort();
  }, [data]);

  const cohorts = useMemo(() => {
    return [...new Set(data.map(d => d.cohort))].filter(c => selectedCohorts.includes(c));
  }, [data, selectedCohorts]);

  if (!processedData.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No data available</div>
          <div className="text-gray-500 text-sm">Select time range and cohorts to view flows</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <Surface width={800} height={400}>
          <div className="grid gap-1 p-4">
            {/* Header row with asset names */}
            <div className="grid grid-cols-1 gap-1 mb-2">
              <div className="h-8"></div> {/* Empty corner */}
              {assets.map(asset => (
                <div key={asset} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  {asset}
                </div>
              ))}
            </div>
            
            {/* Data rows */}
            {cohorts.map((cohort) => (
              <div key={cohort} className="grid grid-cols-1 gap-1">
                {/* Cohort label */}
                <div className="h-8 flex items-center justify-start text-xs font-medium text-gray-600 dark:text-gray-300 pr-2">
                  {cohort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                
                {/* Data cells */}
                {assets.map((asset) => {
                  const cellData = processedData.find(
                    d => d.asset === asset && d.cohort === cohort
                  );
                  
                  if (!cellData) return <div key={asset} className="h-8" />;
                  
                  return (
                    <div
                      key={asset}
                      className="h-8 relative group cursor-pointer"
                      onClick={() => onCellClick?.(cellData)}
                    >
                      <div
                        className="w-full h-full rounded transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: cellData.color }}
                      >
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                          {cellData.value > 0 ? '+' : ''}{cellData.formattedValue}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium">{asset} → {cohort}</div>
                        <div className="text-gray-300">{cellData.formattedValue}</div>
                        <div className="text-gray-400">
                          {format(new Date(cellData.date), 'MMM dd, yyyy')}
                        </div>
                        {cellData.yoyChange && (
                          <div className={`text-xs ${cellData.yoyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            YoY: {cellData.yoyChange > 0 ? '+' : ''}{cellData.yoyChange.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Surface>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Inflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Outflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Neutral</span>
        </div>
      </div>
    </div>
  );
} 