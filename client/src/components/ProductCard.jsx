import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }) {
  return (
    <div className="card group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
        </div>
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={() => {/* Add to cart functionality */}}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">{product.description}</p>
    </div>
  );
} 