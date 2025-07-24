'use client';

import React from 'react';

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

export default function Heatmap({ data, selectedCohorts, onCellClick }: HeatmapProps) {
  // Get unique assets and cohorts
  const assets = ['BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC'];
  const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];

  // Create a simple color function
  const getColor = (value: number) => {
    if (value > 0) {
      // Green for positive (inflow)
      const intensity = Math.min(Math.abs(value) / 1000, 1);
      return `rgba(34, 197, 94, ${intensity})`;
    } else if (value < 0) {
      // Red for negative (outflow)
      const intensity = Math.min(Math.abs(value) / 1000, 1);
      return `rgba(239, 68, 68, ${intensity})`;
    }
    return '#6B7280'; // Gray for zero
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}B`;
    } else if (value >= 1) {
      return `$${value.toFixed(0)}M`;
    } else {
      return `$${(value * 1000).toFixed(0)}K`;
    }
  };

  return (
    <div className="w-full">
      {/* Debug info */}
      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
        <strong>Debug Info:</strong> {data.length} data points loaded
      </div>

      {/* Simple Table Layout */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cohort</th>
              {assets.map(asset => (
                <th key={asset} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  {asset}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Data Rows */}
          <tbody>
            {cohorts.map(cohort => (
              <tr key={cohort} className="border-t border-gray-200 dark:border-gray-600">
                <td className="p-3 font-medium text-gray-700 dark:text-gray-300">
                  {cohort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </td>
                {assets.map(asset => {
                  const cellData = data.find(d => d.asset === asset && d.cohort === cohort);
                  
                  if (!cellData) {
                    return (
                      <td key={asset} className="p-3 text-center text-gray-400">
                        N/A
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={asset} 
                      className="p-3 text-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onCellClick?.(cellData)}
                      style={{ backgroundColor: getColor(cellData.value) }}
                    >
                      <div className="text-white font-semibold">
                        {cellData.value > 0 ? '+' : ''}{formatValue(cellData.value)}
                      </div>
                      {cellData.yoyChange && (
                        <div className="text-xs text-white/80">
                          {cellData.yoyChange > 0 ? '+' : ''}{cellData.yoyChange.toFixed(1)}%
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Inflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Outflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Neutral</span>
        </div>
      </div>
    </div>
  );
} 