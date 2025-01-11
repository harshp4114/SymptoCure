import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  // Validation Schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("First Name is required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const validationSchemaLogin = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Initial Values
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmitLogin = async (values) => {
    try {
      console.log("Form Data:", values);
      const result = await axios.post(
        "http://localhost:5000/api/user/login/",
        values
      );

      const token = result.data.token;
      // console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      // console.log(Cookies.get('jwt-token'));
      // console.log("User created successfully", result);
      navigate("/");
    } catch (error) {
      // console.log("last",error);
      setError(error.response.data.message || "Something went wrong");
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form Data:", values);
    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/",
        values
      );

      const token = result.data.token;
      // console.log("token",token);
      Cookies.set("jwt-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      // console.log(Cookies.get('jwt-token'));
      // console.log("User created successfully", result);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message || "Something went wrong");
    }
  };

  if (isLogin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaLogin}
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <label htmlFor="firstName" className="block text-gray-700">
              First Name
            </label>
            <Field
              type="text"
              name="firstName"
              className="border-2 border-gray-600 rounded-lg my-2 p-2 w-full bg-gray-200"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="text-red-700 text-sm font-bold my-1"
            />

            <label htmlFor="lastName" className="block text-gray-700">
              Last Name
            </label>
            <Field
              type="text"
              name="lastName"
              className="border-2 border-gray-600 rounded-lg my-2 p-2 w-full bg-gray-200"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="text-red-700 text-sm font-bold my-1"
            />

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

            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password
            </label>
            <Field
              type="password"
              name="confirmPassword"
              className="border-2 border-gray-600 rounded-lg my-2 p-2 w-full bg-gray-200"
            />
            <ErrorMessage
              name="confirmPassword"
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
      </div>
    </div>
  );
};

export default Login;
