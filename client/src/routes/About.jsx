import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const About = () => {
  useEffect(() => {
    // useAuth();
  }, []);
  return <div className="bg-red-600 w-full h-full absolute mt-24">ABOUT</div>;
};

export default About;
