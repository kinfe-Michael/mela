// pages/orders/index.tsx
"use client";

import React, { useState } from 'react'; // Import useState

// Define interfaces directly in this file for self-containment
interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderDate: string; // e.g., "2023-10-26"
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
}

// Hardcoded mock data for user's past orders
const staticOrders: Order[] = [
  {
    id: 'ORD-2023-001',
    orderDate: '2023-10-20',
    totalAmount: 125.49,
    status: 'Delivered',
    items: [
      { productId: 'prod-001', name: 'Wireless Bluetooth Headphones', imageUrl: 'https://placehold.co/64x64/EEF2FF/3F20BA?text=HP', price: 79.99, quantity: 1 },
      { productId: 'prod-002', name: 'USB-C Fast Charger', imageUrl: 'https://placehold.co/64x64/D1FAE5/065F46?text=Charger', price: 15.50, quantity: 3 },
    ],
  },
  {
    id: 'ORD-2023-002',
    orderDate: '2023-10-22',
    totalAmount: 49.99,
    status: 'Shipped',
    items: [
      { productId: 'prod-003', name: 'Ergonomic Mouse Pad', imageUrl: 'https://placehold.co/64x64/FEE2E2/991B1B?text=MousePad', price: 12.00, quantity: 1 },
      { productId: 'prod-004', name: 'Gaming Keyboard RGB', imageUrl: 'https://placehold.co/64x64/FFFBEB/92400E?text=Keyboard', price: 37.99, quantity: 1 },
    ],
  },
  {
    id: 'ORD-2023-003',
    orderDate: '2023-10-25',
    totalAmount: 299.00,
    status: 'Processing',
    items: [
      { productId: 'prod-005', name: '4K Ultra HD Monitor', imageUrl: 'https://placehold.co/64x64/DBEAFE/1E40AF?text=Monitor', price: 299.00, quantity: 1 },
    ],
  },
  {
    id: 'ORD-2023-004',
    orderDate: '2023-10-26',
    totalAmount: 8.50,
    status: 'Pending',
    items: [
      { productId: 'prod-006', name: 'Screen Cleaning Kit', imageUrl: 'https://placehold.co/64x64/E0F2F7/0E7490?text=Cleaner', price: 8.50, quantity: 1 },
    ],
  },
];

const StaticOrdersPage: React.FC = () => {
  // State to manage which order cards are expanded/collapsed
  // Map order ID to a boolean (true for expanded, false for collapsed)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Function to toggle the expanded state of an order
  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId] // Toggle the boolean value for the given orderId
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">My Orders</h1>

        {staticOrders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-10">
            You haven't placed any orders yet.
            <br />
            <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {staticOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order ID: {order.id}</h2>
                    <p className="text-sm text-gray-600">Date: {order.orderDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}
                    >
                      {order.status}
                    </span>
                    {/* Collapse/Expand Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-gray-500 transform transition-transform duration-200 ${expandedOrders[order.id] ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Conditionally render items based on expandedOrders state */}
                {expandedOrders[order.id] && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Items:</h3>
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li key={item.productId} className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/64x64/E0E0E0/808080?text=Item"; // Fallback image
                            }}
                          />
                          <div className="flex-grow">
                            <p className="text-gray-700 font-medium line-clamp-1">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-gray-800 font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-right pt-4 border-t">
                  <p className="text-xl font-bold text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticOrdersPage;
