import { Helix } from "ldrs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  }, [navigate]);
  return (
    <div className=" w-full h-full flex justify-center bg-[#16165C] items-center">
      <Helix size="165" speed="1" color="white"></Helix>
    </div>
  );
};

export default LoadingPage;
