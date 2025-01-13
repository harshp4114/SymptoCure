import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoadingNavigate from "../hooks/useLoadingNavigate";
// import ldrs from 'ldrs/ring';   

const DoctorInformation = (props) => {
  useAuth(); // Trigger the authentication logic (runs on mount)
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux

  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if the user is not authenticated
    }
  }, [isAuthenticated, loader]); // Add dependencies to avoid unnecessary re-renders

  useEffect(() => {
    setLoader(false);
  }, []);

  return loader ? (
    <div>Loading</div>
  ) : (
    <div className="absolute mt-24 flex justify-center items-center">
      Hello, I am doctor information {props?.doctor?.specialization}
    </div>
  );
};

export default DoctorInformation;
