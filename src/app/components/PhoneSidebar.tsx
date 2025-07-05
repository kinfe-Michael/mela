"use client"
import React, { useState } from "react";
import { HiViewList } from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import Link from "next/link";
function PhoneSidebar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {isLoading,isLoggedIn,logout} = useAuthStore((state)=>state)
  return (
    <Sheet open={isSheetOpen}>
      <SheetTrigger onClick={()=>setIsSheetOpen(true)}>
        <HiViewList className="lg:hidden  text-2xl" />
      </SheetTrigger>

      <SheetContent className=" border-gray-300">
        <SheetHeader className="h-0 m-0">
          <SheetTitle className="">Mela</SheetTitle>
        </SheetHeader>
        <div className="flex items-center  gap-2">
         
          
        </div>
       
         
          <div className="text-sm p-4 font-light">
            <h1>Yohana melkamu</h1>
            <h2 className="text-xs">kibrom@gmail.com</h2>
          </div>
       
        <SidebarContent />
        {!isLoggedIn &&<Link onClick={()=> setIsSheetOpen(false)} href={"/auth/login"} className="p-2 rounded-md text-center  px-2 text-xs bg-white text-black border mx-4 border-gray-300  md:block font-bold">
            Login
          </Link>
          }
          {
            !isLoggedIn && 
            <Link onClick={()=> setIsSheetOpen(false)} href={"/auth/signup"} className="p-2 rounded-md text-center text-white bg-green-500 text-sm mx-4   px-1 hover:bg-green-700 font-bold">
            Sign up
          </Link>
          }
          {
            isLoggedIn && <Button onClick={()=>{
              logout()
              setIsSheetOpen(false)
            }} className="bg-green-500 text-sm mx-4   px-1 hover:bg-green-700 font-bold">
            Log out
          </Button>
          }
      </SheetContent>
    </Sheet>
  );
}

export default PhoneSidebar;
