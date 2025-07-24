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
  startDate?: Date;
  endDate?: Date;
}

export default function Heatmap({ onCellClick, startDate, endDate }: HeatmapProps) {
  // Generate data based on date range
  const generateMockData = () => {
    const assets = [
      'BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC', 'BNB', 'ADA', 'AVAX', 'DOGE',
      'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM', 'LTC', 'ETC', 'XLM', 'ALGO'
    ];
    const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
    
    // Calculate scale factor based on date range
    const daysDiff = startDate && endDate ? 
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 7;
    const scaleFactor = daysDiff / 7;
    
         const mockData: Array<{asset: string; cohort: string; value: number; color: string}> = [];
    
    // Base flow ranges (for 7 days)
    const baseFlowRanges = {
      'BTC': { exchanges: [200, 300], whales: [-300, -100], miners: [80, 150], 'smart-contracts': [-80, 50], retail: [20, 60] },
      'ETH': { exchanges: [150, 250], whales: [-250, -150], miners: [60, 120], 'smart-contracts': [200, 400], retail: [-60, 20] },
      'SOL': { exchanges: [70, 120], whales: [-150, -80], miners: [30, 60], 'smart-contracts': [120, 200], retail: [-40, 10] },
      'XRP': { exchanges: [50, 90], whales: [-120, -60], miners: [20, 45], 'smart-contracts': [80, 150], retail: [-30, 15] },
      'USDT': { exchanges: [300, 500], whales: [-700, -400], miners: [100, 200], 'smart-contracts': [400, 600], retail: [-100, -40] },
      'USDC': { exchanges: [250, 400], whales: [-600, -300], miners: [80, 180], 'smart-contracts': [300, 500], retail: [-80, -30] },
      'BNB': { exchanges: [120, 180], whales: [-250, -150], miners: [50, 90], 'smart-contracts': [200, 300], retail: [-50, 20] },
      'ADA': { exchanges: [60, 100], whales: [-140, -80], miners: [25, 55], 'smart-contracts': [100, 180], retail: [-35, 15] },
      'AVAX': { exchanges: [50, 90], whales: [-120, -70], miners: [20, 45], 'smart-contracts': [90, 160], retail: [-30, 10] },
      'DOGE': { exchanges: [30, 60], whales: [-80, -40], miners: [15, 30], 'smart-contracts': [60, 100], retail: [-20, 10] },
      'MATIC': { exchanges: [40, 75], whales: [-100, -50], miners: [20, 40], 'smart-contracts': [80, 130], retail: [-25, 15] },
      'DOT': { exchanges: [45, 80], whales: [-110, -60], miners: [22, 42], 'smart-contracts': [90, 140], retail: [-28, 12] },
      'LINK': { exchanges: [55, 95], whales: [-130, -70], miners: [25, 48], 'smart-contracts': [100, 160], retail: [-32, 14] },
      'UNI': { exchanges: [35, 65], whales: [-90, -45], miners: [18, 33], 'smart-contracts': [70, 110], retail: [-22, 9] },
      'ATOM': { exchanges: [40, 75], whales: [-100, -55], miners: [20, 40], 'smart-contracts': [80, 130], retail: [-27, 11] },
      'LTC': { exchanges: [25, 50], whales: [-70, -35], miners: [12, 26], 'smart-contracts': [50, 90], retail: [-18, 7] },
      'ETC': { exchanges: [20, 45], whales: [-65, -30], miners: [10, 23], 'smart-contracts': [45, 80], retail: [-16, 6] },
      'XLM': { exchanges: [15, 40], whales: [-60, -25], miners: [8, 20], 'smart-contracts': [40, 70], retail: [-14, 5] },
      'ALGO': { exchanges: [12, 35], whales: [-55, -20], miners: [6, 18], 'smart-contracts': [35, 60], retail: [-12, 4] },
    };

    assets.forEach(asset => {
      cohorts.forEach(cohort => {
        const range = baseFlowRanges[asset as keyof typeof baseFlowRanges]?.[cohort as keyof typeof baseFlowRanges.BTC] || [-100, 100];
        const baseValue = Math.random() * (range[1] - range[0]) + range[0];
        const scaledValue = Math.round(baseValue * scaleFactor);
        
        // Determine color based on value - Colorblind-friendly scheme
        let color = 'bg-gray-400';
        if (scaledValue > 0) {
          if (scaledValue > 200) color = 'bg-blue-600 text-white';
          else if (scaledValue > 100) color = 'bg-blue-500 text-white';
          else color = 'bg-blue-400 text-white';
        } else {
          if (scaledValue < -200) color = 'bg-orange-600 text-white';
          else if (scaledValue < -100) color = 'bg-orange-500 text-white';
          else color = 'bg-orange-400 text-white';
        }
        
        mockData.push({
          asset,
          cohort,
          value: scaledValue,
          color
        });
      });
    });
    
    return mockData;
  };

  const mockData = generateMockData();

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

  // Calculate net flow for each asset - focusing on external flows
  const getNetFlow = (asset: string) => {
    const assetData = mockData.filter(d => d.asset === asset);
    
    // Focus on external flows (exchanges and retail) as they represent money entering/leaving the ecosystem
    // Internal transfers between whales, miners, and smart contracts are excluded from net flow
    const externalFlows = assetData.filter(d => d.cohort === 'exchanges' || d.cohort === 'retail');
    return externalFlows.reduce((sum, d) => sum + d.value, 0);
  };

  // Calculate total ecosystem flow (all cohorts) for comparison
  const getTotalFlow = (asset: string) => {
    const assetData = mockData.filter(d => d.asset === asset);
    return assetData.reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div className="w-full">
      {/* Compact Debug info */}
      <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
        <strong>Heatmap:</strong> {mockData.length} data points • Top 19 cryptocurrencies • All values in millions (M) • 
        {startDate && endDate ? ` ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days` : ' 7 days'}
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
              <th className="p-2 text-center font-bold text-gray-700 dark:text-gray-300 border-l border-gray-300 text-sm bg-gray-200 dark:bg-gray-600">
                EXTERNAL FLOW
              </th>
            </tr>
          </thead>
          
          {/* Data Rows - Each cryptocurrency is a row */}
          <tbody>
            {assets.map(asset => {
              const netFlow = getNetFlow(asset);
              return (
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
                  {/* Net Flow Summary */}
                  <td className={`p-2 text-center font-bold border-l border-gray-300 text-sm ${
                    netFlow > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                    netFlow < 0 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    <div className="font-bold">
                      {netFlow > 0 ? '+' : ''}{formatValue(netFlow)}
                    </div>
                    <div className="text-xs opacity-75">
                      {netFlow > 0 ? 'Net Inflow' : netFlow < 0 ? 'Net Outflow' : 'Balanced'}
                    </div>
                    <div className="text-xs opacity-50">
                      (Exchanges + Retail)
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Legend - Colorblind-friendly */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Inflow (Money Entering)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Outflow (Money Leaving)</span>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          Click cells for details • External Flow = Exchanges + Retail (money entering/leaving ecosystem)
        </div>
      </div>
    </div>
  );
} 