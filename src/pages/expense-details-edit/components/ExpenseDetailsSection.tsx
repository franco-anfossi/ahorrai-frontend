import React from 'react';
import Icon from 'components/AppIcon';
import { Expense } from '../../../types';

interface ExpenseDetailsSectionProps {
  expense: Expense;
}

const ExpenseDetailsSection: React.FC<ExpenseDetailsSectionProps> = ({ expense }) => {
  return (
    <div className="mx-4 space-y-4">
      {/* Payment Method */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Método de Pago</h3>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-text-primary">
              {expense.paymentMethod}
            </div>
            {expense.cardLast4 && (
              <div className="text-sm text-text-secondary">
                •••• {expense.cardLast4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {expense.description && (
        <div className="bg-surface rounded-xl p-4 card-shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Descripción</h3>
          <p className="text-text-primary">{expense.description}</p>
        </div>
      )}

    </div>
  );
};

export default ExpenseDetailsSection; 