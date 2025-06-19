import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'cash' | 'transfer' | 'digital';
  last4?: string;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethods, 
  selectedMethod, 
  onSelect 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMethodSelect = (method: PaymentMethod): void => {
    onSelect(method);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-text-primary mb-2">
        Método de Pago
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 spring-transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedMethod ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon name={selectedMethod.icon} size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <span className="text-text-primary font-medium">{selectedMethod.name}</span>
                  {selectedMethod.last4 && (
                    <p className="text-xs text-text-secondary">•••• {selectedMethod.last4}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon name="CreditCard" size={16} className="text-gray-400" />
                </div>
                <span className="text-text-secondary">Selecciona método de pago</span>
              </>
            )}
          </div>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-secondary"
          />
        </div>
      </button>

      {/* Payment Methods Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="space-y-1">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleMethodSelect(method)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    selectedMethod?.id === method.id
                      ? 'bg-primary-50 text-primary'
                      : 'hover:bg-surface-hover text-text-primary'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Icon name={method.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium">{method.name}</span>
                    {method.last4 && (
                      <p className="text-xs text-text-secondary">•••• {method.last4}</p>
                    )}
                  </div>
                  {selectedMethod?.id === method.id && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector; 