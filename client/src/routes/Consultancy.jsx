import { useEffect, useState } from "react";
import DoctorCard from "../components/doctorCard";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userLoggedin, userLoggedout } from "../redux/slices/signInSlice";

const Consultancy = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const token = Cookies.get("jwt-token");
  const dispatch=useDispatch();

  const getDoctors = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/doctor/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(result?.data?.data);
      setFilteredDoctors(result?.data?.data); // Initialize with full list
    } catch (error) {
      console.error("Error fetching doctors:", error);
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

  useEffect(() => {
    if(Cookies.get("jwt-token")){
          dispatch(userLoggedin());
        }else{
          dispatch(userLoggedout());
          navigate("/login");
        }
    getDoctors();
  }, []);

  return (
    <div className="absolute mt-24 w-full h-[96.5vh] bg-slate-800">
      <div className="w-full h-32 flex items-center justify-center space-x-6">
        <h2 className="text-2xl font-FiraCode font-extrabold text-white">
          Search Doctors :{" "}
        </h2>
        <input
          type="text"
          value={search}
          onChange={handleChange}
          className="h-12 w-3/12 bg-gray-200 rounded-xl cursor-default text-lg text-black font-semibold p-2 px-3"
          placeholder="Pediatrics, Cardiology, Etc."
        />
      </div>
      <div className="w-full flex flex-wrap h-full">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor._id} data={doctor} image="./d2.jpeg" />
        ))}
      </div>
    </div>
  );
};

export default Consultancy;
