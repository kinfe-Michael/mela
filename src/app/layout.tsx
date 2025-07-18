"use client"
import Header from "./components/header";
// import Sidebar from "./components/sidebar"; // If you have a sidebar, integrate it later
import "./globals.css";
import BottomContainer from "./components/BottomContainer"; // If you have a fixed footer, integrate it later
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Still needed for your Scroller component, but not necessarily this root layout's structure
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProgressBar from "./components/ProgressBar";
import { useAuthStore } from "@/lib/authStore";
import { useEffect } from "react";


const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const checkAuthStatus = useAuthStore((state)=> state.checkAuthStatus)
useEffect(()=>{
checkAuthStatus()
},[])

  return (
    <html lang="en">
      <body className="flex flex-col max-w-screen min-h-screen">
         <QueryClientProvider client={queryClient}>

        
        <div className=" mx-auto flex-grow w-full">
          <div className="flex flex-col flex-1">
            <Header />
            <ScrollArea className="flex-1">
              {children}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>
          <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
         <ProgressBar/>
      </body>
    </html>
  );
}
