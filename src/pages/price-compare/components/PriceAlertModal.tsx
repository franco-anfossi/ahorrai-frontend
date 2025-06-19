import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { Product } from '@/types';

interface PriceAlertModalProps {
  product: Product;
  onClose: () => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  const [alertPrice, setAlertPrice] = useState('');
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'push' | 'both'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message (in real app, this would be handled by a toast/notification system)
    alert(`Price alert set for ${product.name} at $${alertPrice}`);
    
    setIsSubmitting(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lowestPrice = Math.min(...product.stores.map(store => store.price));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Set Price Alert</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/assets/images/no_image.png";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">{product.name}</h3>
              <p className="text-sm text-text-secondary">Current lowest: ${lowestPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Alert Price */}
          <div className="space-y-2">
            <label htmlFor="alertPrice" className="block text-sm font-medium text-text-primary">
              Alert me when price drops to:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-text-secondary">$</span>
              </div>
              <input
                type="number"
                id="alertPrice"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder="Enter target price"
                min="1"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent spring-transition"
              />
            </div>
            {alertPrice && parseFloat(alertPrice) >= lowestPrice && (
              <p className="text-sm text-warning flex items-center space-x-1">
                <Icon name="AlertTriangle" size={14} />
                <span>Target price should be lower than current price</span>
              </p>
            )}
          </div>

          {/* Notification Method */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              How would you like to be notified?
            </label>
            <div className="space-y-2">
              {[
                { id: 'email' as const, label: 'Email', icon: 'Mail' },
                { id: 'push' as const, label: 'Push Notification', icon: 'Bell' },
                { id: 'both' as const, label: 'Both Email & Push', icon: 'Smartphone' }
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface-hover spring-transition cursor-pointer"
                >
                  <input
                    type="radio"
                    name="notificationMethod"
                    value={method.id}
                    checked={notificationMethod === method.id}
                    onChange={(e) => setNotificationMethod(e.target.value as 'email' | 'push' | 'both')}
                    className="w-4 h-4 text-primary focus:ring-primary-500 focus:ring-2"
                  />
                  <Icon name={method.icon} size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-primary">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Info */}
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>• We'll monitor prices across all retailers</li>
                  <li>• You'll be notified when your target price is reached</li>
                  <li>• Alerts expire after 30 days (renewable)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-border rounded-lg text-text-primary hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !alertPrice || parseFloat(alertPrice) >= lowestPrice}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Setting Alert...</span>
                </>
              ) : (
                <>
                  <Icon name="Bell" size={16} />
                  <span>Set Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal; 