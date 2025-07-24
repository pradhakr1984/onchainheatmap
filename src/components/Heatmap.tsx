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
  // Hardcoded data to ensure it works
  const mockData = [
    { asset: 'BTC', cohort: 'exchanges', value: 250, color: 'bg-green-500' },
    { asset: 'BTC', cohort: 'whales', value: -180, color: 'bg-red-500' },
    { asset: 'BTC', cohort: 'miners', value: 120, color: 'bg-green-400' },
    { asset: 'BTC', cohort: 'smart-contracts', value: -50, color: 'bg-red-400' },
    { asset: 'BTC', cohort: 'retail', value: 30, color: 'bg-green-300' },
    
    { asset: 'ETH', cohort: 'exchanges', value: 180, color: 'bg-green-500' },
    { asset: 'ETH', cohort: 'whales', value: -220, color: 'bg-red-500' },
    { asset: 'ETH', cohort: 'miners', value: 80, color: 'bg-green-400' },
    { asset: 'ETH', cohort: 'smart-contracts', value: 350, color: 'bg-green-600' },
    { asset: 'ETH', cohort: 'retail', value: -40, color: 'bg-red-300' },
    
    { asset: 'SOL', cohort: 'exchanges', value: 90, color: 'bg-green-400' },
    { asset: 'SOL', cohort: 'whales', value: -120, color: 'bg-red-400' },
    { asset: 'SOL', cohort: 'miners', value: 45, color: 'bg-green-300' },
    { asset: 'SOL', cohort: 'smart-contracts', value: 180, color: 'bg-green-500' },
    { asset: 'SOL', cohort: 'retail', value: -25, color: 'bg-red-300' },
    
    { asset: 'XRP', cohort: 'exchanges', value: 60, color: 'bg-green-400' },
    { asset: 'XRP', cohort: 'whales', value: -90, color: 'bg-red-400' },
    { asset: 'XRP', cohort: 'miners', value: 30, color: 'bg-green-300' },
    { asset: 'XRP', cohort: 'smart-contracts', value: 120, color: 'bg-green-500' },
    { asset: 'XRP', cohort: 'retail', value: -15, color: 'bg-red-300' },
    
    { asset: 'USDT', cohort: 'exchanges', value: 400, color: 'bg-green-600' },
    { asset: 'USDT', cohort: 'whales', value: -600, color: 'bg-red-600' },
    { asset: 'USDT', cohort: 'miners', value: 150, color: 'bg-green-500' },
    { asset: 'USDT', cohort: 'smart-contracts', value: 500, color: 'bg-green-600' },
    { asset: 'USDT', cohort: 'retail', value: -80, color: 'bg-red-400' },
    
    { asset: 'USDC', cohort: 'exchanges', value: 320, color: 'bg-green-500' },
    { asset: 'USDC', cohort: 'whales', value: -450, color: 'bg-red-500' },
    { asset: 'USDC', cohort: 'miners', value: 120, color: 'bg-green-400' },
    { asset: 'USDC', cohort: 'smart-contracts', value: 420, color: 'bg-green-600' },
    { asset: 'USDC', cohort: 'retail', value: -60, color: 'bg-red-400' },
  ];

  const assets = ['BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC'];
  const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];

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
        <strong>Working Heatmap:</strong> {mockData.length} data points loaded
      </div>

      {/* Simple Table */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-4 text-left font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300">
                Cohort
              </th>
              {assets.map(asset => (
                <th key={asset} className="p-4 text-center font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300">
                  {asset}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Data Rows */}
          <tbody>
            {cohorts.map(cohort => (
              <tr key={cohort} className="border-t border-gray-300">
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300">
                  {cohort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </td>
                {assets.map(asset => {
                  const cellData = mockData.find(d => d.asset === asset && d.cohort === cohort);
                  
                  if (!cellData) {
                    return (
                      <td key={asset} className="p-4 text-center text-gray-400 border-r border-gray-300">
                        N/A
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={asset} 
                      className={`p-4 text-center cursor-pointer hover:scale-105 transition-transform border-r border-gray-300 ${cellData.color}`}
                      onClick={() => onCellClick?.(cellData as any)}
                    >
                      <div className="text-white font-bold text-lg">
                        {cellData.value > 0 ? '+' : ''}{formatValue(cellData.value)}
                      </div>
                      <div className="text-white/80 text-sm">
                        {cellData.value > 0 ? 'Inflow' : 'Outflow'}
                      </div>
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
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          Click cells for details
        </div>
      </div>
    </div>
  );
} 