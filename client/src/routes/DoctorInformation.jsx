import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import BookAppointment from "../components/BookAppointment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const DoctorInformation = () => {
  useAuth(); // Trigger the authentication logic (runs on mount)
  const dispatch = useDispatch();
  // dispatch(showLoader());
  const [doctorInfo, setDoctorInfo] = useState({});
  const [patientId, setPatientId] = useState("");
  const [loader, setLoader] = useState(true); // Synchronize the authentication check
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux
  const location = useLocation();
  const doctorId = location.state.doctor;
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showExistToast, setShowExistToast] = useState(false);
  const [patientData, setPatientData] = useState({});
  const token = Cookies.get("jwt-token");

  useEffect(() => {
    if (showBooking) {
      getPatientData();
    }
  }, [showBooking]);

  const getPatientData = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("patient data fetched when we press book app",result)
      setPatientData(result?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if the patient is not authenticated
    }
    // console.log("func claling");
    getDoctor();
  }, [isAuthenticated, loader]);

  const getDoctor = async () => {
    dispatch(showLoader());
    // console.log("workding");
    try {
      const result = await axios.get(`${BASE_URL}/api/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("res", result);
      setDoctorInfo(result?.data?.data);
      setPatientId(result?.data?.patientData?.id);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setLoader(false);
    // console.log(doctorInfo);
    //console.log("hiiiiii");
    // toast.success("Appointment Booked Successfully!");

    if (showSuccessToast) {
      //console.log("hiiiiii from success",showSuccessToast);

      toast.success("Appointment Booked Successfully!");
      setShowSuccessToast(false);
    }
    if (showFailureToast) {
      //console.log("hiiiiii fsail",showFailureToast);

      toast.error("Failed to book the appointment. Please try again.");
      setShowFailureToast(false);
    }
    if (showExistToast) {
      //console.log("hiiiiii from exist",showExistToast);

      toast.error("Appointment already exists.");
      setShowExistToast(false);
    }
  }, [showExistToast, showFailureToast, showSuccessToast]);

  return loader ? (
    <Loader />
  ) : (
    <div className="flex flex-col h-[86vh] items-center bg-gradient-to-r from-blue-600 to-blue-600 ">
      {showBooking && (
        <BookAppointment
          doctor={doctorInfo}
          patient={patientData}
          onClose={() => setShowBooking(false)}
          toggleSuccess={() => setShowSuccessToast(true)}
          toggleFailure={() => setShowFailureToast(true)}
          toggleExist={() => setShowExistToast(true)}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-7/12 h-full bg-white shadow-2xl shadow-blue-950">
        <div className="h-10/12 w-full flex">
          <div className="flex w-1/3 h-full justify-center items-start pt-16">
            {/* Profile Picture Placeholder */}
            <div className="w-36 h-36 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">
                {doctorInfo?.fullName?.firstName[0]}
                {doctorInfo?.fullName?.lastName[0]}
              </span>
            </div>
          </div>
          <div className="h-full flex flex-wrap content-start pt-16 pl-4 w-2/3">
            {/* Doctor's Information */}
            <h1 className="w-full text-3xl font-bold mb-2 text-gray-800">
              Dr. {doctorInfo?.fullName?.firstName}{" "}
              {doctorInfo?.fullName?.lastName}
            </h1>
            <p className="w-full text-lg mb- text-gray-600 mt-2">
              <strong>Specialization:</strong> {doctorInfo?.specialization}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Experience:</strong> {doctorInfo?.experience} years
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Hospital:</strong> {doctorInfo?.hospital}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Email:</strong> {doctorInfo?.email}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Phone:</strong> {doctorInfo?.phone}
            </p>

            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Available Days:</strong>{" "}
              {doctorInfo?.availableDays?.join(", ")}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Available Time:</strong>{" "}
              {doctorInfo?.availableTime?.start} -{" "}
              {doctorInfo?.availableTime?.end}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Patients Per Day:</strong> {doctorInfo?.patientsPerDay}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Qualifications:</strong>{" "}
              {doctorInfo?.qualifications?.join(", ")}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Gender:</strong> {doctorInfo?.gender}
            </p>
            <p className="w-full text-lg text-gray-600 mt-1">
              <strong>Rating:</strong> {doctorInfo?.rating} (No reviews yet)
            </p>
          </div>
        </div>
        {/* Action Buttons */}

        <div className="flex justify-center mt-12">
          <div className="mr-8 flex justify-center items-center rounded-lg ring-2 hover:bg-blue-300  ring-blue-300 hover:ring-[6px] transition-all duration-700 hover:ring-blue-900 bg-blue-200 w-56 h-10">
            <Link
              to="/consultancy"
              className="flex items-center text-blue-900 font-medium transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <h2 className="mr-2 font-Gilroy">Back to Consultancy</h2>
            </Link>
          </div>
          <button
            onClick={() => {
              setShowBooking(true);
            }}
            className="font-Gilroy text-blue-900 flex justify-center items-center rounded-lg ring-2 hover:bg-blue-300  ring-blue-300 hover:ring-[6px] transition-all duration-700 hover:ring-blue-900 bg-blue-200 w-56 h-10"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorInformation;
