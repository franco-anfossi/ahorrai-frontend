import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import HeaderBar from 'components/ui/HeaderBar'
import BottomTabNavigation from 'components/ui/BottomTabNavigation'
import { DashboardData, Transaction, HeaderAction } from '@/types'

import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import SpendingChart from './components/SpendingChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import RecentTransactions from './components/RecentTransactions';
import QuickActionButton from './components/QuickActionButton';

interface DashboardProps {
  user: any
  categories: any[]
  budgets: any[]
  expenses: any[]
}

const FinancialDashboard: NextPage<DashboardProps> = ({
  user,
  categories,
  budgets,
  expenses,
}) => {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const currentUser = {
    name: user?.full_name || user?.email || 'User',
    avatar:
      user?.avatar_url ||
      'https://www.gravatar.com/avatar/?d=identicon&s=64',
  }

  const dashboardData: DashboardData = useMemo(() => {
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const monthExpenses = expenses.filter((e) => new Date(e.date) >= monthStart)
    const spent = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    const activeBudgets = budgets.filter((b) => {
      const start = new Date(b.start_date)
      const end = new Date(b.end_date)
      return start <= today && today <= end
    })
    const budgetTotal = activeBudgets.reduce((sum, b) => sum + Number(b.amount), 0)
    const remaining = budgetTotal - spent
    const percentage = budgetTotal > 0 ? (spent / budgetTotal) * 100 : 0

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const dailyAverage = spent / (today.getDate() || 1)
    const daysLeft = daysInMonth - today.getDate()

    // Weekly spending (Mon-Sun)
    const weeklyStart = new Date(today)
    weeklyStart.setDate(today.getDate() - 6)
    const weekAmounts = Array(7).fill(0)
    monthExpenses.forEach((e) => {
      const d = new Date(e.date)
      if (d >= weeklyStart && d <= today) {
        const idx = (d.getDay() + 6) % 7
        weekAmounts[idx] += Number(e.amount)
      }
    })
    const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    const weeklySpending = weekAmounts.map((amount, i) => ({
      day: dayLabels[i],
      amount,
    }))

    // Category breakdown
    const byCategory: Record<string, { name: string; amount: number; color: string; icon: string }> = {}
    monthExpenses.forEach((e) => {
      const cat = categories.find((c) => c.id === e.category_id)
      if (cat) {
        if (!byCategory[cat.id]) {
          byCategory[cat.id] = {
            name: cat.name,
            amount: 0,
            color: cat.color,
            icon: cat.icon,
          }
        }
        byCategory[cat.id].amount += Number(e.amount)
      }
    })
    const totalCategoryAmount = Object.values(byCategory).reduce((sum, c) => sum + c.amount, 0)
    const categoryBreakdown = Object.values(byCategory).map((c) => ({
      ...c,
      percentage: totalCategoryAmount > 0 ? (c.amount / totalCategoryAmount) * 100 : 0,
    }))

    // Recent transactions
    const recentTransactions: Transaction[] = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .map((e) => {
        const cat = categories.find((c) => c.id === e.category_id)
        return {
          id: e.id,
          merchant: e.merchant || '',
          amount: Number(e.amount),
          category: cat?.name || '',
          status: 'completed',
          time: e.date,
          description: e.description || '',
          icon: cat?.icon || 'Circle',
        }
      })

    return {
      currentMonth: {
        spent,
        budget: budgetTotal,
        remaining,
        percentage,
        currency: 'USD',
        dailyAverage,
        daysLeft,
      },
      weeklySpending,
      categoryBreakdown,
      recentTransactions,
    }
  }, [expenses, budgets, categories])

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