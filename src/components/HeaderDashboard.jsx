import {NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";

export default function HeaderDashboard() {
  return (
    <>
    <div className="Header flex bg-violetBG h-16 w-full z-30 backdrop-blur-sm shadow-md border-b-4 border-darkViolet">    
          <NavLink to="/" className={'flex flex-row-reverse content-center size-full'}>
            <CiLogout className="self-center mr-10 cursor-pointer stroke-2 size-5"/>
            <div className="font-medium text-lg self-center p-2"> Logout</div>
          </NavLink>

          
    </div>
    </>
  );
}
