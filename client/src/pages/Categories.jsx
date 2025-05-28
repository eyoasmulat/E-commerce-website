import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3',
      productCount: 3
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing, shoes, and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3',
      productCount: 3
    },
    {
      id: 3,
      name: 'Home & Living',
      description: 'Furniture, decor, and home essentials',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3',
      productCount: 3
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Categories</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {categories.map((category) => (
          <div key={category.id} className="group relative">
            <div className="relative h-72 w-full overflow-hidden rounded-lg">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity group-hover:opacity-75" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-semibold text-white">
                <Link to={`/categories/${category.id}`}>
                  <span className="absolute inset-0" />
                  {category.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-200">{category.description}</p>
              <p className="mt-1 text-sm font-medium text-white">
                {category.productCount} Products
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {/* Add featured products here */}
        </div>
      </div>
    </div>
  );
} 