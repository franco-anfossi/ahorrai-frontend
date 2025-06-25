import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CategoryRecord } from '@/lib/supabase/categories';

interface CategoryCardProps {
  category: CategoryRecord;
  progress?: number;
  amount?: number;
  transactions?: number | null;
  average?: number | null;
  vsLastMonth?: number | null;
  budget?: number | null;
  onEdit: () => void;
  onDelete?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  progress = 0,
  amount,
  transactions,
  average,
  vsLastMonth,
  budget,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (val: number): string =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(val);

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-hover spring-transition card-shadow">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Icon name={category.icon} size={20} style={{ color: category.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-text-primary truncate">{category.name}</h4>
              {amount != null && (
                <span className="text-sm font-semibold text-text-primary ml-2">
                  {formatCurrency(amount)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              <span className="text-xs text-text-secondary font-medium min-w-[40px] text-right">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none"
          >
            <Icon
              name={expanded ? 'ChevronUp' : 'ChevronDown'}
              size={18}
              className="text-text-secondary"
            />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Icon name="Settings" size={18} className="text-text-secondary" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-hover spring-transition"
                >
                  Editar
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full text-left px-4 py-2 text-error hover:bg-error-50 spring-transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
      {expanded && (
        <div className="mt-2 ml-13 p-3 bg-surface-hover rounded-lg animate-fade-in">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Transacciones:</span>
              <span className="text-text-primary font-medium ml-2">
                {transactions ?? 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Promedio:</span>
              <span className="text-text-primary font-medium ml-2">
                {average != null ? formatCurrency(average) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">vs Mes Anterior:</span>
              {vsLastMonth != null ? (
                <span className={`font-medium ml-2 ${vsLastMonth < 0 ? 'text-success' : 'text-error'}`}>
                  {vsLastMonth > 0 ? '+' : ''}
                  {vsLastMonth.toFixed(1)}%
                </span>
              ) : (
                <span className="font-medium ml-2 text-text-primary">N/A</span>
              )}
            </div>
            <div>
              <span className="text-text-secondary">Presupuesto:</span>
              <span className="text-text-primary font-medium ml-2">
                {budget != null ? formatCurrency(budget) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
