import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedout } from "../redux/slices/signInSlice";
import { useEffect, useState } from "react";
import { setRoleAsUser } from "../redux/slices/roleSlice";

const Header = () => {
  const dispatch = useDispatch();
  const whichRole=useSelector((state)=>state.role.roleName);


  const isSignedIn = useSelector((state) => state.signin.isSignedIn);
  // //console.log(isSignedIn,"from header");
  const handleLogout = () => {
    //console.log(Cookies.get("jwt-token"));
    if (Cookies.get("jwt-token")) {
      Cookies.remove("jwt-token");
      dispatch(userLoggedout());
      localStorage.removeItem("symptomFields");
    }
    useDispatch(setRoleAsUser());
  };

  if(whichRole=="user"){
    return (
    <>
      <div
        id="header"
        className="w-full h-24 sticky top-0 z-50 bg-[#16165C] border-b-[1px] border-opacity-65 border-white flex justify-between py-2 px-10 items-center"
      >
        <div className="w-9/12 h-full flex justify-start ml-16 text-white items-center">
          <div id="div1" className="inline-flex items-center w-62 space-x-2">
            <Link to="/home" className="flex items-center">
              <img
                src="./logo.png"
                alt="Logo"
                className="h-16 w-16 rounded-full border-2 border-white"
              />
              <p className="text-3xl mb-[4px] ml-4 font-bold">SymptoCure-{whichRole}</p>
            </Link>
          </div>
          <div id="div1" className="inline-flex ml-16 items-center">
            <Link
              to="/disease-detection"
              className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
            >
              <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                ➔
              </span>
              <span className="text-xl ml-4 font-semibold">Check Disease</span>
            </Link>

            <Link
              to="/consultancy"
              className="flex justify-center ml-14 items-center group hover:text-[#2EE9FF] transition-all duration-700"
            >
              <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                ➔
              </span>
              <span className="text-xl ml-4 font-semibold">
                Get Consultancy
              </span>
            </Link>
          </div>
        </div>
        {isSignedIn ? (
          <div className="flex mr-16 h-full items-center w-auto text-white">
              <Link
                to="/profile"
                className="flex justify-center items-center group mr-14 hover:text-[#2EE9FF] transition-all duration-700"
              >
                <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                  ➔
                </span>
                <span className="text-xl ml-4 font-semibold">Profile</span>
              </Link>
              <Link
                to="/home"
                onClick={handleLogout}
                className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
                >
                <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                  ➔
                </span>
                <span className="text-xl ml-4 font-semibold">Logout</span>
              </Link>
          </div>
        ) : (
          <div id="div1" className="inline-flex items-center text-white mr-16">
            <Link
              to="/login"
              className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
            >
              <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                ➔
              </span>
              <span className="text-xl ml-4 font-semibold">
                SignIn / SignUp
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

return(
  <>
      <div
        id="header"
        className="w-full h-24 sticky top-0 z-50 bg-[#16165C] border-b-[1px] border-opacity-65 border-white flex justify-between py-2 px-10 items-center"
      >
        <div className="w-9/12 h-full flex justify-start ml-16 text-white items-center">
          <div id="div1" className="inline-flex items-center w-62 space-x-2">
            <Link to="/home" className="flex items-center">
              <img
                src="./logo.png"
                alt="Logo"
                className="h-16 w-16 rounded-full border-2 border-white"
              />
              <p className="text-3xl mb-[4px] ml-4 font-bold">SymptoCure-{whichRole}</p>
            </Link>
          </div>
          <div id="div1" className="inline-flex ml-16 items-center">
            <Link
              to="/disease-detection"
              className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
            >
              <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                ➔
              </span>
              <span className="text-xl ml-4 font-semibold">Check Pateints</span>
            </Link>
          </div>
        </div>
        {isSignedIn ? (
          <div className="flex mr-16 h-full items-center w-auto text-white">
              <Link
                to="/profile"
                className="flex justify-center items-center group mr-14 hover:text-[#2EE9FF] transition-all duration-700"
              >
                <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                  ➔
                </span>
                <span className="text-xl ml-4 font-semibold">Profile</span>
              </Link>
              <Link
                to="/home"
                onClick={handleLogout}
                className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
                >
                <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                  ➔
                </span>
                <span className="text-xl ml-4 font-semibold">Logout</span>
              </Link>
          </div>
        ) : (
          <div id="div1" className="inline-flex items-center text-white mr-16">
            <Link
              to="/login"
              className="flex justify-center items-center group hover:text-[#2EE9FF] transition-all duration-700"
            >
              <span className="text-2xl transform transition-transform duration-700 group-hover:translate-x-3">
                ➔
              </span>
              <span className="text-xl ml-4 font-semibold">
                SignIn / SignUp
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
);

};

export default Header;
