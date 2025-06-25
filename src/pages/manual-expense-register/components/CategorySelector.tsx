import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CategoryRecord } from '@/lib/supabase/categories';

interface CategorySelectorProps {
  categories: CategoryRecord[];
  selectedCategory: CategoryRecord | null;
  onSelect: (category: CategoryRecord) => void;
  error?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  selectedCategory, 
  onSelect, 
  error 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCategorySelect = (category: CategoryRecord): void => {
    onSelect(category);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-text-primary mb-2">
        Categoría *
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          error 
            ? 'border-error bg-error-50' 
            : 'border-border bg-surface hover:bg-surface-hover focus:border-primary'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedCategory ? (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedCategory.color}20` }}
                >
                  <Icon 
                    name={selectedCategory.icon} 
                    size={16} 
                    style={{ color: selectedCategory.color }}
                  />
                </div>
                <span className="text-text-primary font-medium">{selectedCategory.name}</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon name="Tag" size={16} className="text-gray-400" />
                </div>
                <span className="text-text-secondary">Selecciona una categoría</span>
              </>
            )}
          </div>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-secondary"
          />
        </div>
      </button>

      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}

      {/* Category Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Buscar categoría..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              />
            </div>
            
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    selectedCategory?.id === category.id
                      ? 'bg-primary-50 text-primary'
                      : 'hover:bg-surface-hover text-text-primary'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon 
                      name={category.icon} 
                      size={16} 
                      style={{ color: category.color }}
                    />
                  </div>
                  <span className="font-medium">{category.name}</span>
                  {selectedCategory?.id === category.id && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
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

export default CategorySelector; 