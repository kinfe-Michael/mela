
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { slugify } from '@/util/slugify';
import NavLink from './CustomNavLink';


interface SearchResultsOverlayProps {
  searchTerm: string;
  onClose: () => void;
  setSearchTerm: (text:string) => any;
}


interface SearchResultItem {
  id: string; 
  imageUrl: string;
  name: string;
  price: number;
}

export function SearchResultsOverlay({ searchTerm, onClose,setSearchTerm }: SearchResultsOverlayProps) {
 const [searchResult,setStSearchResult] = useState<SearchResultItem[] | []>([])
  useEffect( ()=>{
   console.log(searchTerm)
   async function getReasult(){
    const response = await fetch(`/api/product/searchProducts?q=${searchTerm}`)
    let reasult = null
    if(response.ok){
      const data = await response.json()
      reasult = data.products
      setStSearchResult(reasult)
    }
    
  }
  if(searchTerm.length > 2) {
    getReasult()
  }
 
    
   
  },[searchTerm])
 
  
 
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => { 
        setSearchTerm(event.target.value);
        
      };

  return (
    <Card
      className="
        fixed top-0 bg-white text-black left-0 w-full h-full rounded-none // Default (mobile) full screen
        md:absolute md:top-full md:mt-2 md:left-0 md:right-0 // Desktop positioning
        border border-gray-200 // Your specified dark UI
        md:w-full md:h-auto md:max-h-[80vh] md:rounded-md // Desktop sizing
        lg:max-w-xl lg:mx-auto // Optional: Limit width and center on large screens
        z-[60] overflow-hidden // Ensure it's above other content and clips overflow
      "
    >
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg">Search Results for "{searchTerm}"</CardTitle>
        <CardDescription className="text-gray-400">
          {searchTerm ? (
            `Showing ${searchResult.length} result(s).`
          ) : (
            "Start typing to see suggestions..."
          )}
        </CardDescription>
          <div
                className="flex-grow  flex w-full justify-start md:hidden md:ml-10 lg:ml-40 relative"
                // ref={searchContainerRef}
              >
                <div className="bg-gradient-to-r w-full  gap-4 flex items-center border border-gray-400 rounded-full max-w-min px-4 h-10">
                  <HiMagnifyingGlass className="text-2xl font-bold" />
                  <input
                    // ref={searchInputRef}
                    className="focus:outline-0 min-w-[200px] bg-transparent  placeholder-gray-500 w-full"
                    type="text"
                    placeholder="Search..."
                    // onFocus={handleFocus}
                    onChange={handleChange}
                    value={searchTerm}
                  />
                </div>
              
              </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Close search results"
        >
          &times;
        </button>
      </CardHeader>
      <CardContent className="h-full md:h-auto">
        {searchResult.length > 0 ? (
          <ScrollArea className="h-full max-h-[calc(100vh-150px)] md:max-h-[300px]">
            <ul className="space-y-2  text-black pb-4">
              {searchResult.map((item) => (
                <NavLink 
                href={`/products/${slugify(item.name)}?id=${item.id}`}
                  key={item.id} 
                  className="p-3 flex items-center gap-4 hover:bg-gray-200 rounded-md cursor-pointer transition-colors duration-200"
                >
                  <img
                    src={item.imageUrl}
                    alt="Result thumbnail"
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <p className="text-base font-semibold ">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.price} ETB</p>
                  </div>
                </NavLink>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-gray-400 p-4">No results found for "{searchTerm}".</p>
        )}
      </CardContent>
    </Card>
  );
}