import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CameraCapture from './components/CameraCapture';
import ProcessingLoader from './components/ProcessingLoader';
import Image from '@/components/AppImage';
import Icon from '@/components/AppIcon';
import ReceiptTips from './components/ReceiptTips';
import { fetchCategories, CategoryRecord } from '@/lib/supabase/categories';
import { createClient } from '@/lib/supabase/component';
import axios from 'axios';

type ProcessingStep = 'capture' | 'preview' | 'processing';

const ScanExpenseAIReceiptProcessing: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const cats = await fetchCategories(user.id);
          setCategories(cats);
        } catch (err) {
          console.error(err);
        }
      }
    };
    load();
  }, []);

  const handleCapture = (imageData: string): void => {
    setCapturedImage(imageData);
    setCurrentStep('preview');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setCurrentStep('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!capturedImage) return;
    setCurrentStep('processing');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/process-receipt`,
        {
          image: capturedImage,
          categories,
        }
      );
    } catch (err) {
      console.error('Error sending receipt:', err);
    } finally {
      setCapturedImage(null);
      setCurrentStep('capture');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar
        title="Escanear Recibo"
        showBack={true}
        onBack={() => router.back()}
      />
      <div className="flex-1 pb-20">
        {currentStep === 'capture' && (
          <CameraCapture onCapture={handleCapture} />
        )}

        {currentStep === 'preview' && capturedImage && (
          <div className="p-4 flex flex-col items-center space-y-4">
            <Image
              src={capturedImage}
              alt="Preview"
              className="w-full max-w-xs rounded-lg object-contain"
            />
            <div className="flex w-full space-x-3">
              <button
                onClick={handleGallerySelect}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Icon name="Image" size={20} className="text-text-secondary" />
                <span className="font-medium text-text-primary">Galería</span>
              </button>
              <button
                onClick={handleAnalyze}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium spring-transition hover:bg-primary-700"
              >
                Analizar
              </button>
            </div>
            <ReceiptTips />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {currentStep === 'processing' && (
          <ProcessingLoader image={capturedImage || ''} />
        )}
      </div>
      <BottomTabNavigation />
    </div>
  );
};

export default ScanExpenseAIReceiptProcessing;
