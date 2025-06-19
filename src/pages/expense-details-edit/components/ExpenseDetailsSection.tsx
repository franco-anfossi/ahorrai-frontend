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

      {/* Notes */}
      {expense.notes && (
        <div className="bg-surface rounded-xl p-4 card-shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Notas</h3>
          <div className="text-text-primary whitespace-pre-line">
            {expense.notes}
          </div>
        </div>
      )}

      {/* Tags */}
      {expense.tags && expense.tags.length > 0 && (
        <div className="bg-surface rounded-xl p-4 card-shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {expense.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary"
              >
                <Icon name="Tag" size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {expense.location && expense.location.coordinates && (
        <div className="bg-surface rounded-xl p-4 card-shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Ubicación</h3>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="MapPin" size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-text-primary mb-2">
                {expense.location.address}
              </div>
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Ubicación del Gasto"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${expense.location.coordinates.lat},${expense.location.coordinates.lng}&z=14&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location without coordinates */}
      {expense.location && !expense.location.coordinates && (
        <div className="bg-surface rounded-xl p-4 card-shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Ubicación</h3>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="MapPin" size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-text-primary">
                {expense.location.address}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDetailsSection; 