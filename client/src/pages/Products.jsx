import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock products data (replace with API call)
  const [products] = useState([
    {
      id: 1,
      name: 'Premium Headphones',
      price: 299.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      description: 'Feature-rich smartwatch with health tracking',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Wireless Earbuds',
      price: 159.99,
      description: 'True wireless earbuds with premium sound',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics'
    },
    {
      id: 4,
      name: 'Digital Camera',
      price: 599.99,
      description: 'Professional digital camera with 4K video',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between pt-6 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 