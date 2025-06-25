import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import { DashboardData, Transaction, HeaderAction } from '@/types';

import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import SpendingChart from './components/SpendingChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import RecentTransactions from './components/RecentTransactions';
import QuickActionButton from './components/QuickActionButton';

const FinancialDashboard: NextPage = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentUser] = useState({
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  });

  // Mock data for dashboard
  const [dashboardData] = useState<DashboardData>({
    currentMonth: {
      spent: 2847.50,
      budget: 3500.00,
      remaining: 652.50,
      percentage: 81.4,
      currency: "USD",
      dailyAverage: 149.87,
      daysLeft: 11
    },
    weeklySpending: [
      { day: "Lun", amount: 450 },
      { day: "Mar", amount: 320 },
      { day: "Mié", amount: 680 },
      { day: "Jue", amount: 420 },
      { day: "Vie", amount: 890 },
      { day: "Sáb", amount: 280 },
      { day: "Dom", amount: 150 }
    ],
    categoryBreakdown: [
      { name: "Comida y Restaurantes", amount: 1245.30, percentage: 43.7, color: "#EF4444", icon: "UtensilsCrossed" },
      { name: "Transporte", amount: 567.80, percentage: 19.9, color: "#3B82F6", icon: "Car" },
      { name: "Compras", amount: 423.90, percentage: 14.9, color: "#10B981", icon: "ShoppingBag" },
      { name: "Entretenimiento", amount: 312.50, percentage: 11.0, color: "#F59E0B", icon: "Film" },
      { name: "Servicios", amount: 298.00, percentage: 10.5, color: "#8B5CF6", icon: "Zap" }
    ],
    recentTransactions: [
      {
        id: '1d94fa0c-a350-40d8-84b5-895c30fb055d',
        merchant: "Starbucks Coffee",
        amount: 12.45,
        category: "Comida y Restaurantes",
        status: "completed",
        time: "2h ago",
        description: "Café de la mañana y pastel",
        icon: "Coffee"
      },
      {
        id: 'e6c1d1a3-2985-4c40-9d63-2f57f6aea2fa',
        merchant: "Uber Ride",
        amount: 18.75,
        category: "Transporte",
        status: "completed",
        time: "5h ago",
        description: "Viaje a la oficina del centro",
        icon: "Car"
      },
      {
        id: 'b1a9371e-d1a9-462b-93d3-1a80f04f0b44',
        merchant: "Amazon Purchase",
        amount: 89.99,
        category: "Compras",
        status: "pending",
        time: "Ayer",
        description: "Auriculares inalámbricos",
        icon: "Package"
      },
      {
        id: '5457205a-bf9a-420c-b3d9-0b4059ed10e9',
        merchant: "Netflix Subscription",
        amount: 15.99,
        category: "Entretenimiento",
        status: "completed",
        time: "17 Jun",
        description: "Servicio de streaming mensual",
        icon: "Film"
      },
      {
        id: 'd0022dd0-7ee5-4bf1-bf5e-d0b7b9e2b86c',
        merchant: "Whole Foods Market",
        amount: 127.83,
        category: "Comida y Restaurantes",
        status: "completed",
        time: "16 Jun",
        description: "Compras semanales de comestibles",
        icon: "ShoppingCart"
      },
      {
        id: '16cb8653-1307-43e0-b0e2-fc3d9a94b3c9',
        merchant: "Shell Gas Station",
        amount: 45.20,
        category: "Transporte",
        status: "completed",
        time: "15 Jun",
        description: "Llenado de gasolina",
        icon: "Fuel"
      },
      {
        id: 'f4e47ce1-6d9f-4cf2-b75f-2f1a57a4bd01',
        merchant: "Movie Theater",
        amount: 32.50,
        category: "Entretenimiento",
        status: "completed",
        time: "14 Jun",
        description: "Entradas de cine del fin de semana",
        icon: "Film"
      }
    ]
  });

  const handlePullToRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleQuickAction = (action: string): void => {
    switch (action) {
      case 'scan': 
        router.push('/scan-expense-ai-receipt-processing');
        break;
      case 'manual': 
        router.push('/manual-expense-register');
        break;
      default:
        break;
    }
  };

  const handleTransactionClick = (transaction: Transaction): void => {
    router.push(`/expense-details-edit?id=${transaction.id}`);
  };

  const headerActions: HeaderAction[] = [
    {
      icon: 'Bell',
      label: 'Notificaciones',
      onClick: () => console.log('Notifications clicked')
    },
    {
      icon: 'Settings',
      label: 'Configuración',
      onClick: () => router.push('/categories-budget-management')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar 
        title="AhorrAI"
        actions={headerActions}
      />

      {/* User Welcome Section */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Bienvenido de vuelta,</p>
            <p className="text-lg font-semibold text-text-primary">{currentUser.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-text-secondary">Actualizando...</span>
          </div>
        )}

        <div className="space-y-6 p-4">
          {/* Expense Summary Card */}
          <ExpenseSummaryCard 
            data={dashboardData.currentMonth}
            onRefresh={handlePullToRefresh}
          />

          {/* Spending Chart */}
          <SpendingChart 
            data={dashboardData.weeklySpending}
            currency={dashboardData.currentMonth.currency}
          />

          {/* Category Breakdown */}
          <CategoryBreakdown 
            data={dashboardData.categoryBreakdown}
            currency={dashboardData.currentMonth.currency}
          />

          {/* Recent Transactions */}
          <RecentTransactions 
            transactions={dashboardData.recentTransactions}
            currency={dashboardData.currentMonth.currency}
            onTransactionClick={handleTransactionClick}
          />
        </div>
      </div>

      {/* Quick Action Button */}
      <QuickActionButton onAction={handleQuickAction} />

      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default FinancialDashboard; 