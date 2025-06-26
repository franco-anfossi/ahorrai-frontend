import React, { useState } from 'react'
import { CategoryRecord } from '@/lib/supabase/categories'
import { PaymentMethod } from '@/types'
import CategorySelector from '../../manual-expense-register/components/CategorySelector'
import PaymentMethodSelector from '../../manual-expense-register/components/PaymentMethodSelector'
import { createExpense } from '@/lib/supabase/expenses'
import { createClient } from '@/lib/supabase/component'

interface Expense {
  amount: number
  category_id: string
  date: string
  description?: string
  merchant?: string
  payment_method?: string
}

interface EditableExpenseCardProps {
  expense: Expense
  categories: CategoryRecord[]
  paymentMethods: PaymentMethod[]
  onChange: (value: Expense) => void
}

const EditableExpenseCard: React.FC<EditableExpenseCardProps> = ({ expense, categories, paymentMethods, onChange }) => {
  const [local, setLocal] = useState<Expense>(expense)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreated, setIsCreated] = useState(false)

  const handleChange = <K extends keyof Expense>(field: K, value: Expense[K]) => {
    const updated = { ...local, [field]: value }
    setLocal(updated)
    onChange(updated)
  }

  const selectedCategory = categories.find(c => c.id === local.category_id) || null
  const selectedMethod = paymentMethods.find(m => m.name === local.payment_method) || null

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      await createExpense(user.id, {
        amount: local.amount,
        category_id: local.category_id,
        date: local.date,
        description: local.description,
        merchant: local.merchant,
        payment_method: local.payment_method
      })

      setIsCreated(true)
    } catch (err) {
      console.error('Error creating expense:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-surface rounded-lg p-6 space-y-4 border border-border shadow-md">
      <div className="flex items-center justify-between space-x-2">
        <input
          type="text"
          value={local.merchant || ''}
          onChange={e => handleChange('merchant', e.target.value)}
          placeholder="Comercio"
          disabled={isCreated}
          className="flex-1 text-sm font-medium rounded-lg focus:outline-none border-border disabled:opacity-50"
        />
        <input
          type="number"
          value={local.amount}
          onChange={e => handleChange('amount', parseFloat(e.target.value) || 0)}
          disabled={isCreated}
          className="w-24 text-right text-sm border border-border rounded-lg px-2 py-1 bg-surface focus:outline-none disabled:opacity-50"
        />
      </div>

      <div className={isCreated ? 'pointer-events-none opacity-50' : ''}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={cat => handleChange('category_id', String(cat.id))}
        />
      </div>

      <div className={isCreated ? 'pointer-events-none opacity-50' : ''}>
        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          onSelect={method => handleChange('payment_method', method.name)}
        />
      </div>

      <textarea
        value={local.description || ''}
        onChange={e => handleChange('description', e.target.value)}
        rows={2}
        placeholder="Descripción"
        disabled={isCreated}
        className="w-full text-sm border border-border rounded-lg p-3 bg-surface focus:outline-none disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleCreate}
        disabled={isCreated || isSaving}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 spring-transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Creando...' : isCreated ? 'Creado' : 'Crear'}
      </button>
    </div>
  )
}

export default EditableExpenseCard
