import { createClient } from './component'

export interface CategoryInput {
  name: string
  icon: string
  color: string
  description?: string
}

export interface CategoryRecord extends CategoryInput {
  id: string
  user_id: string
  created_at: string
}

export async function fetchCategories(userId: string): Promise<CategoryRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }
  return (data as CategoryRecord[]) || []
}

export async function createCategory(userId: string, category: CategoryInput): Promise<CategoryRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .insert([{ user_id: userId, ...category }])
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as CategoryRecord
}

export async function updateCategory(id: string, updates: Partial<CategoryInput>): Promise<CategoryRecord> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as CategoryRecord
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
