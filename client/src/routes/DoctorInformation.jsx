import React, { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";
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
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import { getSocket } from "../socket";
import { jwtDecode } from "jwt-decode";
import {
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  ChevronLeft,
  User,
  Building,
  GraduationCap,
} from "lucide-react";
import InfoCard from "../components/InfoCard";

const DoctorInformation = () => {
  useAuth();
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");
  const decode = jwtDecode(token);
  const [doctorInfo, setDoctorInfo] = useState({});
  const [patientId, setPatientId] = useState(decode.id);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);
  const location = useLocation();
  const doctorId = location.state.doctor;
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showPendingToast, setShowPendingToast] = useState(false);
  const [showExistToast, setShowExistToast] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [addressData, setAddressData] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getPatientData();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, [doctorInfo]);

  const getPatientData = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      navigate("/login");
    }
    getDoctor();
    const socket = getSocket();
    if (socket) {
      socket.on("change-doctor-data", () => {
        getDoctor();
      });
    }
  }, [isAuthenticated, loader]);

  const getDoctor = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorInfo(result?.data?.data);
      setPatientId(result?.data?.patientData?.id);
      const result2 = await axios.get(
        `${BASE_URL}/api/address/${result?.data?.data?.address}`
      );
      console.log("result2", result2);
      setAddressData(result2?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setLoader(false);
    if (showSuccessToast) {
      toast.success("Appointment Booked Successfully!");
      setShowSuccessToast(false);
    }
    if (showFailureToast) {
      toast.error("Failed to book the appointment. Please try again.");
      setShowFailureToast(false);
    }
    if (showExistToast) {
      toast.error("Appointment already exists with this doctor.");
      setShowExistToast(false);
    }
    if (showPendingToast) {
      toast.warn("Appointment pending with the doctor. Please wait");
      setShowPendingToast(false);
    }
  }, [showExistToast, showFailureToast, showSuccessToast, showPendingToast]);

  

  return loader ? (
    <Loader />
  ) : (
    <div className="min-h-[85.5vh] ">
      {showBooking && (
        <BookAppointment
          doctor={doctorInfo}
          patient={patientData}
          onClose={() => setShowBooking(false)}
          toggleSuccess={() => setShowSuccessToast(true)}
          toggleFailure={() => setShowFailureToast(true)}
          toggleExist={() => setShowExistToast(true)}
          togglePending={() => setShowPendingToast(true)}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div
        className={`w-full h-full bg-white overflow-hidden transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="relative h-[7.8rem] bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute -bottom-20 left-10">
            <div className="w-40 h-40 shadow-black/0 bg-gradient-to-r from-blue-700 to-blue-950 rounded-full flex items-center justify-center ring-8 ring-white shadow-2xl">
              <span className="text-5xl font-bold text-white">
                {doctorInfo?.fullName?.firstName?.[0]?.toUpperCase()}
                {doctorInfo?.fullName?.lastName?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-24 px-10 pb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dr. {doctorInfo?.fullName?.firstName}{" "}
                {doctorInfo?.fullName?.lastName}
              </h1>
              <p className="text-xl text-blue-700 font-medium">
                {doctorInfo?.specialization}
              </p>
            </div>
            <div className="flex space-x-4">
              <div className=" button-trigger button-move  w-36 h-12">
                <button
                  onClick={() => navigate("/consultancy")}
                  type="submit"
                  className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[7px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
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
              <div className=" button-trigger button-move  w-56 h-12">
                <button
                  onClick={() => setShowBooking(true)}
                  type="submit"
                  className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[7px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                >
                  {/* Default Text */}
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  <Calendar className="w-5 h-5 mr-2" /> Book Appointment
                  </span>

                  {/* Hover Text */}
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  <Calendar className="w-5 h-5 mr-2" /> Book Appointment
                  </span>
                </button>
              </div>
              
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon={Building}
              title="Hospital"
              value={capitalizeFirstLetter(doctorInfo?.hospital)}
            />
            <InfoCard
              icon={Calendar}
              title="Experience"
              value={`${doctorInfo?.experience} years`}
            />
            <InfoCard
              icon={GraduationCap}
              title="Qualifications"
              value={doctorInfo?.qualifications?.join(", ")}
            />
            <InfoCard icon={Mail} title="Email" value={doctorInfo?.email} />
            <InfoCard icon={Phone} title="Phone" value={doctorInfo?.phone} />
            <InfoCard icon={User} title="Gender" value={capitalizeFirstLetter(doctorInfo?.gender)} />
            <InfoCard
              icon={MapPin}
              title="Location"
              value={`${addressData?.city}, ${addressData?.state} - ${addressData?.zipCode}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInformation;
