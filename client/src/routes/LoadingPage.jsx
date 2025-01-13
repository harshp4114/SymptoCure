import "ldrs/helix"; // Ensure this path is valid
import { useNavigate } from "react-router-dom";
import useLoadingNavigate from "../hooks/useLoadingNavigate";

const LoadingPage = () => {
    
    const navigate=useNavigate();
    setTimeout(()=>{
        navigate("/home");
    },1500);
    return (
    <div className=" w-full h-full flex justify-center bg-black items-center">
      <l-helix size="165" speed="1" color="white"></l-helix>
    </div>
  );
};

export default LoadingPage;
