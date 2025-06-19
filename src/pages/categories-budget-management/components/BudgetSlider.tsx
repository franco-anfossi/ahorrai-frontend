import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import { Category } from '../../../types';

interface BudgetSliderProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onUpdateBudget: (categoryId: number, amount: number) => void;
}

const BudgetSlider: React.FC<BudgetSliderProps> = ({ isOpen, category, onClose, onUpdateBudget }) => {
  const [budgetAmount, setBudgetAmount] = useState(category?.budget || 0);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const presetAmounts = [100, 200, 300, 500, 800, 1000, 1500, 2000];
  const maxBudget = 5000;

  useEffect(() => {
    if (category) {
      setBudgetAmount(category.budget);
    }
  }, [category]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    setBudgetAmount(value);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (amount: number): void => {
    setBudgetAmount(amount);
    setSelectedPreset(amount);
  };

  const handleSave = (): void => {
    if (category) {
      onUpdateBudget(category.id, budgetAmount);
    }
  };

  const percentageOfIncome = ((budgetAmount / 5000) * 100).toFixed(1); // Mock monthly income of $5000

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface rounded-t-2xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
              <p className="text-sm text-text-secondary">Set monthly budget</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover spring-transition"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Current Amount Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-text-primary mb-2">
            ${budgetAmount.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">
            {percentageOfIncome}% of monthly income
          </div>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max={maxBudget}
            step="50"
            value={budgetAmount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${(budgetAmount/maxBudget)*100}%, #e5e7eb ${(budgetAmount/maxBudget)*100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>$0</span>
            <span>${maxBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="mb-6">
          <p className="text-sm font-medium text-text-primary mb-3">Quick amounts</p>
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetSelect(amount)}
                className={`py-2 px-3 rounded-lg text-sm font-medium spring-transition ${
                  selectedPreset === amount
                    ? 'bg-primary text-white' :'bg-surface-hover text-text-primary hover:bg-primary-50'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Budget Analysis</span>
          </div>
          <div className="space-y-1 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Current spending:</span>
              <span>${category.spent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining budget:</span>
              <span className={budgetAmount - category.spent >= 0 ? 'text-accent' : 'text-error'}>
                ${Math.abs(budgetAmount - category.spent).toLocaleString()}
                {budgetAmount - category.spent < 0 && ' over'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily allowance:</span>
              <span>${Math.round((budgetAmount - category.spent) / 30).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-surface-hover text-text-primary rounded-lg font-medium hover:bg-gray-200 spring-transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 spring-transition"
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSlider; 