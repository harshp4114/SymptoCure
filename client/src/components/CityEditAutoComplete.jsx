import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";

const CityEditAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [validCity, setValidCity] = useState(false);
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext();
  const [query, setQuery] = useState(values.city);
  const [hasUserEdited,setHasUserEdited]=useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce API call with useEffect
  useEffect(() => {
    if (!hasUserEdited || !query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${query}&format=json&addressdetails=1`
        );
        const data = await response.json();

        const sortedCities = data
          .sort((a, b) => {
            const aStarts = a.display_name
              .toLowerCase()
              .startsWith(query.toLowerCase());
            const bStarts = b.display_name
              .toLowerCase()
              .startsWith(query.toLowerCase());
            return aStarts === bStarts
              ? a.display_name.localeCompare(b.display_name)
              : aStarts
              ? -1
              : 1;
          })
          .slice(0, 5);

        setSuggestions(sortedCities);
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setLoading(false);
      }
    }, 800); 

    return () => clearTimeout(timer); // Cleanup previous timer if input changes
  }, [query]);

  const handleSelect = (city) => {
    const state = city.address?.state || "";
    const country = city.address?.country || "";
    const zipCode =
      city.address?.postcode || city.address?.["ISO3166-2-lvl4"] || "";

    setFieldValue("city", city.address?.city);
    setFieldValue("state", state);
    setFieldValue("country", country);
    setFieldValue("zipCode", zipCode);

    setQuery(city.address?.city);
    setValidCity(true);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!validCity && suggestions.length === 0) {
        setQuery("");
        setFieldValue("city", "");
      }
      setSuggestions([]);
      setFieldTouched("city", true);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* City Input */}
      <div className="relative">
        <label className="block font-medium mb-1">City</label>
        <input
          type="text"
          name="city"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setValidCity(false);
            setHasUserEdited(true);
          }}
          onBlur={handleBlur}
          placeholder="City"
          className="border p-2 hover:border-black transition-all duration-500 rounded w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow-lg">
            {suggestions.map((city) => (
              <li
                key={city.place_id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(city);
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {city.display_name}
              </li>
            ))}
          </ul>
        )}
        {/* City Error Message */}
        {touched.city && errors.city && (
          <p className="text-red-500 text-sm">{errors.city}</p>
        )}
      </div>

      {/* State Input */}
      <div>
        <label className="block font-medium mb-1">State</label>
        <input
          type="text"
          name="state"
          value={values.state}
          readOnly
          className="w-full p-2 border rounded cursor-default bg-gray-100"
        />
      </div>

      {/* Country Input */}
      <div>
        <label className="block font-medium mb-1">Country</label>
        <input
          type="text"
          name="country"
          value={values.country}
          readOnly
          className="w-full p-2 border rounded cursor-default bg-gray-100"
        />
      </div>

      {/* Zip Code Input */}
      <div>
        <label className="block font-medium mb-1">Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={values.zipCode}
          readOnly
          className="w-full p-2 border rounded cursor-default bg-gray-100"
        />
      </div>
    </div>
  );
};

export default CityEditAutocomplete;
