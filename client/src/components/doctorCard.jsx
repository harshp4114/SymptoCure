import React from "react";
import { Link } from "react-router-dom";
const DoctorCard = (props) => {
  //console.log(props.data)
  return (
    <Link to="/doctorInformation" state={{ doctor: props.data._id }}>
      {/* {console.log("hiiii",props.data)} */}
      <div className="w-64 h-[24rem] justify-center content-start items-start m-4 ring-[5px] ring-blue-300 hover:ring-[10px] bg-white p-0 transition-all duration-500 ease-in-out rounded-lg flex flex-wrap">
        <div className="w-full h-52">
          <img
            src={props.image}
            className="h-full w-full rounded-t-lg opacity-95 object-cover"
          ></img> 
        </div>
        <div className="flex flex-wrap justify-start mt-2 items-start w-full mx-3">
          <h2 className="font-bold text-xl mb-2">
            {props?.data?.fullName?.firstName +
              " " +
              props?.data?.fullName.lastName}
          </h2>
          <h2 className="font-medium text-gray-700 text-md">
            Specialization : {props?.data?.specialization}
          </h2>
          <h2 className="font-medium text-gray-700 text-md">
            Experience : {props?.data?.experience} years
          </h2>
          <h2 className="font-medium text-gray-700 text-md">
            Workplace : {props?.data?.hospital}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
