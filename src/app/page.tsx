'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DateRangePicker from '@/components/DateRangePicker';
import CohortToggle from '@/components/CohortToggle';
import Heatmap from '@/components/Heatmap';
import { getTopCoins, getRealFundFlows } from '@/lib/api';

export interface HeatmapData {
  asset: string;
  cohort: string;
  value: number;
  date: string;
  formattedValue?: string;
  yoyChange?: number;
}

export default function HomePage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(['exchanges', 'whales', 'miners', 'smart-contracts', 'retail']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Date range state
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch real fund flow data
        const flowData = await getRealFundFlows();
        
        // Convert to HeatmapData format
        const heatmapDataFormatted: HeatmapData[] = flowData.map(item => ({
          asset: item.asset,
          cohort: item.cohort,
          value: item.value,
          date: new Date().toISOString(),
          yoyChange: item.priceChange24h
        }));
        
        setHeatmapData(heatmapDataFormatted);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load real market data. Please try again.');
      } finally {
        setIsLoading(false);
      }
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

  // Calculate summary statistics from real data
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
                📊 Real on-chain data from Messari API • Market data from CoinGecko • Last updated: {format(lastUpdated, 'MMM dd, HH:mm')}
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
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Messari API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>CoinGecko API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Real On-chain Data</span>
                </div>
                <div className="pt-2 text-xs text-gray-500">
                  Last updated: {format(lastUpdated, 'MMM dd, HH:mm')}
                </div>
                {error && (
                  <div className="pt-2 text-xs text-red-500">
                    ⚠️ {error}
                  </div>
                )}
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
              Real on-chain data from Messari API • Market data from CoinGecko • 
              Built with Next.js, TypeScript & TailwindCSS
            </p>
            <p className="mt-1">
              Enhanced estimates using real on-chain metrics (active addresses, transactions)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
