import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Search,
  CheckCheck,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/slices/loadingSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, capitalizeFirstLetter } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import PatientChatListItem from "./PatientChatListItem";

const PatientChatInterface = () => {
  const location = useLocation();
  const chatContainerRef = useRef(null);
  const [selectedDoctor, setSelectedDoctor] = useState(
    location?.state?.userData || null
  );
  const [selectedChat, setSelectedChat] = useState(
    location?.state?.chat || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const token = Cookies.get("jwt-token");
  const decoded = jwtDecode(token);
  // console.log("decoded",decoded);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  //   const [filteredPatients,setFilteredPatients]=useState([]);

  useEffect(() => {
    getChats();
  }, [selectedDoctor, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      getMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessages = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`
      );
      // console.log("messages", result);
      setMessages(result?.data?.data);
    } catch (err) {
      console.log("error in get messages", err);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getChats = async () => {
    dispatch(showLoader());
    try {
      const result = await axios.get(`${BASE_URL}/api/chat/chatsByPatientId`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("all chats", result);
      setChats(result?.data?.data);
      setFilteredChats(result?.data?.data);
    } catch (error) {
      console.log("error in chat interface", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setFilteredChats(
      filteredChats.filter((chat) => {
        const fullName =
          chat.patientId.fullName.firstName +
          " " +
          chat.patientId.fullName.lastName;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [searchQuery]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDoctor) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/message/`, {
        chatId: selectedChat._id,
        senderId: decoded.id,
        senderModel: "Doctor",
        receiverId: selectedDoctor._id,
        receiverModel: "Patient",
        text: newMessage.trim(),
      });
      console.log("response in send message", response);
      if (response?.data?.success) {
        const response2 = await axios.put(
          `${BASE_URL}/api/chat/updateLastMessage`,
          {
            chatId: selectedChat._id,
            lastMessage: response?.data?.data?.text,
            lastMessageTime: response?.data?.data?.createdAt,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("chat lastmessage update", response2);
      }
      setNewMessage("");
      getMessages();
    } catch (err) {
      console.log("error in sending message", err);
    }
  };

  return (
    <div className="w-full h-full bg-white">
      <div
        className={`w-full h-full flex flex-col ${
          selectedDoctor ? "hidden" : "block"
        }`}
      >
        <div className="p-4 pt-0 pb-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFilteredChats(chats);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <PatientChatListItem
              key={chat._id}
              patient={chat.doctorId}
              chat={chat}
              unread={chat.unreadCount}
              lastMessage={chat.lastMessage}
              lastMessageTime={chat.lastMessageTime}
              setSelectedDoctor={setSelectedDoctor}
              setSelectedChat={setSelectedChat}
            />
          ))}
        </div>
      </div>
      {selectedDoctor && (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button
              onClick={() => {
                setSelectedDoctor(null);
                setSelectedChat(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-12 h-12 bg-[#16165C] flex justify-center items-center rounded-full object-cover">
              <h1 className="text-white font-TTHoves font-medium text-lg">
                {capitalizeFirstLetter(
                  selectedDoctor?.fullName?.firstName
                ).slice(0, 1) +
                  capitalizeFirstLetter(
                    selectedDoctor?.fullName?.lastName
                  ).slice(0, 1)}
              </h1>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-800">
                {capitalizeFirstLetter(selectedDoctor.fullName.firstName) +
                  " " +
                  capitalizeFirstLetter(selectedDoctor.fullName.lastName)}
              </h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderModel === "Doctor"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderModel === "Doctor"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-75">
                      {new Date(message.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {message.senderModel === "Doctor" && (
                      <CheckCheck className="w-4 h-4 opacity-75" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="h-full w-full flex justify-center items-center">
                <h1 className="text-2xl text-gray-500 font-TTHoves font-medium">
                  No messages yet
                </h1>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200"
          >
            <div className="flex items-center space-x-2 h-16 bg-gray-100  rounded-lg p-2 pr-4">
              {/* <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button> */}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:outline-none p-2"
              />
              <button
                type="submit"
                className="p-2  bg-blue-500 h-10 w-10 text-white flex justify-center items-center rounded-full hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientChatInterface;
