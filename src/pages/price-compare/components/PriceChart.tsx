import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import Icon from '@/components/AppIcon';
import { PriceHistory } from '@/types';

interface PriceChartProps {
  data: PriceHistory[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-text-primary">{formatDate(label || '')}</p>
          <p className="text-sm text-primary font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getPriceChange = (): { change: number; percentage: number } => {
    if (data.length < 2) return { change: 0, percentage: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return { change, percentage };
  };

  const { change, percentage } = getPriceChange();
  const isPriceDown = change < 0;

  return (
    <div className="space-y-4">
      {/* Price Change Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={isPriceDown ? "TrendingDown" : "TrendingUp"} 
            size={20} 
            className={isPriceDown ? "text-success" : "text-error"} 
          />
          <div>
            <p className="text-sm font-medium text-text-primary">
              {isPriceDown ? 'Precio Bajó' : 'Precio Subió'}
            </p>
            <p className={`text-sm font-semibold ${isPriceDown ? 'text-success' : 'text-error'}`}>
              {formatCurrency(Math.abs(change))} ({Math.abs(percentage).toFixed(1)}%)
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-text-secondary">Precio Actual</p>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(data[data.length - 1]?.price || 0)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={formatDate}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPriceDown ? "#10B981" : "#EF4444"}
              strokeWidth={3}
              dot={{ fill: isPriceDown ? "#10B981" : "#EF4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isPriceDown ? "#10B981" : "#EF4444", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Price Range Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-text-secondary mb-1">Precio Más Alto</p>
          <p className="text-sm font-semibold text-error">
            {formatCurrency(Math.max(...data.map(d => d.price)))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary mb-1">Precio Más Bajo</p>
          <p className="text-sm font-semibold text-success">
            {formatCurrency(Math.min(...data.map(d => d.price)))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceChart; 