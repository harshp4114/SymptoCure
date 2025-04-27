import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { doctorQualifications } from "../utils/constants";

const QualificationAutoComplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const { setFieldValue, values } = useFormikContext();

  const selectedQualifications = values?.qualifications
    ? values?.qualifications.split(", ").filter((q) => q.trim() !== "")
    : [];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filteredQualifications = doctorQualifications
        .filter((qualification) =>
          qualification.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(value.toLowerCase());
          const bStarts = b.toLowerCase().startsWith(value.toLowerCase());
          if (aStarts === bStarts) return a.localeCompare(b);
          return aStarts ? -1 : 1;
        })
        .slice(0, 7);
      setSuggestions(filteredQualifications);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (qualification) => {
    if (!selectedQualifications.includes(qualification)) {
      const updatedQualifications = [...selectedQualifications, qualification];
      setFieldValue("qualifications", updatedQualifications.join(", "));
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleRemove = (qualification) => {
    const updatedQualifications = selectedQualifications.filter(
      (q) => q !== qualification
    );
    setFieldValue("qualifications", updatedQualifications.join(", "));
  };

  return (
    <div className="relative">

      <div className="flex flex-wrap gap-2 border-[1px] border-opacity-45 px-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] py-4 rounded-xl my-2 w-full bg-[#232269]">
        {selectedQualifications.map((qualification) => (
          <div
            key={qualification}
            className="flex h-10 items-center bg-blue-500 text-xl text-white rounded-xl px-3 py-1"
          >
            {qualification}
            <button
              type="button"
              className="ml-2 w-3 text-2xl font-bold cursor-pointer"
              onClick={() => handleRemove(qualification)}
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={selectedQualifications.length ? "" : "Your Qualifications*"}
          className="bg-transparent outline-none flex-grow placeholder-[#9dc1fc] text-[#9dc1fc]"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute max-h-48 overflow-y-auto z-10 w-full bg-white border rounded shadow-lg">
          {suggestions.map((qualification) => (
            <li
              key={qualification}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(qualification);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {qualification}
            </li>
          ))}
        </ul>
      )}
      <ErrorMessage
        name="qualifications"
        component="div"
        className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
      />
    </div>
  );
};

export default QualificationAutoComplete;
