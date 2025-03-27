import React from 'react';
import { capitalizeFirstLetter } from '../utils/constants';

const InfoCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-black/30 transition-all duration-300 flex items-center space-x-3 border border-blue-100">
      <Icon className="w-5 h-5 text-blue-600" />
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );

export default InfoCard;

