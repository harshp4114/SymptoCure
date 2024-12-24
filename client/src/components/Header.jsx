const Header = () => {
  return (
    <>
      <div className="w-6/12 fixed top-2 left-1/4 right-auto p-[6px] z-50 h-16 mx-auto my-6 bg-gradient-to-r from-white/[0.2] shadow-black via-black/[0.2] to-white/[0.2] border-black/[0.2] text-white shadow-2xl hover:shadow-white border-[1px] rounded-full flex backdrop-blur-2xl justify-between items-center transition-all duration-1000">
        <div className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-5/6 w-4/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700">Home</div>
        <div className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-5/6 w-4/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700">Symptoms</div>
        <div className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-5/6 w-4/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700">Doctors</div>
        <div className="text-xl font-NumFont font-extralight flex justify-center items-center cursor-pointer h-5/6 w-4/12 rounded-full text-center m-2 p-3 hover:bg-gray-200/[0.8] ease-in-out hover:text-black hover:font-normal transition-all duration-700">About</div>

      </div>
    </>
  );
};

export default Header;
