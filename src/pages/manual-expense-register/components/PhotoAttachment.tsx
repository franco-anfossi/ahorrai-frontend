import React, { useRef } from 'react';
import Icon from '@/components/AppIcon';

interface PhotoData {
  file: File;
  preview: string;
}

interface PhotoAttachmentProps {
  photo: PhotoData | null;
  onPhotoChange: (photo: PhotoData | null) => void;
}

const PhotoAttachment: React.FC<PhotoAttachmentProps> = ({ photo, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoChange({
          file: file,
          preview: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (): void => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTakePhoto = (): void => {
    // This would integrate with camera API in a real app
    console.log('Take photo functionality');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        Foto del Recibo
      </label>
      
      <div className="space-y-3">
        {/* Photo Preview */}
        {photo && (
          <div className="relative">
            <img
              src={photo.preview}
              alt="Receipt"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-700 spring-transition"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}

        {/* Photo Actions */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="Upload" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Subir Foto</span>
          </button>
          
          <button
            type="button"
            onClick={handleTakePhoto}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="Camera" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Tomar Foto</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Help Text */}
        <div className="flex items-start space-x-2 p-3 bg-primary-50 rounded-lg">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Consejo</p>
            <p className="text-xs text-text-secondary">
              Agregar una foto del recibo te ayudará a mantener un registro visual y facilitar futuras consultas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAttachment; 