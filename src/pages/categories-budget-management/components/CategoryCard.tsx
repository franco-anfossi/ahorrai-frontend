import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CategoryRecord } from '@/lib/supabase/categories';

interface CategoryCardProps {
  category: CategoryRecord;
  progress?: number;
  onEdit: () => void;
  onDelete?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, progress = 0, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-surface rounded-xl p-4 border border-border card-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Icon name={category.icon} size={20} style={{ color: category.color }} />
          </div>
          <h3 className="font-semibold text-text-primary">{category.name}</h3>
        </div>
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
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Gasto</span>
          <span className={`text-xs font-medium ${progress >= 100 ? 'text-error' : 'text-text-primary'}`}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: category.color,
            }}
          />
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </div>
  );
};

export default CategoryCard; 
