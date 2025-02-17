import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import "react-toastify/dist/ReactToastify.css";

const DetectDisease = () => {
  useAuth();
  const token = Cookies.get("jwt-token");
  const navigate = useNavigate();

  if(localStorage.getItem("role")!=="patient"){
    navigate("/home"); 
   }
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);
  const symptomsAuto = [
    "Fever",
    "Cough",
    "Shortness of breath",
    "Tiredness",
    "Aches and pains",
    "Sore throat",
    "Diarrhoea",
    "Conjunctivitis",
    "Headache",
    "Loss of taste or smell",
    "A rash on skin, or discolouration of fingers or toes",
    "Difficulty breathing or shortness of breath",
    "Chest pain or pressure",
    "Loss of speech or movement",
  ];
  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loader]);

  useEffect(() => {
    setLoader(false);
  }, []);

  const [fields, setFields] = useState(() => {
    const savedFields = localStorage.getItem("symptomFields");
    return savedFields
      ? JSON.parse(savedFields)
      : [
          { type: "text", name: "field1", placeholder: "Symptom 1*" },
          { type: "text", name: "field2", placeholder: "Symptom 2*" },
          { type: "text", name: "field3", placeholder: "Symptom 3*" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("symptomFields", JSON.stringify(fields));
  }, [fields]);

  // Generate initial values dynamically
  const generateInitialValues = () => {
    const values = {};
    fields.forEach((field) => {
      values[field.name] = "";
    });
    return values;
  };

  // Generate validation schema dynamically
  const generateValidationSchema = () => {
    const schemaObject = {};
    fields.forEach((field) => {
      schemaObject[field.name] = Yup.string()
        .required("Symptom is required")
        .min(3, "Symptom must be at least 3 characters")
        .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed");
    });
    return Yup.object().shape(schemaObject);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(showLoader());
      // Convert values object to array of symptoms
      const symptoms = Object.values(values).filter(
        (symptom) => symptom.trim() !== ""
      );

      // console.log("Symptoms to submit:", symptoms);
      // Add your API call here

      toast.success("Symptoms submitted successfully!");
    } catch (error) {
      // console.error("Error submitting symptoms:", error);
      toast.error("Failed to submit symptoms. Please try again.");
    } finally {
      dispatch(hideLoader());
      setSubmitting(false);
    }
  };

  const updateFieldNumbers = (fieldArray) => {
    return fieldArray.map((field, index) => ({
      ...field,
      name: `field${index + 1}`,
      placeholder: `Symptom ${index + 1}*`,
    }));
  };

  const removeField = (index) => {
    if (fields.length <= 3) {
      toast.error("Minimum 3 symptoms are required!");
      return;
    }

    setFields((prevFields) => {
      const newFields = prevFields.filter((_, i) => i !== index);
      return updateFieldNumbers(newFields);
    });
  };

  const addField = () => {
    setFields((prevFields) => {
      const newFields = [
        ...prevFields,
        {
          type: "text",
          name: `field${prevFields.length + 1}`,
          placeholder: `Symptom ${prevFields.length + 1}*`,
        },
      ];
      return newFields;
    });
  };

  return (
    <div className="w-full h-full flex justify-center items-start bg-[#403CD5]">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-9/12 h-fit min-h-[73%] bg-[#16165C] rounded-3xl flex justify-center mt-6 items-start px-10 py-10">
        <div className="w-[40%] h-full flex flex-wrap content-start mr-10 items-start">
          <div className="w-40 flex h-24 item-center ml-3">
            <l-cardio
              size="110"
              stroke="6"
              speed="1.9"
              color="white"
            ></l-cardio>
          </div>
          <div className="basis-full flex flex-wrap">
            <h1 className="text-[4rem] leading-none font-Gilroy text-left font-bold text-white basis-full">
              Don't Guess,
            </h1>
            <h1 className="text-[4rem] leading-none font-Gilroy font-semibold text-left text-white basis-full">
              Let's Diagnose
            </h1>
            <h1 className="text-[4rem] leading-none font-Gilroy font-semibold text-left mb-8 text-white basis-full">
              Together.
            </h1>
          </div>
          <div className="w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#4B48D1] to-transparent my-4"></div>
          <div>
            <h1 className="text-[#a0c4ff] font-Gilroy text-2xl font-semibold ml-1 mt-4">
              Input Your Symptoms to Discover What They Might Be Telling You!
            </h1>
          </div>
        </div>
        <div className="w-[58%] h-full">
          <Formik
            initialValues={generateInitialValues()}
            validationSchema={generateValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="grid grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="relative">
                        <Field
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          placeholder={field.placeholder}
                          className="border-[1px] border-opacity-45 h-16 px-6 py-4 text-2xl text-[#9dc1fc] placeholder-[#9dc1fc] font-semibold outline-none font-Gilroy border-[#9DC1FC] rounded-xl p-2 w-full bg-[#232269]"
                        />
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="absolute top-1/2 right-1 transform -translate-y-1/2 mr-1 text-[#9DC1FC] p-2 rounded-full transition-all duration-300 hover:scale-110 group"
                        >
                          <Trash2
                            size={20}
                            className="group-hover:rotate-12 transition-transform duration-300"
                          />
                        </button>
                      </div>
                      <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-[#2BB6DB] text-md font-semibold w-full my-2"
                        />
                    </div>
                  ))}
                </div>

                <div className="w-full h-fit flex mt-10">
                  <div className="w-4/12 h-16 mr-6">
                    <button
                      type="button"
                      onClick={addField}
                      className="bg-[#E6E4FD] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Add Field
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Add Field
                      </span>
                    </button>
                  </div>

                  <div className="w-5/12 h-16">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#E6E4FD] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        {isSubmitting ? "Submitting..." : "Submit Symptoms"}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        {isSubmitting ? "Submitting..." : "Submit Symptoms"}
                      </span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default DetectDisease;

