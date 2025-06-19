import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Buscar..." 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onChange(value);
  };

  const handleClear = (): void => {
    onChange('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative flex items-center rounded-lg border spring-transition ${
        isFocused 
          ? 'border-primary bg-surface ring-2 ring-primary-500 ring-offset-2' 
          : 'border-border bg-surface hover:bg-surface-hover'
      }`}>
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-text-secondary" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent border-none outline-none text-text-primary placeholder-text-secondary"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-100 spring-transition"
          >
            <Icon name="X" size={16} className="text-text-secondary" />
          </button>
        )}
      </div>
      
      {/* Quick Search Suggestions */}
      {isFocused && value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            <button
              type="button"
              onClick={() => onChange('iPhone 15 Pro')}
              className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg spring-transition"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Search" size={14} />
                <span>iPhone 15 Pro</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange('Samsung Galaxy')}
              className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg spring-transition"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Search" size={14} />
                <span>Samsung Galaxy</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange('MacBook Air')}
              className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg spring-transition"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Search" size={14} />
                <span>MacBook Air</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar; 