import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from '@/components/AppIcon';
import HeaderBar from '@/components/ui/HeaderBar';
import BottomTabNavigation from '@/components/ui/BottomTabNavigation';
import AmountInput from './components/AmountInput';
import CategorySelector from './components/CategorySelector';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import DatePicker from './components/DatePicker';
import PhotoAttachment from './components/PhotoAttachment';
import { Category, PaymentMethod } from '@/types';

interface PhotoData {
  file: File;
  preview: string;
}

interface FormData {
  amount: string;
  category: Category | null;
  merchant: string;
  date: string;
  paymentMethod: PaymentMethod | null;
  description: string;
  tags: string[];
  photo: PhotoData | null;
}

interface FormErrors {
  amount?: string;
  category?: string;
  merchant?: string;
  submit?: string;
}

const ManualExpenseRegister: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    category: null,
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: null,
    description: '',
    tags: [],
    photo: null
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Mock data for suggestions and options
  const merchantSuggestions = [
    "Starbucks", "McDonald's", "Target", "Walmart", "Amazon", "Shell", "Exxon", "Uber", "Lyft", "Netflix"
  ];

  const categories: Category[] = [
    { id: 1, name: "Comida y Restaurantes", icon: "UtensilsCrossed", color: "bg-red-100 text-red-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 2, name: "Transporte", icon: "Car", color: "bg-blue-100 text-blue-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 3, name: "Compras", icon: "ShoppingBag", color: "bg-purple-100 text-purple-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 4, name: "Entretenimiento", icon: "Film", color: "bg-pink-100 text-pink-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 5, name: "Facturas y Servicios", icon: "Receipt", color: "bg-yellow-100 text-yellow-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 6, name: "Salud", icon: "Heart", color: "bg-green-100 text-green-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 7, name: "Viajes", icon: "Plane", color: "bg-indigo-100 text-indigo-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' },
    { id: 8, name: "Educación", icon: "GraduationCap", color: "bg-teal-100 text-teal-600", budget: 0, spent: 0, percentage: 0, trend: 'stable', trendValue: 0, isOverBudget: false, transactions: 0, lastTransaction: '' }
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: "Tarjeta de Crédito", icon: "CreditCard", type: "card" },
    { id: 2, name: "Tarjeta de Débito", icon: "CreditCard", type: "card" },
    { id: 3, name: "Efectivo", icon: "DollarSign", type: "cash" },
    { id: 4, name: "Transferencia", icon: "Banknote", type: "transfer" },
    { id: 5, name: "PayPal", icon: "CreditCard", type: "digital" },
    { id: 6, name: "Apple Pay", icon: "Smartphone", type: "digital" }
  ];

  const handleInputChange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto es requerido y debe ser mayor a 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    
    if (!formData.merchant.trim()) {
      newErrors.merchant = 'El comercio es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving expense:', formData);
      
      // Success - navigate to dashboard
      router.push('/financial-dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Error al guardar el gasto. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const headerActions = [
    {
      icon: "Settings",
      label: "Configuración",
      onClick: () => router.push('/categories-budget-management')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar 
        title="Registro Manual"
        showBack={true}
        actions={headerActions}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 pb-20">
        <div className="space-y-6 p-4">
          {/* Amount Input */}
          <AmountInput
            value={formData.amount}
            onChange={(value) => handleInputChange('amount', value)}
            error={errors.amount}
            currency="USD"
          />

          {/* Category Selector */}
          <CategorySelector
            categories={categories}
            selectedCategory={formData.category}
            onSelect={(category) => handleInputChange('category', category)}
            error={errors.category}
          />

          {/* Merchant Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Comercio
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => handleInputChange('merchant', e.target.value)}
              placeholder="Ej: Starbucks, Uber, Amazon..."
              className={`w-full px-4 py-3 rounded-lg border spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                errors.merchant 
                  ? 'border-error bg-error-50' 
                  : 'border-border bg-surface hover:bg-surface-hover focus:border-primary'
              }`}
            />
            {errors.merchant && (
              <p className="text-sm text-error mt-1">{errors.merchant}</p>
            )}
            
            {/* Merchant Suggestions */}
            {formData.merchant && merchantSuggestions.filter(s => 
              s.toLowerCase().includes(formData.merchant.toLowerCase())
            ).length > 0 && (
              <div className="mt-2 space-y-1">
                {merchantSuggestions
                  .filter(s => s.toLowerCase().includes(formData.merchant.toLowerCase()))
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange('merchant', suggestion)}
                      className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg spring-transition"
                    >
                      {suggestion}
                    </button>
                  ))
                }
              </div>
            )}
          </div>

          {/* Date Picker */}
          <DatePicker
            value={formData.date}
            onChange={(date) => handleInputChange('date', date)}
          />

          {/* Payment Method Selector */}
          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedMethod={formData.paymentMethod}
            onSelect={(method) => handleInputChange('paymentMethod', method)}
          />

          {/* Optional Fields Toggle */}
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="flex items-center space-x-2 text-primary font-medium hover:text-primary-700 spring-transition"
          >
            <Icon name={showOptionalFields ? "ChevronUp" : "ChevronDown"} size={16} />
            <span>Campos Opcionales</span>
          </button>

          {/* Optional Fields */}
          {showOptionalFields && (
            <div className="space-y-4 animate-slide-down">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Agrega una descripción..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
                />
              </div>

              {/* Photo Attachment */}
              <PhotoAttachment
                photo={formData.photo}
                onPhotoChange={(photo) => handleInputChange('photo', photo)}
              />
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-error-50 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </div>
            ) : (
              'Guardar Gasto'
            )}
          </button>
        </div>
      </form>

      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default ManualExpenseRegister; 