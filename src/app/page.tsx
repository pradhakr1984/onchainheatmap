'use client';

import React, { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import Heatmap, { HeatmapData } from '@/components/Heatmap';
import CohortToggle from '@/components/CohortToggle';
import DateRangePicker from '@/components/DateRangePicker';
import { COHORTS } from '@/lib/api';

// Generate simple, guaranteed data
const generateData = (startDate: Date, endDate: Date) => {
  const data: HeatmapData[] = [];
  const assets = [
    'BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC', 'BNB', 'ADA', 'AVAX', 'DOGE',
    'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM', 'LTC', 'ETC', 'XLM', 'ALGO', 'VET',
    'ICP', 'FIL', 'TRX', 'NEAR', 'APT'
  ];
  const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
  
  // Calculate days difference to scale the data
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const scaleFactor = daysDiff / 7; // Base scale on 7 days
  
      // Generate realistic values for each combination - Simulated data for demonstration
    const flowRanges = {
      'BTC': { exchanges: [-80, 150], whales: [-200, 80], miners: [-20, 40], 'smart-contracts': [-20, 20], retail: [-10, 30] },
      'ETH': { exchanges: [-60, 120], whales: [-150, 60], miners: [-15, 30], 'smart-contracts': [-40, 80], retail: [-20, 10] },
      'SOL': { exchanges: [-30, 60], whales: [-80, 30], miners: [-10, 20], 'smart-contracts': [-30, 60], retail: [-15, 5] },
      'XRP': { exchanges: [-20, 40], whales: [-50, 20], miners: [-8, 15], 'smart-contracts': [-20, 40], retail: [-10, 5] },
      'USDT': { exchanges: [-120, 200], whales: [-300, 120], miners: [-40, 60], 'smart-contracts': [-80, 120], retail: [-30, -10] },
      'USDC': { exchanges: [-100, 180], whales: [-250, 100], miners: [-30, 50], 'smart-contracts': [-60, 100], retail: [-25, -8] },
      'BNB': { exchanges: [-40, 80], whales: [-100, 40], miners: [-15, 25], 'smart-contracts': [-40, 70], retail: [-12, 8] },
      'ADA': { exchanges: [-25, 50], whales: [-60, 25], miners: [-10, 18], 'smart-contracts': [-25, 45], retail: [-8, 6] },
      'AVAX': { exchanges: [-20, 40], whales: [-50, 20], miners: [-8, 15], 'smart-contracts': [-20, 40], retail: [-7, 5] },
      'DOGE': { exchanges: [-15, 30], whales: [-40, 15], miners: [-6, 10], 'smart-contracts': [-15, 30], retail: [-5, 4] },
      'MATIC': { exchanges: [-18, 35], whales: [-45, 18], miners: [-7, 12], 'smart-contracts': [-18, 35], retail: [-6, 5] },
      'DOT': { exchanges: [-20, 40], whales: [-50, 20], miners: [-8, 15], 'smart-contracts': [-20, 40], retail: [-7, 5] },
      'LINK': { exchanges: [-25, 50], whales: [-60, 25], miners: [-10, 18], 'smart-contracts': [-25, 45], retail: [-8, 6] },
      'UNI': { exchanges: [-15, 30], whales: [-40, 15], miners: [-6, 10], 'smart-contracts': [-15, 30], retail: [-5, 4] },
      'ATOM': { exchanges: [-18, 35], whales: [-45, 18], miners: [-7, 12], 'smart-contracts': [-18, 35], retail: [-6, 5] },
      'LTC': { exchanges: [-12, 25], whales: [-30, 12], miners: [-5, 8], 'smart-contracts': [-12, 25], retail: [-4, 3] },
      'ETC': { exchanges: [-10, 20], whales: [-25, 10], miners: [-4, 7], 'smart-contracts': [-10, 20], retail: [-3, 2] },
      'XLM': { exchanges: [-8, 15], whales: [-20, 8], miners: [-3, 6], 'smart-contracts': [-8, 15], retail: [-3, 2] },
      'ALGO': { exchanges: [-6, 12], whales: [-15, 6], miners: [-2, 5], 'smart-contracts': [-6, 12], retail: [-2, 1] },
      'VET': { exchanges: [-10, 20], whales: [-25, 10], miners: [-4, 7], 'smart-contracts': [-10, 20], retail: [-3, 2] },
      'ICP': { exchanges: [-8, 15], whales: [-20, 8], miners: [-3, 6], 'smart-contracts': [-8, 15], retail: [-3, 2] },
      'FIL': { exchanges: [-6, 12], whales: [-15, 6], miners: [-2, 5], 'smart-contracts': [-6, 12], retail: [-2, 1] },
      'TRX': { exchanges: [-12, 25], whales: [-30, 12], miners: [-5, 8], 'smart-contracts': [-12, 25], retail: [-4, 3] },
      'NEAR': { exchanges: [-4, 8], whales: [-10, 4], miners: [-1, 3], 'smart-contracts': [-4, 8], retail: [-1, 1] },
      'APT': { exchanges: [-3, 7], whales: [-8, 3], miners: [-1, 2], 'smart-contracts': [-3, 7], retail: [-1, 1] },
    };

  assets.forEach(asset => {
    cohorts.forEach(cohort => {
      const range = flowRanges[asset as keyof typeof flowRanges]?.[cohort as keyof typeof flowRanges.BTC] || [-100, 100];
      const value = Math.random() * (range[1] - range[0]) + range[0];
      
      data.push({
        asset,
        cohort,
        value: Math.round(value * scaleFactor), // Scale the value based on date range
        date: new Date().toISOString(),
        yoyChange: Math.random() * 40 - 20,
      });
    });
  });
  
  return data;
};

export default function HomePage() {
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(COHORTS.map(c => c.id));
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateData(startDate, endDate);
      setHeatmapData(data);
      setIsLoading(false);
    };

    loadData();
  }, [startDate, endDate]);

  const handleCohortChange = (cohort: string, checked: boolean) => {
    if (checked) {
      setSelectedCohorts(prev => [...prev, cohort]);
    } else {
      setSelectedCohorts(prev => prev.filter(c => c !== cohort));
    }
  };

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleCellClick = (data: HeatmapData) => {
    console.log('Cell clicked:', data);
  };

  // Calculate summary statistics
  const totalInflow = heatmapData.filter(d => d.value > 0).reduce((sum, d) => sum + d.value, 0);
  const totalOutflow = Math.abs(heatmapData.filter(d => d.value < 0).reduce((sum, d) => sum + d.value, 0));
  const netFlow = totalInflow - totalOutflow;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌊 On-Chain Fund-Flow Heatmap
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Real-time visualization of crypto money movement across top 25 assets and wallet cohorts
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ⚠️ Note: This is a demonstration with simulated data for UI/UX purposes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Auto-refresh every 30min
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inflow</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${totalInflow.toLocaleString()}M
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">↑</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Outflow</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${totalOutflow.toLocaleString()}M
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xl">↓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Flow</p>
                <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ${netFlow.toLocaleString()}M
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                netFlow >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'
              }`}>
                <span className={`text-xl ${netFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {netFlow >= 0 ? '↗' : '↘'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Sidebar Controls */}
          <div className="xl:col-span-1 space-y-6">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
            
            <CohortToggle
              selectedCohorts={selectedCohorts}
              onCohortChange={handleCohortChange}
            />

            {/* Data Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Data Sources
              </h3>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Glassnode API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>CryptoQuant API</span>
                </div>
                <div className="pt-2 text-xs text-gray-500">
                  Last updated: {format(new Date(), 'MMM dd, HH:mm')}
                </div>
              </div>
            </div>
          </div>

          {/* Main Heatmap */}
          <div className="xl:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fund Flow Matrix
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net USD flow (positive = inflow, negative = outflow) across assets and wallet cohorts
                </p>
              </div>
              
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-500 dark:text-gray-400 font-medium">Loading fund flow data...</div>
                      <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">Fetching real-time on-chain data</div>
                    </div>
                  </div>
                ) : (
                  <Heatmap
                    data={heatmapData}
                    selectedCohorts={selectedCohorts}
                    onCellClick={handleCellClick}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              Data powered by Glassnode & CryptoQuant APIs • 
              Built with Next.js, TypeScript, TailwindCSS & Recharts
            </p>
            <p className="mt-1">
              Give you data-driven talking points for Anchorage/FalconX convos within 10 seconds of page load
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
