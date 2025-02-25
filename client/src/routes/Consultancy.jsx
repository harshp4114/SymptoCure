import { useEffect, useState } from "react";
import DoctorCard from "../components/doctorCard";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { BASE_URL } from "../utils/constants";
import { Search } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Consultancy = () => {
  useAuth(); // Ensure user is authenticated

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");

  // Get authentication state
  const isAuthenticated = useSelector((state) => state.signin.isSignedIn);

  // Ensure only patients can access
  useEffect(() => {
    if (localStorage.getItem("role") !== "patient") {
      navigate("/home");
    }
  }, [navigate]);

  // Retrieve values from location.state (if available)
  const { specialization } = location.state ;

  console.log("spiepojch",specialization);

  // States
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState(specialization || ""); // Set specialization only once
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loader, setLoader] = useState(true);

  // Fetch doctors
  const getDoctors = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/doctor/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allDoctors = result?.data?.data || [];
      setDoctors(allDoctors);

      // Automatically filter doctors based on specialization (if provided)
      if (specialization) {
        const filtered = allDoctors.filter((doctor) =>
          doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
        );
        setFilteredDoctors(filtered);
      } else {
        setFilteredDoctors(allDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Handle input change for search
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Filter doctors dynamically
    setFilteredDoctors(
      value
        ? doctors.filter((doctor) =>
            doctor.specialization.toLowerCase().includes(value.toLowerCase())
          )
        : doctors
    );
  };

  // Ensure the user is authenticated before fetching doctors
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    setLoader(false);
    getDoctors();
    console.log(filteredDoctors);
  }, [isAuthenticated, navigate]); // Only runs when authentication state changes

  return (
    <div className="absolute w-full h-fit bg-[#403CD5] p-4 pb-16">
      <div className="w-full h-fit flex flex-wrap items-center justify-start px-10 pb-4">
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
              <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap h-full px-9">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} data={doctor} image="./d2.jpeg" />
          ))
        ) : (
          <div className="text-white text-xl mt-6">No doctors found.</div>
        )}
      </div>
    </div>
  );
};

export default Consultancy;
