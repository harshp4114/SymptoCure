import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedin, userLoggedout } from "../redux/slices/signInSlice";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "ldrs/helix"; // Ensure this path is valid
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import { Formik, Form, Field, ErrorMessage } from "formik";
import editUserValidationSchema from "../yupValidators/editUserValidationSchema";
import CityEditAutocomplete from "../components/CityEditAutoComplete";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import editDoctorValidationSchema from "../yupValidators/editDoctorValidationSchema";
import { Pencil } from "lucide-react";
import UserProfileAppointmentCard from "../components/UserProfileAppointmentCard";
import { Calendar, Clock, Plus } from "lucide-react";
import { io } from "socket.io-client";
import { getSocket } from "../socket";
import DoctorChatInterface from "../components/DoctorChatInterface";
import PatientChatInterface from "../components/PatientChatInterFace";

const Profile = () => {
  useAuth(); // Trigger the authentication logic (runs on mount)
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editUserProfile, setEditUserProfile] = useState(false);
  const [editDoctorProfile, setEditDoctorProfile] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const location = useLocation();
  console.log("profileData", profileData);
  // console.log("location",location?.state?.showChat);
  const [selectedAppointmentInfo, setSelectedAppointmentInfo] = useState(
    location?.state?.showChat
  );
  if (selectedAppointmentInfo == undefined) {
    setSelectedAppointmentInfo(true);
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");
  // const decoded = jwtDecode(token);
  // console.log("token",token)
  // console.log("decoded",decoded)
  const role = localStorage.getItem("role");
  // console.log(role);

  const handleUserProfileUpdate = async (values) => {
    // console.log("func claelldd")
    // console.log("values", values);
    dispatch(showLoader());
    try {
      // const token = Cookies.get("jwt-token");
      const decoded = jwtDecode(token);
      // console.log("decoded",decoded);
      const result = await axios.put(
        `${BASE_URL}/api/patient/${decoded.id}`,
        values
      );
      // console.log("result",result);
      getUser();
      setEditUserProfile(false);
      const socket = getSocket();
      if (socket) {
        socket.emit("patient-profile-updated");
      }
      toast.success("Profile updated successfully!!");
    } catch (error) {
      console.log(error);
      setEditUserProfile(false);
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleDoctorProfileUpdate = async (values) => {
    // console.log("func called");
    dispatch(showLoader());
    try {
      // const token = Cookies.get("jwt-token");
      const decoded = jwtDecode(token);
      // console.log("decoded",decoded);
      const result = await axios.put(
        `${BASE_URL}/api/doctor/${decoded.id}`,
        values
      );
      // console.log("result", result);
      getUser();
      setEditDoctorProfile(false);
      toast.success("Profile updated successfully!!");
      const socket = getSocket();
      if (socket) {
        socket.emit("doctor-profile-updated");
      }
    } catch (error) {
      console.log(error);
      setEditUserProfile(false);
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getUser = async () => {
    dispatch(showLoader()); // Show loader before API call
    try {
      if (role == "patient") {
        const result = await axios.get(`${BASE_URL}/api/patient/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(result);
        setProfileData(result.data.userData);
      } else if (role == "doctor") {
        // console.log("hiihiihihi");
        const result = await axios.get(`${BASE_URL}/api/doctor/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(result);
        setProfileData(result.data.doctorData);
      }
      // console.log(result)
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader()); // Hide loader after API call
    }
  };
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux

  const getAppointments = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/appointment/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("all user appointments", result);
      setAppointments(result?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (loading) return; //is set to true until the whole page loads and the last useEffect is not called which sets it to false
    if (!isAuthenticated) {
      //console.log(isAuthenticated);
      navigate("/login"); // Redirect if the patient is not authenticated
    }

    getUser();
    getAppointments();

    const socket = getSocket();
    socket.on("appointment-reload-info", () => {
      getAppointments();
    });

    return () => {
      socket.off("appointment-reload-info");
    };
  }, [isAuthenticated, loading]); // Add dependencies to avoid unnecessary re-renders
  // //console.log(profileData);

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? (
    <div className=" w-full h-full flex justify-center items-center">
      <l-helix size="45" speed="2.5" color="black"></l-helix>
    </div>
  ) : role === "patient" ? (
    <div className="bg-white absolute  w-full h-[86vh] flex justify-center items-center">
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
      {editUserProfile ? (
        <div className="flex items-center justify-center absolute w-full h-full bg-gray-800 bg-opacity-70">
          <div className="bg-white w-1/2 h-11/12 rounded-lg p-8 shadow-lg">
            <h1 className="font-bold text-3xl mb-5">Edit Profile</h1>
            <Formik
              initialValues={{
                firstName: profileData?.fullName?.firstName,
                lastName: profileData?.fullName?.lastName,
                gender: profileData?.gender,
                age: profileData?.age,
                email: profileData?.email,
                phone: profileData?.phone,
                city: profileData?.address?.city,
                state: profileData?.address?.state,
                country: profileData?.address?.country,
                zipCode: profileData?.address?.zipCode,
              }}
              validationSchema={editUserValidationSchema}
              onSubmit={handleUserProfileUpdate}
            >
              <Form className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">First Name</label>
                  <Field
                    name="firstName"
                    disabled
                    type="text"
                    className="w-full bg-gray-100 duration-500 p-2 border rounded"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    disabled
                    className="w-full bg-gray-100 p-2 duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Gender</label>
                  <Field
                    type="text"
                    name="gender"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Age</label>
                  <Field
                    name="age"
                    type="number"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="age"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Phone</label>
                  <Field
                    name="phone"
                    type="text"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Email</label>
                  <Field
                    name="email"
                    type="email"
                    disabled
                    className="w-full p-2 bg-gray-100 transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <CityEditAutocomplete />
                </div>

                <div className="col-span-2 flex justify-between">
                  <div className=" button-trigger button-move  w-44 h-11">
                    <button
                      type="submit"
                      className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[6px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Save changes
                      </span>

                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Save changes
                      </span>
                    </button>
                  </div>

                  <div className=" button-trigger button-move  w-32 h-11">
                    <button
                      onClick={() => setEditUserProfile(false)}
                      className="bg-blue-50 hover:bg-white p-2 text-[#363639] text-md border-[6px] border-[#6b7594] font-Gilroy hover:border-[#48464f] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Cancel
                      </span>

                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Cancel
                      </span>
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* Outer Container */}
      <div className="bg-white w-full h-full shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar/Profile Picture Section */}
        <div className="w-full md:w-1/4 h-full bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col items-center py-10 px-5">
          {/* Profile Picture */}
          <div className="w-36 h-36 rounded-full flex justify-center items-center border-4 bg-[#072965] border-white shadow-lg">
            <h2 className="text-5xl font-bold">
              {profileData?.fullName?.firstName.slice(0, 1).toUpperCase() +
                profileData?.fullName?.lastName.slice(0, 1).toUpperCase()}
            </h2>
          </div>
          {/* Name */}
          <h1 className="mt-4 text-xl font-bold">
            {capitalizeFirstLetter(profileData?.fullName?.firstName) +
              " " +
              capitalizeFirstLetter(profileData?.fullName?.lastName)}
          </h1>
          {/* Role */}
          <p className="text-md text-gray-200">{capitalizeFirstLetter(role)}</p>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-3/4 h-full bg-white p-8 flex flex-col">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 ">
              Profile Information
            </h2>
            {/* Action Buttons */}
            <div className="flex ml-4">
              <button
                onClick={() => {
                  // console.log("edit clik");
                  return setEditUserProfile(true);
                }}
                className=" flex items-center rounded-lg "
              >
                <h2 className="mr-3 text-2xl font-semibold text-gray-800">
                  Edit Profile
                </h2>{" "}
                <Pencil className="" size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Full Name:
              </label>
              <p className="text-gray-600">
                {capitalizeFirstLetter(profileData?.fullName?.firstName) +
                  " " +
                  capitalizeFirstLetter(profileData?.fullName?.lastName)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 self-start font-medium w-40">
                Gender:
              </label>
              <p className="text-gray-600">{capitalizeFirstLetter(profileData?.gender)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 self-start font-medium w-40">
                Age:
              </label>
              <p className="text-gray-600">{profileData?.age}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Email:</label>
              <p className="text-gray-600 ">{capitalizeFirstLetter(profileData?.email)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Phone:</label>
              <p className="text-gray-600">{profileData?.phone}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 self-start font-medium w-40">
                Address:
              </label>
              <p className="text-gray-600">
                {profileData?.address?.city}, {profileData?.address?.state},{" "}
                {profileData?.address?.country} -{" "}
                {profileData?.address?.zipCode}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mt-12 mb-6">
            Medical Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Current Disease :
              </label>
              <p className="text-gray-600">
                {capitalizeFirstLetter(profileData?.detectedDisease) || "No Disease Detected Yet"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Symptoms :
              </label>
              <p className="text-gray-600">
                {profileData?.symptoms?.length
                  ? capitalizeFirstLetter(profileData?.symptoms?.join(", "))
                  : "No Symptoms Declared Yet"}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 h-full border-l-2 border-gray-300 bg-white p-8 flex flex-col">
          <div className="border-b h-fit w-full flex justify-between items-center pb-3 mb-0 ">
            <h2 className="text-2xl float-right font-semibold text-gray-800 ">
              {selectedAppointmentInfo || selectedAppointmentInfo == undefined
                ? "Appointment Information"
                : "Chats"}
            </h2>
            <h2
              onClick={() =>
                setSelectedAppointmentInfo(!selectedAppointmentInfo)
              }
              className="hover:text-xl transition-all duration-700 text-lg cursor-pointer font-semibold text-gray-500 mr-2"
            >
              {selectedAppointmentInfo || selectedAppointmentInfo == undefined
                ? "Chats"
                : "Appointment Information"}
            </h2>
          </div>

          {selectedAppointmentInfo || selectedAppointmentInfo == undefined ? (
            <div className="space-y-4 mt-5">
              {/* Status Filter */}
              <div className="flex items-center mb-4 space-x-4">
                <span className="text-gray-700 font-medium">
                  Filter by status:
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 ${
                      filter == "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-500 hover:text-white transition duration-500  rounded-full text-sm`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("approved")}
                    className={`px-3 ${
                      filter == "approved"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } py-1 hover:bg-blue-500 hover:text-white transition duration-500 rounded-full text-sm`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-3 ${
                      filter == "pending"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } py-1 hover:bg-blue-500 hover:text-white transition duration-500 rounded-full text-sm`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter("rejected")}
                    className={`px-3 ${
                      filter == "rejected"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } py-1 hover:bg-blue-500 hover:text-white transition duration-500 rounded-full text-sm`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* Appointments Container */}
              <div className="bg-gray-100 rounded-lg h-full shadow-lg shadow-black/30 px-4 pt-8 pb-0">
                <div className="overflow-hidden h-[24rem]">
                  {/* Appointments List */}
                  <div className="space-y-3 max-h-[24rem] h-full overflow-y-auto pr-2">
                    {filter == "all" ? (
                      appointments.length > 0 ? (
                        appointments
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map((appointment) => (
                            <UserProfileAppointmentCard
                              key={appointment._id}
                              doctor={appointment.doctorId}
                              specialty={appointment.specialty}
                              status={appointment.status}
                              date={appointment.date}
                              time={appointment.createdAt}
                              reason={appointment.reason}
                            />
                          ))
                      ) : (
                        <div className="w-full h-full p-6 py-3">
                          <div className="flex flex-col items-center justify-center h-full rounded-lg bg-gradient-to-br from-blue-400/70 to-blue-700 p-8 text-white">
                            <div className="mb-4 flex justify-center">
                              <div className="relative">
                                <Calendar size={64} className="text-white/90" />
                                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
                                  <Plus size={16} className="text-blue-500" />
                                </div>
                              </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-2 text-center">
                              No Appointments booked Yet
                            </h2>
                            <p className="text-center text-white/90 mb-6">
                              Time to prioritize your health!
                            </p>

                            <button
                              onClick={() => navigate("/consultancy")}
                              className="flex hover:shadow-lg hover:shadow-black/30 transition duration-500 items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-md"
                            >
                              <Clock size={18} />
                              Book Your First Consultation
                            </button>
                          </div>
                        </div>
                      )
                    ) : appointments.filter((app) => app.status == filter)
                        .length > 0 ? (
                      appointments
                        .filter((app) => app.status == filter)
                        .map((appointment) => (
                          <UserProfileAppointmentCard
                            key={appointment._id}
                            doctor={appointment.doctorId}
                            status={appointment.status}
                            date={appointment.date}
                            reason={appointment.reason}
                          />
                        ))
                    ) : (
                      <div className="w-full h-full p-6 py-3">
                        <div className="flex flex-col items-center justify-center h-full rounded-lg bg-gradient-to-br from-blue-400/70 to-blue-700  p-8 text-white">
                          <div className="mb-4 flex justify-center">
                            <div className="relative">
                              <Calendar size={64} className="text-white/90" />
                              <div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
                                <Plus size={16} className="text-blue-500" />
                              </div>
                            </div>
                          </div>

                          <h2 className="text-2xl font-bold mb-2 text-center">
                            No {filter} appointments
                          </h2>
                          <p className="text-center text-white/90 mb-6">
                            Time to prioritize your health!
                          </p>

                          <button
                            onClick={() => navigate("/consultancy")}
                            className="flex hover:shadow-lg hover:shadow-black/30 transition duration-500 items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-md"
                          >
                            <Clock size={18} />
                            Consult a Doctor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <PatientChatInterface />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-gray-100 absolute w-full h-[86.7vh] flex justify-center items-center">
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
      {editDoctorProfile ? (
        <div className="flex items-center justify-center absolute z-50 w-full h-full bg-gray-800 bg-opacity-70">
          <div className="bg-white w-1/2 h-9/12 p-8 rounded-lg shadow-lg">
            <h1 className="font-bold text-3xl mb-5">Edit Profile</h1>
            <Formik
              initialValues={{
                firstName: profileData?.fullName?.firstName,
                lastName: profileData?.fullName?.lastName,
                gender: profileData?.gender,
                experience: profileData?.experience,
                email: profileData?.email,
                phone: profileData?.phone,
                city: profileData?.address?.city,
                state: profileData?.address?.state,
                country: profileData?.address?.country,
                zipCode: profileData?.address?.zipCode,
              }}
              validationSchema={editDoctorValidationSchema}
              onSubmit={handleDoctorProfileUpdate}
            >
              <Form className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    disabled
                    className="w-full bg-gray-100 duration-500 p-2 border rounded"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    disabled
                    className="w-full bg-gray-100 p-2 duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Gender</label>
                  <Field
                    type="text"
                    name="gender"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Experience</label>
                  <Field
                    name="experience"
                    type="number"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="experience"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Phone</label>
                  <Field
                    name="phone"
                    type="text"
                    className="w-full p-2 hover:border-black transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium">Email</label>
                  <Field
                    name="email"
                    type="email"
                    disabled
                    className="w-full p-2 bg-gray-100 transition-all duration-500 border rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <CityEditAutocomplete />
                </div>

                <div className="col-span-2 flex justify-between">
                  <div className=" button-trigger button-move  w-44 h-11">
                    <button
                      type="submit"
                      className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[6px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Save changes
                      </span>

                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Save changes
                      </span>
                    </button>
                  </div>

                  <div className=" button-trigger button-move  w-32 h-11">
                    <button
                      onClick={() => setEditDoctorProfile(false)}
                      className="bg-blue-50 hover:bg-white p-2 text-[#363639] text-md border-[6px] border-[#6b7594] font-Gilroy hover:border-[#48464f] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Cancel
                      </span>

                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Cancel
                      </span>
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* Outer Container */}
      <div className="bg-white w-full h-full shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar/Profile Picture Section */}
        <div className="w-fit md:w-1/4 h-full bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col items-center py-10 px-5">
          {/* Profile Picture */}
          <div className="w-36 h-36 rounded-full flex justify-center items-center border-4 bg-[#072965] border-white shadow-lg">
            <h2 className="text-5xl font-bold">
              {profileData?.fullName?.firstName.slice(0, 1).toUpperCase() +
                profileData?.fullName?.lastName.slice(0, 1).toUpperCase()}
            </h2>
          </div>
          {/* Name */}
          <h1 className="mt-4 text-xl font-bold">
            {capitalizeFirstLetter(profileData?.fullName?.firstName) +
              " " +
              capitalizeFirstLetter(profileData?.fullName?.lastName)}
          </h1>
          {/* Role */}
          <p className="text-md text-gray-200">{capitalizeFirstLetter(role)}</p>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-3/4 h-full p-8 flex flex-col">
          {/* Section Header */}

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 ">
              Profile Information
            </h2>
            {/* Action Buttons */}
            <div className="flex ml-4">
              <button
                onClick={() => {
                  // console.log("edit clik");
                  return setEditDoctorProfile(true);
                }}
                className=" flex items-center rounded-lg "
              >
                <h2 className="mr-3 text-2xl font-semibold text-gray-800">
                  Edit Profile
                </h2>{" "}
                <Pencil className="" size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Full Name:
              </label>
              <p className="text-gray-600">
                {capitalizeFirstLetter(profileData?.fullName?.firstName) +
                  " " +
                  capitalizeFirstLetter(profileData?.fullName?.lastName)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Email:</label>
              <p className="text-gray-600 ">{capitalizeFirstLetter(profileData?.email)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Phone:</label>
              <p className="text-gray-600">{profileData?.phone}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Gender:</label>
              <p className="text-gray-600">{capitalizeFirstLetter(profileData?.gender)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Hospital:
              </label>
              <p className="text-gray-600">{capitalizeFirstLetter(profileData?.hospital)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 self-start font-medium w-40">
                Address:
              </label>
              <p className="text-gray-600">
                {profileData?.address?.city}, {profileData?.address?.state},{" "}
                {profileData?.address?.country}-{profileData?.address?.zipCode}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Experience:
              </label>
              <p className="text-gray-600">{profileData?.experience} years</p>
            </div>
          </div>

          {/* Medical Information Section */}
          <h2 className="text-2xl font-semibold text-gray-800 border-b mt-8 pb-3 mb-6">
            Medical Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Specialization:
              </label>
              <p className="text-gray-600">{profileData?.specialization}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Qualifications:
              </label>
              <p className="text-gray-600">
                {profileData?.qualifications?.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4 h-full border-l-2 border-gray-300 bg-white p-2 px-4 pt-4 flex flex-col">
          <DoctorChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Profile;
