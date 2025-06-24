import React from 'react';
import Icon from '@/components/AppIcon';
import { Category } from '../../../types';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit }) => {
  const progressPercentage = Math.min(category.percentage, 100);
  const isOverBudget = category.isOverBudget;

  return (
    <div className="bg-surface rounded-xl p-4 border border-border card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Icon 
              name={category.icon} 
              size={20} 
              style={{ color: category.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{category.name}</h3>
            <p className="text-sm text-text-secondary">
              {category.transactions} transactions
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Icon name="Settings" size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* Budget Progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">
            {category.spent.toLocaleString('es-ES')} of {category.budget.toLocaleString('es-ES')}
          </span>
          <span className={`text-sm font-medium ${
            isOverBudget ? 'text-error' : 'text-text-primary'
          }`}>
            {category.percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-error' : 'bg-accent'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {isOverBudget && (
          <div className="flex items-center space-x-1 mt-2">
            <Icon name="AlertTriangle" size={14} className="text-error" />
            <span className="text-xs text-error">
              Over budget by {(category.spent - category.budget).toLocaleString('es-ES')}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>Last transaction: {new Date(category.lastTransaction).toLocaleDateString('es-ES')}</span>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-text-primary spring-transition">
            <Icon name="TrendingUp" size={12} />
            <span>Trends</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-text-primary spring-transition">
            <Icon name="Archive" size={12} />
            <span>Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 