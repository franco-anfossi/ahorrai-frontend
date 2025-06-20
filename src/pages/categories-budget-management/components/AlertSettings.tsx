import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { Category } from '../../../types';

interface AlertSettingsProps {
  categories: Category[];
}

interface CategoryAlert {
  enabled: boolean;
  threshold: number;
  notifications: string[];
}

interface AlertSettingsState {
  globalAlerts: boolean;
  budgetThreshold: number;
  dailyDigest: boolean;
  weeklyReport: boolean;
  categoryAlerts: Record<number, CategoryAlert>;
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ categories }) => {
  const [alertSettings, setAlertSettings] = useState<AlertSettingsState>({
    globalAlerts: true,
    budgetThreshold: 80,
    dailyDigest: true,
    weeklyReport: true,
    categoryAlerts: categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: {
        enabled: true,
        threshold: 80,
        notifications: ['push', 'email']
      }
    }), {})
  });

  const handleGlobalToggle = (setting: keyof AlertSettingsState): void => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleCategoryToggle = (categoryId: number, setting: keyof CategoryAlert): void => {
    setAlertSettings(prev => ({
      ...prev,
      categoryAlerts: {
        ...prev.categoryAlerts,
        [categoryId]: {
          ...prev.categoryAlerts[categoryId],
          [setting]: !prev.categoryAlerts[categoryId][setting]
        }
      }
    }));
  };

  const handleThresholdChange = (categoryId: number, threshold: number): void => {
    setAlertSettings(prev => ({
      ...prev,
      categoryAlerts: {
        ...prev.categoryAlerts,
        [categoryId]: {
          ...prev.categoryAlerts[categoryId],
          threshold: threshold
        }
      }
    }));
  };

  const handleNotificationToggle = (categoryId: number, notificationType: string): void => {
    setAlertSettings(prev => {
      const currentNotifications = prev.categoryAlerts[categoryId].notifications;
      const updatedNotifications = currentNotifications.includes(notificationType)
        ? currentNotifications.filter(n => n !== notificationType)
        : [...currentNotifications, notificationType];

      return {
        ...prev,
        categoryAlerts: {
          ...prev.categoryAlerts,
          [categoryId]: {
            ...prev.categoryAlerts[categoryId],
            notifications: updatedNotifications
          }
        }
      };
    });
  };

  const thresholdOptions = [50, 60, 70, 80, 90, 95];

  return (
    <div className="p-4 space-y-6">
      {/* Global Alert Settings */}
      <div className="bg-surface rounded-xl p-4 border border-border card-shadow">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Global Alert Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Enable Budget Alerts</p>
              <p className="text-sm text-text-secondary">Receive notifications when approaching budget limits</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('globalAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alertSettings.globalAlerts ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alertSettings.globalAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Default Threshold */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Default Alert Threshold</p>
              <p className="text-sm text-text-secondary">Alert when spending reaches this percentage</p>
            </div>
            <select
              value={alertSettings.budgetThreshold}
              onChange={(e) => setAlertSettings(prev => ({ ...prev, budgetThreshold: parseInt(e.target.value) }))}
              className="text-sm border border-border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!alertSettings.globalAlerts}
            >
              {thresholdOptions.map(threshold => (
                <option key={threshold} value={threshold}>{threshold}%</option>
              ))}
            </select>
          </div>

          {/* Report Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Daily Spending Digest</p>
                <p className="text-sm text-text-secondary">Daily summary of your expenses</p>
              </div>
              <button
                onClick={() => handleGlobalToggle('dailyDigest')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alertSettings.dailyDigest ? 'bg-primary' : 'bg-gray-300'
                }`}
                disabled={!alertSettings.globalAlerts}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alertSettings.dailyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Weekly Budget Report</p>
                <p className="text-sm text-text-secondary">Weekly analysis of spending patterns</p>
              </div>
              <button
                onClick={() => handleGlobalToggle('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alertSettings.weeklyReport ? 'bg-primary' : 'bg-gray-300'
                }`}
                disabled={!alertSettings.globalAlerts}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alertSettings.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category-Specific Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Category Alert Settings</h3>
        
        {categories.map((category) => {
          const categoryAlert = alertSettings.categoryAlerts[category.id];
          
          return (
            <div key={category.id} className="bg-surface rounded-xl p-4 border border-border card-shadow">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon 
                      name={category.icon} 
                      size={16} 
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{category.name}</p>
                    <p className="text-sm text-text-secondary">
                      ${category.spent} of ${category.budget} spent
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCategoryToggle(category.id, 'enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    categoryAlert.enabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  disabled={!alertSettings.globalAlerts}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      categoryAlert.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Category Settings */}
              <div className="space-y-4">
                {/* Threshold Setting */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">Alert Threshold</p>
                    <p className="text-sm text-text-secondary">Alert when spending reaches this percentage</p>
                  </div>
                  <select
                    value={categoryAlert.threshold}
                    onChange={(e) => handleThresholdChange(category.id, parseInt(e.target.value))}
                    className="text-sm border border-border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={!categoryAlert.enabled || !alertSettings.globalAlerts}
                  >
                    {thresholdOptions.map(threshold => (
                      <option key={threshold} value={threshold}>{threshold}%</option>
                    ))}
                  </select>
                </div>

                {/* Notification Types */}
                <div>
                  <p className="font-medium text-text-primary mb-2">Notification Types</p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={categoryAlert.notifications.includes('push')}
                        onChange={() => handleNotificationToggle(category.id, 'push')}
                        disabled={!categoryAlert.enabled || !alertSettings.globalAlerts}
                        className="rounded border-border text-primary focus:ring-primary-500"
                      />
                      <span className="text-sm text-text-secondary">Push Notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={categoryAlert.notifications.includes('email')}
                        onChange={() => handleNotificationToggle(category.id, 'email')}
                        disabled={!categoryAlert.enabled || !alertSettings.globalAlerts}
                        className="rounded border-border text-primary focus:ring-primary-500"
                      />
                      <span className="text-sm text-text-secondary">Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={categoryAlert.notifications.includes('sms')}
                        onChange={() => handleNotificationToggle(category.id, 'sms')}
                        disabled={!categoryAlert.enabled || !alertSettings.globalAlerts}
                        className="rounded border-border text-primary focus:ring-primary-500"
                      />
                      <span className="text-sm text-text-secondary">SMS Notifications</span>
                    </label>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Current Status</span>
                    <span className={`text-sm font-medium ${
                      category.percentage >= categoryAlert.threshold ? 'text-error' : 'text-accent'
                    }`}>
                      {category.percentage}% of budget used
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.percentage >= categoryAlert.threshold ? 'bg-error' : 'bg-accent'
                      }`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AlertSettings; 