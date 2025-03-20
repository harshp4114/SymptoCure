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
import DiseaseAutoComplete from "../components/DiseaseAutoComplete";
import symptomsValidateSchema from "../yupValidators/symptomsValidate";
import { BASE_URL, diseaseToSpecialization } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DiseaseDisplayOverlay from "../components/DiseaseDisplayOverlay";

const DetectDisease = () => {
  useAuth();
  const token = Cookies.get("jwt-token");
  const navigate = useNavigate();
  const symptomsValidation = symptomsValidateSchema;
  const [showDisease, setShowDisease] = useState(false);
  const [disease, setDisease] = useState("");
  const [doctorSpecialization,setDoctorSpecialization]=useState("");

  // const specialization=["Biomedical Engineering & Regenerative Medicine","Pediatrics","Cardiology"];

  if (localStorage.getItem("role") !== "patient") {
    navigate("/home");
  }
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);

  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loader]);

  useEffect(() => {
    setLoader(false);
  }, []);

  // Generate initial values dynamically
  // const generateInitialValues = () => {
  //   const values = {};
  //   fields.forEach((field) => {
  //     values[field.name] = "";
  //   });
  //   return values;
  // };

  // Generate validation schema dynamically
  // const generateValidationSchema = () => {
  //   const schemaObject = {};
  //   fields.forEach((field) => {
  //     schemaObject[field.name] = Yup.string()
  //       .required("Symptom is required")
  //       .min(3, "Symptom must be at least 3 characters")
  //       .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed");
  //   });
  //   return Yup.object().shape(schemaObject);
  // };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("submit click");
      console.log("values", values);
      dispatch(showLoader());
      // Convert values object to array of symptoms
      // const symptoms = Object.values(values).filter(
      //   (symptom) => symptom.trim() !== ""
      // );


        const response = await axios.post(`${BASE_URL}/predict`, values);
        console.log("response", response);

        // const data = await response.json();
        // setPrediction(response.data.predictions);

      // const diseaseDetected="xyz";
      console.log("disease",response?.data?.predictions[0]?.disease);
      const d=response?.data?.predictions[0]?.disease;
      setDisease(d);

      // const specializationIndex=Math.floor(Math.random()*3);
      // const doctorSpecialization=specialization[specializationIndex];

      setDoctorSpecialization(diseaseToSpecialization[response?.data?.predictions[0]?.disease]);

      const decoded=jwtDecode(token);
      const patientId=decoded.id;
      console.log("disease",disease)
      // while(!disease){
      //   console.log("waiting for disease");
      // }
      const result=await axios.put(`${BASE_URL}/api/patient/symptoms/${patientId}`,{detectedDisease:d,symptoms:values.symptoms});
      console.log("result",result);
      // console.log("symptoms", symptoms);

      // console.log("Symptoms to submit:", symptoms);
      // Add your API call here
      setShowDisease(true);
      // toast.success("Symptoms submitted successfully!");
    } catch (error) {
      console.error("Error submitting symptoms:", error);
      toast.error("Failed to submit symptoms. Please try again.");
    } finally {
      dispatch(hideLoader());
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[86vh] flex justify-center items-start bg-[#403CD5]">
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
      {showDisease && (
        <DiseaseDisplayOverlay disease={disease} specialization={doctorSpecialization}/>
      )}
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
            <h1 onClick={()=>setShowDisease(true)} className="text-[4rem] leading-none font-Gilroy text-left font-bold text-white basis-full">
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
            initialValues={{
              symptoms: [],
            }}
            validationSchema={symptomsValidation}
            onSubmit={handleSubmit}
            // enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <DiseaseAutoComplete />

                <div className="w-full h-fit flex mt-4">
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
