import { RootState, Expense, Category, Budget, User } from '../types';

// Basic selectors
export const selectAppState = (state: RootState) => state.app;

export const selectUser = (state: RootState): User | null => state.app.user;

export const selectExpenses = (state: RootState): Expense[] => state.app.expenses;

export const selectCategories = (state: RootState): Category[] => state.app.categories;

export const selectBudgets = (state: RootState): Budget[] => state.app.budgets;

export const selectLoading = (state: RootState): boolean => state.app.loading;

export const selectError = (state: RootState): string | null => state.app.error;

// Computed selectors
export const selectTotalExpenses = (state: RootState): number => {
  const expenses = selectExpenses(state);
  return expenses.reduce((total, expense) => total + (parseFloat(expense.amount.toString()) || 0), 0);
};

export const selectExpensesByCategory = (state: RootState): Record<string, Expense[]> => {
  const expenses = selectExpenses(state);
  return expenses.reduce((acc, expense) => {
    const category = expense.category?.name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
};

export const selectRecentExpenses = (state: RootState, limit: number = 10): Expense[] => {
  const expenses = selectExpenses(state);
  return expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const selectExpensesByDateRange = (state: RootState, startDate: Date, endDate: Date): Expense[] => {
  const expenses = selectExpenses(state);
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

export const selectCategoryById = (state: RootState, categoryId: number): Category | undefined => {
  const categories = selectCategories(state);
  return categories.find(category => category.id === categoryId);
};

export const selectExpensesByCategoryId = (state: RootState, categoryId: number): Expense[] => {
  const expenses = selectExpenses(state);
  return expenses.filter(expense => expense.category?.id === categoryId);
};

export const selectBudgetByCategoryId = (state: RootState, categoryId: number): Budget | undefined => {
  const budgets = selectBudgets(state);
  return budgets.find(budget => budget.categoryId === categoryId);
};

export const selectTotalSpentByCategory = (state: RootState, categoryId: number): number => {
  const expenses = selectExpensesByCategoryId(state, categoryId);
  return expenses.reduce((total, expense) => total + (parseFloat(expense.amount.toString()) || 0), 0);
};

export const selectBudgetProgress = (state: RootState, categoryId: number): { spent: number; budget: number; percentage: number } => {
  const budget = selectBudgetByCategoryId(state, categoryId);
  const spent = selectTotalSpentByCategory(state, categoryId);
  
  if (!budget) {
    return { spent, budget: 0, percentage: 0 };
  }
  
  return {
    spent,
    budget: budget.amount,
    percentage: (spent / budget.amount) * 100
  };
}; 