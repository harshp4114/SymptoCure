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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const signUpValidationSchema = signUpValidateSchema;

  const loginValidationSchema = loginValidateSchema;

  // useAuth();
  useEffect(()=>{
  },[]);

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
      // console.log("Form Data:", values);
      const result = await axios.post(
        "http://localhost:5000/api/user/login/",
        values
      );
      // console.log(result)
      const token = result.data.token;
      // console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // console.log(useSelector((state)=>state?.signin?.isSignedIn));
      // console.log(Cookies.get('jwt-token'));
      console.log("User created successfully", result);
      navigate("/home");
    } catch (error) {
      console.log("last", error);
      setError(error.response.data.message || "Something went wrong");
    }finally{
      dispatch(hideLoader());
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form Data:", values);
    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/",
        values
      );

      const token = result?.data?.token;
      // console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      dispatch(userLoggedin());
      // console.log(Cookies.get('jwt-token'));
      // console.log("User created successfully", result);
      navigate("/home");
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (isLogin) {
    return (
      <div className="flex justify-center w-full h-full items-center mx-auto min-h-screen absolute mt-24 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h1>
          <Formik
            initialValues={LoginInitialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmitLogin}
          >
            <Form>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="border-2 border-gray-600 rounded-lg my-2 p-2 w-full bg-gray-200"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-700 text-sm font-bold my-1"
              />

              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="border-2 border-gray-600 rounded-lg my-2 p-2 w-full bg-gray-200"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-700 text-sm font-bold my-1"
              />

              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-600 transition"
              >
                Submit
              </button>
              {error != "" && (
                <div>
                  <p className="my-2 text-red-500 font-bold">{error}</p>
                </div>
              )}
            </Form>
          </Formik>

          <div>
            <p
              className="mt-4 text-gray-700 cursor-pointer"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              Don't have an account? Sign Up
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center absolute mt-24 bg-gray-100 py-8 px-4">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h1>

        <Formik
          initialValues={SignUpInitialValues}
          validationSchema={signUpValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Field
                  type="text"
                  name="firstName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Field
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Field
                  type="number"
                  name="phone"
                  className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <Field
                  type="number"
                  name="age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="age"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender ( Male / Female / Other )
                </label>
                <Field
                  type="text"
                  name="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Address Information
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-2 space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <Field
                    type="text"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <Field
                    type="text"
                    name="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <Field
                    type="text"
                    name="state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <Field
                    type="text"
                    name="country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code
                  </label>
                  <Field
                    type="text"
                    name="zipCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="zipCode"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Create Account
            </button>
          </Form>
        </Formik>

        <div className="text-center mt-6">
          <p
            className="text-gray-600 hover:text-blue-600 cursor-pointer transition duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            Already have an account? Sign In
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
