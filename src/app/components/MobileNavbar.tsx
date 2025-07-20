"use client";
import React, { useState } from "react";
import { Home, Library, Search } from "lucide-react"; 
import { openSearchBar } from "@/lib/searchStateOperation";
import { BiCart } from "react-icons/bi";
import { useCustomRouter } from "@/hooks/useCustomRouter";
export default function MobileNavbar() {
  const [activeLink, setActiveLink] = useState<string>("home");
 const router = useCustomRouter()
  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-white text-black p-2
                 flex justify-around items-center rounded-t-xl shadow-lg
                 md:hidden z-50"
    >
      <NavItem
        icon={Home}
        label="Home"
        linkName="home"
        active={activeLink === "home"}
        onClick={() => {
          setActiveLink("home")
          router.push("/")
        }}
      />

      <NavItem
        icon={Library}
        label="Catagory"
        linkName="Catagory"
        active={activeLink === "Catagory"}
        onClick={() => {
          setActiveLink("Catagory")
          router.push("/category")
        }}
      />

      <NavItem
        icon={Search}
        label="Search"
        linkName="search"
        active={activeLink === "search"}
        onClick={() => {
          setActiveLink("search")
          openSearchBar()
          
        }}
      />

      <NavItem
        icon={BiCart}
        label="Cart"
        linkName="Cart"
        active={activeLink === "Cart"}
        onClick={() => {
          setActiveLink("Cart")
          router.push("/cart")
        }}
      />
    </nav>
  );
}



const NavItem: React.FC<any> = ({
  icon: Icon,
  label,
  active,
  onClick,
}) => {
  return (
    <button
      className={`flex flex-col items-center px-4 rounded-lg transition-colors duration-200
                  ${
                    active
                      ? "text-[#eb5048] bg-white"
                      : "text-gray-400 hover:text-blue-300 hover:bg-gray-800"
                  }`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={24} />

      <span className="text-xs mt-1 font-medium font-inter">{label}</span>
    </button>
  );
};
