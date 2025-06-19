import React from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';
import { HeaderBarProps } from '@/types';

const HeaderBar: React.FC<HeaderBarProps> = ({ 
  title, 
  showBack = false, 
  onBack, 
  actions = [] 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Volver"
          >
            <Icon name="ArrowLeft" size={20} className="text-text-primary" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={action.label}
            >
              <Icon name={action.icon} size={20} className="text-text-primary" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default HeaderBar; 