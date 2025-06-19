import * as Yup from "yup";

// Validation Schema

export const signUpUserStep1ValidateSchema = Yup.object({
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
    .min(6, "Password must be at least 6 characters") // Matches Mongoose schema minlength
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits") // Adjust if country-specific
    .required("Phone number is required"),
  age: Yup.number()
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .required("Age is required"),
  gender: Yup.string()
    .oneOf(
      ["Male", "Female", "Other", "male", "female", "other"],
      "Invalid gender selection"
    )
    .required("Gender is required"),
});

export const signUpUserStep2ValidateSchema = Yup.object({
  city: Yup.string()
    .max(50, "City must be 50 characters or less")
    .required("City is required"),
  state: Yup.string()
    .required("State is required"),
  country: Yup.string()
    .required("Country is required"),
  zipCode: Yup.string()
    .required("Zip Code is required"),
});