import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Expense, Category, Budget } from '../types';

// App State Interface
interface AppState {
  user: User | null;
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

// Root State Interface
export interface RootState {
  app: AppState;
}

// Initial State
const initialState: AppState = {
  user: null,
  expenses: [],
  categories: [],
  budgets: [],
  loading: false,
  error: null
};

// Create app slice using Redux Toolkit
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  }
});

// Export actions
export const {
  setLoading,
  setError,
  addExpense,
  updateExpense,
  deleteExpense,
  setCategories,
  setBudgets,
  updateUser
} = appSlice.actions;

// Create the store
export const store = configureStore({
  reducer: {
    app: appSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['app.expenses']
      },
    }),
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = any; // You can replace 'any' with proper thunk type if needed 