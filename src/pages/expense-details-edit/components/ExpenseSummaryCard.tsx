import React from 'react';
import Icon from 'components/AppIcon';

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface ExpenseSummaryCardProps {
  expense: {
    amount: number;
    currency: string;
    category: Category;
    merchant: string;
    date: string;
  };
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ expense }) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-4 mt-6">
      <div className="bg-surface rounded-xl p-6 card-shadow">
        {/* Amount */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-text-primary mb-1">
            {formatCurrency(expense.amount, expense.currency)}
          </div>
          <div className="text-sm text-text-secondary">
            {expense.currency}
          </div>
        </div>

        {/* Category & Merchant */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${expense.category.color}20` }}
            >
              <Icon 
                name={expense.category.icon} 
                size={20} 
                style={{ color: expense.category.color }}
              />
            </div>
            <div>
              <div className="font-medium text-text-primary">
                {expense.merchant}
              </div>
              <div className="text-sm text-text-secondary">
                {expense.category.name}
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="text-center border-t border-border pt-4">
          <div className="text-sm font-medium text-text-primary mb-1">
            {formatDate(expense.date)}
          </div>
          <div className="text-sm text-text-secondary">
            {formatTime(expense.date)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummaryCard; 