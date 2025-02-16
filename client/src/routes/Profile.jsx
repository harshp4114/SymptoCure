import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedin, userLoggedout } from "../redux/slices/signInSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "ldrs/helix"; // Ensure this path is valid
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { BASE_URL } from "../utils/constants";
const Profile = () => {
  useAuth(); // Trigger the authentication logic (runs on mount)
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("jwt-token");
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role.roleName);
  // console.log(role);
  const getUser = async () => {
    dispatch(showLoader()); // Show loader before API call
    try {
      if (role == "patient") {
        const result = await axios.get(`${BASE_URL}/api/patient/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(result.data.userData);
      } else {
        // console.log("hiihiihihi")
        const result = await axios.get(`${BASE_URL}/api/doctor/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(result);
        setProfileData(result.data.data);
      }
      // console.log(result)
    } catch (error) {
      // console.log("error", error);
    } finally {
      dispatch(hideLoader()); // Hide loader after API call
    }
  };
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      //console.log(isAuthenticated);
      navigate("/login"); // Redirect if the patient is not authenticated
    }
    getUser();
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
    <div className="bg-gray-100 absolute  w-full h-[86.7vh] flex justify-center items-center">
      {/* Outer Container */}
      <div className="bg-white w-3/4 h-full rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar/Profile Picture Section */}
        <div className="w-full md:w-1/4 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col items-center py-10 px-5">
          {/* Profile Picture */}
          <img
            src="./logo.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          {/* Name */}
          <h1 className="mt-4 text-xl font-bold">
            {profileData?.fullName?.firstName +
              " " +
              profileData?.fullName?.lastName}
          </h1>
          {/* Role */}
          <p className="text-sm text-gray-200">
            {profileData?.role == "patient" ? "PATIENT" : "DOCTOR"}
          </p>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-3/4 h-full bg-gray-50 p-8 flex flex-col">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Profile Information
          </h2>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Full Name:
              </label>
              <p className="text-gray-600">
                {profileData?.fullName?.firstName +
                  " " +
                  profileData?.fullName?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Email:</label>
              <p className="text-gray-600 ">{profileData?.email}</p>
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
                {profileData?.address?.address}, {profileData?.address?.city},{" "}
                {profileData?.address?.state}, {profileData?.address?.country}-
                {profileData?.address?.zipCode}
              </p>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
            <p className="text-gray-600 mt-2">
              I am a passionate software developer with expertise in creating
              efficient and scalable applications. I enjoy problem-solving and
              staying updated with the latest technologies.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          </div>
        </div>
        <div className="w-full md:w-3/4 h-full border-l-2 border-gray-300 bg-white p-8 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Medical Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Current Disease :
              </label>
              <p className="text-gray-600">
                {profileData?.detectedDisease || "Eiffel Tower"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Symptoms :
              </label>
              <p className="text-gray-600">
                {profileData?.symptoms?.length
                  ? profileData?.symptoms?.map((symp) => symp + ", ")
                  : "Flu, Fever, Cold, Sore Throat"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-gray-100 absolute w-full h-[86.7vh] flex justify-center items-center">
      {/* Outer Container */}
      <div className="bg-white w-3/4 h-full rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar/Profile Picture Section */}
        <div className="w-full md:w-1/4 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col items-center py-10 px-5">
          {/* Profile Picture */}
          <img
            src="./logo.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          {/* Name */}
          <h1 className="mt-4 text-xl font-bold">
            {profileData?.fullName?.firstName +
              " " +
              profileData?.fullName?.lastName}
          </h1>
          {/* Specialization */}
          <p className="text-sm text-gray-200">{profileData?.specialization}</p>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-3/4 h-full bg-gray-50 p-8 flex flex-col">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Profile Information
          </h2>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Full Name:
              </label>
              <p className="text-gray-600">
                {profileData?.fullName?.firstName +
                  " " +
                  profileData?.fullName?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Email:</label>
              <p className="text-gray-600 ">{profileData?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Phone:</label>
              <p className="text-gray-600">{profileData?.phone}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Gender:</label>
              <p className="text-gray-600">{profileData?.gender}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Hospital:
              </label>
              <p className="text-gray-600">{profileData?.hospital}</p>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
            <p className="text-gray-600 mt-2">
              {profileData?.experience} years
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="w-full md:w-3/4 h-full border-l-2 border-gray-300 bg-white p-8 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
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
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Patients Per Day:
              </label>
              <p className="text-gray-600">{profileData?.patientsPerDay}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Available Days:
              </label>
              <p className="text-gray-600">
                {profileData?.availableDays?.join(", ")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">
                Available Time:
              </label>
              <p className="text-gray-600">
                {profileData?.availableTime?.start} -{" "}
                {profileData?.availableTime?.end}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Rating:</label>
              <p className="text-gray-600">{profileData?.rating} stars</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
