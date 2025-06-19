import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { Expense, Category } from '../../../types';

interface Split {
  id: number;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  percentage: number;
  amount: number;
}

interface SplitExpenseModalProps {
  onClose: () => void;
  expense: Expense;
}

const SplitExpenseModal: React.FC<SplitExpenseModalProps> = ({ onClose, expense }) => {
  const [splitMethod, setSplitMethod] = useState<'percentage' | 'amount'>('percentage');
  const [splits, setSplits] = useState<Split[]>([
    { id: 1, category: expense?.category, percentage: 100, amount: expense?.amount || 0 }
  ]);

  const categories: Category[] = [
    { id: 1, name: "Comida y Restaurantes", icon: "UtensilsCrossed", color: "#EF4444", budget: 800, spent: 645.30, percentage: 80.7, trend: "up", trendValue: 12.5, isOverBudget: false, transactions: 24, lastTransaction: "2024-01-15T10:30:00Z" },
    { id: 2, name: "Transporte", icon: "Car", color: "#3B82F6", budget: 400, spent: 267.80, percentage: 66.9, trend: "down", trendValue: 8.2, isOverBudget: false, transactions: 18, lastTransaction: "2024-01-14T08:15:00Z" },
    { id: 3, name: "Compras", icon: "ShoppingBag", color: "#10B981", budget: 300, spent: 223.90, percentage: 74.6, trend: "up", trendValue: 15.3, isOverBudget: false, transactions: 12, lastTransaction: "2024-01-13T16:45:00Z" },
    { id: 4, name: "Entretenimiento", icon: "Film", color: "#F59E0B", budget: 200, spent: 112.50, percentage: 56.3, trend: "down", trendValue: 5.7, isOverBudget: false, transactions: 8, lastTransaction: "2024-01-12T20:00:00Z" },
    { id: 5, name: "Salud", icon: "Heart", color: "#EF4444", budget: 150, spent: 98.00, percentage: 65.3, trend: "stable", trendValue: 0.0, isOverBudget: false, transactions: 6, lastTransaction: "2024-01-11T14:20:00Z" },
    { id: 6, name: "Servicios", icon: "Zap", color: "#8B5CF6", budget: 150, spent: 98.00, percentage: 65.3, trend: "stable", trendValue: 0.0, isOverBudget: false, transactions: 6, lastTransaction: "2024-01-11T14:20:00Z" }
  ];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const addSplit = () => {
    const newSplit: Split = {
      id: Date.now(),
      category: categories[0],
      percentage: 0,
      amount: 0
    };
    setSplits([...splits, newSplit]);
  };

  const removeSplit = (id: number) => {
    if (splits.length > 1) {
      setSplits(splits.filter(split => split.id !== id));
    }
  };

  const updateSplit = (id: number, field: keyof Split, value: any) => {
    setSplits(splits.map(split => {
      if (split.id === id) {
        if (field === 'percentage' && splitMethod === 'percentage') {
          return {
            ...split,
            [field]: value,
            amount: (expense.amount * value) / 100
          };
        } else if (field === 'amount' && splitMethod === 'amount') {
          return {
            ...split,
            [field]: value,
            percentage: (value / expense.amount) * 100
          };
        } else {
          return { ...split, [field]: value };
        }
      }
      return split;
    }));
  };

  const getTotalPercentage = () => {
    return splits.reduce((total, split) => total + (split.percentage || 0), 0);
  };

  const getTotalAmount = () => {
    return splits.reduce((total, split) => total + (split.amount || 0), 0);
  };

  const handleSave = () => {
    // In a real app, this would save the split expense
    console.log('Saving split expense:', splits);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-surface w-full sm:max-w-lg sm:rounded-xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Dividir Gasto
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Original Expense Info */}
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Gasto Original</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(expense.amount, expense.currency)}
              </span>
            </div>
            <div className="text-sm text-primary/80">
              {expense.merchant} • {expense.category.name}
            </div>
          </div>

          {/* Split Method Toggle */}
          <div className="flex bg-surface-hover rounded-lg p-1">
            <button
              onClick={() => setSplitMethod('percentage')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium spring-transition ${
                splitMethod === 'percentage' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Porcentaje
            </button>
            <button
              onClick={() => setSplitMethod('amount')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium spring-transition ${
                splitMethod === 'amount' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monto
            </button>
          </div>

          {/* Splits */}
          <div className="space-y-3">
            {splits.map((split, index) => (
              <div key={split.id} className="bg-surface border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-secondary">
                    División {index + 1}
                  </span>
                  {splits.length > 1 && (
                    <button
                      onClick={() => removeSplit(split.id)}
                      className="p-1 text-error hover:bg-error-50 rounded focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  )}
                </div>

                {/* Category Selector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    Categoría
                  </label>
                  <select
                    value={split.category.id}
                    onChange={(e) => {
                      const category = categories.find(cat => cat.id === parseInt(e.target.value)) || categories[0];
                      updateSplit(split.id, 'category', category);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount/Percentage Input */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">
                      Porcentaje
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={split.percentage.toFixed(1)}
                        onChange={(e) => updateSplit(split.id, 'percentage', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 pr-8 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary text-sm"
                        disabled={splitMethod === 'amount'}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">
                      Monto
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={split.amount.toFixed(2)}
                        onChange={(e) => updateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary text-sm"
                        disabled={splitMethod === 'percentage'}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-xs">
                        {expense.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Split Button */}
          <button
            onClick={addSplit}
            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="Plus" size={16} />
            <span className="font-medium">Agregar División</span>
          </button>

          {/* Total Summary */}
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Total</span>
              <span className={`text-sm font-medium ${
                Math.abs(getTotalPercentage() - 100) < 0.1 ? 'text-success' : 'text-error'
              }`}>
                {getTotalPercentage().toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Monto Total</span>
              <span className={`text-sm font-medium ${
                Math.abs(getTotalAmount() - expense.amount) < 0.01 ? 'text-success' : 'text-error'
              }`}>
                {formatCurrency(getTotalAmount(), expense.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-border text-text-primary rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitExpenseModal; 