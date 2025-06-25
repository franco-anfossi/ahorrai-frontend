import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CategoryCard from './components/CategoryCard';
import BudgetSlider from './components/BudgetSlider';
import BudgetCreationModal from './components/BudgetCreationModal';
import BudgetCard from './components/BudgetCard';
import AlertSettings from './components/AlertSettings';
import CategoryCreationWizard from './components/CategoryCreationWizard';
import SpendingTrends from './components/SpendingTrends';
import AccountSection from './components/AccountSection';
import { CategoryInput, CategoryRecord, fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabase/categories';
import { BudgetInput, BudgetRecord, fetchBudgets, createBudget, updateBudget, deleteBudget } from '@/lib/supabase/budgets';
import { ExpenseRecord, fetchExpenses } from '@/lib/supabase/expenses';
import { createClient } from '@/lib/supabase/component';

interface CategoriesBudgetManagementProps {}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const CategoriesBudgetManagement: React.FC<CategoriesBudgetManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [showCreateWizard, setShowCreateWizard] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [budgetSliderOpen, setBudgetSliderOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryRecord | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRecord | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const cats = await fetchCategories(user.id);
          setCategories(cats);
          const buds = await fetchBudgets(user.id);
          setBudgets(buds);
          const exps = await fetchExpenses(user.id);
          setExpenses(exps);
        } catch (err) {
          console.error(err);
        }
      }
    };
    load();
  }, []);

  const tabs: Tab[] = [
    { id: 'categories', label: 'Categorías', icon: 'Tag' },
    { id: 'budget', label: 'Presupuesto', icon: 'DollarSign' },
    { id: 'alerts', label: 'Alertas', icon: 'Bell' },
    { id: 'trends', label: 'Tendencias', icon: 'TrendingUp' },
    { id: 'account', label: 'Cuenta', icon: 'User' }
  ];

  const handleSaveChanges = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (data: CategoryInput): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const created = await createCategory(user.id, data);
      setCategories((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategoryWithBudget = async (
    data: CategoryInput,
    budget: { amount: number; period: string; start_date: string; end_date: string }
  ): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const createdCategory = await createCategory(user.id, data);
      setCategories(prev => [...prev, createdCategory]);

      const budgetInput: BudgetInput = {
        category_id: createdCategory.id,
        amount: budget.amount,
        period: budget.period,
        start_date: budget.start_date,
        end_date: budget.end_date
      };

      const createdBudget = await createBudget(user.id, budgetInput);
      setBudgets(prev => [...prev, createdBudget]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = async (category: CategoryRecord, data: CategoryInput): Promise<void> => {
    try {
      const updated = await updateCategory(category.id, data);
      setCategories((prev) => prev.map((c) => (c.id === category.id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (category: CategoryRecord): Promise<void> => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBudget = async (data: BudgetInput): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const created = await createBudget(user.id, data);
      setBudgets((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    } finally {
      setShowBudgetModal(false);
    }
  };

  const handleEditBudgetSave = async (budget: BudgetRecord, data: BudgetInput): Promise<void> => {
    try {
      const updated = await updateBudget(budget.id, data);
      setBudgets(prev => prev.map(b => b.id === budget.id ? updated : b));
    } catch (err) {
      console.error(err);
    } finally {
      setEditingBudget(null);
      setShowBudgetModal(false);
    }
  };

  const handleDeleteBudgetRecord = async (budget: BudgetRecord): Promise<void> => {
    if (!window.confirm('¿Eliminar este presupuesto?')) return;
    try {
      await deleteBudget(budget.id);
      setBudgets(prev => prev.filter(b => b.id !== budget.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBudget = (categoryId: number, amount: number): void => {
    console.log('Update budget for category:', categoryId, 'amount:', amount);
    setBudgetSliderOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenBudgetSlider = (category: CategoryRecord): void => {
    setSelectedCategory(category);
    setBudgetSliderOpen(true);
  };

  const getCategoryProgress = (categoryId: string): number => {
    const budget = budgets.find(b => b.category_id === categoryId);
    if (!budget) return 0;
    const spent = expenses
      .filter(e => e.category_id === categoryId &&
        new Date(e.date) >= new Date(budget.start_date) &&
        new Date(e.date) <= new Date(budget.end_date))
      .reduce((sum, e) => sum + e.amount, 0);
    if (!budget.amount) return 0;
    const percentage = (spent / budget.amount) * 100;
    if (isNaN(percentage) || !isFinite(percentage)) return 0;
    return percentage;
  };



  const renderTabContent = (): React.ReactNode | null => {
    switch (activeTab) {
      case 'categories':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Mis Categorías ({categories.length})
              </h3>
              <button
                onClick={() => setShowCreateWizard(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Icon name="Plus" size={16} className="inline mr-1" />
                Nueva Categoría
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  progress={getCategoryProgress(category.id)}
                  onEdit={() => {
                    setEditingCategory(category);
                    setShowCreateWizard(true);
                  }}
                  onDelete={() => handleDeleteCategory(category)}
                />
              ))}
            </div>
          </div>
        );
      
      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Configuración de Presupuesto
              </h3>
              <button
                onClick={() => { setEditingBudget(null); setShowBudgetModal(true); }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Agregar Presupuesto
              </button>
              {budgets.length > 0 && (
                <div className="mt-4 space-y-3">
                  {budgets.map((b) => {
                    const cat = categories.find(c => c.id === b.category_id);
                    return (
                      <BudgetCard
                        key={b.id}
                        budget={b}
                        category={cat}
                        onEdit={() => {
                          setEditingBudget(b);
                          setShowBudgetModal(true);
                        }}
                        onDelete={() => handleDeleteBudgetRecord(b)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Configuración de Alertas
            </h3>
            <AlertSettings categories={categories} />
          </div>
        );
      
      case 'trends':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Análisis de Tendencias
            </h3>
            <SpendingTrends categories={categories} />
          </div>
        );

      case 'account':
        return <AccountSection />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar
        title="Configuración"
        showBack={true}
      />

      {/* Tab Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium spring-transition whitespace-nowrap
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Modals */}
      <CategoryCreationWizard
        isOpen={showCreateWizard}
        initialData={editingCategory || undefined}
        onClose={() => {
          setShowCreateWizard(false);
          setEditingCategory(null);
        }}
        onSave={(catData, budgetData) => {
          if (editingCategory) {
            handleEditCategory(editingCategory, catData).then(() => setEditingCategory(null));
          } else {
            handleCreateCategoryWithBudget(catData, budgetData);
          }
          setShowCreateWizard(false);
        }}
      />

      <BudgetSlider
        isOpen={budgetSliderOpen}
        category={selectedCategory}
        onClose={() => setBudgetSliderOpen(false)}
        onUpdateBudget={handleUpdateBudget}
      />

      <BudgetCreationModal
        isOpen={showBudgetModal}
        categories={categories}
        initialData={editingBudget || undefined}
        onClose={() => { setShowBudgetModal(false); setEditingBudget(null); }}
        onSave={(data) => {
          if (editingBudget) {
            handleEditBudgetSave(editingBudget, data);
          } else {
            handleCreateBudget(data);
          }
        }}
      />
    </div>
  );
};

export default CategoriesBudgetManagement; 
