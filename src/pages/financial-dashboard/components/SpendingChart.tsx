import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import Icon from 'components/AppIcon';

interface ChartData {
  label: string;
  amount: number;
}

interface SpendingChartProps {
  weeklyData: ChartData[];
  monthlyData: ChartData[];
  currency?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const SpendingChart: React.FC<SpendingChartProps> = ({
  weeklyData,
  monthlyData,
  currency,
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-sm text-primary font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = viewMode === 'weekly' ? weeklyData : monthlyData;

  const totalSpent = chartData.reduce((sum, item) => sum + item.amount, 0);
  const averageSpent = chartData.length ? totalSpent / chartData.length : 0;
  const highestWeek = Math.max(...chartData.map((item) => item.amount));

  return (
    <div className="bg-surface rounded-xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Tendencias de Gastos</h3>
          <p className="text-sm text-text-secondary">
            {viewMode === 'weekly' ? 'Desglose semanal' : 'Desglose mensual'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium spring-transition ${
              viewMode === 'weekly' ?'bg-primary text-white' :'bg-surface-hover text-text-secondary hover:text-text-primary'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium spring-transition ${
              viewMode === 'monthly' ?'bg-primary text-white' :'bg-surface-hover text-text-secondary hover:text-text-primary'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6" aria-label="Gráfico de Barras de Gastos Semanales">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="TrendingUp" size={16} className="text-primary mr-1" />
            <span className="text-xs text-text-secondary">Total</span>
          </div>
          <p className="text-sm font-semibold text-text-primary">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="BarChart3" size={16} className="text-success mr-1" />
            <span className="text-xs text-text-secondary">Promedio</span>
          </div>
          <p className="text-sm font-semibold text-text-primary">
            {formatCurrency(averageSpent)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="ArrowUp" size={16} className="text-warning mr-1" />
            <span className="text-xs text-text-secondary">Más Alto</span>
          </div>
          <p className="text-sm font-semibold text-text-primary">
            {formatCurrency(highestWeek)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart; 