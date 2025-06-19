import React from 'react';
import Icon from 'components/AppIcon';

interface ExpenseData {
  spent: number;
  budget: number;
  currency?: string;
}

interface ExpenseSummaryCardProps {
  data: ExpenseData;
  onRefresh: () => void;
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ data, onRefresh }) => {
  const { spent, budget, currency } = data;
  const percentage = (spent / budget) * 100;
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-surface rounded-xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Presupuesto Mensual</h2>
          <p className="text-sm text-text-secondary">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Actualizar datos"
        >
          <Icon name="RefreshCw" size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Amount Display */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-3xl font-bold text-text-primary">
            {formatCurrency(spent)}
          </span>
          <span className="text-lg text-text-secondary">
            / {formatCurrency(budget)}
          </span>
        </div>
        
        <div className={`flex items-center space-x-2 ${isOverBudget ? 'text-error' : 'text-success'}`}>
          <Icon 
            name={isOverBudget ? "TrendingUp" : "TrendingDown"} 
            size={16} 
          />
          <span className="text-sm font-medium">
            {isOverBudget 
              ? `Sobregastado por ${formatCurrency(Math.abs(remaining))}`
              : `${formatCurrency(remaining)} restantes`
            }
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">Uso del Presupuesto</span>
          <span className={`text-sm font-medium ${isOverBudget ? 'text-error' : 'text-text-primary'}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-error to-red-500' 
                : percentage > 80 
                  ? 'bg-gradient-to-r from-warning to-orange-500' :'bg-gradient-to-r from-success to-emerald-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-1">Promedio Diario</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatCurrency(spent / new Date().getDate())}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-1">Días Restantes</p>
          <p className="text-lg font-semibold text-text-primary">
            {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummaryCard; 