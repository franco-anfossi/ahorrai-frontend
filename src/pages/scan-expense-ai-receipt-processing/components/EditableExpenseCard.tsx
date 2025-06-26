import React, { useState } from 'react'
import { CategoryRecord } from '@/lib/supabase/categories'
import { PaymentMethod } from '@/types'
import CategorySelector from '../../manual-expense-register/components/CategorySelector'
import PaymentMethodSelector from '../../manual-expense-register/components/PaymentMethodSelector'

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

  const handleChange = <K extends keyof Expense>(field: K, value: Expense[K]) => {
    const updated = { ...local, [field]: value }
    setLocal(updated)
    onChange(updated)
  }

  const selectedCategory = categories.find(c => c.id === local.category_id) || null
  const selectedMethod = paymentMethods.find(m => m.name === local.payment_method) || null

  return (
    <div className="bg-surface rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <input
          type="text"
          value={local.merchant || ''}
          onChange={e => handleChange('merchant', e.target.value)}
          placeholder="Comercio"
          className="flex-1 text-sm font-medium bg-transparent focus:outline-none"
        />
        <input
          type="number"
          value={local.amount}
          onChange={e => handleChange('amount', parseFloat(e.target.value) || 0)}
          className="w-24 text-right text-sm border border-border rounded-lg px-2 py-1 bg-surface focus:outline-none"
        />
      </div>

      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={cat => handleChange('category_id', String(cat.id))}
      />

      <PaymentMethodSelector
        paymentMethods={paymentMethods}
        selectedMethod={selectedMethod}
        onSelect={method => handleChange('payment_method', method.name)}
      />

      <textarea
        value={local.description || ''}
        onChange={e => handleChange('description', e.target.value)}
        rows={2}
        placeholder="Descripción"
        className="w-full text-sm border border-border rounded-lg p-3 bg-surface focus:outline-none"
      />
    </div>
  )
}

export default EditableExpenseCard
