import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import Cookies from "js-cookie";

const UserProfileAppointmentCard = ({
  doctor,
  status,
  date,
  reason,
}) => {
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");
  const [doctorData, setDoctorData] = useState({});

  const getdoctorData = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/doctor/${doctor}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("doctor info", result.data.data);
      setDoctorData(result?.data?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    getdoctorData();
  }, []);

  function CalendarIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  }

  function InformationCircleIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  // Define border and badge colors based on status
  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          border: "border-yellow-400",
          bg: "bg-yellow-100",
          text: "text-yellow-800",
        };
      case "approved":
        return {
          border: "border-green-400",
          bg: "bg-green-100",
          text: "text-green-800",
        };
      case "rejected":
        return {
          border: "border-red-400",
          bg: "bg-red-100",
          text: "text-red-800",
        };
      default:
        return {
          border: "border-gray-400",
          bg: "bg-gray-100",
          text: "text-gray-800",
        };
    }
  };

  const { border, bg, text } = getStatusColors(status);

  return (
    <div
      className={`bg-white rounded-lg border-l-4 ${border} shadow p-4 flex items-center mb-4`}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800">
              {doctorData?.fullName?.firstName +
                " " +
                doctorData?.fullName?.lastName}
            </h3>
            <p className="text-sm text-gray-600">{doctorData.specialization}</p>
          </div>
          <span className={`px-2 py-1 ${status=="approved"?"":"mt-1 mr-1"} ${bg} ${text} text-xs rounded-full`}>
            {status}
          </span>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            {new Date(date).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
          <p className="text-xs text-gray-500 mt-1">Reason: {reason}</p>
      </div>
      {status === "approved" && (
        <div className="ml-4 flex space-x-2">
          <button className="p-2 text-blue-500 hover:text-blue-700">
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileAppointmentCard;
