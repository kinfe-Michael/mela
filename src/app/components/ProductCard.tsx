"use client"
import Image from "next/image";

interface ProductCardProps {
  url: string;
  alt: string;
  productName: string;
  price: number;
  // You might want to add an optional handler for the "Add to Cart" button

}

function ProductCard({
  url,
  alt,
  productName,
  price,
 
}: ProductCardProps) {
  return (
    <div
      className="
        lg:p-2
        w-[150px]
        lg:w-[250px]
        m-2
        rounded-md
        overflow-hidden
        shadow-lg
        hover:shadow-xl
        transition-shadow
        duration-300
        cursor-pointer
      "
    >
      <Image
        src={"/yohana.jpg"}
        alt={alt}
        height={250} // Increased height for better product display
        width={250}  // Increased width for better product display
        className="rounded-t-md w-full h-auto object-cover" // Ensure image covers the area and is responsive
      />
      <div className="p-4">
        <h2 className="font-semibold text-sm md:text-base truncate mb-1">
          {productName}
        </h2>{" "}
        <p className="text-sm md:text-base font-bold text-gray-800 mb-3">
          ${price.toFixed(2)} {/* Format price to two decimal places */}
        </p>
        <button
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            font-bold
            py-2
            px-4
            text-sm
            rounded
            w-full
            transition-colors
            duration-200
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;