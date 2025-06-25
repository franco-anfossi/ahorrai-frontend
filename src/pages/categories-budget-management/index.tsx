import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CategoryCard from './components/CategoryCard';
import BudgetSlider from './components/BudgetSlider';
import AlertSettings from './components/AlertSettings';
import CategoryCreationWizard from './components/CategoryCreationWizard';
import SpendingTrends from './components/SpendingTrends';
import AccountSection from './components/AccountSection';
import { CategoryInput, CategoryRecord, fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabase/categories';
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
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
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

  const handleEditCategory = async (category: CategoryRecord, data: CategoryInput): Promise<void> => {
    try {
      const updated = await updateCategory(category.id, data);
      setCategories((prev) => prev.map((c) => (c.id === category.id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (category: CategoryRecord): Promise<void> => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
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


  const headerActions = [
    {
      icon: 'Plus',
      label: 'Crear Categoría',
      onClick: () => {
        setEditingCategory(null);
        setShowCreateWizard(true);
      }
    },
    {
      icon: 'Save',
      label: 'Guardar Cambios',
      onClick: handleSaveChanges
    }
  ];

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
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
                onClick={() => handleOpenBudgetSlider(categories[0])}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition"
              >
                Configurar Presupuesto
              </button>
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
        actions={headerActions}
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
        onSave={(data) => {
          if (editingCategory) {
            handleEditCategory(editingCategory, data).then(() => setEditingCategory(null));
          } else {
            handleCreateCategory(data);
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
    </div>
  );
};

export default CategoriesBudgetManagement; 