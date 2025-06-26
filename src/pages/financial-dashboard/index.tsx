import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import HeaderBar from "components/ui/HeaderBar";
import BottomTabNavigation from "components/ui/BottomTabNavigation";
import { DashboardData, Transaction, HeaderAction, Profile } from "@/types";
import { createClient } from "@/lib/supabase/component";
import { fetchCategories, CategoryRecord } from "@/lib/supabase/categories";
import { fetchBudgets, BudgetRecord } from "@/lib/supabase/budgets";
import { fetchExpenses, ExpenseRecord, deleteExpense } from "@/lib/supabase/expenses";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";

import ExpenseSummaryCard from "./components/ExpenseSummaryCard";
import SpendingChart from "./components/SpendingChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import RecentTransactions from "./components/RecentTransactions";
import QuickActionButton from "./components/QuickActionButton";

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
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setCurrentUser(profile);
      }
    };
    fetchProfile();
  }, []);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const fetchDashboardData = async (): Promise<void> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const [cats, buds, exps] = await Promise.all<
        [CategoryRecord[], BudgetRecord[], ExpenseRecord[]]
      >([
        fetchCategories(user.id),
        fetchBudgets(user.id),
        fetchExpenses(user.id),
      ]);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const categoryData = cats.map((cat) => {
        const catExpenses = exps.filter(
          (e) =>
            e.category_id === cat.id &&
            new Date(e.date) >= monthStart &&
            new Date(e.date) <= monthEnd,
        );
        const amount = catExpenses.reduce((sum, e) => sum + e.amount, 0);
        const transactions = catExpenses.length;
        const average = transactions ? amount / transactions : 0;
        const lastMonthAmount = exps
          .filter(
            (e) =>
              e.category_id === cat.id &&
              new Date(e.date) >= prevMonthStart &&
              new Date(e.date) <= prevMonthEnd,
          )
          .reduce((sum, e) => sum + e.amount, 0);
        const vsLastMonth =
          lastMonthAmount > 0
            ? ((amount - lastMonthAmount) / lastMonthAmount) * 100
            : null;
        const budgetRecord = buds.find(
          (b) =>
            b.category_id === cat.id &&
            new Date(b.start_date) <= monthEnd &&
            new Date(b.end_date) >= monthStart,
        );
        return {
          name: cat.name,
          amount,
          percentage: 0,
          color: cat.color,
          icon: cat.icon,
          transactions,
          average,
          vsLastMonth,
          budget: budgetRecord ? budgetRecord.amount : null,
        };
      });

      const totalSpent = categoryData.reduce((sum, c) => sum + c.amount, 0);
      const withPercent = categoryData.map((c) => ({
        ...c,
        percentage: totalSpent > 0 ? +(c.amount / totalSpent) * 100 : 0,
      }));
      withPercent.sort((a, b) => b.amount - a.amount);
      const topCategories = withPercent.slice(0, 5);

      const monthBudgets = buds.filter(
        (b) =>
          new Date(b.start_date) <= monthEnd &&
          new Date(b.end_date) >= monthStart,
      );
      const totalBudget = monthBudgets.reduce((sum, b) => sum + b.amount, 0);

      const dailyAverage = now.getDate() ? totalSpent / now.getDate() : 0;
      const daysLeft = monthEnd.getDate() - now.getDate();
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      const daysMap: Record<string, number> = {
        Lun: 0,
        Mar: 0,
        Mié: 0,
        Jue: 0,
        Vie: 0,
        Sáb: 0,
        Dom: 0,
      };
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      exps.forEach((exp) => {
        const d = new Date(exp.date);
        if (d >= weekStart && d <= now) {
          const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          const key = dayNames[d.getDay()];
          daysMap[key] = (daysMap[key] || 0) + exp.amount;
        }
      });
      const order = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const weeklySpending = order.map((d) => ({
        label: d,
        amount: daysMap[d] || 0,
      }));

      const months: string[] = [];
      const monthlyMap: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString('es-ES', { month: 'short' });
        months.push(key);
        monthlyMap[key] = 0;
      }
      exps.forEach((exp) => {
        const d = new Date(exp.date);
        const key = d.toLocaleString('es-ES', { month: 'short' });
        if (key in monthlyMap) {
          monthlyMap[key] += exp.amount;
        }
      });
      const monthlySpending = months.map((m) => ({ label: m, amount: monthlyMap[m] }));

      const recentExpenses = [...exps]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
        .map((exp) => {
          const category = cats.find((c) => c.id === exp.category_id);
          return {
            id: exp.id,
            merchant: exp.merchant || "Gasto",
            amount: exp.amount,
            category: category?.name || "",
            status: "completed" as const,
            time: exp.date,
            description: exp.description || "",
            icon: category?.icon || "Receipt",
          };
        });

      setDashboardData({
        currentMonth: {
          spent: totalSpent,
          budget: totalBudget,
          remaining: totalBudget - totalSpent,
          percentage,
          currency: "CLP",
          dailyAverage,
          daysLeft,
        },
        weeklySpending,
        monthlySpending,
        categoryBreakdown: topCategories,
        recentTransactions: recentExpenses,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePullToRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const handleQuickAction = (action: string): void => {
    switch (action) {
      case "scan":
        router.push("/scan-expense-ai-receipt-processing");
        break;
      case "manual":
        router.push("/manual-expense-register");
        break;
      default:
        break;
    }
  };

  const handleTransactionClick = (transaction: Transaction): void => {
    router.push(`/expense-details-edit?id=${transaction.id}`);
  };

  const handleDeleteTransaction = async (id: string): Promise<void> => {
    try {
      await deleteExpense(id);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const headerActions: HeaderAction[] = [
    {
      icon: "Bell",
      label: "Notificaciones",
      onClick: () => console.log("Notifications clicked"),
    },
    {
      icon: "Settings",
      label: "Configuración",
      onClick: () => router.push("/categories-budget-management"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar title="AhorrAI" actions={headerActions} />

      {/* User Welcome Section */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {currentUser && (
              <img
                src={currentUser.avatar_url ?? DEFAULT_AVATAR_URL}
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
            <span className="ml-2 text-sm text-text-secondary">
              Actualizando...
            </span>
          </div>
        )}

        <div className="space-y-6 p-4">
          {/* Expense Summary Card */}
          {dashboardData && (
            <ExpenseSummaryCard
              data={dashboardData.currentMonth}
              onRefresh={handlePullToRefresh}
            />
          )}

          {/* Spending Chart */}
          {dashboardData && (
            <SpendingChart
              weeklyData={dashboardData.weeklySpending}
              monthlyData={dashboardData.monthlySpending}
              currency={dashboardData.currentMonth.currency}
            />
          )}

          {/* Category Breakdown */}
          {dashboardData && (
            <CategoryBreakdown
              data={dashboardData.categoryBreakdown}
              currency={dashboardData.currentMonth.currency}
            />
          )}

          {/* Recent Transactions */}
          {dashboardData && (
            <RecentTransactions
              transactions={dashboardData.recentTransactions}
              currency={dashboardData.currentMonth.currency}
              onTransactionClick={handleTransactionClick}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
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
