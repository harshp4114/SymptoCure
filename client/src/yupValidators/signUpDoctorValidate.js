import * as Yup from "yup";

const SignUpDoctorValidate = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name can't be longer than 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name can't be longer than 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters") // Matches Mongoose schema minlength
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  specialization: Yup.string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization can't be longer than 100 characters")
    .required("Specialization is required"),

  qualifications: Yup.string()
    .min(2, "Each qualification must be at least 2 characters")
    .min(1, "At least one qualification is required")
    .required("Qualifications are required"),

  experience: Yup.number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot be more than 50 years")
    .required("Experience is required"),

  hospital: Yup.string()
    .min(2, "Hospital name must be at least 2 characters")
    .max(100, "Hospital name can't be longer than 100 characters")
    .required("Hospital is required"),
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

export default SignUpDoctorValidate;
