import React from 'react';
import Icon from '@/components/AppIcon';
import { Filter } from '@/types';

interface FilterChipsProps {
  filters: Filter[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, selectedFilters, onFilterChange }) => {
  const hasActiveFilters = selectedFilters.length > 0;

  const clearAllFilters = (): void => {
    selectedFilters.forEach(filterId => {
      onFilterChange(filterId);
    });
  };

  return (
    <div className="space-y-3">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Active Filters</span>
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Categories */}
      {filters.map((filter) => {
        const isSelected = selectedFilters.includes(filter.id);
        
        return (
          <div key={filter.id} className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">{filter.label}</h4>
            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => onFilterChange(filter.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium spring-transition
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-surface border border-border text-text-primary hover:bg-surface-hover'
                  }
                `}
              >
                <Icon name={filter.icon} size={16} />
                {isSelected && (
                  <Icon name="X" size={14} />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterChips; 