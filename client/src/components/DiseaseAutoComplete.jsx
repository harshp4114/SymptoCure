import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { symptomsData } from "../utils/constants";

const DiseaseAutoComplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const { setFieldValue, values } = useFormikContext();

  const selectedSymptoms = values.symptoms||[];
    

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filteredSymptoms = symptomsData
        .filter((symptom) =>
          symptom.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(value.toLowerCase());
          const bStarts = b.toLowerCase().startsWith(value.toLowerCase());
          if (aStarts === bStarts) return a.localeCompare(b);
          return aStarts ? -1 : 1;
        })
        .slice(0, 7);
      setSuggestions(filteredSymptoms);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (symptom) => {
    // console.log("cliked select")
    if (!selectedSymptoms.includes(symptom)) {
      setFieldValue("symptoms", [...selectedSymptoms, symptom]);
    }

    setQuery("");
    setSuggestions([]);
  };

  const handleRemove = (symptom) => {
    setFieldValue("symptoms", selectedSymptoms.filter((s) => s !== symptom));
  };

  return (
    <div className="min-h-40 h-fit">
      <div className="flex flex-wrap gap-2 content-start border-[1px] items-start border-opacity-45 px-4 text-2xl text-[#9dc1fc] min-h-40 h-fit placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] py-4 rounded-xl my-2 w-full bg-[#232269]">
        {selectedSymptoms.map((symptom) => (
          <div
            key={symptom}
            className="flex h-10 items-center bg-blue-500 text-xl text-white rounded-xl px-3 py-1"
          >
            {symptom}
            <button
              type="button"
              className="ml-2 w-3 text-2xl font-bold cursor-pointer"
              onClick={() => handleRemove(symptom)}
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={selectedSymptoms.length ? "" : "Symptoms You Are Experiencing*"}
          className="bg-transparent outline-none  flex-grow placeholder-[#9dc1fc] text-[#9dc1fc]"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute max-h-48 overflow-y-auto z-10 w-full bg-white border rounded shadow-lg">
          {suggestions.map((symptom) => (
            <li
              key={symptom}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(symptom);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {symptom}
            </li>
          ))}
        </ul>
      )}
      <ErrorMessage
        name="symptoms"
        component="div"
        className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-0"
      />
    </div>
  );
};

export default DiseaseAutoComplete;
