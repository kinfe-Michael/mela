
"use client";
import React, { useState, useEffect, useRef, ChangeEvent, FocusEvent, MouseEvent } from "react"; // Import React specific types
import { Button } from "@/components/ui/button";
import { HiSparkles, HiViewList } from "react-icons/hi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PhoneSidebar from "./PhoneSidebar";
import { SearchResultsOverlay } from "./SearchResultsOverlay";
import useWashintStore from "@/store/useWashintStore";
import { openSearchBar,closeSearchBar } from "@/lib/searchStateOperation";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
function Header() {
  const {isLoading,isLoggedIn,logout} = useAuthStore((state)=> state)
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false); 
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const searchInputRef = useRef<HTMLInputElement>(null); 
  const searchContainerRef = useRef<HTMLDivElement>(null); 
  const isSearchBarActive = useWashintStore((state)=> state.isSearchBarOpen)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { 
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        // setShowSearchResults(false);
        closeSearchBar()
      }
    }

    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, []);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => { 
    // setShowSearchResults(true);
    openSearchBar()
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { 
    setSearchTerm(event.target.value);
    // setShowSearchResults(true);
    openSearchBar()
  };

  const handleCloseSearchResults = () => {
    // setShowSearchResults(false);
    closeSearchBar()
    setSearchTerm("");
  };

  return (
    <header className="fixed flex top-0 h-16 left-0 right-0 z-50 bg-gray-100  items-center px-4 shadow-md">
      <HiSparkles className="text-xl" />
      <Link href={"/"} className="font-semibold">Mela</Link>
      <div
        className="flex-grow ml-4  md:ml-10 lg:ml-40 relative"
        ref={searchContainerRef}
      >
        <div className="bg-gradient-to-r hidden md:flex gap-4  items-center border  border-gray-400 rounded-full max-w-min px-4 h-10">
          <HiMagnifyingGlass className="text-2xl font-bold" />
          <input
            ref={searchInputRef}
            className="focus:outline-0 min-w-[200px] bg-transparent placeholder-gray-400 w-full"
            type="text"
            placeholder="Search..."
            onFocus={handleFocus}
            onChange={handleChange}
            value={searchTerm}
          />
        </div>
        {isSearchBarActive && (
          <SearchResultsOverlay setSearchTerm={setSearchTerm} searchTerm={searchTerm} onClose={handleCloseSearchResults} />
        )}
      </div>
      <div className="flex flex-grow items-center justify-end gap-2">
        
        <Link href={"/user/products"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">My products</Link >
        <Link href={"/category"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">Catagory</Link >
        <Link href={"/"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">products</Link >
        <Link href={"/orders"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">order</Link >
        <Link href={"/cart"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">cart</Link>
        {!isLoggedIn && <Link  className="" href={"/auth/login"}>
        <Button className="bg-[#FF3B30] text-xs px-3 hover:bg-[#ff3a30d8] font-bold">
         Login
        </Button>
        </Link>}
         {isLoggedIn && 
        <Button onClick={logout} className="bg-gray-200 md:hidden text-xs text-black px-3 hover:bg-gray-50 font-bold">
         Logout
        </Button>
       }
        <PhoneSidebar />
      </div>
    </header>
  );
}

export default Header;