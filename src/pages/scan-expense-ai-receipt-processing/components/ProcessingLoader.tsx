import React, { useEffect, useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';

interface ProcessingLoaderProps {
  progress: number;
  image?: string;
  onError: (error: string) => void;
}

const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ progress, image, onError }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'processing' | 'completing'>('scanning');

  const processingSteps = [
    'Analizando imagen...',
    'Extrayendo texto...',
    'Identificando comercio...',
    'Calculando totales...',
    'Categorizando gasto...',
    'Verificando datos...'
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (progress < 100) {
        const newStep = Math.floor((progress / 100) * processingSteps.length);
        setCurrentStep(Math.min(newStep, processingSteps.length - 1));
      }
    }, 200);

    return () => clearInterval(stepInterval);
  }, [progress, processingSteps.length]);

  useEffect(() => {
    if (progress >= 95) {
      setAnimationPhase('completing');
    } else if (progress >= 50) {
      setAnimationPhase('processing');
    }
  }, [progress]);

  const renderProgressRing = (): React.JSX.Element => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary spring-transition"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {animationPhase === 'completing' ? (
              <Icon name="CheckCircle" size={32} className="text-primary mx-auto animate-pulse" />
            ) : (
              <>
                <Icon 
                  name="Loader2" 
                  size={32} 
                  className="text-primary mx-auto animate-spin" 
                />
                <div className="text-lg font-semibold text-text-primary mt-1">
                  {Math.round(progress)}%
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Receipt Preview */}
      <div className="p-4">
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {image ? (
            <Image 
              src={image} 
              alt="Captured receipt" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="FileImage" size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Scanning overlay animation */}
          {animationPhase === 'scanning' && (
            <div className="absolute inset-0 bg-primary/10">
              <div className="absolute inset-x-0 h-1 bg-primary animate-pulse" 
                   style={{ 
                     top: `${(progress / 100) * 100}%`,
                     transition: 'top 0.3s ease-out'
                   }}>
                <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      <div className="flex flex-col items-center px-6 py-8">
        {renderProgressRing()}
        
        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-2">
          Analizando Boleta
        </h2>
        
        <p className="text-text-secondary text-center mb-8">
          {processingSteps[currentStep]}
        </p>

        {/* Processing Steps */}
        <div className="w-full max-w-sm space-y-3">
          {processingSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg spring-transition ${
                index <= currentStep 
                  ? 'bg-primary-50 text-primary' 
                  : 'bg-gray-50 text-text-secondary'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-primary text-white' 
                  : index === currentStep 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => onError('Processing cancelled by user')}
          className="mt-8 px-6 py-3 text-text-secondary hover:text-text-primary spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProcessingLoader; 