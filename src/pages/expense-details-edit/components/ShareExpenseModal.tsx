import React, { useState } from 'react';
import Icon from 'components/AppIcon';

interface Category {
  name: string;
}

interface ShareExpenseModalProps {
  onClose: () => void;
  expense: {
    amount: number;
    currency: string;
    merchant: string;
    category: Category;
    description?: string;
    paymentMethod?: string;
    tags?: string[];
    notes?: string;
    date: string;
  };
}

const ShareExpenseModal: React.FC<ShareExpenseModalProps> = ({ onClose, expense }) => {
  const [shareFormat, setShareFormat] = useState<'summary' | 'detailed' | 'receipt'>('summary');
  const [shareMethod, setShareMethod] = useState<string>('');

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateShareText = (): string => {
    const baseText = `💰 Gasto: ${formatCurrency(expense.amount, expense.currency)}
🏪 Comercio: ${expense.merchant}
📅 Fecha: ${formatDate(expense.date)}
🏷️ Categoría: ${expense.category.name}`;

    if (shareFormat === 'summary') {
      return baseText;
    }

    if (shareFormat === 'detailed') {
      let detailedText = baseText;
      
      if (expense.description) {
        detailedText += `\n📝 Descripción: ${expense.description}`;
      }
      
      if (expense.paymentMethod) {
        detailedText += `\n💳 Pago: ${expense.paymentMethod}`;
      }
      
      if (expense.tags && expense.tags.length > 0) {
        detailedText += `\n🏷️ Etiquetas: ${expense.tags.join(', ')}`;
      }
      
      if (expense.notes) {
        detailedText += `\n📋 Notas: ${expense.notes}`;
      }
      
      return detailedText;
    }

    return baseText;
  };

  const handleShare = (method: string) => {
    const shareText = generateShareText();
    
    switch (method) {
      case 'email':
        const emailSubject = `Gasto: ${expense.merchant} - ${formatCurrency(expense.amount, expense.currency)}`;
        const emailBody = encodeURIComponent(shareText);
        window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`);
        break;
        
      case 'message':
        if (navigator.share) {
          navigator.share({
            title: `Gasto: ${expense.merchant}`,
            text: shareText
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          const smsBody = encodeURIComponent(shareText);
          window.open(`sms:?body=${smsBody}`);
        }
        break;
        
      case 'copy':
        navigator.clipboard.writeText(shareText).then(() => {
          // Show success feedback
          setShareMethod('copied');
          setTimeout(() => setShareMethod(''), 2000);
        });
        break;
        
      default:
        break;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-surface w-full sm:max-w-md sm:rounded-xl h-auto max-h-[90vh] flex flex-col overflow-hidden card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Compartir Gasto
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Share Format Options */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">
              Formato de Compartir
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface-hover spring-transition cursor-pointer">
                <input
                  type="radio"
                  name="shareFormat"
                  value="summary"
                  checked={shareFormat === 'summary'}
                  onChange={(e) => setShareFormat(e.target.value as 'summary' | 'detailed' | 'receipt')}
                  className="w-4 h-4 text-primary focus:ring-primary-500 border-border"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">Resumen</div>
                  <div className="text-sm text-text-secondary">Información básica del gasto</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface-hover spring-transition cursor-pointer">
                <input
                  type="radio"
                  name="shareFormat"
                  value="detailed"
                  checked={shareFormat === 'detailed'}
                  onChange={(e) => setShareFormat(e.target.value as 'summary' | 'detailed' | 'receipt')}
                  className="w-4 h-4 text-primary focus:ring-primary-500 border-border"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">Detallado</div>
                  <div className="text-sm text-text-secondary">Incluir notas, etiquetas e información de pago</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface-hover spring-transition cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="shareFormat"
                  value="receipt"
                  disabled
                  className="w-4 h-4 text-primary focus:ring-primary-500 border-border"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">Con Recibo</div>
                  <div className="text-sm text-text-secondary">Incluir imagen del recibo (Próximamente)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">
              Vista Previa
            </h4>
            <div className="bg-surface-hover rounded-lg p-4">
              <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono">
                {generateShareText()}
              </pre>
            </div>
          </div>

          {/* Share Methods */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">
              Compartir Por
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleShare('email')}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={20} className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-text-primary">Correo Electrónico</div>
                  <div className="text-sm text-text-secondary">Enviar por aplicación de correo</div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              </button>

              <button
                onClick={() => handleShare('message')}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-success" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-text-primary">Mensaje</div>
                  <div className="text-sm text-text-secondary">Compartir por mensaje o SMS</div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                  <Icon name="Copy" size={20} className="text-accent" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-text-primary">
                    {shareMethod === 'copied' ? '¡Copiado!' : 'Copiar al Portapapeles'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {shareMethod === 'copied' ? 'Texto copiado exitosamente' : 'Copiar texto para pegar en otra aplicación'}
                  </div>
                </div>
                {shareMethod === 'copied' ? (
                  <Icon name="Check" size={16} className="text-success" />
                ) : (
                  <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareExpenseModal; 