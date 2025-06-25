import { createClient } from './component'

export interface BudgetInput {
  category_id: string
  amount: number
  period: string
  start_date: string
  end_date: string
}

export interface BudgetRecord extends BudgetInput {
  id: string
  user_id: string
  created_at: string
}

export async function fetchBudgets(userId: string): Promise<BudgetRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }
  return (data as BudgetRecord[]) || []
}

export async function createBudget(userId: string, budget: BudgetInput): Promise<BudgetRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('budgets')
    .insert([{ user_id: userId, ...budget }])
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as BudgetRecord
}

export async function updateBudget(id: string, updates: Partial<BudgetInput>): Promise<BudgetRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as BudgetRecord
}

export async function deleteBudget(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
