import * as Yup from "yup";

const symptomsValidateSchema = Yup.object().shape({
  symptoms: Yup
    .array()
    .min(3, "At least three symptoms are required")
    .max(14, "At most ten symtomps are allowed")
    .required("Symptoms are required"),
});

export default symptomsValidateSchema;
