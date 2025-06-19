import React, { useEffect, useRef, ReactNode } from 'react';
import Icon from '../AppIcon';

interface ModalDetailOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "default" | "large" | "full";
}

const ModalDetailOverlay: React.FC<ModalDetailOverlayProps> = ({ 
  isOpen = false, 
  onClose, 
  title = "", 
  children, 
  className = "",
  showCloseButton = true,
  size = "default" // "default", "large", "full"
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'large':
        return 'max-w-4xl mx-4 my-8';
      case 'full':
        return 'w-full h-full m-0 rounded-none';
      default:
        return 'max-w-2xl mx-4 my-8';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-modal flex items-center justify-center p-0 md:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`
          relative bg-surface shadow-xl animate-spring-in
          w-full h-full md:h-auto md:max-h-[90vh] md:rounded-xl
          flex flex-col overflow-hidden
          ${getSizeClasses()}
          ${className}
        `}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface sticky top-0 z-10">
            {title && (
              <h2 
                id="modal-title" 
                className="text-lg font-heading-semibold text-text-primary truncate pr-4"
              >
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <Icon name="X" size={20} className="text-text-secondary" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalDetailOverlay; 