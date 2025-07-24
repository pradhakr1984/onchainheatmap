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
      'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM', 'LTC', 'ETC', 'XLM', 'ALGO', 'VET',
      'ICP', 'FIL', 'TRX', 'NEAR', 'APT'
    ];
    const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
    
    // Calculate scale factor based on date range
    const daysDiff = startDate && endDate ? 
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 7;
    const scaleFactor = daysDiff / 7;
    
         const mockData: Array<{asset: string; cohort: string; value: number; color: string}> = [];
    
    // Base flow ranges (for 7 days) - Updated to reflect real ETF/institutional flows
    const baseFlowRanges = {
      'BTC': { exchanges: [800, 1200], whales: [-1200, -400], miners: [200, 400], 'smart-contracts': [-200, 200], retail: [100, 300] },
      'ETH': { exchanges: [600, 900], whales: [-900, -300], miners: [150, 300], 'smart-contracts': [400, 800], retail: [-200, 100] },
      'SOL': { exchanges: [300, 500], whales: [-600, -200], miners: [100, 200], 'smart-contracts': [300, 600], retail: [-150, 50] },
      'XRP': { exchanges: [200, 350], whales: [-450, -150], miners: [80, 150], 'smart-contracts': [200, 400], retail: [-100, 50] },
      'USDT': { exchanges: [1200, 1800], whales: [-2400, -800], miners: [400, 600], 'smart-contracts': [800, 1200], retail: [-300, -100] },
      'USDC': { exchanges: [1000, 1500], whales: [-1800, -600], miners: [300, 500], 'smart-contracts': [600, 1000], retail: [-250, -80] },
      'BNB': { exchanges: [400, 600], whales: [-700, -250], miners: [150, 250], 'smart-contracts': [400, 700], retail: [-120, 80] },
      'ADA': { exchanges: [250, 400], whales: [-500, -180], miners: [100, 180], 'smart-contracts': [250, 450], retail: [-80, 60] },
      'AVAX': { exchanges: [200, 350], whales: [-450, -150], miners: [80, 150], 'smart-contracts': [200, 400], retail: [-70, 50] },
      'DOGE': { exchanges: [150, 250], whales: [-300, -100], miners: [60, 100], 'smart-contracts': [150, 300], retail: [-50, 40] },
      'MATIC': { exchanges: [180, 300], whales: [-400, -120], miners: [70, 120], 'smart-contracts': [180, 350], retail: [-60, 50] },
      'DOT': { exchanges: [200, 350], whales: [-450, -150], miners: [80, 150], 'smart-contracts': [200, 400], retail: [-70, 50] },
      'LINK': { exchanges: [250, 400], whales: [-500, -180], miners: [100, 180], 'smart-contracts': [250, 450], retail: [-80, 60] },
      'UNI': { exchanges: [150, 250], whales: [-300, -100], miners: [60, 100], 'smart-contracts': [150, 300], retail: [-50, 40] },
      'ATOM': { exchanges: [180, 300], whales: [-400, -120], miners: [70, 120], 'smart-contracts': [180, 350], retail: [-60, 50] },
      'LTC': { exchanges: [120, 200], whales: [-250, -80], miners: [50, 80], 'smart-contracts': [120, 250], retail: [-40, 30] },
      'ETC': { exchanges: [100, 180], whales: [-220, -70], miners: [40, 70], 'smart-contracts': [100, 220], retail: [-35, 25] },
      'XLM': { exchanges: [80, 150], whales: [-180, -60], miners: [30, 60], 'smart-contracts': [80, 180], retail: [-30, 20] },
      'ALGO': { exchanges: [60, 120], whales: [-150, -50], miners: [25, 50], 'smart-contracts': [60, 150], retail: [-25, 15] },
      'VET': { exchanges: [100, 180], whales: [-220, -70], miners: [40, 70], 'smart-contracts': [100, 220], retail: [-35, 25] },
      'ICP': { exchanges: [80, 150], whales: [-180, -60], miners: [30, 60], 'smart-contracts': [80, 180], retail: [-30, 20] },
      'FIL': { exchanges: [60, 120], whales: [-150, -50], miners: [25, 50], 'smart-contracts': [60, 150], retail: [-25, 15] },
      'TRX': { exchanges: [120, 200], whales: [-250, -80], miners: [50, 80], 'smart-contracts': [120, 250], retail: [-40, 30] },
      'NEAR': { exchanges: [40, 80], whales: [-100, -30], miners: [15, 30], 'smart-contracts': [40, 100], retail: [-15, 10] },
      'APT': { exchanges: [30, 70], whales: [-80, -25], miners: [12, 25], 'smart-contracts': [30, 80], retail: [-12, 8] },
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
      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <strong>🌊 Fund Flow Heatmap:</strong> {mockData.length} data points • Top 25 cryptocurrencies • All values in millions (M) • 
            {startDate && endDate ? ` ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days` : ' 7 days'}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-blue-500 text-white px-3 py-1 rounded font-semibold whitespace-nowrap">BLUE = INFLOW</span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded font-semibold whitespace-nowrap">ORANGE = OUTFLOW</span>
          </div>
        </div>
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
                        <div className="text-white/90 text-xs font-semibold">
                          {cellData.value > 0 ? 'INFLOW' : 'OUTFLOW'}
                        </div>
                        <div className="text-white/80 text-xs">
                          {cellData.value > 0 ? 'Money In' : 'Money Out'}
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
                      {netFlow > 0 ? 'NET INFLOW' : netFlow < 0 ? 'NET OUTFLOW' : 'BALANCED'}
                    </div>
                    <div className="text-xs opacity-50">
                      (External Flow)
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Legend - Colorblind-friendly */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-2">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">📊 Flow Direction Guide</h4>
        </div>
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">IN</span>
            </div>
            <div className="text-left">
              <div className="text-gray-700 dark:text-gray-300 font-semibold">INFLOW</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">Money entering this cohort</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">OUT</span>
            </div>
            <div className="text-left">
              <div className="text-gray-700 dark:text-gray-300 font-semibold">OUTFLOW</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">Money leaving this cohort</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-2 text-gray-500 dark:text-gray-400 text-xs">
          💡 Click any cell for details • External Flow = Exchanges + Retail (money entering/leaving the crypto ecosystem)
        </div>
      </div>
    </div>
  );
} 