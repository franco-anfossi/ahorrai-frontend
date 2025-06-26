import React from 'react';
import Icon from '@/components/AppIcon';

const ReceiptTips: React.FC = () => (
  <div className="bg-primary-50 rounded-lg p-4 w-full">
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
);

export default ReceiptTips;
