import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppointmentPatient from "../components/AppointmentPatient";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Cookies from "js-cookie";
import useAuth from "../hooks/useAuth";
import { getSocket } from "../socket";

const CheckAppointments = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'confirmed', 'rejected'
  const [appointments, setAppointments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [particularAppointment, setParticularAppointment] = useState([]);
  const [handleChange,setHandleChange]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Empty appointments array for the skeleton UI
  // const appointmentRequests = [];

  // const filteredAppointments = () => {
  //   if (filter === "all") return appointmentRequests;
  //   return appointmentRequests.filter((apt) => apt.status === filter);
  // };

  const getAllAppointments = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/appointment/doctor/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt-token")}`,
        },
      });
      // console.log("result", result);
      setAppointments(result?.data?.data);
      setParticularAppointment(result?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(()=>{
    const socket=getSocket();
    // console.log("socket in check apppieowi",socket);
    if(socket){
      socket.on("appointment-reload",()=>{
        // console.log("appointment-reload socket called on doctor");
        getAllAppointments();
      })
    }
  },[])

  useEffect(() => {
    setPendingCount(
      appointments.filter((apt) => apt.status === "pending").length
    );
    setConfirmedCount(
      appointments.filter((apt) => apt.status === "approved").length
    );
    setRejectedCount(
      appointments.filter((apt) => apt.status === "rejected").length
    );
  }, [appointments]);

  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
    getAllAppointments();
  }, [isAuthenticated, loading,handleChange]);

  useEffect(() => {
    setLoading(false);
    
  }, []);

  return loading ? (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Loader />
    </div>
  ) : (
    <div className="bg-gradient-to-br h- from-blue-50 to-indigo-50 min-h-[86.8vh] max-h-fit py-8 px-4">
      <div className="max-w-7xl mx-auto">
       
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
              <div
                className={`text-center p-4 bg-white hover:ring-2 hover:ring-white transition-all duration-300 bg-opacity-10 rounded-lg backdrop-blur-sm cursor-pointer ${
                  filter === "all" ? "ring-2 ring-white" : ""
                }`}
                onClick={() => {
                  setFilter("all");
                  setParticularAppointment(appointments);
                }}
              >
                <p className="text-lg font-semibold">{appointments?.length}</p>
                <p className="text-sm opacity-90">All Requests</p>
              </div>
              <div
                className={`text-center p-4 bg-white hover:ring-2 hover:ring-white transition-all duration-300 bg-opacity-10 rounded-lg backdrop-blur-sm cursor-pointer ${
                  filter === "pending" ? "ring-2 ring-white" : ""
                }`}
                onClick={() => {
                  setFilter("pending");
                  setParticularAppointment(
                    appointments.filter((apt) => apt.status === "pending")
                  );
                }}
              >
                <p className="text-lg font-semibold">{pendingCount}</p>
                <p className="text-sm opacity-90">Pending</p>
              </div>
              <div
                className={`text-center p-4 bg-white hover:ring-2 hover:ring-white transition-all duration-300 bg-opacity-10 rounded-lg backdrop-blur-sm cursor-pointer ${
                  filter === "approved" ? "ring-2 ring-white" : ""
                }`}
                onClick={() => {
                  setFilter("approved");
                  setParticularAppointment(
                    appointments.filter((apt) => apt.status === "approved")
                  );
                }}
              >
                <p className="text-lg font-semibold">{confirmedCount}</p>
                <p className="text-sm opacity-90">Approved</p>
              </div>
              <div
                className={`text-center p-4 bg-white hover:ring-2 hover:ring-white transition-all duration-300 bg-opacity-10 rounded-lg backdrop-blur-sm cursor-pointer ${
                  filter === "rejected" ? "ring-2 ring-white" : ""
                }`}
                onClick={() => {
                  setFilter("rejected");
                  setParticularAppointment(
                    appointments.filter((apt) => apt.status === "rejected")
                  );
                }}
              >
                <p className="text-lg font-semibold">{rejectedCount}</p>
                <p className="text-sm opacity-90">Rejected</p>
              </div>
            </div>
          </div>

          {/* Filter Indicator */}
          <div className="px-6 pt-6">
            <div className="flex items-center">
              <h3 className="font-medium text-lg text-gray-700">
                Showing:{" "}
                {filter === "all"
                  ? "All Requests"
                  : `${
                      filter.charAt(0).toUpperCase() + filter.slice(1)
                    } Requests`}
              </h3>
            </div>
          </div>

          {/* Empty State */}

          <div className="p-6 w-full">
            {particularAppointment.length === 0 ? (
              <div className="text-center p-6">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mt-8 mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No {filter !== "all" ? `${filter}` : ""} Appointment Requests
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "When patients request appointments, they will appear here."
                    : `No ${filter} appointment requests at the moment.`}
                </p>
              </div>
            ) : (
              <div className=" w-full grid grid-cols-3 gap-10">
                {particularAppointment
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                .map((appointment) => (
                  <AppointmentPatient
                    key={appointment._id}
                    data={appointment}
                    change={setHandleChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckAppointments;
