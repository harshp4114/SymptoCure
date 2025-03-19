import "ldrs/helix"; // Ensure this path is valid
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    import("ldrs").then((ldrs) => {
      ldrs.register(); // Ensure the loader components are registered
    });
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  },[navigate]);
  return (
    <div className=" w-full h-full flex justify-center bg-[#16165C] items-center">
      <l-helix size="165" speed="1" color="white"></l-helix>
    </div>
  );
};

export default LoadingPage;
