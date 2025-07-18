import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  HiCheckCircle,

  HiSun,
  
} from "react-icons/hi";
import { HiLanguage, HiPlusCircle } from "react-icons/hi2";
import { BiCart } from "react-icons/bi";
import NavLink from "./CustomNavLink";
import { Button } from "@/components/ui/button";
import { useCustomRouter } from "@/hooks/useCustomRouter";
function SidebarContent({setIsSheetOpen}:{setIsSheetOpen:Function}) {
  function SideBarButtons({ children,to }: { children: ReactNode,to?:string }) {
   const router = useCustomRouter()
    return <Button onClick={()=>{
      setIsSheetOpen(false)
      router.push(to || "")
    }}  className="bg-white gap-2 border-0  shadow-none p-0 m-2 flex hover:bg-gray-200 text-black">{children}</Button>;
  }
  function SideBarcard({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) {
    return (
      <Card className=" p-1 lg:p-4 gap-1 border-0">
        <CardHeader>
          <CardTitle className=" font-light">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start">
          {children}
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="flex bg-white text-sm flex-col gap-1">
      <SideBarcard title="Menu">
        <SideBarButtons to="/category">
          <HiSun className="text-xl" />
          Catagory
        </SideBarButtons >
          <SideBarButtons to="/user/products">
          <HiSun className="text-xl" />
          My products
        </SideBarButtons>
        <SideBarButtons to="/">
          <HiCheckCircle className="text-xl" />
          Products
        </SideBarButtons>
        <SideBarButtons to="/cart">
          <BiCart className="text-xl"/>
          Cart
        </SideBarButtons>
      
        
      </SideBarcard>
   
   
      
    </div>
  );
}

export default SidebarContent;
