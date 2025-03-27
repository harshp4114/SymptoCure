import React, { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import Cookies from "js-cookie";
import { getSocket } from "../socket";

const DoctorChatListItem = ({
  patient,
  unread,
  lastMessage,
  lastMessageTime,
  setSelectedPatient,
  setSelectedChat,
  chat,
}) => {
  const [patientData, setPatientData] = useState(patient);

  return (
    <div
      onClick={async () => {
        setSelectedPatient(patient);
        setSelectedChat(chat);
        if(chat.doctorUnreadCount>0){
          try{
            const response= await axios.put(`${BASE_URL}/api/chat/resetDoctorUnreadCount`,{chatId:chat._id},{
              headers:{
                Authorization:`Bearer ${Cookies.get("jwt-token")}`
              }
            })
            // console.log("response of doctor unreade count reset",response);
          }catch(err){
            console.log("error in update chat",err);
          }
        }
        const socket=getSocket();
        socket.emit("chat-opened-by-doctor",chat);
      }}
      className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="w-12 h-12 bg-[#16165C] flex justify-center items-center rounded-full object-cover">
        <h1 className="text-white font-TTHoves font-medium text-lg">
          {capitalizeFirstLetter(patientData?.fullName?.firstName).slice(0, 1) +
            capitalizeFirstLetter(patientData?.fullName?.lastName).slice(0, 1)}
        </h1>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">
            {capitalizeFirstLetter(patientData?.fullName?.firstName) +
              " " +
              capitalizeFirstLetter(patientData?.fullName?.lastName)}
          </h3>
          <span className="text-xs text-gray-500">
            {new Date(lastMessageTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">
            {lastMessage || "Start a conversation"}
          </p>
          {unread > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorChatListItem;
