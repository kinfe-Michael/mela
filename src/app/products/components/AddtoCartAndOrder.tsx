"use client"
import useCartStore from "@/store/useCartStore"
import type { CartItem } from "@/store/useCartStore"



function AddtoCartAndOrder({imageUrl,name,id,price}:Omit<CartItem, "quantity">) {
    const cartItem:Omit<CartItem, "quantity"> = {
        imageUrl,
        name,
        id,
        price
    }
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.cartItems);
    console.log(cartItems)
    const isItemInCart = cartItems.some(item => item.id === cartItem.id);
   
    return (
        <div className="flex space-x-4 mt-4"> {/* Added a div and some styling for better layout */}
            <button
                onClick={() => {
                    addItem(cartItem, 1); // Call addItem directly. The store handles existing items.
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                {isItemInCart ? "item is in cart" : "Add to Cart"}
            </button>
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                Buy Now
            </button>
        </div>
    )
}

export default AddtoCartAndOrder;