import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { Expense } from '../../../types';

interface FormData {
  amount: number;
  merchant: string;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  description: string;
  notes: string;
  tags: string[];
  date: string;
  time: string;
}

interface EditExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
  onSave: (data: Partial<Expense>) => void;
  isSaving: boolean;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onSave, isSaving }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: expense.amount,
    merchant: expense.merchant,
    category: expense.category,
    description: expense.description || '',
    notes: expense.notes || '',
    tags: expense.tags || [],
    date: new Date(expense.date).toISOString().split('T')[0],
    time: new Date(expense.date).toTimeString().split(' ')[0].slice(0, 5)
  });

  const [newTag, setNewTag] = useState<string>('');
  const [showCategorySelector, setShowCategorySelector] = useState<boolean>(false);

  const categories: { id: number; name: string; icon: string; color: string }[] = [
    { id: 1, name: "Food & Dining", icon: "UtensilsCrossed", color: "#10B981" },
    { id: 2, name: "Transportation", icon: "Car", color: "#3B82F6" },
    { id: 3, name: "Shopping", icon: "ShoppingBag", color: "#8B5CF6" },
    { id: 4, name: "Entertainment", icon: "Film", color: "#F59E0B" },
    { id: 5, name: "Healthcare", icon: "Heart", color: "#EF4444" },
    { id: 6, name: "Utilities", icon: "Zap", color: "#06B6D4" },
    { id: 7, name: "Education", icon: "BookOpen", color: "#84CC16" },
    { id: 8, name: "Other", icon: "MoreHorizontal", color: "#6B7280" }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (category: { id: number; name: string; icon: string; color: string }) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    setShowCategorySelector(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<Expense> = {
      amount: formData.amount,
      merchant: formData.merchant,
      category: formData.category,
      description: formData.description,
      notes: formData.notes,
      tags: formData.tags,
      date: new Date(`${formData.date}T${formData.time}`).toISOString()
    };
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Amount */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
            $
          </span>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Merchant */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Merchant
        </label>
        <input
          type="text"
          value={formData.merchant}
          onChange={(e) => handleInputChange('merchant', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
          placeholder="Enter merchant name"
          required
        />
      </div>

      {/* Category */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Category
        </label>
        <button
          type="button"
          onClick={() => setShowCategorySelector(!showCategorySelector)}
          className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${formData.category.color}20` }}
            >
              <Icon 
                name={formData.category.icon} 
                size={16} 
                style={{ color: formData.category.color }}
              />
            </div>
            <span className="text-text-primary">{formData.category.name}</span>
          </div>
          <Icon name="ChevronDown" size={20} className="text-text-secondary" />
        </button>

        {showCategorySelector && (
          <div className="mt-2 border border-border rounded-lg bg-background max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-surface-hover spring-transition text-left focus:outline-none focus:bg-surface-hover"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon 
                    name={category.icon} 
                    size={16} 
                    style={{ color: category.color }}
                  />
                </div>
                <span className="text-text-primary">{category.name}</span>
                {formData.category.id === category.id && (
                  <Icon name="Check" size={16} className="text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date & Time */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
          placeholder="Enter description"
        />
      </div>

      {/* Notes */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary resize-none"
          placeholder="Enter notes"
        />
      </div>

      {/* Tags */}
      <div className="bg-surface rounded-xl p-4 card-shadow">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Tags
        </label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary text-sm"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-primary-700"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditExpenseForm; 