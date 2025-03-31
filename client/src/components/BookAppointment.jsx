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
import { jwtDecode } from "jwt-decode";
import { getSocket } from "../socket";

const BookAppointment = ({
  patient,
  doctor,
  onClose,
  toggleSuccess,
  toggleFailure,
  toggleExist,
  togglePending,
}) => {
  //console.log("patient", patient);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientData, setPatientData] = useState({});
  useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fullyBooked, setFullyBooked] = useState([]);
  const token = Cookies.get("jwt-token");
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);
  const decoded = jwtDecode(token);
  const patientId = decoded.id;
  // const getPatient = async () => {
  //   dispatch(showLoader());
  //   try {
  //     const result = await axios.get(`${BASE_URL}/api/patient/${patientId}`);
  //     //console.log("patient data fetched when we press book app", result);
  //     setPatientData(result?.data?.data);
  //   } catch (error) {
  //     //console.log("error", error);
  //   } finally {
  //     dispatch(hideLoader());
  //   }
  // };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
    // getPatient();
    // //console.log("patient", patient);
  }, [isAuthenticated, loading]);

  useEffect(() => {});

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
      ////console.log(toggleSuccess);
      toggleSuccess();

      const socket = getSocket();
      // //console.log("socket in book appointments", socket);
      if (socket) {
        // //console.log("inside socket if")
        socket.emit("user-book-appointment");
      }
      onClose();
    } catch (error) {
      //console.log("error", error);
      if (
        error?.response?.data?.message ==
        "Appointment already exists with the doctor"
      ) {
        ////console.log(toggleExist)
        toggleExist();
      } else if (
        error?.response?.data?.message ==
        "Appointment pending with the doctor. Please wait"
      ) {
        //console.log("indisbabdjas ending");
        togglePending();
      } else {
        ////console.log(toggleFailure)
        toggleFailure();
      }
      onClose();
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setLoading(false);
    //console.log("patient data name", patient, patientData);
  }, []);


  const bookAppointmentValidationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .default(
        patient?.fullName?.firstName + " " + patient?.fullName?.lastName
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .default(patient?.email),
    disease: Yup.string()
      .required("Disease is required")
      .default(patient?.detectedDisease),
    phone: Yup.string()
      .required("Phone number is required")
      .default(patient?.phone),
    reason: Yup.string().required("Reason for visit is required"),
    date: Yup.date().required("Date is required"),
  });


  // const modifiersStyles = {
  //   fullyBooked: {
  //     borderRadius: "50%",
  //     backgroundColor: "rgba(255, 0, 0, 1)",
  //     color: "white",
  //   },
  // };

  // const modifiers = {
  //   fullyBooked: (date) => {
  //     return fullyBooked.some((bookedDate) => {
  //       const bookedDay = new Date(bookedDate).toISOString().split("T")[0];
  //       const currentDay = date.toISOString().split("T")[0];
  //       return bookedDay === currentDay;
  //     });
  //   },
  // };

  return loading ? (
    <Loader />
  ) : (
    <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center p-4 z-50">
      <div className="bg-white  rounded-lg shadow-xl  max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#204cbc] p-6 pt-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Book Appointment</h2>
            <button
              className="text-white hover:bg-blue-700 p-2 rounded-lg"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <p className="">
            with Dr. {doctor?.fullName?.firstName} {doctor?.fullName?.lastName}
          </p>
        </div>

        {/* Content */}
        <Formik
          initialValues={{
            fullName:
              patient?.fullName?.firstName +
                " " +
                patient?.fullName?.lastName || "",
            email: patient?.email || "",
            phone: patient?.phone || "",
            reason: "",
            disease: patient?.detectedDisease || "",
            date: null,
          }}
          validationSchema={bookAppointmentValidationSchema}
          onSubmit={(values) => handleBookAppointment(values)}
        >
          {({ setFieldValue, values }) => (
          <Form className="p-6 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-0">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <Field
                  type="text"
                  name="fullName"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    patient?.fullName?.firstName +
                    " " +
                    patient?.fullName?.lastName
                  }
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <Field
                  type="email"
                  disabled
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={patient?.email}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <Field
                  type="tel"
                  disabled
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={patient?.phone}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease*
                </label>
                <Field
                  type="text"
                  disabled={!!patient?.detectedDisease}
                  name="disease"
                  className={`w-full px-3 py-2 border  ${!!patient?.detectedDisease?"":" hover:ring-[1px] transition-all duration-500 hover:ring-black"} border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-black`}
                  placeholder={patient?.detectedDisease || "Enter your disease"}
                />
                <ErrorMessage
                  name="disease"
                  component="div"
                  className="text-red-600 ml-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit*
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  className="w-full px-3 py-2 border hover:ring-[1px] transition-all duration-500 hover:ring-black border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-black h-28 max-h-28"
                  placeholder="Please describe your symptoms or reason for visit"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-600 ml-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>

                <DayPicker
                  mode="single"
                  selected={values.date} // Bind selected date to Formik
                  onSelect={(date) => setFieldValue("date", date)} // Update Formik's state
                  disabled={(date) => date <= new Date()} // Disable past dates
                  className="border rounded-md font-semibold bg-white p-3"
                />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-600 ml-2 mt-2 text-sm"
              />
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-full flex justify-end gap-4">
              
              <div className=" button-trigger button-move  w-36 h-11">
                <button
                  onClick={onClose}
                  className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[6px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                    Cancel
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    Cancel
                  </span>
                </button>
              </div>
              
              <div className=" button-trigger button-move  w-44 h-11">
                <button
                  type="submit"
                  className="bg-blue-50 hover:bg-white p-2 text-[#232269] text-md border-[6px] border-[#1E42B3] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold pb-4 px-4 rounded-xl w-full relative overflow-hidden group"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                    Confirm Booking
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    Confirm Booking
                  </span>
                </button>
              </div>
            </div>
          </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookAppointment;
