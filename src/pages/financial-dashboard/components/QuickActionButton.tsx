import React, { useState } from 'react';
import Icon from 'components/AppIcon';

interface Action {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface QuickActionButtonProps {
  onAction: (actionId: string) => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const actions: Action[] = [
    {
      id: 'scan',
      label: 'Escanear Recibo',
      icon: 'ScanLine',
      color: 'bg-primary-600',
      description: 'Procesar automáticamente'
    },
    {
      id: 'manual',
      label: 'Registro Manual',
      icon: 'Plus',
      color: 'bg-success',
      description: 'Agregar gasto manualmente'
    },
  ];

  const handleAction = (actionId: string): void => {
    setIsOpen(false);
    onAction(actionId);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center space-x-3 bg-surface rounded-lg shadow-lg border border-border p-3 min-w-[200px] spring-transition transform hover:scale-105"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <Icon name={action.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{action.label}</p>
                <p className="text-xs text-text-secondary">{action.description}</p>
              </div>
              <button
                onClick={() => handleAction(action.id)}
                className="p-1 rounded hover:bg-surface-hover spring-transition"
              >
                <Icon name="ArrowRight" size={16} className="text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white 
          shadow-lg spring-transition flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          transform hover:scale-105 active:scale-95
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label="Abrir acciones rápidas"
        aria-expanded={isOpen}
      >
        <Icon name="Plus" size={24} />
      </button>
    </div>
  );
};

export default QuickActionButton; 