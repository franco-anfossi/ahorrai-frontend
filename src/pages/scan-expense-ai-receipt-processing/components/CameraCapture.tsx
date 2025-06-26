import React, { useRef, useState } from 'react';
import Icon from '@/components/AppIcon';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const handleCameraCapture = (): void => {
    setIsCapturing(true);
    // Simulate camera capture
    setTimeout(() => {
      // Mock captured image
      const mockImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBkZSBSZWNpYm8gQ2FwdHVyYWRhPC90ZXh0Pgo8L3N2Zz4K';
      onCapture(mockImage);
      setIsCapturing(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Camera Viewport */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Icon name="Camera" size={32} className="text-white" />
            </div>
            <p className="text-lg font-medium mb-2">Cámara de Recibos</p>
            <p className="text-sm text-white/80">Apunta la cámara al recibo</p>
          </div>
        </div>

        {/* Camera Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner Guides */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-white rounded-br-lg"></div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleCameraCapture}
            disabled={isCapturing}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 spring-transition focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50"
          >
            {isCapturing ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>

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
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">Consejos para Mejor Resultado</p>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• Asegúrate de que el recibo esté bien iluminado</li>
                <li>• Mantén la cámara estable y paralela al recibo</li>
                <li>• Incluye todo el recibo en el marco</li>
                <li>• Evita sombras y reflejos</li>
              </ul>
            </div>
          </div>
        </div>

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