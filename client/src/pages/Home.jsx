import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const categories = [
  { id: 1, name: 'Electronics', icon: '🔌' },
  { id: 2, name: 'Fashion', icon: '👕' },
  { id: 3, name: 'Home & Living', icon: '🏠' },
  { id: 4, name: 'Sports', icon: '⚽' },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 4)); // Get first 4 products as featured
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Hero"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/75 to-gray-900/25"></div>
            </div>
            <div className="relative px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Summer Collection 2023
              </h1>
              <p className="mt-6 max-w-lg text-xl text-gray-200">
                Discover our latest arrivals and trending items. Shop the most stylish products at amazing prices.
              </p>
              <div className="mt-10">
                <Link
                  to="/products"
                  className="inline-block rounded-md border border-transparent bg-primary-600 px-8 py-3 text-center font-medium text-white hover:bg-primary-700"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white">
                    <HeartIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-medium text-gray-900">${product.price}</p>
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{product.rating || 4.5}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-2 text-base font-medium text-white hover:bg-primary-700"
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Subscribe to our newsletter
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-100">
              Get the latest updates about new products and upcoming sales.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <input
                  type="email"
                  className="w-72 rounded-l-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
                <button className="flex items-center justify-center rounded-r-md border border-transparent bg-primary-700 px-6 py-3 text-base font-medium text-white hover:bg-primary-800">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 