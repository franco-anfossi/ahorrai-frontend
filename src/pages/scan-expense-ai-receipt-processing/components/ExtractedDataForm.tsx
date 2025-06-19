import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';

interface ExtractedItem {
  name: string;
  quantity: number;
  price: number;
}

interface ExtractedData {
  merchant?: string;
  amount?: number;
  date?: string;
  category?: string;
  confidence: number;
  items?: ExtractedItem[];
  total?: number;
}

interface FormData {
  merchant: string;
  amount: string;
  date: string;
  category: string;
  notes: string;
}

interface ExtractedDataFormProps {
  data: ExtractedData;
  image: string;
  onSave: (data: FormData & { image: string; confidence: number; items?: ExtractedItem[] }) => Promise<void>;
  onRetry: () => void;
}

const ExtractedDataForm: React.FC<ExtractedDataFormProps> = ({ data, image, onSave, onRetry }) => {
  const [formData, setFormData] = useState<FormData>({
    merchant: data.merchant || '',
    amount: data.amount?.toString() || '',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        image: image,
        confidence: data.confidence,
        items: data.items
      });
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const confidenceColor = data.confidence > 0.8 ? 'text-success' : data.confidence > 0.6 ? 'text-warning' : 'text-error';

  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Datos Extraídos
        </h2>
        <p className="text-text-secondary">
          Revisa y ajusta la información extraída
        </p>
      </div>

      {/* Receipt Image */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Image" size={20} className="text-text-secondary" />
          <span className="font-medium text-text-primary">Imagen del Recibo</span>
        </div>
        <img 
          src={image} 
          alt="Receipt" 
          className="w-full h-32 object-cover rounded-lg border border-border"
        />
      </div>

      {/* Confidence Score */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Confianza de Extracción</span>
          <span className={`text-sm font-semibold ${confidenceColor}`}>
            {Math.round(data.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              data.confidence > 0.8 ? 'bg-success' : data.confidence > 0.6 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${data.confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Merchant */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Comercio
          </label>
          <input
            type="text"
            value={formData.merchant}
            onChange={(e) => handleInputChange('merchant', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
            placeholder="Nombre del comercio"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Monto Total
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
            placeholder="0.00"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Categoría
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
            placeholder="Categoría del gasto"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Notas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary spring-transition"
            placeholder="Notas adicionales..."
          />
        </div>
      </div>

      {/* Items Breakdown */}
      {data.items && data.items.length > 0 && (
        <div className="bg-surface rounded-lg p-4">
          <h3 className="font-medium text-text-primary mb-3">Desglose de Artículos</h3>
          <div className="space-y-2">
            {data.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-secondary">Cantidad: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-medium text-text-primary">Total</span>
              <span className="font-semibold text-text-primary">{formatCurrency(data.total || 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onRetry}
          className="flex-1 px-4 py-3 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Volver a Escanear
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </div>
          ) : (
            'Guardar Gasto'
          )}
        </button>
      </div>
    </div>
  );
};

export default ExtractedDataForm; 