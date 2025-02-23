import * as Yup from "yup";

// Validation Schema
const editUserValidationSchema = Yup.object({
  firstName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("First name is required"),
  lastName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"), // Adjust if country-specific
  age: Yup.number()
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .required("Age is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other", "male", "female", "other"], "Invalid gender selection")
    .required("Gender is required"),
  city: Yup.string()
    .max(50, "City must be 50 characters or less")
    .required("City is required"),
});

export default editUserValidationSchema;
