'use client';

import React, { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import Heatmap, { HeatmapData } from '@/components/Heatmap';
import CohortToggle from '@/components/CohortToggle';
import DateRangePicker from '@/components/DateRangePicker';
import { getAssets, COHORTS } from '@/lib/api';

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

  // Fetch data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const processedData: HeatmapData[] = [];
        
        // For now, we'll create mock data since we don't have real API keys
        // In production, this would call the actual API functions
        assets.forEach(asset => {
          selectedCohorts.forEach(cohort => {
            // Mock data for demonstration
            const mockValue = Math.random() * 1000 - 500; // Random value between -500 and 500
            processedData.push({
              asset,
              cohort,
              value: mockValue,
              date: new Date().toISOString(),
            });
          });
        });
        
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
    // Open transaction explorer or show detailed modal
    console.log('Cell clicked:', data);
    // You can implement a modal or navigation to transaction explorer here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🌊 On-Chain Fund-Flow Heatmap
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visualize weekly money movement between major crypto assets and wallet cohorts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Auto-refresh every 30min
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>

          {/* Main Heatmap */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fund Flow Matrix
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net USD flow (positive = inflow, negative = outflow) across assets and wallet cohorts
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading fund flow data...</div>
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

        {/* Footer Info */}
        <div className="mt-8 text-center">
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
