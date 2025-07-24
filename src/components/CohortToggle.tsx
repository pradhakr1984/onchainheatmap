'use client';

import React from 'react';
import { COHORTS } from '@/lib/api';

interface CohortToggleProps {
  selectedCohorts: string[];
  onCohortChange: (cohort: string, checked: boolean) => void;
}

export default function CohortToggle({ selectedCohorts, onCohortChange }: CohortToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Wallet Cohorts
      </h3>
      
      <div className="space-y-2">
        {COHORTS.map((cohort) => (
          <label
            key={cohort.id}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedCohorts.includes(cohort.id)}
              onChange={(e) => onCohortChange(cohort.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {cohort.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {cohort.description}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {selectedCohorts.length} of {COHORTS.length} selected
          </span>
          <button
            onClick={() => {
              if (selectedCohorts.length === COHORTS.length) {
                // Deselect all
                COHORTS.forEach(cohort => onCohortChange(cohort.id, false));
              } else {
                // Select all
                COHORTS.forEach(cohort => onCohortChange(cohort.id, true));
              }
            }}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {selectedCohorts.length === COHORTS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
    </div>
  );
} 