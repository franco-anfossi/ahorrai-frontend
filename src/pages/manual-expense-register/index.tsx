import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from '@/components/AppIcon';
import HeaderBar from '@/components/ui/HeaderBar';
import BottomTabNavigation from '@/components/ui/BottomTabNavigation';
import AmountInput from './components/AmountInput';
import CategorySelector from './components/CategorySelector';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import DatePicker from './components/DatePicker';
import PhotoAttachment from './components/PhotoAttachment';
import { PaymentMethod } from '@/types';
import { createClient } from '@/lib/supabase/component';
import { createExpense } from '@/lib/supabase/expenses';
import { fetchCategories, CategoryRecord } from '@/lib/supabase/categories';

interface PhotoData {
  file: File;
  preview: string;
}

interface FormData {
  amount: string;
  category: CategoryRecord | null;
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
  const [currency, setCurrency] = useState('CLP');
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

  const [categories, setCategories] = useState<CategoryRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const result = await fetchCategories(user.id);
          setCategories(result);
        } catch (err) {
          console.error(err);
        }
      }
    };
    load();
  }, []);

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
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      await createExpense(user.id, {
        category_id: String(formData.category?.id ?? ''),
        amount: parseFloat(formData.amount),
        date: formData.date,
        merchant: formData.merchant,
        description: formData.description,
        payment_method: formData.paymentMethod?.name,
      });

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
            currency={currency}
            onCurrencyChange={setCurrency}
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
                  Nota
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Agrega una nota..."
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
            className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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