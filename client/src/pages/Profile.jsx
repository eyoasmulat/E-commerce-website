import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinedDate: 'January 2024'
  });

  const [orders] = useState([
    {
      id: 1,
      date: '2024-01-15',
      total: 499.98,
      status: 'delivered',
      items: [
        {
          id: 1,
          name: 'Premium Headphones',
          price: 299.99,
          quantity: 1
        },
        {
          id: 2,
          name: 'Smart Watch',
          price: 199.99,
          quantity: 1
        }
      ]
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* User Info Section */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-lg text-gray-900">{user.joinedDate}</p>
              </div>
              <button className="btn btn-primary w-full">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="mt-8 lg:mt-0 lg:w-2/3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between py-2">
                          <div>
                            <p className="text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="border-t mt-4 pt-4 flex justify-between">
                        <p className="font-medium text-gray-900">Total</p>
                        <p className="font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-500 font-medium"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 