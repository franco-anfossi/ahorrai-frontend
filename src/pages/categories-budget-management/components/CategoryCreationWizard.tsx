import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { CategoryInput, CategoryRecord } from '@/lib/supabase/categories';

interface BudgetDetails {
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
}

interface CategoryCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryRecord;
  onSave: (category: CategoryInput, budget: BudgetDetails) => void;
}

interface CategoryData {
  name: string;
  icon: string;
  color: string;
  budget: number;
  period: string;
  startDate: string;
  endDate: string;
  description: string;
}

const CategoryCreationWizard: React.FC<CategoryCreationWizardProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [step, setStep] = useState<number>(1);
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: '',
    icon: 'Package',
    color: '#3B82F6',
    budget: 500,
    period: 'mensual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split('T')[0];
    })(),
    description: ''
  });

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);

    if (initialData) {
      setCategoryData({
        name: initialData.name,
        icon: initialData.icon,
        color: initialData.color,
        budget: 500,
        period: 'mensual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 1);
          return d.toISOString().split('T')[0];
        })(),
        description: initialData.description || ''
      });
    } else {
      setCategoryData({
        name: '',
        icon: 'Package',
        color: '#3B82F6',
        budget: 500,
        period: 'mensual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 1);
          return d.toISOString().split('T')[0];
        })(),
        description: ''
      });
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const start = new Date(categoryData.startDate);
    if (isNaN(start.getTime())) return;
    const end = new Date(start);
    if (categoryData.period === 'mensual') {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }
    const endStr = end.toISOString().split('T')[0];
    setCategoryData(prev => ({ ...prev, endDate: endStr }));
  }, [categoryData.startDate, categoryData.period]);

  const availableIcons: string[] = [
    'UtensilsCrossed', 'Car', 'Film', 'ShoppingBag', 'Heart', 'Zap',
    'Home', 'Gamepad2', 'GraduationCap', 'Plane', 'Coffee', 'Shirt',
    'Dumbbell', 'Book', 'Music', 'Camera', 'Gift', 'Briefcase'
  ];

  const availableColors: string[] = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6', '#F59E0B'
  ];

  const recommendedBudgets: Record<string, number> = {
    'Food & Dining': 800,
    'Transportation': 400,
    'Entertainment': 300,
    'Shopping': 600,
    'Healthcare': 200,
    'Utilities': 250,
    'Education': 500,
    'Travel': 1000
  };

  const handleInputChange = (field: keyof CategoryData, value: string | number): void => {
    setCategoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = (): void => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = (): void => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = (): void => {
    const { name, icon, color, budget, period, startDate, endDate, description } = categoryData;
    const budgetDetails: BudgetDetails = {
      amount: budget,
      period,
      start_date: startDate,
      end_date: endDate
    };
    onSave({ name, icon, color, description }, budgetDetails);
  };

  const getRecommendedBudget = (): number => {
    const similar = Object.keys(recommendedBudgets).find(key => 
      key.toLowerCase().includes(categoryData.name.toLowerCase()) ||
      categoryData.name.toLowerCase().includes(key.toLowerCase())
    );
    return similar ? recommendedBudgets[similar] : 500;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name={initialData ? 'Pencil' : 'Plus'} size={16} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              {initialData ? 'Editar Categoría' : 'Crear Categoría'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover spring-transition"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-3 bg-background">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Paso {step} de 3</span>
            <span className="text-sm text-text-secondary">{Math.round((step/3)*100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="h-1 bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(step/3)*100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Detalles de Categoría</h3>
                <p className="text-sm text-text-secondary mb-4">Asigna un nombre y descripción a la categoría</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ej.: Alimentación"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Descripción (Opcional)</label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descripción de esta categoría..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Personalizar Apariencia</h3>
                <p className="text-sm text-text-secondary mb-4">Elige un ícono y color para tu categoría</p>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Seleccionar Ícono</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((iconName) => (
                    <button
                      key={iconName}
                      onClick={() => handleInputChange('icon', iconName)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center spring-transition ${
                        categoryData.icon === iconName
                          ? 'bg-primary-500 text-white' :'bg-surface-hover text-text-secondary hover:bg-primary-50 hover:text-primary'
                      }`}
                    >
                      <Icon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Seleccionar Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleInputChange('color', color)}
                      className={`w-8 h-8 rounded-lg border-2 spring-transition ${
                        categoryData.color === color
                          ? 'border-text-primary scale-110' :'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-background rounded-lg p-3">
                <p className="text-sm font-medium text-text-primary mb-2">Vista previa</p>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${categoryData.color}20` }}
                  >
                    <Icon 
                      name={categoryData.icon} 
                      size={20} 
                      style={{ color: categoryData.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{categoryData.name || 'Nombre de la Categoría'}</p>
                    <p className="text-sm text-text-secondary">{categoryData.description || 'Descripción'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Definir Presupuesto</h3>
                <p className="text-sm text-text-secondary mb-4">Indica el monto y periodo del presupuesto para esta categoría</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    value={categoryData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                    min="0"
                    step="10"
                    className="w-full pl-8 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Periodo</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={categoryData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                >
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Fecha de Inicio</label>
                <input
                  type="date"
                  value={categoryData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Fecha de Fin</label>
                <input
                  type="date"
                  value={categoryData.endDate}
                  readOnly
                  className="w-full px-3 py-2 border border-border rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Recommended Budget */}
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Presupuesto Recomendado</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Basado en categorías similares, recomendamos ${getRecommendedBudget()} al mes.
                </p>
                <button
                  onClick={() => handleInputChange('budget', getRecommendedBudget())}
                  className="mt-2 text-sm text-primary hover:text-primary-700 font-medium"
                >
                  Usar recomendado
                </button>
              </div>

              {/* Budget Tips */}
              <div className="bg-accent-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-text-primary">Consejos de Presupuesto</span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Comienza con un monto realista basado en tu gasto actual</li>
                  <li>• Siempre puedes ajustar el presupuesto después</li>
                  <li>• Considera variaciones estacionales en tus gastos</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <button
            onClick={step === 1 ? onClose : handlePrevious}
            className="px-4 py-2 text-text-secondary hover:text-text-primary spring-transition"
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          
          <div className="flex space-x-2">
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!categoryData.name.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!categoryData.name.trim() || categoryData.budget <= 0}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreationWizard; 
