import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userLoggedin } from "../redux/slices/signInSlice";
import signUpValidateSchema from "../yupValidators/signUpValidate";
import loginValidateSchema from "../yupValidators/loginValidate";
import useAuth from "../hooks/useAuth";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { cardio } from "ldrs";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const signUpValidationSchema = signUpValidateSchema;

  const loginValidationSchema = loginValidateSchema;
  cardio.register();

  // useAuth();
  useEffect(() => {}, []);

  // Initial Values
  const LoginInitialValues = {
    email: "",
    password: "",
  };

  const SignUpInitialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };

  const handleSubmitLogin = async (values) => {
    try {
      dispatch(showLoader());
      // //console.log("Form Data:", values);
      const result = await axios.post(
        "http://localhost:5000/api/user/login/",
        values
      );
      // //console.log(result)
      const token = result.data.token;
      // //console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // //console.log(useSelector((state)=>state?.signin?.isSignedIn));
      // //console.log(Cookies.get('jwt-token'));
      //console.log("User created successfully", result);
      navigate("/home");
    } catch (error) {
      //console.log("last", error);
      setError(error.response.data.message || "Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSubmit = async (values) => {
    //console.log("Form Data:", values);
    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/",
        values
      );

      const token = result?.data?.token;
      // //console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // //console.log(Cookies.get('jwt-token'));
      // //console.log("User created successfully", result);
      navigate("/home");
    } catch (error) {
      //console.log(error);
      setError(error?.response?.data?.message || "Something went wrong");
    }
  };

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
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="password"
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

                {error != "" && (
                  <div>
                    <p className="text-[#2BB6DB] text-md font-semibold w-full my-2">{error}</p>
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
              From Symptoms to Solutions
            </h1>
            <h1 className="text-[#a0c4ff] font-Gilroy text-3xl font-semibold ml-1 mt-2">
              Get Started Today
            </h1>
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-wrap">
          <Formik
            initialValues={SignUpInitialValues}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSubmit}
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

                <Field
                  type="text"
                  name="address"
                  placeholder="Street Address*"
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                />

                <Field
                  type="text"
                  name="city"
                  placeholder="Current City*"
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="ml-2 text-[#2BB6DB] text-lg font-semibold w-full mt-2 mb-2"
                />

                <Field
                  type="text"
                  name="state"
                  placeholder="State*"
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                />

                <Field
                  type="text"
                  name="country"
                  placeholder="Country*"
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                />

                <Field
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code*"
                  className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl  my-2 p-2 w-full bg-[#232269]"
                />
                <ErrorMessage
                  name="zipCode"
                  component="div"
                  className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                />

              
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
              {error && (
                <div className="text-[#2BB6DB] text-md font-semibold w-full my-2">
                  {error}
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
