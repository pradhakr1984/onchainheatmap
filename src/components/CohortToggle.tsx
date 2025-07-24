'use client';

import React from 'react';
import { COHORTS } from '@/lib/api';

interface CohortToggleProps {
  selectedCohorts: string[];
  onCohortChange: (cohort: string, checked: boolean) => void;
}

export default function CohortToggle({ selectedCohorts, onCohortChange }: CohortToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Wallet Cohorts
      </h3>
      
      <div className="space-y-3">
        {COHORTS.map((cohort) => (
          <label
            key={cohort.id}
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedCohorts.includes(cohort.id)}
                onChange={(e) => onCohortChange(cohort.id, e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                selectedCohorts.includes(cohort.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedCohorts.includes(cohort.id) && (
                  <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {cohort.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {cohort.description}
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {selectedCohorts.includes(cohort.id) ? 'Active' : 'Inactive'}
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
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
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
          >
            {selectedCohorts.length === COHORTS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
    </div>
  );
} 