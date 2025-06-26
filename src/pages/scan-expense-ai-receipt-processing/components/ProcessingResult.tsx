import React, { useState } from 'react'
import { CategoryRecord } from '@/lib/supabase/categories'
import { PaymentMethod } from '@/types'
import EditableExpenseCard from './EditableExpenseCard'

interface Expense {
  amount: number
  category_id: string
  date: string
  description?: string
  merchant?: string
  payment_method?: string
}

interface ProcessingResultData {
  confidence: number
  expenses: Expense[]
}

interface ProcessingResultProps {
  result: ProcessingResultData
  categories: CategoryRecord[]
  image?: string | null
}

const ProcessingResult: React.FC<ProcessingResultProps> = ({ result, categories, image }) => {
  const progress = Math.round(result.confidence * 100)

  const [expenses, setExpenses] = useState<Expense[]>(result.expenses)

  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Tarjeta de Crédito', icon: 'CreditCard', type: 'card' },
    { id: 2, name: 'Tarjeta de Débito', icon: 'CreditCard', type: 'card' },
    { id: 3, name: 'Efectivo', icon: 'DollarSign', type: 'cash' },
    { id: 4, name: 'Transferencia', icon: 'Banknote', type: 'transfer' },
    { id: 5, name: 'PayPal', icon: 'CreditCard', type: 'digital' },
    { id: 6, name: 'Apple Pay', icon: 'Smartphone', type: 'digital' }
  ]

  const handleExpenseChange = (index: number, value: Expense) => {
    setExpenses(prev => prev.map((exp, i) => (i === index ? value : exp)))
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center space-y-2">
        {image && (
          <img src={image} alt="Receipt" className="w-full max-w-xs rounded-lg object-contain mb-2" />
        )}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0-31.831"
              fill="none"
              stroke="currentColor"
              className="text-gray-200"
              strokeWidth="4"
            />
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0-31.831"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="4"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-text-primary">
            {progress}%
          </span>
        </div>
        <p className="text-sm text-text-secondary text-center">Confianza del reconocimiento</p>
      </div>

      <div className="space-y-4">
        {expenses.map((exp, idx) => (
          <EditableExpenseCard
            key={idx}
            expense={exp}
            categories={categories}
            paymentMethods={paymentMethods}
            onChange={value => handleExpenseChange(idx, value)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProcessingResult
