import React from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';
import { BottomTabNavigationProps } from '@/types';

const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({ 
  currentRoute 
}) => {
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/financial-dashboard',
      icon: 'BarChart3',
      label: 'Dashboard'
    },
    {
      name: 'Escanear',
      path: '/scan-expense-ai-receipt-processing',
      icon: 'ScanLine',
      label: 'Escanear'
    },
    {
      name: 'Agregar',
      path: '/manual-expense-register',
      icon: 'Plus',
      label: 'Agregar'
    },
    {
      name: 'Comparar',
      path: '/price-compare',
      icon: 'Search',
      label: 'Comparar'
    },
    {
      name: 'Config',
      path: '/categories-budget-management',
      icon: 'Settings',
      label: 'Config'
    }
  ];

  const isActive = (path: string): boolean => {
    return currentRoute ? currentRoute === path : router.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-surface border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isActive(item.path)
                ? 'text-primary bg-primary-50'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Icon 
              name={item.icon} 
              size={22} 
              className={isActive(item.path) ? 'text-primary' : ''} 
              strokeWidth={isActive(item.path) ? 2.5 : 2}
            />
            <span className={`text-xs mt-1 ${isActive(item.path) ? 'font-medium text-primary' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabNavigation; 