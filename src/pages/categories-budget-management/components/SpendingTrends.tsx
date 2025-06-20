import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from 'components/AppIcon';
import { Category } from 'types';

interface SpendingTrendsProps {
  categories: Category[];
}

interface TrendDataPoint {
  month: string;
  Food: number;
  Transportation: number;
  Entertainment: number;
  Shopping: number;
  Healthcare: number;
  Utilities: number;
}

interface Period {
  id: string;
  label: string;
}

interface CategoryOption {
  id: string;
  label: string;
}

interface TrendResult {
  change: number;
  direction: 'up' | 'down' | 'stable';
}

const SpendingTrends: React.FC<SpendingTrendsProps> = ({ categories }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('3months');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Mock trend data
  const trendData: Record<string, TrendDataPoint[]> = {
    '3months': [
      { month: 'Nov', Food: 720, Transportation: 380, Entertainment: 220, Shopping: 580, Healthcare: 120, Utilities: 240 },
      { month: 'Dec', Food: 680, Transportation: 410, Entertainment: 280, Shopping: 650, Healthcare: 90, Utilities: 250 },
      { month: 'Jan', Food: 650, Transportation: 420, Entertainment: 180, Shopping: 720, Healthcare: 85, Utilities: 245 }
    ],
    '6months': [
      { month: 'Aug', Food: 750, Transportation: 360, Entertainment: 320, Shopping: 520, Healthcare: 150, Utilities: 230 },
      { month: 'Sep', Food: 780, Transportation: 390, Entertainment: 250, Shopping: 600, Healthcare: 110, Utilities: 240 },
      { month: 'Oct', Food: 720, Transportation: 380, Entertainment: 220, Shopping: 580, Healthcare: 120, Utilities: 240 },
      { month: 'Nov', Food: 720, Transportation: 380, Entertainment: 220, Shopping: 580, Healthcare: 120, Utilities: 240 },
      { month: 'Dec', Food: 680, Transportation: 410, Entertainment: 280, Shopping: 650, Healthcare: 90, Utilities: 250 },
      { month: 'Jan', Food: 650, Transportation: 420, Entertainment: 180, Shopping: 720, Healthcare: 85, Utilities: 245 }
    ]
  };

  const periods: Period[] = [
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' }
  ];

  const categoryOptions: CategoryOption[] = [
    { id: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ id: cat.name.replace(/\s+/g, ''), label: cat.name }))
  ];

  const currentData = trendData[selectedPeriod] || trendData['3months'];

  // Calculate trend statistics
  const calculateTrend = (categoryName: string): TrendResult => {
    const data = currentData;
    if (data.length < 2) return { change: 0, direction: 'stable' };
    
    const latest = Number(data[data.length - 1][categoryName as keyof TrendDataPoint]) || 0;
    const previous = Number(data[data.length - 2][categoryName as keyof TrendDataPoint]) || 0;
    
    if (previous === 0) return { change: 0, direction: 'stable' };
    
    const change = ((latest - previous) / previous * 100);
    
    return {
      change: Math.abs(change),
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
    };
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable'): string => {
    switch (direction) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable'): string => {
    switch (direction) {
      case 'up': return 'text-error';
      case 'down': return 'text-accent';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Spending Trends</h3>
        <div className="flex bg-surface-hover rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md spring-transition ${
                selectedPeriod === period.id
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Trend Chart */}
      <div className="bg-surface rounded-xl p-4 border border-border card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-text-primary">Monthly Spending Overview</h4>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {selectedCategory === 'all' ? (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                {categories.map((category, index) => (
                  <Bar
                    key={category.name}
                    dataKey={category.name.replace(/\s+/g, '')}
                    fill={category.color}
                    opacity={0.8}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey={selectedCategory}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Trend Cards */}
      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary">Category Trends</h4>
        {categories.map((category) => {
          const trend = calculateTrend(category.name.replace(/\s+/g, ''));
          return (
            <div key={category.id} className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon 
                      name={category.icon} 
                      size={16} 
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{category.name}</p>
                    <p className="text-sm text-text-secondary">
                      ${category.spent.toLocaleString()} this month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 ${getTrendColor(trend.direction)}`}>
                    <Icon name={getTrendIcon(trend.direction)} size={16} />
                    <span className="text-sm font-medium">
                      {trend.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Mini Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full"
                    style={{ 
                      width: `${Math.min(category.percentage, 100)}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="bg-primary-50 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h4 className="font-semibold text-text-primary">Spending Insights</h4>
        </div>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-accent mt-0.5" />
            <span>Your food spending has decreased by 8.5% this month - great job!</span>
          </li>
          <li className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
            <span>Shopping expenses are 15% above your budget - consider reviewing your spending.</span>
          </li>
          <li className="flex items-start space-x-2">
            <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
            <span>Transportation costs are trending upward - you might want to explore alternative options.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpendingTrends; 