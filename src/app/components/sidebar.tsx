"use client";
import { cn } from "@/lib/utils";

function Sidebar() {
  return (
    <aside
      className={cn(
        "fixed hidden  lg:flex flex-white  left-0 top-16 bottom-16 w-64  p-4 overflow-y-auto"
      )}
    >
    </aside>
  );
}

export default Sidebar;
