import React from 'react'
import Icon from '@/components/AppIcon'
import { CategoryRecord } from '@/lib/supabase/categories'

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
  onDone: () => void
}

const ProcessingResult: React.FC<ProcessingResultProps> = ({ result, categories, image, onDone }) => {
  const getCategory = (id: string) => categories.find(c => c.id === id)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount)
  }
  const progress = Math.round(result.confidence * 100)

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

      <div className="space-y-3">
        {result.expenses.map((exp, idx) => {
          const cat = getCategory(exp.category_id)
          return (
            <div key={idx} className="bg-surface rounded-lg p-4 flex space-x-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={cat?.icon || 'Receipt'} size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {exp.merchant || 'Gasto'}
                  </h4>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(exp.amount)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-text-secondary">
                  <span>{cat?.name || 'Sin categoría'}</span>
                  <span>•</span>
                  <span>{new Date(exp.date).toLocaleDateString('es-CL')}</span>
                </div>
                {exp.description && (
                  <p className="text-xs text-text-muted mt-1 truncate">{exp.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={onDone}
        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 spring-transition"
      >
        Aceptar
      </button>
    </div>
  )
}

export default ProcessingResult
