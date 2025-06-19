import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import PriceChart from './PriceChart';

interface Store {
  name: string;
  price: number;
  inStock: boolean;
}

interface PriceHistoryPoint {
  date: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  stores: Store[];
  priceHistory: PriceHistoryPoint[];
}

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<number>(0);

  const bestDeal = product.stores.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLowestPrice = (): number => {
    return Math.min(...product.stores.map(store => store.price));
  };

  const getHighestPrice = (): number => {
    return Math.max(...product.stores.map(store => store.price));
  };

  const getPriceDifference = (): number => {
    return getHighestPrice() - getLowestPrice();
  };

  const getAvailabilityColor = (inStock: boolean): string => {
    return inStock ? 'text-success' : 'text-error';
  };

  const getAvailabilityText = (inStock: boolean): string => {
    return inStock ? 'En Stock' : 'Agotado';
  };

  const getRatingStars = (rating: number): React.ReactNode[] => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: React.ReactNode[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="Star" size={12} className="text-warning fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="Star" size={12} className="text-text-muted" />);
    }

    return stars;
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden card-shadow">
      {/* Product Header */}
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-text-primary truncate pr-2">{product.name}</h3>
              <button
                onClick={() => onSelect(product)}
                className="p-1 rounded-full hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Configurar alerta de precio"
              >
                <Icon 
                  name="Bell" 
                  size={20} 
                  className="text-text-muted hover:text-primary" 
                />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-3">{product.category}</p>

            {/* Price Range */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-success">{formatCurrency(getLowestPrice())}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-text-muted line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
                {getPriceDifference() > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="TrendingDown" size={14} />
                    <span>Diferencia de {formatCurrency(getPriceDifference())}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">{product.stores.length} tiendas</p>
                <div className="flex items-center space-x-1">
                  {getRatingStars(product.rating)}
                  <span className="text-xs text-text-secondary ml-1">({product.rating})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Deal Highlight */}
        <div className="mt-4 p-3 bg-success-50 rounded-lg border border-success-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Mejor Oferta</span>
            </div>
            <button
              onClick={() => onSelect(product)}
              className="text-xs text-primary hover:text-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              Configurar Alerta
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">{bestDeal.name}</p>
              <p className="text-sm text-text-secondary">Entrega disponible</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-success">{formatCurrency(bestDeal.price)}</p>
              <p className={`text-xs ${getAvailabilityColor(bestDeal.inStock)}`}>
                {getAvailabilityText(bestDeal.inStock)}
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg flex items-center justify-center space-x-1"
        >
          <span>{showDetails ? 'Ocultar Detalles' : 'Comparar Todas las Tiendas'}</span>
          <Icon 
            name={showDetails ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="spring-transition"
          />
        </button>
      </div>

      {/* Detailed Comparison */}
      {showDetails && (
        <div className="border-t border-border">
          {/* Store Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide">
            {product.stores.map((store, index) => (
              <button
                key={index}
                onClick={() => setSelectedStore(index)}
                className={`
                  flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 spring-transition
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${selectedStore === index
                    ? 'text-primary border-primary bg-primary-50' :'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
                  }
                `}
              >
                {store.name}
              </button>
            ))}
          </div>

          {/* Selected Store Details */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">Precio</p>
                <p className="font-bold text-lg text-text-primary">
                  {formatCurrency(product.stores[selectedStore].price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Disponibilidad</p>
                <p className={`font-medium ${getAvailabilityColor(product.stores[selectedStore].inStock)}`}>
                  {getAvailabilityText(product.stores[selectedStore].inStock)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Tienda</p>
                <p className="font-medium text-text-primary">{product.stores[selectedStore].name}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Ahorro</p>
                <p className="font-medium text-success">
                  {product.stores[selectedStore].price < product.originalPrice 
                    ? formatCurrency(product.originalPrice - product.stores[selectedStore].price)
                    : '$0.00'
                  }
                </p>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="mt-4">
              <p className="text-xs text-text-secondary mb-2">Historial de Precios</p>
              <div className="h-32">
                <PriceChart data={product.priceHistory} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onSelect(product)}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Configurar Alerta
              </button>
              <button className="flex-1 py-2 border border-border text-text-primary rounded-lg hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 