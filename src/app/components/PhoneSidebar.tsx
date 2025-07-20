"use client"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/authStore";
import { useState } from "react";
import { HiViewList } from "react-icons/hi";
import NavLink from "./CustomNavLink";
import SidebarContent from "./SidebarContent";
function PhoneSidebar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {isLoggedIn,logout} = useAuthStore((state)=>state)
  return (
    <Sheet onOpenChange={setIsSheetOpen} open={isSheetOpen}>
      <SheetTrigger asChild>
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
       
        <SidebarContent setIsSheetOpen={setIsSheetOpen} />
        {!isLoggedIn &&<NavLink onClick={()=> setIsSheetOpen(false)} href={"/auth/login"} className="p-2 rounded-md text-center  px-2 text-xs bg-white text-black border mx-4 border-gray-300  md:block font-bold">
            Login
          </NavLink>
          }
          {
            !isLoggedIn && 
            <NavLink onClick={()=> setIsSheetOpen(false)} href={"/auth/signup"} className="p-2 rounded-md text-center text-white bg-green-500 text-sm mx-4   px-1 hover:bg-green-700 font-bold">
            Sign up
          </NavLink>
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
