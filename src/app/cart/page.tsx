// pages/cart.tsx
"use client";

import React, { useEffect } from 'react';
// Removed import for useCartStore from '../store/useCartStore' as it will be inlined.
import useCartStore from '@/store/useCartStore';
import PageWraper from '../components/PageWraper';
// Define the CartItem interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}


// --- END: Inlined Zustand Store Definition ---

// Mock initial cart data (now used to populate the store on initial load)


const CartPage: React.FC = () => {
  // Use Zustand store for state management
  const { 
    cartItems, 
    loading, 
    setCartItems, 
    setLoading, 
    increaseQuantity, 
    decreaseQuantity, 
    removeItem, 
    clearCart, 
    calculateTotal 
  } = useCartStore();

 // Depend on setters from Zustand

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before ordering.");
      return;
    }
    // In a real application, you would integrate with a payment gateway
    // or an order processing API here.
    alert(`Order placed successfully! Total: $${calculateTotal().toFixed(2)}`);
    clearCart(); // Clear cart after successful order
  };



  return (
   <PageWraper>
     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Your Shopping Cart</h1>

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
                    >
                      +
                    </button>
                    <span className="text-lg font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                      aria-label={`Decrease quantity of ${item.name}`}
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
              >
                Clear Cart
              </button>
              <div className="text-2xl font-bold text-gray-900">
                Total: ${calculateTotal().toFixed(2)}
              </div>
              <button
                onClick={handleOrderNow}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Order Now
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
