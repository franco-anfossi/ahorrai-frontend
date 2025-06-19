import React from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleGoHome = (): void => {
    router.push('/financial-dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-primary-50 rounded-full flex items-center justify-center">
          <Icon name="AlertTriangle" size={48} className="text-primary" />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Página No Encontrada</h2>
        <p className="text-text-secondary mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        {/* Action Button */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Icon name="Home" size={20} />
          <span>Ir al Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound; 