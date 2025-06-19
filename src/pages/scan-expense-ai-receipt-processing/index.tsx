import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CameraCapture from './components/CameraCapture';
import ProcessingLoader from './components/ProcessingLoader';
import ExtractedDataForm from './components/ExtractedDataForm';
import BatchReceiptHandler from './components/BatchReceiptHandler';

interface ExtractedData {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  tax: number;
  total: number;
  confidence: number;
}

interface BatchReceipt {
  id: number;
  amount: string;
  merchant: string;
  date: string;
  category: string;
  confidence: {
    amount: number;
    merchant: number;
    date: number;
    category: number;
  };
}

type ProcessingStep = 'capture' | 'processing' | 'review' | 'batch';

interface ScanExpenseAIReceiptProcessingProps {}

const ScanExpenseAIReceiptProcessing: React.FC<ScanExpenseAIReceiptProcessingProps> = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchReceipts, setBatchReceipts] = useState<BatchReceipt[]>([]);

  const handleCapture = async (imageData: string): Promise<void> => {
    setCapturedImage(imageData);
    setCurrentStep('processing');
    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock extracted data
      const mockData: ExtractedData = {
        merchant: "Starbucks Coffee",
        amount: 12.45,
        date: new Date().toISOString().split('T')[0],
        category: "Comida y Restaurantes",
        items: [
          { name: "Café Americano", price: 4.50, quantity: 1 },
          { name: "Pastel de Chocolate", price: 7.95, quantity: 1 }
        ],
        tax: 0.95,
        total: 12.45,
        confidence: 0.92
      };

      setExtractedData(mockData);
      setCurrentStep('review');
    } catch (error) {
      console.error('Error processing receipt:', error);
      setCurrentStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveExpense = async (formData: any): Promise<void> => {
    try {
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving expense:', formData);
      
      // Navigate to dashboard
      router.push('/financial-dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleBatchMode = (): void => {
    setBatchMode(true);
    setCurrentStep('batch');
  };

  const handleBatchComplete = (): void => {
    setBatchMode(false);
    setBatchReceipts([]);
    setCurrentStep('capture');
  };

  const headerActions = [
    {
      icon: 'Settings',
      label: 'Configuración',
      onClick: () => router.push('/categories-budget-management')
    },
    {
      icon: 'Layers',
      label: 'Modo Lote',
      onClick: handleBatchMode
    }
  ];

  const renderCurrentStep = (): React.ReactNode | null => {
    switch (currentStep) {
      case 'capture':
        return (
          <CameraCapture
            onCapture={handleCapture}
            onBatchMode={handleBatchMode}
          />
        );
      
      case 'processing':
        return (
          <ProcessingLoader
            progress={isProcessing ? 75 : 0}
            image={capturedImage || ''}
            onError={(error) => {
              console.error('Processing error:', error);
              setCurrentStep('capture');
            }}
          />
        );
      
      case 'review':
        return (
          <ExtractedDataForm
            data={extractedData || {
              merchant: '',
              amount: 0,
              date: '',
              category: '',
              items: [],
              tax: 0,
              total: 0,
              confidence: 0
            }}
            image={capturedImage || ''}
            onSave={handleSaveExpense}
            onRetry={() => setCurrentStep('capture')}
          />
        );
      
      case 'batch':
        return (
          <BatchReceiptHandler
            receipts={batchReceipts}
            currentIndex={0}
            onSave={(receipt) => console.log('Saving receipt:', receipt)}
            onNext={() => console.log('Next receipt')}
            onPrevious={() => console.log('Previous receipt')}
            onComplete={handleBatchComplete}
            onAddReceipt={(receipt: BatchReceipt) => setBatchReceipts(prev => [...prev, receipt])}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar 
        title="Escanear Recibo"
        showBack={true}
        actions={headerActions}
      />

      {/* Progress Indicator */}
      {currentStep !== 'batch' && (
        <div className="px-4 py-3 bg-surface border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'capture' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <span className={`text-xs ${currentStep === 'capture' ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                Capturar
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'processing' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <span className={`text-xs ${currentStep === 'processing' ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                Procesando
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'review' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <span className={`text-xs ${currentStep === 'review' ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                Revisar
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {renderCurrentStep()}
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default ScanExpenseAIReceiptProcessing; 