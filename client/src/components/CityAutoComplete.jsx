import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const CityAutocomplete = (props) => {
  const [suggestions, setSuggestions] = useState([]);
  const [validCity, setValidCity] = useState(false);
  const {setFieldValue,values}=useFormikContext();
  const [query, setQuery] = useState(values?.city || "");
  // console.log("CityAutocomplete values:", values); // Debug log
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setValidCity(false); // Reset selection

    if (value.length > 1) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${value}&format=json&addressdetails=1`
      );
      const data = await response.json();

      // Sort: Prioritize cities starting with the input
      const sortedCities = data
        .sort((a, b) => {
          const aStarts = a.display_name.toLowerCase().startsWith(value.toLowerCase());
          const bStarts = b.display_name.toLowerCase().startsWith(value.toLowerCase());
          if (aStarts === bStarts) return a.display_name.localeCompare(b.display_name); // Alphabetical if same match type
          return aStarts ? -1 : 1; // Prioritize exact matches first
        })
        .slice(0, 5); // Limit to 5 results

      setSuggestions(sortedCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (city) => {
    // console.log("handleSelect triggered:", city.display_name); // Debug log
    setFieldValue("city", city?.name);
    // console.log("City:", city); // Debug log
    setFieldValue("state", city.address?.state || city.address?.town || "");
    setFieldValue("country", city.address?.country || "");
    setFieldValue("zipCode", city.address?.postcode || city.address?.["ISO3166-2-lvl4"] || "342645");
    const values={
      city: city?.name,
      state: city.address?.state || city.address?.town || "",
      country: city.address?.country || "",
      zipCode: city.address?.postcode || city.address?.["ISO3166-2-lvl4"] || "342645",
    }
    if(props.from=="patient"){
      props.setPatientStep2Data(values);
    }else if(props.from=="doctor"){
      props.setDoctorStep2Data(values);
    }
    setQuery(city?.name);
    setValidCity(true);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!validCity && suggestions.length == 0) {
        // console.log("handleBlur triggered", validCity); // Debug log
        setQuery("");
        setFieldValue("city", "");
      }
      setSuggestions([]);
    }, 1000); // Small delay to allow clicks
  };

  return (
    <div className="relative">
      <input
        type="text"
        name="city"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Current City*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl my-2 p-2 w-full bg-[#232269]"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-lg">
          {suggestions.map((city) => (
            <li
              key={city.place_id}
              onClick={(e) => {
                e.stopPropagation();
                // console.log("Clicked on:", city.display_name); // Debug log
                handleSelect(city);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {city.display_name}
            </li>
          ))}
        </ul>
      )}
      <ErrorMessage
        name="city"
        component="div"
        className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
      />
      <Field
        type="text"
        name="state"
        placeholder="State*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
        disabled
      />
      <ErrorMessage
        name="state"
        component="div"
        className="text-[#2BB6DB] text-md font-semibold w-full my-2"
      />

      <Field
        type="text"
        name="country"
        placeholder="Country*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
        disabled
      />
      <ErrorMessage
        name="country"
        component="div"
        className="text-[#2BB6DB] text-md font-semibold w-full my-2"
      />

      <Field
        type="text"
        name="zipCode"
        placeholder="ZIP Code*"
        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
        disabled
      />
      <ErrorMessage
        name="zipCode"
        component="div"
        className="text-[#2BB6DB] text-md font-semibold w-full my-2"
      />
    </div>
  );
};

export default CityAutocomplete;
