import React, { useEffect, useState } from 'react';
import Icon from '@/components/AppIcon';
import { CategoryInput, CategoryRecord } from '@/lib/supabase/categories';

interface CategoryEditModalProps {
  isOpen: boolean;
  initialData?: CategoryRecord;
  onClose: () => void;
  onSave: (data: CategoryInput) => void;
}

const availableIcons: string[] = [
  'UtensilsCrossed',
  'Car',
  'Film',
  'ShoppingBag',
  'Heart',
  'Zap',
  'Home',
  'Gamepad2',
  'GraduationCap',
  'Plane',
  'Coffee',
  'Shirt',
  'Dumbbell',
  'Book',
  'Music',
  'Camera',
  'Gift',
  'Briefcase',
];

const availableColors: string[] = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F59E0B',
];

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Package');
  const [color, setColor] = useState('#3B82F6');

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
      setColor(initialData.color);
    } else {
      setName('');
      setIcon('Package');
      setColor('#3B82F6');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = (): void => {
    onSave({ name, icon, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-text-primary">Editar Categoría</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover spring-transition">
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Icono</label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center spring-transition ${
                    icon === i ? 'bg-primary-500 text-white' : 'bg-surface-hover text-text-secondary hover:bg-primary-50 hover:text-primary'
                  }`}
                >
                  <Icon name={i} size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {availableColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 spring-transition ${
                    color === c ? 'border-text-primary scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-background rounded-lg p-3">
            <p className="text-sm font-medium text-text-primary mb-2">Vista previa</p>
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon name={icon} size={20} style={{ color }} />
              </div>
              <p className="font-medium text-text-primary">
                {name || 'Nombre de la Categoría'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-hover text-text-primary rounded-lg hover:bg-surface spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditModal;

