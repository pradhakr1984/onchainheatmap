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

export default function Heatmap({ onCellClick }: HeatmapProps) {
  // Top 20 cryptocurrencies by market cap - all values in millions
  const mockData = [
    // BTC
    { asset: 'BTC', cohort: 'exchanges', value: 250, color: 'bg-green-500' },
    { asset: 'BTC', cohort: 'whales', value: -180, color: 'bg-red-500' },
    { asset: 'BTC', cohort: 'miners', value: 120, color: 'bg-green-400' },
    { asset: 'BTC', cohort: 'smart-contracts', value: -50, color: 'bg-red-400' },
    { asset: 'BTC', cohort: 'retail', value: 30, color: 'bg-green-300' },
    
    // ETH
    { asset: 'ETH', cohort: 'exchanges', value: 180, color: 'bg-green-500' },
    { asset: 'ETH', cohort: 'whales', value: -220, color: 'bg-red-500' },
    { asset: 'ETH', cohort: 'miners', value: 80, color: 'bg-green-400' },
    { asset: 'ETH', cohort: 'smart-contracts', value: 350, color: 'bg-green-600' },
    { asset: 'ETH', cohort: 'retail', value: -40, color: 'bg-red-300' },
    
    // SOL
    { asset: 'SOL', cohort: 'exchanges', value: 90, color: 'bg-green-400' },
    { asset: 'SOL', cohort: 'whales', value: -120, color: 'bg-red-400' },
    { asset: 'SOL', cohort: 'miners', value: 45, color: 'bg-green-300' },
    { asset: 'SOL', cohort: 'smart-contracts', value: 180, color: 'bg-green-500' },
    { asset: 'SOL', cohort: 'retail', value: -25, color: 'bg-red-300' },
    
    // XRP
    { asset: 'XRP', cohort: 'exchanges', value: 60, color: 'bg-green-400' },
    { asset: 'XRP', cohort: 'whales', value: -90, color: 'bg-red-400' },
    { asset: 'XRP', cohort: 'miners', value: 30, color: 'bg-green-300' },
    { asset: 'XRP', cohort: 'smart-contracts', value: 120, color: 'bg-green-500' },
    { asset: 'XRP', cohort: 'retail', value: -15, color: 'bg-red-300' },
    
    // USDT
    { asset: 'USDT', cohort: 'exchanges', value: 400, color: 'bg-green-600' },
    { asset: 'USDT', cohort: 'whales', value: -600, color: 'bg-red-600' },
    { asset: 'USDT', cohort: 'miners', value: 150, color: 'bg-green-500' },
    { asset: 'USDT', cohort: 'smart-contracts', value: 500, color: 'bg-green-600' },
    { asset: 'USDT', cohort: 'retail', value: -80, color: 'bg-red-400' },
    
    // USDC
    { asset: 'USDC', cohort: 'exchanges', value: 320, color: 'bg-green-500' },
    { asset: 'USDC', cohort: 'whales', value: -450, color: 'bg-red-500' },
    { asset: 'USDC', cohort: 'miners', value: 120, color: 'bg-green-400' },
    { asset: 'USDC', cohort: 'smart-contracts', value: 420, color: 'bg-green-600' },
    { asset: 'USDC', cohort: 'retail', value: -60, color: 'bg-red-400' },
    
    // BNB
    { asset: 'BNB', cohort: 'exchanges', value: 150, color: 'bg-green-500' },
    { asset: 'BNB', cohort: 'whales', value: -200, color: 'bg-red-500' },
    { asset: 'BNB', cohort: 'miners', value: 75, color: 'bg-green-400' },
    { asset: 'BNB', cohort: 'smart-contracts', value: 280, color: 'bg-green-600' },
    { asset: 'BNB', cohort: 'retail', value: -35, color: 'bg-red-300' },
    
    // ADA
    { asset: 'ADA', cohort: 'exchanges', value: 85, color: 'bg-green-400' },
    { asset: 'ADA', cohort: 'whales', value: -110, color: 'bg-red-400' },
    { asset: 'ADA', cohort: 'miners', value: 40, color: 'bg-green-300' },
    { asset: 'ADA', cohort: 'smart-contracts', value: 160, color: 'bg-green-500' },
    { asset: 'ADA', cohort: 'retail', value: -20, color: 'bg-red-300' },
    
    // AVAX
    { asset: 'AVAX', cohort: 'exchanges', value: 70, color: 'bg-green-400' },
    { asset: 'AVAX', cohort: 'whales', value: -95, color: 'bg-red-400' },
    { asset: 'AVAX', cohort: 'miners', value: 35, color: 'bg-green-300' },
    { asset: 'AVAX', cohort: 'smart-contracts', value: 140, color: 'bg-green-500' },
    { asset: 'AVAX', cohort: 'retail', value: -18, color: 'bg-red-300' },
    
    // DOGE
    { asset: 'DOGE', cohort: 'exchanges', value: 45, color: 'bg-green-400' },
    { asset: 'DOGE', cohort: 'whales', value: -65, color: 'bg-red-400' },
    { asset: 'DOGE', cohort: 'miners', value: 25, color: 'bg-green-300' },
    { asset: 'DOGE', cohort: 'smart-contracts', value: 90, color: 'bg-green-500' },
    { asset: 'DOGE', cohort: 'retail', value: -12, color: 'bg-red-300' },
    
    // MATIC
    { asset: 'MATIC', cohort: 'exchanges', value: 55, color: 'bg-green-400' },
    { asset: 'MATIC', cohort: 'whales', value: -75, color: 'bg-red-400' },
    { asset: 'MATIC', cohort: 'miners', value: 30, color: 'bg-green-300' },
    { asset: 'MATIC', cohort: 'smart-contracts', value: 110, color: 'bg-green-500' },
    { asset: 'MATIC', cohort: 'retail', value: -15, color: 'bg-red-300' },
    
    // DOT
    { asset: 'DOT', cohort: 'exchanges', value: 65, color: 'bg-green-400' },
    { asset: 'DOT', cohort: 'whales', value: -85, color: 'bg-red-400' },
    { asset: 'DOT', cohort: 'miners', value: 32, color: 'bg-green-300' },
    { asset: 'DOT', cohort: 'smart-contracts', value: 130, color: 'bg-green-500' },
    { asset: 'DOT', cohort: 'retail', value: -16, color: 'bg-red-300' },
    
    // LINK
    { asset: 'LINK', cohort: 'exchanges', value: 75, color: 'bg-green-400' },
    { asset: 'LINK', cohort: 'whales', value: -100, color: 'bg-red-400' },
    { asset: 'LINK', cohort: 'miners', value: 38, color: 'bg-green-300' },
    { asset: 'LINK', cohort: 'smart-contracts', value: 150, color: 'bg-green-500' },
    { asset: 'LINK', cohort: 'retail', value: -19, color: 'bg-red-300' },
    
    // UNI
    { asset: 'UNI', cohort: 'exchanges', value: 50, color: 'bg-green-400' },
    { asset: 'UNI', cohort: 'whales', value: -70, color: 'bg-red-400' },
    { asset: 'UNI', cohort: 'miners', value: 28, color: 'bg-green-300' },
    { asset: 'UNI', cohort: 'smart-contracts', value: 100, color: 'bg-green-500' },
    { asset: 'UNI', cohort: 'retail', value: -14, color: 'bg-red-300' },
    
    // ATOM
    { asset: 'ATOM', cohort: 'exchanges', value: 60, color: 'bg-green-400' },
    { asset: 'ATOM', cohort: 'whales', value: -80, color: 'bg-red-400' },
    { asset: 'ATOM', cohort: 'miners', value: 35, color: 'bg-green-300' },
    { asset: 'ATOM', cohort: 'smart-contracts', value: 120, color: 'bg-green-500' },
    { asset: 'ATOM', cohort: 'retail', value: -17, color: 'bg-red-300' },
    
    // LTC
    { asset: 'LTC', cohort: 'exchanges', value: 40, color: 'bg-green-400' },
    { asset: 'LTC', cohort: 'whales', value: -55, color: 'bg-red-400' },
    { asset: 'LTC', cohort: 'miners', value: 22, color: 'bg-green-300' },
    { asset: 'LTC', cohort: 'smart-contracts', value: 80, color: 'bg-green-500' },
    { asset: 'LTC', cohort: 'retail', value: -11, color: 'bg-red-300' },
    
    // ETC
    { asset: 'ETC', cohort: 'exchanges', value: 35, color: 'bg-green-400' },
    { asset: 'ETC', cohort: 'whales', value: -50, color: 'bg-red-400' },
    { asset: 'ETC', cohort: 'miners', value: 20, color: 'bg-green-300' },
    { asset: 'ETC', cohort: 'smart-contracts', value: 70, color: 'bg-green-500' },
    { asset: 'ETC', cohort: 'retail', value: -10, color: 'bg-red-300' },
    
    // XLM
    { asset: 'XLM', cohort: 'exchanges', value: 30, color: 'bg-green-400' },
    { asset: 'XLM', cohort: 'whales', value: -45, color: 'bg-red-400' },
    { asset: 'XLM', cohort: 'miners', value: 18, color: 'bg-green-300' },
    { asset: 'XLM', cohort: 'smart-contracts', value: 60, color: 'bg-green-500' },
    { asset: 'XLM', cohort: 'retail', value: -9, color: 'bg-red-300' },
    
    // ALGO
    { asset: 'ALGO', cohort: 'exchanges', value: 25, color: 'bg-green-400' },
    { asset: 'ALGO', cohort: 'whales', value: -40, color: 'bg-red-400' },
    { asset: 'ALGO', cohort: 'miners', value: 15, color: 'bg-green-300' },
    { asset: 'ALGO', cohort: 'smart-contracts', value: 50, color: 'bg-green-500' },
    { asset: 'ALGO', cohort: 'retail', value: -8, color: 'bg-red-300' },
  ];

  const assets = [
    'BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC', 'BNB', 'ADA', 'AVAX', 'DOGE',
    'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM', 'LTC', 'ETC', 'XLM', 'ALGO'
  ];
  const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];

  // Uniform formatting - all values in millions (M)
  const formatValue = (value: number) => {
    const absValue = Math.abs(value);
    return `$${absValue.toFixed(0)}M`;
  };

  return (
    <div className="w-full">
      {/* Compact Debug info */}
      <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
        <strong>Heatmap:</strong> {mockData.length} data points • Top 19 cryptocurrencies • All values in millions (M)
      </div>

      {/* Transposed Table - Cryptocurrencies as rows, Cohorts as columns */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Header */}
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 text-left font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300 text-sm">
                Asset
              </th>
              {cohorts.map(cohort => (
                <th key={cohort} className="p-2 text-center font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300 text-xs">
                  {cohort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Data Rows - Each cryptocurrency is a row */}
          <tbody>
            {assets.map(asset => (
              <tr key={asset} className="border-t border-gray-300">
                <td className="p-2 font-bold text-gray-700 dark:text-gray-300 border-r border-gray-300 text-sm">
                  {asset}
                </td>
                {cohorts.map(cohort => {
                  const cellData = mockData.find(d => d.asset === asset && d.cohort === cohort);
                  
                  if (!cellData) {
                    return (
                      <td key={cohort} className="p-2 text-center text-gray-400 border-r border-gray-300 text-xs">
                        N/A
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={cohort} 
                      className={`p-2 text-center cursor-pointer hover:scale-105 transition-transform border-r border-gray-300 ${cellData.color} min-w-[80px]`}
                      onClick={() => onCellClick?.({ ...cellData, date: new Date().toISOString(), yoyChange: 0 })}
                    >
                      <div className="text-white font-bold text-sm">
                        {cellData.value > 0 ? '+' : '-'}{formatValue(cellData.value)}
                      </div>
                      <div className="text-white/90 text-xs">
                        {cellData.value > 0 ? 'In' : 'Out'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
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