import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { CategoryInput, CategoryRecord } from '@/lib/supabase/categories';

interface CategoryCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryRecord;
  onSave: (category: CategoryInput) => void;
}

interface CategoryData {
  name: string;
  icon: string;
  color: string;
  budget: number;
  description: string;
}

const CategoryCreationWizard: React.FC<CategoryCreationWizardProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [step, setStep] = useState<number>(1);
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: initialData?.name || '',
    icon: initialData?.icon || 'Package',
    color: initialData?.color || '#3B82F6',
    budget: 500,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setCategoryData((prev) => ({
        ...prev,
        name: initialData.name,
        icon: initialData.icon,
        color: initialData.color,
      }));
    }
  }, [initialData]);

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
    const { name, icon, color } = categoryData;
    onSave({ name, icon, color });
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
              {initialData ? 'Edit Category' : 'Create Category'}
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
            <span className="text-sm text-text-secondary">Step {step} of 3</span>
            <span className="text-sm text-text-secondary">{Math.round((step/3)*100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="h-1 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step/3)*100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Category Details</h3>
                <p className="text-sm text-text-secondary mb-4">Give your category a name and description</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Food & Dining"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description (Optional)</label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this category..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Customize Appearance</h3>
                <p className="text-sm text-text-secondary mb-4">Choose an icon and color for your category</p>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Select Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((iconName) => (
                    <button
                      key={iconName}
                      onClick={() => handleInputChange('icon', iconName)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center spring-transition ${
                        categoryData.icon === iconName
                          ? 'bg-primary text-white' :'bg-surface-hover text-text-secondary hover:bg-primary-50 hover:text-primary'
                      }`}
                    >
                      <Icon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Select Color</label>
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
                <p className="text-sm font-medium text-text-primary mb-2">Preview</p>
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
                    <p className="font-medium text-text-primary">{categoryData.name || 'Category Name'}</p>
                    <p className="text-sm text-text-secondary">{categoryData.description || 'Description'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Set Budget</h3>
                <p className="text-sm text-text-secondary mb-4">Define your monthly budget for this category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Monthly Budget</label>
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

              {/* Recommended Budget */}
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Recommended Budget</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Based on similar categories, we recommend ${getRecommendedBudget()} per month.
                </p>
                <button
                  onClick={() => handleInputChange('budget', getRecommendedBudget())}
                  className="mt-2 text-sm text-primary hover:text-primary-700 font-medium"
                >
                  Use Recommended
                </button>
              </div>

              {/* Budget Tips */}
              <div className="bg-accent-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-text-primary">Budget Tips</span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Start with a realistic amount based on your current spending</li>
                  <li>• You can always adjust the budget later</li>
                  <li>• Consider seasonal variations in your spending</li>
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
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <div className="flex space-x-2">
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!categoryData.name.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!categoryData.name.trim() || categoryData.budget <= 0}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initialData ? 'Save Changes' : 'Create Category'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreationWizard; 