import React from "react";
import MobileNavbar from "./MobileNavbar";

function BottomContainer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-transparent text-white flex md:hidden items-center justify-center shadow-inner">
   <MobileNavbar/>
    </div>
  );
}

export default BottomContainer;
