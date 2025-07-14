// app/orders/page.tsx (or pages/orders.tsx if you prefer the Pages Router)
"use client"; // This component needs client-side interactivity (useState, useEffect)

import React, { useState, useEffect } from 'react';
import PageWraper from '../components/PageWraper'; // Adjust path if necessary

// Interfaces directly reflecting the data structure from your API route
// after it transforms Drizzle's output.
interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderDate: string; // YYYY-MM-DD string
  totalAmount: number; // Number after parseFloat
  status: 'Pending' | 'Completed' | 'Shipped' | 'Delivered' | 'Cancelled'; // Capitalized for display
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // The browser will automatically send the 'auth-token' HTTP-only cookie
        const response = await fetch('/api/users/orders', {
          method: 'GET',
          // No explicit headers needed for cookie-based auth on client-side fetch
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Handle specific errors, e.g., 401 for unauthorized
          if (response.status === 401) {
            setError("Authentication failed. Please log in again.");
            // Optionally redirect to login page here:
            // router.push('/login'); // If you're using Next.js router
          } else {
            setError(errorData.message || `Failed to fetch orders (Status: ${response.status}).`);
          }
          return; // Stop execution if there's an error
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        // This catches network errors or issues with response.json()
        setError(`Network error or unexpected response: ${err.message}`);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
  };

  // --- Loading State UI ---
  if (loading) {
    return (
      <PageWraper>
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-gray-700 text-lg">Loading your orders...</p>
        </div>
      </PageWraper>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <PageWraper>
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            {/* Optionally add a retry button */}
            <button
              onClick={() => {
                setError(null); // Clear error to allow retry
                setLoading(true); // Set loading to true for fetch to run again
                // Directly call fetchOrders or trigger useEffect again
                // For simplicity, just reloading might be an option for now
                window.location.reload();
              }}
              className="ml-4 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </PageWraper>
    );
  }

  // --- Main Content (Orders Display) ---
  return (
    <PageWraper>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center text-gray-600 text-lg py-10">
              You haven't placed any orders yet.
              <br />
              <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  {/* Order Header (Clickable for expanding) */}
                  <div className="flex justify-between items-center mb-4 border-b pb-4 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Order ID: {order.id}</h2>
                      <p className="text-sm text-gray-600">Date: {order.orderDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Order Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                          ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {order.status}
                      </span>
                      {/* Expand/Collapse Icon */}
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

                  {/* Order Items (Conditional Display) */}
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

                  {/* Order Total */}
                  <div className="text-right pt-4 border-t">
                    <p className="text-xl font-bold text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWraper>
  );
};

export default OrdersPage;