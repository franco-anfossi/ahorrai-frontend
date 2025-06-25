import React, { useState } from 'react'
import Icon from '@/components/AppIcon'
import { BudgetRecord } from '@/lib/supabase/budgets'
import { CategoryRecord } from '@/lib/supabase/categories'

interface BudgetCardProps {
  budget: BudgetRecord
  category?: CategoryRecord
  onEdit: () => void
  onDelete?: () => void
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, category, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative p-3 bg-surface rounded-lg border border-border flex items-center space-x-3">
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
      <div className="relative ml-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Icon name="Settings" size={18} className="text-text-secondary" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-lg z-50">
            <button
              onClick={() => { setMenuOpen(false); onEdit(); }}
              className="w-full text-left px-4 py-2 hover:bg-surface-hover spring-transition"
            >
              Editar
            </button>
            {onDelete && (
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                className="w-full text-left px-4 py-2 text-error hover:bg-error-50 spring-transition"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
        {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
      </div>
    </div>
  )
}

export default BudgetCard
