import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Cookies from "js-cookie";
import { getSocket } from "../socket";

const AppointmentCard = (props) => {
  // console.log("appointment",props.data)
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(props.data);
    getUserData();
    const socket = getSocket();
    if (socket) {
      socket.on("change-patient-data", () => {
        getUserData();
      });
    }
  }, []);

  const getUserData = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(
        `${BASE_URL}/api/patient/${props.data.userId}`
      );
      console.log("result in card", result);
      setData(result?.data?.data);
    } catch (err) {
      console.log("error n card", err);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleApprove = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.put(
        `${BASE_URL}/api/appointment/${props.data._id}`,
        {
          status: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt-token")}`,
          },
        }
      );
      // console.log("result in approve", result);
      if (result?.data?.success) {
        props?.change();
        const socket = getSocket();
        if (socket) {
          socket.emit("appointment-status-updated");
        }
        const response = await axios.post(
          `${BASE_URL}/api/chat`,
          {
            patientId: props.data.userId,
            doctorId: Cookies.get("userId"),
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt-token")}`,
            },
          }
        );
        console.log("chat response", response);
      }
    } catch (err) {
      console.log("error in approve", err);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleReject = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.put(
        `${BASE_URL}/api/appointment/${props.data._id}`,
        {
          status: "rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt-token")}`,
          },
        }
      );
      // console.log("result in reject", result);
      if (result?.data?.success) {
        props?.change();
        const socket = getSocket();
        if (socket) {
          socket.emit("appointment-status-updated");
        }
      }
    } catch (err) {
      console.log("error in reject", err);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Status-based styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return {
          strip: "bg-green-500",
          badge: "bg-green-100 text-green-800",
          badgeText: "Approved",
        };
      case "rejected":
        return {
          strip: "bg-red-500",
          badge: "bg-red-100 text-red-800",
          badgeText: "Rejected",
        };
      default:
        return {
          strip: "bg-yellow-500",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "Pending",
        };
    }
  };

  const statusStyles = getStatusStyles(props.data.status);

  return (
    <div className="max-w-1/3 flex-col flex-1">
      <div className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border h-full border-gray-100">
        <div className={`h-2 rounded-t-md ${statusStyles.strip}`}></div>

        <div className="p-6">
          {/* Header with patient name and status */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {data?.fullName?.firstName + " " + data?.fullName?.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(props?.data?.createdAt).toLocaleDateString()} at{" "}
                {new Date(props?.data?.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyles.badge}`}
            >
              {statusStyles.badgeText}
            </span>
          </div>

          {/* Appointment details */}
          <div className="space-y-4 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-xs uppercase font-medium text-gray-500 mb-1">
                Contact Information
              </p>
              <p className="text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {data?.phone}
              </p>
              <p className="text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                {data?.email}
              </p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm"></p>
              <p className="text-xs uppercase font-medium text-gray-500 mb-1">
                Reason for Visit
              </p>
              <p className="text-sm">
                Disease : {props?.data?.disease || "Not specified"}
              </p>
              <p className="text-sm">
                {props?.data?.reason || "Not specified"}
              </p>
            </div>
          </div>

          {/* Actions - only show for pending appointments */}
          {props?.data.status === "pending" && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleApprove()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
              <button
                onClick={() => handleReject()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
