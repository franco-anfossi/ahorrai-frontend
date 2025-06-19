import { Expense, Category, Budget } from '../types';

// Action Types
export const SET_LOADING = 'SET_LOADING' as const;
export const SET_ERROR = 'SET_ERROR' as const;
export const ADD_EXPENSE = 'ADD_EXPENSE' as const;
export const UPDATE_EXPENSE = 'UPDATE_EXPENSE' as const;
export const DELETE_EXPENSE = 'DELETE_EXPENSE' as const;
export const SET_CATEGORIES = 'SET_CATEGORIES' as const;
export const SET_BUDGETS = 'SET_BUDGETS' as const;

// Action Types Union
export type ActionTypes = 
  | typeof SET_LOADING
  | typeof SET_ERROR
  | typeof ADD_EXPENSE
  | typeof UPDATE_EXPENSE
  | typeof DELETE_EXPENSE
  | typeof SET_CATEGORIES
  | typeof SET_BUDGETS;

// Action Interfaces
interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string | null;
}

interface AddExpenseAction {
  type: typeof ADD_EXPENSE;
  payload: Expense;
}

interface UpdateExpenseAction {
  type: typeof UPDATE_EXPENSE;
  payload: Expense;
}

interface DeleteExpenseAction {
  type: typeof DELETE_EXPENSE;
  payload: number;
}

interface SetCategoriesAction {
  type: typeof SET_CATEGORIES;
  payload: Category[];
}

interface SetBudgetsAction {
  type: typeof SET_BUDGETS;
  payload: Budget[];
}

// Union of all actions
export type AppAction = 
  | SetLoadingAction
  | SetErrorAction
  | AddExpenseAction
  | UpdateExpenseAction
  | DeleteExpenseAction
  | SetCategoriesAction
  | SetBudgetsAction;

// Action Creators
export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: loading
});

export const setError = (error: string | null): SetErrorAction => ({
  type: SET_ERROR,
  payload: error
});

export const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>): AddExpenseAction => ({
  type: ADD_EXPENSE,
  payload: {
    ...expense,
    id: Date.now(),
    createdAt: new Date().toISOString()
  } as Expense
});

export const updateExpense = (expense: Expense): UpdateExpenseAction => ({
  type: UPDATE_EXPENSE,
  payload: {
    ...expense,
    updatedAt: new Date().toISOString()
  }
});

export const deleteExpense = (expenseId: number): DeleteExpenseAction => ({
  type: DELETE_EXPENSE,
  payload: expenseId
});

export const setCategories = (categories: Category[]): SetCategoriesAction => ({
  type: SET_CATEGORIES,
  payload: categories
});

export const setBudgets = (budgets: Budget[]): SetBudgetsAction => ({
  type: SET_BUDGETS,
  payload: budgets
}); 