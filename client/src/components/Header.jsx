import { useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  useEffect(() => {
    addHover();
  }, []);
  function addHover() {
    const headerDiv = document.querySelector("#header");
    const innerDivs = document.querySelectorAll("#div1");

    // Add event listeners to each `div1`
    innerDivs.forEach((div) => {
      div.addEventListener("mouseenter", () => {
        headerDiv.classList.add("hover:shadow-white");
      });
      div.addEventListener("mouseleave", () => {
        headerDiv.classList.remove("hover:shadow-white");
      });
    });
  }

  return (
    <>
      <div
        id="header"
        className="w-full h-20 z-50 fixed bg-black/[0.65] shadow-black  border-black/[0.2] text-white shadow-2xl hover:shadow-gray-400 border-[1px] flex backdrop-blur-2xl justify-between items-center transition-all duration-1000"
      >
        <div
          id="header"
          className="w-full h-20 z-50 fixed bg-black/[0.65] shadow-black  border-black/[0.2] text-white shadow-2xl hover:shadow-gray-400 border-[1px] flex backdrop-blur-2xl justify-between items-center transition-all duration-1000"
        >
          <div className="w-9/12 flex justify-between items-center">
            <div
              id="div1"
              className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/">logo</Link>
            </div>
            <div
              id="div1"
              className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/disease">Check Disease</Link>
            </div>
            <div
              id="div1"
              className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/consultancy">Get Consultancy</Link>
            </div>
            <div
              id="div1"
              className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
            >
              <Link to="/about">About</Link>
            </div>
          </div>
          <div
            id="div1"
            className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-3/6 w-2/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700"
          >
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
