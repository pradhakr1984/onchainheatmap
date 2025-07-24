'use client';

import React, { useMemo } from 'react';
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

// Enhanced color scale with better visual appeal
const getColorScale = (min: number, max: number) => {
  const absMax = Math.max(Math.abs(min), Math.abs(max));
  
  return (value: number) => {
    if (value === 0) return '#6B7280'; // Neutral gray for zero
    
    const normalized = Math.abs(value) / absMax;
    const intensity = Math.min(normalized, 1);
    
    if (value > 0) {
      // Green scale for positive values (inflows)
      const greenIntensity = Math.floor(34 + (197 - 34) * intensity);
      const blueIntensity = Math.floor(58 + (94 - 58) * intensity);
      return `rgb(34, ${greenIntensity}, ${blueIntensity})`;
    } else {
      // Red scale for negative values (outflows)
      const redIntensity = Math.floor(16 + (239 - 16) * intensity);
      const greenIntensity = Math.floor(32 + (68 - 32) * intensity);
      const blueIntensity = Math.floor(32 + (68 - 32) * intensity);
      return `rgb(${redIntensity}, ${greenIntensity}, ${blueIntensity})`;
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

  // Debug logging
  console.log('Heatmap data:', data);
  console.log('Processed data:', processedData);
  console.log('Assets:', assets);
  console.log('Cohorts:', cohorts);

  if (!processedData.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No data available</div>
          <div className="text-gray-500 text-sm">Select time range and cohorts to view flows</div>
          <div className="text-xs text-gray-400 mt-2">Debug: {data.length} data points received</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Debug info */}
      <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 text-xs text-yellow-800 dark:text-yellow-200 rounded">
        Debug: {processedData.length} cells, {assets.length} assets, {cohorts.length} cohorts
      </div>

      {/* Heatmap Grid */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Header row with asset names */}
        <div className="grid grid-cols-7 gap-px bg-gray-300 dark:bg-gray-600">
          <div className="h-12 bg-gray-100 dark:bg-gray-700"></div> {/* Empty corner */}
          {assets.map(asset => (
            <div key={asset} className="h-12 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              {asset}
            </div>
          ))}
        </div>
        
        {/* Data rows */}
        {cohorts.map((cohort) => (
          <div key={cohort} className="grid grid-cols-7 gap-px bg-gray-300 dark:bg-gray-600">
            {/* Cohort label */}
            <div className="h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-start px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>{cohort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            </div>
            
            {/* Data cells */}
            {assets.map((asset) => {
              const cellData = processedData.find(
                d => d.asset === asset && d.cohort === cohort
              );
              
              if (!cellData) {
                return (
                  <div key={asset} className="h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">N/A</span>
                  </div>
                );
              }
              
              return (
                <div
                  key={asset}
                  className="h-16 relative group cursor-pointer"
                  onClick={() => onCellClick?.(cellData)}
                >
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-xs font-semibold text-white p-1 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: cellData.color }}
                  >
                    <div className="text-center leading-tight">
                      {cellData.value > 0 ? '+' : ''}{cellData.formattedValue}
                    </div>
                    {cellData.yoyChange && (
                      <div className={`text-xs ${cellData.yoyChange > 0 ? 'text-green-200' : 'text-red-200'}`}>
                        {cellData.yoyChange > 0 ? '+' : ''}{cellData.yoyChange.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                    <div className="font-semibold mb-1">{asset} → {cohort}</div>
                    <div className="text-gray-300 mb-1">{cellData.formattedValue}</div>
                    <div className="text-gray-400 text-xs mb-1">
                      {format(new Date(cellData.date), 'MMM dd, yyyy')}
                    </div>
                    {cellData.yoyChange && (
                      <div className={`text-xs font-medium ${cellData.yoyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        YoY: {cellData.yoyChange > 0 ? '+' : ''}{cellData.yoyChange.toFixed(1)}%
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Enhanced Legend */}
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
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          Hover for details • Click for explorer
        </div>
      </div>
    </div>
  );
} 