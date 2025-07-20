
"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { closeSearchBar, openSearchBar } from "@/lib/searchStateOperation";
import useWashintStore from "@/store/useWashintStore";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import NavLink from "./CustomNavLink";
import PhoneSidebar from "./PhoneSidebar";
import { SearchResultsOverlay } from "./SearchResultsOverlay";
function Header() {
  const {isLoggedIn,logout} = useAuthStore((state)=> state)
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
        closeSearchBar()
      }
    }

    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, []);

  const handleFocus = () => { 
    openSearchBar()
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { 
    setSearchTerm(event.target.value);
    openSearchBar()
  };

  const handleCloseSearchResults = () => {
    closeSearchBar()
    setSearchTerm("");
  };

  return (
    <header className="fixed flex top-0 h-16 left-0 right-0 z-50 bg-gray-100  items-center px-4 shadow-md">
      <HiSparkles className="text-xl" />
      <NavLink href={"/"} className="font-semibold">Mela</NavLink>
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
        
        <NavLink href={"/user/products"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">My products</NavLink >
        <NavLink href={"/category"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">Catagory</NavLink >
        <NavLink href={"/"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">products</NavLink >
        <NavLink href={"/orders"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">order</NavLink >
        <NavLink href={"/cart"} className="px-2 text-xs hidden md:block font-bold bg-transparent shadow-none hover:bg-gray-200 text-black ">cart</NavLink>
        {!isLoggedIn && <NavLink  className="" href={"/auth/login"}>
        <Button className="bg-[#FF3B30] text-xs px-3 hover:bg-[#ff3a30d8] font-bold">
         Login
        </Button>
        </NavLink>}
         {isLoggedIn && 
        <Button onClick={logout} className="bg-gray-200 md:flex hidden text-xs text-black px-3 hover:bg-gray-50 font-bold">
         Logout
        </Button>
       }
        <PhoneSidebar />
      </div>
    </header>
  );
}

export default Header;