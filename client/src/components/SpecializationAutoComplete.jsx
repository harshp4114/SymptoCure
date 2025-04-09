import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { doctorSpecializations } from "../utils/constants";

const SpecializationAutoComplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [validSpecialization, setValidSpecialization] = useState(false);
  const { setFieldValue } = useFormikContext();

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setValidSpecialization(false); // Reset selection

    if (value.length > 0) {
        const filteredSpecializations = doctorSpecializations
        .filter((speciality) => speciality.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(value.toLowerCase());
          const bStarts = b.toLowerCase().startsWith(value.toLowerCase());
          if (aStarts === bStarts) return a.localeCompare(b); // Sort alphabetically if equal match type
          return aStarts ? -1 : 1; // Prioritize items that start with the query
        })
        .slice(0, 7);
      setSuggestions(filteredSpecializations);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (speciality) => {
    // console.log("handleSelect triggered:", speciality.display_name); // Debug log
    setFieldValue("specialization", speciality);
    // console.log("City:", speciality); // Debug log
    setQuery(speciality);
    setValidSpecialization(true);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!validSpecialization && suggestions.length==0) {
        console.log("handleBlur triggered", validSpecialization); // Debug log
        setQuery("");
        setFieldValue("specialization", "");
      }
      setSuggestions([]);
    }, 1000); // Small delay to allow clicks
  };

  return (
    <div className="relative">
      <input
        type="text"
        name="specialization"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Your specialization*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl my-2 p-2 w-full bg-[#232269]"
      />
      {suggestions.length > 0 && (
        <ul className="absolute max-h-48 overflow-y-auto z-10 w-full bg-white border rounded shadow-lg">
          {suggestions.map((speciality) => (
            <li
              key={speciality}
              onClick={(e) => {
                e.stopPropagation();
                // console.log("Clicked on:", speciality); // Debug log
                handleSelect(speciality);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {speciality}
            </li>
          ))}
        </ul>
      )}
      <ErrorMessage
        name="specialization"
        component="div"
        className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
      />
      {/* <Field
        type="text"
        name="specialization"
        placeholder="Your specialization*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
      /> */}
      
    </div>
  );
};

export default SpecializationAutoComplete;
