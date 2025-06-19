import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { RecentTransactionsProps, Transaction } from '@/types';

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  currency, 
  onTransactionClick 
}) => {
  const [swipedTransaction, setSwipedTransaction] = useState<number | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateOrTime: string | Date): string => {
    // Handle both Date objects and time strings
    if (!dateOrTime) return '';
    
    if (typeof dateOrTime === 'string') {
      // If it's a time string like "2h ago", "Ayer", etc., return as is
      if (dateOrTime.includes('ago') || dateOrTime === 'Ayer' || dateOrTime === 'Hoy') {
        return dateOrTime;
      }
      // If it's a date string, convert to Date object
      dateOrTime = new Date(dateOrTime);
    }
    
    if (!(dateOrTime instanceof Date) || isNaN(dateOrTime.getTime())) {
      return '';
    }

    const now = new Date();
    const diffInHours = (now.getTime() - dateOrTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Ahora mismo';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return dateOrTime.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusText = (status: Transaction['status']): string => {
    switch (status) {
      case 'completed':
        return 'completado';
      case 'pending':
        return 'pendiente';
      case 'failed':
        return 'fallido';
      default:
        return status;
    }
  };

  const handleSwipe = (transactionId: number, direction: 'left' | 'right'): void => {
    if (direction === 'left') {
      setSwipedTransaction(transactionId);
    } else {
      setSwipedTransaction(null);
    }
  };

  const handleEdit = (transaction: Transaction): void => {
    onTransactionClick(transaction);
    setSwipedTransaction(null);
  };

  const handleDelete = (transactionId: number): void => {
    console.log('Delete transaction:', transactionId);
    setSwipedTransaction(null);
  };

  return (
    <div className="bg-surface rounded-xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Transacciones Recientes</h3>
          <p className="text-sm text-text-secondary">Últimas 7 transacciones</p>
        </div>
        
        <button className="text-primary font-medium text-sm hover:text-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-2 py-1">
          Ver Todas
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="relative overflow-hidden rounded-lg">
            {/* Swipe Actions Background */}
            {swipedTransaction === transaction.id && (
              <div className="absolute inset-0 flex items-center justify-end space-x-2 bg-error-50 px-4">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition"
                  aria-label="Editar transacción"
                >
                  <Icon name="Edit" size={16} />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 bg-error text-white rounded-lg hover:bg-red-700 spring-transition"
                  aria-label="Eliminar transacción"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            )}

            {/* Transaction Item */}
            <div
              className={`relative bg-surface hover:bg-surface-hover spring-transition cursor-pointer p-4 rounded-lg border border-transparent hover:border-border ${
                swipedTransaction === transaction.id ? 'transform -translate-x-20' : ''
              }`}
              onClick={() => onTransactionClick(transaction)}
              onTouchStart={(e) => {
                const startX = e.touches[0].clientX;
                const handleTouchMove = (e: TouchEvent) => {
                  const currentX = e.touches[0].clientX;
                  const diffX = startX - currentX;
                  if (diffX > 50) {
                    handleSwipe(transaction.id, 'left');
                  } else if (diffX < -50) {
                    handleSwipe(transaction.id, 'right');
                  }
                };
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <div className="flex items-center space-x-3">
                {/* Category Icon */}
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={transaction.icon || transaction.categoryIcon || 'Receipt'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {transaction.merchant}
                    </h4>
                    <span className="text-sm font-semibold text-text-primary ml-2">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary">
                        {transaction.category}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-secondary">
                        {formatDate(transaction.time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                      {transaction.status === 'pending' && (
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {transaction.description && (
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {transaction.description}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-text-muted flex-shrink-0" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Receipt" size={24} className="text-text-muted" />
          </div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Aún no hay transacciones</h4>
          <p className="text-xs text-text-secondary">
            Comienza a rastrear tus gastos agregando tu primera transacción
          </p>
        </div>
      )}

      {/* Quick Tip */}
      <div className="mt-6 p-3 bg-primary-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Consejo Rápido</p>
            <p className="text-xs text-text-secondary">
              Desliza hacia la izquierda en cualquier transacción para editarla o eliminarla rápidamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions; 