import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';

import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CategoryCard from './components/CategoryCard';
import BudgetSlider from './components/BudgetSlider';
import AlertSettings from './components/AlertSettings';
import CategoryCreationWizard from './components/CategoryCreationWizard';
import SpendingTrends from './components/SpendingTrends';
import { Category } from '../../types';

interface CategoriesBudgetManagementProps {}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const CategoriesBudgetManagement: React.FC<CategoriesBudgetManagementProps> = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [showCreateWizard, setShowCreateWizard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [budgetSliderOpen, setBudgetSliderOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Mock data for categories
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: "Comida y Restaurantes",
      icon: "UtensilsCrossed",
      color: "#EF4444",
      budget: 800,
      spent: 645.30,
      percentage: 80.7,
      trend: "up",
      trendValue: 12.5,
      isOverBudget: false,
      transactions: 24,
      lastTransaction: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Transporte",
      icon: "Car",
      color: "#3B82F6",
      budget: 400,
      spent: 267.80,
      percentage: 66.9,
      trend: "down",
      trendValue: 8.2,
      isOverBudget: false,
      transactions: 18,
      lastTransaction: "2024-01-14T08:15:00Z"
    },
    {
      id: 3,
      name: "Compras",
      icon: "ShoppingBag",
      color: "#10B981",
      budget: 300,
      spent: 223.90,
      percentage: 74.6,
      trend: "up",
      trendValue: 15.3,
      isOverBudget: false,
      transactions: 12,
      lastTransaction: "2024-01-13T16:45:00Z"
    },
    {
      id: 4,
      name: "Entretenimiento",
      icon: "Film",
      color: "#F59E0B",
      budget: 200,
      spent: 112.50,
      percentage: 56.3,
      trend: "down",
      trendValue: 5.7,
      isOverBudget: false,
      transactions: 8,
      lastTransaction: "2024-01-12T20:00:00Z"
    },
    {
      id: 5,
      name: "Servicios",
      icon: "Zap",
      color: "#8B5CF6",
      budget: 150,
      spent: 98.00,
      percentage: 65.3,
      trend: "stable",
      trendValue: 0.0,
      isOverBudget: false,
      transactions: 6,
      lastTransaction: "2024-01-11T14:20:00Z"
    }
  ]);

  const tabs: Tab[] = [
    { id: 'categories', label: 'Categorías', icon: 'Tag' },
    { id: 'budget', label: 'Presupuesto', icon: 'DollarSign' },
    { id: 'alerts', label: 'Alertas', icon: 'Bell' },
    { id: 'trends', label: 'Tendencias', icon: 'TrendingUp' }
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

  const handleUpdateBudget = (categoryId: number, amount: number): void => {
    console.log('Update budget for category:', categoryId, 'amount:', amount);
    setBudgetSliderOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenBudgetSlider = (category: Category): void => {
    setSelectedCategory(category);
    setBudgetSliderOpen(true);
  };

  const headerActions = [
    {
      icon: 'Plus',
      label: 'Crear Categoría',
      onClick: () => setShowCreateWizard(true)
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
                  onEdit={() => console.log('Edit category:', category.id)}
                  onDelete={() => console.log('Delete category:', category.id)}
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
        onClose={() => setShowCreateWizard(false)}
        onCreateCategory={(newCategory) => {
          console.log('New category created:', newCategory);
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