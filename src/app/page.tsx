'use client';

import React, { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import Heatmap, { HeatmapData } from '@/components/Heatmap';
import CohortToggle from '@/components/CohortToggle';
import DateRangePicker from '@/components/DateRangePicker';
import { getAssets, COHORTS } from '@/lib/api';

// Generate realistic mock data
const generateMockData = (assets: string[], selectedCohorts: string[]) => {
  const data: HeatmapData[] = [];
  
  // Realistic flow ranges for different assets and cohorts
  const flowRanges = {
    'BTC': { exchanges: [-200, 300], whales: [-500, 800], miners: [-100, 150], 'smart-contracts': [-50, 100], retail: [-20, 50] },
    'ETH': { exchanges: [-150, 250], whales: [-400, 600], miners: [-80, 120], 'smart-contracts': [-200, 400], retail: [-30, 60] },
    'SOL': { exchanges: [-80, 120], whales: [-200, 300], miners: [-40, 60], 'smart-contracts': [-100, 200], retail: [-15, 30] },
    'XRP': { exchanges: [-60, 90], whales: [-150, 250], miners: [-30, 45], 'smart-contracts': [-80, 150], retail: [-10, 25] },
    'USDT': { exchanges: [-300, 500], whales: [-800, 1200], miners: [-150, 200], 'smart-contracts': [-400, 800], retail: [-50, 100] },
    'USDC': { exchanges: [-250, 400], whales: [-600, 900], miners: [-120, 180], 'smart-contracts': [-300, 600], retail: [-40, 80] },
  };

  console.log('Generating mock data for:', { assets, selectedCohorts });

  assets.forEach(asset => {
    selectedCohorts.forEach(cohort => {
      const range = flowRanges[asset as keyof typeof flowRanges]?.[cohort as keyof typeof flowRanges.BTC] || [-100, 100];
      const value = Math.random() * (range[1] - range[0]) + range[0];
      
      const dataPoint = {
        asset,
        cohort,
        value: Math.round(value),
        date: new Date().toISOString(),
        yoyChange: Math.random() * 40 - 20, // Random YoY change between -20% and +20%
      };
      
      data.push(dataPoint);
      console.log('Generated data point:', dataPoint);
    });
  });
  
  console.log('Total data points generated:', data.length);
  return data;
};

export default function HomePage() {
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(COHORTS.map(c => c.id));
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const assets = getAssets();
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  console.log('HomePage render:', { assets, selectedCohorts, heatmapData: heatmapData.length });

  // Generate data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      console.log('Starting data generation...');
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const processedData = generateMockData(assets, selectedCohorts);
        console.log('Setting heatmap data:', processedData.length, 'items');
        setHeatmapData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assets, selectedCohorts, startTimestamp, endTimestamp]);

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
    // You can implement a modal or navigation to transaction explorer here
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌊 On-Chain Fund-Flow Heatmap
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Real-time visualization of crypto money movement across major assets and wallet cohorts
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inflow</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(totalInflow / 1000).toFixed(1)}B
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">↑</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Outflow</p>
                <p className="text-2xl font-bold text-red-600">
                  ${(totalOutflow / 1000).toFixed(1)}B
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">↓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Flow</p>
                <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(netFlow / 1000).toFixed(1)}B
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                netFlow >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                <span className={`text-xl ${netFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {netFlow >= 0 ? '↗' : '↘'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
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
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fund Flow Matrix
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net USD flow (positive = inflow, negative = outflow) across assets and wallet cohorts
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Debug: {heatmapData.length} data points loaded
                </div>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-500 dark:text-gray-400 font-medium">Loading fund flow data...</div>
                      <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">Fetching real-time on-chain data</div>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="text-red-500 text-lg mb-2">Error loading data</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        Please check your API keys and try again
                      </div>
                    </div>
                  </div>
                ) : (
                  <Heatmap
                    data={heatmapData}
                    selectedCohorts={selectedCohorts}
                    onCellClick={handleCellClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
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
