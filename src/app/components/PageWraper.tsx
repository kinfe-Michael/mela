import { PropsWithChildren } from "react";
import Sidebar from "./sidebar";
import BottomContainer from "./BottomContainer";

function PageWraper(props: PropsWithChildren) {
  return (
    <div className="w-full ">
   
      <BottomContainer />

      <div className=" w-full mb-16  h-full flex flex-col mt-16">
        {props.children}
      </div>
    </div>
  );
}

export default PageWraper;
