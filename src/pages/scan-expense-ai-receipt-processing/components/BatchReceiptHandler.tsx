import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';

interface Confidence {
  amount: number;
  merchant: number;
  date: number;
  category: number;
}

interface BatchReceipt {
  id: number;
  amount: string;
  merchant: string;
  date: string;
  category: string;
  confidence: Confidence;
}

interface CurrentReceipt {
  amount: string;
  merchant: string;
  date: string;
  category: string;
  description: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface BatchReceiptHandlerProps {
  receipts: BatchReceipt[];
  currentIndex: number;
  onSave: (receipt: BatchReceipt) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onAddReceipt: (receipt: BatchReceipt) => void;
}

const BatchReceiptHandler: React.FC<BatchReceiptHandlerProps> = ({ 
  receipts, 
  currentIndex, 
  onSave, 
  onNext, 
  onPrevious, 
  onComplete, 
  onAddReceipt
}) => {
  const [currentReceipt, setCurrentReceipt] = useState<CurrentReceipt>({
    amount: "23.45",
    merchant: "Target Store",
    date: "2024-01-16",
    category: "Shopping",
    description: "",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const mockBatchReceipts: BatchReceipt[] = [
    {
      id: 1,
      amount: "23.45",
      merchant: "Target Store",
      date: "2024-01-16",
      category: "Shopping",
      confidence: { amount: 0.92, merchant: 0.88, date: 0.95, category: 0.80 }
    },
    {
      id: 2,
      amount: "67.89",
      merchant: "Whole Foods",
      date: "2024-01-16",
      category: "Food & Dining",
      confidence: { amount: 0.96, merchant: 0.94, date: 0.91, category: 0.87 }
    },
    {
      id: 3,
      amount: "15.20",
      merchant: "Shell Gas Station",
      date: "2024-01-15",
      category: "Transportation",
      confidence: { amount: 0.89, merchant: 0.85, date: 0.93, category: 0.82 }
    }
  ];

  const totalReceipts = mockBatchReceipts.length;
  const currentReceiptData = mockBatchReceipts[currentIndex] || mockBatchReceipts[0];

  const handleInputChange = (field: keyof CurrentReceipt, value: string): void => {
    setCurrentReceipt(prev => ({ ...prev, [field]: value }));
  };

  const handleProcessReceipt = async (receipt: CurrentReceipt): Promise<void> => {
    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onAddReceipt({
        id: currentIndex + 1,
        amount: receipt.amount,
        merchant: receipt.merchant,
        date: receipt.date,
        category: receipt.category,
        confidence: { amount: 0.9, merchant: 0.9, date: 0.9, category: 0.9 }
      });
      onNext();
      // Load next receipt data
      const nextReceipt = mockBatchReceipts[currentIndex + 1];
      if (nextReceipt) {
        setCurrentReceipt({
          ...nextReceipt,
          description: "",
          image: currentReceipt.image
        });
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = (): void => {
    onComplete();
  };

  const categories: Category[] = [
    { id: 'food', name: 'Food & Dining', icon: 'Utensils' },
    { id: 'transport', name: 'Transportation', icon: 'Car' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film' },
    { id: 'health', name: 'Healthcare', icon: 'Heart' },
    { id: 'utilities', name: 'Utilities', icon: 'Zap' },
    { id: 'other', name: 'Other', icon: 'MoreHorizontal' }
  ];

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Progress Header */}
      <div className="bg-surface border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Procesamiento en Lote
          </h2>
          <span className="text-sm text-text-secondary">
            {currentIndex + 1} of {totalReceipts}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full spring-transition"
            style={{ width: `${((currentIndex + 1) / totalReceipts) * 100}%` }}
          />
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalReceipts }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full spring-transition ${
                index === currentIndex 
                  ? 'bg-primary' 
                  : index < currentIndex 
                    ? 'bg-success' :'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="p-4">
        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <Image 
            src={currentReceipt.image} 
            alt={`Receipt ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Receipt {currentIndex + 1}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-text-secondary">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={currentReceiptData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 spring-transition"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs text-success font-medium">
                    {Math.round(currentReceiptData.confidence.amount * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Merchant
            </label>
            <input
              type="text"
              value={currentReceiptData.merchant}
              onChange={(e) => handleInputChange('merchant', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 spring-transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date
            </label>
            <input
              type="date"
              value={currentReceiptData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 spring-transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleInputChange('category', category.name)}
                  className={`p-2 rounded-lg border spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    currentReceiptData.category === category.name
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300'
                  }`}
                >
                  <Icon name={category.icon} size={16} className="mx-auto mb-1" />
                  <span className="text-xs font-medium block">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-16 bg-surface border-t border-border p-4">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                onPrevious();
                // Load previous receipt data
                const prevReceipt = mockBatchReceipts[currentIndex - 1];
                setCurrentReceipt({
                  ...prevReceipt,
                  description: "",
                  image: currentReceipt.image
                });
              }
            }}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :'bg-surface border border-border text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Icon name="ChevronLeft" size={16} className="inline mr-1" />
            Previous
          </button>

          {isProcessing ? (
            <button
              disabled
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Procesando...
            </button>
          ) : (
            <button
              onClick={() => handleProcessReceipt(currentReceipt)}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Procesar Recibo
            </button>
          )}
        </div>

        {/* Skip Option */}
        <button
          onClick={handleComplete}
          className="w-full mt-2 py-2 text-text-secondary hover:text-text-primary spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default BatchReceiptHandler; 