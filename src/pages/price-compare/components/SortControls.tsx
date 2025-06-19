import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { SortOption } from '@/types';

interface SortControlsProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sortValue: string): void => {
    onChange(sortValue);
    setIsOpen(false);
  };

  const getCurrentLabel = (): string => {
    const currentOption = options.find(option => option.value === value);
    return currentOption ? currentOption.label : 'Ordenar por';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">{getCurrentLabel()}</span>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-text-secondary"
        />
      </button>

      {/* Sort Options Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  value === option.value
                    ? 'bg-primary-50 text-primary'
                    : 'text-text-primary hover:bg-surface-hover'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <Icon name="Check" size={14} className="inline ml-2 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SortControls; 