import { createClient } from './component'

export interface ExpenseInput {
  category_id: string
  amount: number
  date: string
  merchant?: string
  description?: string
  payment_method?: string
}

export interface ExpenseRecord extends ExpenseInput {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export async function fetchExpenses(userId: string): Promise<ExpenseRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) {
    throw error
  }
  return (data as ExpenseRecord[]) || []
}

export async function createExpense(userId: string, expense: ExpenseInput): Promise<ExpenseRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .insert([{ user_id: userId, ...expense }])
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as ExpenseRecord
}

export async function updateExpense(id: string, updates: Partial<ExpenseInput>): Promise<ExpenseRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as ExpenseRecord
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

export async function fetchExpense(id: string): Promise<ExpenseRecord | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }
  return data as ExpenseRecord
}
