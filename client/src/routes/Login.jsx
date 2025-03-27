import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedin } from "../redux/slices/signInSlice";
import signUpUserValidateSchema from "../yupValidators/signUpValidate";
import loginValidateSchema from "../yupValidators/loginValidate";
import useAuth from "../hooks/useAuth";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { cardio } from "ldrs";
import { BASE_URL } from "../utils/constants";
import { setRoleAsDoctor, setRoleAsUser } from "../redux/slices/roleSlice";
import SignUpDoctorValidate from "../yupValidators/signUpDoctorValidate";
import Loader from "../components/Loader";
import { Stethoscope } from "lucide-react";
import CityAutocomplete from "../components/CityAutoComplete";
import SpecializationAutoComplete from "../components/SpecializationAutoComplete";
import QualificationAutoComplete from "../components/QualificationAutoComplete";
import { socketConnected } from "../redux/slices/socketSlice";
import { connectSocket, getSocket } from "../socket";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient"); //handles toggle in the signup page for patient/doctor
  const [error, setError] = useState(""); //used for the error message of the form fields
  const [isLogin, setIsLogin] = useState(true); //handles toggle between signin and signup
  const SignUpUserValidateSchema = signUpUserValidateSchema;
  const loginValidationSchema = loginValidateSchema;
  const SignUpDoctorValidationSchema = SignUpDoctorValidate;
  cardio.register(); //for the health loader shown at the side
  const dispatch = useDispatch(); //used to dispatch actions to the redux store
  const isLoading = useSelector((state) => state.loading.isLoading); //checks if the page is loading
  useAuth(); //hook that sets the patient as logged in if the jwt token is present in the cookies

  // login initial values for login is same as role is defined separately
  const LoginInitialValues = {
    email: "",
    password: "",
    role: "",
  };

  //sign up initial values are different for patient and doctor as the information changes
  const SignUpUserInitialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };

  const SignUpDoctorInitialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    specialization: "",
    qualifications: [],
    experience: "",
    hospital: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };

  // on click functions for the patient/doctor toggle buttons
  const handlePatientToggle = () => {
    setRole("patient");
  };

  const handleDoctorToggle = () => {
    setRole("doctor");
  };

  //handles the login form submission
  const handleSubmitLogin = async (values) => {
    // console.log("inside user login",values.role);
    if (values?.role.toLowerCase() == "patient") {
      try {
        dispatch(showLoader());
        // console.log("Form Data:", values);
        const result = await axios.post(
          `${BASE_URL}/api/patient/login/`,
          values
        );
        // console.log(result);
        // const role = result.data.patient.role;
        // console.log(result);
        localStorage.setItem("role", "patient");
        // if (role == "patient") {
        //   dispatch(setRoleAsUser());
        // } else if (role == "doctor") {
        //   dispatch(setRoleAsDoctor());
        // }
        const token = result.data.token;
        // console.log("token", token);

        Cookies.set("jwt-token", token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        dispatch(userLoggedin()); //sets the redux user login variable to true
        // //console.log(useSelector((state)=>state?.signin?.isSignedIn));
        // //console.log(Cookies.get('jwt-token'));
        //console.log("User created successfully", result);
        dispatch(setRoleAsUser());
        console.log("creating socket");
        dispatch(socketConnected());
        const decoded = jwtDecode(token);
        // const socket = getSocket();
        connectSocket(decoded.id);
        // socket.emit("join", decoded.id);
        navigate("/home");
      } catch (error) {
        console.log("last", error);
        setError(error.response.data.message || "Something went wrong");
      } finally {
        dispatch(hideLoader());
      }
    } else if (values?.role == "doctor") {
      try {
        // console.log("inside doctor login");
        dispatch(showLoader());
        // console.log("Form Data:", values);

        const result = await axios.post(
          `${BASE_URL}/api/doctor/login/`,
          values
        );
        // console.log(result);
        // const role = result.data.patient.role;
        // console.log("rrr",result);
        localStorage.setItem("role", "doctor");
        // if (role == "patient") {
        //   dispatch(setRoleAsUser());
        // } else if (role == "doctor") {
        //   dispatch(setRoleAsDoctor());
        // }
        const token = result.data.token;
        // console.log("token", token);

        Cookies.set("jwt-token", token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        dispatch(userLoggedin()); //sets the redux user login variable to true
        // //console.log(useSelector((state)=>state?.signin?.isSignedIn));
        // //console.log(Cookies.get('jwt-token'));
        //console.log("User created successfully", result);
        dispatch(socketConnected());
        // const socket = getSocket();
        const decoded = jwtDecode(token);
        connectSocket(decoded.id);
        // socket.emit("join", decoded.id);
        dispatch(setRoleAsDoctor());
        navigate("/home");
      } catch (error) {
        console.log("last", error);
        setError(error.response.data.message || "Something went wrong");
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  const handleSubmitPatient = async (values) => {
    //console.log("Form Data:", values);
    try {
      // console.log("values", values);
      dispatch(showLoader());
      // console.log("Form Data:", values);

      const result = await axios.post(`${BASE_URL}/api/patient/`, values);
      // console.log("result", result);
      const token = result?.data?.token;
      // //console.log("token",token);

      localStorage.setItem("role", "patient");
      // dispatch(setRoleAsUser());

      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // //console.log(Cookies.get('jwt-token'));
      // //console.log("User created successfully", result);
      dispatch(socketConnected());
      const decoded = jwtDecode(token);
      connectSocket(decoded.id);
      // const socket = getSocket();
      // socket.emit("join", decoded.id);
      dispatch(setRoleAsUser());
      navigate("/home");
    } catch (error) {
      console.log("error", error);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSubmitDoctor = async (values) => {
    try {
      console.log("values", values);
      dispatch(showLoader());
      const result = await axios.post(`${BASE_URL}/api/doctor/`, values);
      console.log("result", result);
      const token = result?.data?.token;
      // //console.log("token",token);

      // const role = result.data.patient.role;
      // dispatch(setRoleAsDoctor());
      localStorage.setItem("role", "doctor");

      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // //console.log(Cookies.get('jwt-token'));
      // //console.log("User created successfully", result);
      dispatch(socketConnected());
      const decoded = jwtDecode(token);
      // const socket = getSocket();
      connectSocket(decoded.id);
      // socket.emit("join", decoded.id);
      dispatch(setRoleAsDoctor());
      navigate("/home");
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    if (isLogin) {
      return (
        <div className="flex justify-center w-full h-[86.8vh] items-center mx-auto absolute bg-[#403CD5]">
          <div className="bg-[#16165C] shadow-lg flex rounded-3xl p-8 w-9/12 h-5/6 ">
            <div className="w-1/2 h-full flex flex-wrap content-start items-start">
              <div className="w-40 flex h-24 ml-3">
                <l-cardio
                  size="110"
                  stroke="6"
                  speed="1.9"
                  color="white"
                ></l-cardio>
              </div>
              <div className="basis-full flex flex-wrap">
                <h1 className="text-[4.4rem] leading-none font-Gilroy text-left font-bold text-white basis-full">
                  Detect.
                </h1>
                <h1 className="text-[4.4rem] leading-none font-Gilroy font-semibold text-left text-white basis-full">
                  Connect.
                </h1>
                <h1 className="text-[4.4rem] leading-none font-Gilroy font-semibold text-left mb-8 text-white basis-full">
                  Cure.
                </h1>
              </div>
              <div className="w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#4B48D1] to-transparent my-4"></div>
              <div>
                <h1 className="text-[#a0c4ff] font-Gilroy text-3xl font-semibold ml-1 mt-2">
                  Sign In to Access Your Profile
                </h1>
              </div>
            </div>
            <div className="w-1/2 h-full flex flex-wrap">
              <Formik
                initialValues={LoginInitialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleSubmitLogin}
              >
                <Form className="w-full">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                  />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Password*"
                    autoComplete="password"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-[#2BB6DB] text-md w-full font-semibold my-2"
                  />

                  <Field
                    as="select"
                    name="role"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 w-full bg-[#232269]"
                  >
                    <option value="" disabled>
                      Select Role*
                    </option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-[#2BB6DB] text-md w-full font-semibold my-2"
                  />

                  <div className="w-full">
                    <p
                      className="mt-2 mb-2 text-[#9DC1FC] text-md cursor-pointer"
                      onClick={() => {
                        setIsLogin(!isLogin);
                      }}
                    >
                      Don't have an account? Sign Up
                    </p>
                  </div>

                  <div className="relative top-2 w-5/12 h-16 mt-2">
                    <button
                      type="submit"
                      className="bg-[#E6E4FD] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
                    >
                      {/* Default Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Submit Credentials
                      </span>

                      {/* Hover Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Submit Credentials
                      </span>
                    </button>
                  </div>

                  {error && isLogin && (
                    <div>
                      <p className="text-[#2BB6DB] text-lg font-semibold w-full my-6">
                        {error}
                      </p>
                    </div>
                  )}
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center w-full h-fit items-center mx-auto absolute bg-[#403CD5]">
        <div className="bg-[#16165C] shadow-lg flex mt-20 rounded-3xl p-8 w-9/12 h-5/6 ">
          <div className="w-1/2 text-white h-full flex flex-wrap content-start items-start">
            <div className="w-40 flex h-24 ml-3">
              <l-cardio
                size="110"
                stroke="6"
                speed="1.9"
                color="white"
              ></l-cardio>
            </div>
            <div className="basis-full flex flex-wrap">
              <h1 className="text-[4.4rem] leading-none font-Gilroy text-left font-bold text-white basis-full">
                Detect.
              </h1>
              <h1 className="text-[4.4rem] leading-none font-Gilroy font-semibold text-left text-white basis-full">
                Connect.
              </h1>
              <h1 className="text-[4.4rem] leading-none font-Gilroy font-semibold text-left mb-8 text-white basis-full">
                Cure.
              </h1>
            </div>
            <div className="w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#4B48D1] to-transparent my-4"></div>
            <div>
              <h1 className="text-[#a0c4ff] font-Gilroy text-3xl font-semibold ml-1 mt-2">
                {role === "patient"
                  ? "From Symptoms to Solutions"
                  : "Apply as a doctor at SymptoCure"}
              </h1>
              <h1 className="text-[#a0c4ff] font-Gilroy text-3xl font-semibold ml-1 mt-2">
                {role === "patient"
                  ? "Get Started Today"
                  : "& help us in curing the world"}
              </h1>
            </div>
          </div>
          <div className="w-1/2 h-full flex flex-wrap">
            <div className="w-full mb-3 h-14 flex items-center justify-start">
              <h2 className="w-44 text-2xl font-Gilroy text-[#a0c4ff] font-semibold">
                Select a Role:
              </h2>
              <button
                onClick={handlePatientToggle}
                className={`bg-blue-500 ${
                  role == "patient" ? "border-blue-300" : "border-blue-950"
                } w-1/3 h-full flex font-Gilroy font-semibold text-2xl text-blue-950 border-4 hover:border-blue-300 justify-center transition-all duration-700 cursor-pointer items-center rounded-l-full`}
              >
                Patient
              </button>
              <button
                onClick={handleDoctorToggle}
                className={`bg-blue-700  ${
                  role == "doctor" ? "border-blue-300" : "border-blue-950"
                } w-1/3 h-full flex font-Gilroy font-semibold text-2xl text-blue-950 border-4 hover:border-blue-300 justify-center transition-all duration-700 cursor-pointer items-center rounded-r-full`}
              >
                Doctor
              </button>
            </div>

            {role === "patient" ? (
              <Formik
                initialValues={SignUpUserInitialValues}
                validationSchema={SignUpUserValidateSchema}
                onSubmit={handleSubmitPatient}
              >
                <Form className="w-full">
                  {/* Personal Information Section */}
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="number"
                    name="phone"
                    placeholder="Phone Number*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Password*"
                    autoComplete="password"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password*"
                    autoComplete="confirmPassword"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="number"
                    name="age"
                    placeholder="Years Young*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="text"
                    name="gender"
                    placeholder="Gender (Male / Female / Other)*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  {/* Address Section */}
                  <h2 className="ml-2 mt-4 text-3xl font-Gilroy font-semibold text-[#9dc1fc] mb-4">
                    Your Location - 🌍
                  </h2>

                  <CityAutocomplete />

                  <div className="w-full">
                    <p
                      className="mt-2 mb-2 text-[#9DC1FC] text-md cursor-pointer"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      Already have an account? Sign In
                    </p>
                  </div>
                  <div className="relative top-2 w-5/12 h-16 mt-2">
                    <button
                      type="submit"
                      className="bg-[#E6E4FD] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
                    >
                      {/* Default Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Create Account
                      </span>

                      {/* Hover Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Create Account
                      </span>
                    </button>
                  </div>
                  {error && !isLogin && (
                    <div className="text-[#2BB6DB] text-md font-semibold w-full my-2">
                      {error}
                    </div>
                  )}
                </Form>
              </Formik>
            ) : (
              <Formik
                initialValues={SignUpDoctorInitialValues}
                validationSchema={SignUpDoctorValidationSchema}
                onSubmit={handleSubmitDoctor}
              >
                <Form className="w-full">
                  {/* Personal Information Section */}
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="number"
                    name="phone"
                    placeholder="Phone Number*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Password*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  <Field
                    type="text"
                    name="gender"
                    placeholder="Gender ( male / female / other )*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                  />

                  {/* Address Section */}
                  <h2 className="ml-2 mt-4 text-3xl font-Gilroy font-semibold text-[#9dc1fc] mb-4">
                    Your Location - 🌍
                  </h2>

                  <CityAutocomplete />
                  <pre className="ml-2 mt-4 text-3xl flex font-Gilroy font-semibold text-[#9dc1fc] mb-4">
                    Professional Bio - <Stethoscope size={40} color="#D3D3D3" />
                  </pre>

                  <SpecializationAutoComplete />

                  <QualificationAutoComplete />

                  <Field
                    type="number"
                    name="experience"
                    placeholder="Experience in years*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                  />

                  <Field
                    type="text"
                    name="hospital"
                    placeholder="Your Workplace*"
                    className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                  />
                  <ErrorMessage
                    name="hospital"
                    component="div"
                    className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                  />

                  {/* <div className="w-full">
                    <h2 className=" mt-4 text-3xl font-Gilroy font-semibold text-[#9dc1fc] mb-6">
                      Available Days*
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <label
                          key={day}
                          className="flex items-center space-x-3 text-[#9dc1fc]"
                        >
                          <Field
                            type="checkbox"
                            name="availableDays"
                            value={day}
                            className="w-6 h-6 text-[#2BB6DB] bg-[#232269] border-[#9DC1FC]"
                          />
                          <span className="text-lg font-semibold">{day}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="availableDays"
                      component="div"
                      className="text-[#2BB6DB] text-md font-semibold w-full my-4"
                    />
                  </div> */}

                  {/* <div className="w-full">
                    <h2 className=" mt-4 text-3xl font-Gilroy font-semibold text-[#9dc1fc] mb-4">
                      Available Time*
                    </h2> */}

                  {/* Start Time */}
                  {/* <div className="mt-2">
                      <h2 className="text-xl font-medium text-[#9dc1fc] mb-4">
                        Start Time:
                      </h2>
                      <Field
                        type="time"
                        name="availableTime.start"
                        step="60"
                        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl w-full bg-[#232269] [&::-webkit-calendar-picker-indicator]:invert"
                      />
                      <ErrorMessage
                        name="availableTime.start"
                        component="div"
                        className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                      />
                    </div> */}

                  {/* End Time */}
                  {/* <div className="mt-2">
                      <h2 className="text-xl mt-4 font-medium text-[#9dc1fc] mb-4">
                        End Time:
                      </h2>
                      <Field
                        type="time"
                        name="availableTime.end"
                        step="60"
                        className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl w-full bg-[#232269] [&::-webkit-calendar-picker-indicator]:invert"
                      />
                      <ErrorMessage
                        name="availableTime.end"
                        component="div"
                        className="text-[#2BB6DB] text-md font-semibold w-full my-2 mb-4"
                      />
                    </div> */}
                  {/* </div> */}

                  <div className="w-full">
                    <p
                      className="mt-2 mb-2 text-[#9DC1FC] text-md cursor-pointer"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      Already have an account? Sign In
                    </p>
                  </div>
                  <div className="relative top-2 w-5/12 h-16 mt-2">
                    <button
                      type="submit"
                      className="bg-[#E6E4FD] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
                    >
                      {/* Default Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Create Account
                      </span>

                      {/* Hover Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Create Account
                      </span>
                    </button>
                  </div>
                  {error && !isLogin && (
                    <div className="text-[#2BB6DB] text-md font-semibold w-full my-2">
                      {error}
                    </div>
                  )}
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
