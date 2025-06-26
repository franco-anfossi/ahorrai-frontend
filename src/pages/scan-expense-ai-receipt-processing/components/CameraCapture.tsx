import React, { useRef } from 'react';
import Icon from '@/components/AppIcon';
import ReceiptTips from './ReceiptTips';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Camera Controls */}
      <div className="bg-surface p-4 space-y-4">
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleGallerySelect}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="Image" size={20} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Galería</span>
          </button>
        </div>

        {/* Tips */}
        <ReceiptTips />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CameraCapture; 