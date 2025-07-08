import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CiSettings } from "react-icons/ci";
import {
  HiCheckCircle,
  HiClock,
  HiDotsVertical,
  HiHeart,
  HiMicrophone,
  HiMusicNote,
  HiSun,
  HiViewList,
} from "react-icons/hi";
import { HiLanguage, HiPlusCircle } from "react-icons/hi2";
import { BiCart } from "react-icons/bi";
function SidebarContent() {
  function SideBarButtons({ children }: { children: ReactNode }) {
    return <Button className="bg-white hover:bg-gray-200 text-black">{children}</Button>;
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
        <SideBarButtons>
          <HiSun />
          Catagory
        </SideBarButtons>
          <SideBarButtons>
          <HiSun />
          My products
        </SideBarButtons>
        <SideBarButtons>
          <HiCheckCircle />
          Products
        </SideBarButtons>
        <SideBarButtons>
          <BiCart/>
          Cart
        </SideBarButtons>
      
        <SideBarButtons>
          <CiSettings />
          Settings
        </SideBarButtons>
      </SideBarcard>
   
   
      
    </div>
  );
}

export default SidebarContent;
