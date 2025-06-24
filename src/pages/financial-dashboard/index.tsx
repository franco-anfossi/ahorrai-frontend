import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import { DashboardData, Transaction, HeaderAction, Profile } from '@/types';
import { createClient } from '@/lib/supabase/component';

import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import SpendingChart from './components/SpendingChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import RecentTransactions from './components/RecentTransactions';
import QuickActionButton from './components/QuickActionButton';

const FinancialDashboard: NextPage = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(profile);
      }
    };
    fetchProfile();
  }, []);

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
        id: 1,
        merchant: "Starbucks Coffee",
        amount: 12.45,
        category: "Comida y Restaurantes",
        status: "completed",
        time: "2h ago",
        description: "Café de la mañana y pastel",
        icon: "Coffee"
      },
      {
        id: 2,
        merchant: "Uber Ride",
        amount: 18.75,
        category: "Transporte",
        status: "completed",
        time: "5h ago",
        description: "Viaje a la oficina del centro",
        icon: "Car"
      },
      {
        id: 3,
        merchant: "Amazon Purchase",
        amount: 89.99,
        category: "Compras",
        status: "pending",
        time: "Ayer",
        description: "Auriculares inalámbricos",
        icon: "Package"
      },
      {
        id: 4,
        merchant: "Netflix Subscription",
        amount: 15.99,
        category: "Entretenimiento",
        status: "completed",
        time: "17 Jun",
        description: "Servicio de streaming mensual",
        icon: "Film"
      },
      {
        id: 5,
        merchant: "Whole Foods Market",
        amount: 127.83,
        category: "Comida y Restaurantes",
        status: "completed",
        time: "16 Jun",
        description: "Compras semanales de comestibles",
        icon: "ShoppingCart"
      },
      {
        id: 6,
        merchant: "Shell Gas Station",
        amount: 45.20,
        category: "Transporte",
        status: "completed",
        time: "15 Jun",
        description: "Llenado de gasolina",
        icon: "Fuel"
      },
      {
        id: 7,
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
            {currentUser && (
              <img
                src={currentUser.avatar_url ?? ''}
                alt={currentUser.full_name ?? currentUser.email}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm text-text-secondary">Bienvenido de vuelta,</p>
            <p className="text-lg font-semibold text-text-primary">
              {currentUser?.full_name || currentUser?.email}
            </p>
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