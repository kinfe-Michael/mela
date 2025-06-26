import { PropsWithChildren } from "react";
import Sidebar from "./sidebar";
import BottomContainer from "./BottomContainer";

function PageWraper(props: PropsWithChildren) {
  return (
    <div className="w-full ">
   
      <BottomContainer />

      <div className="ml-2 w-full  h-full flex flex-col mt-20">
        {props.children}
      </div>
    </div>
  );
}

export default PageWraper;
