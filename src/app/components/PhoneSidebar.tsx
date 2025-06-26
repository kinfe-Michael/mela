import React from "react";
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
function PhoneSidebar() {
  return (
    <Sheet>
      <SheetTrigger>
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
         <Button className=" px-2 text-xs bg-white text-black border mx-4 border-gray-300  md:block font-bold">
            Login
          </Button>
          <Button className="bg-green-500 text-sm mx-4   px-1 hover:bg-green-700 font-bold">
            Sign up
          </Button>
      </SheetContent>
    </Sheet>
  );
}

export default PhoneSidebar;
