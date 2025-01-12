import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/slices/signInSlice";

const Header = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.signin.isSignedIn);

  const handleLogout = () => {
    console.log(Cookies.get("jwt-token"));
    if (Cookies.get("jwt-token")) {
      Cookies.remove("jwt-token");
      dispatch(toggle());
    }
  };

  return (
    <>
      <div
        id="header"
        className="w-full h-24 z-50 fixed bg-black  border-black/[0.2] text-white shadow-2xl  border-[1px] flex backdrop-blur-2xl justify-between items-center transition-all duration-1000"
      >
        <div className="w-9/12 flex justify-between items-center">
          <div
            id="div1"
            className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-3/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/" className="flex items-center space-x-4">
              <img src="./logo.png" className="w-14 rounded-full"></img>
              <p className="text-2xl font-FiraCode">SymptoCure</p>
            </Link>
          </div>
          <div
            id="div1"
            className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-3/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/disease">Check Disease</Link>
          </div>
          <div
            id="div1"
            className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-3/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/consultancy">Get Consultancy</Link>
          </div>
          <div
            id="div1"
            className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-3/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/about">About</Link>
          </div>
        </div>
        {isSignedIn ? (
          <>
            <div
              id="div1"
              className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/profile">Profile</Link>
            </div>
            <div
              id="div1"
              className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </>
        ) : (
          <div
            id="div1"
            className="text-xl font-FiraCode font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/login">SignIn / SignUp</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
