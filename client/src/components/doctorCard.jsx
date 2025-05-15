import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = (props) => {
  //console.log(props.data)
  return (
    <Link to="/doctorInformation" state={{ doctor: props.data._id }}>
      {/* {console.log("hiiii",props.data)} */}
      <div className="w-64 h-[25rem] justify-center content-start items-start m-4 ring-[5px] ring-blue-300 hover:ring-[10px] bg-white p-0 transition-all duration-500 ease-in-out rounded-lg flex flex-wrap">
        <div className="w-full h-52">
          <div className="w-full h-full rounded-t-lg flex justify-center items-center bg-[#072965]">
            <h2 className="text-6xl text-white font-bold">
              {props?.data?.fullName?.firstName.slice(0, 1).toUpperCase() +
                props?.data?.fullName?.lastName.slice(0, 1).toUpperCase()}
            </h2>
          </div>
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
