import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import { CategoryRecord } from '@/lib/supabase/categories';
import { BudgetInput } from '@/lib/supabase/budgets';

interface BudgetCreationModalProps {
  isOpen: boolean
  categories: CategoryRecord[]
  onClose: () => void
  onSave: (budget: BudgetInput) => void
}

const BudgetCreationModal: React.FC<BudgetCreationModalProps> = ({ isOpen, categories, onClose, onSave }) => {
  const [category, setCategory] = useState<CategoryRecord | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [period, setPeriod] = useState<string>('monthly')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setCategory(categories[0] || null)
      setAmount(0)
      const today = new Date().toISOString().split('T')[0]
      setStartDate(today)
      setEndDate(today)
    }
  }, [isOpen, categories])

  if (!isOpen) return null

  const handleSave = () => {
    if (!category) return
    onSave({
      category_id: category.id,
      amount,
      period,
      start_date: startDate,
      end_date: endDate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-text-primary">Nuevo Presupuesto</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover spring-transition">
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Categoría</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={category?.id || ''}
              onChange={(e) => setCategory(categories.find(c => c.id === e.target.value) || null)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Monto</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Periodo</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de Inicio</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de Fin</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-surface-hover spring-transition">Cancelar</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default BudgetCreationModal
