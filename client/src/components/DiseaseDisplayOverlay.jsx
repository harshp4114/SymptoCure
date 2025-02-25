import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DiseaseDisplayOverlay = (props) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(10);
    useEffect(() => {
        console.log("chekcing props",props,props.specialization);
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            navigate("/consultancy",{
                state: { specialization: props.specialization },
            }); // Navigate after countdown ends
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup function to clear interval
    }, [navigate]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="w-6/12 h-[60%] bg-gradient-to-r from-[#403CD5] to-[#16165C] rounded-3xl flex flex-wrap justify-start items-start px-10 py-10">
        {/* Content inside overlay */}
        <div className="w-full pr-10 min-h-1/3">
          <div className="w-full flex h-full  item-center ml-3">
            <l-cardio
              size="130"
              stroke="7"
              speed="1.9"
              color="white"
            ></l-cardio>
            {/* <h2 className="font-Gilroy text-3xl ml-10 -translate-y-3 font-bold text-white">
              Knowing the problem is the first step toward the solution. Now,
              let’s work toward your cure!
            </h2> */}
          </div>
        </div>

        <div className="w-full h-2/3 flex items-center content-start justify-start flex-wrap">
          <h2 className="text-xl mt-1 font-Gilroy  text-white">
            After analyzing your symptoms, our system has identified a potential
            diagnosis:
          </h2>
          <h2 className="text-3xl mt-6 font-Gilroy font-bold text-white">
            Disease: {props.disease || "Diarrheji"}
          </h2>
          <h2 className="text-3xl mt-1 font-Gilroy font-bold text-white">
            Specialization for this disease: {props.specialization || "Diarrheji"}
          </h2>
          <h2 className="text-xl mt-9 font-Gilroy font-old text-white">
            Redirecting you to the doctor consultancy page in {time} seconds...
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDisplayOverlay;
