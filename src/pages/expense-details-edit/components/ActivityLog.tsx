import React from 'react';
import Icon from 'components/AppIcon';
import { ActivityLog as ActivityLogType } from '../../../types';

interface ActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
  activityLog?: ActivityLogType[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ isOpen, onClose, activityLog = [] }) => {
  if (!isOpen) return null;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return 'Plus';
      case 'edited':
        return 'Edit3';
      case 'category_changed':
        return 'Tag';
      case 'deleted':
        return 'Trash2';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-accent';
      case 'edited':
        return 'text-primary';
      case 'category_changed':
        return 'text-secondary';
      case 'deleted':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Historial de Actividad</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover spring-transition"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] space-y-4">
          {activityLog.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.action)}`}>
                <Icon 
                  name={getActivityIcon(activity.action)} 
                  size={14} 
                  className={getActivityColor(activity.action)}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-primary font-medium">
                    {activity.details}
                  </p>
                  <span className="text-xs text-text-secondary flex-shrink-0 ml-2">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {activityLog.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Activity" size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-text-secondary">No hay actividad registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog; 