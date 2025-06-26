import React from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';

interface ProcessingLoaderProps {
  image?: string;
}

const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ image }) => {
  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      {image && (
        <Image
          src={image}
          alt="Receipt"
          className="w-full max-w-xs rounded-lg object-contain"
        />
      )}
      <div className="flex items-center space-x-2">
        <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        <span className="font-medium text-text-primary">Analizando Boleta</span>
      </div>
    </div>
  );
};

export default ProcessingLoader;
