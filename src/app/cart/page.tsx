"use client";

import React, { useState } from 'react'; // Removed useEffect
import useCartStore from '@/store/useCartStore';
import PageWraper from '../components/PageWraper';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    calculateTotal
  } = useCartStore();

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  // No need for jwtToken state or useEffect here, as the cookie is handled automatically

  const handleOrderNow = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before ordering.");
      return;
    }

    // No direct JWT check needed here, the API will handle authentication check

    setIsOrdering(true);
    setOrderError(null);
    setOrderSuccess(false);
alert
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No 'Authorization' header needed here because httpOnly cookie is sent automatically
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors (e.g., insufficient stock, authentication issues)
        throw new Error(data.message || 'Failed to place order.');
      }

      setOrderSuccess(true);
      alert(`Order placed successfully! Order ID: ${data.order.id}. Total: $${calculateTotal().toFixed(2)}`);
      clearCart();
    } catch (error: any) {
      setOrderError(error.message || 'An unexpected error occurred.');
      // If the error is due to 401 Unauthorized, you might want to redirect to login
      if (error.message === 'Authentication token not found.' || error.message === 'Invalid or expired token.') {
        alert("You are not logged in or your session has expired. Please log in again.");
        // Example: Redirect to login page
        // window.location.href = '/login';
      }
      console.error("Error placing order:", error);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <PageWraper>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Your Shopping Cart</h1>

          {orderError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Order Error!</strong>
              <span className="block sm:inline"> {orderError}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setOrderError(null)}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          )}

          {orderSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Your order has been placed.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setOrderSuccess(false)}>
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-600 text-lg py-10">
              Your cart is empty. Start shopping to add items!
              <br />
              <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                Go to Homepage
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0 flex-wrap">
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/100x100/E0E0E0/808080?text=Item"; // Fallback
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow min-w-[150px]">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h2>
                      <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={isOrdering}
                      >
                        +
                      </button>
                      <span className="text-lg font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={isOrdering}
                      >
                        -
                      </button>
                    </div>

                    {/* Item Total and Remove Button */}
                    <div className="flex items-center gap-4 ml-auto md:ml-4">
                      <p className="text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        aria-label={`Remove ${item.name} from cart`}
                        disabled={isOrdering}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary and Actions */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                <button
                  onClick={clearCart}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4 sm:mb-0"
                  disabled={isOrdering}
                >
                  Clear Cart
                </button>
                <div className="text-2xl font-bold text-gray-900">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
                <button
                  onClick={handleOrderNow}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isOrdering}
                >
                  {isOrdering ? 'Placing Order...' : 'Order Now'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageWraper>
  );
};

export default CartPage;