import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import CameraCapture from './components/CameraCapture';
import ProcessingLoader from './components/ProcessingLoader';
import { fetchCategories, CategoryRecord } from '@/lib/supabase/categories';
import { createClient } from '@/lib/supabase/component';
import axios from 'axios';

type ProcessingStep = 'capture' | 'processing';

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

  const handleCapture = async (imageData: string): Promise<void> => {
    setCapturedImage(imageData);
    setCurrentStep('processing');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/process-receipt`, {
        image: imageData,
        categories,
      });
    } catch (err) {
      console.error('Error sending receipt:', err);
    } finally {
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
        {currentStep === 'processing' && (
          <ProcessingLoader
            progress={50}
            image={capturedImage || ''}
            onError={() => setCurrentStep('capture')}
          />
        )}
      </div>
      <BottomTabNavigation />
    </div>
  );
};

export default ScanExpenseAIReceiptProcessing;
