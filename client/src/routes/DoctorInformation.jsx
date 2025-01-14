import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import BookAppointment from "../components/BookAppointment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set } from "date-fns";

const DoctorInformation = () => {
  useAuth(); // Trigger the authentication logic (runs on mount)
  const [loader, setLoader] = useState(true); // Synchronize the authentication check
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux
  const location = useLocation();
  const doctorInfo = location.state.doctor;
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showExistToast, setShowExistToast] = useState(false);

  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if the user is not authenticated
    }
  }, [isAuthenticated, loader]);

  useEffect(() => {
    setLoader(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
      {showBooking && (
        <BookAppointment
          doctor={doctorInfo}
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
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/consultancy"
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back to Consultancy
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Profile Picture Placeholder */}
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">
              {doctorInfo?.fullName?.firstName[0]}
              {doctorInfo?.fullName?.lastName[0]}
            </span>
          </div>

          {/* Doctor's Information */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dr. {doctorInfo?.fullName?.firstName}{" "}
              {doctorInfo?.fullName?.lastName}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Specialization:</strong> {doctorInfo?.specialization}
            </p>
            <p className="text-lg text-gray-600 mt-1">
              <strong>Experience:</strong> {doctorInfo?.experience} years
            </p>
            <p className="text-lg text-gray-600 mt-1">
              <strong>Hospital:</strong> {doctorInfo?.hospital}
            </p>
            <p className="text-lg text-gray-600 mt-1">
              <strong>Email:</strong> {doctorInfo?.email}
            </p>
            <p className="text-lg text-gray-600 mt-1">
              <strong>Phone:</strong> {doctorInfo?.phone}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg text-gray-600">
              <strong>Available Days:</strong>{" "}
              {doctorInfo?.availableDays.join(", ")}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Available Time:</strong>{" "}
              {doctorInfo?.availableTime?.start} -{" "}
              {doctorInfo?.availableTime?.end}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Patients Per Day:</strong> {doctorInfo?.patientsPerDay}
            </p>
          </div>
          <div>
            <p className="text-lg text-gray-600">
              <strong>Qualifications:</strong>{" "}
              {doctorInfo?.qualifications.join(", ")}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Gender:</strong> {doctorInfo?.gender}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Rating:</strong> {doctorInfo?.rating} (No reviews yet)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setShowBooking(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorInformation;
