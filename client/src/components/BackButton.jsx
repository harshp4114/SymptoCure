import React from "react";
import { useFormikContext } from "formik";

const BackButton = ({ setDoctorStep, setDoctorStep3Data }) => {
  const { values } = useFormikContext();

  const handleBack = () => {
    // console.log("bb",values)
    setDoctorStep3Data(values); // Save the form values
    setDoctorStep(2); // Then go back to step 2
  };

  return (
    <div className="relative top-2 w-4/12 h-16 mt-2">
      <button
        type="button"
        onClick={handleBack}
        className="bg-[#E6E4FD] p-2 text-[#232269] text-lg border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
      >
        {/* Default Text */}
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
          Back
        </span>
        {/* Hover Text */}
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
          Back
        </span>
      </button>
    </div>
  );
};
export default BackButton;
