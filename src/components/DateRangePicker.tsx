'use client';

import React, { useState } from 'react';
import { format, subDays, startOfYear } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

const PRESET_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: 'YTD', custom: () => ({ start: startOfYear(new Date()), end: new Date() }) },
];

export default function DateRangePicker({ startDate, endDate, onDateChange }: DateRangePickerProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const handlePresetClick = (preset: typeof PRESET_RANGES[0]) => {
    if (preset.custom) {
      const { start, end } = preset.custom();
      onDateChange(start, end);
    } else {
      const end = new Date();
      const start = subDays(end, preset.days);
      onDateChange(start, end);
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    if (type === 'start') {
      onDateChange(date, endDate);
    } else {
      onDateChange(startDate, date);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Time Range
      </h3>
      
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_RANGES.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
            isCustomOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Custom
        </button>
      </div>
      
      {/* Custom date inputs */}
      {isCustomOpen && (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={format(endDate, 'yyyy-MM-dd')}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Current range display */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Current Range:</span>
          <br />
          {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
          <br />
          <span className="text-gray-400">
            ({Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
          </span>
        </div>
      </div>
    </div>
  );
} 