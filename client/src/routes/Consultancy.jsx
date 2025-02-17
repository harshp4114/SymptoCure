import { useEffect, useState } from "react";
import DoctorCard from "../components/doctorCard";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedin } from "../redux/slices/signInSlice";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { BASE_URL } from "../utils/constants";
import { Search } from "lucide-react";

const Consultancy = () => {
  useAuth(); // Trigger the authentication logic (runs on mount)

  const navigate = useNavigate();
  if (localStorage.getItem("role") !== "patient") {
    navigate("/home");
  }
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const token = Cookies.get("jwt-token");
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const getDoctors = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/doctor/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(result?.data?.data);
      setFilteredDoctors(result?.data?.data); // Initialize with full list
    } catch (error) {
      //console.error("Error fetching doctors:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleChange = (e) => {
    const value = e.target.value; // Get the current input value
    setSearch(value);

    if (value === "") {
      // Reset to the full list if the search input is empty
      setFilteredDoctors(doctors);
    } else {
      // Filter doctors based on the current input
      setFilteredDoctors(
        doctors.filter((doctor) =>
          doctor.specialization.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  // dispatch(showLoader()); ADD THIS IN THE TRY OF ANY API CALL MADE TO THE BACKEND
  // dispatch(hideLoader()); ADD THIS IN THE FINALLY OF ANY API CALL MADE TO THE BACKEND

  const isAuthenticated = useSelector((state) => state.signin.isSignedIn); // Get auth state from Redux

  useEffect(() => {
    if (loader) return;
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if the patient is not authenticated
    }
    getDoctors();
  }, [isAuthenticated, loader]); // Add dependencies to avoid unnecessary re-renders

  useEffect(() => {
    setLoader(false);
  }, []);

  return (
    <div className="absolute w-full h-fit bg-[#403CD5] p-4 pb-16">
      <div className="w-full h-fit flex flex-wrap items-center justify-start px-10  pb-4 ">
        <div className="w-1/2">
          <h2 className="text-4xl mb-6 w-full transition-all duration-700 font-Gilroy font-extrabold mr-4 text-white">
            Find Your Trusted Health Specialist
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
            <input
              type="text"
              value={search}
              onChange={handleChange}
              className="w-96 h-14 pl-12 pr-4 rounded-2xl shadow-lg hover:bg-blue-200 focus:bg-blue-200 focus:outline-none focus:ring-8 focus:ring-blue-900
            border-none bg-blue-50 text-gray-800 placeholder-gray-600 hover:ring-8 hover:ring-blue-900
            transition-all duration-700 ease-in-out text-lg"
              placeholder="Pediatrics, Cardiology, Etc."
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-blue-50 hover:ring-8 cursor-default ring-blue-900 transition-all duration-700 ease-in-out rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {doctors.length}
              </div>
              <div className="text-gray-600">Available Doctors</div>
            </div>
            <div className="bg-blue-50 hover:ring-8 cursor-default ring-blue-900 transition-all duration-700 ease-in-out rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                {new Set(doctors.map((d) => d.specialization)).size}
              </div>
              <div className="text-gray-600">Specializations</div>
            </div>
            <div className="bg-blue-50 hover:ring-8 cursor-default ring-blue-900 transition-all duration-700 ease-in-out rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap h-full px-9">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor._id} data={doctor} image="./d2.jpeg" />
        ))}
      </div>
    </div>
  );
};

export default Consultancy;
