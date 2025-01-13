import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const Body = () => {
  
  useAuth();
  return (
    <div className="w-full h-full absolute mt-24 bg-zinc-300">
      hello form body
    </div>
  );
};

export default Body;
