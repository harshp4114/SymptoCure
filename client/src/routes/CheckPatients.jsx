import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Cookies from "js-cookie";
import AppointmentCard from "../components/AppointmentCard";
import { io } from "socket.io-client";

const CheckPatients = () => {
  useAuth();
  const socket=io(BASE_URL);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);
  const token = Cookies.get("jwt-token");
  const [appointments, setAppointments] = useState([]);

  socket.on("changeAppointmentStatus",()=>{
    getAppointments();
  })

  const getAppointments = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/appointment/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(result);
      setAppointments(result?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
    getAppointments();
  }, [isAuthenticated, loading]);

  useEffect(() => {
    setLoading(false);
    socket.on("connect", () => {
      console.log("user connected");
    });
    return () => {
      socket.disconnect();
    }
  }, []);

  return loading ? (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <l-helix size="45" speed="2.5" color="black"></l-helix>
    </div>
  ) : (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Patient Appointments
          </h1>
          <p className="text-gray-600">
            Manage and view your upcoming appointments
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <p className="text-lg font-semibold">
                  {
                    appointments.filter(
                      (appointment) => appointment.status == "approved"
                    ).length
                  }
                </p>
                <p className="text-sm opacity-90">Total Patients</p>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <p className="text-lg font-semibold">
                  {
                    appointments
                      .filter((appointment) => appointment.status == "approved")
                      .filter((apt) => new Date(apt.date) > new Date()).length
                  }
                </p>
                <p className="text-sm opacity-90">Upcoming Appointments</p>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <p className="text-lg font-semibold">
                  {
                    appointments
                      .filter((appointment) => appointment.status == "approved")
                      .filter((apt) => new Date(apt.date) < new Date()).length
                  }
                </p>
                <p className="text-sm opacity-90">Past Appointments</p>
              </div>
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="p-6">
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {appointments
                  .filter((appointment) => appointment.status == "approved")
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((appointment) => (
                    <div className="transform transition-all duration-300 border hover:shadow-black/40 hover:shadow-xl cursor-pointer rounded-xl">
                      <AppointmentCard
                        key={appointment._id}
                        appointmentData={appointment}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
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
                  No Appointments Available
                </h3>
                <p className="text-gray-600">
                  When you schedule appointments, they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPatients;
