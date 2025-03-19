import { helix } from "ldrs";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  helix.register();
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/home");
  }, 1500);
  return (
    <div className=" w-full h-full flex justify-center bg-[#16165C] items-center">
      <l-helix size="165" speed="1" color="white"></l-helix>
    </div>
  );
};

export default LoadingPage;
