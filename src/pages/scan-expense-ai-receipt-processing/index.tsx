import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CameraCapture from './components/CameraCapture';
import ProcessingLoader from './components/ProcessingLoader';
import Image from '@/components/AppImage';
import { fetchCategories, CategoryRecord } from '@/lib/supabase/categories';
import { createClient } from '@/lib/supabase/component';
import axios from 'axios';

type ProcessingStep = 'capture' | 'preview' | 'processing';

const ScanExpenseAIReceiptProcessing: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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
            <button
              onClick={handleAnalyze}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium spring-transition hover:bg-primary-dark"
            >
              Analizar
            </button>
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
