import React from 'react';
import Icon from '@/components/AppIcon';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

interface QuickDate {
  label: string;
  value: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeDate = (dateString: string): string => {
    const today = new Date();
    const date = new Date(dateString);
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays === -1) return 'Mañana';
    if (diffDays > 0 && diffDays <= 7) return `Hace ${diffDays} días`;
    if (diffDays < 0 && diffDays >= -7) return `En ${Math.abs(diffDays)} días`;
    
    return formatDate(dateString);
  };

  const quickDates: QuickDate[] = [
    { label: 'Hoy', value: new Date().toISOString().split('T')[0] },
    { label: 'Ayer', value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { label: 'Hace 3 días', value: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { label: 'Hace 1 semana', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        Fecha
      </label>
      
      <div className="space-y-3">
        {/* Date Input */}
        <div className="relative">
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
          />
          <Icon 
            name="Calendar" 
            size={20} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
          />
        </div>

        {/* Selected Date Display */}
        {value && (
          <div className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg">
            <Icon name="Calendar" size={16} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">{getRelativeDate(value)}</p>
              <p className="text-xs text-text-secondary">{formatDate(value)}</p>
            </div>
          </div>
        )}

        {/* Quick Date Buttons */}
        <div>
          <p className="text-xs text-text-secondary mb-2">Fechas Rápidas</p>
          <div className="grid grid-cols-2 gap-2">
            {quickDates.map((dateOption) => (
              <button
                key={dateOption.value}
                type="button"
                onClick={() => onChange(dateOption.value)}
                className={`px-3 py-2 text-sm font-medium rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  value === dateOption.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface text-text-primary hover:bg-surface-hover border border-border'
                }`}
              >
                {dateOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker; 