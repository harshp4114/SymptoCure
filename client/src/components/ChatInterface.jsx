import React, { useEffect, useState } from 'react';
import { Send, Paperclip, Search, CheckCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/slices/loadingSlice';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../utils/constants';
import ChatListItem from './ChatListItem';


const ChatInterface = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const dispatch=useDispatch();
  const token=Cookies.get("jwt-token");
  const [patients,setPatients]=useState([]);
//   const [filteredPatients,setFilteredPatients]=useState([]);
  const Patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thank you doctor, I understand now',
      time: '10:45 AM',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      messages: [
        { id: 1, sender: 'patient', text: 'Hello Dr. Smith, I have a question about my prescription', time: '10:30 AM', status: 'read' },
        { id: 2, sender: 'doctor', text: "Of course, I'm happy to help. What would you like to know?", time: '10:32 AM', status: 'read' },
        { id: 3, sender: 'patient', text: 'Should I take the medication with food or on an empty stomach?', time: '10:33 AM', status: 'read' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      lastMessage: 'When is my next appointment?',
      time: '9:30 AM',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      messages: [
        { id: 1, sender: 'patient', text: 'Hi doctor, I wanted to check about my next appointment', time: '9:28 AM', status: 'read' },
        { id: 2, sender: 'patient', text: 'When is my next appointment?', time: '9:30 AM', status: 'unread' }
      ]
    }
  ];

  useEffect(()=>{
    getPatients();
  },[])

  const getPatients=async ()=>{
    dispatch(showLoader());
    try{
        const result = await axios.get(`${BASE_URL}/api/appointment/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        //   console.log("all patients",result);
          setPatients(result?.data?.data);
          
    }catch(error){
        console.log("error",error);
    }finally{
        dispatch(hideLoader());
    }
  }

  const filteredPatients = Patients.filter(patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatient) return;

    const message = {
      id: selectedPatient.messages.length + 1,
      sender: 'doctor',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedPatient = { ...selectedPatient, messages: [...selectedPatient.messages, message], lastMessage: newMessage, time: message.time };
    setSelectedPatient(updatedPatient);
    setNewMessage('');
  };

  return (
    <div className="w-full h-full bg-white">
      <div className={`w-full h-full flex flex-col ${selectedPatient ? 'hidden' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chats</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {patients.map((patient) => (
            <ChatListItem key={patient._id} patient={patient.userId}/>
          ))}
        </div>
      </div>
      {selectedPatient && (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-4">
              <h2 className="font-semibold text-gray-800">{selectedPatient.name}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedPatient.messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'doctor' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-75">{message.time}</span>
                    {message.sender === 'doctor' && <CheckCheck className="w-4 h-4 opacity-75" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
              <button type="button" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 bg-transparent border-none focus:outline-none p-2" />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
