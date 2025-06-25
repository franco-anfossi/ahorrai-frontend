import React from 'react';

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  isOverBudget: boolean;
  transactions: number;
  lastTransaction: string;
}

// Supabase Category Record
export interface CategoryRecord {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

// Payment Method Types
export interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  type: 'card' | 'cash' | 'transfer' | 'digital';
  last4?: string;
}

// Budget Types
export interface Budget {
  id: number;
  categoryId: number;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

// Root State Types
export interface AppState {
  user: User | null;
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  app: AppState;
}

// Transaction Types
export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  time: string;
  description?: string;
  icon?: string;
  categoryIcon?: string;
}

// Expense Types
export interface Expense {
  id: number;
  amount: number;
  currency: string;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  merchant: string;
  date: string;
  paymentMethod: string;
  cardLast4: string | null;
  description?: string;
  tags?: string[];
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    } | null;
  };
  receiptImage?: string | null;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
  activityLog?: ActivityLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

// Dashboard Types
export interface DashboardData {
  currentMonth: {
    spent: number;
    budget: number;
    remaining: number;
    percentage: number;
    currency: string;
    dailyAverage: number;
    daysLeft: number;
  };
  weeklySpending: WeeklySpending[];
  monthlySpending: MonthlySpending[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
}

export interface WeeklySpending {
  label: string;
  amount: number;
}

export interface MonthlySpending {
  label: string;
  amount: number;
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  transactions?: number | null;
  average?: number | null;
  vsLastMonth?: number | null;
  budget?: number | null;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  stores: Store[];
  priceHistory: PriceHistory[];
}

export interface Store {
  name: string;
  price: number;
  inStock: boolean;
}

export interface PriceHistory {
  date: string;
  price: number;
}

// Component Props Types
export interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: HeaderAction[];
}

export interface HeaderAction {
  icon: string;
  label: string;
  onClick: () => void;
}

export interface BottomTabNavigationProps {
  currentRoute?: string;
}

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
  onTransactionClick: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export interface ExpenseSummaryCardProps {
  expense: Expense;
}

export interface ExpenseDetailsSectionProps {
  expense: Expense;
}

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export interface PriceChartProps {
  data: PriceHistory[];
}

export interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export interface FilterChipsProps {
  filters: Filter[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

export interface Filter {
  id: string;
  label: string;
  icon: string;
}

export interface SortControlsProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface SortOption {
  value: string;
  label: string;
}

// Modal Types
export interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  expense: Expense;
}

export interface SplitExpenseModalProps {
  onClose: () => void;
  expense: Expense;
}

export interface ShareExpenseModalProps {
  onClose: () => void;
  expense: Expense;
}

export interface PriceAlertModalProps {
  product: Product;
  onClose: () => void;
  onSave: (alertData: PriceAlertData) => void;
}

export interface PriceAlertData {
  targetPrice: number;
  email?: string;
  notificationType: 'email' | 'push' | 'both';
}

// Router Types
export interface NextPageWithLayout<P = {}> {
  (props: P): React.ReactElement;
  getLayout?: (page: React.ReactElement) => React.ReactElement;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ReceiptProcessingResult {
  success: boolean;
  extractedText?: string;
  imageUrl?: string;
  error?: string;
} 