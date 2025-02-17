import React from "react";
import { Link } from "react-router-dom";
const DoctorCard = (props) => {
  //console.log(props.data)
  return (
    <Link to="/doctorInformation" state={{ doctor: props.data._id }}>
      {/* {console.log("hiiii",props.data)} */}
      <div className="w-64 h-80 justify-center cursor-pointer items-start m-4 bg-gray-300 border-2 drop-shadow-md shadow-black rounded-lg shadow-md flex flex-wrap">
        <div className="w-full h-52 mx-3 mt-3">
          <img
            src={props.image}
            className="h-full w-full rounded-lg border-2 border-black object-cover"
          ></img>
        </div>
        <div className="flex flex-wrap justify-start items-start w-full mx-3">
          <h2 className="font-bold text-md">
            {props?.data?.fullName?.firstName +
              " " +
              props?.data?.fullName.lastName}
          </h2>
          <h2 className="font-medium text-md">
            Specialization : {props?.data?.specialization}
          </h2>
          <h2 className="font-medium text-md">
            Experience : {props?.data?.experience} years
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
