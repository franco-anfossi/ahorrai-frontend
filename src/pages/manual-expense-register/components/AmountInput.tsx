import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  currency?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  value, 
  onChange, 
  error, 
  currency = "USD" 
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (inputValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    // Limit to 2 decimal places
    const parts = inputValue.split('.');
    if (parts[1] && parts[1].length > 2) return;
    
    onChange(inputValue);
  };

  const quickAmounts: number[] = [10, 25, 50, 100, 200, 500];

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        Monto *
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0.00"
          className={`w-full px-4 py-4 text-2xl font-semibold rounded-lg border spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            error 
              ? 'border-error bg-error-50' 
              : 'border-border bg-surface hover:bg-surface-hover focus:border-primary'
          }`}
        />
        
        {value && !isFocused && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary">
            <span className="text-sm">{currency}</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}

      {/* Quick Amount Buttons */}
      <div className="mt-4">
        <p className="text-xs text-text-secondary mb-2">Cantidades Rápidas</p>
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onChange(amount.toString())}
              className="px-3 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {formatCurrency(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Selector */}
      <div className="mt-4">
        <p className="text-xs text-text-secondary mb-2">Moneda</p>
        <div className="flex space-x-2">
          {['USD', 'EUR', 'MXN'].map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => console.log('Currency changed to:', curr)}
              className={`px-3 py-1 text-xs font-medium rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                currency === curr
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmountInput; 