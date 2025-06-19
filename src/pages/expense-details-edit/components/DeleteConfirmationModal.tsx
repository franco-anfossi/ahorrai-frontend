import React from 'react';
import Icon from 'components/AppIcon';

interface Expense {
  amount: number;
  currency: string;
  merchant: string;
}

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  expense: Expense;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel, expense }) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-xl p-6 w-full max-w-sm card-shadow">
        {/* Icon */}
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertTriangle" size={32} className="text-error" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            ¿Eliminar Gasto?
          </h3>
          <p className="text-text-secondary mb-4">
            ¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.
          </p>
          
          {/* Expense Details */}
          <div className="bg-error-50 rounded-lg p-3 mb-4">
            <div className="font-medium text-error">
              {formatCurrency(expense.amount, expense.currency)}
            </div>
            <div className="text-sm text-error/80">
              {expense.merchant}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-border text-text-primary rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-error text-white rounded-lg hover:bg-red-700 spring-transition focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 