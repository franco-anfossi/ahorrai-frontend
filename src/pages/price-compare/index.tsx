import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import SortControls from './components/SortControls';
import ProductCard from './components/ProductCard';
import PriceChart from './components/PriceChart';
import PriceAlertModal from './components/PriceAlertModal';

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

interface Filter {
  id: string;
  label: string;
  icon: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface PriceAlertData {
  productId: number;
  targetPrice: number;
  email: string;
}

interface PriceCompareProps {}

const PriceCompare: React.FC<PriceCompareProps> = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('price');
  const [showPriceAlert, setShowPriceAlert] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock data for products
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "iPhone 15 Pro",
      brand: "Apple",
      category: "Electrónicos",
      currentPrice: 999.99,
      originalPrice: 1199.99,
      discount: 17,
      rating: 4.8,
      reviews: 1247,
      image: "https://via.placeholder.com/200x200?text=iPhone",
      stores: [
        { name: "Apple Store", price: 999.99, inStock: true },
        { name: "Amazon", price: 989.99, inStock: true },
        { name: "Best Buy", price: 1049.99, inStock: false },
        { name: "Walmart", price: 979.99, inStock: true }
      ],
      priceHistory: [
        { date: "2025-01-01", price: 1199.99 },
        { date: "2025-01-07", price: 1099.99 },
        { date: "2025-01-14", price: 999.99 },
        { date: "2025-01-21", price: 999.99 }
      ]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      category: "Electrónicos",
      currentPrice: 799.99,
      originalPrice: 899.99,
      discount: 11,
      rating: 4.6,
      reviews: 892,
      image: "https://via.placeholder.com/200x200?text=Galaxy",
      stores: [
        { name: "Samsung Store", price: 799.99, inStock: true },
        { name: "Amazon", price: 789.99, inStock: true },
        { name: "Best Buy", price: 799.99, inStock: true },
        { name: "Target", price: 809.99, inStock: false }
      ],
      priceHistory: [
        { date: "2025-01-01", price: 899.99 },
        { date: "2025-01-07", price: 849.99 },
        { date: "2025-01-14", price: 799.99 },
        { date: "2025-01-21", price: 799.99 }
      ]
    },
    {
      id: 3,
      name: "MacBook Air M2",
      brand: "Apple",
      category: "Computadoras",
      currentPrice: 1099.99,
      originalPrice: 1299.99,
      discount: 15,
      rating: 4.9,
      reviews: 2156,
      image: "https://via.placeholder.com/200x200?text=MacBook",
      stores: [
        { name: "Apple Store", price: 1099.99, inStock: true },
        { name: "Amazon", price: 1089.99, inStock: true },
        { name: "Best Buy", price: 1099.99, inStock: true },
        { name: "Costco", price: 1079.99, inStock: false }
      ],
      priceHistory: [
        { date: "2025-01-01", price: 1299.99 },
        { date: "2025-01-07", price: 1199.99 },
        { date: "2025-01-14", price: 1099.99 },
        { date: "2025-01-21", price: 1099.99 }
      ]
    }
  ]);

  const filters: Filter[] = [
    { id: 'electronics', label: 'Electrónicos', icon: 'Smartphone' },
    { id: 'computers', label: 'Computadoras', icon: 'Laptop' },
    { id: 'clothing', label: 'Ropa', icon: 'Shirt' },
    { id: 'home', label: 'Hogar', icon: 'Home' },
    { id: 'sports', label: 'Deportes', icon: 'Dumbbell' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'price', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'discount', label: 'Mayor Descuento' },
    { value: 'reviews', label: 'Más Reseñas' }
  ];

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleFilterChange = (filterId: string): void => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSortChange = (sortValue: string): void => {
    setSortBy(sortValue);
  };

  const handleProductSelect = (product: Product): void => {
    setSelectedProduct(product);
    setShowPriceAlert(true);
  };

  const handlePriceAlert = (alertData: PriceAlertData): void => {
    console.log('Price alert set:', alertData);
    setShowPriceAlert(false);
  };

  const headerActions = [
    {
      icon: 'Bell',
      label: 'Alertas de Precio',
      onClick: () => console.log('Price alerts clicked')
    },
    {
      icon: 'Settings',
      label: 'Configuración',
      onClick: () => router.push('/categories-budget-management')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderBar 
        title="Comparar Precios"
        showBack={true}
        actions={headerActions}
      />

      {/* Search and Filters */}
      <div className="bg-surface border-b border-border p-4 space-y-4">
        <SearchBar 
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar productos..."
        />
        
        <FilterChips
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        
        <SortControls
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-text-secondary">Buscando productos...</span>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Price Trends Section */}
            <div className="bg-surface rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Tendencias de Precios</h3>
              <PriceChart data={products[0].priceHistory} />
            </div>

            {/* Products Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Productos Encontrados ({products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={() => handleProductSelect(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Price Alert Modal */}
      {selectedProduct && (
        <PriceAlertModal
          onClose={() => setShowPriceAlert(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default PriceCompare; 