// components/Loader.js
import React from "react";
import "ldrs/cardio";

const Loader = () => (
  <div className="fixed  inset-0 flex items-center justify-center bg-black  z-50">
    <l-cardio size="135" stroke="9" speed="1" color="white"></l-cardio>
  </div>
);

export default Loader;
