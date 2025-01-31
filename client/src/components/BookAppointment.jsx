import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import axios from "axios";
import Cookies from "js-cookie";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { BASE_URL } from "../utils/constants";
const BookAppointment = ({
  doctor,
  onClose,
  toggleSuccess,
  toggleFailure,
  toggleExist,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fullyBooked, setFullyBooked] = useState([]);
  const token = Cookies.get("jwt-token");
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    updateCalendarAppointments();
  }, []);

  const updateCalendarAppointments = async () => {
    try {
      const result = await axios.get(
        `${BASE_URL}/api/doctor/${doctor._id}/appointments`
      );
      setFullyBooked(result.data.fullyBookedDates);
    } catch (error) {
      // //console.log(error);
    }
  };

  const handleBookAppointment = async (values) => {
    dispatch(showLoader());
    try {
      await axios.post(
        `${BASE_URL}/api/appointment/${doctor._id}`,
        {
          ...values,
          selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // //console.log(toggleSuccess);
      toggleSuccess();
      onClose();
    } catch (error) {
      //console.log("error", error);
      if (
        error?.response?.data?.message ==
        "Appointment already exists for this date"
      ) {
        //console.log(toggleExist)
        toggleExist();
      } else {
        //console.log(toggleFailure)
        toggleFailure();
      }
      onClose();
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    reason: Yup.string().required("Reason for visit is required"),
  });

  const modifiersStyles = {
    fullyBooked: {
      borderRadius: "50%",
      backgroundColor: "rgba(255, 0, 0, 1)",
      color: "white",
    },
  };

  const modifiers = {
    fullyBooked: (date) => {
      return fullyBooked.some((bookedDate) => {
        const bookedDay = new Date(bookedDate).toISOString().split("T")[0];
        const currentDay = date.toISOString().split("T")[0];
        return bookedDay === currentDay;
      });
    },
  };

  const isDateFullyBooked = (date) => {
    return fullyBooked.some((bookedDate) => {
      const bookedDay = new Date(bookedDate).toISOString().split("T")[0];
      const currentDay = date.toISOString().split("T")[0];
      return bookedDay === currentDay;
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white h-4/4 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Book Appointment</h2>
            <button
              className="text-white hover:bg-blue-700 p-2 rounded-lg"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <p className="mt-2">
            with Dr. {doctor?.fullName?.firstName} {doctor?.fullName?.lastName}
          </p>
        </div>

        {/* Content */}
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            reason: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleBookAppointment(values)}
        >
          <Form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="fullName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Field
                  type="tel"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Please describe your symptoms or reason for visit"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full border-2 border-red-400 bg-red-400"></div>
                  <span>Fully booked slots</span>
                </div>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    if (date < new Date() || isDateFullyBooked(date))
                      return true;
                    const day = date.toLocaleDateString("en-US", {
                      weekday: "long",
                    });
                    return !doctor?.availableDays?.includes(day);
                  }}
                  className="border rounded-md font-semibold bg-white p-3"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-full flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default BookAppointment;
