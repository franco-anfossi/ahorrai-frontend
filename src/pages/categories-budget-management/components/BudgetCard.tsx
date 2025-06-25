import React from 'react'
import Icon from '@/components/AppIcon'
import { BudgetRecord } from '@/lib/supabase/budgets'
import { CategoryRecord } from '@/lib/supabase/categories'

interface BudgetCardProps {
  budget: BudgetRecord
  category?: CategoryRecord
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, category }) => {
  return (
    <div className="p-3 bg-surface rounded-lg border border-border flex items-center space-x-3">
      {category && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Icon name={category.icon} size={20} style={{ color: category.color }} />
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-medium text-text-primary">{category?.name || 'Categoría'}</h4>
        <p className="text-xs text-text-secondary capitalize">{budget.period}</p>
      </div>
      <div className="text-right">
        <div className="font-semibold text-text-primary">{formatCurrency(budget.amount)}</div>
        <div className="text-xs text-text-secondary">
          {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
        </div>
      </div>
    </div>
  )
}

export default BudgetCard
