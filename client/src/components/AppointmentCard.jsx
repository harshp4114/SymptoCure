import React, { useState, useEffect } from "react";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import { io } from "socket.io-client";
import { getSocket } from "../socket";
import { Link } from "react-router-dom";

const AppointmentCard = (props) => {
  const appointment = props.appointmentData;
  const [chat, setChat] = useState(null);
  // console.log("apppointment card data", appointment);
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState({});
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);

  const getUserData = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(
        `${BASE_URL}/api/patient/${appointment.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(result?.data?.data);

      const addressResult = await axios.get(
        `${BASE_URL}/api/address/${result?.data?.data?.address}`
      );
      setAddress(addressResult?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getChatIdBySenderReceiverId = async () => {
    dispatch(showLoader());
    // console.log("appointment", appointment, token,appointment.userId,appointment.doctorId);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/chatId`,
        {
          patientId: appointment.userId,
          doctorId: appointment.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("chat ID response", response);
      setChat(response?.data?.data);
    } catch (err) {
      console.log("error in create chat", err);
    } finally {
      dispatch(hideLoader());
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if the patient is not authenticated
    }

    getUserData();
    getChatIdBySenderReceiverId();
    const socket = getSocket();
    if (socket) {
      socket.on("change-patient-data", () => {
        getUserData();
      });
    }
  }, [isAuthenticated]);

  return (
    <Link
      to="/profile"
      state={{userData:userData,chat:chat}}
      key={appointment._id}
      className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 transition-transform transform "
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {capitalizeFirstLetter(userData.fullName?.firstName)} {capitalizeFirstLetter(userData.fullName?.lastName)}
      </h3>
      <p className="text-gray-600">Age: {userData.age}</p>
      <p className="text-gray-600">Gender: {capitalizeFirstLetter(userData.gender)}</p>
      <p className="text-gray-600">Email: {capitalizeFirstLetter(userData.email)}</p>
      <p className="text-gray-600">Phone: {userData.phone}</p>
      <div className="w-full mt-4 p-4 bg-blue-100 rounded-lg">
        <p className="text-gray-800 font-medium">
          Appointment Date:{" "}
          {new Date(appointment.date).toLocaleDateString("en-GB")}
        </p>
        <p className="text-gray-800 font-medium">
          Disease: {appointment?.disease || "viral fever"}
        </p>
        <p className="text-gray-800 font-medium">
          Reason: {appointment.reason}
        </p>
      </div>
      <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-800 font-medium">
          Address: {address.address}, {address.city}, {address.state},{" "}
          {address.country}, {address.zipCode}
        </p>
      </div>
    </Link>
  );
};

export default AppointmentCard;
