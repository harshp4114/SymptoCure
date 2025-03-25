import React, { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import Cookies from "js-cookie";


const ChatListItem = ({patient}) => {

    const [patientData, setPatientData] = useState({});
    const dispatch=useDispatch();
    const token=Cookies.get("jwt-token");
    const getPatientData=async()=>{
        dispatch(showLoader());
        try{
            const result=await axios.get(`${BASE_URL}/api/patient/${patient}`,{
                headers:{Authorization:`Bearer ${token}`}
            });
            // console.log("patient data",result);
            setPatientData(result?.data?.data);
        }catch(error){
            console.log("error",error);
        }finally{
            dispatch(hideLoader());
        }
    }

    useEffect(()=>{
        getPatientData();
    },[])

  return (
    <div
      onClick={() => setSelectedPatient(patient)}
      className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        alt="abcd"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">{capitalizeFirstLetter(patientData?.fullName?.firstName) +" " + capitalizeFirstLetter(patientData?.fullName?.lastName)}</h3>
          <span className="text-xs text-gray-500">11:30</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">
            this is first message
          </p>
          {2 > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
